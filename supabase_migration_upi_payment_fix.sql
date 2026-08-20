-- =====================================================================
-- Jayvi Foods — Migration: UPI payment fix (post V32.13)
--
-- Apply AFTER every existing supabase_migration_*.sql in this project
-- (in particular supabase_migration_settings_announcements_reviews.sql,
-- which created store_settings, and supabase_migration_v32_12_1.sql,
-- which established the Storage-bucket-per-media-type pattern this
-- file follows). Every statement is either `add column if not exists`
-- or guarded with `on conflict do nothing` / `drop policy if exists`
-- (safe to re-run, nothing here drops or rewrites existing data).
--
-- Covers two customer-reported issues on the live UPI payment screen:
--
--   1) "Pay with UPI app" deep link fails on PhonePe/HDFC with
--      "receiver is not accepting payments on this UPI ID" /
--      "Transaction not permitted to this VPA by the PSP", even though
--      paying the same VPA directly inside those apps works fine.
--      Root cause: msjayvifoods.eazypay@icici is a MERCHANT (P2M)
--      VPA — ICICI's "Eazypay" is a merchant collection product, not a
--      personal handle — and a generic upi://pay intent missing the
--      Merchant Category Code (`mc`) reads as an incomplete merchant
--      transaction to the receiving PSP. This adds a place to store
--      that MCC so app.js can include it. See app.js/showUpiPayment()
--      for the full explanation and the corrected intent construction.
--
--   2) The UPI QR image on the payment screen renders as a broken
--      image (alt text only). Root cause: the Admin "UPI QR filename"
--      field held a path (images/payments/jayvi-upi.webp) that never
--      matched any real file in this repo (the actual file is at
--      images/jayvi-upi.webp) — a plain data/config mismatch, not a
--      GitHub Pages limitation (other images already use the same
--      repo-relative convention successfully). This adds a
--      'payment-media' Storage bucket so Admin can instead UPLOAD the
--      QR image and have the field auto-filled with a public URL that
--      is guaranteed to resolve on the deployed site, exactly like
--      product/announcement/gallery media already do — no more manual
--      filename typing required (though it still works as a fallback).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. store_settings — Merchant Category Code for the UPI intent link.
-- ---------------------------------------------------------------------
alter table public.store_settings add column if not exists upi_mc text not null default '';
comment on column public.store_settings.upi_mc is 'Merchant Category Code (MCC) assigned by the bank/PSP (ICICI Eazypay) for upi_id. Required by some UPI apps to accept a upi://pay intent to a merchant (P2M) VPA — without it, apps may reject the deep link even though the same VPA accepts payments made directly inside the app. Get this from the Eazypay onboarding paperwork/dashboard; it cannot be guessed or derived.';

-- ---------------------------------------------------------------------
-- 2. Storage bucket for the UPI QR image, same shape as the existing
--    announcement-media / gallery-media buckets: public read (the QR
--    must be visible to any customer on the storefront), authenticated
--    admin write.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('payment-media','payment-media', true)
  on conflict (id) do nothing;

drop policy if exists "payment-media public read" on storage.objects;
create policy "payment-media public read" on storage.objects
  for select using (bucket_id = 'payment-media');

drop policy if exists "payment-media admin write" on storage.objects;
create policy "payment-media admin write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'payment-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "payment-media admin update" on storage.objects;
create policy "payment-media admin update" on storage.objects
  for update to authenticated using (
    bucket_id = 'payment-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "payment-media admin delete" on storage.objects;
create policy "payment-media admin delete" on storage.objects
  for delete to authenticated using (
    bucket_id = 'payment-media'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================================
-- Requires live testing (cannot be verified offline):
--   - Actually obtaining the correct MCC from ICICI/Eazypay and
--     confirming the upi://pay intent is then accepted by PhonePe/HDFC
--     for a small (e.g. ₹2) real payment — this is the one part of the
--     original report that no code change can fix by itself; the app
--     now sends the field correctly once it's filled in, but the
--     VALUE has to come from the bank/PSP.
--   - Uploading a QR image through Admin > Payment settings and
--     confirming it renders on the live GitHub Pages URL, not just
--     locally.
--
-- Verify after applying:
--   select column_name from information_schema.columns
--     where table_name = 'store_settings' and column_name = 'upi_mc';
--   select id, public from storage.buckets where id = 'payment-media';
-- =====================================================================
