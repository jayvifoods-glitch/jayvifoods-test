# Jayvi Foods v32.0 — Supabase-connected release

This is the current stable v31.0 storefront (mobile-first redesign) with
its data layer swapped from `localStorage` to Supabase for exactly the
scope agreed: authentication, customer profiles, addresses, orders,
order items, and order status history. Catalogue (products, combos,
categories, meal tags, homepage announcements, reviews, store settings)
remains Git/Admin-JSON-managed, unchanged, per the agreed architecture.

**No UI/design was changed in this pass.** Every visual element, page
section, and interaction from v31.0 is untouched — only the data source
behind login, checkout, order history, and admin order management moved.

## Before you deploy — one-time setup

### 1. Fill in `supabase-config.js`
Open it and set:
- `SUPABASE_URL` — your project URL
- `SUPABASE_ANON_KEY` — your anon/public key

Both are safe to commit to Git (the anon key is meant to be public — RLS
in `supabase_schema_phase1_v3.sql` controls what it can actually do).
**Never** put the `service_role` key here or anywhere in this repo.

### 2. Decide `AUTH_MODE` (also in `supabase-config.js`)
Try `'phone'` first (native Supabase phone+password auth). If customer
registration fails with an error mentioning an SMS provider, switch the
one line to `'email-map'` and redeploy — no other code changes needed,
both paths are already implemented. The customer-facing UI is identical
either way; they only ever see "mobile number."

### 3. Make sure the schema is already run
This release assumes `supabase_schema_phase1_v3.sql` has already been
run in your project (frozen after RLS verification). If you haven't done
that yet, do it first — nothing here will work otherwise.

### 4. Promote the admin account
Sign up `jayvifoods@gmail.com` once through the site's normal
registration flow (or Dashboard → Authentication → Add user), then run
in the SQL Editor:
```sql
alter table public.profiles disable trigger trg_prevent_privilege_escalation;
update public.profiles set role = 'admin' where phone = '<the phone used at signup>';
-- or: where id = '<that user's UUID>', if you created it without a phone
alter table public.profiles enable trigger trg_prevent_privilege_escalation;
```
`admin-login.html` now checks Supabase Auth + `profiles.role = 'admin'`
directly — the old hardcoded credential check is gone entirely.

## Catalogue/store-config data flow — read this before editing in Admin

Products, variants, combos, categories, meal tags, homepage
announcements, reviews, and store settings all still live in the
**Admin's browser `localStorage`** (`jayviStoreV14`), exactly as in
v31.0 — nothing about this changed in the Supabase integration, and
nothing here moves to Supabase without a separate discussion.

**This means Admin catalogue edits are NOT automatically synced
anywhere else.** Concretely:

- Editing a product's price in Admin only changes it in *that specific
  browser*, on *that specific device*. It does not update Git, does
  not update the live GitHub Pages site, and does not update Admin if
  opened in a different browser or device.
- The live site's actual catalogue is whatever's baked into the
  `EMBEDDED_CONFIG` object in `app.js` at deploy time (overridable by
  whatever's in that browser's `localStorage`, if anything was ever
  saved there) — not whatever the last Admin session showed.
- There is currently no "export catalogue" or "publish to Git" button.
  Getting an Admin-made catalogue change live today means manually
  reflecting that change into `app.js`'s `EMBEDDED_CONFIG` (or
  `admin.js`'s `CONFIG_FALLBACK`) yourself and redeploying — the Admin
  UI does not do this for you.

This is the same limitation v31.0 already had; the Supabase work in
v32.0 did not touch it either way. A proper fix (Admin writes to a
config file or a small backend that then gets committed to Git, or a
"download config as JSON" button as a stopgap) is a real, separate
piece of work — not something to build silently as a side effect of
something else. Flag it explicitly if/when you want that prioritized.

## Live smoke-test sequence (run in this exact order)

Do this once `supabase-config.js` has real values and the schema is
confirmed run. Each step names what to check and where.

**Setup**
1. Confirm your admin account is promoted (see "Promote the admin
   account" above) before starting — Admin steps below need it.

**A. Customer registration + login**
2. On the live site, register a new test customer (a real phone number
   you control, since guest-order-linking in step 6 needs it to match).
   → Check: toast says "Account created," account modal shows your name.
   → In Supabase: a new row exists in `auth.users` and a matching row
   in `public.profiles` with the same phone.
3. Sign out. Sign back in with the same phone + password.
   → Check: same profile/name shown — confirms login round-trips
   correctly, not just signup.
4. Open the site in a different browser (or incognito) and sign in
   with the same credentials.
   → Check: same account, same name shown. This is what "works across
   devices" means here — same Supabase identity from anywhere, not a
   session that follows you automatically.

**B. Address management**
5. While signed in, open My Jayvi → Addresses → add an address.
   → Check: it appears in the list immediately after saving.
   → In Supabase: a row exists in `customer_addresses` with your
   `customer_id`.
6. Start a checkout as that same customer.
   → Check: the address form is prefilled with what you just saved.

**C. Signed-in customer order**
7. Complete that checkout with UPI selected.
   → Check: you land on the "Pay ₹X" screen with an order number.
   → In Supabase: rows exist in `orders` (with your `customer_id` set,
   not null) and `order_items`.
8. Enter any text as the UTR and submit.
   → Check: "Payment proof submitted" toast, order success screen.
   → In Supabase: that order's `payment_status` is `proof_submitted`.
9. Open My Jayvi → Orders (same signed-in customer).
   → Check: the order from step 7 appears in the list.

**D. Guest order + tracking**
10. Sign out. Add something to cart, checkout as a guest with COD, a
    phone number you haven't used yet.
    → Check: order success screen shows immediately (no payment step).
    → In Supabase: a row in `orders` with `customer_id` null.
11. From the homepage, use "Track order" with that order number + the
    same phone.
    → Check: status, total, and estimated delivery show. Address and
    UTR should NOT appear anywhere on this screen (that's the
    minimal-fields guarantee from the RLS work).

**E. Guest-to-customer linking**
12. Register a new account using the exact same phone number from
    step 10's guest order.
    → In Supabase: that guest order's `customer_id` should now be set
    to the new account — confirms `link_guest_orders_to_me()` fired
    correctly on registration.
13. Check that account's Orders tab.
    → Check: the step-10 guest order now appears there too.

**F. Admin order management**
14. Sign in to `/admin-login.html` with `jayvifoods@gmail.com`.
    → Check: it accepts you and loads the dashboard.
15. Try `admin-login.html` with the test customer account from step 2
    instead.
    → Check: it's rejected with "not authorized for Admin access" —
    confirms non-admins can't get in even with valid credentials.
16. In Admin → Orders, open the order from step 7.
    → Check: customer name/phone, items, and total match what you
    entered. Change status to "Preparing," add a tracking number, save.
17. As that customer (My Jayvi → Orders → tap that order, or Track
    order), confirm the new status and tracking number now show.

If every check above matches, the integration is genuinely working
end-to-end — not just "the code looks right." If any step doesn't match,
tell me exactly which numbered step and what happened instead, the same
way we worked through the RLS harness issues.

## What moved to Supabase vs. what stayed in Git

| Area | Source of truth |
|---|---|
| Customer accounts, login, session | Supabase Auth |
| Customer addresses | Supabase (`customer_addresses`) |
| Orders, order items, status history | Supabase |
| Admin authorization | Supabase (`profiles.role = 'admin'`) |
| Products, variants, combos, categories | Git / Admin JSON (unchanged) |
| Meal tags, homepage, announcements, reviews | Git / Admin JSON (unchanged) |
| Store settings (shipping, payment note, etc.) | Git / Admin JSON (unchanged) |
| Shopping cart (pre-checkout) | Browser `localStorage` (unchanged — carts are ephemeral and were never part of the agreed Supabase scope) |

## Deliverable checklist (the 10 items requested)

1. **Customer registration/login/logout** — `registerSubmit`/`loginSubmit`/`signOut` in `app.js`, via Supabase Auth.
2. **Persistent customer session** — Supabase's own session persistence; restored on page load in `init()`.
3. **Customer profile** — shown at the top of the account view (name, phone) from `profiles`.
4. **Address management** — new "Addresses" tab inside the existing account modal (add/remove; feeds checkout's default-address prefill). No new page, no layout change — it's an added tab within the modal that was already there.
5. **Place order** — `placeOrder()` now calls the `place_order()` RPC (server-side arithmetic validation, same as verified in Phase 1) instead of writing to `localStorage`.
6. **Order history** — account view's Orders tab queries `orders` directly (RLS limits it to the signed-in customer's own rows automatically).
7. **Guest order tracking** — `trackKnownOrder()`/`trackOrder()` call the `track_guest_order()` RPC (minimal-fields response, same as verified).
8. **Admin login** — `admin-login.html` now does a real Supabase sign-in + `profiles.role` check.
9. **Admin order list/detail/update** — `admin.js`'s Orders tab, order detail modal, and status/tracking update now read/write Supabase directly.
10. **Existing cart/checkout functionality preserved** — cart drawer, mobile bottom bar, checkout form layout, UPI/COD flow, all unchanged; only the final "place it" call now hits Supabase.

## Honesty check — what's verified vs. what isn't yet

Per the "offline work" constraint, **none of this has been run against a
live Supabase project from this side** — same limitation as the schema
work. What I can confirm:
- Every file passes a JS syntax check (`node --check`).
- Every Supabase RPC/table call uses the exact function names, parameter
  names, and table/column names from the frozen `v3` schema — verified by
  direct comparison against that file, not from memory.
- No leftover references to any of the removed `localStorage`
  functions remain anywhere in `app.js` or `admin.js` (checked directly).

What I can't confirm without you running it: whether `AUTH_MODE:'phone'`
actually works without an SMS provider in *your* project, and general
end-to-end behavior. See the numbered live smoke-test sequence above —
run that before trusting this with real customers.

