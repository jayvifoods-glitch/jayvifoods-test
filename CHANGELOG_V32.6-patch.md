# Jayvi Foods — V32.6 Final Patch

Three targeted items on top of the V32.6 package already delivered.
Nothing else was touched — see the validation section at the bottom
confirming every prior V32.6 item is still intact.

---

## 1. Combo `-1+` — re-verified, one additional defensive fix

Re-traced the entire combo add-to-cart → re-render chain by hand
(cart state, `cartQtyForCombo()`, `renderCombos()`, `refreshProductViews()`).
The root-cause fix from the previous release (a missing null-check in
`renderMeal()` that could throw and silently block whatever ran after
it) is confirmed still in place and correct.

**Added one more layer of defense** on top of that fix: `refreshProductViews()`
now runs `renderCombos()` immediately after `renderBest()` — before
`renderProducts()`/`renderMeal()` — in addition to each call already
being individually try/caught. So even if a *future*, not-yet-known bug
appeared in `renderProducts()` or `renderMeal()`, the combo card would
already be correctly updated before either of them runs at all. This
is still fully data-driven (`cartQtyForCombo()` reads the same `cart`
array every product uses) — nothing combo-specific was hardcoded.

I don't have a live browser to click through, so please specifically
re-confirm on both mobile and desktop per the checklist below — but
the code path is now unambiguous and defended at two independent
layers.

## 2. Coupons — left exactly as-is, clarified only

No code changed. Per your instruction, since wiring coupon application
into checkout would require touching cart-total math and the
`place_order()` flow (both explicitly off-limits this release), it
stays in its current state:

- **Admin**: full coupon creation/editing/enable/disable, server-side
  validated via `public.validate_coupon()`.
- **Customer checkout**: coupons are **not yet available to apply**.
  The Admin Coupons page already displays a persistent banner saying
  this plainly.
- **Next step**: complete checkout integration is intentionally scoped
  as its own separate, focused release, exactly as you proposed.

## 3. New rotating brand/promo gallery (homepage)

**Architecture note, please read:** this is a static site with no
server and no build pipeline. A truly server-less "just drop a file
in a folder, no other step, ever" mechanism isn't something a static
site can do — there's no reliable, portable way for browser code to
ask a plain static host "what files exist in this folder right now."
The standard, honest solution (and what's implemented here) is a
**generated manifest file that the app reads** — `app.js` never
hardcodes a single filename, and the one extra step (regenerating the
manifest) can be automated in CI if you have one, or is a 5-second
manual step if you don't. Details below.

### What was built
- **`images/gallery/`** is now dedicated to this rotating gallery only.
  The old per-product SVGs that used to live there (already unused
  after the product-media migration two releases ago — confirmed via
  a full repo-wide search before deleting) have been removed, so the
  folder is clean and unambiguous for this new purpose.
- **`images/gallery/manifest.json`** — a plain JSON array of filenames,
  e.g. `["diwali-2026.webp","customer-photo-01.webp"]`. Ships as `[]`
  in this release (no gallery images were provided to include).
- **`generate-gallery-manifest.js`** — run `node generate-gallery-manifest.js`
  any time you add or remove a `.webp` file in `images/gallery/`; it
  scans the folder and rewrites `manifest.json` to match. Filters to
  `.webp` only (case-insensitive), sorted for a stable order. This is
  the only place any filename in that folder is ever listed.
- **`app.js` → `renderBrandGallery()`** — fetches `manifest.json` on
  page load:
  - **0 images** (missing manifest, empty array, or fetch failure) →
    the whole section stays `display:none` — no broken/empty gallery
    ever shows.
  - **1 image** → shown once, statically, no animation.
  - **2+ images** → auto-scrolls continuously (same proven
    duplicated-track + CSS `translateX` marquee technique already used
    for the header announcement ticker), speed scaled gently to the
    number of images so more photos don't just fly past faster.
  - Every image has **no click handler, no href, no product
    reference** — `pointer-events:none` in CSS as a second, structural
    guarantee on top of simply never adding an `onclick`.
- Placed on the homepage between the trust strip and Bestsellers.
- Completely independent of the product-media architecture — no
  Supabase table, no Admin page, exactly as you asked; this is
  brand/promo imagery only.

### How to add images going forward
1. Add your `.webp` file(s) to `images/gallery/` in the repo.
2. Run `node generate-gallery-manifest.js`.
3. Commit both the image(s) and the updated `manifest.json`, deploy.

---

## 4. Final validation (static/local only — see note)

Per your item 5, no live Supabase/browser testing is claimed here —
this is local code/structure validation only.

| Area | Status |
|---|---|
| `node --check app.js` / `admin.js` / `generate-gallery-manifest.js` | ✅ pass |
| index.html tag balance (div/span/section/footer) | ✅ balanced |
| style.css brace balance | ✅ balanced |
| Product catalogue (Supabase products/product_media) | ✅ untouched, still present |
| Product media | ✅ untouched |
| Combo media (multi image/video via `product_media`) | ✅ untouched |
| Combo `-1+` | ✅ re-verified + hardened (see item 1) |
| Cart functionality | ✅ untouched |
| PIN functionality (`check_pincode`, quick-add) | ✅ untouched |
| Analytics (`REVENUE_ORDER_STATUSES`) | ✅ untouched |
| Back navigation | ✅ untouched |
| Coupons architecture | ✅ untouched, confirmed still deferred from checkout |
| Social links | ✅ untouched |
| New gallery isolation | ✅ confirmed zero references to product code, Supabase, or `images/products/`; manifest generator tested locally with sample files (case-insensitive `.webp` filter, non-image files ignored, deterministic sort) |

Generator test performed locally (not part of the shipped repo):
created `festival-diwali.webp`, `customer-1.webp`, `ad-banner.WEBP`,
and a `notes.txt` in a scratch folder → ran the script → confirmed the
`.txt` was correctly excluded, the uppercase `.WEBP` was correctly
included, and the output list was alphabetically sorted.

---

## Git files changed in this patch

- `app.js` — `refreshProductViews()` reorder (item 1), `renderBrandGallery()` + call in `init()` (item 3)
- `index.html` — new `#brandGallery` section (item 3), no other markup changed
- `style.css` — new `.brandGallerySection`/`.galleryViewport`/`.galleryTrack` rules (item 3), no other rule changed
- `images/gallery/manifest.json` (new, ships empty)
- `generate-gallery-manifest.js` (new)
- `images/gallery/*.svg` — removed (11 unused legacy files, confirmed unreferenced anywhere in the repo before deletion)
- `CHANGELOG_V32.6-patch.md` (this file, new)

No changes to: `admin.js`, `admin.html`, `admin.css`, any SQL migration file, `supabase-config.js`, or anything else not listed above. Item 2 (coupons) is a documentation confirmation only — the coupon code itself is byte-for-byte unchanged from the previous V32.6 delivery.

---

## SQL deployment (item 5) — nothing changed, restating for clarity

**No SQL changed in this patch.** The three files from the previous
V32.6 delivery are still exactly what you need to run, in this order,
on top of your live V32.5 database:

1. `supabase_migration_product_catalog.sql`
2. `supabase_migration_social_links.sql`
3. `supabase_migration_coupons.sql`

**Do NOT re-run** any pre-existing V32.5 migration
(`supabase_migration_pincodes_schema.sql`,
`supabase_migration_state_delivery_defaults.sql`,
`supabase_migration_order_state_machine.sql`,
`supabase_migration_reviews_v32_1.sql`,
`supabase_migration_reviews_featured.sql`,
`supabase_migration_account_recovery.sql`,
`supabase_migration_notifications.sql`, or any
`supabase_seed_pincodes_*.sql` file) — those are assumed already
applied to your live database, since your existing V32.5 Admin panel
already depends on their tables/functions.

**Dependencies:** all three new files require `public.is_admin()` /
`public.profiles` (from your existing Phase 1 schema, already live).
The three are otherwise independent of each other and of one another's
tables — order 1→2→3 above is a convenience, not a hard requirement,
but running them in that order matches this and the previous
changelog exactly, so it's the simplest to follow.

**Verification queries:** unchanged from the previous `CHANGELOG_V32.6.md`
— see that file's "Post-deployment verification queries" section; no
new queries are needed for this patch since no SQL changed.

**Git vs. SQL order:** deploy the SQL first, then the Git build. Every
new Git-side feature in this and the previous V32.6 release (product
catalogue, social links, coupons Admin page) fails gracefully (falls
back or shows an empty/hidden state) if its table doesn't exist yet —
but there's no benefit to deploying Git first, and doing the SQL first
means the moment the new Git build goes live, everything already has
real data to read.
