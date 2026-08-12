-- =====================================================================
-- Jayvi Foods — Migration: account recovery support (item R)
-- Apply AFTER Phase 1. Additive only.
--
-- Provides ONLY a yes/no existence check for a phone number — never
-- the underlying profile row — so the storefront's "Forgot password"
-- flow can tell a customer "we found your account, here's how to
-- recover it" without giving anon/authenticated clients any broader
-- ability to browse or enumerate the profiles table.
-- =====================================================================

create or replace function public.check_phone_registered(p_phone text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where phone = p_phone);
$$;

revoke execute on function public.check_phone_registered(text) from public;
grant execute on function public.check_phone_registered(text) to anon, authenticated;

-- =====================================================================
-- The actual password reset (R4) is NOT done here — changing another
-- user's password requires the Admin API (service_role), which cannot
-- safely run in a plain SQL function callable by anon/authenticated.
-- See supabase_functions/admin-reset-password/ for that piece.
-- =====================================================================
