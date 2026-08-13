# Jayvi Foods V32.5 — Catalogue architecture clarification

## Direct answer to your question

**Strictly local to the specific browser you used, until the future
Product Master migration.** When you click Save on a product in
Admin, that write goes only into that browser's own `localStorage`. It
is:
- **not** visible to any customer, on any device, ever — customers
  only ever see whatever catalogue is baked into the currently
  deployed `app.js` (`EMBEDDED_CONFIG`)
- **not** visible to you if you open Admin in a different browser, a
  different device, or an incognito/private window — even signed in
  as the same Admin account
- only reflected on the live storefront if someone manually copies the
  change into `app.js`'s `EMBEDDED_CONFIG` and redeploys

There is currently no code path that pushes a localStorage change
anywhere else. This was already true before V32.5 (it's the existing,
intentional "Git-managed catalogue" architecture); V32.5 didn't change
it, and per your instruction, still hasn't.

## What changed in this pass

**UI clarity only — no architecture change, per your explicit
instruction.**

1. **New persistent banner in Admin**, on the five pages that write to
   the local catalogue — **Products, Variants & sizes, Combos,
   Categories, Meal tags** — stating plainly that saving there is
   local to that browser and does not reach customers until manually
   synced into `app.js` and redeployed. This is a static banner at the
   top of the page (`admin.css`'s new `.catalogWarning` style), not a
   toast — it stays visible for as long as Admin is on that page,
   rather than fading after a few seconds like the existing save
   confirmation.
2. **`FUTURE_product_catalog_migration.md` updated** — now explicitly
   states the confirmed decision: the next dedicated catalogue release
   builds a real central Supabase Product Master, and **no temporary
   browser/localStorage sync workaround will be introduced** as an
   intermediate step. Also restates your confirmed future flow
   diagram (Admin → Supabase Product Master → storefront reads
   centrally → all customers/devices see the same catalogue) so it's
   recorded exactly as you described it.

## What did NOT change

- `persist()` still writes to `localStorage` exactly as before — same
  key, same behavior, same existing toast message.
- No sync mechanism, export/import tool, or polling was added between
  browsers or devices.
- No Supabase table, RPC, or schema was added for products/categories/
  combos/meal tags.
- No files outside `admin.js`, `admin.css`, and
  `FUTURE_product_catalog_migration.md` were touched.

## Files changed in this pass

- `admin.js` — added `localCatalogWarning()` helper; called it from
  `productsPage()`, `variantsPage()`, `combosPage()`,
  `categoriesPage()`, `mealTagsPage()`.
- `admin.css` — added `.catalogWarning` style (reuses existing
  `--danger`/`--danger-soft` tokens, no new color palette introduced).
- `FUTURE_product_catalog_migration.md` — strengthened wording per
  this review.

## Verification

- [ ] Open Admin → Products (and Variants, Combos, Categories, Meal
      tags) → confirm the warning banner appears at the top of each
      and is readable.
- [ ] Add a test product → confirm it does NOT appear on the live
      storefront in a different browser/device.
- [ ] Confirm existing catalogue editing (add/edit/delete
      product/variant/combo/category/meal tag) still works exactly as
      before — only the banner is new, nothing else on these pages
      changed.
