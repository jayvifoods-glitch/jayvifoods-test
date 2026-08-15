# Jayvi Foods — V32.6 Changelog

Built on top of the stable V32.5 baseline, as a targeted improvement/fix
release. Nothing outside the items below was touched: authentication,
customer/admin login, orders, payment flow, UPI, checkout math, order
state machine, and existing stable mobile UX are all unchanged.

**Per your instructions: this file documents local (code + SQL syntax
and structure) validation only. No live Supabase testing was performed
and none is claimed. You run the SQL and perform live browser/mobile
testing — the checklist at the bottom is for that.**

---

## SQL — exact execution order

Everything below assumes your Supabase project is already at the
V32.5 state (i.e. `supabase_schema_phase1_v3.sql` and every file
already listed in earlier changelogs has been applied — this repo
snapshot doesn't include `supabase_schema_phase1_v3.sql` itself because
it predates this snapshot, but `public.is_admin()`/`public.profiles`
are assumed live, since the existing V32.5 Admin panel already
depends on them).

**New in V32.6 — run these three, in this order (each is independent
of the other two, but this order matches how they're described
below):**

1. `supabase_migration_product_catalog.sql`
2. `supabase_migration_social_links.sql`
3. `supabase_migration_coupons.sql`

No other SQL files changed in this release. `supabase_migration_pincodes_schema.sql`
and `supabase_migration_state_delivery_defaults.sql` were reviewed and
confirmed already correct for items 7 and 10 below — nothing to
re-run.

All three new files are additive and safe to re-run (they use
`create table if not exists`, `create or replace function`, `drop
policy`-free `create policy` guarded by table creation, etc. — re-running
a whole file a second time won't duplicate objects, though re-running
will error on `create policy` if the policy already exists from a first
successful run; this matches every prior migration's pattern in this
repo, so treat these the same way you've treated earlier ones — run
once, and only repeat a specific statement by hand if you need to fix
something).

---

## Post-deployment verification queries

Run these after the three files above, in your Supabase SQL Editor:

```sql
-- Product catalogue
select id, name, active, display_order from public.products order by display_order;
select product_id, combo_id, media_type, media_url, display_order from public.product_media order by product_id, combo_id, display_order;
select id, name from public.combos;
-- Expect: 5 products, 1 combo, every media row pointing at a real
-- images/products/... or images/combos/... path (never images/gallery/...).

-- Social links
select platform, url, enabled, display_order from public.social_links order by display_order;
-- Expect: whatsapp + instagram, both enabled.

-- Coupons (schema only — table starts empty)
select count(*) from public.coupons; -- expect 0 until you create your first one in Admin
select * from public.validate_coupon('ANYTHING', 500, null); -- expect valid=false, reason='Coupon code not found'

-- Confirm PIN validation is still correct (no change made, re-verify only)
select * from public.check_pincode('000000'); -- expect found=false
select * from public.check_pincode('560001'); -- expect found=true (or whatever a real serviceable PIN in your data is)

-- Confirm state defaults are still intact (no change made, re-verify only)
select state, default_delivery_charge, default_min_eta_days, default_max_eta_days from public.delivery_states where default_delivery_charge is not null limit 5;
```

---

## What's Implemented / Partially implemented / Deferred / Requires your action

### 🔴 Must-fix items

| # | Item | Status |
|---|------|--------|
| 1 | Product catalogue → Supabase source of truth | **Implemented.** `products`, `product_media`, `combos` tables; Admin CRUD rewired to Supabase. |
| 2 | Product-specific media folders | **Implemented.** `flaxseed`/`pudi`/`puffora` SVGs moved out of `images/gallery/` into their own `images/products/<id>/` folders. |
| 3 | No gallery fallback | **Implemented.** `DEFAULT_PRODUCT_MEDIA` (the gallery-backed fallback) removed from `app.js`; a product with no media shows an explicit placeholder image only. |
| 4 | Unlimited product media | **Implemented.** `product_media` has no slot limit; Admin's `+ Add Media` list is a plain array. |
| 5 | Unlimited combo media | **Implemented.** Same `product_media` table (`combo_id`), same `+ Add Media` editor component, same storefront `comboMediaMarkup()` navigation — no combo-specific logic. |
| 6 | Combo `-1+` display bug | **Implemented — root cause fixed.** `renderMeal()` was throwing on a product with no valid variant (missing a null-check `productCard()` already had); since `refreshProductViews()` runs `renderMeal()` before `renderCombos()`, that uncaught exception silently blocked the combo card's re-render even though the cart itself had already updated. Fixed the missing null-check, **and** made `refreshProductViews()` isolate each render call in its own try/catch so one broken section can never again block its siblings — not a combo-specific patch. |
| 7 | Unknown/nonexistent PIN must be non-serviceable | **Already correct — re-verified, no change.** `check_pincode()` returns `found=false` for a PIN not in the master; `verifyPincode()` in `app.js` already treats "not found" identically to "not serviceable" and never falls back to a generic ETA. This was fixed in V32.5 (see the inline comments marked "V32.5 fix, Priority 1, item 1") and remains correct in V32.6. |
| 8 | Correct State derivation from PIN master | **Implemented.** New "+ Add PIN code" flow in Admin: typing a PIN looks up existing master rows sharing the same 3-digit prefix; if they agree on one state, it's shown read-only; if they disagree or none exist, Admin must pick from the real list of configured states (never a typed guess). |
| 9 | City/District remains manually entered | **Implemented (confirmed by design).** The PIN master has no city/district column; the new Admin form always requires City/District as free text — never derived. |
| 10 | Fix Load More PIN codes | **Implemented — root cause fixed.** `pincodesPage()` was calling `fetchPincodesForState(state, true)` on every render — including the render that "Load More" itself triggers after incrementing the offset — which reset the offset back to 0 every single time. Changed to `reset=false`; the explicit "expand a state" and "change search" actions already correctly set the offset to 0 themselves. |
| 11 | Sales/revenue analytics correctness | **Implemented.** One shared `REVENUE_ORDER_STATUSES` list (`Order Confirmed`, `Preparing`, `Packed & Shipped`, `Out for Delivery`, `Delivered`, `Delivery Failed`, `On Hold / Manual Review`) is now the single definition used for the Sales KPI, today's sales, and Top Products — excluding `Payment Pending`, `Payment Failed`, `Payment Verification`, `Cancelled`, `Refund Pending`, and `Refunded`. A separate "Refunded" KPI now shows `Refund Pending` + `Refunded` totals so that money is visible, not just hidden. |
| 12 | Correct Back navigation | **Implemented — lightweight, not a new routing framework.** Storefront: opening any overlay (cart/product/search/account/checkout/menu) pushes one browser-history entry via a `MutationObserver` watching each overlay's `open` class (rather than editing every one of the many call sites that open them); pressing Back closes the topmost open overlay instead of leaving the page. Admin: tab switches (`setTab`) push a history entry each, and the shared edit modal is tracked the same way, so Dashboard → Products → Edit-product-modal → Back → Products → Back → Dashboard now works as described. |

### 🟡 Important architecture items

| # | Item | Status |
|---|------|--------|
| 13 | State-level delivery defaults | **Already implemented in V32.5 — re-verified, no change.** `delivery_states.default_*` columns + `check_pincode()`'s `coalesce()` fallback were already live (`supabase_migration_state_delivery_defaults.sql`). |
| 14 | PIN-level overrides | **Already implemented — re-verified, no change.** A PIN's own `delivery_charge`/`min_eta_days`/`max_eta_days`/`courier_partner` already takes priority over its state's default via `coalesce()`. |
| 15 | Coupon/offer architecture | **Partially implemented — architecture complete, checkout wiring deferred by design.** Full schema (`coupons`, `coupon_redemptions`), Admin CRUD (create/edit/enable/disable/delete), and a server-side, security-definer `validate_coupon()` function that is the sole authority on discount math are all real and live once the migration runs. **Deliberately not wired into the customer-facing cart/checkout UI this release** — see "Deferred" section below for exactly why. `applicable_products`/`applicable_categories` columns exist in the schema but have no Admin UI exposed yet (minor partial gap, tracked separately from the checkout-wiring deferral). |
| 16 | Configurable social links | **Implemented.** `social_links` table (platform/url/enabled/display_order), full Admin CRUD, and the storefront footer now renders from Supabase — falling back to the two links already hardcoded in `index.html` if the fetch fails or the migration hasn't been run yet, so the footer is never empty. |

### 🟢 Preserve / verify

| # | Item | Status |
|---|------|--------|
| 17 | Existing authentication | **Untouched.** |
| 18 | Existing cart/checkout/payment | **Untouched**, other than the combo render-chain robustness fix in item 6 (no cart/checkout/payment logic itself changed). |
| 19 | Existing order workflow | **Untouched.** |
| 20 | Existing stable V32.5 functionality | **Untouched**, outside the specific items above. |
| 21 | Mobile/desktop compatibility | Both the product-catalogue Supabase migration (previous release) and this release's PIN/analytics/back-nav/coupon/social-link changes are UI-framework-agnostic — nothing here is platform-specific. |

---

## Deferred, in detail: why coupons aren't wired into checkout yet

`validate_coupon(code, subtotal, phone)` is real, callable, and
server-side authoritative (it does all discount math and eligibility
checks in Postgres — never trust a client-calculated discount). What's
*not* done is:

- A customer-facing "Apply Coupon" field in the cart/checkout UI.
- Actually subtracting the returned `discount_amount` from the charged
  total in `app.js`'s cart/checkout math.
- Recording a redemption (a `coupon_redemptions` insert) at the moment
  an order is actually placed — this would need to happen inside
  `place_order()`'s existing transaction, which is explicitly on the
  "do not touch unnecessarily" list this release.

Wiring up only some of this (e.g. a UI that validates a code and shows
a discount, but doesn't actually change what's charged, or that
discounts the total but never records a redemption so
`per_customer_limit`/`usage_limit` silently stop working) is exactly
the "half-working coupon system" you asked us not to ship. The full
schema and validation function are ready for a focused follow-up
release to wire into checkout with no further migration required.

---

## Git files changed in V32.6 (on top of the previous product-catalogue release)

- `app.js` — combo render-chain fix (item 6), footer social links (item 16), back-navigation (item 12)
- `admin.js` — analytics definition (item 11), PIN quick-add + Load More fix (items 8–10), Coupons page (item 15), Social Links page (item 16), back-navigation (item 12)
- `admin.html` — two new sidebar nav entries: Coupons & Offers, Social Links
- `index.html` — footer "Connect" block now has a `#footerSocialLinks` span for `app.js` to populate
- `supabase_migration_social_links.sql` (new)
- `supabase_migration_coupons.sql` (new)
- `DEPLOY.md` — pointer to this file
- `CHANGELOG_V32.6.md` (this file, new)

No changes to: `style.css`, `admin.css`, `legal.html`, `help.html`, any of the `supabase_seed_pincodes_*.sql` files, `supabase_migration_account_recovery.sql`, `supabase_migration_notifications.sql`, `supabase_migration_order_state_machine.sql`, `supabase_migration_pincodes_schema.sql`, `supabase_migration_reviews_*.sql`, `supabase_migration_state_delivery_defaults.sql`, `cleanup_*.sql`.

---

## Post-deployment live testing checklist (yours to run)

### Product catalogue / media (carried over, re-verify after this release too)
- [ ] Existing products (Peanut, Flaxseed, Pudi, Puffora, Jamun) and the Traditional Duo combo all display correctly on both mobile and desktop.
- [ ] A product with no media shows the placeholder — never another product's photo.
- [ ] Add a brand-new product in Admin with just name/category/description/one image/one variant — confirm it appears on the storefront automatically.

### Cart
- [ ] Existing product → Add to cart → shows `- 1 +`.
- [ ] **Combo → Add to cart → shows `- 1 +`** (this was the reported bug — please specifically confirm on both a fresh page load and after adding several other products first).
- [ ] Newly created product → Add to cart → shows `- 1 +`.

### PIN
- [ ] `000000` → "Delivery is currently unavailable to this PIN code." (never a generic ETA).
- [ ] A real, currently-serviceable PIN → shows delivery info as expected.
- [ ] A real PIN marked not-serviceable → same not-serviceable message as an unknown PIN (no distinction shown to the customer).
- [ ] Admin → Delivery / Pincodes → Expand a state with 100+ PINs → **click "Load more" and confirm the next 100 actually appear** (this was the reported bug).
- [ ] Admin → "+ Add PIN code" → type a PIN with existing neighbours in one state → confirm State prefills read-only. Type a PIN with no neighbours (or conflicting neighbours) → confirm you're prompted to pick a state from the dropdown, not free text.

### Analytics
- [ ] Create/simulate one order in each of: Order Confirmed, Payment Failed, Cancelled, Refunded. Confirm the Sales KPI includes only the Order Confirmed one, and the new Refunded KPI shows the refunded order's amount.

### Navigation
- [ ] Storefront: open Product detail → press Back (browser button or Android gesture) → closes the modal, stays on the page. Open Cart → Back → closes cart. Test with Search/Account/Checkout too.
- [ ] Admin: Dashboard → Products → Edit a product (modal opens) → Back → modal closes, still on Products → Back again → returns to Dashboard.

### Coupons (schema/Admin only this release)
- [ ] Admin → Coupons & Offers → create a coupon, edit it, disable/enable it, delete it — confirm all four work and the "Admin-only, not yet live at checkout" banner is visible.
- [ ] Run `select * from public.validate_coupon('<your code>', <subtotal>, null);` directly in SQL Editor to confirm the discount math matches what you configured.

### Social links
- [ ] Admin → Social Links → add a Facebook link, confirm it appears in the storefront footer in the position configured; disable it, confirm it disappears; confirm WhatsApp/Instagram (seeded from the old hardcoded values) still work.

### Regression (should be unaffected)
- [ ] Login (customer + admin), full checkout with a real/test payment, order tracking, admin order status transitions, notifications — all unchanged.
