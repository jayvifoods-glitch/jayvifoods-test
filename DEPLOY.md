# Jayvi Foods v32.3 — A–AA implementation pass

This release works through the complete approved A–AA specification, not
just B/K/R. Per the explicit instruction accompanying this request, I am
distinguishing **"implemented in code"** from **"verified end-to-end"**
throughout — several items below are code-complete but need your live
testing before being called production-ready, and I say so plainly
rather than rounding up.

## Database migrations for this release (apply in this exact order)

Assumes `supabase_schema_phase1_v3.sql`, `supabase_migration_reviews_v32_1.sql`,
`supabase_migration_pincodes_schema.sql` + `supabase_seed_pincodes_data.sql`,
`supabase_migration_notifications.sql`, and `supabase_migration_account_recovery.sql`
are already applied from prior rounds.

1. **`supabase_migration_order_state_machine.sql`** — the big one. Adds
   the 14-status enum, transition rules + enforcement trigger,
   `cancel_order()`, expanded payment statuses, reference/dispatch/ETA
   columns, and **fixes `place_order()`/`submit_payment_proof()`/
   `track_guest_order()` to use the new canonical strings** — this last
   part is not optional cleanup, the site would break on the next order
   placed without it. Existing order rows are safely remapped to the
   new enum before the constraint is added.
2. **`supabase_migration_reviews_featured.sql`** — one column, purely
   additive, doesn't touch the frozen reviews migration.

No other database changes this round.

## A — Hamburger menu: re-verified, root cause found and fixed

You were right that it was still broken. My earlier z-index fix
addressed paint *order* but not the actual mechanism: `#mobileMenu` and
`.menuScrim` were nested **inside** `<header>`, and `<header>` has
`backdrop-filter`. `position:fixed` descendants of a `backdrop-filter`
ancestor are a documented category of rendering bug, especially on
WebKit/Safari — exactly matching your report of it looking transparent
regardless of the CSS declaring a solid background. Fixed by moving
both elements to be siblings of `<header>`, not children of it. Also
added the previously-missing independent scroll (`overflow-y:auto`)
for content taller than the viewport.
**I still cannot open a real mobile Safari/Chrome session from here —
please verify this specific fix visually before considering it closed.**

## B — Pincode/delivery: checkout integration completed

The exact gap from last round — `pincodes.delivery_charge` was
displayed but not charged — is fixed. `verifyPincode()` now stores the
matched PIN's charge/ETA in one shared object (`checkoutPinInfo`), and
both the **displayed** summary total and the **actual value sent to**
`place_order()` read from that same object via one `effectiveShipping()`
helper — they cannot diverge because they're now the same code path,
not two independent calculations that happened to agree. Verified by
re-reading `placeOrder()` after editing it.

Fail-open behavior for unmatched PINs is unchanged, per your explicit
instruction to keep it for now. State disable/individual PIN
serviceability logic is unchanged from last round (already verified
correct then).

## C — Google location search: wording fixed, still needs your API key

Changed the field label from the technical "Google Maps ready" to
"Search your Google location," per spec. The integration code itself
was already correct last round (never uses Maps for pricing) and is
unchanged. **Still inactive until you supply a Google Maps API key** —
see below for exactly which APIs to enable.

**Required for you to configure, not something I can do:**
- Enable **Maps JavaScript API** and **Places API (New)** in Google
  Cloud Console (confirmed exact requirement from reading the actual
  code — the older/classic Places API will not work with the
  `PlaceAutocompleteElement` this code uses).
- Restrict the key by HTTP referrer to your production domain(s) once
  live — do this in Cloud Console, not in code.
- Set it in Admin → Store Settings → Google Maps API key. No code
  change needed once you have the key; the existing `initPlaces()`
  function activates automatically.
- To test locally before going live, add `localhost`/your dev domain
  to the key's allowed referrers temporarily.

## D/U/V — Central order state machine: built

- 14 canonical statuses, enforced by a real `CHECK` constraint (was
  free text).
- `status_transitions` table is the single source of truth for valid
  transitions, enforced by a **database trigger** — not just hidden
  Admin dropdown options. An invalid transition is rejected even if
  something bypasses the UI entirely.
- Admin's order editor now only offers the statuses the transition
  table actually allows from the order's current status.
- Existing order rows were remapped to the new canonical values before
  the constraint went on — nothing was silently dropped or left broken.

## E — Customer cancellation: built, including the UI (a real gap I
caught while wiring this)

`cancel_order()` enforces the Order Confirmed/Preparing-only window
**server-side**, via the same transition table — I initially only
built the RPC and forgot the actual customer-facing button, caught
this before finishing and added it: a "Cancel order" button now
appears in both the guest tracking view and the signed-in customer's
order view (they share the same rendering function), shown only when
the order's current status permits it, with the exact "already
shipped" message when it doesn't. Refund business days is now a Store
Setting (`refundBusinessDays`, default 4), read by the cancellation
toast — not hard-coded.

## F — Payment status: expanded

`payment_status` now supports `failed`/`refund_pending`/`refunded` in
addition to the original three. Admin's order editor has a payment
status dropdown to set these. Customer clicking "I have paid" still
never sets anything beyond `proof_submitted` — verified unchanged.

## G — UPI payment UX: intent link added, fallback preserved

On mobile, a "Pay with UPI app" button using a standard `upi://pay`
deep link now appears above the QR. Desktop shows QR only, per spec
("Desktop → QR + manual reference fallback"). The UTR/reference field
is **always** still required either way — this does not claim
automatic payment confirmation, which the current architecture
genuinely cannot do without a real payment gateway.

## H — Dynamic order-specific ETA: real dates, not frozen text

`place_order()` now stores actual `eta_min_days`/`eta_max_days`
numerically (not just a frozen string), plus a new `dispatch_date`
field Admin sets when marking an order shipped. The customer-facing
tracking view (`formatDynamicEta()`) now shows a genuinely different
message per stage: generic range before shipping, a calculated date
range once `dispatch_date` is set, "Expected today" when out for
delivery, "Delivered" once delivered — instead of always re-showing
the same 4–8 days regardless of progress.

## I — Delivery partner + tracking + reference number

Added a distinct `reference_number` column (was conflated with
tracking number). Admin's order editor has separate fields for both.
**The confirmed gap from last round — tracking number wasn't actually
rendered in the customer tracking view despite being fetched — is
fixed**: tracking number, reference number, delivery partner, and
tracking link now all render as distinct visible lines.

## J — Unified login: `admin-login.html` removed entirely

No more separate admin login page or public "Admin login" footer link.
One normal login (`app.js`'s existing customer form); after signing in,
the code checks `profiles.role`. Visiting Admin without a session now
redirects to the storefront's normal login with a `?returnTo=admin`
marker, and successful sign-in as an admin from that path redirects
straight to `admin.html`. A plain storefront visit never force-redirects
an admin account — it shows the account view with the existing "you're
signed in as Admin, use the panel" notice from the prior round. Security
mechanism is unchanged (Supabase Auth + role check) — this was purely a
UX/architecture change, not a security change.

## K — Admin notifications: dashboard unchanged (already verified
working), email still needs your setup

No code changes needed here this round — dashboard notifications were
already correct. Email still requires deploying
`send-order-notification` and configuring a **real** Resend sender
domain — confirming again, per your reminder: the file still
contains the literal placeholder `notifications@yourdomain.example`,
which will fail if deployed as-is. Not touching that placeholder was
intentional — I can't invent a real domain for you.

## L — Customer status notifications: architecture, not a new provider

Per your instruction not to invent a provider, this round's concrete
delivery mechanism for "customer receives a message about their order"
remains M (WhatsApp, admin-triggered). What "architecture ready to
connect to email/WhatsApp/SMS later" concretely means here: the
per-status message templates are defined once
(`WHATSAPP_STATUS_TEMPLATES` in `admin.js`), independent of *how* they
get sent — swapping in an automated email/SMS channel later means
pointing a new sender at that same template map, not rebuilding the
message content logic.

## M — WhatsApp templates: built, phone bug fixed

Every status now has its own message (order confirmed, preparing,
packed & shipped with live tracking number/ETA, delivered, cancelled
with the configurable refund days, refund pending/completed, payment
failed, delivery failed, etc.) — no more one generic message. Also
fixed the confirmed `wa.me` bug: the customer's bare 10-digit number is
now prefixed with the country code before building the link.

## N — Customer timeline: branches per status category

Rewritten to render three distinct tracks — normal, cancelled, and
delivery-failed — instead of one happy-path list that rendered blank
for a cancelled order (the confirmed gap from last round).

## O — Reviews: Featured flag + homepage summary + dedicated view

Added `featured` (new, additive-only migration) with an Admin
Feature/Unfeature action; featured reviews sort first everywhere.
Homepage was already showing a small curated set, not hundreds — the
actual missing piece was a genuine "View all reviews" destination,
which now exists as a paginated, approved-only list (10 at a time,
"Load more"), reusing the existing account-modal chrome rather than a
new page. Google Reviews management (`data.reviews`, Admin-JSON) is
completely untouched, still a fully separate workflow.

## P — Brand positioning: copy updated

Page title, meta description, and the About section's copy were the
three places actually framing Jayvi around chutneys specifically —
reworded to lead with "traditional Indian flavours"/"everyday modern
eating" framing, while staying honest that chutney powders and podi
are the current real product range. Checked `help.html`/`legal.html`
directly — no equivalent phrasing there needing a change.

## Q — Product validation: the confirmed live bug, fixed at both ends

**Admin side:** `saveProduct()` now blocks on missing core fields (ID,
name, category, description, main image), named individually. Variants
are handled differently, deliberately: a brand-new product can't have
one yet (they're added afterward via Variants & sizes), so instead of
blocking creation entirely, a product with no sellable variant is
silently forced hidden (`active:false`) regardless of the checkbox,
with a clear message explaining why — this is what actually prevents
the crash, not just a validation message.

**Storefront side (defense in depth, in case bad data reaches it some
other way):** `sync()` now filters out any product missing an id, name,
image, or sellable variant before it ever reaches rendering — traced
the exact failure path from last round's audit
(`getVariant()` → `undefined.mrp` → crash) and closed it at the single
choke point every product list goes through, plus added explicit
guards in `productCard()`/`openProduct()` directly as extra hardening
on the two highest-traffic render paths.

## R — Forgot password: re-verified

Logic re-checked against the same code, unchanged from last round
(existing-account routing, WhatsApp-assisted identity flow, Admin
reset button). **Still genuinely blocked on live end-to-end testing**
until you deploy `admin-reset-password` — same status as last round,
repeating it here rather than letting it look resolved.

## S — Add to cart: fixed

Confirmed regression, now fixed: `addToCart()` no longer calls
`openCart()`. Toast shows "✓ [Product] added to your bag" with a "View
Cart" action; cart state updates correctly regardless of whether the
drawer is open, so adding multiple products in sequence works exactly
as specified.

## T — Announcement speed: configurable

Was a hardcoded `22s`. Now a CSS variable set from a new Store Setting
(`announcementSpeed`: slow/normal/fast → 26s/18s/11s), defaulting to
Normal, which is deliberately faster than the old fixed value per
spec. The topbar already had a fixed height (`--topbar-h`), so no
layout-shift issue existed there.

## X — Central configuration: remaining items closed

Added as real Store Settings this round: `refundBusinessDays`,
`announcementSpeed`, `homepageReviewCount` (was a hardcoded
`.limit(6)`). Combined with everything already configurable from
prior rounds (payment toggles, PIN serviceability, courier details per
order, announcement text), the specific items your spec listed are now
all configuration rather than scattered constants — checked each one
individually rather than assuming.

## W — Audit trail: retained and strengthened

Unchanged structurally (`order_status_history`, already verified
solid last round) — this round added an `actor` column
(`system`/`customer`/`admin`) recording *who* made each change, per
the spec's example format, which wasn't captured before.

## Y — Release discipline: I cannot do this part myself

I have no git access to this repository. Creating a `v32.1-stable` tag
and controlling the deploy sequence is something you need to do
directly:
```bash
git tag v32.1-stable <commit-hash-of-your-last-known-good-deploy>
git push origin v32.1-stable
```
Everything else in this file assumes that discipline on your end; I
can't verify or enforce it from here.

## Verification checklist (test actual workflows, not just that the code exists)

**Storefront**
1. Hamburger menu on an actual phone (not just resized desktop
   browser) — solid background, readable text.
2. Add three different products to cart without the drawer opening;
   confirm all three are present when you do open it.
3. Checkout with a serviceable PIN that has a configured
   `delivery_charge` in Admin → confirm the summary total and the
   order actually created in Supabase show the *same* shipping amount.
4. Checkout with a PIN in a disabled state → confirm generic rejection
   message, no internal detail leaked.
5. Place a UPI order on an actual phone → confirm the "Pay with UPI
   app" button appears and attempts to hand off to an installed app.
6. Track an order through several Admin-driven status changes →
   confirm the timeline and ETA text change appropriately at each
   stage, and that a normal-flow order never shows the cancelled/failed
   track.
7. Cancel an order while it's "Order Confirmed" → confirm success and
   the refund-days message. Try cancelling one already "Packed &
   Shipped" → confirm it's correctly blocked (button shouldn't even
   appear).
8. Submit a review, approve it in Admin, refresh homepage → confirm it
   appears; feature it → confirm it sorts first.
9. Visit the site while a signed-in admin, tap Account → confirm you
   see the admin notice and your own (near-empty) order history, not
   every customer's orders — this was previously verified fixed, worth
   re-confirming after this round's other changes.

**Admin**
10. Try creating a product with no image → confirm it's blocked with a
    specific message. Create one with no variant → confirm it saves
    but stays hidden, with an explanation, and does **not** appear on
    the storefront.
11. Open an order's status dropdown → confirm only valid next-statuses
    appear, never every status.
12. Try forcing an invalid transition directly via the database (as a
    sanity check on the trigger, not just the UI) — see the migration
    file's own verification comment for the exact test query.
13. Change an order's status → click WhatsApp Customer → confirm the
    message matches that specific status, and the link number has the
    country code.
14. Visit `/admin.html` in a fresh browser with no session → confirm
    it lands on the storefront login, not a 404 or a separate admin
    login page.

**Regression**
15. Full guest and signed-in checkout, both payment methods, still
    complete successfully end to end.
16. Existing approved reviews, existing orders, existing customers
    from before this round are all still visible and correct in Admin.

If anything above doesn't match, tell me exactly which numbered item —
same process as every round in this project.
