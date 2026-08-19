# Jayvi Foods v32.13 — A–AA implementation pass

## ✅ V32.13 — Bug-fix release: Announcement admin + Gallery now actually work, Orders Search removed, version display fixed

**Read this section first.** See **`CHANGELOG_V32.13.md`** for the
full write-up, in particular §1, which explains the single root-cause
JavaScript scoping bug behind both the Announcement admin and Gallery
issues reported after V32.3's live test cycle.

### 1. Database — nothing to run

**No new SQL migration in this release.** Every issue reported was a
frontend/admin wiring bug, not a schema problem —
`supabase_migration_v32_3.sql` (already deployed and tested in your
environment) is unchanged and does not need to be re-applied.

### 2. Storage — nothing new

No new buckets or bucket policy changes. The existing
`announcement-media` and `gallery-media` buckets (from
`supabase_migration_v32_12_1.sql` and `supabase_migration_v32_3.sql`
respectively) are unchanged and reused as-is.

### 3. Static files — redeploy

`admin.js`, `admin.css`, `admin.html`, `index.html`, `legal.html`,
`help.html`, `config-lite.js`, `VERSION.txt` all changed in this
release (version bump + the admin.js/admin.css fixes — see
`CHANGELOG_V32.13.md`'s "Files changed" section for the exact list).
Redeploy the static site as usual. `app.js` is **unchanged** in this
release.

**Cache-busting note:** every `?v=32.3` query string was bumped to
`?v=32.13` on the files that reference them — if your CDN/host caches
aggressively, this should make the new `admin.js`/`admin.css` load
without a manual cache purge, but purge anyway if you see stale
behavior after deploying.

### 4. What to test first

Given the two blockers reported, prioritize re-testing in this order:
1. Admin → Homepage: create a General announcement with an image,
   save, reopen, confirm the image shows. Then a Product announcement
   (and a Combo one, if you use combo-linked announcements), each with
   media, Replace, and Remove.
2. Admin → Gallery: confirm it no longer shows "Loading…" forever —
   with zero rows it should show "No gallery items yet" with the
   Add Photos/Add Video buttons available; add a few images and a
   video and confirm reorder/Active-toggle/delete all work.
3. Admin → Orders: confirm the Search box is gone, and that Sort
   (Newest/Oldest/Highest/Lowest/Status) and the Status/Payment/date
   filters still work.

**Requires your live Supabase testing (cannot be verified offline) —
see `CHANGELOG_V32.13.md`'s matching section for the full list.**

---

## ✅ V32.3 — General/Product announcements, announcement media redesign + delete, new Admin Gallery (Supabase-backed slideshow)

**Read this section first.** See **`CHANGELOG_V32.3.md`** for the full,
itemized release notes and **`supabase_migration_v32_3.sql`** for the
schema changes.

### 1. SQL migration (Supabase SQL Editor) — run this one, after everything already applied

```
supabase_migration_v32_3.sql
```

Apply it **after** every existing `supabase_migration_*.sql` in this
project, in particular after
`supabase_migration_settings_announcements_reviews.sql` and
`supabase_migration_v32_12_1.sql` (both touch `public.announcements`
and the `announcement-media` bucket that this file builds on). It is
additive/idempotent throughout — safe to run more than once. It:
- Adds `announcements.announcement_type` (`general`/`product`) and
  `announcements.target_type` (`product`/`combo`), backfills existing
  rows from their existing `product_id`/`combo_id`, and adds a CHECK
  constraint enforcing the pairing.
- Creates `public.gallery_media` (+ RLS) and the new `gallery-media`
  Storage bucket (+ public-read/admin-write policies) for the new
  Admin → Gallery feature.

**Before running against a project with real data:** run the
verification queries at the bottom of the migration file first on a
staging copy if possible, and read the comment directly above the
backfill `update` statements — they're written to be safe/idempotent,
but you should still confirm your real `announcements` rows end up
with the `announcement_type`/`target_type` you expect afterward.

**Requires live Supabase testing (cannot be verified offline) — see
`CHANGELOG_V32.3.md`'s "Offline vs. live testing" section for the full
list.**

### 2. Storage — new bucket

The migration creates the `gallery-media` bucket for you
(`insert into storage.buckets ... on conflict do nothing`) with public
read + admin write policies, mirroring the existing
`announcement-media` bucket. No manual Storage console steps should be
required — but confirm the bucket exists and is public after running
the migration:

```sql
select id, public from storage.buckets where id in ('announcement-media','gallery-media');
```

### 3. Static files — redeploy

Everything else in this release is static-file/JS: `admin.js`,
`admin.html`, `admin.css`, `app.js`, `index.html`, `style.css`,
`generate-gallery-manifest.js` (header comment only). Redeploy the
static site as usual (Git push / your existing hosting flow) — no
Edge Function changes in this release.

### 4. Gallery content

There is nothing to migrate from `images/gallery/` —
`images/gallery/manifest.json` was already empty. Add gallery content
from **Admin → Gallery** after this release is live.

---

## ✅ V32.12.1 — Password reset fix, coupon/cart sales UX, stale-state checkout revalidation, admin orders search, product-deletion cleanup, announcement media, scalability pass

**Read this section first — it supersedes nothing below, it's additive
on top of V32.12.** See **`CHANGELOG_V32.12.1.md`** for the full,
itemized release notes (what changed, what was preserved, what still
needs your live testing) and **`SCALABILITY_REVIEW.md`** for the
architecture review requested this round.

### 1. SQL migration (Supabase SQL Editor) — run this one, in order after everything already applied

```
supabase_migration_v32_12_1.sql
```

Apply it **after** every existing `supabase_migration_*.sql` in this
project (in particular `order_state_machine.sql`, `coupons.sql`,
`coupon_checkout.sql`, `settings_announcements_reviews.sql`,
`product_media_storage.sql`). It is additive/idempotent throughout
(`create or replace`, `if not exists`, `on conflict do nothing`) — safe
to run more than once. It:
- Replaces `place_order()` with a version that also re-checks
  **Vacation Mode**, the **delivery-enabled** master switch, and every
  item's **live price/active status** server-side, atomically, before
  creating the order (closes the stale-browser-state gap from spec
  items 6/16). Same function signature — no change needed anywhere
  that calls it.
- Adds `announcements.media_type`/`announcements.poster_url` and
  creates the `announcement-media` Storage bucket + RLS policies (for
  the new photo/video upload in Admin → Homepage).
- Adds a handful of additive indexes (`orders.status`,
  `orders.payment_status`, `orders.guest_phone`, etc.) supporting the
  new Admin Orders search/filter/sort and the existing coupon-usage
  lookups — see `SCALABILITY_REVIEW.md`.

**Requires live Supabase testing (cannot be verified offline) — do not
treat these as confirmed until you've run them against your project:**
- `place_order()` actually rejecting an order when Vacation Mode /
  delivery-enabled is flipped mid-session, or when a product's price
  changed since the cart was built.
- The `announcement-media` Storage bucket/policies actually allowing
  upload + public read end to end.
- The `pg_trgm` index for Admin Orders search (the migration wraps this
  in a `do $$ ... exception when others ...` block specifically so the
  rest of the migration still completes even if your plan can't enable
  the extension — search still works without it, just without the
  index).

### 2. Edge Function — redeploy `admin-reset-password`

The actual root cause of the live-tested 403 (*"the database/admin
account has already been verified independently... yet the function
returns 403"*) was found and fixed — **not a database/RLS/role
problem**. See `CHANGELOG_V32.12.1.md` for the full explanation. The
fix is entirely inside `supabase_functions/admin-reset-password/index.ts`
— redeploy it:
```
supabase functions deploy admin-reset-password
```
Then retry the exact live test that failed (fresh admin login → Reset
password on a test customer). The function now also writes safe,
secret-free diagnostic log lines (`supabase functions logs
admin-reset-password`) at each decision point, so if it fails again for
any reason, the logs will show exactly where, instead of another silent
403.

### 3. Storefront/Admin files — same static-site deploy as every prior release

No new build step, no new environment variables. Deploy `app.js`,
`admin.js`, `index.html`, `help.html`, `legal.html`, `style.css`,
`admin.css`, and the new `config-lite.js` together (bump the `?v=`
cache-busting query string on script/stylesheet tags in `index.html`/
`help.html`/`legal.html`/`admin.html`, same as every prior release, so
browsers fetch the new files rather than a cached copy).

### 4. What to test yourself after deploying (offline-testable items were already exercised — see CHANGELOG — but live confirmation is still yours to do)

- Add a single ₹155 item with a ₹199-minimum 10%-off coupon active →
  confirm the cart shows the "Add ₹44 more to unlock" nudge, and that
  "View all active offers" shows it visually locked with the same
  remaining amount.
- Apply a coupon on a ₹300 cart, then reduce quantity below the
  coupon's minimum → confirm it's automatically removed with the
  "...was removed because your cart is now below ₹199" message, and
  that Subtotal/Discount/Total/mobile cart bar/checkout summary all
  update together, nothing stale.
- Add a product to the cart → confirm a "You may also like" strip
  appears in the cart drawer with up to 3 relevant products and a
  working Add button.
- Open checkout with an old tab, flip Vacation Mode ON from Admin in
  another tab, come back and click Checkout without refreshing →
  confirm it's blocked with "We're currently not accepting orders...";
  repeat for the "Delivery enabled" switch.
- Help & Support and Policies & Legal → confirm the free-delivery
  threshold and delivery-timeline text match Store Settings exactly,
  and change Store Settings → confirm both pages pick up the new value
  on next load without a code change.
- Policies & Legal → confirm no website version is shown anywhere on
  that page.
- Admin → Orders → confirm search (order ID/name/phone), status/payment
  filters, date range, and all 5 sort options work and combine
  correctly, and "Clear filters" resets them.
- Admin → delete a product that has uploaded (Storage-hosted) media not
  used anywhere else → confirm the Storage file is actually gone from
  the `product-media` bucket afterward; delete a product whose media is
  *shared* with another product/combo (if you have such a case) →
  confirm that shared file is **not** deleted.
- Admin → Homepage → add an announcement, upload an image, then a
  video, confirm the preview updates and the homepage hero actually
  shows the uploaded media (not the linked product's own image) once
  saved.

---

## ✅ V32.12 — Coupons wired to storefront, password reset deployment, media → Supabase Storage

**Post-review correction pass applied — read this box first.** After
the initial V32.12 draft, review against the V32.11 baseline found 3
real gaps, all fixed in the files below before this package was
finalized:
1. `app.js` computed the product-card/gallery image from the lowest
   `display_order` only — it never looked at `is_primary` at all, even
   though Admin could already set it. Fixed in `loadCatalogFromSupabase()`
   (see CHANGELOG for exact mechanism) — now consistent for both
   products and combos, with the same lowest-`display_order` fallback
   only when nothing is marked primary.
2. `validate_coupon()` checked dates/min-order/usage but never
   `coupons.applicable_products`/`applicable_categories` — a
   product-restricted coupon could be applied to any cart. Fixed by
   giving `validate_coupon()` (and the cart-dropdown listing function)
   two new parameters, enforced identically in `place_order()` using
   server-computed product/category ids — never the browser's. Admin's
   coupon form also gained the product/category restriction checkboxes
   it was missing entirely (the DB columns existed but there was no UI
   to ever set them).
3. Existing Git-path media required manual per-product re-upload with
   no batch path. Added `scripts/migrate-media-to-storage.mjs` (see
   "Media migration" below) plus a read-only orphaned-file reporter,
   `scripts/list-orphaned-storage-files.mjs`, for the Storage-cleanup
   concern (deleting a DB row never deletes the Storage object it
   pointed to — this script only ever reports, never deletes).

See **`CHANGELOG_V32.12.md`** for the full release notes (this is the
release requested in the "V32.11 Stable Baseline — Next Development
Release" brief: complete the customer-facing coupon flow, fix the
Admin password-reset integration, and move product media from
Git-only to Supabase Storage). Summary of what to run, in order:

**1. SQL migrations (Supabase SQL Editor, in this exact order):**
```sql
-- Only if not already applied from earlier rounds:
--   supabase_migration_coupons.sql
--   supabase_migration_product_catalog.sql
--   supabase_migration_order_state_machine.sql

-- New this release:
supabase_migration_coupon_checkout.sql          -- public.list_active_offers(), list_eligible_offers_for_cart(), orders.coupon_* columns, coupon-aware place_order() with restriction enforcement
supabase_migration_product_media_storage.sql    -- product-media Storage bucket + RLS, product_media.is_primary
```
Both new files are additive/idempotent (`create or replace`, `if not
exists`, `on conflict`, `drop function if exists` immediately before
each `create`) — safe to run more than once, and safe even if an
earlier draft of `supabase_migration_coupon_checkout.sql` was already
applied (the corrected version replaces the function bodies cleanly).

**2. Storage bucket.** `supabase_migration_product_media_storage.sql`
creates the `product-media` bucket and its RLS policies via SQL
(`storage.buckets` / policies on `storage.objects`) — there is **no
separate dashboard step required** for the bucket itself. If your
Supabase project's SQL role doesn't have permission to insert into
`storage.buckets` directly (some hosted setups restrict this), create
the bucket once manually instead: **Dashboard → Storage → New bucket →
name `product-media` → Public bucket: ON**, then re-run just the
`storage.objects` policy statements from the migration file.

**3. Edge Function.** No change to `admin-reset-password` itself this
release (see "Password reset" below — the existing function was
already correct, and remains **unverified against your live project**
until you actually run it). If it has never been deployed to this
project, deploy it now:
```
supabase functions deploy admin-reset-password
```

**4. Git deploy.** Standard static-site deploy of this repo (same as
every prior release) — no new build step, no new environment
variables for the website itself. `supabase-config.js` is unchanged.
(The two new one-time scripts under `scripts/` are a separate,
Node-based operator tool — see "Media migration" below — not part of
the website's own deploy.)

**5. Verify** — see "Definition of done" / offline-vs-live testing
breakdown in `CHANGELOG_V32.12.md`.

### Password reset — what "fixing" this release actually means

Re-reviewed end to end for this release: **`admin.js`'s calling code and
`supabase_functions/admin-reset-password/index.ts` were already
correct** (the V32.5 CORS fix and the V32.8 authorization/error-message
work are both still present and unchanged). The screenshot behaviour
("Password was NOT changed — could not reach the admin-reset-password
function (Failed to fetch)") is the exact message this code was
written to show when the function has never been deployed to the live
project — having the function's source in this repo's
`supabase_functions/` folder does **not** deploy it. Run:
```
supabase login
supabase link --project-ref <your-project-ref>
supabase functions deploy admin-reset-password
```
then retry Reset password (R4) from Admin → Customers. If it still
fails after a confirmed deploy, the toast text now distinguishes the 3
remaining possible causes (session expired / not flagged admin / phone
not found) — see the V32.8 section further down this file for each.

### Media migration — moving existing Git media to Supabase Storage (script, not manual re-upload)

Per spec section 3.11/3.12, this is opt-in — nothing is deleted or
force-migrated, and Git-path media keeps working indefinitely as a
fallback. Two ways to do it:

**A. Batch, via the new script (recommended for migrating everything, or a whole product at a time):**
```
npm install                       # installs @supabase/supabase-js (see package.json)
export SUPABASE_URL=https://<your-project>.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=<your service_role key — never commit this>

# 1. Preview first — makes no changes at all:
node scripts/migrate-media-to-storage.mjs --dry-run

# 2. Migrate one product first, per spec Phase D ("test with a few products"):
node scripts/migrate-media-to-storage.mjs --only=peanut

# 3. Once verified on the storefront (card + gallery, mobile + desktop),
#    migrate everything else:
node scripts/migrate-media-to-storage.mjs
```
What it does, per row: finds the file on disk at its current Git path,
uploads it to the `product-media` bucket under `<product-or-combo-id>/…`
(the same layout Admin's own upload buttons use), and updates **only**
that row's `media_url` (and `poster_url` for a video's poster). It
never touches `display_order` or `is_primary` — whatever Admin already
configured is preserved exactly — and it never deletes the original
Git file. Safe to re-run: an already-migrated row (or an object that
already exists at the destination path) is skipped/reused rather than
duplicated.

**B. Manual, per product, via Admin (for one-off edits):**
1. Open **Admin → Products → Edit** the product.
2. Delete the existing Git-path media row and re-add the same image via
   **+ Add Photo** / **+ Add Video**, picking the file from your
   computer.
3. Use **☆ Set primary** on whichever image should be the product-card
   image (defaults to the first item if never set).
4. Save.

Either way, `app.js` reads `media_url` generically — it does not need
to know or care that the value changed from a Git path to a Storage
URL. Once every product's media is confirmed working from Storage, the
corresponding files under `images/products/<id>/` can be removed from
the Git repo in a later, separate cleanup release — never in the same
release that performs the migration, per spec.

Storage image delivery is optimised automatically: `app.js`'s
`responsiveImgAttrs()` detects a `storage/v1/object/public/...` URL and
requests width-specific variants from Supabase's
`storage/v1/render/image/public/...` transformation endpoint (400w/
800w/1600w) — no manual resizing step, unlike the Git-path workflow
which still needs `generate-product-image-variants.py`. If your
Supabase project's plan doesn't include Image Transformations, the
`<img>` tag's plain `src` (the untransformed public URL) is what
actually renders — this can never make an image disappear, only skip
the resize optimisation; confirm your plan includes it if page-weight
matters immediately.

### Storage cleanup — orphaned files (documented, not auto-deleted)

Deleting a `product_media` row (via the media editor's "×" button, or
via "Delete product"/"Delete combo", both of which delete their
media rows too) does **not** delete the underlying file from the
`product-media` Storage bucket — Storage objects and database rows are
independent. Over time this can leave orphaned files quietly using up
bucket storage.

**No automatic deletion is implemented** — deliberately: a file that
looks orphaned right now could still be about to be referenced by an
in-progress Admin edit, so any deletion needs a human to actually look
at the list first. Instead, run the read-only reporter whenever you
want to check:
```
node scripts/list-orphaned-storage-files.mjs
```
It lists every object in the bucket, cross-references it against every
`media_url`/`poster_url` currently in `product_media`, and prints
anything not referenced — with a count, not a delete action. Review the
list, then remove anything you're confident about directly from the
Supabase Dashboard's Storage browser. Add `--csv` to the command for a
copy-pasteable list if you're reviewing a large number of files.

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

**⚠️ V32.8 fix-up required if this project was live before V32.8:**
run `supabase_migration_v32_8_combo_media_path_fix.sql` once in the
Supabase SQL Editor. V32.8 moved the combo's image into its own
dedicated folder on disk (`images/combos/traditional-duo/hero.webp`,
previously the flat `images/combos/traditional-duo.webp`) — this small,
idempotent file updates the corresponding `product_media.media_url` row
to match, without touching any other product/combo/media data.
**Do not** re-run `supabase_migration_product_catalog.sql` for this —
that file deletes and re-seeds ALL product/combo media rows from its
hardcoded list, which would silently discard any media an Admin has
added since via Admin → Products/Combos → + Add Media.

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
- **The "PRODUCTION PROCEDURE" section immediately below this one is
  now entirely historical** — as of V32.11, store settings,
  announcements, and reviews (the last three things it ever applied
  to) are also Supabase-backed. Nothing on this site requires that
  procedure any more. It's kept below for historical reference only
  (it documents real incidents/fixes from V32.5) — do not follow its
  numbered steps for any current task.

---

## 📸 Adding New Product Images/Media (read this before adding a product)

*Added V32.8, extended from the V32.7 performance work. This is the
step-by-step version of what `scripts/generate-product-image-variants.py`
and `RESPONSIVE_PRODUCT_IMG` in `app.js` already do in code — follow
this every time so a new product/combo can't quietly reintroduce the
"5000px photos slow the site down" problem V32.7 fixed.*

### 1. Where files go

```
images/
├── products/
│   └── <product-slug>/
│       ├── hero.webp
│       ├── front-back.webp
│       ├── ingredients.webp
│       ├── serving.webp
│       └── video-01.mp4        (optional)
└── combos/
    └── <combo-slug>/
        └── hero.webp, ...      (identical rules, own folder)
```

Every product **and every combo** gets its own folder under
`images/products/` or `images/combos/` respectively — never share a
folder between two products, and never pull from `images/gallery/`
(that folder is for genuinely generic site content only and is never
consulted for product/combo media).

### 2. Naming conventions

- **Folder name** = the product/combo's `id`/slug, lowercase,
  hyphen-separated (e.g. `peanut`, `flaxseed-chutney`,
  `breakfast-combo`) — matches the `id` you'll use in Supabase.
- **Image file name** = a short, descriptive word for what the photo
  shows (`hero`, `front-back`, `ingredients`, `serving`, `packaging`),
  not a generic counter like `image1.jpg`. Any number of these per
  product — there's no fixed slot count.
- Don't add your own `-400w`/`-800w` files by hand — the script in
  step 4 generates those from whatever you name your original.

### 3. Source image rules (this is what actually keeps the site fast)

| Rule | Why |
|---|---|
| Format: **WebP** (`.webp`) only | The optimization script and the responsive-`srcset` code in `app.js` only recognize `.webp`. A `.jpg`/`.png` will still display (plain `<img>`, no optimization) but won't get responsive variants — convert to WebP first. |
| Recommended source size: **under ~2000px** on the long edge, ideally already close to **1600px** | The script resizes anything over 1600px down automatically, but starting closer to that size means a smaller, faster upload and less to re-compress. There's no benefit to shipping a 5000px camera original into Git at all. |
| Recommended source file size: **under ~2–3MB** per photo before optimization | Anything larger almost always means the source wasn't resized/compressed on export — check your camera/editing app's export settings. |
| Don't hand-optimize/compress further yourself | The script controls quality settings consistently (master ~84%, thumbnails ~72–78%) — over-compressing before the script runs just compounds quality loss. |

### 4. Run the optimization script — every time you add or replace a photo

```bash
python3 scripts/generate-product-image-variants.py
```

This is **required**, not optional. It walks every file under
`images/products/**/*.webp` and `images/combos/**/*.webp` and, for
each one:
1. If it's larger than 1600px on its long edge, resizes it down and
   re-saves it **in place** (same filename — nothing else needs to
   change).
2. Generates `<name>-400w.webp` and `<name>-800w.webp` next to it.

It's safe to re-run any time — already-optimized files are just
re-processed into the same result, and it only ever touches `.webp`
files under those two folders.

### 5. What happens if you skip the script / add an image without variants

The site will **not break** — `responsiveImgAttrs()` in `app.js` only
adds `srcset` for a path if the matching `-400w`/`-800w` files exist
next to it; if they don't, it falls back to plain `<img src="...">`
with no responsive variants. But that means:
- Every visitor, phone or desktop, downloads the **full master file**
  for that image — exactly the slow-loading problem V32.7 fixed.
- Nothing will look "broken" in testing, which is exactly why it's
  easy to forget. Always run the script before considering a new
  product/combo photo done.

### 6. Multiple images per product/combo

Just add more files to the same folder (`hero.webp`, `front-back.webp`,
`serving.webp`, ...) and run the script once — it processes every file
it finds. There's no limit and no code change needed; the product card,
detail gallery, and combo card all render however many media rows exist
for that product/combo in Supabase (see step 8).

### 7. Videos

Drop the video file (`.mp4`) into the same product/combo folder. Videos
are **not** processed by the image script (no resizing/compression is
applied to video — that's a separate, larger topic if it's ever
needed). In the `product_media` row for a video, set `media_type` to
`video` and, if you have one, a `poster_url` pointing at a WebP still
frame (run that still frame through the same image script like any
other photo) — the video element already uses `preload="metadata"` and
never autoplays, so it won't be downloaded until the customer taps it.

### 8. Reference it in Supabase (`product_media`)

Add one row per image/video to `public.product_media`:

```sql
insert into public.product_media (product_id, media_type, media_url, display_order)
values ('peanut', 'image', 'images/products/peanut/hero.webp', 1);

-- combo example — combo_id instead of product_id, everything else identical
insert into public.product_media (combo_id, media_type, media_url, display_order)
values ('breakfast-combo', 'image', 'images/combos/breakfast-combo/hero.webp', 1);
```

Always reference the **master** filename (`hero.webp`), never the
`-400w`/`-800w` files directly — the frontend derives those
automatically from the master path. `display_order` controls the
order images appear/swipe in; `is_active=false` hides one image
without deleting the row.

### 9. The one rule that matters most

**Never commit a product/combo photo without running
`scripts/generate-product-image-variants.py` afterward, and never
reference a `-400w`/`-800w` filename directly in `product_media` —
always reference the master.** Everything else in this section exists
to support that one rule.

---

## ✅ V32.11 update — Store Settings, Announcements, and Reviews are now live in Supabase (final architecture)

As of this release, `EMBEDDED_CONFIG`/`CONFIG_FALLBACK`/`jayviStoreV14`
no longer hold any business data at all. Store settings (delivery,
payments, contact, auth, misc + the 2 homepage hero fields), homepage
announcements, and the curated "Google reviews" testimonials — the
last three pieces that were still local — now live in three new
Supabase tables: `store_settings` (a single row), `announcements`, and
`curated_reviews`. Created by
`supabase_migration_settings_announcements_reviews.sql`.

This is the final architecture, with no more exceptions:

```
Git/GitHub
  — Website/application code (app.js, admin.js, index.html, ...)
  — Website hosting/deployment
  — Product/combo images/videos (images/products/, images/combos/,
    with the V32.7 responsive-image optimization pipeline)

Supabase (SQL) — all business/customer/dynamic data
  — Products, product media references, Combos
  — Categories, Meal tags
  — Store settings, Homepage announcements, curated Reviews
  — Customer-submitted Reviews (website_reviews)
  — Customers/accounts (Supabase Auth + profiles), Addresses
  — Orders, order status history, order state machine
  — Coupons, Pincodes/delivery, Social links, Notifications
```

**What this means in practice:** every one of the "Adding, editing, or
deleting X in Admin is now live for every customer immediately, no Git
sync, no redeploy" statements earlier in this file now applies to
**every** piece of business data on the site, not just products/
combos/categories/meal tags. `EMBEDDED_CONFIG`/`CONFIG_FALLBACK` still
exist as source-code objects (for the offline/fetch-failure fallback
described below) but hold no data an Admin is ever expected to edit
through them again.

**On-failure fallback, same principle as every prior migration:** if
the Supabase fetch for settings/announcements/reviews fails for any
reason, the storefront falls back to whatever `loadConfig()` already
resolved from `EMBEDDED_CONFIG`/`localStorage`, so it never renders
blank. This is a genuinely independent fetch from products/combos and
from categories/meal tags — a failure in any one of the three has no
effect on the other two.

**Run before/during deploy:**
```
supabase_migration_settings_announcements_reviews.sql
```
Read the file's own header comment before re-running it later — the
`store_settings` seed specifically uses `on conflict do nothing` (not
`do update`), unlike every other seed in this project, precisely so a
later re-run can never silently reset real settings an Admin has
already changed.

### Full audit — everything checked, two items explicitly flagged rather than migrated

Every top-level key in `EMBEDDED_CONFIG`/`CONFIG_FALLBACK` was
enumerated directly from source (not from memory) and accounted for:
`products`, `combos` → Supabase since V32.6; `categories`, `mealTags`
→ Supabase since V32.10; `store`, `homepage`, `announcements`,
`reviews` → Supabase as of this release; `mealLabels` is a derived
field (computed from `mealTags`), not real data. Nothing remains
unaccounted for in either config object.

Two things turned up in the broader sweep that are **explicitly not
migrated** — flagged per the instruction to identify rather than
silently act:

1. **Cart (`jayviCartV14`) and Wishlist (`jayviWishlistV9`) —
   still per-browser `localStorage`, deliberately not touched.**
   These are architecturally different from everything else migrated
   so far: they're pre-checkout, per-device, transient customer state
   — not a persisted business record. The actual business record
   (the Order) is already in Supabase the moment checkout completes;
   cart/wishlist are what a shopper has before that point. Migrating
   these to Supabase would be a materially larger, different kind of
   change than every migration in this file so far — it would mean
   either requiring login before adding to cart (a real UX change) or
   building guest-session cart sync, real-time updates across tabs,
   and conflict handling for concurrent edits. That's a genuinely new
   feature, not a data-location change, and risks exactly the kind of
   "unrelated refactoring" this release was scoped to avoid. **Left
   as-is pending an explicit decision** on whether guest carts should
   require an account, before any implementation is attempted.
2. **Two hardcoded content dictionaries in code, not data:**
   `MEAL_DESCRIPTIONS` (`app.js`) — one sentence of pairing copy per
   meal tag, but only covers 4 of the 10 `meal_tags` that now exist in
   Supabase (idli/dosa/chapati/rice; roti/paratha/poori/upma/vada/
   curd-rice have no description at all, a pre-existing gap, not
   something this release introduced) — and `WHATSAPP_STATUS_TEMPLATES`
   (`admin.js`) — the wording of each order-status WhatsApp message.
   Both are genuinely business-facing content an Admin might reasonably
   want to edit without a code change, but turning either into an
   editable Supabase-backed feature is new functionality (a template/
   copy editor), not a data migration of something already
   editable elsewhere. Flagged, not implemented, pending confirmation
   this is actually wanted.

**Confirmed correctly NOT flagged** (media, not business data, matches
the architecture's own "Git = media" bucket): `images/gallery/
manifest.json`, an auto-generated listing of decorative gallery images
(see `generate-gallery-manifest.js`) — this is a directory listing for
Git-managed media, not a business record, and correctly stays in Git
under this architecture.

---

## ✅ V32.10 update — Categories and Meal tags are now live in Supabase too

As of this release, **Categories and Meal tags are no longer part of
the `jayviStoreV14` localStorage blob** either. They live in two new
Supabase tables — `categories`, `meal_tags` — created by
`supabase_migration_categories_meal_tags.sql` (run once in the
Supabase SQL Editor; it also seeds the 4 categories / 10 meal tags
that were previously hardcoded in `EMBEDDED_CONFIG`/`CONFIG_FALLBACK`).

This completes the migration that started with Products/Combos in
V32.6 — every piece of the product catalogue (products, product media,
combos, categories, meal tags) is now centrally managed through
Supabase. Only store settings, announcements, and reviews remain
local/Git-managed (see the "PRODUCTION PROCEDURE" section immediately
below, which now applies to just those three).

**What this means in practice:**
- Adding, editing, or deleting a category/meal tag in Admin is now
  **live for every customer, on every device, immediately** — no Git
  sync, no copying JSON, no redeploy. Both pages now show the same
  green "Live for every customer, on every device" note Products/
  Combos already showed.
- The storefront (`app.js`) reads categories/meal tags from Supabase on
  every load, via its own independent fetch — separate from the
  products/combos fetch, so a failure in one can never affect the
  other. On failure, it falls back to the embedded/local copy exactly
  like products/combos already do, so the store never renders empty.
- The "Local configuration" warning banner is gone from both pages —
  it would no longer be true, and the code that rendered it
  (`localCatalogWarning()`) has been removed from `admin.js` entirely.

**Run before/during deploy:**
```
supabase_migration_categories_meal_tags.sql
```
Safe to run once on any project — see the migration file's own header
comment for exactly what re-running it later does and doesn't affect
(short version: it will not touch categories/meal tags with a
different id than the 14 seeded ones, and will not touch products,
combos, or any other data at all).

**Final architecture, as of V32.10:**
```
Git/GitHub
  — Website/application code (app.js, admin.js, index.html, ...)
  — Website hosting/deployment
  — Images/videos/media (images/products/, images/combos/, with the
    V32.7 responsive-image optimization pipeline)

Supabase (SQL)
  — Products, product media references, Combos
  — Categories, Meal tags
  — Customers/accounts (Supabase Auth + profiles)
  — Orders
  — Coupons, pincodes/delivery, reviews (server-managed pieces),
    notifications
```
Store settings, homepage announcements, and reviews (the storefront's
own managed-review list, not the coupon/order-adjacent tables above)
are the only pieces of "business configuration" still local/Git —
everything else that's genuinely customer/business data now lives in
Supabase.

---

## ⚠️ PRODUCTION PROCEDURE — Adding a product after launch (HISTORICAL — no longer applicable to any current task, kept for reference)

**As of V32.11, every piece of business data on this site is
Supabase-backed — this entire section describes a procedure that no
longer applies to anything.** It's kept below unedited because it
documents a real incident and fix from V32.5 (the schema-mismatch bug
described further down), which is useful history, but do not follow
its numbered steps for products, combos, categories, meal tags, store
settings, announcements, or reviews — none of them need this any more.

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
individually copied over (historical note: this described the
pre-V32.6/V32.10 state, when products/combos/categories/meal tags were
all still local too — today only store settings/announcements/reviews
are at risk here). The fix is in the procedure, not in being
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
   publish in one sitting — announcements, store settings (the only
   things this procedure still applies to; products, combos,
   categories, and meal tags are all Supabase-backed now and publish
   immediately on Save, no procedure needed) — clicking Save as you
   go. Each Save writes the *entire* current configuration to that
   browser's `localStorage` under `jayviStoreV14`.
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

**V32.8 — password reset: what changed and how to verify end-to-end.**
The Edge Function's own logic was re-reviewed and is correct: it uses
`auth.admin.updateUserById(targetProfile.id, { password: newPassword })`
with the `service_role` key — a real Supabase Auth password change, not
a `profiles` field update or a fake success message. If Admin reset
still doesn't work for you, the cause is essentially always one of
these, **in this order of likelihood**:
1. **The function has never actually been deployed to your project**
   (having the code in this repo's `supabase_functions/` folder does
   **not** deploy it — that only happens when you run
   `supabase functions deploy admin-reset-password` against your
   actual project). This is the #1 cause of "still not working" across
   every round of this fix so far.
2. The signed-in Admin's `profiles.role` isn't actually `'admin'` —
   the function checks this server-side and refuses with a 403 if not,
   regardless of what the Admin panel's UI lets you click.
3. The phone number typed doesn't exactly match `profiles.phone` for
   that customer (10 digits, no `+91`/country code, no spaces) — a 404
   means no profile was found with that exact value.

As of V32.8, `admin.js` reports **which of these three** happened
instead of one generic message — check the toast text after a failed
reset; it now says explicitly "no customer profile found," "not
authorized — admin role required," or "session expired," rather than
just "Reset failed."

**What was genuinely missing (and is now fixed): the customer side.**
Before V32.8, there was no way for a signed-in customer to set their
*own* new password — only Admin could set one for them, via the
privileged Edge Function above. Customers can now do this themselves
from **My Jayvi → Security** (a new tab in the account view, `app.js`),
which calls Supabase's own unprivileged, self-service
`sb.auth.updateUser({ password })` for their **own** current session —
a completely different, no-special-permission code path from Admin's
reset. This is what makes "Admin resets a temporary password, customer
then sets their own permanent one" actually possible end-to-end.

**The existing "Forgot password" flow was checked and is unchanged by
design, not broken.** `checkForgotPasswordPhone()` in `app.js`
confirms the phone number exists (via `check_phone_registered`) and
then hands off to WhatsApp — there is intentionally no automated
OTP/email self-service reset yet (see the Phase 1 comment directly
above that function in `app.js`). That's a documented future
enhancement, not a bug this release fixes; V32.8 did not change this
flow's behavior.

**Full acceptance sequence to run yourself against your live Supabase
project** (this cannot be verified from source code alone — it needs
your actual deployed function and a real test account):
```
1. Confirm deployment:  supabase functions deploy admin-reset-password
2. Register a dummy customer via the storefront (10-digit test phone)
3. Admin → Customers → find them → Reset password → set a temp password
   - Watch for the specific error text if this fails (see the 3 causes above)
4. Customer: sign out if signed in, sign back in with phone + temp password
5. Customer: My Jayvi → Security → set a new password
6. Customer: sign out, sign back in with the NEW password (not the temp one)
7. Confirm Admin's own email login still works unaffected (separate code path)
```

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

**V32.12 adds two more, after everything above:**
3. **`supabase_migration_coupon_checkout.sql`** (corrected — see the
   note at the top of DEPLOY.md's V32.12 section) —
   `public.list_active_offers()`, `public.list_eligible_offers_for_cart()`,
   4 new nullable/defaulted columns on `orders`, and an additional
   coupon-aware overload of `place_order()` that also enforces
   `applicable_products`/`applicable_categories`. Requires
   `supabase_migration_coupons.sql` (coupons/validate_coupon) to already
   be applied.
4. **`supabase_migration_product_media_storage.sql`** — the
   `product-media` Storage bucket + RLS, and `product_media.is_primary`.
   Requires `supabase_migration_product_catalog.sql` (product_media
   table) to already be applied.

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
