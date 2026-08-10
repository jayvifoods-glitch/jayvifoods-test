-- =====================================================================
-- Jayvi Foods — Test data cleanup
-- Targets ONLY order numbers matching known test patterns used during
-- RLS verification and V32 smoke testing. Run the SELECT first, review
-- the list, THEN run the DELETE. I cannot execute this myself (no live
-- database connection from this side) — please run both steps
-- yourself and paste back the actual order numbers the SELECT found,
-- so there's a real, confirmed record of what was removed.
-- =====================================================================

-- STEP 1 — REVIEW ONLY. Run this first. Confirm every row shown is
-- genuinely test data before proceeding — do not run the DELETE below
-- if anything unexpected shows up here.
select order_number, guest_name, guest_phone, total, status, created_at
from public.orders
where order_number like 'TEST-%'
   or order_number like 'HACK-%'
   or order_number like 'JF-%-XXXX%'  -- catches any literal placeholder that was never replaced
order by created_at desc;

-- STEP 2 — DESTRUCTIVE. Only run after confirming Step 1's list is
-- entirely test data. order_items and order_status_history rows for
-- these orders are removed automatically via ON DELETE CASCADE — no
-- separate delete needed for those two tables.
delete from public.orders
where order_number like 'TEST-%'
   or order_number like 'HACK-%';

-- STEP 3 — Confirm the cleanup. Should return 0 rows.
select order_number from public.orders
where order_number like 'TEST-%' or order_number like 'HACK-%';

-- =====================================================================
-- After running this, please reply with:
--   1. The exact list of order_number values Step 1 showed you.
--   2. Confirmation Step 3 returned 0 rows after the delete.
-- That's the "confirm what was removed" record — I have no way to
-- verify this independently without a live connection.
-- =====================================================================
