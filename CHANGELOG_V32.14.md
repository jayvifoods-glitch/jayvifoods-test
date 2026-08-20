# Jayvi Foods — CHANGELOG V32.14

Targeted fix on top of the current, live-tested **V32.13** code, for
two issues found during live UPI payment testing. Nothing else in
`app.js` was touched — the order/payment verification workflow (UTR
submission, "Payment verification pending", Admin verification) is
unchanged. No existing schema, function, or RLS policy was altered;
this only adds one new column and one new Storage bucket.

---

## 1. "Pay with UPI app" fails on PhonePe/HDFC for the ICICI Eazypay VPA

**Symptom:** direct payment to `msjayvifoods.eazypay@icici` works fine
from inside PhonePe or HDFC's own UPI screen, but launching payment
via the site's `upi://pay` intent fails — PhonePe: "The receiver is
not accepting payments on this specific UPI ID"; HDFC: "Transaction
not permitted to this VPA by the PSP." Reproduced even at ₹2 with a
minimal intent, so not an amount/order-number issue.

**Root cause:** `msjayvifoods.eazypay@icici` is a **merchant (P2M)**
VPA — ICICI's "Eazypay" is their merchant collection product, not a
personal handle. NPCI-registered merchant VPAs are validated by the
receiving UPI app against the intent's own fields, not just the VPA
string. When a customer types the VPA manually inside PhonePe/HDFC,
that's a different (P2P-style) code path — the app looks the VPA up
itself and fills in the correct merchant details, so it works. A
generic `upi://pay` intent missing `mc` (Merchant Category Code) reads
as an incomplete/invalid merchant transaction to the receiving PSP,
which is exactly what both error messages describe.

**Fix (`app.js`, `showUpiPayment()`):**
- The intent now includes `mc` (from a new `CONFIG.store.upiMc`
  setting) whenever it's configured.
- `tr` (a unique transaction reference) is now sent, separate from
  `tn` (the human-readable note) — the order number is used for `tr`.
- `am` is now formatted to exactly 2 decimal places.
- **Action required, not code:** `upi_mc` defaults to empty. The
  actual Merchant Category Code has to come from ICICI/Eazypay's
  onboarding paperwork or dashboard — it's specific to how this VPA
  was registered and can't be derived or guessed from the app. Enter
  it in **Admin → Payment settings → Merchant Category Code (MCC)**,
  then re-test with a small real payment on PhonePe and one other UPI
  app. If it still fails after that, the next step is contacting
  ICICI Eazypay support to confirm the VPA is provisioned to accept
  intent-based (not just collect/QR) merchant payments at all.

## 2. UPI QR code renders as a broken image

**Symptom:** the payment screen showed only the alt text ("Jayvi Foods
UPI QR"); the UPI ID text and everything else on the page rendered
correctly.

**Root cause:** the Admin **"UPI QR filename"** field's placeholder
suggested `images/payments/jayvi-upi.webp`, but no such path exists in
this repo — the actual file is at `images/jayvi-upi.webp` (repo root's
`images/` folder, no `payments/` subfolder). Whatever value was
actually saved in `upi_qr_image` didn't match a real file, so the
`<img>` 404'd. This was a data/config mismatch, not a GitHub Pages
limitation — every other image in the app (logo, product photos) uses
the same repo-relative path convention successfully.

**Fix:**
- **`app.js`:** `showUpiPayment()` now resolves `upiQrImage` through
  `resolveUpiQrSrc()`, which accepts a full `https://` URL as-is, or a
  repo-relative path (stripping any accidental leading `/`, since a
  leading slash would resolve to the domain root rather than the repo
  on a GitHub Pages *project* site). The `<img>` also gets an
  `onerror` handler that swaps in the existing "Upload your Jayvi QR
  from Admin" placeholder instead of a broken-image icon if the
  configured path/URL ever 404s again.
- **Admin upload option, added (`admin.js`):** Admin → Payment
  settings now has an **"Upload QR image"** button that uploads
  directly into a new `payment-media` Supabase Storage bucket (same
  public-read/admin-write pattern already used for product,
  announcement, and gallery media) and auto-fills the field with the
  resulting public URL — no more manually typing a filename. A live
  preview under the field shows immediately whether the current
  value actually resolves to an image, in Admin as well as at
  checkout. Typing a path/URL directly into the field still works too,
  for anyone who prefers that.
- **New migration (`supabase_migration_upi_payment_fix.sql`):** adds
  `store_settings.upi_mc` (text, default `''`) and creates the
  `payment-media` Storage bucket + its four RLS policies. Must be run
  before the MCC field or QR upload button will work against a real
  Supabase project.

## 3. Cache-busting

`index.html` / `admin.html`'s `?v=` query strings on `style.css`,
`app.js`, `admin.js`, `admin.css`, `supabase-config.js` and the footer
version tag were bumped from `32.13` to `32.14`, and `VERSION.txt`
updated to match, so the fixed files aren't served stale from
GitHub Pages/browser cache after deploy.

---

## Files changed
- `app.js` — `showUpiPayment()` intent + QR fix, `STORE_FIELD_MAP` +
  default config gain `upiMc`.
- `admin.js` — Payment settings UI gains MCC field + QR upload
  widget/preview, `STORE_FIELD_MAP` + default config gain `upiMc`,
  `savePayments()` saves it.
- `supabase_migration_upi_payment_fix.sql` — **new**, run this against
  Supabase.
- `index.html`, `admin.html` — cache-bust version bump only.
- `VERSION.txt` — `32.14`.

## Still required from your side (cannot be done from code alone)
- Get the real Merchant Category Code for `msjayvifoods.eazypay@icici`
  from ICICI/Eazypay and enter it in Admin.
- Run `supabase_migration_upi_payment_fix.sql` against your Supabase
  project.
- Re-test a small real payment (e.g. ₹2) on PhonePe and one other UPI
  app after the MCC is set, and confirm the QR renders on the live
  GitHub Pages URL after uploading it through Admin.
