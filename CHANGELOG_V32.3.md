# Jayvi Foods — CHANGELOG V32.3

Builds on the V32.12.1 stable baseline. Nothing in that baseline
(Supabase catalogue/media, coupons, server-side `place_order()`
validation, vacation/delivery protection, cart recommendations, admin
orders search, product/combo Storage cleanup, scalability indexes,
password-reset fix) was rolled back, replaced, or rewritten — this is
an additive release focused on Homepage Announcements and a new
Admin-managed Gallery.

**Read `DEPLOY.md`'s "V32.3" section for the exact deploy steps.** (An
older, unrelated file also happened to be named `V32.3-INSTALL.txt` —
it documented a historical release from earlier in this project and
has been renamed to `V32.3-INSTALL-HISTORICAL.txt` to remove the
naming collision; see that file's new header for details. It does not
apply to this release.)
Everything below marked "Requires live Supabase testing" cannot be
verified from this codebase alone — see §"Offline vs. live testing".

---

## 1. Announcements — General vs. Product (spec §3)

**Problem:** the old form only had a "Click action" (Open product /
Open combo / Shop / Reviews / URL). A general announcement like
"Independence Day special" and a product announcement like "Peanut
Chutney — perfect for breakfast" were both forced through the same
"what happens when this is clicked" question, with no explicit
concept of "this announcement *belongs to* Product X."

**Fixed:**
- `public.announcements` gets two new columns (migration, additive):
  `announcement_type` (`'general'` | `'product'`) and `target_type`
  (`'product'` | `'combo'`, only meaningful when `announcement_type =
  'product'`).
- Existing rows are backfilled automatically and safely: any row that
  already had a `product_id`/`combo_id` becomes `announcement_type =
  'product'`; everything else becomes `'general'`. This only reads
  from `product_id`/`combo_id` — it can never clobber a value Admin
  sets afterward through the new UI.
- A database CHECK constraint enforces the pairing so a General
  announcement can never carry a product/combo, and a Product
  announcement always carries exactly one.
- Admin → Homepage now has an explicit **Announcement type** radio:
  *General announcement* / *Product announcement*. Selecting Product
  reveals **Select Product** (or **Select Combo**, via a sub-choice) —
  this relationship drives the click destination AND the media
  fallback (spec's own product/combo image), automatically. No more
  conflating "click action = open product" with "this announcement
  belongs to Product X" — see the code comments in `admin.js` /
  `app.js` for exactly where that used to be conflated.
- A General announcement instead gets an **optional CTA** (None / Open
  Shop / Open Reviews / External link) — spec §9's "it can have an
  optional CTA/link."

**Storefront (`app.js`):** `heroShow()` now branches on
`announcementType`/`targetType` (not on which of `productId`/`comboId`
happens to be set), shows the price badge only for a resolved Product
announcement, and — spec §9 — if the linked product/combo has since
been deleted or deactivated, hides the price badge and the "Shop"
button entirely rather than pointing at nothing.

## 2. Announcement media — redesigned UX (spec §4)

**Before:** a raw "image/video path or URL" text field plus an upload
button — Admin had to trust an "Uploaded filename.jpg" status message,
never actually seeing the media.

**Now**, matching Product → Media's visual language:
- No media yet → **`+ Add Photo`** / **`+ Add Video`**.
- Media present → the actual image/video renders inline, with
  **Replace** / **Remove** underneath. There is no third button to
  "add more" — structurally, an announcement can only ever have the
  one media slot, so the UI never lets you get into a two-media state.
- Replacing swaps the file (new upload first, old file cleaned up only
  after the row is safely saved with the new URL — see §4 below).
- Schema-wise, nothing new was needed here: `media_type`/`image`/
  `poster_url` already existed from V32.12.1 and are reused as-is, per
  the brief's instruction to reuse existing schema over duplicating it.

## 3. Announcement deletion (spec §6) — previously missing entirely

- Admin → Homepage: every announcement card now has a **Delete**
  button with a native `confirm()` ("Delete this announcement?").
- Deleting removes the row, then safely cleans up its Storage-hosted
  media (`image`/`poster_url`) **only if no other announcement row
  still references the exact same URL** — same "never blindly delete
  shared media" philosophy as `cleanupOrphanedMedia()` for products/
  combos (see `cleanupAnnouncementMedia()` in `admin.js`). External
  URLs / non-Storage paths are never touched.
- The same safe-cleanup call runs on **Replace** (old file) — not just
  on delete.

## 4. Announcement editing — retains all existing information (spec §7)

All fields (label/title/emphasis/text/order/active/showPrice/type/
target/media) are read back into the form on Edit and preserved on
Save unless deliberately changed. Switching **Product → General**
clears the product/combo association (enforced both in the UI and by
the new DB constraint); switching **General → Product** requires
picking a product/combo before Save will proceed (`saveAnnouncement()`
refuses and toasts if nothing is selected). Replace image→image,
image→video, video→image all route through the same single-slot
media UI and the same safe-cleanup path described in §2-3.

## 5. Product image fallback preserved (spec §8)

A Product announcement with no custom media still falls back to its
linked product/combo's own image, exactly as before — this behavior
was already correct in V32.12.1 and is untouched; it's just now driven
by the explicit `announcementType`/`targetType` relationship instead
of "whichever of productId/comboId happens to be set." A General
announcement with no media renders the same graceful default image
used everywhere else in the app — never a broken `<img>`.

## 6. Announcement ordering — preserved (spec §10)

`display_order` / drag-free "Display position" field is unchanged;
adding or replacing media never touches it.

---

## 7. Gallery — new Admin-managed, Supabase-backed feature (spec §11-18)

**What existed before:** `images/gallery/` (SVGs), an empty
`images/gallery/manifest.json` (`[]` — nothing was actually live), a
generator script `generate-gallery-manifest.js`, and
`renderBrandGallery()` in `app.js` rendering a continuously-scrolling
marquee from that manifest. **Reviewed first, per the brief's
instruction** — confirmed no gallery table/bucket already existed
anywhere in the prior migrations, and that the manifest was already
empty, so there was no live content to migrate.

**New:**
- `public.gallery_media` table (id, media_type, media_url, poster_url,
  caption, display_order, active, timestamps) + RLS (public reads
  active rows; Admin reads/writes all) — same shape as
  `announcements`/`curated_reviews`.
- New `gallery-media` Storage bucket + public-read/admin-write
  policies, mirroring `announcement-media`'s policy shape exactly.
- New **Admin → Gallery** page (separate from Products/Combos/
  Announcements/Reviews): **`+ Add Photos`** (multi-file) and
  **`+ Add Video`** upload straight into Storage; each item gets a
  thumbnail/preview, an optional caption field, an Active toggle,
  ↑/↓ reorder buttons (swaps `display_order` between adjacent items —
  a clear, simple ordering mechanism per spec §14, without the
  complexity of full drag-and-drop), and **Delete** with the same
  safe, shared-aware Storage cleanup used everywhere else
  (`cleanupGalleryMedia()`).
- Gallery items support **any mix of images and videos** — no cap,
  unlike announcements' one-media rule.

**Storefront (`app.js`):** `renderBrandGallery()` now fetches active
`gallery_media` rows from Supabase and renders a real **slideshow**
(fade transition + dot indicators) in place of the old marquee:
- 1 item → static, no animation. 2+ items → auto-rotate (spec §17: no
  awkward infinite-loop animation for 1-2 items).
- Only the **currently active** video is ever given a real `src` /
  loaded — every other video slide stays unloaded until it becomes
  active, and auto-rotation pauses while a video is actually playing,
  resuming once it ends (spec §17 "pause/appropriate handling for
  video"; spec §23 "don't preload/download multiple large videos").
- Images use `loading="lazy"` (except the first, which is `eager`) —
  spec §23's lazy-loading requirement.
- The whole section hides gracefully if there are zero active items or
  the fetch fails, same fail-safe pattern the old manifest-based
  version used.

`images/gallery/*` and `generate-gallery-manifest.js` are **left in
place, unused** (not deleted) per the brief's explicit instruction —
now documented as deprecated in a header comment.

---

## 8. Other fixes (spec §20-21)

- **Policies & Legal / website version (§20.B):** reviewed
  `legal.html` — it does not contain a footer or any "Website vX.X.X"
  text at all (that string is in `help.html`'s footer, not
  `legal.html`'s). No change was needed on `legal.html` to satisfy
  "Policies & Legal should not show the website version" — it already
  doesn't. `help.html`'s and `index.html`'s own footers (outside
  Policies & Legal) are unchanged, per "don't touch unrelated
  functionality."
- **Hardcoded ₹599 (§20.C):** found and fixed **two** additional
  hardcoded copies that `sync()` in `app.js` never updated: the
  aria-hidden duplicate topbar marquee span, and the "Free delivery /
  Above ₹599" trust badge on the homepage. Both now update from
  `CONFIG.store.freeShippingThreshold`, same single source of truth
  (`store_settings`) as the primary topbar text and `config-lite.js`'s
  `help.html`/`legal.html` copy. The static fallback text (shown only
  if the live fetch fails) is left as-is, per the brief — that's the
  intended graceful-degradation behavior, not a bug.
- **Delivery configuration (§21):** unchanged — `store_settings`
  remains the single source of truth for delivery threshold/timeline/
  charge/enabled + vacation mode. No second configuration source was
  introduced anywhere in this release.
- **Bug fix, found during this review:** `renderAnnouncementTarget()`
  was called (`onchange="renderAnnouncementTarget()"`) in the
  V32.12.1 announcement form but was **never defined anywhere** in the
  codebase — the target dropdown for Open Product/Open Combo silently
  never rendered. This is moot under the new General/Product model
  (replaced by `renderAnnouncementTypeFields()`), but is called out
  here since it was a real, live bug in the baseline.

---

## Files changed

- `supabase_migration_v32_3.sql` — **new**. Run after every existing
  `supabase_migration_*.sql`, in particular after
  `supabase_migration_settings_announcements_reviews.sql` and
  `supabase_migration_v32_12_1.sql`.
- `admin.js` — General/Product announcement form, single-media UI,
  `deleteAnnouncement()`, new Gallery admin page + upload/reorder/
  delete, `fetchAnnouncements()`/`saveAnnouncementToSupabase()` extended
  for the new columns, `render()` wired for the `gallery` tab.
- `admin.html` — new "Gallery" nav entry; cache-busting bumped to
  `?v=32.3`.
- `admin.css` — styles for the single-media preview and the Gallery
  admin grid.
- `app.js` — `loadSettingsAnnouncementsReviewsFromSupabase()` reads the
  new announcement columns; `heroShow()` rewritten for General/Product
  semantics + graceful broken-link handling; `renderBrandGallery()`
  rewritten as a Supabase-backed slideshow; `sync()` fixes the two
  additional hardcoded ₹599 spots.
- `index.html` — new gallery markup (`#gallerySlides`/`#galleryDots`),
  `id`s added to the duplicate topbar span and the trust-badge free-
  delivery text so `sync()` can update them; cache-busting bumped.
- `style.css` — new slideshow CSS, replacing the old marquee-only
  gallery CSS.
- `generate-gallery-manifest.js` — header comment marks it deprecated;
  file otherwise untouched/not deleted (spec §19).
- `VERSION.txt` — `32.3`.
- `CHANGELOG_V32.3.md`, `DEPLOY.md` — this release.

## Not touched (per spec §29)

Checkout, coupons, cart, orders, authentication, product catalogue,
and payment logic are unchanged in this release.

---

## Offline vs. live testing

**Verified offline (this environment has no Supabase access):**
- `node --check` passes on every changed `.js` file
  (`admin.js`, `app.js`, `config-lite.js`,
  `generate-gallery-manifest.js`).
- Every new `id`/DOM hook referenced from `app.js` exists in
  `index.html` and vice versa (hero elements, gallery slideshow,
  topbar duplicate, trust badge).
- Every new/changed function reference in `admin.js` resolves to
  exactly one definition (no leftover duplicate or dangling calls from
  the old announcement form).
- SQL migration reviewed manually for balanced parens/`$$` blocks and
  consistent `is_admin()`/`profiles` policy shape against the existing
  `announcement-media` bucket policies it mirrors.
- Announcement General/Product/media/delete logic, one-media
  restriction, and Gallery add/reorder/delete/active-toggle logic were
  each traced through by hand against the spec's own test list (§7,
  §27-28).

**Requires live Supabase testing (cannot be verified here) — do not
consider these confirmed until run against your project:**
- Running `supabase_migration_v32_3.sql` against your real
  `announcements` data and confirming the backfill + new CHECK
  constraint apply cleanly (see the verification queries at the bottom
  of that file).
- `gallery-media` bucket upload + public read, end to end.
- Announcement/gallery media upload, replace, and delete against real
  Storage (including confirming orphan cleanup doesn't remove a file
  that's still shared).
- The full Admin → Gallery reorder/active/delete flow against real
  rows, and the resulting storefront slideshow (image+video mix,
  1 item, 2+ items, mobile + desktop).
- Confirming `legal.html` genuinely shows no website version in your
  deployed environment (this release did not need to change the file
  to satisfy that, based on its current contents — but only your live
  deployment can confirm nothing else on the page injects it).
