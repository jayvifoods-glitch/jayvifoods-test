# V32.6 — Product & Media → Supabase migration

**Status: implemented.** This is the "smallest safe migration" version
of the architecture requested on top of the stable V32.5 baseline.
Nothing about auth, cart, checkout, payments, orders, order state
machine, PIN/serviceability, notifications, or existing mobile/desktop
UX was touched, other than the product-card/detail media rendering and
the Admin Products/Variants/Combos pages described below.

## What changed

### 1. Supabase is now the source of truth for products, media, combos
New file: `supabase_migration_product_catalog.sql`. Creates:
- `public.products` — extends the existing product shape (variants
  stay as a JSONB array, same shape Admin already used; no new
  variant table was introduced, per the "don't create a new model
  unnecessarily" instruction).
- `public.combos` — same principle, for combos.
- `public.product_media` — one shared table for **both** products and
  combos (`product_id` or `combo_id`, exactly one set per row). No
  fixed slot count. `media_type` is `image` or `video`. Supports both
  local repo paths (`images/products/peanut/hero.webp`) and external
  `https://` URLs in the same `media_url` column — the storefront
  doesn't care which.

RLS: public/anon can only read `active = true` products/combos and
`is_active = true` media whose owning product/combo is itself active.
Only Admin (`public.is_admin()`, from the existing Phase 1 schema) can
write. This mirrors the pattern already used for `website_reviews`.

The same file also seeds/migrates the 5 products and 1 combo that were
previously hardcoded in `app.js`'s `EMBEDDED_CONFIG` /
`admin.js`'s `CONFIG_FALLBACK`, so nothing already live is lost. It's
safe to re-run (upsert on `id`).

### 2. No more generic-gallery fallback
Previously, `flaxseed`, `pudi`, and `puffora` fell back to shared SVGs
in `images/gallery/` whenever their own media list was short. This was
the root cause of unrelated-looking images appearing on some products.

Fixed by:
- Moving those SVGs into each product's **own** folder
  (`images/products/flaxseed/front.svg`, `.../back.svg`,
  `.../serving.svg`, and likewise for `pudi`/`puffora`) — every product
  now has a dedicated media location, per the requested
  `assets/products/<id>/` convention.
- Removing `DEFAULT_PRODUCT_MEDIA` (the object that pointed at
  `images/gallery/...`) from `app.js` entirely. A product with no
  media of its own now shows a single explicit placeholder image
  (`images/hero/jayvi-products.webp`) — never another product's photo,
  and never anything pulled from `images/gallery/`.
- `images/gallery/` still exists for genuinely generic site content
  (it's untouched) — it's just never consulted for product media any
  more.

### 3. Storefront (`app.js`)
- New `loadCatalogFromSupabase()` — fetches `products`, `combos`, and
  `product_media` and reshapes them into the exact same in-memory
  shape the rest of `app.js` already expects (`p.media`, `p.image`,
  `p.variants`, `c.items`, `c.media`, etc.), so `productCard()`,
  `openProduct()`, `comboMediaMarkup()`, cart, wishlist, and checkout
  did not need to change.
- Called once from `init()`, before the first render. **If the fetch
  fails for any reason** (offline, RLS misconfigured, etc.) the
  storefront silently keeps whatever `loadConfig()` already gave it
  (the embedded/local copy) — the store never renders blank. This is
  the deliberate "minimum risk" fallback requested.
- `cardMediaMarkup()` and `comboMediaMarkup()` no longer read
  `DEFAULT_PRODUCT_MEDIA`; a missing media list renders the explicit
  placeholder instead.
- Store settings, categories, meal tags, announcements, and reviews are
  **unchanged** — still `EMBEDDED_CONFIG` + per-browser `localStorage`,
  exactly as before. This was an explicit, deliberate scope boundary
  (see `FUTURE_product_catalog_migration.md`), not an oversight.

### 4. Admin (`admin.js`)
- **Products page**: Add/Edit/Delete now read and write
  `public.products` + `public.product_media` directly. The old
  fixed-slot "Hero filename / Front-Back filename / Ingredients
  filename / Serving filename / Video filename" fields are replaced
  with a real `+ Add Media` list (any number of rows, image or video,
  reorderable, local path or external URL) — this is the literal
  Admin UX requested in item 9 of the spec.
- **Variants & sizes**: unchanged UX, now writes to the `variants`
  JSONB column on the product's Supabase row instead of localStorage.
- **Combos**: Add/Edit/Delete now read and write `public.combos` +
  `public.product_media` (via `combo_id`) — combos use the exact same
  media editor component as products; the product-card component has
  no combo-specific branching to display media.
- The old "⚠️ Not live for customers until synced to your repo" banner
  is replaced with a green "✅ Live for every customer, on every
  device" note on the Products/Variants/Combos pages only. It still
  appears, unchanged, on Categories/Meal tags/Homepage/Settings, which
  remain local-only.
- `data.products` / `data.combos` are still populated in memory (now
  fetched fresh from Supabase on login and whenever those pages open)
  so every other Admin feature that reads them — combo item pickers,
  announcement targets, review product pickers, the meal-tag deletion
  guard — keeps working unchanged.

### 5. Mobile / desktop parity
Because both `app.js` (storefront, used by mobile and desktop
identically) and `admin.js` now read the same Supabase tables, the
previously-confirmed "desktop shows 4 products, mobile shows 5" issue
(caused by each browser having its own localStorage catalogue) cannot
recur — there is exactly one product list, period.

## Git files changed
- `app.js` — catalogue loading + media rendering (see above)
- `admin.js` — Products/Variants/Combos pages + new Supabase helpers
- `images/products/flaxseed/front.svg`, `back.svg`, `serving.svg` (new, moved from `images/gallery/`)
- `images/products/pudi/front.svg`, `back.svg`, `serving.svg` (new, moved from `images/gallery/`)
- `images/products/puffora/front.svg`, `back.svg`, `serving.svg` (new, moved from `images/gallery/`)
- `supabase_migration_product_catalog.sql` (new)
- `DEPLOY.md` — new note at top pointing to this file
- `PRODUCT_MEDIA_MIGRATION.md` (this file, new)

## Supabase changes required before deploy
Run `supabase_migration_product_catalog.sql` once, top to bottom, in
the Supabase SQL Editor for this project. It requires
`supabase_schema_phase1_v3.sql` to already be applied (uses
`public.is_admin()` from it) — same prerequisite as
`supabase_migration_reviews_v32_1.sql`.

## Acceptance checklist (matches the spec's acceptance test)
- [ ] Run the migration; verify with the `select` statements at the
      bottom of the SQL file.
- [ ] Load the storefront on two different browsers/devices — same
      products, same count, same media, on both.
- [ ] Peanut Chutney (multiple images), Flaxseed/Pudi/Puffora (now
      their own dedicated folders, no `images/gallery/` involved),
      Jamun (image + implied video slot), Combo (Traditional Duo).
- [ ] In Admin → Products, add a brand-new product with only a name,
      category, description, one image, and one variant — confirm it
      appears on the storefront (both platforms) with **no code
      change** of any kind.
- [ ] In Admin → Products, edit an existing product's media: add an
      image, add a video, reorder, remove one — confirm the storefront
      reflects it immediately, with working navigation and video
      playback.
- [ ] Confirm a product with zero media shows the placeholder image,
      never another product's photo.
- [ ] Confirm Add to Cart / quantity controls still work for both an
      existing and a newly-added product, on both platforms.
- [ ] Confirm login, checkout, orders, and admin dashboards are
      unaffected.
