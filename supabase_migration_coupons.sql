-- =====================================================================
-- Jayvi Foods — Migration: Coupons / Offers architecture (V32.6, item 16)
-- Apply AFTER supabase_schema_phase1_v3.sql (uses public.is_admin()).
-- Additive only.
--
-- SCOPE OF THIS RELEASE (read this before wiring anything to checkout):
--   Implemented now:  the full schema below, admin-only CRUD via RLS,
--                      and a server-side, security-definer validation
--                      function (public.validate_coupon) that is the
--                      SINGLE authority on whether a code is usable and
--                      what discount it produces for a given subtotal.
--   Deferred:          actually calling validate_coupon from the
--                      customer-facing cart/checkout UI and threading
--                      its result into the charged total / placed
--                      order. That touches app.js's cart totals and
--                      the place_order() RPC — both explicitly called
--                      out as "do not touch unnecessarily" this
--                      release. Wiring in a discount field to only
--                      SOME of those code paths would be exactly the
--                      "half-working coupon system" the spec asked us
--                      not to ship, so it is deferred as a whole,
--                      cleanly, rather than half-built.
--   Your action:       none required for this file itself (it's
--                       additive and inert until something calls
--                       validate_coupon or writes to order_coupons).
--                       A follow-up release can wire the Apply Coupon
--                       UI to this exact schema with no migration
--                       changes needed.
-- =====================================================================

create table if not exists public.coupons (
  id                  uuid primary key default gen_random_uuid(),
  code                text not null unique,                 -- stored/matched upper-case, see validate_coupon()
  name                text not null,
  description         text,
  active              boolean not null default true,
  start_date          timestamptz,
  end_date            timestamptz,
  discount_type       text not null check (discount_type in ('percentage','fixed')),
  discount_value      numeric(10,2) not null check (discount_value > 0),
  min_order_value     numeric(10,2) default 0,
  max_discount        numeric(10,2),                          -- caps a percentage discount; ignored for 'fixed'
  usage_limit         integer,                                -- null = unlimited total redemptions
  per_customer_limit  integer default 1,                      -- null = unlimited per customer
  applicable_products text[],                                 -- product ids; null/empty = all products
  applicable_categories text[],                               -- category ids; null/empty = all categories
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
comment on table public.coupons is 'Coupon/offer definitions. Discount authority lives entirely server-side in validate_coupon() — never trust a client-calculated discount.';

create index if not exists idx_coupons_code on public.coupons(code);
create index if not exists idx_coupons_active on public.coupons(active, start_date, end_date);

-- One row per successful redemption, so usage_limit / per_customer_limit
-- can be enforced accurately (and so Admin can see real usage history).
create table if not exists public.coupon_redemptions (
  id              uuid primary key default gen_random_uuid(),
  coupon_id       uuid not null references public.coupons(id) on delete cascade,
  order_number    text not null,
  customer_id     uuid references public.profiles(id) on delete set null,
  customer_phone  text,          -- guest checkout has no profile row; phone is the per-customer key in that case
  discount_amount numeric(10,2) not null,
  created_at      timestamptz not null default now()
);
create index if not exists idx_coupon_redemptions_coupon on public.coupon_redemptions(coupon_id);
create index if not exists idx_coupon_redemptions_phone on public.coupon_redemptions(customer_phone);

drop trigger if exists trg_coupons_updated_at on public.coupons;
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger trg_coupons_updated_at before update on public.coupons
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- RLS: Admin manages coupons entirely; nobody (not even authenticated
-- customers) can read the coupons table directly — a signed-in
-- customer enumerating every active code/discount rule would itself be
-- a minor information leak (e.g. seeing an unlaunched festival code
-- early). The ONLY sanctioned way to check a code is the
-- validate_coupon() function below, which reveals just enough to show
-- a discount for a code the customer already typed in.
-- ---------------------------------------------------------------------
alter table public.coupons enable row level security;
alter table public.coupon_redemptions enable row level security;

revoke all on public.coupons from anon, authenticated;
revoke all on public.coupon_redemptions from anon, authenticated;
grant insert, update, delete, select on public.coupons to authenticated; -- narrowed to admin-only by policy
grant select on public.coupon_redemptions to authenticated;             -- narrowed to admin-only by policy

create policy "coupons: admin only" on public.coupons
  for all using (public.is_admin()) with check (public.is_admin());
create policy "coupon_redemptions: admin reads" on public.coupon_redemptions
  for select using (public.is_admin());

-- ---------------------------------------------------------------------
-- Server-side validation — the ONLY place discount math happens.
-- Returns whether the code is valid for this subtotal/customer right
-- now, and the resulting discount amount. Does NOT record a redemption
-- (that only happens when an order is actually placed — a future
-- release's place_order() would call a corresponding
-- "redeem_coupon(...)" inside the same transaction as order creation,
-- not implemented here to avoid touching place_order in this release).
-- ---------------------------------------------------------------------
create or replace function public.validate_coupon(
  p_code text,
  p_subtotal numeric,
  p_customer_phone text default null
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
revoke execute on function public.validate_coupon(text,numeric,text) from public;
grant execute on function public.validate_coupon(text,numeric,text) to anon, authenticated;

-- =====================================================================
-- Verify:
--   insert into public.coupons (code,name,discount_type,discount_value,min_order_value,active)
--     values ('WELCOME10','Welcome discount','percentage',10,300,true);
--   select * from public.validate_coupon('WELCOME10', 500, null);   -- valid=true, discount_amount=50
--   select * from public.validate_coupon('WELCOME10', 100, null);   -- valid=false, min order not met
--   select * from public.validate_coupon('NOTREAL', 500, null);     -- valid=false, not found
-- =====================================================================
