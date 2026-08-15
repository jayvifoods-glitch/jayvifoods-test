# Jayvi Foods v32.3 — A–AA implementation pass

## ✅ V32.6 — full release notes

See **`CHANGELOG_V32.6.md`** for the complete V32.6 release: SQL
execution order, verification queries, the Implemented / Partially
implemented / Deferred / Requires-your-action breakdown, and the
post-deployment testing checklist. The two sections directly below
cover the product-catalogue-specific part of V32.6 in more detail; the
changelog is the single place that covers all of V32.6, including the
items that aren't about products/media (PIN validation, analytics,
back navigation, coupons, social links).

## ✅ V32.6 update — Products, product media, and combos are now live in Supabase

As of this release, **products, product media, and combos are no
longer part of the `jayviStoreV14` localStorage blob** described
below. They live in three new Supabase tables — `products`,
`product_media`, `combos` — created by
`supabase_migration_product_catalog.sql` (run once in the Supabase SQL
Editor; it also seeds/migrates the catalogue that was previously
hardcoded in `EMBEDDED_CONFIG`/`CONFIG_FALLBACK`).

**What this means in practice:**
- Adding, editing, or deleting a product/combo/media item in Admin
  (Products, Variants & sizes, Combos) is now **live for every
  customer, on every device, immediately** — no Git sync, no copying
  JSON into `EMBEDDED_CONFIG`/`CONFIG_FALLBACK`, no redeploy.
- Product media is a real, unlimited `+ Add Media` list per product
  (image or video, local path or external URL, any order) — see
  `FUTURE_product_catalog_migration.md` for the full background and
  `PRODUCT_MEDIA_MIGRATION.md` for what changed and how to verify it.
- The storefront (`app.js`) reads products/combos/media from Supabase
  on every load, falling back to the embedded/local copy only if that
  fetch fails (e.g. offline), so the store never renders empty.
- **The "PRODUCTION PROCEDURE" section immediately below this one
  still applies to everything else** that remains local — store
  settings, categories, meal tags, announcements, and reviews. Do not
  apply the old products/combos steps below; they're superseded by the
  paragraph above for those two sections only.

---

## ⚠️ PRODUCTION PROCEDURE — Adding a product after launch (read this first)

**Your understanding is 100% correct: Admin Save is not Publish.**
There is no automatic path from Admin's "Save" to the live storefront
in the current architecture. Below is the exact procedure — revised
from an earlier draft of this section to close a real risk you were
right to ask about (see "Why the procedure changed," below).

### Answering your core question directly

> Can I confirm that deleting the entire `jayviStoreV14` key is
> completely safe?

**Only if step 3 below is followed exactly as written — a full,
wholesale copy of the entire local data blob into *both*
`EMBEDDED_CONFIG` (app.js) *and* `CONFIG_FALLBACK` (admin.js), not a
partial hand-merge of just the new product.** Done that way, clearing
the key afterward is provably safe: nothing exists in that
browser's localStorage that isn't already, byte-for-byte, baked into
the new deployment. Skipping the wholesale-copy step and instead
hand-splicing just the new product into `EMBEDDED_CONFIG.products` (an
earlier version of this document described exactly that) is genuinely
unsafe — it can silently lose store settings, categories, combos, meal
tags, or announcements that were only ever saved locally and never
individually copied over. The fix is in the procedure, not in being
more careful about what to clear.

### Why the procedure changed (the risk you were right to flag)

`admin.js`'s `data` object — everything under the single
`jayviStoreV14` key — is *intended* to have the exact same shape as
`app.js`'s `EMBEDDED_CONFIG`: `store`, `homepage`, `categories`,
`products`, `combos`, `announcements`, `mealTags`, `reviews`. That
means the entire blob can be copied wholesale as a drop-in replacement
for `EMBEDDED_CONFIG` — no manual field-by-field merging required, and
therefore no risk of forgetting a field.

**There is also a second, independent copy of this same data shape
hiding in `admin.js` itself: `CONFIG_FALLBACK`.** `loadData()` in
`admin.js` falls back to it whenever that browser's `jayviStoreV14` key
is missing or unreadable — which is exactly the state right after step
6's clearing. If `CONFIG_FALLBACK` is not updated to match the same new
content, **Admin's own panel will silently revert to old, stale demo
data** (the original 4-product placeholder catalogue) the next time
it's opened after clearing — not the real, current catalogue, and not
what customers are seeing either. This is a second, easy-to-miss
fallback that has to be kept in sync with `EMBEDDED_CONFIG`.

### ⚠️ A schema mismatch was actually found and fixed (V32.5 review)

The claim above — "the entire blob can be copied wholesale... no risk
of forgetting a field" — was **not actually true** until this fix.
`EMBEDDED_CONFIG.store` (`app.js`) had three fields
(`deliveryMode`, `paymentMode`, `otpProvider`) that `CONFIG_FALLBACK`
(`admin.js`) never declared at all, and `CONFIG_FALLBACK` had a static
`mealLabels` field that `EMBEDDED_CONFIG` doesn't have. `deliveryMode`
in particular is genuinely load-bearing —
`verifyPincode()` in `app.js` blocks **all** delivery storefront-wide
unless it's exactly `'india'` — and had no Admin UI at all, so it
would have been silently dropped by exactly the wholesale-copy
procedure this section describes.

**Fixed:**
- `CONFIG_FALLBACK.store` now declares `deliveryMode`, `paymentMode`,
  and `otpProvider` with the same default values `EMBEDDED_CONFIG`
  already used, so nothing about current live behavior changes.
- `deliveryMode` now has a real Admin toggle — Settings → Store
  Operations → "Delivery enabled" — so it's visible and editable
  instead of an invisible field only a developer editing `app.js`
  could see. `paymentMode` is currently unused by any runtime logic
  (`upiEnabled`/`codEnabled`/`razorpayEnabled` are the real active
  payment toggles) — added for schema parity only, not wired to new
  behavior, per "don't change working flows unnecessarily."
  `otpProvider` already had a working Admin field; it was just missing
  from this literal's defaults.
- The static `mealLabels` field was removed from `CONFIG_FALLBACK` —
  it's derived from `mealTags` every time in both `app.js` and
  `admin.js` and was redundant at best, a drift risk at worst. This
  specific one, on inspection, was never actually a copy-safety risk
  (`app.js` unconditionally recomputes it regardless of what's in
  `EMBEDDED_CONFIG`), but it's cleaner to only have one source of truth
  for it.
- Verified: no other fields exist on only one side. A representative
  element of every data array (products, categories, combos,
  announcements, meal tags) was also compared — all match.

**New required step: run `node verify_config_schema.js` before every
deploy that touches `EMBEDDED_CONFIG`/`CONFIG_FALLBACK`** (see step 0
below). It programmatically extracts both literals straight from the
current source files and fails loudly if they ever drift apart again —
this is what makes "no risk of forgetting a field" an enforced
guarantee rather than a one-time manual check that can go stale.

### The exact, safe procedure

0. **Before pasting anything, run:**
   ```
   node verify_config_schema.js
   ```
   from the project root. It must print
   `✅ EMBEDDED_CONFIG and CONFIG_FALLBACK are structurally identical`
   before you proceed. If it reports a mismatch, resolve that first —
   do not continue with steps 1–6 until it passes, or the exact class
   of bug described above can happen again.
1. In Admin (whichever browser), make all the changes you want to
   publish in one sitting — add/edit products, and anything else
   (categories, combos, meal tags, announcements, store settings) —
   clicking Save as you go. Each Save writes the *entire* current
   configuration to that browser's `localStorage` under
   `jayviStoreV14`.
2. When ready to publish, click the **"📋 Copy Full Catalogue JSON"**
   button — it's on every catalogue page in Admin (Products, Variants,
   Combos, Categories, Meal tags), inside the same warning banner that
   explains this whole limitation. One click copies the complete
   current state (every product, category, combo, meal tag,
   announcement, and store setting — not just the new product) to your
   clipboard, pretty-printed so it's easy to read before pasting.
   *(Fallback, if clipboard access is ever blocked: DevTools console
   (F12 → Console tab) → `copy(localStorage.getItem('jayviStoreV14'))`
   does the same thing. The button uses the same underlying data — it
   only removes the manual DevTools step.)*
3. Whoever is doing the deploy replaces **the entire**
   `const EMBEDDED_CONFIG = { ... };` object literal near the top of
   `app.js` with this exact pasted JSON, **and** replaces **the
   entire** `const CONFIG_FALLBACK = { ... };` object literal near the
   top of `admin.js` with the same pasted JSON. Both files, same
   content, same deploy — this is a paste-and-replace of a whole
   object, not a hand-edit of individual fields, which is what makes
   it safe.
3a. **Run `node verify_config_schema.js` again**, right after pasting,
    before deploying. This catches a bad paste (truncated JSON, pasted
    into only one file, accidentally left a stray brace) before it
    reaches production, not after.
4. Bump the `?v=` cache-busting version in `index.html`/`admin.html`
   (e.g. `?v=32.5` → `?v=32.6`) so browsers fetch the new files rather
   than a cached copy, then commit, push, and redeploy through whatever
   static hosting is in use.
5. **Now** clear `jayviStoreV14` on that Admin browser (and any other
   browser/device that has ever opened `/admin.html`) — DevTools:
   `localStorage.removeItem('jayviStoreV14')`, or a full "clear site
   data." This is safe specifically because step 3 already guarantees
   both `EMBEDDED_CONFIG` and `CONFIG_FALLBACK` fully contain what's
   about to be cleared.
6. Refresh. Admin's own browser and every customer's browser now load
   from the same freshly deployed `EMBEDDED_CONFIG` — same catalogue,
   everywhere, until the next change.

**One practical note:** don't keep editing in Admin between step 2
(copying the JSON) and the deploy actually going live — any further
changes made in that window won't be in the copied JSON and will need
their own follow-up copy → replace → deploy cycle.

### The documented long-term-intent workflow (matches what you described)

```
Run `node verify_config_schema.js` (must pass before proceeding)
    ↓
Admin adds product
    ↓
Save locally (writes the full current config to this browser only)
    ↓
Copy the full catalogue JSON (Admin → "📋 Copy Full Catalogue JSON" button)
    ↓
Paste-replace BOTH EMBEDDED_CONFIG (app.js) and CONFIG_FALLBACK (admin.js) wholesale
    ↓
Run `node verify_config_schema.js` again (catches a bad paste)
    ↓
Git commit + push + redeploy (bump ?v= cache-bust)
    ↓
Clear jayviStoreV14 on any browser that has used Admin (now safe)
    ↓
Customer refreshes/loads the website → new product visible
```

**This is not a new sync mechanism and does not change the
architecture** — it's the same manual copy from localStorage as
before, just done as one wholesale paste-replace covering the whole
configuration object instead of a partial hand-merge, plus keeping
`CONFIG_FALLBACK` in sync. The long-term fix remains the Supabase
Product Master; nothing here is a substitute for it.

### Direct answers to your six questions

**1. Is there currently a reliable, documented procedure for doing
this after production launch?**
No — before this update, there was no documented procedure at all,
just the toast message reminding Admin to "sync this out to your
repo." The six steps above are now that documented procedure.

**2. Can the developer/technical process take that change and publish
it without rebuilding the whole website manually?**
There's no build system to run (no bundler/compiler — the site is
plain static HTML/JS/CSS), so there's no "rebuild" in that sense. But
publishing still requires a person to paste-replace two object
literals and push a new deployment — every single time. There is
currently no tool that automates step 2 or step 3 above.

**3. Does adding/editing a product require a Git deployment every
time?**
Yes. That is currently the only path by which any customer, on any
device, ever sees a catalogue change.

**4. Does it require developer involvement every time?**
In practice, yes, or at minimum someone comfortable pasting a JSON
blob into two specific spots in two files without disturbing the
surrounding code. The wholesale paste-replace above is far lower-risk
than the field-by-field hand-merge an earlier draft of this document
described, but it's still a manual code change and deploy, which is
exactly why the future Product Master (a proper Admin form writing to
a database, with no source-code editing at all) is the right fix —
not something to work around further in the meantime.

**5. Does it affect existing customer orders/products?**
No. Orders, customers, addresses, pincodes, and delivery states all
live in Supabase already and are completely untouched by this
procedure. `EMBEDDED_CONFIG`/`CONFIG_FALLBACK` only affect what
products/categories/combos/meal tags/announcements/store settings the
storefront and Admin panel display — no relationship to anything
already stored in Supabase.

**6. What exactly happens to the existing live catalogue when `app.js`
is redeployed?**
For a normal customer who has never opened `/admin.html` on their
device, this is clean: their browser has no `jayviStoreV14` key at
all, so `loadConfig()` in `app.js` uses the freshly deployed
`EMBEDDED_CONFIG` in full, immediately, the next time they load the
site (after their browser fetches the new `app.js` — hence the
cache-bust bump in step 4).

**On a browser that still has an old, uncleared `jayviStoreV14`**
(step 5 skipped, or a browser you forgot about) — `loadConfig()` reads
that browser's saved products/categories/combos/announcements/meal
tags/reviews arrays **instead of** the freshly deployed ones, field by
field: `d.products=(u.products||d.products)` in `app.js`, same
`u.X||d.X` pattern for every other catalogue field. It only pulls in
fresh per-field values (price, description, etc.) for products that
already exist by ID in both places; it does not adopt the new
deployment's list itself. A brand-new product won't appear on that
specific browser, and a removed product will keep appearing there,
until that browser's key is cleared. This is exactly the scenario step
5 exists to close, and why it has to happen on every browser that's
used Admin, not just the one that made the latest edit.

### "Copy Full Catalogue JSON" button (implemented)

Step 2 above is now a single click rather than a DevTools console
command — the button lives inside the warning banner on every
catalogue page in Admin. It copies the exact same data
(`localStorage.getItem('jayviStoreV14')`, equivalently the live
in-memory `data` object, since `persist()` writes one from the other),
pretty-printed for readability. This is purely a convenience layer on
top of the same manual procedure: it does not change where data is
stored, how it's published, add any browser-to-browser sync, or remove
any of steps 3–6 above. If clipboard access is ever blocked by the
browser, the button falls back to showing the JSON in a read-only box
so it can still be copied by hand.

---

## V32.5 — corrections and confirmations (read this section first)

This section answers the V32.5 final-review questions directly. Older
sections below (A–AA, from the V32.3 round) are left as historical
record and are only edited where they contained a statement that is
now factually wrong (see the PIN note in section B below) — not
rewritten wholesale.

**1. PIN validation — corrected, no more fail-open.**
V32.5 changed this from what section B below originally documented.
Current, correct behavior:
```
PIN entered
    ↓
Exists in Pincode Master?
    ├── NO  → Not Serviceable ("Delivery is currently unavailable to this PIN code.")
    └── YES
         ↓
      Serviceable?
         ├── NO  → Not Serviceable (same message — we don't expose why)
         └── YES → Show delivery charge + ETA
```
Checkout is also now blocked (`placeOrder()`) unless the currently
typed PIN was actually verified serviceable — closing a gap where an
order could previously be placed with default numbers even after
seeing a "not serviceable" message.

**The one remaining, intentional exception:** if the PIN *lookup
itself* fails — a genuine Supabase/network/infrastructure error, not a
bad PIN — checkout still fails open with the generic estimate, exactly
as before. This is a different failure mode from "PIN not in master"
and is not affected by the fix above; `verifyPincode()` in `app.js` has
a code comment marking exactly where this branch is.

**2. SQL for this round — confirmed, exactly one new file.**
```
supabase_migration_state_delivery_defaults.sql
```
This is additive only: 4 new nullable columns on `delivery_states` +
an updated `check_pincode()` function. It does not touch, drop, or
rewrite any row in `pincodes`. You do **not** need to rerun the PIN
master schema, the 19,299 PIN seed files, notifications, account
recovery, order state machine, or reviews migrations — all already
applied and untouched by V32.5.

**3. State-level delivery defaults — confirmed resolution order.**
```
PIN-specific value → if not set → State default → if not set → null
```
Implemented in `check_pincode()` as
`coalesce(pin's own column, state's default column)`. Verified against
your Karnataka example: a Karnataka PIN with no override resolves to
the state's default charge/ETA/courier; a PIN with its own value set
(e.g. `560002`) keeps that value regardless of the state default.
Adding/editing state defaults only writes to `delivery_states` — no
`pincodes` row is touched. **Free delivery above ₹599 applies
regardless of state/PIN delivery charge** — `effectiveShipping()` in
`app.js` checks the free-shipping threshold before ever looking at a
configured charge, so this holds for every state/PIN, not just ones
without a configured charge.

**4. Admin password reset — Edge Function confirmed.**
Function name: `admin-reset-password` (unchanged — this is the
existing function, not a new one). Deploy/redeploy with:
```
supabase functions deploy admin-reset-password
```
This must be (re)deployed for the V32.5 CORS fix in
`supabase_functions/admin-reset-password/index.ts` to take effect — if
it's never been deployed at all, or was deployed before this fix, the
old behavior (or the "Failed to fetch" you saw) will still occur until
you run the command above. The frontend (`admin.js`) never reports
success unless the Edge Function itself returned a real success
response; a genuine "can't reach the function" failure now says so
explicitly ("Password was NOT changed — could not reach the
admin-reset-password function…") instead of a bare `Failed to fetch`.

**5. Product catalogue architecture — confirmed unchanged in V32.5.**
No migration attempted. See the new file
`FUTURE_product_catalog_migration.md` for the documented future
requirement (central Supabase Product Master) — nothing in that
document has been implemented; it's a plan for a future round only.

**6. Peanut Chutney media — code fix shipped, data check is on your side.**
The counter/scroll desync bug (`cardMediaMarkup()`'s error handler) is
fixed and is fully data-driven — it will behave correctly for one
media item (static), multiple valid items (scrolls), or a mix with
some broken paths (recalculates live, never left over-claiming a
count). I cannot inspect your live Supabase/localStorage product data
from here, so please confirm in Admin → Products → Peanut Chutney that
its media filenames are filled in the same way as the other three
products, the same way you'd confirm this for any other product.

---

This release works through the complete approved A–AA specification, not
just B/K/R. Per the explicit instruction accompanying this request, I am
distinguishing **"implemented in code"** from **"verified end-to-end"**
throughout — several items below are code-complete but need your live
testing before being called production-ready, and I say so plainly
rather than rounding up.

## Database migrations for this release (apply in this exact order)

Assumes `supabase_schema_phase1_v3.sql`, `supabase_migration_reviews_v32_1.sql`,
`supabase_migration_pincodes_schema.sql` + `supabase_seed_pincodes_01_states.sql`
through `supabase_seed_pincodes_21.sql`,
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

Fail-open behavior for unmatched PINs was **removed in V32.5** — see
the "V32.5 — PIN validation corrected" section further down in this
file for the current, correct behavior. State disable/individual PIN
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
4. Checkout with a PIN in a disabled state, and separately a PIN that
   does not exist in the master at all (e.g. `000000`) → both must show
   the same generic "Delivery is currently unavailable to this PIN
   code" message, no internal detail leaked, and checkout must not be
   submittable until a serviceable PIN is verified (V32.5).
4a. Checkout with total ≥ ₹599 on a PIN/state that has a configured
   delivery charge → confirm shipping still shows FREE (V32.5 — free
   delivery above the threshold applies regardless of any configured
   charge).
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
15. On Products (and Variants/Combos/Categories/Meal tags) → click
    "📋 Copy Full Catalogue JSON" → paste into a text editor → confirm
    it's the complete current data (all your products, categories,
    combos, meal tags, announcements, and store settings — not just
    one section), matching what `localStorage.getItem('jayviStoreV14')`
    would show in DevTools.
16. Run `node verify_config_schema.js` from the project root → confirm
    it reports success. Settings → Store Operations → confirm the new
    "Delivery enabled" toggle is present, reflects the current state,
    and Save persists it correctly.

**Regression**
17. Full guest and signed-in checkout, both payment methods, still
    complete successfully end to end.
18. Existing approved reviews, existing orders, existing customers
    from before this round are all still visible and correct in Admin.

If anything above doesn't match, tell me exactly which numbered item —
same process as every round in this project.
