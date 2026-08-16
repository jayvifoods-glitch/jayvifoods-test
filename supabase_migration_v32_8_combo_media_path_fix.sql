-- =====================================================================
-- Jayvi Foods — V32.8 fix-up: combo media path (item 3 of V32.8 review)
--
-- WHY THIS EXISTS AS ITS OWN FILE, NOT A RERUN OF
-- supabase_migration_product_catalog.sql:
-- That file's product_media section does
--   delete from product_media where product_id in (...)
--   delete from product_media where combo_id = 'duo'
-- before re-inserting its hardcoded seed rows. Re-running the whole
-- file today would therefore silently DELETE any media row an Admin
-- has added by hand since V32.6 went live (via Admin → Products/Combos
-- → + Add Media) and replace it with only the original 5-product/
-- 1-combo seed set — real data loss, not a safe no-op. This file
-- changes exactly one thing: the media_url on the combo's existing
-- row(s), and nothing else in product_media, products, or combos.
--
-- WHAT IT DOES:
-- V32.8 moved the combo's image on disk from the old flat path
--   images/combos/traditional-duo.webp
-- into its own dedicated folder, matching the product convention:
--   images/combos/traditional-duo/hero.webp
-- If your live Supabase project was seeded from the V32.6 migration
-- (before this move), public.product_media still has a row pointing at
-- the OLD path — the file no longer exists there, so that image would
-- now be broken on the live storefront until this is applied.
--
-- SAFE TO RUN MULTIPLE TIMES: the WHERE clause only matches rows still
-- holding the exact old path string. Once updated, running this again
-- matches zero rows and does nothing. It also does not care whether
-- you've applied it before, applied it manually, or never had the old
-- path at all (e.g. a fresh project seeded directly from the already-
-- fixed V32.8 copy of supabase_migration_product_catalog.sql).
--
-- RUN THIS: paste into the Supabase SQL Editor and execute, once.
-- =====================================================================

update public.product_media
set media_url = 'images/combos/traditional-duo/hero.webp',
    updated_at = now()
where combo_id = 'duo'
  and media_url = 'images/combos/traditional-duo.webp';

-- =====================================================================
-- Verify — run this after the update above:
--   select combo_id, media_type, media_url, display_order
--   from public.product_media
--   where combo_id is not null
--   order by display_order;
--
-- Expected result: exactly one row —
--   combo_id='duo', media_type='image',
--   media_url='images/combos/traditional-duo/hero.webp', display_order=1
--
-- If that row already showed the new path before you ran this (e.g.
-- this project was seeded fresh from the V32.8 copy of
-- supabase_migration_product_catalog.sql, which already has the
-- corrected path), the UPDATE above matched 0 rows — that's expected
-- and correct, not an error.
-- =====================================================================
