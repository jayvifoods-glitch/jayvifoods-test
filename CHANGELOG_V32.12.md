# Jayvi Foods — V32.12 Changelog

Implements the three workstreams requested on top of the V32.11 stable
baseline: (A) complete the customer-facing Coupons & Offers experience,
(B) fix the Admin password-reset integration, (C) move product media
from Git-only to Supabase Storage as an additional, non-destructive
option. **Not touched:** anything about products/combos/categories/meal
tags themselves, cart line items, order state machine, PIN/delivery,
customer accounts, admin authentication, or any existing UI beyond the
specific additions below.

## Post-review corrections (applied before this package was finalized)

A review against the V32.11 baseline found 3 real gaps in the initial
V32.12 draft. All 3 are fixed in this package; details below, folded
into the relevant module's section further down as well.

1. **Primary media wasn't actually read by the storefront.**
   `product_media.is_primary` was stored correctly and Admin could set
   it, but `app.js`'s `loadCatalogFromSupabase()` dropped the field
   entirely when mapping Supabase rows into the in-memory catalogue —
   every render still silently used lowest-`display_order`. Fixed by
   carrying `is_primary` through and reordering each product's/combo's
   media array so the primary item is index 0 (falling back to lowest
   `display_order` only when nothing is marked primary) — done once in
   `loadCatalogFromSupabase()`, which automatically fixes the product
   card, combo card, and product-detail initial image everywhere else
   in the file, since all of them read `media[0]`/`p.image` rather than
   re-deriving "the primary image" themselves.
2. **Coupon product/category restrictions were not enforced.** The
   `coupons.applicable_products`/`applicable_categories` columns
   existed (since V32.6) but `validate_coupon()` never checked them —
   and Admin's coupon form had no UI to even set them. Fixed:
   `validate_coupon()` now takes the cart's product ids and category
   ids and rejects a restricted coupon whose scope the cart doesn't
   satisfy; `place_order()` computes that same product/category
   information itself, server-side, from the order's own line items
   (never from anything the browser sends) before calling
   `validate_coupon()`; the Cart dropdown now calls a new,
   restriction-aware `list_eligible_offers_for_cart()` so a coupon that
   doesn't apply to the current cart is never even shown as an option;
   and Admin's coupon form gained product/category checkboxes so the
   restriction can actually be configured in the first place.
3. **No migration path for existing Git media.** Added
   `scripts/migrate-media-to-storage.mjs`, a repeatable, dry-run-capable
   Node script that uploads each Git-path `product_media` row's file to
   Storage and updates only its `media_url`/`poster_url` — preserving
   `display_order`/`is_primary`, skipping already-migrated rows,
   skipping missing files without aborting the batch, and never
   deleting the original file. Also added
   `scripts/list-orphaned-storage-files.mjs`, a read-only reporter for
   the separate "deleting a DB row doesn't delete its Storage object"
   concern — it only ever lists candidates for manual review, never
   deletes anything automatically.

## Module A — Coupons & Offers (customer-facing, complete)

Admin coupon management (create/edit/enable/disable/delete, percentage
or fixed, min order, usage limits, product/category restrictions) was
already live since V32.6 for the basic fields, and this release adds
the missing product/category-restriction checkboxes to Admin's coupon
form (see correction #2 above) plus the full storefront half:

- **`public.list_active_offers()`** — a narrow, public,
  security-definer function returning only `code / name / description /
  discount_type / discount_value / min_order_value` for currently
  active, in-date, not-yet-exhausted coupons, used by the marketing
  placements only (floating button, announcement ticker — see below).
  The `coupons` table itself stays admin-only (unchanged RLS).
- **`public.list_eligible_offers_for_cart()`** (new) — the
  restriction-aware equivalent used by the Cart dropdown: takes the
  cart's product/combo ids, category ids, and subtotal, and returns
  only offers whose date/usage/min-order/product/category rules the
  cart actually satisfies right now.
- **Floating offer button** (`app.js`: `renderFloatingOffer()`,
  `index.html`: `#offerFloatBtn`) — shows only when
  `list_active_offers()` returns at least one row; shows the single
  offer's discount (e.g. "10% OFF") or "Offers" when there are several.
  Clicking opens `#offersOverlay`, listing every active offer's code,
  discount, description, and minimum order value. Never hard-coded.
- **Announcement ticker** (`index.html`'s existing `.topbar`,
  `app.js`: `renderOfferAnnouncement()`) — a new ticker segment
  (`#topOffer`/`#topOfferDup`) generated from the same marketing offers
  list ("🎉 Get 10% OFF on orders above ₹199 – Use code WELCOME10", or
  "🎉 Offers available: 5% OFF | 10% OFF" for multiple) and hidden
  entirely when there are no active offers. Additive to the existing
  hero/announcement-slide content (`CONFIG.announcements`, a separate,
  Admin-authored feature from V32.11) — Admin's own hero copy is
  untouched.
- **Cart "Apply coupon"** (`app.js`: `couponSectionMarkup()`,
  `refreshEligibleCartOffers()`, `applyCouponFromCart()`,
  `removeAppliedCoupon()`, `currentDiscount()`, `cartProductAndCategoryIds()`)
  — a dropdown populated from `list_eligible_offers_for_cart()`, so a
  coupon restricted to products/categories not in the current cart is
  never shown as an option (correction #2). Selecting an offer calls
  `public.validate_coupon()` (now passing the cart's product/category
  ids too) for an immediate "Coupon applied: WELCOME10 — Discount
  ₹19.90" confirmation, updating Subtotal/Discount/Delivery/Total live.
  "Remove coupon" clears it. The applied coupon persists across a page
  reload (`localStorage` `jayviCouponV1`), and is re-checked against the
  current subtotal on every cart render (a coupon that no longer meets
  its minimum after items are removed is silently cleared with a
  toast).
- **Server-side authority, actually enforced (spec 1.5), now including
  restrictions (spec section 2/correction #2).** The client-side
  `validate_coupon()` call above is a preview only. The real authority
  is the coupon-aware overload of `public.place_order()`: it computes
  the order's product ids (including a combo's constituent products,
  looked up from `public.combos` itself) and their categories (looked
  up from `public.products` itself) — entirely server-side, never from
  the client — then re-runs `validate_coupon()` against those, the
  server-computed subtotal, and the real phone number, at the exact
  moment the order is placed. If the coupon is invalid for any reason
  (expired, minimum no longer met, usage limit reached, OR a
  product/category restriction the cart doesn't satisfy), the **entire
  order is rejected** — nothing is written — and `placeOrder()` in
  `app.js` shows the required wording: *"This coupon is no longer
  available. Please select another offer."* If valid, the discount is
  stored on the order (`coupon_code`, `coupon_id`, `discount_amount`,
  `discount_type`) and a `coupon_redemptions` row is recorded in the
  same transaction.
- **Restriction semantics (documented in the migration file's own
  comments):** if `applicable_products` is configured, every product/
  combo id in the cart must be in that list; if `applicable_categories`
  is configured, every category represented in the cart must be in
  that list; if both are configured, the cart must satisfy both. This
  is deliberately conservative — the discount applies to the whole
  order subtotal, not per line, so a coupon must never discount
  something outside its intended scope.
- **One coupon per order (V1, spec 1.6).** `appliedCoupon` is a single
  object, not a list — no stacking logic exists anywhere.

## Module B — Password Reset (confirmed already correct — still needs live deployment testing)

Re-reviewed `admin.js`'s `promptResetPassword()` and
`supabase_functions/admin-reset-password/index.ts` again this round;
**no code issue was found, and no code change was made to either
file.** The V32.5 CORS fix and V32.8 admin-authorization/
error-differentiation work are present and unchanged.

**This is explicitly NOT being claimed as verified end-to-end.** The
reported error — *"Password was NOT changed — could not reach the
admin-reset-password function (Failed to fetch)"* — is consistent with
the function never having been deployed to the live project (source
code present in `supabase_functions/` does not deploy it). Confirming
the fix actually works requires:
```
supabase login
supabase link --project-ref <your-project-ref>
supabase functions deploy admin-reset-password
```
followed by a real Reset password (R4) attempt against your live
Supabase project and a real customer account — see "Requires Supabase
deployment testing" below. This changelog does not claim password
reset is fully fixed until that live test has actually been run.

## Module C — Product media → Supabase Storage (additive option, not a forced migration)

`product_media` (Supabase table, live since V32.6) already supported
an unlimited number of images/videos per product/combo with
`display_order`/`media_type`, and already accepted either a Git-repo
path or a full external URL in the same `media_url` column. What's new
this release:

- **A real Storage bucket** (`supabase_migration_product_media_storage.sql`):
  `product-media`, public read, Admin-only write via `storage.objects`
  RLS policies, 50MB/file size limit, and an explicit allowed-mime-type
  list (WebP/JPEG/PNG/AVIF images; MP4/WebM video).
- **Real file upload in Admin** (`admin.js`: `uploadMediaFile()`,
  "📷 + Add Photo" / "🎬 + Add Video" buttons) — uploads a local file to
  `product-media/<product-id>/...` and inserts the resulting public URL
  as a new media row automatically. The existing "+ Add Media (URL)"
  manual-path entry is kept alongside it for the external-URL/Git-path
  case.
- **`is_primary` — now actually wired end-to-end (correction #1).**
  The column, the admin trigger keeping exactly one `true` per
  product/combo, the one-time backfill, and Admin's "☆ Set primary"
  button were already correct in the original draft. What was missing
  — and is fixed this round — is `app.js` actually reading the field:
  `loadCatalogFromSupabase()` now carries `is_primary` through and
  reorders each product's/combo's media array so the primary item is
  always first, which is what the product card, combo card, and
  product-detail initial image all read. Falls back to lowest
  `display_order` only when no row is marked primary (e.g. rows
  written before this column existed) — same behaviour as before this
  fix, just no longer the *only* behaviour.
- **One-time media migration script (correction #3).**
  `scripts/migrate-media-to-storage.mjs` — see "Media migration" in
  `DEPLOY.md` for full usage. Uploads each Git-path row's file, updates
  only `media_url`/`poster_url`, preserves `display_order`/`is_primary`
  untouched, skips rows already on Storage or already using the same
  destination filename (idempotent/duplicate-safe), skips (rather than
  aborts on) a file that can't be found on disk, and never deletes the
  original Git file. Supports `--dry-run` and `--only=<id>` for a
  cautious, per-product rollout matching spec Phase D.
- **Orphaned Storage files — documented, not auto-deleted (correction
  #4).** `scripts/list-orphaned-storage-files.mjs` — read-only; lists
  every Storage object not referenced by any current `product_media`
  row, for manual review. Implements no deletion logic at all, per the
  explicit instruction that automatic deletion is too risky to
  introduce now.
- **No new artificial media limits** — `window._mediaDraft` was already
  a plain, any-length array and remains one.
- **Performance (spec 3.8–3.10).** `responsiveImgAttrs()` recognises a
  Supabase Storage object URL and requests width-scoped variants from
  Supabase's image-transformation endpoint at request time, degrading
  safely to the plain object URL if Image Transformations isn't enabled
  on a given plan. Video tags already used `preload="metadata"` plus an
  explicit poster image, unchanged.
- **Backward compatibility (spec 3.12) is structural.** Git-path media
  rows are not touched, converted, or scheduled for removal by any code
  or migration in this release. Migrating any given product's media is
  a separate, manual-or-scripted, per-product/per-batch action, never
  automatic and never all-or-nothing.

## Files changed (this package, including the correction pass)

- `supabase_migration_coupon_checkout.sql` — corrected: `validate_coupon()`
  gains `p_product_ids`/`p_category_ids` and enforces
  `applicable_products`/`applicable_categories`; new
  `list_eligible_offers_for_cart()`; `place_order()` computes
  product/category ids server-side (including combo constituents) and
  passes them into `validate_coupon()`.
- `supabase_migration_product_media_storage.sql` — unchanged from the
  original V32.12 draft.
- `scripts/migrate-media-to-storage.mjs` (new) — batch Git→Storage
  migration utility.
- `scripts/list-orphaned-storage-files.mjs` (new) — read-only orphaned
  Storage file reporter.
- `package.json` (new) — the one dependency (`@supabase/supabase-js`)
  the two scripts above need; does not affect the website itself, which
  has no build step and loads Supabase from a CDN `<script>` tag.
- `app.js` — `loadCatalogFromSupabase()` now carries `is_primary`
  through and reorders media with the primary item first (correction
  #1); `cartProductAndCategoryIds()` (new), `refreshEligibleCartOffers()`
  (new), `applyCouponFromCart()`/`couponSectionMarkup()` updated to use
  the restriction-aware cart-eligible offers list and pass
  product/category ids into `validate_coupon()` (correction #2);
  `responsiveImgAttrs()` extended for Supabase Storage image
  transforms; floating offer button/announcement/cart-coupon UI
  otherwise as originally delivered.
- `admin.js` — coupon form gains product/category restriction
  checkboxes and `couponsPage()` now fetches products/categories for
  them (correction #2); coupon card summary shows restriction counts;
  everything from the original draft (upload buttons, primary-image
  toggle, `is_primary` persistence) unchanged.
- `DEPLOY.md` — corrections called out at the top of the V32.12
  section; "Media migration" rewritten around the new script; new
  "Storage cleanup" section for the orphaned-file reporter; password
  reset section re-worded to avoid overclaiming "fixed" ahead of live
  testing.
- `CHANGELOG_V32.12.md` (this file) — corrections section added.
- `index.html`, `style.css`, `admin.css`, `admin.html`, `VERSION.txt` —
  unchanged from the original V32.12 draft (still version 32.12; this
  is a correction pass on the same release, not a new version number).

## Offline testing performed (per Workstream 5)

- [x] `place_order()`'s corrected restriction logic traced by hand:
  a product-restricted coupon with a cart containing an unlisted
  product id is rejected; a category-restricted coupon with every cart
  item's category in the allowed list is accepted; a combo line's
  constituent products are correctly pulled from `public.combos.items`
  and contribute their categories.
- [x] `app.js`/`admin.js` re-validated for syntax (`node -c`) after
  every edit.
- [x] `scripts/migrate-media-to-storage.mjs` and
  `scripts/list-orphaned-storage-files.mjs` validated with
  `node --check`, and smoke-tested against an intentionally unreachable
  Supabase URL to confirm they fail with a clear, caught network error
  (not a code-level crash) before any real project is available to
  test against.
- [x] Confirmed the existing 15-argument `place_order()` overload and
  the original 3-argument `validate_coupon()` call sites are gone from
  the codebase (nothing left calling the pre-restriction signature), so
  there's no path left that could skip the new restriction check.
- [x] Confirmed `product_media` rows with no `is_primary` set (legacy
  data) still resolve a sensible primary image via the `display_order`
  fallback in both `app.js` and `admin.js`.

## Requires Supabase deployment testing (cannot be verified from source alone)

- [ ] Run both SQL migrations against the real project; confirm
  `select * from public.list_eligible_offers_for_cart(...)` returns the
  expected filtered set for a real restricted coupon.
- [ ] Create a coupon in Admin with a product restriction (using the
  new checkboxes), confirm it does NOT appear in the Cart dropdown for
  a cart containing a different product, and DOES appear for a cart
  containing only allowed products.
- [ ] Attempt to force-apply a restricted coupon's code by other means
  (e.g. directly via the browser console) with an ineligible cart, and
  confirm `place_order()` still rejects it — this is the test that
  actually proves server-side enforcement, not just that the dropdown
  hides it.
- [ ] Place a real test order with a valid, unrestricted coupon
  end-to-end; confirm the `orders` row and `coupon_redemptions` row are
  correct (unchanged from the original V32.12 draft's testing needs).
- [ ] Run `scripts/migrate-media-to-storage.mjs --dry-run` against the
  real project, review its output, then run it for real on one product
  first, and confirm the storefront (card + gallery, mobile + desktop)
  still shows that product's media correctly afterward.
- [ ] Run `scripts/list-orphaned-storage-files.mjs` after some normal
  Admin media editing to confirm it correctly identifies (without
  deleting) files no longer referenced.
- [ ] Deploy `admin-reset-password` if not already deployed, then run
  the full acceptance sequence in the existing V32.8 DEPLOY.md section
  — this changelog does not claim password reset works until this
  specific step has been done against the real project.

## Requires browser/mobile production testing

- [ ] Floating offer button placement/visibility on real mobile
  viewports.
- [ ] Admin media upload of a real, non-trivial video file.
- [ ] Confirm Supabase Image Transformations is actually enabled on the
  live project's plan, or accept the graceful-degradation fallback.
- [ ] Confirm a product whose primary image was changed via "☆ Set
  primary" actually shows the new primary image on the storefront (card
  and detail) after a normal page load, on both mobile and desktop.

