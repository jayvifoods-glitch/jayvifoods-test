-- =====================================================================
-- Jayvi Foods — Migration: Configurable footer social links (V32.6, item 14)
-- Apply AFTER supabase_schema_phase1_v3.sql (uses public.is_admin()).
-- Additive only — does not touch any existing table.
-- =====================================================================

create table if not exists public.social_links (
  id             uuid primary key default gen_random_uuid(),
  platform       text not null check (platform in ('whatsapp','instagram','facebook','youtube','x','linkedin','other')),
  label          text,      -- shown for 'other'/custom platforms; optional override for the rest
  url            text not null,
  enabled        boolean not null default true,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
comment on table public.social_links is 'Footer social links. The storefront shows only enabled=true rows, in display_order.';

create index if not exists idx_social_links_enabled on public.social_links(enabled, display_order);

alter table public.social_links enable row level security;
revoke all on public.social_links from anon, authenticated;
grant select on public.social_links to anon, authenticated;
grant insert, update, delete on public.social_links to authenticated; -- narrowed to admin-only below

create policy "social_links: public reads enabled" on public.social_links
  for select using (enabled = true);
create policy "social_links: admin reads all" on public.social_links
  for select using (public.is_admin());
create policy "social_links: admin writes" on public.social_links
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists trg_social_links_updated_at on public.social_links;
-- create or replace (not "create if not exists") so this file has no
-- ordering dependency on supabase_migration_product_catalog.sql even
-- though both happen to define the same helper function.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger trg_social_links_updated_at before update on public.social_links
  for each row execute function public.set_updated_at();

-- Seed with the two links currently hardcoded in the footer, so nothing
-- is lost when the storefront switches over. Safe to re-run.
insert into public.social_links (platform, url, enabled, display_order)
select 'whatsapp', 'https://wa.me/918861981003', true, 1
where not exists (select 1 from public.social_links where platform='whatsapp');
insert into public.social_links (platform, url, enabled, display_order)
select 'instagram', 'https://instagram.com/jayvifoods', true, 2
where not exists (select 1 from public.social_links where platform='instagram');

-- =====================================================================
-- Verify:
--   select platform, url, enabled, display_order from public.social_links order by display_order;
-- Should show whatsapp + instagram, both enabled.
-- =====================================================================
