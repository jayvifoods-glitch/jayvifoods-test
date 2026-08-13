# Jayvi Foods V32.5 — "Copy Full Catalogue JSON" button added

## What changed

Added a **"📋 Copy Full Catalogue JSON"** button in `admin.js`, placed
inside the existing warning banner on every catalogue page: Products,
Variants & sizes, Combos, Categories, Meal tags. One click copies the
complete current `jayviStoreV14` data (products, categories, combos,
meal tags, announcements, and store settings — the whole thing, not
just one section) to the clipboard, pretty-printed for readability.

This replaces the manual DevTools console step
(`copy(localStorage.getItem('jayviStoreV14'))`) from the production
procedure with one click, exactly as flagged as an option in the
previous round.

## What this does NOT change

- **Same procedure, same risk profile, same safety guarantees** — this
  is purely a convenience layer over the exact same manual copy step.
  It does not add any sync mechanism, does not change where data is
  stored, and does not remove any of the other steps in `DEPLOY.md`'s
  production procedure (still requires pasting into both
  `EMBEDDED_CONFIG` and `CONFIG_FALLBACK`, still requires a Git deploy,
  still requires clearing `jayviStoreV14` afterward).
- No Supabase table, RPC, or schema added.
- `persist()`, `loadConfig()`, `sync()` — untouched.

## Implementation notes

- Extracted a shared `copyTextToClipboard()` helper from the existing
  Copy Message button (Priority 4, item 10) so both features use
  identical copy-with-fallback logic — no duplicated clipboard code.
- If clipboard access is ever blocked by the browser, the button falls
  back to showing the JSON in a read-only textarea so it can still be
  copied by hand, same fallback pattern as Copy Message.
- Copies the live in-memory `data` object (`JSON.stringify(data, null,
  2)`), which is always identical to what's in `localStorage` after
  any `persist()` call — no extra read/parse round-trip needed.

## Files changed

- `admin.js` — new `copyTextToClipboard()` helper, new
  `copyFullCatalogueJSON()` function, new button in
  `localCatalogWarning()` (so it appears on all 5 catalogue pages
  automatically, no per-page changes needed).
- `DEPLOY.md` — step 2 of the production procedure now describes the
  button as the primary method (DevTools kept as an explicit fallback
  note), the workflow diagram updated to reference it, the earlier
  "not implemented, needs your sign-off" section replaced with a short
  "implemented" note, and one new item added to the Admin verification
  checklist.

## Verification

- [ ] On each of Products / Variants / Combos / Categories / Meal tags
      → the banner shows the button.
- [ ] Clicking it copies valid JSON containing all current
      products/categories/combos/meal tags/announcements/store
      settings — not just whichever page you clicked it from.
- [ ] Pasting the result into a text editor is valid, readable JSON
      matching `localStorage.getItem('jayviStoreV14')` in DevTools.
