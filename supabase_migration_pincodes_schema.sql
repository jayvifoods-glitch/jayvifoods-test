-- =====================================================================
-- Jayvi Foods — Migration: Pincode master + delivery rules (item B)
-- Apply AFTER supabase_schema_phase1_v3.sql and
-- supabase_migration_reviews_v32_1.sql. Additive only.
--
-- Architecture, per the approved spec:
--   Customer PIN → Serviceability → Delivery Rule
-- State is grouping/admin-convenience only, never the actual delivery
-- decision. A state's enable/disable is a MASTER OVERRIDE applied at
-- lookup time — it never modifies or destroys individual PIN rows,
-- exactly as required (B3): disable Karnataka, re-enable it, and every
-- individual PIN's own serviceable flag is untouched throughout.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. STATES  (grouping + master serviceability override)
-- ---------------------------------------------------------------------
create table if not exists public.delivery_states (
  state       text primary key,   -- matches the "state" grouping used on pincodes
  enabled     boolean not null default true,
  updated_at  timestamptz not null default now()
);

alter table public.delivery_states enable row level security;
revoke all on public.delivery_states from anon;
revoke all on public.delivery_states from authenticated;
grant select on public.delivery_states to anon, authenticated;   -- public read: needed for the customer PIN-lookup path
grant insert, update, delete on public.delivery_states to authenticated; -- narrowed to admin-only by policy below

create policy "delivery_states: public reads"
  on public.delivery_states for select
  using (true);

create policy "delivery_states: admin writes"
  on public.delivery_states for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 2. PINCODES  (individual PIN-level data + rules)
-- ---------------------------------------------------------------------
create table if not exists public.pincodes (
  pincode          text primary key check (pincode ~ '^[0-9]{6}$'),
  state            text not null references public.delivery_states(state),
  district         text,   -- not present in the initial India Post import; fillable later
  city             text,   -- same
  serviceable      boolean not null default true,   -- this PIN's OWN setting — never overwritten by state enable/disable
  delivery_zone    text,
  delivery_charge  numeric(8,2),
  min_eta_days     integer,
  max_eta_days     integer,
  courier_partner  text,
  cod_available    boolean not null default false,
  active           boolean not null default true,   -- soft-delete / temporarily-unavailable flag, distinct from serviceable
  source           text default 'india_post_import', -- 'india_post_import' | 'admin_added' | 'admin_edited'
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_pincodes_state on public.pincodes(state);

alter table public.pincodes enable row level security;
revoke all on public.pincodes from anon;
revoke all on public.pincodes from authenticated;
grant select on public.pincodes to anon, authenticated;   -- public read: customer checkout PIN lookup
grant insert, update, delete on public.pincodes to authenticated; -- narrowed to admin-only by policy below

create policy "pincodes: public reads"
  on public.pincodes for select
  using (true);

create policy "pincodes: admin writes"
  on public.pincodes for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 3. Effective-serviceability lookup function
-- Combines the state master switch with the PIN's own setting, exactly
-- per B3 — the state flag is applied ONLY at read time, never written
-- back into individual pincode rows.
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
    p.delivery_zone, p.delivery_charge, p.min_eta_days, p.max_eta_days,
    p.courier_partner, p.cod_available, true as found
  from public.pincodes p
  left join public.delivery_states s on s.state = p.state
  where p.pincode = p_pincode;
$$;
revoke execute on function public.check_pincode(text) from public;
grant execute on function public.check_pincode(text) to anon, authenticated;

-- =====================================================================
-- Verify after running this file + the seed data file:
--   select count(*) from public.pincodes;            -- ~19,299
--   select count(*) from public.delivery_states;     -- 25
--   select * from public.check_pincode('560001');    -- should return one row
-- =====================================================================
