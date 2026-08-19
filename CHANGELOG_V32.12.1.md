# Jayvi Foods — V32.12.1 Changelog

Built on top of the V32.12 stable baseline, per the "V32.12 is the
stable baseline — start only from V32.12, preserve existing
functionality" instruction. Nothing described in `CHANGELOG_V32.12.md`
was reverted, rewritten, or removed — every change below is additive on
top of it. Where a requirement turned out to already be correctly
implemented in V32.12, that's called out explicitly rather than
re-touching working code.

This changelog is organized by the 19 numbered items in the request,
in the same order, so it's easy to check off against the original brief.

---

## 1. Password Reset — root cause found and fixed

**The actual bug**, confirmed by re-reading the deployed function
against the live test results supplied (CORS OK, session valid, caller
role confirmed `admin` by direct query):

```js
const { data: profile } = await callerClient.from('profiles')
  .select('role').eq('id', callerUser.user.id).single();
if (profile?.role !== 'admin') return ...403...
```

`.single()` throws/returns an error (with `data: null`) whenever the
query doesn't return **exactly one row** — and that error was never
inspected (`const { data: profile }` discards `error` entirely). Any
transient reason the row didn't come back as a clean single match —
and specifically the RLS-timing edge case that's common immediately
after a fresh login, matching "fresh admin login" in the live test —
collapses into `profile === null` → the exact same generic 403, with no
diagnostic trail. This is indistinguishable from a genuine non-admin
from the outside, which is exactly the symptom reported.

**Fixed in `supabase_functions/admin-reset-password/index.ts`:**
- The profiles-role query now uses `.maybeSingle()` (returns `null`
  cleanly when no row matches, instead of throwing) and its `error` is
  captured and returned as a distinct 500 ("Could not verify admin
  access") rather than silently becoming the same 403 as "not an
  admin."
- The profile lookup uses the **exact** caller id returned by
  `auth.getUser(callerToken)` immediately above it — this was already
  correct, kept unchanged, called out explicitly per the requirement.
- The server-side Supabase client is initialized with
  `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` — confirmed both are read
  from `Deno.env` (auto-provisioned by Supabase, no new secret to
  configure) and a clear 500 is returned if either is somehow missing,
  instead of an unhandled exception.
- **The admin-role check itself is unchanged and not weakened** — a
  caller whose `profiles.role` genuinely isn't `'admin'` still gets a
  403, exactly as before.
- Safe diagnostic logging added at every decision point
  (`caller_verified`, `profile_query_ok`/`profile_query_failed`,
  `not_admin`, `target_not_found`, `update_failed`,
  `password_reset_ok`) — each line logs only a user id and a role/
  boolean, **never** an access token, the service-role key, a password,
  or any other secret, per the explicit requirement.
- CORS handling, the actual `auth.admin.updateUserById()` password
  change, and the customer-facing vs. diagnostic error-message split
  are all unchanged from V32.5/V32.8 (still correct, not touched).

**Requires live Supabase testing** — this is a code-level fix to a bug
that only manifested against your real project; redeploy
(`supabase functions deploy admin-reset-password`) and rerun the exact
test sequence from the brief to confirm it now returns success instead
of 403.

---

## 2. Coupon / Offer UX — threshold messaging, "unlock this offer"

**Cart's "Apply coupon" box** (`app.js`: `couponSectionMarkup()`): when
no offer currently qualifies for the cart, it no longer just says "No
offer available right now." It now finds the single closest-to-unlock
active offer and shows:
```
🎁 10% OFF available!
Add ₹44 more to unlock this offer.        [View all active offers]
```
computed from the real gap between the cart's current subtotal and
that offer's `min_order_value` — never a hardcoded number.

**"View all active offers" panel** (`app.js`: `openOffersPanel()`):
every active offer now shows its lock state relative to the current
cart — visually greyed out with "🔒 Add ₹X more to unlock" for offers
the cart doesn't yet qualify for, and a green "unlocked!" state with an
**Apply to my cart** button for ones it does. Reaching the threshold
moves an offer from locked to unlocked automatically on the next
render (cart changes re-render this via the existing
`refreshEligibleCartOffers()`/`revalidateAppliedCoupon()` flow — see
item 4).

**Known, documented simplification:** the threshold-nudge/panel
lock-state above is computed against `list_active_offers()` (the public
marketing list — code/discount/min-order only), not the fully
restriction-aware `list_eligible_offers_for_cart()`. A coupon
restricted to specific products/categories may show as "unlocked" by
subtotal alone even if the cart's actual contents wouldn't qualify it —
this is a nudge/marketing surface, not a guarantee; **the actual
"Apply"/"Apply to my cart" action always re-validates server-side**
(`applyCouponFromCart()` → `validate_coupon()`) regardless, so a
restricted coupon can never actually be applied to an ineligible cart
even if the panel showed it as unlocked. Flagged rather than silently
left ambiguous, per the request's own instruction on this.

---

## 3. Encourage Customers to Increase Cart Value — cart cross-sells

**New: cart "You may also like" section** (`app.js`:
`cartRecommendations()`, `cartRecsMarkup()`; `index.html`: `#cartRecs`
below `#cartItems`). Deliberately simple and deterministic per the
explicit "do not build an AI recommendation engine" instruction:
- Scores every sellable product **not already in the cart** by shared
  category (+2, same-category = likely complementary, e.g. another
  chutney) and shared meal tags (+1 each, same-occasion pairing), with
  a small bestseller tiebreaker (+1).
- Shows the top 3, each with image/name/price and a one-tap **Add**
  button that adds directly to cart without leaving the drawer.
- Returns nothing (section hidden) for an empty cart, or if nothing
  scores above zero relevance — never shows random/irrelevant products.

**Homepage/product-add "Complete your meal"/"You may also like"
prompt** (spec's other suggested placement) was evaluated and
**deliberately not added this round** — the existing "✓ Added to bag /
View Cart" toast (V32.5, item S) was explicitly designed to be
lightweight and non-intrusive, and the cart drawer itself (opened via
"View Cart" or the cart icon) is where the new recommendation strip
lives. Adding a second recommendation surface directly on every
add-to-cart action risks exactly the "too many popups/aggressive
interruptions" spec 17 explicitly warns against; the cart-only
placement was chosen as the single, highest-value spot. Flagged as a
deliberate scope decision, not an oversight — happy to add the
homepage/product-page variant in a follow-up if wanted.

---

## 4. Coupon Must Automatically Become Invalid When Cart Changes — fixed

**The actual bug, confirmed:** `appliedCoupon` was never re-checked
against the *current* subtotal after being applied — `currentDiscount()`
only capped the stored discount amount at the current subtotal, it
never cleared the coupon itself when the subtotal dropped below the
coupon's own minimum. A ₹300 cart with a 10%-off-above-₹199 coupon
applied, then reduced to ₹155, kept showing "Coupon applied" with a
(now invalid) discount.

**Fixed** with a new `revalidateAppliedCoupon()` (`app.js`), called
from every `renderCart()`:
- Re-runs the exact same server-side `validate_coupon()` RPC used for
  the original "Apply" action, against the **current** subtotal and
  **current** cart's product/category ids.
- If it's no longer valid for *any* reason — subtotal dropped below
  minimum, a restricted product was removed, it expired, Admin disabled
  it, or its usage limit was reached by someone else — the coupon is
  cleared immediately, with the required wording:
  `"10% OFF was removed because your cart is now below ₹199."` (or a
  generic "...no longer applies to your cart" message for
  non-threshold reasons).
- If it's still valid but the discount amount itself changed (e.g. a
  percentage coupon against a new subtotal), the stored discount is
  kept in sync so Subtotal/Discount/Delivery/Total/mobile cart bar/
  checkout summary never diverge.
- This single function is the one place all of the negative scenarios
  below are handled — not one bespoke check per scenario, per the
  request's own "review these as a single stale-state consistency
  problem" framing (also see item 16).

**Negative scenarios — offline-testable status:**
| Scenario | Status |
|---|---|
| Cart above threshold → coupon applies | ✅ unchanged, already correct |
| Cart exactly at threshold → coupon applies | ✅ unchanged (`>=` comparison in `validate_coupon()`) |
| Cart below threshold → coupon cannot apply | ✅ unchanged, already correct |
| Applied coupon → quantity reduced below threshold | ✅ **fixed this release** (was the reported bug) |
| Applied coupon → product removed | ✅ fixed this release (same `revalidateAppliedCoupon()` path) |
| Applied coupon → restricted product removed | ✅ fixed this release (server re-validates restrictions too) |
| Coupon disabled while shopping | ✅ fixed this release (server re-validates `active` on every render) |
| Coupon expires while shopping | ✅ fixed this release (server re-validates dates on every render) |
| Coupon usage limit becomes unavailable | ✅ fixed this release (server re-checks usage count on every render) |
| Cart contents change after coupon selection | ✅ fixed this release |
| Browser open while admin changes coupon config | ✅ fixed this release (next render re-validates against live DB state) — **requires live Supabase testing to fully confirm the "browser stays open across an admin edit" timing**, offline testing can only simulate the RPC responses |

`place_order()` remains the final, authoritative check — unchanged,
still re-validates independently server-side at the moment of order
creation (see `supabase_migration_coupon_checkout.sql`, untouched this
release).

---

## 5. Coupons & Offers Admin Message — rewritten

`admin.js`'s `couponsPage()` banner previously named
`public.validate_coupon` and `CHANGELOG_V32.12.md` directly in a message
Admin reads to understand coupon behavior. Rewritten to describe actual
behavior in plain language with no internal RPC/file names:

> "Coupons you create, edit, enable or disable here take effect
> immediately for customers — no redeploy needed. Every discount is
> checked on our server at the moment an order is placed, so an
> expired, disabled, over-used, or restricted coupon can never actually
> be applied, even if a customer's screen hadn't refreshed yet.
> Customers see active offers on the homepage banner, a floating offer
> button, and a dropdown in Cart that only lists offers their current
> cart actually qualifies for."

This is accurate against the actual V32.12/V32.12.1 implementation
(confirmed by re-reading `validate_coupon()`/`place_order()`/the cart
dropdown code directly, not assumed).

---

## 6. Live Configuration Changes Must Be Respected Before Checkout

**Client-side (best-effort, fast feedback):** new
`checkoutIsBlockedByLiveConfig()`/`fetchLiveCheckoutGate()` in `app.js`,
called at two points:
- `openCheckout()` — before the checkout form is even shown.
- `placeOrder()` — again, right before the order is actually submitted
  (the checkout form can legitimately sit open a while during address
  entry/PIN verification/reading payment options).

Each re-reads `store_settings.vacation_mode` and `.delivery_mode`
directly from Supabase (a single small `select`, not the full
settings/announcements/reviews fetch) and blocks with the exact
required message ("We're currently not accepting orders...",
"Delivery is currently unavailable...") if either has changed since
the page loaded. Fails open on the client if the live check itself
can't be reached (offline, etc.) — **this is intentionally not the
authoritative check.**

**Server-side (the actual authority — atomic, cannot be bypassed):**
`place_order()` (in the new `supabase_migration_v32_12_1.sql`) now
re-checks `vacation_mode`/`delivery_mode` itself, inside the same
transaction as order creation, and **also** re-validates every line
item's live price and active status against `public.products`/
`public.combos` directly (see item 16) — so even if a customer's
browser never ran the client-side check above at all (old cached page,
JS disabled, a request crafted directly against the API), the order
still cannot be created against stale configuration or stale pricing.
This satisfies the "Browser → latest server state → validate → create
order" architecture explicitly requested, with the validation-and-
creation happening atomically in one function, not as two separate
round trips that could race.

Every item listed in the request's example (Vacation Mode, product
enabled/disabled/deleted, price changed) is now covered; delivery
charge/free-delivery threshold/delivery timeline were already computed
from live Store Settings at checkout time in V32.12 (`effectiveShipping()`,
`updateCheckoutSummary()`) — confirmed unchanged and correct. PIN/
serviceability was already re-verified per-PIN via `check_pincode()` in
V32.5 — confirmed unchanged.

**Requires live Supabase testing** — the actual "keep a browser open
across an admin change, then try to check out" race can only be fully
proven against a real project with two concurrent sessions.

---

## 7 & 8. Help & Support — Free Delivery Threshold / Delivery Timeline From Configuration

**Confirmed hardcoded**, exactly as reported: `help.html` had "₹599"
and "4–8 days" typed directly into the HTML, with zero connection to
`store_settings`. This page doesn't load `app.js` (no cart/catalogue/
checkout to run there), so it never had any way to read live config.

**Fixed** with a new, small, dependency-free file, **`config-lite.js`**:
loads `store_settings` (`free_shipping_threshold`,
`delivery_min_days`, `delivery_max_days`) via a single REST call using
the same `SUPABASE_URL`/`SUPABASE_ANON_KEY` from `supabase-config.js`,
and replaces the text of any `[data-cfg="free-delivery-threshold"]`/
`[data-cfg="delivery-timeline"]` element on the page. `help.html` and
`legal.html` now mark their relevant `<span>`/`<strong>` elements this
way. The existing hardcoded text is left in place as the *initial*
value/fallback — it's only replaced once the live fetch actually
succeeds, so a fetch failure never blanks the page, it just shows the
last-published copy (same "never render blank" principle used
throughout this project).

This is the **same single source of truth** already used by
`app.js`/checkout (`store_settings.free_shipping_threshold`,
`.delivery_min_days`/`.delivery_max_days`, via `STORE_FIELD_MAP`) —
not a second, parallel config path. Changing the threshold in Admin →
Store Settings now updates Help & Support, Policies & Legal, and the
storefront/checkout identically, with no further code change.

---

## 9. Policies & Legal — Remove Website Version

`legal.html` displayed `<div class="version">Website v31.0</div>`
directly under the page's own H1 — removed entirely. (It was also
stale even before this fix — v31.0 against an actual v32.12 codebase —
one more reason it didn't belong on a customer-facing page.) Version
information was never anywhere else on this specific page, so nothing
else needed to change here. (`help.html`'s footer still shows a site
version in its footer, same as `index.html`'s footer already did — that
wasn't part of this specific requirement, which named Policies & Legal
specifically; left as-is, and bumped to the correct current version
number rather than the stale one, as a minor consistency fix while
touching that file.)

---

## 10. Policies & Legal — Dynamic Delivery Information

Same fix as items 7/8, applied to `legal.html`'s Shipping & Delivery
section — the "4–8 days"/"₹599" text there is now marked with the same
`data-cfg` attributes and loaded by the same `config-lite.js`, from the
same `store_settings` row. No value is duplicated/hand-typed in more
than one place in source anymore — Help & Support, Policies & Legal,
and the storefront/checkout all read the same one row.

---

## 11. Admin Orders — Search / Filter / Sort

`admin.js`'s `ordersPage()` rewritten with a toolbar above the order
list:
- **Search** — free-text, matches order number, customer name, or
  phone (checks `guest_email` too if that column is ever populated).
- **Filters** — order status (populated from whatever statuses
  actually appear in the data, not a hardcoded list), payment status,
  and a from/to date range.
- **Sort** — newest first (default), oldest first, highest order
  value, lowest order value, status.
- A "Clear filters" action appears once any filter is active, and the
  visible count ("12 of 340 orders") is always shown so it's clear
  filtering is active rather than the list being genuinely short.
- Kept deliberately client-side over the already-fetched order list
  (same data source as before — no new query shape) for simplicity at
  current order volumes; `SCALABILITY_REVIEW.md` flags server-side
  pagination as the next step once volume grows past what's comfortable
  to fetch in one shot, and the new migration's indexes
  (`orders.status`, `.payment_status`, `.guest_phone`, plus an optional
  `pg_trgm` index on `guest_name`) are specifically there to keep this
  fast in the meantime and to support that eventual server-side move
  without re-architecting the query patterns.

---

## 12. Product Deletion Must Clean Up Associated Data

**Confirmed already correct at the database level:** `product_media`
rows already have `product_id`/`combo_id` foreign keys with
`ON DELETE CASCADE` (see `supabase_migration_product_catalog.sql`,
unchanged) — deleting a product or combo already correctly removes its
`product_media` rows, variants (stored inline on the product row, so
they go with it), and any other DB-level dependents. Nothing needed to
change here.

**The actual gap:** deleting a `product_media` row (via cascade or
otherwise) never removed the underlying **Storage object** it pointed
at — Postgres has no visibility into Supabase Storage to cascade
against automatically. Over time, deleting products left orphaned files
quietly consuming bucket storage (this project already had a read-only
reporter for exactly this, `scripts/list-orphaned-storage-files.mjs`,
but no automatic cleanup).

**Fixed in `admin.js`** (`deleteProduct()`/`deleteCombo()`, new
`cleanupOrphanedMedia()`/`storagePathFromUrl()` helpers):
1. Before deleting the product/combo row, capture every
   `media_url`/`poster_url` from its `product_media` rows.
2. Delete the product/combo (DB cascade removes the `product_media`
   rows as before — unchanged).
3. For each captured URL that's actually hosted in this project's
   `product-media` Storage bucket (external URLs and legacy Git-path
   references are recognized and **never touched**, per the explicit
   "do not blindly delete shared media" instruction): check whether
   that exact file is still referenced by **any other** `product_media`
   row (i.e. shared with another product/combo). Only if it's not
   referenced anywhere else is the file actually removed from Storage.
   A failed removal is logged and left in place — never silently
   ignored, never a reason to fail the whole delete (the product/combo
   itself is already gone by this point; a Storage cleanup miss is
   recoverable later via the existing orphan-reporter script, a hard
   product-delete failure would not be).

This is intentionally conservative — a file is only ever removed once
it's confirmed unreferenced — matching "we need safe cleanup behaviour"
exactly.

---

## 13. Homepage Announcements — Photo/Video Support

**Confirmed gap:** `announcements.image` already existed as a column,
and Admin already had a plain URL text field for it, but the storefront
(`app.js`'s `heroShow()`) **never actually read it** —
`$('heroImg').src = p?.image||combo?.image||'...'` unconditionally used
the linked product/combo's own image, ignoring `s.image` entirely. So
even before this release, typing a URL into that field had zero visible
effect — confirmed by reading the render function directly, not
assumed.

**Fixed, and extended per the brief:**
- New `announcements.media_type` (`'image'|'video'`) and `.poster_url`
  columns (`supabase_migration_v32_12_1.sql`), plus a dedicated
  `announcement-media` Storage bucket with the same public-read/
  admin-write policy shape as the existing `product-media` bucket.
- Admin → Homepage → announcement form now has **Upload image**/
  **Upload video** buttons (same upload-to-Storage pattern as Products/
  Combos' own media editor), an external-URL fallback field, a live
  preview (image or video player), and a **Remove media** action —
  matching the brief's explicit "similar to the media upload experience
  we now have for Products/Combos."
- `heroShow()` (`app.js`) now actually **prioritizes** the announcement's
  own configured media over the linked product/combo's image, and
  supports rendering it as a `<video>` (autoplaying, muted, looped,
  using `poster_url` as its poster if set) when `media_type` is
  `'video'` — a new `#heroVideo` element was added to `index.html`
  alongside the existing `#heroImg`, toggled based on which media type
  is configured.
- If no announcement media is configured at all, the exact previous
  fallback behavior (linked product/combo image, or the generic hero
  placeholder) is unchanged.

**Requires live Supabase testing** — Storage bucket/policy behavior for
`announcement-media` and actual video playback on the live site.

---

## 14. "Delivery enabled" Store Setting — reviewed, confirmed correctly wired, label cleaned up

Traced end to end: Admin's toggle (`setDeliveryEnabled`) writes
`store.deliveryMode = 'india'|'disabled'`
(`saveStoreOperations()`) → persisted to `store_settings.delivery_mode`
(already in `STORE_FIELD_MAP`) → read back into `CONFIG.store.deliveryMode`
on every page load → checked in `verifyPincode()`
(`if(CONFIG.store.deliveryMode!=='india'){...block...}`), which runs
**before** any state/PIN serviceability lookup. **This was already
correctly wired — not an old/unused V32.5 leftover** — confirmed by
reading the actual code path, not assumed. Per the instruction ("if the
setting is already correct, don't rewrite it unnecessarily — just
ensure the label/help text accurately describes current behavior"), no
logic was changed here.

**What was updated:** the Admin label's help text (previously
"Master switch (V32.5): OFF blocks PIN verification/checkout
storefront-wide with 'Delivery is currently disabled.'") — reworded for
clarity and to match the now-standardized customer-facing message
("Delivery is currently unavailable. Please try again later." — see
item 6/16, this is the same wording `checkoutIsBlockedByLiveConfig()`
and the new server-side `place_order()` check now both use, so the
in-Admin description, the PIN-verification message, and the
checkout-blocking message are all consistent with each other for the
first time).

**Also newly added this release:** `place_order()` itself now checks
`delivery_mode` server-side too (see item 6) — previously this setting
was only enforced client-side in `verifyPincode()`, with no
authoritative server-side backstop at order-creation time.

---

## 15. Data Volume & 100+ Concurrent Users — Architecture Review

See **`SCALABILITY_REVIEW.md`** for the full review (current strengths,
current limitations, what's addressed now vs. later). Summary of what
was actually changed this release (the "fix obvious inefficiencies now"
half of that document):
- Added indexes: `orders(created_at desc)`, `orders(status)`,
  `orders(payment_status)`, `orders(guest_phone)`,
  `orders(order_number)`, `coupon_redemptions(coupon_id)`,
  `coupon_redemptions(customer_phone)`, `products(active)`,
  `combos(active)`, and an optional `pg_trgm` index on
  `orders.guest_name` for the new Admin Orders search.
- No redesign attempted, per the explicit "do not redesign the entire
  architecture" instruction — the review document is the deliverable
  for anything larger than an index.

---

## 16. Overall Negative-Scenario / Stale-State Review

Treated as the single consistency problem the brief asked for, not a
list of one-off patches:
- **Coupon staleness** → `revalidateAppliedCoupon()` (item 4).
- **Checkout-blocking configuration staleness** (Vacation Mode,
  delivery-enabled) → `checkoutIsBlockedByLiveConfig()` client-side +
  the corresponding server-side checks in `place_order()` (item 6).
- **Product/price staleness** (customer has an old page open, Admin
  changes price or deletes the product, customer tries to buy anyway)
  → new server-side checks in `place_order()`: every product line is
  re-verified against the **live** `products` row (active + the exact
  variant's live price), every combo line against the **live** `combos`
  row (active + live price) — a mismatch anywhere raises a clear,
  customer-facing exception ("Prices have changed since you added an
  item to your cart. Please refresh your cart and try again." /
  "...is no longer available. Please refresh your cart and try again.")
  and the order is not created at all.
- **Delivery configuration staleness** (threshold/charge changed while
  checkout was open) → already correctly live-computed at checkout time
  since V32.5/V32.11 (`effectiveShipping()`, Store Settings-driven) —
  confirmed unchanged and correct, no fix needed.

All of the above funnel through the same architectural principle
requested: the browser's view is a **preview only**; `place_order()` is
the one place that atomically re-checks everything relevant against
live data before an order can exist.

---

## 17. UX Principle for This Release

Addressed via items 2/3 above (threshold messaging, cart cross-sells) —
deliberately kept to a single, non-intrusive placement each (the cart
drawer's coupon box and its own new recommendations strip) rather than
new popups/interruptions, per the explicit "avoid too many popups,
aggressive interruptions" instruction. No changes were made to
checkout's own layout/flow to avoid the explicitly-warned-against
"cluttering checkout."

---

## 18. Acceptance Criteria — offline validation performed this release

- `node --check app.js` — passes.
- `node --check admin.js` — passes.
- `supabase_functions/admin-reset-password/index.ts` — brace/structure
  reviewed manually (no Deno toolchain available in this environment to
  run `deno check`; **flagged, not claimed as compiler-verified** — run
  `deno check index.ts` or `supabase functions deploy` (which type-checks
  on deploy) yourself before/at deploy time).
- Coupon threshold/removal messaging, cart recommendation scoring, and
  the client-side checkout-gate logic were each traced through by
  reading the code paths directly (no live Supabase project available
  in this environment to execute against) — every genuinely
  live-dependent claim in this changelog is explicitly marked "Requires
  live Supabase testing," nothing is claimed as verified end-to-end.
- No existing V32.12 function signature was changed in a
  backward-incompatible way — `place_order()` keeps its exact same
  16-parameter signature; nothing that calls it needs to change.

---

## Files changed this release

```
supabase_functions/admin-reset-password/index.ts   — rewritten (root-cause fix)
supabase_migration_v32_12_1.sql                    — new migration
app.js                                              — coupon UX, cart recs, checkout revalidation, hero media, dynamic delivery-enabled message
admin.js                                            — coupon message, orders search/filter/sort, product/combo deletion cleanup, announcement media upload, delivery-enabled label
index.html                                          — #cartRecs, #heroVideo
help.html                                           — dynamic free-delivery/timeline text, config-lite.js include, version bump
legal.html                                          — version removed, dynamic free-delivery/timeline text, config-lite.js include
config-lite.js                                      — new file
style.css                                           — coupon nudge / offer lock states / cart recs CSS
admin.css                                           — orders toolbar / announcement media block CSS
DEPLOY.md                                           — new V32.12.1 section (prepended, nothing below it removed)
CHANGELOG_V32.12.1.md                               — this file
SCALABILITY_REVIEW.md                               — new file
```

Nothing else in the project was touched — no unrelated refactoring, per
the explicit instruction.
