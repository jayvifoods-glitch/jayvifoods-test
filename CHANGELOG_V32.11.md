# Jayvi Foods — V32.11 Changelog

Final architecture migration: Store Settings, Homepage Announcements,
and curated ("Google") Reviews move from `localStorage`/
`EMBEDDED_CONFIG` to Supabase — the last three pieces of business data
that weren't already there. This completes the target architecture
with no exceptions: **Git** = website code, hosting, and product/combo
media only; **Supabase** = all business/customer/dynamic data.
**Not touched:** Products, Combos, Categories, Meal tags, product
media/image-optimization architecture, cart, checkout, orders, PIN
validation, authentication, or any other stable functionality.

## What changed

**New Supabase tables**
(`supabase_migration_settings_announcements_reviews.sql`):
- `store_settings` — a single row holding every delivery/payment/
  contact/auth/misc setting plus the 2 homepage hero fields, structured
  identically to the field names already used in
  `EMBEDDED_CONFIG.store`/`.homepage`. Public reads (nothing here is
  more sensitive than what already shipped in the public JS bundle);
  only Admin writes.
- `announcements` — the homepage hero slider content, including the
  `image`/`showPrice` fields the Admin form has actually collected
  since an earlier "V22 polish" pass (verified by tracing the real,
  currently-active `announcementForm`/`saveAnnouncement` — an admin.js
  override block reassigns these at the bottom of the file, so that's
  the version that matters, not the earlier base definitions higher up).
- `curated_reviews` — the manually-managed "Google reviews"
  testimonials shown on the homepage. Kept as a distinctly-named table
  from `website_reviews` (customer-submitted reviews, already in
  Supabase since an earlier release) — the two are different features
  and were never meant to merge.

**Re-run safety, explicitly different for one table:** the
`store_settings` seed uses `on conflict (id) do nothing`, not
`do update` like every other seed migration in this project. Reasoning
spelled out in the file's own header comment: this single row is
exactly the kind of thing an Admin edits within minutes of go-live
(WhatsApp number, UPI ID, delivery days) — `do update` here would mean
a later re-run could silently reset real settings back to placeholder
values. `announcements` keeps the same `do update` pattern already used
for categories/meal tags (only resets its own 3 seeded ids, h1/h2/h3,
never touches anything else). `curated_reviews` has no seed step at
all — `EMBEDDED_CONFIG.reviews` was already an empty array, so there
was nothing to migrate.

**`admin.js`:**
- `fetchStoreSettings()`/`saveStoreSettingsToSupabase()` — all 5
  existing settings-save functions (Store Operations, Payments, Auth,
  Location, Contact) now write to Supabase; each still only mutates its
  own subset of fields on the shared `data.store` object before the
  common save call, so nothing else already saved is clobbered.
- `fetchAnnouncements()`/`saveAnnouncementToSupabase()` — wired into
  both the page render and the actual active `saveAnnouncement`
  override.
- `fetchCuratedReviews()`/`saveCuratedReviewToSupabase()`/
  `deleteCuratedReviewFromSupabase()` — wired into the "Google reviews"
  half of the Reviews page (the separate, Supabase-native
  customer-submitted-review workflow above it was already live and is
  untouched).
- `dashboard()` and `orderView()` now also fetch fresh store settings,
  since both display live values from it (vacation mode, payment
  toggles, refund-days wording in status messages).
- `persist()`'s toast already correctly scoped to nothing (see V32.10)
  is now genuinely accurate — there is no remaining Admin action that
  writes to `localStorage` as its source of truth.

**`app.js`:**
- New `loadSettingsAnnouncementsReviewsFromSupabase()`, called from
  `init()` in parallel with the products/categories fetches (three
  fully independent `Promise.all` entries — a failure in any one has
  zero effect on the other two). Same "never render blank" fallback
  principle as every prior migration: on failure, `CONFIG.store`/
  `.homepage`/`.announcements`/`.reviews` simply keep whatever
  `loadConfig()` already resolved from the embedded/local copy.

**Full audit performed, two items explicitly flagged (not migrated):**
1. **Cart (`jayviCartV14`) / Wishlist (`jayviWishlistV9`)** — still
   per-browser `localStorage`. Deliberately not touched: these are
   pre-checkout, per-device, transient state, architecturally different
   from persisted business records (the actual Order is already in
   Supabase from the moment checkout completes). Migrating cart/
   wishlist would mean either gating cart access behind login or
   building real guest-session sync — a materially different, larger
   change than a data-location migration, and out of this release's
   scope without an explicit decision on the login question.
2. **`MEAL_DESCRIPTIONS`** (`app.js`) and `WHATSAPP_STATUS_TEMPLATES`
   (`admin.js`) — hardcoded content dictionaries (meal-pairing copy;
   order-status WhatsApp message wording). Both are business-facing
   text an Admin might reasonably want to edit, but turning either into
   an editable Supabase-backed feature is new functionality (a content/
   template editor), not a migration of something already editable —
   flagged, not implemented.

**Confirmed correctly out of scope, not a gap:** `images/gallery/
manifest.json` (an auto-generated listing of decorative gallery
images) — this is Git-managed media, not business data, and correctly
stays in Git under this architecture.

**Version:** `VERSION.txt`, the footer's "Website v32.10" → "v32.11",
and every `?v=` cache-busting reference bumped.

**`DEPLOY.md`:** new "V32.11 update" section with the final,
no-exceptions architecture table and the full audit above; the old
"PRODUCTION PROCEDURE" section (and the V32.6/V32.10 notes pointing at
it) are now marked as fully historical — nothing on the site needs
that procedure any more, for anything.

## Git files changed
- `supabase_migration_settings_announcements_reviews.sql` (new)
- `admin.js` — settings/announcements/reviews save functions rewired to
  Supabase; `dashboard()`/`orderView()` fetch fresh settings
- `app.js` — `loadSettingsAnnouncementsReviewsFromSupabase()` added,
  wired into `init()`
- `index.html`, `admin.html` — version bumped to 32.11
- `VERSION.txt` — 32.10 → 32.11
- `DEPLOY.md` — V32.11 section, audit findings, PRODUCTION PROCEDURE
  marked historical
- `FUTURE_product_catalog_migration.md` — status note updated to
  "fully complete"
- `CHANGELOG_V32.11.md` (this file, new)

## Verification performed
- [x] Enumerated every top-level key in both `EMBEDDED_CONFIG` and
      `CONFIG_FALLBACK` directly from source (not from memory) and
      confirmed the two are identical and every key is now accounted
      for (Supabase-backed, or a derived field, or explicitly flagged).
- [x] Traced the *actual* active `announcementForm`/`saveAnnouncement`
      implementation (the "V22 polish" override, not the earlier base
      definitions it replaces) before designing the `announcements`
      table, so the `image`/`showPrice` fields Admin actually uses
      weren't missed.
- [x] Confirmed `curated_reviews` needs no data seed (source array was
      empty) and that `website_reviews` (customer-submitted, separate
      feature) is untouched.
- [x] `app.js`/`admin.js` re-validated for syntax; `DEPLOY.md`
      code-fence balance checked.
- [ ] **Still needs verification against a real, live Supabase
      project** (no live access from this environment): run the
      migration, then confirm a settings/announcement/review change
      made in Admin is immediately visible from a second
      browser/device with no redeploy.
- [ ] Full regression pass (cart, checkout, PIN validation, orders,
      login, combo quantity, product media navigation) — unchanged by
      this patch (no cart/checkout/order/auth code was touched), but
      not independently re-run this round since nothing in those paths
      was modified.
