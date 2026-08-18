-- =====================================================================
-- Jayvi Foods — Migration: Coupon checkout wiring (V32.12, corrected)
-- Apply AFTER supabase_migration_coupons.sql and
-- supabase_migration_order_state_machine.sql (uses public.orders,
-- public.place_order(), and public.coupons from those).
--
-- V32.12.1 CORRECTION (this version of the file): the first V32.12
-- draft of this migration validated a coupon's date/min-order/usage
-- rules but never checked `coupons.applicable_products` /
-- `applicable_categories` — a coupon scoped to specific products could
-- previously be applied to any cart. Fixed below by giving
-- validate_coupon() two new parameters (the product/category ids
-- actually in the cart) and making it the single place that decides
-- eligibility, exactly as it already was for date/min-order/usage.
-- Nothing about the discount MATH changed, only what makes a coupon
-- valid in the first place.
--
-- Safe to run again even if the original V32.12 draft of this file was
-- already applied: every statement below is `drop ... if exists` +
-- `create or replace`, so re-running just replaces the function bodies
-- with the corrected ones — no data is touched.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. orders: coupon/discount columns (unchanged from the original
--    V32.12 draft — included here so this file is still runnable on
--    its own against a fresh database, in order, without needing the
--    original draft first).
-- ---------------------------------------------------------------------
alter table public.orders add column if not exists coupon_code text;
alter table public.orders add column if not exists coupon_id uuid references public.coupons(id) on delete set null;
alter table public.orders add column if not exists discount_amount numeric(10,2) not null default 0;
alter table public.orders add column if not exists discount_type text; -- 'percentage' | 'fixed', copied from the coupon at the moment it was applied (coupon itself may change/be deleted later)

-- ---------------------------------------------------------------------
-- 2. Public, narrow "active offers" listing — marketing use only
--    (floating button, announcement ticker). Deliberately NOT
--    restriction-aware: these two placements are storewide promotion,
--    not "here's exactly what you can use right now" — that's what
--    list_eligible_offers_for_cart() below is for. Unchanged from the
--    original V32.12 draft.
-- ---------------------------------------------------------------------
create or replace function public.list_active_offers()
returns table (
  code text,
  name text,
  description text,
  discount_type text,
  discount_value numeric,
  min_order_value numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select code, name, description, discount_type, discount_value, coalesce(min_order_value,0)
  from public.coupons
  where active = true
    and (start_date is null or now() >= start_date)
    and (end_date is null or now() <= end_date)
    and (usage_limit is null or (select count(*) from public.coupon_redemptions r where r.coupon_id = coupons.id) < usage_limit)
  order by discount_value desc;
$$;
revoke execute on function public.list_active_offers() from public;
grant execute on function public.list_active_offers() to anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. NEW — list_eligible_offers_for_cart(): the restriction-aware
--    listing used by the Cart "Apply coupon" dropdown. Given the
--    product/combo ids and category ids actually in the customer's
--    cart plus the current subtotal, returns only offers that could
--    actually be applied right now — same rules validate_coupon()
--    enforces below, kept in sync by using the identical array
--    containment logic (`<@`).
--
--    RESTRICTION SEMANTICS (documented once, applies identically here
--    and in validate_coupon() below): if a coupon has
--    `applicable_products` configured (non-empty), EVERY product/combo
--    id in the cart must be in that list. If it has
--    `applicable_categories` configured, EVERY category represented in
--    the cart must be in that list. If both are configured, the cart
--    must satisfy BOTH (this is the conservative reading — "scoped to
--    these products, in these categories" — appropriate since the
--    discount applies to the WHOLE order subtotal, not per line item,
--    so a coupon must never discount an item outside its intended
--    scope). If neither is configured, there is no product-level
--    restriction (existing V32.6 behaviour, unchanged).
--
--    A combo line contributes both its own id (so a coupon can name a
--    specific combo directly in applicable_products) AND the category
--    ids of its constituent products (so a coupon scoped to e.g. the
--    "chutney" category also correctly covers a combo made of
--    chutneys) — the caller (app.js) computes this the same way from
--    its own in-memory catalogue; place_order() below recomputes it
--    independently, server-side, from the combo's own `items` column,
--    never trusting the client's version of this list.
-- ---------------------------------------------------------------------
create or replace function public.list_eligible_offers_for_cart(
  p_product_ids text[] default null,
  p_category_ids text[] default null,
  p_subtotal numeric default null
)
returns table (
  code text,
  name text,
  description text,
  discount_type text,
  discount_value numeric,
  min_order_value numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select code, name, description, discount_type, discount_value, coalesce(min_order_value,0)
  from public.coupons
  where active = true
    and (start_date is null or now() >= start_date)
    and (end_date is null or now() <= end_date)
    and (usage_limit is null or (select count(*) from public.coupon_redemptions r where r.coupon_id = coupons.id) < usage_limit)
    and (p_subtotal is null or p_subtotal >= coalesce(min_order_value,0))
    and (
      applicable_products is null or array_length(applicable_products,1) is null
      or (p_product_ids is not null and array_length(p_product_ids,1) is not null and p_product_ids <@ applicable_products)
    )
    and (
      applicable_categories is null or array_length(applicable_categories,1) is null
      or (p_category_ids is not null and array_length(p_category_ids,1) is not null and p_category_ids <@ applicable_categories)
    )
  order by discount_value desc;
$$;
revoke execute on function public.list_eligible_offers_for_cart(text[],text[],numeric) from public;
grant execute on function public.list_eligible_offers_for_cart(text[],text[],numeric) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 4. validate_coupon(...) — CORRECTED. Two new parameters added at the
--    end (both nullable, so this remains the ONLY validate_coupon
--    overload — the old 3-parameter version from
--    supabase_migration_coupons.sql is explicitly dropped first, to
--    avoid two overloads of the same name ever coexisting and creating
--    an ambiguous-call error for any caller that omits the new
--    parameters).
-- ---------------------------------------------------------------------
drop function if exists public.validate_coupon(text, numeric, text);

create or replace function public.validate_coupon(
  p_code text,
  p_subtotal numeric,
  p_customer_phone text default null,
  p_product_ids text[] default null,
  p_category_ids text[] default null
)
returns table (
  valid boolean,
  reason text,
  coupon_id uuid,
  discount_amount numeric
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  c public.coupons%rowtype;
  v_used_total integer;
  v_used_by_customer integer;
  v_discount numeric;
begin
  select * into c from public.coupons where upper(code) = upper(trim(p_code));

  if not found then
    return query select false, 'Coupon code not found', null::uuid, null::numeric;
    return;
  end if;
  if not c.active then
    return query select false, 'This coupon is not currently active', c.id, null::numeric;
    return;
  end if;
  if c.start_date is not null and now() < c.start_date then
    return query select false, 'This coupon is not active yet', c.id, null::numeric;
    return;
  end if;
  if c.end_date is not null and now() > c.end_date then
    return query select false, 'This coupon has expired', c.id, null::numeric;
    return;
  end if;
  if p_subtotal < coalesce(c.min_order_value,0) then
    return query select false, format('Minimum order value for this coupon is ₹%s', c.min_order_value), c.id, null::numeric;
    return;
  end if;

  -- V32.12.1 fix: product/category restrictions, previously not
  -- enforced at all. See the semantics comment on
  -- list_eligible_offers_for_cart() above — identical rule here.
  if c.applicable_products is not null and array_length(c.applicable_products,1) > 0 then
    if p_product_ids is null or array_length(p_product_ids,1) is null or not (p_product_ids <@ c.applicable_products) then
      return query select false, 'This coupon does not apply to the items in your cart', c.id, null::numeric;
      return;
    end if;
  end if;
  if c.applicable_categories is not null and array_length(c.applicable_categories,1) > 0 then
    if p_category_ids is null or array_length(p_category_ids,1) is null or not (p_category_ids <@ c.applicable_categories) then
      return query select false, 'This coupon does not apply to the items in your cart', c.id, null::numeric;
      return;
    end if;
  end if;

  if c.usage_limit is not null then
    select count(*) into v_used_total from public.coupon_redemptions where coupon_id = c.id;
    if v_used_total >= c.usage_limit then
      return query select false, 'This coupon has reached its usage limit', c.id, null::numeric;
      return;
    end if;
  end if;

  if c.per_customer_limit is not null and p_customer_phone is not null then
    select count(*) into v_used_by_customer from public.coupon_redemptions
      where coupon_id = c.id and customer_phone = p_customer_phone;
    if v_used_by_customer >= c.per_customer_limit then
      return query select false, 'You have already used this coupon the maximum number of times', c.id, null::numeric;
      return;
    end if;
  end if;

  v_discount := case
    when c.discount_type = 'percentage' then p_subtotal * (c.discount_value/100.0)
    else c.discount_value
  end;
  if c.max_discount is not null and v_discount > c.max_discount then
    v_discount := c.max_discount;
  end if;
  if v_discount > p_subtotal then v_discount := p_subtotal; end if;

  return query select true, 'OK', c.id, round(v_discount,2);
end;
$$;
revoke execute on function public.validate_coupon(text,numeric,text,text[],text[]) from public;
grant execute on function public.validate_coupon(text,numeric,text,text[],text[]) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 5. Coupon-aware place_order(...) — CORRECTED. Still an ADDITIONAL
--    overload of place_order (the original 15-argument version from
--    supabase_migration_order_state_machine.sql is untouched and still
--    resolves for any caller that doesn't pass p_coupon_code — nothing
--    already deployed can break). The V32.12.1 fix: this function now
--    computes the cart's product/combo ids AND category ids itself,
--    server-side, from p_items and the products/combos tables — it
--    NEVER trusts a client-supplied restriction list, only the
--    server's own view of what's actually in public.products/
--    public.combos right now. That server-computed pair is what gets
--    passed into validate_coupon(), so restriction enforcement here is
--    fully independent of (and authoritative over) whatever the
--    browser showed as a preview.
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
begin
  if p_payment_method not in ('upi','cod') then
    raise exception 'Invalid payment method';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
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

    -- V32.12.1 fix: build the server's OWN view of what's in this
    -- order — used only for coupon restriction enforcement below, has
    -- no bearing on pricing.
    if v_item->>'product_id' is not null then
      v_product_ids := array_append(v_product_ids, v_item->>'product_id');
    end if;
    if v_item->>'combo_id' is not null then
      v_product_ids := array_append(v_product_ids, v_item->>'combo_id');
      -- Pull the combo's constituent product ids from public.combos
      -- itself (server-side truth), so a coupon scoped to a category
      -- also correctly covers a combo built from that category's
      -- products — never from anything the client sent.
      select items into v_combo_item from public.combos where id = v_item->>'combo_id';
      if v_combo_item is not null then
        for v_ci in select * from jsonb_array_elements(v_combo_item) loop
          if v_ci->>'productId' is not null then
            v_product_ids := array_append(v_product_ids, v_ci->>'productId');
          end if;
        end loop;
      end if;
    end if;
  end loop;

  if abs(v_computed_subtotal - round(p_subtotal,2)) > 0.01 then
    raise exception 'Subtotal does not match order items';
  end if;

  -- Distinct category ids for every real product id collected above
  -- (both `category` — primary — and every entry in the `categories`
  -- collections array), computed fresh from public.products right now.
  if array_length(v_product_ids,1) is not null then
    select coalesce(array_agg(distinct cat), '{}') into v_category_ids
    from (
      select category as cat from public.products where id = any(v_product_ids) and category is not null
      union
      select unnest(categories) as cat from public.products where id = any(v_product_ids)
    ) x;
  end if;

  -- Coupon re-validated HERE, server-side, against the real computed
  -- subtotal, the real guest phone, AND the server's own product/
  -- category ids for this order — this is the single authority, never
  -- the browser's earlier "Coupon applied" preview.
  if p_coupon_code is not null and length(trim(p_coupon_code)) > 0 then
    select vc.valid, vc.reason, vc.coupon_id, vc.discount_amount
      into v_valid, v_reason, v_coupon_id, v_discount
      from public.validate_coupon(p_coupon_code, v_computed_subtotal, p_guest_phone, v_product_ids, v_category_ids) vc;
    if not v_valid then
      -- Matches the required customer-facing wording from the spec
      -- ("This coupon is no longer available. Please select another
      -- offer.") while still surfacing the specific reason for support/
      -- debugging via the raised message text.
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

  -- Record the redemption only now that the order is durably created —
  -- this is what makes usage_limit/per_customer_limit accurate for the
  -- NEXT customer's validate_coupon() call.
  if v_coupon_id is not null then
    insert into public.coupon_redemptions (coupon_id, order_number, customer_id, customer_phone, discount_amount)
    values (v_coupon_id, p_order_number, v_customer_id, p_guest_phone, v_discount);
  end if;

  return v_order_id;
end;
$$;
revoke execute on function public.place_order(text,text,text,text,text,text,text,numeric,numeric,numeric,text,text,jsonb,integer,integer,text) from public;
grant execute on function public.place_order(text,text,text,text,text,text,text,numeric,numeric,numeric,text,text,jsonb,integer,integer,text) to anon, authenticated;

-- coupon_redemptions previously had no insert grant/policy at all
-- (only admin select) — this security-definer function inserts as its
-- owner, same pattern already relied on for orders/order_items above,
-- so no new grant is required for that table. Nothing here weakens
-- the existing "admin reads only" policy on coupon_redemptions.

-- =====================================================================
-- Verify:
--   select * from public.list_active_offers();
--   select * from public.list_eligible_offers_for_cart(array['peanut'], array['chutney'], 500);
--   -- Restriction enforcement:
--   --  1. update public.coupons set applicable_products=array['peanut'] where code='WELCOME10';
--   --  2. select * from public.validate_coupon('WELCOME10', 500, null, array['peanut'], array[]::text[]);        -- valid=true
--   --  3. select * from public.validate_coupon('WELCOME10', 500, null, array['flaxseed'], array[]::text[]);      -- valid=false, restriction message
--   -- place a real test order via the app with a valid+restricted code, then:
--   select order_number, coupon_code, discount_amount, discount_type from public.orders order by created_at desc limit 1;
--   select * from public.coupon_redemptions order by created_at desc limit 1;
-- =====================================================================
