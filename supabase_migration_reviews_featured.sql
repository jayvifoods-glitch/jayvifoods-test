-- =====================================================================
-- Jayvi Foods — Migration: reviews "featured" flag (item O)
-- Apply AFTER supabase_migration_reviews_v32_1.sql. Purely additive —
-- one column, one policy adjustment. Does not touch anything else in
-- that migration.
-- =====================================================================

alter table public.website_reviews add column if not exists featured boolean not null default false;

-- Admin's existing "admin updates status" policy already covers UPDATE
-- broadly (using/with check public.is_admin()), so featured toggles
-- work with no policy change needed — confirmed by inspection of the
-- original migration rather than assumed.

-- =====================================================================
-- Verify: select id, customer_name, featured from public.website_reviews limit 5;
-- =====================================================================
