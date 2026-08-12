-- =====================================================================
-- Jayvi Foods — Migration: notification events (item K)
-- Apply AFTER the Phase 1 + reviews + pincode migrations. Additive only.
--
-- Architecture, per K6:
--   Order Event → Notification Event → [Admin Dashboard, Email]
-- notification_events is independent of the orders UI — the dashboard
-- reads it directly; email delivery is handled by a separate Database
-- Webhook + Edge Function (see supabase_functions/send-order-notification/
-- in this package) that fires on INSERT into this table. Neither
-- consumer needs to know about the other.
-- =====================================================================

create table if not exists public.notification_events (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid references public.orders(id) on delete cascade,
  order_number  text,
  event_type    text not null,   -- 'new_order' | 'payment_failed' | 'payment_verification' |
                                  -- 'order_confirmed' | 'preparing' | 'packed_shipped' |
                                  -- 'out_for_delivery' | 'delivered' | 'cancelled' |
                                  -- 'refund_pending' | 'refunded' | 'delivery_failed' | 'manual_review'
  payload       jsonb not null default '{}'::jsonb,  -- snapshot: customer name/phone, amount, status, etc.
  dashboard_read boolean not null default false,
  email_sent     boolean not null default false,
  email_error    text,
  created_at    timestamptz not null default now(),
  -- One notification per order per event type — this IS the de-dup
  -- guarantee from K5. A repeated trigger firing for the same
  -- order+event (e.g. an admin accidentally saving the same status
  -- twice) is rejected at the database level before anything reads it,
  -- rather than relying on the email-sending code to notice a repeat.
  unique(order_id, event_type)
);

create index if not exists idx_notification_events_unread on public.notification_events(dashboard_read, created_at desc);

alter table public.notification_events enable row level security;
revoke all on public.notification_events from anon;
revoke all on public.notification_events from authenticated;
grant select, update on public.notification_events to authenticated; -- admin-only via policy

create policy "notification_events: admin only"
  on public.notification_events for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Trigger: new_order notification whenever an order is created.
-- ---------------------------------------------------------------------
create or replace function public.notify_new_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notification_events (order_id, order_number, event_type, payload)
  values (new.id, new.order_number, 'new_order', jsonb_build_object(
    'customer_name', new.guest_name, 'customer_phone', new.guest_phone,
    'total', new.total, 'payment_method', new.payment_method, 'status', new.status
  ))
  on conflict (order_id, event_type) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_notify_new_order on public.orders;
create trigger trg_notify_new_order
  after insert on public.orders
  for each row execute function public.notify_new_order();

-- ---------------------------------------------------------------------
-- Trigger: status-change notifications, driven off order_status_history
-- (every status transition already writes a row there — see
-- place_order()/submit_payment_proof()/Admin's updateOrder() — so this
-- is the single place that reliably sees every transition without
-- duplicating status-tracking logic elsewhere).
-- ---------------------------------------------------------------------
create or replace function public.status_to_event_type(p_status text)
returns text
language sql
immutable
as $$
  select case
    when p_status ilike '%payment verification%' then 'payment_verification'
    when p_status ilike '%payment failed%' then 'payment_failed'
    when p_status ilike '%confirmed%' or p_status ilike '%payment verified%' then 'order_confirmed'
    when p_status ilike '%preparing%' then 'preparing'
    when p_status ilike '%packed%' or p_status ilike '%shipped%' then 'packed_shipped'
    when p_status ilike '%out for delivery%' then 'out_for_delivery'
    when p_status ilike '%delivered%' and p_status not ilike '%not%' then 'delivered'
    when p_status ilike '%cancelled%' then 'cancelled'
    when p_status ilike '%refund pending%' then 'refund_pending'
    when p_status ilike '%refunded%' then 'refunded'
    when p_status ilike '%delivery failed%' then 'delivery_failed'
    when p_status ilike '%hold%' or p_status ilike '%manual%' then 'manual_review'
    else null
  end;
$$;

create or replace function public.notify_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_type text;
  v_order public.orders;
begin
  v_event_type := public.status_to_event_type(new.status);
  if v_event_type is null then
    return new; -- status text didn't map to a known event; nothing to notify
  end if;
  select * into v_order from public.orders where id = new.order_id;
  insert into public.notification_events (order_id, order_number, event_type, payload)
  values (new.order_id, v_order.order_number, v_event_type, jsonb_build_object(
    'customer_name', v_order.guest_name, 'customer_phone', v_order.guest_phone,
    'total', v_order.total, 'status', new.status,
    'delivery_partner', v_order.delivery_partner, 'tracking_number', v_order.tracking_number
  ))
  on conflict (order_id, event_type) do nothing; -- K5 de-dup
  return new;
end;
$$;

drop trigger if exists trg_notify_order_status_change on public.order_status_history;
create trigger trg_notify_order_status_change
  after insert on public.order_status_history
  for each row execute function public.notify_order_status_change();

-- ---------------------------------------------------------------------
-- Admin helper: mark a notification read.
-- ---------------------------------------------------------------------
create or replace function public.mark_notification_read(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.notification_events set dashboard_read = true where id = p_id;
$$;
revoke execute on function public.mark_notification_read(uuid) from public;
grant execute on function public.mark_notification_read(uuid) to authenticated;

-- =====================================================================
-- Verify: place a test order, then:
--   select event_type, payload, created_at from public.notification_events
--   order by created_at desc limit 5;
-- should show a 'new_order' row immediately.
-- =====================================================================
