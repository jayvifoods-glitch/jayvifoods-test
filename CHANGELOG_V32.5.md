# Jayvi Foods v32.5 — Targeted fix round (Priority 1 & 2)

Full round: all twelve confirmed findings, Priority 1 through 5. No
unrelated refactoring, no changes to authentication, no PIN master
data changes, and no destabilizing database restructuring — the one
new migration (below) is purely additive.

Files changed: `app.js`, `admin.js`,
`supabase_functions/admin-reset-password/index.ts`, `index.html`,
`admin.html` (cache-busting version bump only).

**One new SQL migration to run:**
`supabase_migration_state_delivery_defaults.sql` — additive only (4
new nullable columns + an updated `check_pincode()` function). Run it
once, after your existing pincode-schema and order-state-machine
migrations are already applied. **No other SQL migration was changed**
— the existing 19,299-PIN master and schema are otherwise untouched.

---

## 🔴 Priority 1

### 1. PIN-code validation was too permissive — FIXED

**Root cause:** `verifyPincode()` in `app.js` had a "fail open" branch
for PINs not found in the master, left over from an earlier explicit
V32.2/V32.3 instruction to never block checkout over a data gap. That
instruction is superseded by this ticket: a nonexistent PIN must never
show a deliverable estimate.

**Fix:**
- PIN not found in the master → now shows *"Delivery is currently
  unavailable to this PIN code."* — no more fallback to the generic
  4–8 day estimate.
- PIN found but not serviceable → same message (unchanged behavior,
  wording now matches the PIN-not-found case so customers can't tell
  the two apart, which is intentional — we don't expose *why*).
- PIN found and serviceable → unchanged (shows the real charge/ETA).
- **New:** `placeOrder()` now hard-blocks submission unless the
  currently-typed PIN was actually verified as serviceable in this
  session. Previously, a customer could see "not serviceable" and
  still successfully place an order (using default shipping/ETA
  numbers) because nothing stopped the checkout form itself. This
  closes that gap.
- Left deliberately unchanged: if the PIN *lookup itself* fails
  (network/infra error, not a bad PIN), checkout still fails open with
  the generic estimate — that's a different, pre-existing, intentional
  design decision this ticket didn't ask to change.

**Please verify:** `000000` and any other 6-digit number not in your
PIN master → should now show "Delivery is currently unavailable to
this PIN code" and the order should not be placeable until a real,
serviceable PIN is entered and re-verified.

### 2. Retry Payment for pending-payment orders — FIXED

**Fix:** Customer Account → Orders → open a `Payment Pending` (or
`Payment Failed`) order now shows a **Retry Payment** button.
Tapping it re-fetches the order fresh, then reopens the existing UPI
payment screen (QR + UTR field) for that **same order number**.

- `retryPayment()` never calls `place_order` — there is no code path
  by which this can create a duplicate order.
- It re-checks the order's current status before reopening payment: if
  Admin already verified/moved the order in the meantime, the customer
  gets a message instead of a stale payment screen.
- Payment method is UPI-only for now, matching the current
  single-method checkout, exactly as scoped. The function is written
  so that when a second payment method is added later, it can branch
  on the order's own `payment_method` instead of assuming UPI —
  flagged in a code comment for that future work.

**Please verify:** place an order, close the UPI payment screen without
paying → Account → Orders → open that order → Retry Payment → same
order number, same amount, "I have paid" still moves it to `Payment
Verification` correctly.

### 3. Admin password reset "Failed to fetch" — FIXED (code), deployment still required

**Root cause found:** `supabase_functions/admin-reset-password/index.ts`
never answered CORS preflight (`OPTIONS`) requests and never sent an
`Access-Control-Allow-Origin` header on any response. Because
`admin.js` calls it with a custom `Authorization` header, the browser
sends a preflight `OPTIONS` request first — with no CORS headers
answering it, the browser blocks the whole request client-side and
`fetch()` throws exactly the reported `TypeError: Failed to fetch`,
before the POST ever reaches the function's own logic.

**Fix:** the Edge Function now answers `OPTIONS` and sends CORS headers
on every response (success and error alike). Also hardened the
`req.json()` parsing (a malformed body no longer throws an unhandled
error) and the frontend catch block now says plainly that the password
was **not** changed and suggests checking deployment, instead of a bare
error string.

**⚠️ Deployment dependency — action required on your side:**
This code fix only takes effect once the function is deployed. Per
`DEPLOY.md`, this function's live status was already flagged as
"genuinely blocked on live end-to-end testing until you deploy
admin-reset-password" in the V32.3/V32.4 notes — that has not changed
in this round. **Please run:**
```
supabase functions deploy admin-reset-password
```
If it's already deployed, redeploy it now so it picks up this CORS
fix — the old deployed version (if any) still has the bug.

**Please verify:** Admin → a customer → Reset Password → enter a new
password → should now either succeed with "Password reset
successfully" or fail with a specific, readable error (not a bare
"Failed to fetch").

---

## 🔴 Priority 2

### 4. Product count differs between mobile and desktop — INVESTIGATED, root cause identified, not a code bug in the responsive layout

**Finding:** There is no device-conditional or viewport-conditional
logic anywhere in the product-filtering/rendering code
(`sync()`, `renderProducts()`, `productCard()`) — confirmed by full
trace. The actual cause is architectural: **the product catalogue is
stored in each browser's own `localStorage`** (key `jayviStoreV14`),
not in a shared database. This is the existing, documented "Git-managed
catalogue" architecture (see `persist()` in `admin.js`), not something
this ticket asked to change.

Practically: if a product is added/edited from the Admin panel on one
device/browser, that device's `localStorage` updates — but no other
device (or even a different browser on the same device) ever receives
that change until it's manually synced back into the shipped
`app.js` config. This fully explains "desktop shows 4, mobile shows
5" without any responsive-layout bug — the two sessions simply have
two different local copies of the catalogue.

**Not fixed in this round, by design:** making this consistent for
real would mean migrating the product catalogue to Supabase (the same
way orders, customers, and pincodes already are) — a genuine database
migration, not a targeted fix, and explicitly out of scope ("do not
introduce unnecessary database restructuring," "do not refactor
unrelated components"). Flagging this clearly rather than quietly
patching around it.

**Recommended next step (separate from V32.5):** decide whether to
migrate `products`/`categories`/`combos` into Supabase tables (mirroring
the pincode/orders pattern) so Admin edits are instantly visible
everywhere. Happy to scope that as its own change once you've reviewed
this.

### 5. Combo Add to Cart behavior — FIXED

**Root cause:** `addCombo()` explicitly called `openCart()` after
adding — a straight code difference from `addToCart()`, which
(per the existing "Item S" spec already in the codebase) deliberately
does *not* open the cart, showing a toast instead. Combos also never
had a quantity stepper — the combo card's action buttons were static
HTML, always "Add to cart / Buy now" regardless of what was already in
the cart.

**Fix:**
- `addCombo()` now shows the same toast as every other product and
  never opens the cart automatically.
- Combo cards now show a `-  qty  +` stepper (identical pattern/markup
  to product cards) once the combo is in the cart, with a "view cart"
  shortcut — via new `cartQtyForCombo()` / `changeComboQty()` helpers.
- `buyCombo()` is unchanged (still correctly goes straight to
  checkout, matching `buyNow()`).

**Please verify:** add the combo to cart from the storefront → stays on
the combo section, shows the toast, quantity stepper appears on the
combo card; +/- adjusts quantity; "Buy now" still jumps to checkout.

### 6. Newly added products missing quantity controls — FIXED (real root cause was not "newness")

**Root cause found:** the bug has nothing to do with a product being
new. `productCard()` (the storefront grid) was already fully
data-driven and already correctly switches between "Add to cart" and
the `-/+` stepper based on cart contents — that part worked for every
product, new or old.

The actual bug is in the **product detail modal** (`openProduct()`):
its Add to cart / Buy now buttons were static HTML that never
re-rendered after adding to cart — for **any** product. Testing mostly
happens via the grid cards (which worked), so this only surfaced when
someone tested a specific product — in this case a newly added one —
through the detail overlay instead.

**Fix:** the detail modal now tracks which product it's currently
showing (`openProductId`) and every cart-mutating action
(`addToCart`, `changeProductQty`, `buyNow`, and the cart drawer's own
`changeQty`/`removeCart`) refreshes it if it's open for that product.
The modal's buttons are now data-driven exactly like the grid card —
no product ID is hardcoded anywhere, so this works automatically for
every product you add in future, per the requirement.

**Please verify:** open any product's detail view → Add to cart from
inside that modal → modal should immediately switch to the `-/+`
stepper without closing/reopening it. Repeat with a **brand-new**
product created fresh in Admin.

### 7. Product image navigation inconsistency (Peanut Chutney) — FIXED (a real code bug) + data check needed

**Root cause found in code:** in `cardMediaMarkup()`, if any individual
image in a product's gallery failed to load (wrong path, missing file),
the broken slide was silently removed from the DOM — but the slide
counter (`data-count`, the "1 / N" badge) was never updated to match.
A product configured with, say, 4 gallery images where 3 have bad
paths would silently end up with only 1 actual slide in the DOM (so no
scrolling is possible) while still claiming "1 / 4" — i.e., exactly
the "doesn't scroll, others do" symptom, and it can happen to *any*
product depending on which image paths are actually valid, not
something specific to Peanut Chutney by product ID.

**Fix:** broken images now correctly recompute the live count and
either update the "1 / N" badge or remove it entirely once only one
slide remains — fully automatic, no per-product exception, works the
same for every current and future product.

**Data check still needed on your side:** this code fix makes the
*symptom* (looks static when it should scroll) impossible going
forward, but if Peanut Chutney's actual image files are genuinely
missing/misconfigured in Admin → Products → Peanut Chutney → Product
media, it will now correctly show fewer images rather than a
mismatched counter — but it still won't show images that don't exist.
Please open Peanut Chutney in Admin and confirm all four media
filenames (hero / front-back / ingredients / serving) are filled in
and the files exist in `images/products/peanut/`, the same way they
are for the other three products.

**Please verify:** Peanut Chutney's card on both mobile and desktop —
should scroll through the same number of images as Flaxseed/Pudi/
Puffora once the media fields are confirmed.

---

## 🟡 Priority 3 — Delivery configuration enhancement

### 8 & 9. State-level delivery defaults with PIN-level override — FIXED

**New migration required:** `supabase_migration_state_delivery_defaults.sql`
(new file). Run it once, after the existing pincode-schema and
order-state-machine migrations. It only:
- adds four **nullable** columns to `delivery_states`
  (`default_delivery_charge`, `default_min_eta_days`,
  `default_max_eta_days`, `default_courier_partner`)
- updates `check_pincode()` to resolve `coalesce(pin's own value, state
  default)` for delivery charge / min ETA / max ETA / courier partner

**Nothing else changes.** The 19,299-row PIN master is untouched — no
column dropped, no row rewritten. A PIN that already has its own
delivery_charge/ETA/courier keeps using exactly that value; only PINs
that leave those fields blank pick up the state default. This matches
the requested architecture exactly:

```
Karnataka: ₹40 default, 4–6 days, courier X
Kerala:    ₹60 default, 5–8 days, courier Y
→ individual PINs can still override any of these
```

**Admin UI (`admin.js` → Delivery / Pincodes):**
- Each state row now shows its current defaults inline (or "No state
  default set") and has a **Set defaults / Edit defaults** button.
- The "+ Add PIN code" form now shows what each blank field will
  actually inherit from the state's default, so Admin isn't guessing.

**Also fixed as part of this (not a new bug, but directly relevant to
item 8's explicit requirement):** `effectiveShipping()` in `app.js`
was ignoring the free-shipping threshold whenever a PIN had *any*
non-null delivery charge — so an order well above ₹599 could still be
charged shipping just because its PIN had a configured charge. This
was a latent issue before, but state-level defaults mean almost every
PIN will now resolve to a non-null charge, which would have made the
bug far more common. Fixed: free delivery above the configured
threshold now always applies, regardless of any PIN/state charge,
exactly per *"Free delivery above ₹599 remains applicable across
states."*

**Please verify (after running the new migration):**
1. Admin → Delivery / Pincodes → a state → Set defaults → enter a
   charge/ETA/courier → Save.
2. Check a PIN in that state that has never had its own
   charge/ETA set → storefront checkout should now show the state's
   default instead of the old generic 4–8 days.
3. Set that one PIN's own charge to something different → confirm the
   PIN-level value wins over the state default.
4. Add enough items to clear ₹599 → confirm shipping shows FREE even
   for a PIN with a configured charge (regression check for the fix
   above).

---

## 🟡 Priority 4 — Admin communication improvement

### 10. WhatsApp → Copy Message fallback — FIXED

**Fix (`admin.js`):** the order detail view's customer-update section
now has two buttons side by side: **WhatsApp Customer** (unchanged)
and a new **Copy Message** button. Both are built from the exact same
`buildStatusMessage()` helper reusing the existing standard,
status-specific templates — refactored out of `manualWhatsApp()`
so there is only ever one message per status, never two versions
drifting apart.

- Copy Message writes the message straight to the clipboard
  (`navigator.clipboard`, with an `execCommand` fallback for older
  browsers) and shows a toast confirming the copy — Admin then pastes
  it into SMS, email, or wherever else.
- If copying genuinely fails for some reason (e.g. clipboard
  permission blocked), it shows the message in a plain read-only box
  instead of failing silently, so Admin can still copy it by hand.
- Deliberately does **not** attempt to detect whether WhatsApp is
  installed, exactly as scoped — it's a simple, always-available
  fallback, not conditional logic.

**Please verify:** open any order → Copy Message → paste somewhere
(e.g. Notes app) → confirm the text matches exactly what WhatsApp
Customer would have sent for that order's current status.

---

## 🟢 Priority 5 — Verify only, re-confirmed, no changes made

### 11. Dispatch-date ETA calculation

Re-checked `formatDynamicEta()` in `app.js`: it computes the shown
delivery window from the order's own `dispatch_date` plus its stored
`eta_max_days`, not from the original order date. Behavior matches
the spec exactly (dispatch Aug 10 + 0–8 days → Aug 10–Aug 18). No
change made.

### 12. Admin dashboard vs. email notification

Per `DEPLOY.md`'s existing K-item notes, dashboard notifications are
already confirmed working and unchanged. Email notification requires
deploying the `send-order-notification` Edge Function and configuring
a **real** Resend sender domain — `DEPLOY.md` currently still has the
literal placeholder `notifications@yourdomain.example` in that
function, confirming email notification is a deployment/configuration
step you haven't done yet, not a code defect. No change made to the
existing dashboard notification implementation, per the instruction.

---

## Full regression checklist for this round

- [ ] Non-serviceable / nonexistent PIN blocks checkout with the
      correct message (item 1)
- [ ] Serviceable PIN still shows correct charge/ETA and lets checkout
      proceed (item 1, regression)
- [ ] Retry Payment on a Payment Pending order reopens the *same*
      order, no duplicate created (item 2)
- [ ] Admin password reset gives a real success or a specific error,
      after redeploying the Edge Function (item 3)
- [ ] Combo add-to-cart stays on page, shows toast, gets a qty stepper
      (item 5)
- [ ] Detail-modal add-to-cart updates in place, tested on a
      brand-new product (item 6)
- [ ] Peanut Chutney gallery scrolls once media fields are confirmed
      in Admin (item 7)
- [ ] State defaults apply to PINs with no override, PIN-level
      override still wins, free delivery above ₹599 still applies
      even when a charge is configured (item 8/9)
- [ ] Copy Message produces the exact same text as WhatsApp Customer
      for the same order status (item 10)
- [ ] Existing V32.4 flows unaffected: customer login/registration,
      normal add-to-cart from the grid, order cancellation, order
      tracking, checkout for a serviceable PIN, Admin login

## Migration checklist for this round

Run once, in order, if not already applied from earlier rounds:
1. `supabase_migration_pincodes_schema.sql` (earlier round — skip if
   already applied)
2. `supabase_migration_order_state_machine.sql` (earlier round — skip
   if already applied)
3. **`supabase_migration_state_delivery_defaults.sql` (new, this round)**

Then redeploy the Edge Function so it picks up the CORS fix:
```
supabase functions deploy admin-reset-password
```
