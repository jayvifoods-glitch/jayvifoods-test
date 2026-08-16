-- =====================================================================
-- Jayvi Foods — Migration: Store Settings, Announcements, Reviews →
-- Supabase (V32.11)
-- Apply AFTER supabase_schema_phase1_v3.sql (uses public.is_admin()).
-- Independent of every other catalogue migration — does not reference
-- products/combos/categories/meal_tags/product_media at all.
--
-- Scope: this is the LAST piece of the "Git = code + hosting + media,
-- Supabase = all data" architecture. Migrates:
--   - Store settings (delivery, payments, contact, auth, misc) +
--     the two homepage hero fields — previously `EMBEDDED_CONFIG.store`
--     / `EMBEDDED_CONFIG.homepage`, one shared settings object.
--   - Homepage announcements (the hero slider content) — previously
--     `EMBEDDED_CONFIG.announcements`.
--   - Curated "Google reviews" testimonials shown on the homepage —
--     previously `EMBEDDED_CONFIG.reviews`. NOT the same thing as
--     `public.website_reviews` (customer-submitted reviews), which has
--     already been in Supabase since an earlier release and is
--     untouched by this file.
--
-- Does NOT touch: products, combos, product_media, categories,
-- meal_tags, orders, customers, auth, cart, checkout, payments
-- processing, PIN/serviceability, notifications, coupons, or
-- website_reviews.
--
-- SAFE TO RE-RUN: table creation uses `if not exists`. The settings
-- row uses `on conflict (id) do nothing` (NOT do update) — see the
-- note directly above that insert for why, and read it before
-- re-running this file on a project that already has live settings.
-- The announcements seed uses `on conflict (id) do update`, same
-- caveat as the categories/meal-tags migration: re-running will reset
-- THESE SPECIFIC 3 rows (h1/h2/h3) back to seed values if Admin has
-- since edited them; it will not touch any announcement with a
-- different id. `curated_reviews` starts genuinely empty (nothing was
-- ever seeded in EMBEDDED_CONFIG for it) — no seed step, no re-run
-- concern at all for that table.
--
-- Run once in the Supabase SQL Editor, top to bottom.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. store_settings — a single row holding the whole site-settings
--    object (delivery/payments/contact/auth/misc + the 2 homepage hero
--    fields). One row by design: there is exactly one store, matching
--    how EMBEDDED_CONFIG.store/homepage were always a single object,
--    never an array.
-- ---------------------------------------------------------------------
create table if not exists public.store_settings (
  id                       text primary key default 'default',
  name                     text not null default 'Jayvi Foods',
  tagline                  text not null default '',
  country                  text not null default 'IN',
  free_shipping_threshold  numeric not null default 599,
  shipping_flat            numeric not null default 49,
  delivery_min_days        integer not null default 4,
  delivery_max_days        integer not null default 8,
  vacation_mode            boolean not null default false,
  vacation_message         text not null default '',
  google_maps_api_key      text not null default '',
  google_reviews_url       text not null default '',
  whatsapp                 text not null default '',
  instagram                text not null default '',
  razorpay_key_id          text not null default '',
  razorpay_enabled         boolean not null default false,
  upi_enabled              boolean not null default true,
  cod_enabled              boolean not null default false,
  otp_enabled              boolean not null default false,
  upi_id                   text not null default '',
  upi_name                 text not null default '',
  upi_qr_image             text not null default '',
  payment_note             text not null default '',
  refund_business_days     integer not null default 4,
  announcement_speed       text not null default 'normal',
  homepage_review_count    integer not null default 6,
  delivery_mode            text not null default 'india',
  payment_mode             text not null default 'upi_manual',
  otp_provider             text not null default '',
  hero_autoplay            boolean not null default true,
  hero_seconds             integer not null default 5,
  updated_at               timestamptz not null default now(),
  -- A single-row table is enforced by always writing id='default' —
  -- this constraint just makes that explicit and stops a second row
  -- ever being inserted by accident.
  constraint store_settings_single_row check (id = 'default')
);
comment on table public.store_settings is 'Single-row site settings (delivery/payments/contact/auth/misc + homepage hero). Replaces EMBEDDED_CONFIG.store/homepage.';

-- ---------------------------------------------------------------------
-- 2. announcements — homepage hero slider content.
-- ---------------------------------------------------------------------
create table if not exists public.announcements (
  id             text primary key,
  label          text not null default '',
  title          text not null default '',
  em             text not null default '',
  text           text not null default '',
  image          text not null default '',
  show_price     boolean not null default true,
  action_type    text not null default 'product',
  action_target  text not null default '',
  product_id     text,
  combo_id       text,
  active         boolean not null default true,
  display_order  integer not null default 0,
  updated_at     timestamptz not null default now()
);
comment on table public.announcements is 'Homepage hero slider content. Replaces EMBEDDED_CONFIG.announcements.';

-- ---------------------------------------------------------------------
-- 3. curated_reviews — manually-managed "Google reviews" testimonials
--    shown on the homepage. Distinct from public.website_reviews
--    (customer-submitted, already in Supabase, untouched here).
-- ---------------------------------------------------------------------
create table if not exists public.curated_reviews (
  id                 uuid primary key default gen_random_uuid(),
  source             text not null default 'Google',
  name               text not null default '',
  rating             integer not null default 5,
  text               text not null default '',
  product_id         text,
  active             boolean not null default true,
  verified_purchase  boolean not null default false,
  display_order      integer not null default 0,
  updated_at         timestamptz not null default now()
);
comment on table public.curated_reviews is 'Manually-curated homepage testimonials ("Google reviews" in Admin). Replaces EMBEDDED_CONFIG.reviews. Not the same table as public.website_reviews (customer-submitted reviews).';

create index if not exists idx_announcements_active on public.announcements(active, display_order);
create index if not exists idx_curated_reviews_active on public.curated_reviews(active, display_order);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_store_settings_updated_at on public.store_settings;
create trigger trg_store_settings_updated_at before update on public.store_settings
  for each row execute function public.set_updated_at();

drop trigger if exists trg_announcements_updated_at on public.announcements;
create trigger trg_announcements_updated_at before update on public.announcements
  for each row execute function public.set_updated_at();

drop trigger if exists trg_curated_reviews_updated_at on public.curated_reviews;
create trigger trg_curated_reviews_updated_at before update on public.curated_reviews
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 4. Row Level Security.
--    store_settings and announcements: public reads (the storefront
--    needs whatsapp/instagram/UPI details/hero content with no auth
--    at all — exactly as public as EMBEDDED_CONFIG already was,
--    nothing here is more sensitive than what already shipped in the
--    public JS bundle). Only Admin writes.
--    curated_reviews: public reads ACTIVE rows only; Admin reads all
--    (so hidden/draft testimonials stay visible to Admin, invisible
--    to customers) and writes.
-- ---------------------------------------------------------------------
alter table public.store_settings enable row level security;
alter table public.announcements enable row level security;
alter table public.curated_reviews enable row level security;

revoke all on public.store_settings from anon, authenticated;
revoke all on public.announcements from anon, authenticated;
revoke all on public.curated_reviews from anon, authenticated;

grant select on public.store_settings, public.announcements, public.curated_reviews to anon, authenticated;
grant insert, update, delete on public.store_settings, public.announcements, public.curated_reviews to authenticated; -- narrowed to admin-only by policies below

create policy "store_settings: public reads" on public.store_settings
  for select using (true);
create policy "store_settings: admin writes" on public.store_settings
  for all using (public.is_admin()) with check (public.is_admin());

create policy "announcements: public reads active" on public.announcements
  for select using (active = true);
create policy "announcements: admin reads all" on public.announcements
  for select using (public.is_admin());
create policy "announcements: admin writes" on public.announcements
  for all using (public.is_admin()) with check (public.is_admin());

create policy "curated_reviews: public reads active" on public.curated_reviews
  for select using (active = true);
create policy "curated_reviews: admin reads all" on public.curated_reviews
  for select using (public.is_admin());
create policy "curated_reviews: admin writes" on public.curated_reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- 5. One-time seed.
--
-- IMPORTANT — store_settings uses `on conflict (id) do nothing`, NOT
-- `do update`, unlike every other seed in this project's migrations.
-- Reasoning: this single row is exactly the kind of data an Admin edits
-- almost immediately after go-live (WhatsApp number, UPI ID, delivery
-- days, etc.) — using `do update` here would mean re-running this file
-- even once after Admin has changed a real setting would silently
-- overwrite it back to this seed's placeholder values. `do nothing`
-- means: seeds the row ONLY if it doesn't exist yet (first run on a
-- fresh project); a second run is a safe, true no-op no matter what
-- Admin has changed since.
-- =====================================================================

insert into public.store_settings (
  id, name, tagline, country, free_shipping_threshold, shipping_flat,
  delivery_min_days, delivery_max_days, vacation_mode, vacation_message,
  google_maps_api_key, google_reviews_url, whatsapp, instagram,
  razorpay_key_id, razorpay_enabled, upi_enabled, cod_enabled, otp_enabled,
  upi_id, upi_name, upi_qr_image, payment_note, refund_business_days,
  announcement_speed, homepage_review_count, delivery_mode, payment_mode,
  otp_provider, hero_autoplay, hero_seconds
) values (
  'default', 'Jayvi Foods', 'Purely Traditional. Simply Delicious.', 'IN', 599, 49,
  4, 8, false, 'We are taking a short break. Orders will resume soon.',
  '', 'https://www.google.com/search?q=Jayvi+Foods+reviews', '918861981003', 'https://instagram.com/jayvifoods',
  '', false, true, false, false,
  '', 'Jayvi Foods', '', 'Pay by UPI QR. Order moves to processing after payment verification.', 4,
  'normal', 6, 'india', 'upi_manual',
  '', true, 5
)
on conflict (id) do nothing;

insert into public.announcements (id, label, title, em, text, action_type, action_target, product_id, combo_id, active, display_order) values
  ('h1','BESTSELLER','Peanut Chutney','for every meal.','Rich, nutty and comforting — the everyday favourite.','product','peanut','peanut',null,true,1),
  ('h2','NEW','Puffora','crunch time.','A crunchy Jayvi snack for anytime munching.','product','puffora','puffora',null,true,2),
  ('h3','COMBO','Traditional Duo','one easy choice.','Peanut + Flaxseed together at ₹289.','combo','duo',null,'duo',true,3)
on conflict (id) do update set
  label=excluded.label, title=excluded.title, em=excluded.em, text=excluded.text,
  action_type=excluded.action_type, action_target=excluded.action_target,
  product_id=excluded.product_id, combo_id=excluded.combo_id,
  active=excluded.active, display_order=excluded.display_order;

-- curated_reviews: intentionally NOT seeded — EMBEDDED_CONFIG.reviews
-- was already an empty array, so there is nothing to migrate. The
-- table exists empty, ready for Admin to add curated testimonials.

-- =====================================================================
-- Verify:
--   select * from public.store_settings;
--   select id, label, title, active, display_order from public.announcements order by display_order;
--   select count(*) from public.curated_reviews;
-- Expected: exactly 1 settings row; 3 announcements (h1/h2/h3) matching
-- what was previously in EMBEDDED_CONFIG; 0 curated reviews (none
-- existed before this migration either).
-- =====================================================================
