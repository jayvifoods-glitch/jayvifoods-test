-- =====================================================================
-- Jayvi Foods — Migration: V32.3
--
-- Apply AFTER every existing supabase_migration_*.sql in this project,
-- in particular after supabase_migration_settings_announcements_reviews.sql
-- and supabase_migration_v32_12_1.sql (both create/alter public.announcements
-- and the announcement-media Storage bucket that this file builds on).
--
-- Every statement below is either `create or replace` (safe to re-run),
-- guarded with `if not exists` / `if exists` (safe to re-run, no-ops if
-- already applied), or an `update` that is intentionally idempotent
-- (re-running it recomputes the same derived value, it never
-- overwrites anything Admin has since changed by hand). Nothing here
-- drops a table, drops a column, or deletes existing rows.
--
-- Covers, from the V32.3 requirements:
--   §3   — General vs Product announcement: adds the explicit
--          `announcement_type` ('general' | 'product') and
--          `target_type` ('product' | 'combo') columns to
--          public.announcements, decoupled from the pre-existing
--          `action_type`/`action_target` click-action columns (those
--          two concepts were being conflated — see CHANGELOG_V32.3.md).
--   §5   — Announcement media: no new columns needed — media_type/
--          poster_url already exist (added in v32_12_1) and already
--          enforce "one media item" simply by being single columns,
--          not a child table. Reviewed per the brief's instruction not
--          to add anything unnecessarily.
--   §6   — Announcement deletion: no schema change needed — DELETE on
--          public.announcements already removes the row; Storage
--          object cleanup is handled in admin.js at delete time
--          (see cleanupAnnouncementMedia()), same philosophy as
--          product/combo media cleanup.
--   §11-18 — Gallery: new public.gallery_media table + a dedicated
--          `gallery-media` Storage bucket (checked against existing
--          buckets first — no duplicate bucket is created).
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Announcements — explicit General/Product typing (spec 3).
--
--    announcement_type: 'general' (no product/combo association
--    required) or 'product' (must reference exactly one of
--    product_id/combo_id — the existing columns are reused as-is,
--    per the brief's instruction to reuse existing schema rather than
--    duplicate it).
--
--    target_type: which of product_id/combo_id is the live one when
--    announcement_type = 'product'. Only meaningful in that case;
--    left as-is (usually null) for general announcements.
-- ---------------------------------------------------------------------
alter table public.announcements add column if not exists announcement_type text not null default 'general';
alter table public.announcements add column if not exists target_type text; -- 'product' | 'combo', only set when announcement_type = 'product'

comment on column public.announcements.announcement_type is 'V32.3: "general" (no product association) or "product" (explicit product/combo association via product_id/combo_id + target_type). Distinct from action_type/action_target, which is only the CLICK destination for a general announcement''s optional CTA.';
comment on column public.announcements.target_type is 'V32.3: which column carries the association when announcement_type=''product'' — ''product'' (product_id) or ''combo'' (combo_id).';

-- Backfill existing rows (idempotent — safe to re-run): every
-- announcement seeded before this release already had a product_id or
-- combo_id set as its click target, which under the new model IS a
-- product/combo association, so it becomes announcement_type='product'
-- automatically. Anything with neither becomes 'general'. This only
-- ever recomputes the same result from the same source columns — it
-- can never overwrite a value Admin has deliberately changed via the
-- new V32.3 Admin UI, because that UI itself always writes a value
-- consistent with product_id/combo_id (see saveAnnouncement() in admin.js).
update public.announcements
  set announcement_type = 'product', target_type = 'product'
  where product_id is not null and combo_id is null and announcement_type = 'general';
update public.announcements
  set announcement_type = 'product', target_type = 'combo'
  where combo_id is not null and product_id is null and announcement_type = 'general';
-- Belt-and-braces: if both happened to be set on some historical row,
-- prefer product_id (matches how the old actionType='product' UI
-- always cleared comboId, and vice versa — see the superseded
-- announcementForm()/saveAnnouncement() this replaces).
update public.announcements
  set announcement_type = 'product', target_type = 'product', combo_id = null
  where product_id is not null and combo_id is not null and target_type is null;

alter table public.announcements drop constraint if exists chk_announcement_type;
alter table public.announcements add constraint chk_announcement_type
  check (announcement_type in ('general','product'));

alter table public.announcements drop constraint if exists chk_announcement_target_type;
alter table public.announcements add constraint chk_announcement_target_type
  check (target_type is null or target_type in ('product','combo'));

-- A "product" announcement must carry exactly one association; a
-- "general" one must carry none — enforced at the database level so a
-- direct API call can't create the same inconsistent state the old
-- single-form UI could.
alter table public.announcements drop constraint if exists chk_announcement_product_assoc;
alter table public.announcements add constraint chk_announcement_product_assoc
  check (
    (announcement_type = 'general' and product_id is null and combo_id is null)
    or
    (announcement_type = 'product' and (
      (target_type = 'product' and product_id is not null and combo_id is null)
      or
      (target_type = 'combo' and combo_id is not null and product_id is null)
    ))
  );

create index if not exists idx_announcements_type on public.announcements(announcement_type);


-- ---------------------------------------------------------------------
-- 2. Gallery — new admin-managed, Supabase-backed customer gallery
--    (spec 11-18), replacing the Git/manifest.json-based brand gallery
--    (images/gallery/ + generate-gallery-manifest.js). Reviewed the
--    existing package first: `images/gallery/manifest.json` is already
--    an empty array ([]) and no other gallery table/bucket exists in
--    any prior migration — there is nothing to migrate and no
--    duplicate infrastructure risk in adding this fresh.
-- ---------------------------------------------------------------------
create table if not exists public.gallery_media (
  id             uuid primary key default gen_random_uuid(),
  media_type     text not null default 'image', -- 'image' | 'video'
  media_url      text not null,
  poster_url     text not null default '',       -- video poster/thumbnail, mirrors product_media/announcements
  caption        text not null default '',
  display_order  integer not null default 0,
  active          boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint chk_gallery_media_type check (media_type in ('image','video'))
);
comment on table public.gallery_media is 'V32.3: Admin-managed customer-facing gallery (customer photos, food/menu/festival/brand photos). Supabase Storage-backed, replaces the Git/manifest.json brand gallery. Independent of product_media/announcements.';

create index if not exists idx_gallery_media_active_order on public.gallery_media(active, display_order);

drop trigger if exists trg_gallery_media_updated_at on public.gallery_media;
create trigger trg_gallery_media_updated_at before update on public.gallery_media
  for each row execute function public.set_updated_at(); -- reuses the function defined in supabase_migration_settings_announcements_reviews.sql

-- RLS — same public-reads-active / admin-reads-and-writes-all shape as
-- announcements/curated_reviews.
alter table public.gallery_media enable row level security;
revoke all on public.gallery_media from anon, authenticated;
grant select on public.gallery_media to anon, authenticated;
grant insert, update, delete on public.gallery_media to authenticated; -- narrowed to admin-only by policies below

drop policy if exists "gallery_media: public reads active" on public.gallery_media;
create policy "gallery_media: public reads active" on public.gallery_media
  for select using (active = true);
drop policy if exists "gallery_media: admin reads all" on public.gallery_media;
create policy "gallery_media: admin reads all" on public.gallery_media
  for select using (public.is_admin());
drop policy if exists "gallery_media: admin writes" on public.gallery_media;
create policy "gallery_media: admin writes" on public.gallery_media
  for all using (public.is_admin()) with check (public.is_admin());

-- Storage bucket for gallery media — checked against existing buckets
-- first (product-media, announcement-media already exist; no
-- pre-existing 'gallery-media' or similar bucket was found in any
-- prior migration file). Public-read (gallery images/videos are meant
-- to be publicly visible on the storefront), authenticated admin
-- write — mirrors announcement-media's policy shape exactly.
insert into storage.buckets (id, name, public)
  values ('gallery-media','gallery-media', true)
  on conflict (id) do nothing;

drop policy if exists "gallery-media public read" on storage.objects;
create policy "gallery-media public read" on storage.objects
  for select using (bucket_id = 'gallery-media');

drop policy if exists "gallery-media admin write" on storage.objects;
create policy "gallery-media admin write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'gallery-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "gallery-media admin update" on storage.objects;
create policy "gallery-media admin update" on storage.objects
  for update to authenticated using (
    bucket_id = 'gallery-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "gallery-media admin delete" on storage.objects;
create policy "gallery-media admin delete" on storage.objects
  for delete to authenticated using (
    bucket_id = 'gallery-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================================
-- Requires live Supabase testing (cannot be verified offline):
--   - The backfill UPDATEs above against your real, existing
--     announcements rows (h1/h2/h3 and anything Admin has added since).
--   - The new chk_announcement_product_assoc constraint against real
--     data — if it fails to apply, some existing row has an
--     inconsistent product_id/combo_id/target_type combination; the
--     backfill step immediately above is designed to prevent that, but
--     verify with the query below before assuming this migration is
--     fully applied.
--   - gallery-media bucket/policies actually allowing upload + public
--     read end to end.
--
-- Verify after applying:
--   select id, announcement_type, target_type, product_id, combo_id
--     from public.announcements order by display_order;
--   select id, public from storage.buckets where id = 'gallery-media';
--   select count(*) from public.gallery_media;
-- =====================================================================
