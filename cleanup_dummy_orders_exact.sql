-- =====================================================================
-- Jayvi Foods — Exact cleanup of the 5 confirmed dummy orders
-- Targets the real order_number values directly (from your screenshot)
-- rather than the keyword pattern in cleanup_test_orders.sql, which
-- didn't match this data because these orders were created with real
-- JF-YYYYMMDD-XXXXXX numbers, not TEST-%/HACK-% placeholders.
--
-- Safe to run as-is in the SQL Editor: DELETE is not affected by the
-- prevent_direct_order_mutation() trigger (that trigger only fires on
-- UPDATE, verified directly against its definition), and order_items,
-- order_status_history, and notification_events all have
-- ON DELETE CASCADE back to orders.id (verified directly against the
-- schema, not assumed) — deleting the 5 rows below automatically
-- removes every dependent row for them in all three tables. No
-- separate delete statements needed for those tables.
-- =====================================================================

-- STEP 1 — REVIEW ONLY. Confirms exactly which rows are about to be
-- deleted, and previews how many dependent rows each cascades to.
select o.order_number, o.status, o.created_at,
  (select count(*) from public.order_items oi where oi.order_id = o.id) as item_rows,
  (select count(*) from public.order_status_history h where h.order_id = o.id) as history_rows,
  (select count(*) from public.notification_events n where n.order_id = o.id) as notification_rows
from public.orders o
where o.order_number in (
  'JF-20260810-3Z59FV',
  'JF-20260810-8SRTSK',
  'JF-20260811-PB128B',
  'JF-20260812-YSMPP4',
  'JF-20260812-L9VX0M'
)
order by o.created_at;

-- STEP 2 — DESTRUCTIVE. Only run after Step 1's output shows exactly
-- these 5 order numbers and nothing unexpected.
delete from public.orders
where order_number in (
  'JF-20260810-3Z59FV',
  'JF-20260810-8SRTSK',
  'JF-20260811-PB128B',
  'JF-20260812-YSMPP4',
  'JF-20260812-L9VX0M'
);

-- STEP 3 — Confirm the cleanup. All four counts should be 0.
select
  (select count(*) from public.orders) as orders_remaining,
  (select count(*) from public.order_items) as order_items_remaining,
  (select count(*) from public.order_status_history) as history_remaining,
  (select count(*) from public.notification_events) as notifications_remaining;
