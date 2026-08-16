# Jayvi Foods — V32.10 Changelog

Focused architecture migration: Categories and Meal tags move from
per-browser `localStorage`/`EMBEDDED_CONFIG` to Supabase, mirroring how
Products and Combos were migrated in V32.6. This completes the target
architecture: **Git** for website code, hosting, and media assets;
**Supabase** for all customer/business data. **Not touched:** Products,
Combos, product media/image-optimization architecture, cart, checkout,
orders, PIN validation, authentication, or any other stable
functionality.

## What changed

**New Supabase tables** (`supabase_migration_categories_meal_tags.sql`):
`categories` and `meal_tags`, structured identically to the
products/combos pattern already in place — public reads
active/enabled rows, only Admin (`public.is_admin()`) can write. Seeded
from the exact data previously hardcoded in `EMBEDDED_CONFIG`/
`CONFIG_FALLBACK` (verified identical between the two files before
writing the seed): 4 categories, 10 meal tags. Uses `on conflict (id)
do update`, so it's safe to run once on a fresh project; the file's own
header comment spells out exactly what re-running it later would and
wouldn't affect (short version: never touches products/combos, and
only resets a category/meal-tag row back to its seed value if it still
has one of the 14 specific ids seeded here).

**Admin (`admin.js`):**
- Categories and Meal tags pages now fetch from and write directly to
  Supabase (`fetchCategories()`/`saveCategoryToSupabase()`,
  `fetchMealTags()`/`saveMealTagToSupabase()`/
  `deleteMealTagFromSupabase()`) — same upsert/delete pattern already
  used for products/combos.
- Both pages now show the green "Live for every customer, on every
  device" note instead of the old "Local configuration" warning. The
  warning's rendering function (`localCatalogWarning()`) has been
  removed from the codebase entirely — there was nothing left for it
  to accurately describe.
- Matching an existing safeguard already used for product IDs: a
  category/meal tag's ID field is disabled while editing (only
  editable when creating new), preventing an accidental ID change from
  silently creating a duplicate row via upsert instead of updating the
  existing one.
- `productForm()`'s category and meal-tag checklists needed current
  data too, so `productsPage()` now also fetches categories and meal
  tags before rendering — same cross-reference pattern `combosPage()`
  already uses for products.
- `persist()`'s toast reworded to reflect its now-smaller scope: store
  settings, announcements, and reviews only.

**Storefront (`app.js`):**
- New `loadCategoriesAndMealTagsFromSupabase()`, called from `init()`
  alongside the existing product/combo fetch (via `Promise.all`, so
  neither waits unnecessarily on the other). Deliberately its own
  independent `try`/`catch` — a failure fetching categories/meal tags
  can't affect the products/combos fetch, and vice versa.
- Same "never render blank" principle already used for products/
  combos: if the fetch fails for any reason, `CONFIG.categories`/
  `CONFIG.mealTags` simply keep whatever `loadConfig()` already gave
  them from the embedded/local copy.
- `sync()` (which turns `CONFIG.categories`/`CONFIG.mealTags` into the
  `categories`/`mealTagList` arrays the rest of the storefront reads)
  was not changed — the Supabase rows are mapped into the exact same
  `{id, name, enabled, order}` shape it already expected.

**Documentation:**
- `DEPLOY.md`: new "V32.10 update" section (mirrors the existing V32.6
  one), the final Git-vs-Supabase architecture table, and corrections
  to now-stale mentions of categories/meal tags inside the
  PRODUCTION PROCEDURE section (which now applies only to store
  settings/announcements/reviews). Also fixed an unrelated, pre-existing
  formatting slip in that same file — a section heading that had gone
  missing in an earlier round — while in the area; the heading is
  restored with no content changes.
- `FUTURE_product_catalog_migration.md`: added a status note at the top
  confirming the migration described in that file is now fully
  complete as of this release; left the historical body of the file
  otherwise untouched.

## Git files changed
- `supabase_migration_categories_meal_tags.sql` (new)
- `admin.js` — Categories/Meal tags pages rewired to Supabase;
  `localCatalogWarning()` removed; `productsPage()` fetches
  categories/meal tags too; `persist()` toast reworded
- `app.js` — `loadCategoriesAndMealTagsFromSupabase()` added; wired
  into `init()`
- `index.html`, `admin.html` — version bumped to 32.10
- `VERSION.txt` — 32.9 → 32.10
- `DEPLOY.md` — new V32.10 section; stale procedure text corrected;
  missing section heading restored
- `FUTURE_product_catalog_migration.md` — status note added
- `CHANGELOG_V32.10.md` (this file, new)

## Verification performed
- [x] Confirmed `EMBEDDED_CONFIG`'s and `CONFIG_FALLBACK`'s categories
      arrays are byte-identical, and their `mealTags` arrays match
      (same 10 entries), before writing the seed — nothing invented.
- [x] Confirmed the seed migration's `on conflict (id) do update` only
      ever touches rows with one of its own 14 seeded ids, and does
      not delete or touch anything else — unlike
      `supabase_migration_product_catalog.sql`'s media section (which
      does a delete-and-reseed), this migration was written to be safe
      to re-run without the same caveat.
- [x] Traced every place `data.categories`/`data.mealTags` are read in
      `admin.js` (product form's category/meal-tag pickers,
      `catName()`) and confirmed the pages that need them now fetch
      fresh data before rendering.
- [x] `app.js`/`admin.js` re-validated for syntax; `style.css`/
      `admin.css` unaffected and unchanged this round; `DEPLOY.md`
      code-fence balance checked.
- [ ] **Still needs verification against a real, live Supabase
      project** (this environment has no live Supabase access): run
      the new migration, then confirm from two different
      browsers/devices that a category or meal tag added in one is
      immediately visible in the other without any redeploy.
- [ ] Full regression pass (cart, checkout, PIN validation, orders,
      login, combo quantity `-1+`, product media/gallery navigation) —
      unchanged by this patch (no product/combo/cart/checkout code was
      touched), but not independently re-run in this round since
      nothing in those paths was modified.
