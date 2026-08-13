-- =====================================================================
-- Jayvi Foods — Migration: State-level delivery defaults (V32.5,
-- Priority 3, items 8-9)
-- Apply AFTER supabase_migration_pincodes_schema.sql and
-- supabase_migration_order_state_machine.sql. Purely additive:
--   - adds four nullable default_* columns to delivery_states
--   - updates check_pincode() to fall back to them
-- Nothing here touches the existing 19,299-row pincode master, deletes
-- any column, or changes any individual PIN's own stored values. Every
-- PIN that already has its own delivery_charge/min_eta_days/
-- max_eta_days/courier_partner set keeps using exactly that value —
-- state defaults only fill in what a PIN leaves blank (null).
--
-- Architecture (per the approved spec):
--   Customer PIN → Serviceability → Delivery Rule
--   PIN's own value (if set) > State default (if set) > null
--   (storefront's own CONFIG.store.deliveryMinDays/deliveryMaxDays
--   fallback for a still-null ETA is unchanged, not part of this file)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. State-level defaults (nullable — "no default configured" is a
--    valid, common state, not an error).
-- ---------------------------------------------------------------------
alter table public.delivery_states
  add column if not exists default_delivery_charge numeric(8,2),
  add column if not exists default_min_eta_days integer,
  add column if not exists default_max_eta_days integer,
  add column if not exists default_courier_partner text;

-- ---------------------------------------------------------------------
-- 2. check_pincode(): now returns the EFFECTIVE (resolved) delivery
--    charge / ETA / courier — coalescing the PIN's own value with its
--    state's default. effective_serviceable logic (state enable/disable
--    master override) is completely unchanged from the original
--    pincodes-schema migration; only the four data columns below gained
--    a fallback.
-- ---------------------------------------------------------------------
create or replace function public.check_pincode(p_pincode text)
returns table (
  pincode text, state text, serviceable boolean, effective_serviceable boolean,
  delivery_zone text, delivery_charge numeric, min_eta_days integer, max_eta_days integer,
  courier_partner text, cod_available boolean, found boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.pincode, p.state, p.serviceable,
    (p.serviceable and p.active and coalesce(s.enabled, true)) as effective_serviceable,
    p.delivery_zone,
    coalesce(p.delivery_charge, s.default_delivery_charge) as delivery_charge,
    coalesce(p.min_eta_days, s.default_min_eta_days) as min_eta_days,
    coalesce(p.max_eta_days, s.default_max_eta_days) as max_eta_days,
    coalesce(p.courier_partner, s.default_courier_partner) as courier_partner,
    p.cod_available, true as found
  from public.pincodes p
  left join public.delivery_states s on s.state = p.state
  where p.pincode = p_pincode;
$$;
revoke execute on function public.check_pincode(text) from public;
grant execute on function public.check_pincode(text) to anon, authenticated;

-- =====================================================================
-- Verify after running:
--   -- set Karnataka's defaults (example from the ticket):
--   update public.delivery_states set default_delivery_charge=40, default_min_eta_days=4, default_max_eta_days=6, default_courier_partner='Delhivery' where state='Karnataka';
--
--   -- pick a Karnataka PIN that has NEVER had its own charge/ETA set:
--   select pincode from public.pincodes where state='Karnataka' and delivery_charge is null limit 1;
--   select * from public.check_pincode('<that pincode>');
--   -- delivery_charge/min_eta_days/max_eta_days/courier_partner should
--   -- now show 40/4/6/'Delhivery' even though the pincodes row itself
--   -- is untouched (still null in the pincodes table).
--
--   -- confirm PIN-level override still wins:
--   update public.pincodes set delivery_charge=25 where pincode='<that pincode>';
--   select * from public.check_pincode('<that pincode>'); -- should show 25, not 40
-- =====================================================================
