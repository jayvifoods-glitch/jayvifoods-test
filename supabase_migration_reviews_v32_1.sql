-- =====================================================================
-- Jayvi Foods — Migration: website customer reviews
-- Apply AFTER supabase_schema_phase1_v3.sql (uses public.is_admin()
-- and public.profiles from that file). This is a separate, additive
-- migration — it does not modify any Phase 1 table, policy, or
-- function. Run once in SQL Editor.
--
-- Scope: customer-submitted website reviews only (rating + text,
-- pending → approved/rejected workflow). Google Reviews remain a
-- completely separate, Admin-managed link/content block — this table
-- and its Admin UI never touch that.
-- =====================================================================

create table if not exists public.website_reviews (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid references public.profiles(id) on delete set null, -- null for guest-submitted reviews
  order_number  text,   -- optional context: which order this review relates to
  product_id    text,   -- optional context: which product this review relates to
  customer_name text not null,
  rating        smallint not null check (rating between 1 and 5),
  review_text   text not null check (length(trim(review_text)) > 0),
  status        text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz,
  reviewed_by   uuid references public.profiles(id)
);

comment on table public.website_reviews is 'Customer-submitted website reviews. Separate from Admin-managed Google Reviews content.';

create index if not exists idx_website_reviews_status on public.website_reviews(status, created_at desc);
create index if not exists idx_website_reviews_product on public.website_reviews(product_id);

alter table public.website_reviews enable row level security;

revoke all on public.website_reviews from anon;
revoke all on public.website_reviews from authenticated;
grant select, insert on public.website_reviews to anon, authenticated;
grant update on public.website_reviews to authenticated; -- narrowed to admin-only by the policy below

-- Public storefront (guest or signed-in) reads only approved reviews.
create policy "website_reviews: public reads approved"
  on public.website_reviews for select
  using (status = 'approved');

-- Admin reads everything (pending/approved/rejected).
create policy "website_reviews: admin reads all"
  on public.website_reviews for select
  using (public.is_admin());

-- Anyone can submit a review. Forced to pending status, and if signed
-- in, customer_id must be their own (never someone else's) — same
-- defense-in-depth pattern used throughout the Phase 1 schema.
create policy "website_reviews: anyone can submit pending"
  on public.website_reviews for insert
  with check (
    status = 'pending'
    and (customer_id is null or customer_id = auth.uid())
  );

-- Only admin can change status (approve/reject) or edit reviewed_at/reviewed_by.
create policy "website_reviews: admin updates status"
  on public.website_reviews for update
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- Nothing further to run — this migration is self-contained. Verify
-- with: select * from public.website_reviews; (should return 0 rows,
-- table exists) and check Table Editor shows website_reviews with RLS
-- enabled.
-- =====================================================================
