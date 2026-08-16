# Jayvi Foods — V32.7 Changelog

Built on top of the stable V32.6 baseline (product/media already lives
in Supabase as of that release — see `PRODUCT_MEDIA_MIGRATION.md`).
This release is a **targeted image-performance fix only**. Nothing
about auth, cart, checkout, payments, orders, order state machine,
PIN/serviceability, notifications, admin dashboard, or existing
mobile/desktop UX was touched.

This closes items 6, 9, and 10 of the change request
("Product Architecture + Image/Video Performance Update") — items
1–5, 11–13 were already delivered in V32.6, and items 7–8 (lazy
loading, no video preload) were already in place in `app.js` before
this release and did not need changes.

---

## The measured problem (item 6)

Real product photography had been added straight from camera/export at
full resolution and served as-is:

| File | Resolution | Size |
|---|---|---|
| `images/products/pudi/front.webp` | 6144×4096 | 3.0 MB |
| `images/products/pudi/serving.webp` | 5016×5016 | 2.9 MB |
| `images/products/puffora/perfect.webp` | 5016×5016 | 2.0 MB |
| `images/products/flaxseed/nutrition.webp` | 4972×5060 | 1.7 MB |
| …14 more files, all 5000px+ on a side | | |

25 MB total across 17 files, for images that are only ever displayed
at a few hundred pixels wide in a product card or detail gallery. This
— not Git/static hosting itself (item 6B) — was confirmed as the
actual bottleneck: the files were simply far larger than anything the
UI renders.

## The fix

**New script:** `scripts/generate-product-image-variants.py`

For every `images/products/<slug>/<name>.webp`:
1. If the master is larger than 1600px on its long edge, it's resized
   down to 1600px and re-saved in place, **same filename, same path**
   — no code or database change required for this part alone.
2. Two smaller siblings are generated next to it for responsive
   `<img srcset>`:
   - `<name>-400w.webp` (phones / thumbnails)
   - `<name>-800w.webp` (tablets / product cards)

   The resized master itself is the ~1600w "desktop" tier.

Result: **25 MB → 5 MB** across all masters + generated tiers combined;
individual masters that were 2–3 MB are now 150–400 KB, with 20–90 KB
thumbnail tiers for mobile. No visible quality loss at any size this
UI actually displays these images.

This script is safe to re-run any time a new product photo is added —
running it should just become a normal step alongside dropping a new
file into `products/<slug>/`, the same way `generate-gallery-manifest.js`
already is for gallery content.

## Frontend (`app.js`)

New helper: `responsiveImgAttrs(path, sizes)`.

- Matches only `images/products/**/*.webp` paths (the exact convention
  the script above guarantees has `-400w`/`-800w` siblings). Anything
  else — external `https://` media URLs, `images/gallery/`, brand
  assets, hero art, or a brand-new product photo that hasn't been run
  through the script yet — is left completely alone and just renders
  as a plain `<img src>`, exactly as before. No product gets special
  treatment; this is the same generic-component rule the spec asks for
  in item 5, just applied to image loading too.
- When a path does match, it returns a `src` (the 800w tier), a
  `srcset` (400w / 800w / the 1600w master), and a `sizes` hint tuned
  to where the image is used.

Wired into every place a product/combo photo is rendered:
- `cardMediaMarkup()` — product grid cards
- `comboMediaMarkup()` — combo cards
- `productGalleryMarkup()` / `setGalleryImage()` — product detail
  gallery (main image + thumbnails use different `sizes`, thumbnails
  additionally get `loading="lazy"`)
- `renderMeal()`'s "Find your favourite" mini product tiles
- the cart drawer's line-item thumbnails

All of the above also picked up `decoding="async"` (a free, standard
hint that image decoding shouldn't block rendering). Lazy-loading
behavior for non-first slides (item 7) and video `preload="metadata"`
(item 8) were already correct in this codebase and are unchanged.

## Small correctness fix, same area

`EMBEDDED_CONFIG`'s (and `admin.js`'s matching `CONFIG_FALLBACK`'s)
local fallback `image` field for Peanut Chutney pointed at
`images/products/peanut-chutney.webp`, a file that has never existed
in this repo (the real photos live at `images/products/peanut/*.webp`,
used normally via Supabase `product_media`). This only mattered if the
Supabase fetch fails and the app falls back to the embedded config, but
since it's in the exact same code path this release touches, it's
fixed to point at the real file: `images/products/peanut/hero.webp`.

**Not touched:** `images/products/Jamun/*.webp`, referenced in
`supabase_migration_product_catalog.sql`'s seed data, has no actual
files in this repo snapshot — that's a missing-content gap (no photos
supplied for that product yet), not a code bug, and is unrelated to
this performance release.

## Git files changed
- `app.js` — `responsiveImgAttrs()` + wiring into card/combo/gallery/
  cart/meal-recommendation image rendering; one dangling fallback path
  corrected
- `admin.js` — same one-line fallback path correction (no other change)
- `scripts/generate-product-image-variants.py` (new)
- `images/products/**/*.webp` — 17 masters resized to a 1600px cap;
  34 new `-400w.webp`/`-800w.webp` sibling files generated
- `VERSION.txt` — 32.6 → 32.7
- `CHANGELOG_V32.7.md` (this file, new)

## Acceptance checklist
- [ ] Open the storefront on a throttled "Slow 3G"/"Fast 3G" mobile
      network profile — confirm product cards no longer show a long
      blank/spinner period while images load.
- [ ] Browser Network tab, initial page load: confirm no single image
      request exceeds a few hundred KB, and that off-screen product
      images aren't fetched until scrolled into view.
- [ ] Confirm every existing product (Peanut, Flaxseed, Pudi, Puffora)
      still shows its correct photos, in the correct order, with
      working swipe/navigation.
- [ ] Confirm the product detail gallery's main image and thumbnails
      still work, including clicking a thumbnail to swap the main
      image.
- [ ] Resize the browser / use device emulation at phone, tablet, and
      desktop widths — confirm (via Network tab) that a narrower
      viewport requests the smaller `-400w` tier, not the full master.
- [ ] Confirm a product whose image path does *not* follow the
      `images/products/**/*.webp` convention (e.g. any external URL
      added via Admin's media editor) still displays normally.
- [ ] Confirm cart drawer thumbnails and the "Find your favourite"
      mini product tiles still display correctly.
- [ ] Confirm login, checkout, orders, and admin dashboards are
      unaffected.
