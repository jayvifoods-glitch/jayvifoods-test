-- =====================================================================
-- Jayvi Foods — Migration: Categories & Meal Tags → Supabase (V32.10)
-- Apply AFTER supabase_schema_phase1_v3.sql (uses public.is_admin()
-- from that file) and AFTER supabase_migration_product_catalog.sql
-- (not a hard dependency, just the natural order — this migration
-- does not reference products/combos/product_media at all).
--
-- Scope: makes Supabase the single source of truth for Categories and
-- Meal Tags — the last two pieces of the catalogue that were still
-- per-browser localStorage (`jayviStoreV14` in app.js / CONFIG_FALLBACK
-- in admin.js). Mirrors the exact same pattern already used for
-- products/combos in supabase_migration_product_catalog.sql: a plain
-- table, public reads active/enabled rows, only Admin writes.
--
-- Does NOT touch: products, combos, product_media, orders, customers,
-- auth, cart, checkout, payments, PIN/serviceability, notifications,
-- or store settings/announcements/reviews (those remain local/
-- unchanged — a deliberate, separate scope boundary, same as before).
--
-- SAFE TO RE-RUN: table creation uses `if not exists`; the seed step
-- uses `on conflict (id) do update`, so re-running this file updates
-- existing rows back to the seed values rather than duplicating them
-- — see the IMPORTANT note before the seed section for what that
-- means in practice if you've already made Admin edits.
--
-- Run once in the Supabase SQL Editor, top to bottom.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. categories
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id             text primary key,             -- e.g. 'chutney' (matches existing category ids)
  name           text not null,
  enabled        boolean not null default true,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
comment on table public.categories is 'Product category list. Replaces per-browser localStorage categories array.';

-- ---------------------------------------------------------------------
-- 2. meal_tags
-- ---------------------------------------------------------------------
create table if not exists public.meal_tags (
  id             text primary key,             -- e.g. 'idli' (matches existing meal tag ids)
  name           text not null,
  enabled        boolean not null default true,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
comment on table public.meal_tags is 'Meal-tag list (used by product setup and the storefront "Made for every meal" section). Replaces per-browser localStorage mealTags array.';

create index if not exists idx_categories_enabled on public.categories(enabled, display_order);
create index if not exists idx_meal_tags_enabled on public.meal_tags(enabled, display_order);

-- Reuses the same set_updated_at() trigger function created by
-- supabase_migration_product_catalog.sql. `create or replace` here
-- too so this file has no hard ordering dependency on that one.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists trg_meal_tags_updated_at on public.meal_tags;
create trigger trg_meal_tags_updated_at before update on public.meal_tags
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 3. Row Level Security — identical pattern to products/combos:
--    public reads enabled rows only; only Admin can write.
-- ---------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.meal_tags enable row level security;

revoke all on public.categories from anon, authenticated;
revoke all on public.meal_tags from anon, authenticated;

grant select on public.categories, public.meal_tags to anon, authenticated;
grant insert, update, delete on public.categories, public.meal_tags to authenticated; -- narrowed to admin-only by policies below

create policy "categories: public reads enabled" on public.categories
  for select using (enabled = true);
create policy "categories: admin reads all" on public.categories
  for select using (public.is_admin());
create policy "categories: admin writes" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "meal_tags: public reads enabled" on public.meal_tags
  for select using (enabled = true);
create policy "meal_tags: admin reads all" on public.meal_tags
  for select using (public.is_admin());
create policy "meal_tags: admin writes" on public.meal_tags
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- 4. One-time data migration — seeds Supabase from the categories/meal
--    tags that are currently canonical inside app.js's EMBEDDED_CONFIG
--    (admin.js's CONFIG_FALLBACK has the identical arrays — verified
--    against source before writing this), so nothing already live is
--    lost.
--
-- IMPORTANT — re-run behavior, read before re-running:
-- This uses `on conflict (id) do update`, matching the seed style
-- already used for products/combos. That means:
--   - Running this ONCE on a fresh project: seeds exactly these rows.
--   - Running it AGAIN after Admin has since edited/added/deleted
--     categories or meal tags in Supabase: any row with one of THESE
--     SPECIFIC ids (chutney/pudi/snacks/combos,
--     idli/dosa/chapati/rice/roti/paratha/poori/upma/vada/curd-rice)
--     gets its name/enabled/display_order OVERWRITTEN back to the
--     values below — Admin edits to THOSE particular rows would be
--     lost. It does NOT delete or touch any category/meal tag Admin
--     added with a DIFFERENT id, and it never touches products,
--     combos, or anything else.
-- Bottom line: safe to re-run on a project that hasn't had Admin
-- edits yet (idempotent no-op in that case); if Admin has already
-- edited one of the specific rows below, re-running will reset that
-- one row's name/enabled/order back to this seed. When in doubt,
-- skip re-running this section and only run it once, on first
-- deployment of this migration.
-- =====================================================================

insert into public.categories (id, name, enabled, display_order) values
  ('chutney','Chutney Powders',true,1),
  ('pudi','Pudi',true,2),
  ('snacks','Snacks',true,3),
  ('combos','Combos',true,4)
on conflict (id) do update set
  name=excluded.name, enabled=excluded.enabled, display_order=excluded.display_order;

insert into public.meal_tags (id, name, enabled, display_order) values
  ('idli','Idli',true,1),
  ('dosa','Dosa',true,2),
  ('chapati','Chapati',true,3),
  ('rice','Rice + Ghee',true,4),
  ('roti','Roti',true,5),
  ('paratha','Paratha',true,6),
  ('poori','Poori',true,7),
  ('upma','Upma',true,8),
  ('vada','Vada',true,9),
  ('curd-rice','Curd Rice',true,10)
on conflict (id) do update set
  name=excluded.name, enabled=excluded.enabled, display_order=excluded.display_order;

-- =====================================================================
-- Verify:
--   select id, name, enabled, display_order from public.categories order by display_order;
--   select id, name, enabled, display_order from public.meal_tags order by display_order;
-- Expected: 4 categories (chutney, pudi, snacks, combos), 10 meal tags
-- (idli, dosa, chapati, rice, roti, paratha, poori, upma, vada,
-- curd-rice), matching what was previously in EMBEDDED_CONFIG/
-- CONFIG_FALLBACK.
-- =====================================================================
