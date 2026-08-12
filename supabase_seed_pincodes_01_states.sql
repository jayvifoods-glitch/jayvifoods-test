-- =====================================================================
-- Jayvi Foods — Pincode seed, file 1 of 21: delivery_states
-- MUST run before any supabase_seed_pincodes_02..21.sql file — those
-- have a foreign key to this table's 'state' column.
-- Apply AFTER supabase_migration_pincodes_schema.sql.
-- Expected result: 25 rows in public.delivery_states.
-- =====================================================================

insert into public.delivery_states (state, enabled) values
  ('Andhra Pradesh', true),
  ('Andhra Pradesh | Telangana', true),
  ('Assam', true),
  ('Bihar', true),
  ('Bihar | Unclassified', true),
  ('Chhattisgarh', true),
  ('Delhi', true),
  ('Gujarat', true),
  ('Haryana', true),
  ('Himachal Pradesh', true),
  ('Jammu & Kashmir', true),
  ('Jharkhand', true),
  ('Karnataka', true),
  ('Kerala', true),
  ('Madhya Pradesh', true),
  ('Maharashtra', true),
  ('North East', true),
  ('Odisha', true),
  ('Punjab', true),
  ('Rajasthan', true),
  ('Tamil Nadu', true),
  ('Telangana', true),
  ('Uttar Pradesh', true),
  ('Uttarakhand', true),
  ('West Bengal', true)
on conflict (state) do nothing;

-- Verify: select count(*) from public.delivery_states;  -- should show 25