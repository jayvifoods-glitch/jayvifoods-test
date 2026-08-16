-- =====================================================================
-- Jayvi Foods — Migration: Product Catalog → Supabase (V32.6)
-- Apply AFTER supabase_schema_phase1_v3.sql (uses public.is_admin()
-- from that file). This is a separate, additive migration — it does
-- not modify any Phase 1 table, policy, or function, and does not
-- touch auth, orders, cart, checkout, payments, PIN/serviceability,
-- notifications, or any existing admin workflow.
--
-- Scope: makes Supabase the single source of truth for products,
-- product media, and combos — replacing the per-browser localStorage
-- catalog (`jayviStoreV14` in app.js / CONFIG_FALLBACK in admin.js)
-- described as future work in FUTURE_product_catalog_migration.md.
--
-- Store settings, categories, meal tags, announcements, and reviews
-- are NOT part of this migration and keep working exactly as before —
-- this is the smallest change that gives products/media a real,
-- shared source of truth across every browser and device.
--
-- Run once in the Supabase SQL Editor, top to bottom.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. products — extends the existing localStorage product shape.
--    Variants stay as JSONB (same array shape admin.js already uses:
--    {id,label,weight,price,mrp,sku,active}) rather than a new table,
--    per "don't create a completely new product model unnecessarily".
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id                 text primary key,             -- e.g. 'peanut' (matches existing product ids)
  sku                text,
  name               text not null,
  short_description  text,
  description        text,
  category           text,                          -- primary category id
  categories         text[] not null default '{}',  -- optional extra collections
  meal_tags          text[] not null default '{}',
  active             boolean not null default true,
  best               boolean not null default false,
  display_order      integer not null default 0,
  rating             numeric(2,1) not null default 0,
  review_count       integer not null default 0,
  variants           jsonb not null default '[]'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
comment on table public.products is 'Single source of truth for the product catalogue. Replaces per-browser localStorage catalogue.';

-- ---------------------------------------------------------------------
-- 2. combos — same principle as products; combos get no special
--    architecture of their own (item 14 of the spec).
-- ---------------------------------------------------------------------
create table if not exists public.combos (
  id                 text primary key,
  name               text not null,
  short_description  text,
  active             boolean not null default true,
  price              numeric not null,
  mrp                numeric,
  display_order      integer not null default 0,
  items              jsonb not null default '[]'::jsonb, -- [{productId,variantId,qty}]
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
comment on table public.combos is 'Combo catalogue. Media for combos lives in product_media via combo_id, same table as products.';

-- ---------------------------------------------------------------------
-- 3. product_media — one shared table for both products and combos.
--    No fixed number of slots; no generic "gallery" fallback is ever
--    consulted by the storefront (see app.js changes in this release).
-- ---------------------------------------------------------------------
create table if not exists public.product_media (
  id             uuid primary key default gen_random_uuid(),
  product_id     text references public.products(id) on delete cascade,
  combo_id       text references public.combos(id) on delete cascade,
  media_type     text not null check (media_type in ('image','video')),
  media_url      text not null,   -- local repo path (e.g. images/products/peanut/hero.webp) OR external https:// URL
  poster_url     text,            -- optional poster/thumbnail for video
  display_order  integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint product_media_one_owner check (
    (product_id is not null and combo_id is null) or
    (product_id is null and combo_id is not null)
  )
);
comment on table public.product_media is 'Media (images/videos) belonging to exactly one product or one combo. No generic-gallery fallback logic exists anywhere that reads this table.';

create index if not exists idx_product_media_product on public.product_media(product_id, display_order);
create index if not exists idx_product_media_combo on public.product_media(combo_id, display_order);
create index if not exists idx_products_active on public.products(active, display_order);
create index if not exists idx_combos_active on public.combos(active, display_order);

-- Keep updated_at current on every write (mirrors the pattern used
-- elsewhere in this project's Supabase schema for touch columns).
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists trg_combos_updated_at on public.combos;
create trigger trg_combos_updated_at before update on public.combos
  for each row execute function public.set_updated_at();

drop trigger if exists trg_product_media_updated_at on public.product_media;
create trigger trg_product_media_updated_at before update on public.product_media
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 4. Row Level Security — public reads active/live rows only;
--    only Admin (public.is_admin(), from Phase 1) can write.
-- ---------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.combos enable row level security;
alter table public.product_media enable row level security;

revoke all on public.products from anon, authenticated;
revoke all on public.combos from anon, authenticated;
revoke all on public.product_media from anon, authenticated;

grant select on public.products, public.combos, public.product_media to anon, authenticated;
grant insert, update, delete on public.products, public.combos, public.product_media to authenticated; -- narrowed to admin-only by policies below

create policy "products: public reads active" on public.products
  for select using (active = true);
create policy "products: admin reads all" on public.products
  for select using (public.is_admin());
create policy "products: admin writes" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

create policy "combos: public reads active" on public.combos
  for select using (active = true);
create policy "combos: admin reads all" on public.combos
  for select using (public.is_admin());
create policy "combos: admin writes" on public.combos
  for all using (public.is_admin()) with check (public.is_admin());

-- Public may read media only when active AND the owning product/combo
-- is itself active — an inactive product never leaks media.
create policy "product_media: public reads active" on public.product_media
  for select using (
    is_active = true
    and (
      (product_id is not null and exists(select 1 from public.products p where p.id = product_media.product_id and p.active = true))
      or
      (combo_id is not null and exists(select 1 from public.combos c where c.id = product_media.combo_id and c.active = true))
    )
  );
create policy "product_media: admin reads all" on public.product_media
  for select using (public.is_admin());
create policy "product_media: admin writes" on public.product_media
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- 5. One-time data migration — seeds Supabase from the catalogue that
--    is currently canonical inside app.js's EMBEDDED_CONFIG, so nothing
--    already live is lost. Safe to re-run (upsert on id).
--
--    Product media below reflects the real per-product folders in
--    this repo's /images/products/ (this release moved the previously
--    generic-gallery SVGs for flaxseed/pudi/puffora into their own
--    dedicated product folders — see images/products/<id>/ — so no
--    product's media depends on images/gallery/ any more).
-- =====================================================================

insert into public.products (id, sku, name, short_description, description, category, categories, meal_tags, active, best, display_order, rating, review_count, variants)
values
  ('peanut', 'JF-TAR-CLS-PNT', 'Peanut Chutney', 'Rich, nutty and comforting.', null, 'chutney', '{}', '{idli,dosa,chapati,rice}', true, true, 1, 4.8, 18,
   '[{"id":"peanut-200","label":"200g","weight":"200g","price":155,"mrp":199,"sku":"JF-TAR-CLS-PNT-200","active":true},{"id":"peanut-400","label":"400g","weight":"400g","price":249,"mrp":299,"sku":"JF-TAR-CLS-PNT-400","active":true}]'::jsonb),
  ('flaxseed', 'JF-TAR-CLS-FLX', 'Flaxseed Chutney', 'A distinctive traditional flavour.', null, 'chutney', '{}', '{idli,dosa,chapati,rice}', true, true, 2, 4.8, 12,
   '[{"id":"flaxseed-200","label":"200g","weight":"200g","price":155,"mrp":199,"sku":"JF-TAR-CLS-FLX-200","active":true},{"id":"flaxseed-400","label":"400g","weight":"400g","price":249,"mrp":299,"sku":"JF-TAR-CLS-FLX-400","active":true}]'::jsonb),
  ('pudi', 'JF-TAR-CLS-IDP', 'Idli Dosa Pudi', 'Made for idli, dosa and everyday meals.', null, 'pudi', '{}', '{idli,dosa,chapati,rice}', true, true, 3, 4.8, 9,
   '[{"id":"pudi-200","label":"200g","weight":"200g","price":155,"mrp":199,"sku":"JF-TAR-CLS-IDP-200","active":true},{"id":"pudi-400","label":"400g","weight":"400g","price":249,"mrp":299,"sku":"JF-TAR-CLS-IDP-400","active":true}]'::jsonb),
  ('puffora', 'JF-PUF', 'Puffora', 'Crunchy, puffy, made for anytime snacking.', null, 'snacks', '{}', '{}', true, true, 4, 4.7, 4,
   '[{"id":"puffora-pack","label":"Pack","weight":"Pack","price":99,"mrp":129,"sku":"JF-PUF-200","active":true}]'::jsonb),
  ('Jamun', 'JF-TAR-CLS-SWT', 'Jamun', '', 'Test', 'snacks', '{snacks}', '{vada}', true, false, 5, 0, 0,
   '[{"id":"200g","label":"200g","weight":"200g","sku":"Jamun","price":199,"mrp":299,"active":true}]'::jsonb)
on conflict (id) do update set
  sku=excluded.sku, name=excluded.name, short_description=excluded.short_description,
  description=excluded.description, category=excluded.category, categories=excluded.categories,
  meal_tags=excluded.meal_tags, active=excluded.active, best=excluded.best,
  display_order=excluded.display_order, rating=excluded.rating, review_count=excluded.review_count,
  variants=excluded.variants;

insert into public.combos (id, name, short_description, active, price, mrp, display_order, items)
values
  ('duo', 'Traditional Duo', 'Peanut + Flaxseed. Two everyday favourites.', true, 289, 310, 1,
   '[{"productId":"peanut","variantId":"peanut-200","qty":1},{"productId":"flaxseed","variantId":"flaxseed-200","qty":1}]'::jsonb)
on conflict (id) do update set
  name=excluded.name, short_description=excluded.short_description, active=excluded.active,
  price=excluded.price, mrp=excluded.mrp, display_order=excluded.display_order, items=excluded.items;

-- Clear and re-insert media so this script stays safely re-runnable.
delete from public.product_media where product_id in ('peanut','flaxseed','pudi','puffora','Jamun');
delete from public.product_media where combo_id = 'duo';

insert into public.product_media (product_id, media_type, media_url, display_order) values
  ('peanut','image','images/products/peanut/hero.webp',1),
  ('peanut','image','images/products/peanut/front-back.webp',2),
  ('peanut','image','images/products/peanut/ingredients.webp',3),
  ('peanut','image','images/products/peanut/serving.webp',4),
  ('flaxseed','image','images/products/flaxseed/hero.webp',1),
  ('flaxseed','image','images/products/flaxseed/front.svg',2),
  ('flaxseed','image','images/products/flaxseed/back.svg',3),
  ('flaxseed','image','images/products/flaxseed/serving.svg',4),
  ('pudi','image','images/products/pudi/hero.webp',1),
  ('pudi','image','images/products/pudi/front.svg',2),
  ('pudi','image','images/products/pudi/back.svg',3),
  ('pudi','image','images/products/pudi/serving.svg',4),
  ('puffora','image','images/products/puffora/hero.webp',1),
  ('puffora','image','images/products/puffora/front.svg',2),
  ('puffora','image','images/products/puffora/back.svg',3),
  ('puffora','image','images/products/puffora/serving.svg',4),
  ('Jamun','image','images/products/Jamun/hero.webp',1),
  ('Jamun','image','images/products/Jamun/front-back.webp',2),
  ('Jamun','image','images/products/Jamun/ingredients.webp',3),
  ('Jamun','image','images/products/Jamun/serving.webp',4);

insert into public.product_media (combo_id, media_type, media_url, display_order) values
  ('duo','image','images/combos/traditional-duo/hero.webp',1);

-- =====================================================================
-- Verify:
--   select id, name, active from public.products order by display_order;
--   select product_id, combo_id, media_type, media_url from public.product_media order by product_id, combo_id, display_order;
--   select id, name from public.combos;
-- Everything above should show the 5 existing products, 1 combo, and
-- every media row pointing at a real file that exists in this repo's
-- /images/products/ or /images/combos/ folders (no images/gallery/ paths).
-- =====================================================================
