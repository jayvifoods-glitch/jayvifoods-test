-- =====================================================================
-- Jayvi Foods — Migration: Product media → Supabase Storage (V32.12)
-- Apply AFTER supabase_migration_product_catalog.sql (uses
-- public.products / public.combos / public.product_media / public.is_admin()
-- from it). Additive only.
--
-- WHAT THIS DOES vs. WHAT V32.6 ALREADY DID
--   V32.6 already made product_media a real Supabase table where
--   media_url can be either a Git-repo path (images/products/../hero.webp)
--   or a full https:// URL — the storefront never cared which. What was
--   still missing (this migration + the matching admin.js/app.js
--   changes in this release):
--     1. An actual Storage BUCKET to upload real files into, so
--        media_url can point at Supabase Storage instead of the Git
--        repo — this is what actually shrinks repository size and
--        centralises media management, per the spec's Workstream 3.
--     2. Storage RLS policies (public read of this one bucket, admin-
--        only write) — buckets are not protected by table RLS, they
--        have their own policy system on storage.objects.
--     3. An explicit is_primary flag, so "which media item is the
--        product-card image" is a real, settable field rather than an
--        implicit "whatever has the lowest display_order" convention —
--        Admin's new "Set primary" button (see admin.js) writes this
--        directly. display_order=1 is migrated to is_primary=true for
--        every existing product/combo so nothing changes visually the
--        moment this migration runs.
--
-- BACKWARD COMPATIBILITY (spec section 3.12): existing Git-path rows in
-- product_media are completely untouched by this file — a product with
-- media_url='images/products/peanut-chutney/hero.webp' keeps working
-- exactly as before. Nothing is deleted, nothing is forced to migrate.
-- Storage becomes the PREFERRED place for newly-added media (Admin's
-- new "+ Add Photo"/"+ Add Video" upload buttons write here), while
-- Git-path fallback keeps working for anything not yet migrated.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. is_primary flag.
-- ---------------------------------------------------------------------
alter table public.product_media add column if not exists is_primary boolean not null default false;

-- One-time backfill: whatever is currently first by display_order for
-- each product/combo becomes the explicit primary, matching the
-- implicit behaviour app.js has always had (media[0] after sorting by
-- display_order = the card image). Safe to re-run — it always
-- recomputes from display_order, never from a previous is_primary run.
with ranked as (
  select id, product_id, combo_id,
         row_number() over (partition by coalesce(product_id,'') , coalesce(combo_id,'') order by display_order asc, created_at asc) as rn
  from public.product_media
  where is_active = true
)
update public.product_media m
set is_primary = (r.rn = 1)
from ranked r
where m.id = r.id;

-- Keep exactly one is_primary=true per product/combo going forward.
-- Setting a new primary should demote the old one automatically,
-- rather than requiring the client to remember to do it in two writes.
create or replace function public.enforce_single_primary_media()
returns trigger
language plpgsql
as $$
begin
  if new.is_primary then
    if new.product_id is not null then
      update public.product_media set is_primary = false
        where product_id = new.product_id and id <> new.id and is_primary = true;
    elsif new.combo_id is not null then
      update public.product_media set is_primary = false
        where combo_id = new.combo_id and id <> new.id and is_primary = true;
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists trg_product_media_single_primary on public.product_media;
create trigger trg_product_media_single_primary
  after insert or update of is_primary on public.product_media
  for each row when (new.is_primary) execute function public.enforce_single_primary_media();

create index if not exists idx_product_media_primary on public.product_media(product_id, combo_id, is_primary);

-- ---------------------------------------------------------------------
-- 2. Storage bucket — `product-media`. Public read (product photos are
--    already public on the storefront; there is nothing sensitive in
--    them), admin-only write. File size / mime-type limits are a second
--    layer of defence in addition to the app-level checks in admin.js.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-media', 'product-media', true,
  52428800, -- 50 MB per file — comfortably covers a compressed product video; images are expected to be a few hundred KB (WebP) each
  array['image/webp','image/jpeg','image/png','image/avif','video/mp4','video/webm']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public (anon + authenticated) can READ any object in this bucket —
-- required for the storefront's <img>/<video> tags to load it at all,
-- since the bucket being "public" only affects the URL scheme, not
-- whether storage.objects RLS actually permits the read.
drop policy if exists "product-media: public read" on storage.objects;
create policy "product-media: public read" on storage.objects
  for select using (bucket_id = 'product-media');

-- Only Admin may upload/replace/delete files in this bucket.
drop policy if exists "product-media: admin write" on storage.objects;
create policy "product-media: admin write" on storage.objects
  for insert with check (bucket_id = 'product-media' and public.is_admin());
drop policy if exists "product-media: admin update" on storage.objects;
create policy "product-media: admin update" on storage.objects
  for update using (bucket_id = 'product-media' and public.is_admin());
drop policy if exists "product-media: admin delete" on storage.objects;
create policy "product-media: admin delete" on storage.objects
  for delete using (bucket_id = 'product-media' and public.is_admin());

-- =====================================================================
-- Verify:
--   select id, public, file_size_limit from storage.buckets where id='product-media';
--   select product_id, combo_id, is_primary, display_order, media_url from public.product_media order by product_id, display_order;
--   -- exactly one is_primary=true row per distinct product_id/combo_id above.
-- =====================================================================
