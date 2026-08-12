-- =====================================================================
-- Jayvi Foods — Migration: order state machine (D, U, V), expanded
-- payment status (F), reference number + dispatch date (H, I), audit
-- actor (W). Apply AFTER Phase 1 + reviews + pincodes + notifications
-- + account recovery migrations.
--
-- IMPORTANT — this migration changes orders.status from free text to
-- a constrained enum. Existing rows are remapped BEFORE the
-- constraint is added, so nothing is silently rejected or lost.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Remap existing free-text status values to the canonical 14, then
--    lock the column down with a CHECK constraint.
--
--    This UPDATE is a direct write to orders, run from a plain SQL
--    session with no admin JWT context — without the line below, it
--    is blocked by the existing prevent_direct_order_mutation()
--    trigger (from Phase 1), exactly like the admin-bootstrap issue
--    found earlier in this project. set_config(...,true) is
--    transaction-scoped (like SET LOCAL): it authorizes only this
--    migration's own statement and reverts automatically the moment
--    this script's transaction ends — the trigger is never disabled,
--    nothing to re-enable afterward, no manual step for you.
-- ---------------------------------------------------------------------
select set_config('jayvi.trusted_update', 'true', true);

update public.orders set status = case
  when status ilike 'order received — cod' or status ilike 'order received - cod' then 'Order Confirmed'
  when status ilike 'order received' then 'Payment Pending'
  when status ilike 'payment verification%' then 'Payment Verification'
  when status ilike 'payment verified' then 'Order Confirmed'
  when status ilike 'preparing' then 'Preparing'
  when status ilike 'packed' or status ilike 'shipped' or status ilike 'packed%shipped%' then 'Packed & Shipped'
  when status ilike 'out for delivery' then 'Out for Delivery'
  when status ilike 'delivered' then 'Delivered'
  when status ilike 'cancelled' or status ilike 'canceled' then 'Cancelled'
  when status ilike 'refund pending' then 'Refund Pending'
  when status ilike 'refunded' then 'Refunded'
  when status ilike 'delivery failed' then 'Delivery Failed'
  when status ilike 'returned' then 'Returned'
  when status ilike '%hold%' or status ilike '%manual%' then 'On Hold / Manual Review'
  else 'On Hold / Manual Review' -- anything unrecognized is flagged for manual review, never silently dropped
end;

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (status in (
  'Payment Pending','Payment Failed','Payment Verification','Order Confirmed','Preparing',
  'Packed & Shipped','Out for Delivery','Delivered','Cancelled','Refund Pending','Refunded',
  'Delivery Failed','Returned','On Hold / Manual Review'
));

-- ---------------------------------------------------------------------
-- 2. Expand payment_status to cover negative/refund scenarios (item F).
--    'proof_submitted' kept exactly as-is (existing rows, existing
--    function) — customer clicking "I have paid" must never jump
--    straight to 'verified', which was already true and stays true.
-- ---------------------------------------------------------------------
alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders add constraint orders_payment_status_check check (payment_status in (
  'pending','proof_submitted','verified','failed','refund_pending','refunded'
));

-- ---------------------------------------------------------------------
-- 3. New columns: reference number (distinct from tracking number, I),
--    dispatch date (for dynamic ETA, H).
-- ---------------------------------------------------------------------
alter table public.orders add column if not exists reference_number text;
alter table public.orders add column if not exists dispatch_date date;

-- ---------------------------------------------------------------------
-- 4. Audit actor (W) — who made each status change.
-- ---------------------------------------------------------------------
alter table public.order_status_history add column if not exists actor text not null default 'system'
  check (actor in ('system','customer','admin'));

-- ---------------------------------------------------------------------
-- 5. Status transition rules (V) — single source of truth, enforced at
--    the DATABASE level (not just hidden in the Admin dropdown), so an
--    invalid transition is rejected even if some other code path tries
--    it directly.
-- ---------------------------------------------------------------------
create table if not exists public.status_transitions (
  from_status text not null,
  to_status   text not null,
  primary key (from_status, to_status)
);

insert into public.status_transitions (from_status, to_status) values
  ('Payment Pending','Order Confirmed'),
  ('Payment Pending','Payment Failed'),
  ('Payment Pending','Payment Verification'),
  ('Payment Verification','Order Confirmed'),
  ('Payment Verification','Payment Failed'),
  ('Payment Failed','Payment Pending'),        -- customer retries
  ('Payment Failed','Payment Verification'),
  ('Order Confirmed','Preparing'),
  ('Order Confirmed','Cancelled'),
  ('Preparing','Packed & Shipped'),
  ('Preparing','Cancelled'),
  ('Packed & Shipped','Out for Delivery'),
  ('Packed & Shipped','Returned'),              -- e.g. dispatch error, no delivery attempt
  ('Out for Delivery','Delivered'),
  ('Out for Delivery','Delivery Failed'),
  ('Delivery Failed','Out for Delivery'),       -- re-attempt
  ('Delivery Failed','Returned'),
  ('Cancelled','Refund Pending'),
  ('Refund Pending','Refunded'),
  -- Manual Review can be entered from, and returned to, any
  -- operational state — matches the spec's "any appropriate
  -- operational state" wording exactly.
  ('Payment Pending','On Hold / Manual Review'),
  ('Payment Verification','On Hold / Manual Review'),
  ('Order Confirmed','On Hold / Manual Review'),
  ('Preparing','On Hold / Manual Review'),
  ('Packed & Shipped','On Hold / Manual Review'),
  ('Out for Delivery','On Hold / Manual Review'),
  ('Delivery Failed','On Hold / Manual Review'),
  ('On Hold / Manual Review','Order Confirmed'),
  ('On Hold / Manual Review','Preparing'),
  ('On Hold / Manual Review','Packed & Shipped'),
  ('On Hold / Manual Review','Out for Delivery'),
  ('On Hold / Manual Review','Cancelled'),
  ('On Hold / Manual Review','Delivery Failed')
on conflict do nothing;
-- Deliberately NOT included anywhere: any transition FROM 'Delivered',
-- 'Refunded', 'Cancelled' (except its one Refund Pending edge), or
-- 'Returned' — these are terminal per the approved spec ("Delivered:
-- Terminal state. No normal cancellation."). Also deliberately NOT
-- included: 'Packed & Shipped' → 'Cancelled' — cancellation is
-- explicitly disallowed once shipped, per item E.

alter table public.status_transitions enable row level security;
revoke all on public.status_transitions from anon;
revoke all on public.status_transitions from authenticated;
grant select on public.status_transitions to anon, authenticated; -- storefront/Admin both need to read allowed-next-status
create policy "status_transitions: public reads" on public.status_transitions for select using (true);
create policy "status_transitions: admin writes" on public.status_transitions for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 6. Enforcement trigger — rejects an invalid transition even if
--    something bypasses the Admin UI's own filtering (belt and
--    suspenders, matching the pattern used throughout this project).
-- ---------------------------------------------------------------------
create or replace function public.enforce_status_transition()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = old.status then
    return new; -- no-op update (e.g. only delivery_partner changed) always allowed
  end if;
  if not exists (
    select 1 from public.status_transitions
    where from_status = old.status and to_status = new.status
  ) then
    raise exception 'Invalid order status transition: % → %', old.status, new.status;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_status_transition on public.orders;
create trigger trg_enforce_status_transition
  before update on public.orders
  for each row execute function public.enforce_status_transition();
-- Note: this fires AFTER trg_prevent_direct_order_mutation (both are
-- BEFORE UPDATE triggers on the same table; Postgres runs them in
-- name order, "enforce_status_transition" < "prevent_direct_order_mutation"
-- alphabetically — but since the mutation-block trigger already
-- rejects any non-admin/non-trusted write before this one would even
-- matter for non-admin callers, order between the two is not a
-- practical concern here).

-- ---------------------------------------------------------------------
-- 7. RPC: cancel_order — enforces E's cancellation window
--    server-side, not just by hiding the button in the UI.
-- ---------------------------------------------------------------------
create or replace function public.cancel_order(p_order_number text, p_phone text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_caller uuid := auth.uid();
begin
  select * into v_order from public.orders where order_number = p_order_number;
  if v_order.id is null then
    raise exception 'Order not found';
  end if;
  -- Caller must be either the order's own signed-in customer, or a
  -- guest presenting the correct phone number — same "two things you
  -- must know" pattern as track_guest_order()/submit_payment_proof().
  if not (
    (v_caller is not null and v_order.customer_id = v_caller)
    or (p_phone is not null and v_order.guest_phone = p_phone)
  ) then
    raise exception 'Not authorized to cancel this order';
  end if;
  if not exists (select 1 from public.status_transitions where from_status = v_order.status and to_status = 'Cancelled') then
    raise exception 'This order can no longer be cancelled — it has already been shipped or completed.';
  end if;

  perform set_config('jayvi.trusted_update', 'true', true);
  update public.orders set status = 'Cancelled' where id = v_order.id;
  insert into public.order_status_history (order_id, status, actor, note)
    values (v_order.id, 'Cancelled', case when v_caller is not null then 'customer' else 'customer' end,
      case when v_order.payment_status = 'verified' then 'Cancelled by customer. Payment was verified — refund process to be initiated by Admin.' else 'Cancelled by customer. No verified payment to refund.' end);
end;
$$;
revoke execute on function public.cancel_order(text,text) from public;
grant execute on function public.cancel_order(text,text) to anon, authenticated;

-- =====================================================================
-- 8. Fix submit_payment_proof() to emit a CANONICAL status string.
--    (place_order() is fixed once, further below in step 10, together
--    with its other required signature change — no need to touch it
--    twice.) Signature unchanged; app.js needs no changes for this.
-- ---------------------------------------------------------------------
create or replace function public.submit_payment_proof(p_order_number text, p_phone text, p_utr text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
begin
  select * into v_order from public.orders
  where order_number = p_order_number and guest_phone = p_phone;

  if v_order.id is null then
    raise exception 'Order not found for this mobile number';
  end if;
  if v_order.payment_method <> 'upi' then
    raise exception 'This order does not use UPI payment';
  end if;
  if v_order.payment_status = 'verified' then
    raise exception 'Payment for this order has already been verified';
  end if;
  if p_utr is null or length(trim(p_utr)) = 0 then
    raise exception 'UTR/reference number is required';
  end if;

  perform set_config('jayvi.trusted_update', 'true', true);
  -- CANONICAL status (was 'Payment verification pending', not in the
  -- new enum) — customer submitting proof is exactly the "claimed but
  -- not yet confirmed" state, per item F: this must NEVER set
  -- payment_status to 'verified' by itself, and it doesn't — only
  -- Admin's explicit action does that.
  update public.orders
    set utr = p_utr, payment_status = 'proof_submitted', status = 'Payment Verification'
    where id = v_order.id;

  insert into public.order_status_history (order_id, status, actor, note)
    values (v_order.id, 'Payment Verification', 'customer', 'UTR reference received: proof submitted, awaiting Admin confirmation');
end;
$$;
revoke execute on function public.submit_payment_proof(text,text,text) from public;
grant execute on function public.submit_payment_proof(text,text,text) to anon, authenticated;

-- =====================================================================
-- 9. Rewrite status_to_event_type() to use EXACT matches against the
--    new canonical enum instead of fuzzy ILIKE pattern matching (which
--    was a workaround for status being free text — no longer needed).
-- ---------------------------------------------------------------------
create or replace function public.status_to_event_type(p_status text)
returns text
language sql
immutable
as $$
  select case p_status
    when 'Payment Pending' then null            -- not independently notification-worthy; new_order trigger already covers order creation
    when 'Payment Failed' then 'payment_failed'
    when 'Payment Verification' then 'payment_verification'
    when 'Order Confirmed' then 'order_confirmed'
    when 'Preparing' then 'preparing'
    when 'Packed & Shipped' then 'packed_shipped'
    when 'Out for Delivery' then 'out_for_delivery'
    when 'Delivered' then 'delivered'
    when 'Cancelled' then 'cancelled'
    when 'Refund Pending' then 'refund_pending'
    when 'Refunded' then 'refunded'
    when 'Delivery Failed' then 'delivery_failed'
    when 'Returned' then null                    -- no dedicated email template requested for this one
    when 'On Hold / Manual Review' then 'manual_review'
    else null
  end;
$$;

-- =====================================================================
-- 10. place_order() needs two new optional params to carry PIN-specific
--    ETA days through to the stored order (item H's foundation — a
--    real per-order min/max, not just a copied text string). Adding
--    params changes the signature, so the old 13-arg version must be
--    dropped first.
-- ---------------------------------------------------------------------
alter table public.orders add column if not exists eta_min_days integer;
alter table public.orders add column if not exists eta_max_days integer;

drop function if exists public.place_order(text,text,text,text,text,text,text,numeric,numeric,numeric,text,text,jsonb);

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
  p_eta_max_days       integer default null
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
  v_initial_status text;
  v_computed_subtotal numeric := 0;
  v_line_total numeric;
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
  end loop;

  if abs(v_computed_subtotal - round(p_subtotal,2)) > 0.01 then
    raise exception 'Subtotal does not match order items';
  end if;
  if abs((v_computed_subtotal + round(p_shipping,2)) - round(p_total,2)) > 0.01 then
    raise exception 'Total does not match subtotal + shipping';
  end if;

  v_initial_status := case when p_payment_method = 'upi'
    then 'Payment Pending' else 'Order Confirmed' end;

  insert into public.orders (
    order_number, customer_id, guest_name, guest_phone,
    address_line1, address_city, address_state, address_pincode,
    subtotal, shipping, total, payment_method, status, estimated_delivery,
    eta_min_days, eta_max_days
  ) values (
    p_order_number, v_customer_id, p_guest_name, p_guest_phone,
    p_address_line1, p_address_city, p_address_state, p_address_pincode,
    p_subtotal, p_shipping, p_total, p_payment_method, v_initial_status, p_estimated_delivery,
    p_eta_min_days, p_eta_max_days
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

  return v_order_id;
end;
$$;
revoke execute on function public.place_order(text,text,text,text,text,text,text,numeric,numeric,numeric,text,text,jsonb,integer,integer) from public;
grant execute on function public.place_order(text,text,text,text,text,text,text,numeric,numeric,numeric,text,text,jsonb,integer,integer) to anon, authenticated;

-- Also add eta_min_days/eta_max_days to the guest tracking function's
-- output, so the customer-facing dynamic ETA (H) has real numbers to
-- work with, not just the frozen text string.
drop function if exists public.track_guest_order(text,text);
create or replace function public.track_guest_order(p_order_number text, p_phone text)
returns table (
  order_number text, status text, total numeric, estimated_delivery text,
  delivery_partner text, tracking_number text, reference_number text,
  dispatch_date date, tracking_url text, created_at timestamptz,
  eta_min_days integer, eta_max_days integer, items jsonb
)
language sql
security definer
set search_path = public
stable
as $$
  select
    o.order_number, o.status, o.total, o.estimated_delivery,
    o.delivery_partner, o.tracking_number, o.reference_number, o.dispatch_date,
    o.tracking_url, o.created_at, o.eta_min_days, o.eta_max_days,
    coalesce((
      select jsonb_agg(jsonb_build_object('name', oi.name, 'variant_label', oi.variant_label, 'qty', oi.qty))
      from public.order_items oi where oi.order_id = o.id
    ), '[]'::jsonb)
  from public.orders o
  where o.order_number = p_order_number and o.guest_phone = p_phone;
$$;
revoke execute on function public.track_guest_order(text,text) from public;
grant execute on function public.track_guest_order(text,text) to anon, authenticated;

-- =====================================================================
-- Verify:
--   select distinct status from public.orders; -- all 14-canonical or fewer
--   select * from public.status_transitions order by from_status;
--   -- try an invalid transition directly to confirm the trigger blocks it:
--   -- update orders set status='Delivered' where status='Payment Pending';
--   -- should raise "Invalid order status transition"
-- =====================================================================
