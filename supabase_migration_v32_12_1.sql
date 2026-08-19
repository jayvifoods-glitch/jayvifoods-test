-- =====================================================================
-- Jayvi Foods — Migration: V32.12.1
--
-- Apply AFTER every existing supabase_migration_*.sql in this project
-- (in particular: order_state_machine.sql, coupons.sql,
-- coupon_checkout.sql, settings_announcements_reviews.sql,
-- product_media_storage.sql). Every statement below is either
-- `create or replace` (safe to re-run, replaces only the function
-- body) or guarded with `if not exists` (safe to re-run, no-ops if
-- already applied) — nothing here drops or rewrites existing data.
--
-- Covers, from the V32.12.1 requirements:
--   §6/§16 — Live Configuration Changes Must Be Respected Before
--            Checkout / Stale-State Review: place_order() now
--            re-checks Vacation Mode, the "Delivery enabled" master
--            switch, and every item's live price/active status
--            SERVER-SIDE, atomically, at the moment the order is
--            actually created — not just relying on the client-side
--            checks added in app.js (checkoutIsBlockedByLiveConfig()).
--   §12    — Product Deletion Must Clean Up Associated Data: confirms
--            (does not change — already correct) that product_media
--            rows cascade-delete with their parent product/combo.
--            Storage OBJECT cleanup is handled in admin.js at delete
--            time (Postgres has no visibility into Storage objects to
--            cascade against) — see CHANGELOG_V32.12.1.md.
--   §13    — Homepage Announcements — Add Photo/Video Support: adds
--            the `media_type` column so Admin can mark an uploaded
--            announcement asset as image or video (the existing
--            `image` column already held a URL of either kind; this
--            is what was missing to render it correctly).
--   §15    — Scalability Review: adds a handful of narrow, additive
--            indexes for query patterns already used throughout
--            admin.js/app.js (see SCALABILITY_REVIEW.md for the full
--            review — these are the "fix obvious inefficiencies now"
--            subset of it, not a redesign).
--
-- Everything in this file only STRENGTHENS existing checks; nothing
-- here weakens any existing authorization, RLS, or validation rule.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Announcements — media type, for photo/video support (spec 13).
-- ---------------------------------------------------------------------
alter table public.announcements add column if not exists media_type text not null default 'image'; -- 'image' | 'video'
alter table public.announcements add column if not exists poster_url text not null default ''; -- video poster/thumbnail, mirrors product_media's poster_url
comment on column public.announcements.media_type is 'How to render announcements.image: "image" (<img>) or "video" (<video>, using poster_url as its poster). Uploaded via the same Storage flow as product/combo media (Admin > Homepage).';

-- Storage bucket for announcement media, separate from product-media so
-- the two areas can have independent lifecycle/cleanup policies later
-- if needed. Public-read (announcement images/videos are meant to be
-- publicly visible on the storefront, same as product-media), authenticated
-- admin write — mirrors the existing product-media bucket's policy shape.
insert into storage.buckets (id, name, public)
  values ('announcement-media','announcement-media', true)
  on conflict (id) do nothing;

drop policy if exists "announcement-media public read" on storage.objects;
create policy "announcement-media public read" on storage.objects
  for select using (bucket_id = 'announcement-media');

drop policy if exists "announcement-media admin write" on storage.objects;
create policy "announcement-media admin write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'announcement-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "announcement-media admin update" on storage.objects;
create policy "announcement-media admin update" on storage.objects
  for update to authenticated using (
    bucket_id = 'announcement-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "announcement-media admin delete" on storage.objects;
create policy "announcement-media admin delete" on storage.objects
  for delete to authenticated using (
    bucket_id = 'announcement-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- ---------------------------------------------------------------------
-- 2. place_order() — CORRECTED to re-validate live store state
--    server-side (spec 6/16). Same signature as the existing
--    coupon-aware overload from supabase_migration_coupon_checkout.sql
--    (create or replace — no new overload, no client-visible change
--    to how it's called). New checks, in order:
--
--    a) store_settings.vacation_mode — if true, the ENTIRE order is
--       rejected, regardless of what the browser's CONFIG said when
--       the page was loaded.
--    b) store_settings.delivery_mode — if not 'india' ("Delivery
--       enabled" switched OFF), the order is rejected the same way.
--    c) Per item: for a product line, the CURRENT row in
--       public.products is loaded and the matching variant (by id)
--       inside its `variants` jsonb is located — the order is rejected
--       if the product is no longer active, the variant no longer
--       exists/is no longer active, or its live price no longer
--       matches p_items.unit_price (a stale cart showing yesterday's
--       price). For a combo line, the same check runs against
--       public.combos (active + live price). This directly implements
--       spec 16's two examples ("Admin changes price → customer adds
--       later → must use latest price" and "Admin deletes product →
--       customer tries to buy → must gracefully prevent purchase").
--
--    All of this happens BEFORE any row is inserted, inside the same
--    transaction as the rest of place_order() — so there is no window
--    where an order could be half-created against stale data.
-- ---------------------------------------------------------------------
create or replace function public.place_order(
  p_order_number       text,
  p_guest_name         text,
  p_guest_phone        text,
  p_address_line1      text,
  p_address_city       text,
  p_address_state      text,
  p_address_pincode    text,
  p_subtotal           numeric,
  p_shipping           numeric,
  p_total              numeric,
  p_payment_method     text,
  p_estimated_delivery text,
  p_items              jsonb,
  p_eta_min_days       integer default null,
  p_eta_max_days       integer default null,
  p_coupon_code        text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid := auth.uid();
  v_order_id uuid;
  v_item jsonb;
  v_combo_item jsonb;
  v_ci jsonb;
  v_initial_status text;
  v_computed_subtotal numeric := 0;
  v_line_total numeric;
  v_valid boolean;
  v_reason text;
  v_coupon_id uuid;
  v_discount numeric := 0;
  v_discount_type text;
  v_product_ids text[] := '{}';
  v_category_ids text[] := '{}';
  v_settings public.store_settings%rowtype;
  v_product public.products%rowtype;
  v_combo public.combos%rowtype;
  v_variant jsonb;
  v_variant_found boolean;
begin
  if p_payment_method not in ('upi','cod') then
    raise exception 'Invalid payment method';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  -- V32.12.1 fix (spec 6): live store-state gate, server-side and
  -- atomic — this is the actual authority; app.js's
  -- checkoutIsBlockedByLiveConfig() is only a same-second client-side
  -- convenience so the customer sees the message before typing out an
  -- entire address, not the thing that actually protects correctness.
  select * into v_settings from public.store_settings where id = 'default';
  if found then
    if v_settings.vacation_mode then
      raise exception 'We''re currently not accepting orders. Please try again when ordering resumes.';
    end if;
    if v_settings.delivery_mode is distinct from 'india' then
      raise exception 'Delivery is currently unavailable. Please try again later.';
    end if;
  end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    if (v_item->>'qty')::integer <= 0 or (v_item->>'unit_price')::numeric < 0 then
      raise exception 'Invalid quantity or price in order items';
    end if;
    v_line_total := round((v_item->>'unit_price')::numeric * (v_item->>'qty')::integer, 2);
    if abs(v_line_total - round((v_item->>'line_total')::numeric,2)) > 0.01 then
      raise exception 'Line total does not match unit price × quantity';
    end if;
    v_computed_subtotal := v_computed_subtotal + v_line_total;

    -- V32.12.1 fix (spec 16): re-check this line against the LIVE
    -- product/variant or combo row — never trust the client's
    -- unit_price/active assumption, however recently the page loaded.
    if v_item->>'product_id' is not null then
      select * into v_product from public.products where id = v_item->>'product_id';
      if not found or not v_product.active then
        raise exception 'One of the items in your cart is no longer available. Please refresh your cart and try again.';
      end if;
      v_variant_found := false;
      for v_variant in select * from jsonb_array_elements(coalesce(v_product.variants,'[]'::jsonb)) loop
        if v_variant->>'id' = v_item->>'variant_id' then
          v_variant_found := true;
          if not coalesce((v_variant->>'active')::boolean, false) then
            raise exception 'One of the items in your cart is no longer available. Please refresh your cart and try again.';
          end if;
          if abs((v_variant->>'price')::numeric - (v_item->>'unit_price')::numeric) > 0.01 then
            raise exception 'Prices have changed since you added an item to your cart. Please refresh your cart and try again.';
          end if;
        end if;
      end loop;
      if not v_variant_found then
        raise exception 'One of the items in your cart is no longer available. Please refresh your cart and try again.';
      end if;
    end if;

    if v_item->>'combo_id' is not null then
      select * into v_combo from public.combos where id = v_item->>'combo_id';
      if not found or not v_combo.active then
        raise exception 'One of the combos in your cart is no longer available. Please refresh your cart and try again.';
      end if;
      if abs(v_combo.price - (v_item->>'unit_price')::numeric) > 0.01 then
        raise exception 'Prices have changed since you added a combo to your cart. Please refresh your cart and try again.';
      end if;
      v_product_ids := array_append(v_product_ids, v_item->>'combo_id');
      select items into v_combo_item from public.combos where id = v_item->>'combo_id';
      if v_combo_item is not null then
        for v_ci in select * from jsonb_array_elements(v_combo_item) loop
          if v_ci->>'productId' is not null then
            v_product_ids := array_append(v_product_ids, v_ci->>'productId');
          end if;
        end loop;
      end if;
    end if;

    if v_item->>'product_id' is not null then
      v_product_ids := array_append(v_product_ids, v_item->>'product_id');
    end if;
  end loop;

  if abs(v_computed_subtotal - round(p_subtotal,2)) > 0.01 then
    raise exception 'Subtotal does not match order items';
  end if;

  if array_length(v_product_ids,1) is not null then
    select coalesce(array_agg(distinct cat), '{}') into v_category_ids
    from (
      select category as cat from public.products where id = any(v_product_ids) and category is not null
      union
      select unnest(categories) as cat from public.products where id = any(v_product_ids)
    ) x;
  end if;

  if p_coupon_code is not null and length(trim(p_coupon_code)) > 0 then
    select vc.valid, vc.reason, vc.coupon_id, vc.discount_amount
      into v_valid, v_reason, v_coupon_id, v_discount
      from public.validate_coupon(p_coupon_code, v_computed_subtotal, p_guest_phone, v_product_ids, v_category_ids) vc;
    if not v_valid then
      raise exception 'This coupon is no longer available. Please select another offer. (%)', v_reason;
    end if;
    select discount_type into v_discount_type from public.coupons where id = v_coupon_id;
  end if;

  if abs((v_computed_subtotal - v_discount + round(p_shipping,2)) - round(p_total,2)) > 0.01 then
    raise exception 'Total does not match subtotal − discount + shipping';
  end if;

  v_initial_status := case when p_payment_method = 'upi'
    then 'Payment Pending' else 'Order Confirmed' end;

  insert into public.orders (
    order_number, customer_id, guest_name, guest_phone,
    address_line1, address_city, address_state, address_pincode,
    subtotal, shipping, total, payment_method, status, estimated_delivery,
    eta_min_days, eta_max_days, coupon_code, coupon_id, discount_amount, discount_type
  ) values (
    p_order_number, v_customer_id, p_guest_name, p_guest_phone,
    p_address_line1, p_address_city, p_address_state, p_address_pincode,
    v_computed_subtotal, p_shipping, p_total, p_payment_method, v_initial_status, p_estimated_delivery,
    p_eta_min_days, p_eta_max_days,
    case when v_coupon_id is not null then upper(trim(p_coupon_code)) else null end,
    v_coupon_id, v_discount, v_discount_type
  ) returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    insert into public.order_items (order_id, item_type, product_id, variant_id, combo_id, name, variant_label, unit_price, qty, line_total)
    values (
      v_order_id,
      v_item->>'item_type', v_item->>'product_id', v_item->>'variant_id', v_item->>'combo_id',
      v_item->>'name', v_item->>'variant_label',
      (v_item->>'unit_price')::numeric, (v_item->>'qty')::integer, (v_item->>'line_total')::numeric
    );
  end loop;

  insert into public.order_status_history (order_id, status, actor) values (v_order_id, v_initial_status, 'system');

  if v_coupon_id is not null then
    insert into public.coupon_redemptions (coupon_id, order_number, customer_id, customer_phone, discount_amount)
    values (v_coupon_id, p_order_number, v_customer_id, p_guest_phone, v_discount);
  end if;

  return v_order_id;
end;
$$;
revoke execute on function public.place_order(text,text,text,text,text,text,text,numeric,numeric,numeric,text,text,jsonb,integer,integer,text) from public;
grant execute on function public.place_order(text,text,text,text,text,text,text,numeric,numeric,numeric,text,text,jsonb,integer,integer,text) to anon, authenticated;


-- ---------------------------------------------------------------------
-- 3. Scalability — additive indexes only (spec 15). None of these
--    change behavior; they only speed up query patterns admin.js/app.js
--    already run today (fetchOrders() orders by created_at; the new
--    Admin Orders search/filter/sort in this release filters by
--    status/payment_status/date and searches order_number/guest_name/
--    guest_phone; coupon validation counts coupon_redemptions by
--    coupon_id; the storefront filters products by active).
-- ---------------------------------------------------------------------
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_orders_guest_phone on public.orders(guest_phone);
create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_coupon_redemptions_coupon_id on public.coupon_redemptions(coupon_id);
create index if not exists idx_coupon_redemptions_customer_phone on public.coupon_redemptions(customer_phone);
create index if not exists idx_products_active on public.products(active);
create index if not exists idx_combos_active on public.combos(active);

-- Trigram search support for Admin Orders' free-text search (order
-- number / customer name / phone) — optional but recommended once
-- order volume grows past a few thousand rows; the ILIKE search added
-- in admin.js works correctly without this, just linearly, and this
-- index only helps it scale. Safe/no-op if the extension is already
-- enabled or unavailable on the plan (wrapped so this migration still
-- completes even if pg_trgm can't be enabled for any reason).
do $$
begin
  create extension if not exists pg_trgm;
  create index if not exists idx_orders_guest_name_trgm on public.orders using gin (guest_name gin_trgm_ops);
exception when others then
  raise notice 'pg_trgm not enabled — Admin Orders search will still work, just without a trigram index. Skipping.';
end $$;

-- =====================================================================
-- Requires live Supabase testing (cannot be verified offline):
--   - place_order() rejecting when vacation_mode/delivery_mode is
--     flipped mid-session (needs a real Supabase project + two
--     browser sessions).
--   - place_order() rejecting a stale price/deleted product (needs a
--     real products row to edit mid-session).
--   - Storage bucket/policies for announcement-media (needs the real
--     project's Storage to confirm upload/public-read work end to end).
--
-- Verify after applying:
--   select proname from pg_proc where proname = 'place_order';
--   select * from public.store_settings limit 1;
--   select id, public from storage.buckets where id = 'announcement-media';
-- =====================================================================
