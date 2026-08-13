# Jayvi Foods V32.5 — Production procedure corrected for safety

**Documentation + one small wording change in `admin.js` — no
architecture change, no new sync mechanism.**

## Your concern was valid — the previous procedure was not fully safe

You were right to question it. The previous draft said to hand-merge
just the new product into `EMBEDDED_CONFIG.products`, then clear the
entire `jayviStoreV14` key. That combination genuinely could lose
data: `jayviStoreV14` holds store settings, categories, combos, meal
tags, and announcements alongside products, all under one key — and
none of those would have been touched by a "just add the new product"
merge.

## What actually makes clearing safe (this is the fix)

Not a smaller/partial clear — a **more complete copy, done wholesale**:

1. Copy the *entire* `jayviStoreV14` JSON (one DevTools command:
   `copy(localStorage.getItem('jayviStoreV14'))`).
2. Paste-replace the *entire* `EMBEDDED_CONFIG` object in `app.js` with
   it, **and** the *entire* `CONFIG_FALLBACK` object in `admin.js` with
   the same JSON — not a field-by-field merge into either.
3. Deploy.
4. **Now** clearing `jayviStoreV14` is safe, because both files already
   contain, byte-for-byte, everything that's about to be cleared.

## The second fallback you didn't know was there

While verifying this, I found that `admin.js` has its own independent
hardcoded default catalogue — `CONFIG_FALLBACK` — completely separate
from `app.js`'s `EMBEDDED_CONFIG`. `loadData()` in `admin.js` silently
reverts to it whenever that browser's `localStorage` is empty. If only
`app.js` gets updated (which the earlier procedure implied), clearing
`jayviStoreV14` afterward would make Admin's own panel revert to old,
stale demo data next time it's opened — not the real catalogue, and
not what customers see either. The corrected procedure updates both
files with the same content in the same deploy specifically to close
this.

## Files changed in this pass

- **`DEPLOY.md`** — the entire "PRODUCTION PROCEDURE" section at the
  top rewritten: answers your safety question directly, explains why
  the earlier version was risky, gives the corrected wholesale-copy
  procedure (now 6 steps, updating both `EMBEDDED_CONFIG` and
  `CONFIG_FALLBACK`), and restates your intended long-term workflow
  diagram with the correction folded in.
- **`admin.js`** — one string changed: the existing catalogue-page
  warning banner now says "clear only *after* the wholesale copy is
  deployed" and mentions both files, instead of the earlier, less
  precise wording.
- **`FUTURE_product_catalog_migration.md`** — added a short note
  recording the `CONFIG_FALLBACK` duplication as another reason the
  future Product Master is worth doing (one source of truth instead of
  two hardcoded fallbacks plus per-browser localStorage).

## What did NOT change

- No sync mechanism between browsers was added — still a manual copy,
  just a safer, wholesale one instead of a partial hand-merge.
- No new Admin feature, button, or Supabase table.
- `persist()`, `loadConfig()`, `sync()`, `loadData()`, `mergeDefaults()`
  — none of these functions were touched. The fix is entirely in the
  documented procedure, not in the code's storage behavior.

## Confirmation for your sign-off

With the corrected procedure, your preferred outcome is achieved:

```
Add product → Save → wholesale copy → update both EMBEDDED_CONFIG
and CONFIG_FALLBACK → Git deploy → clear jayviStoreV14 → Admin
browser refreshes → sees the same live catalogue as customers,
with no unrelated configuration lost.
```

This matches your requested workflow exactly, with the two corrections
(wholesale copy instead of partial merge, and updating `CONFIG_FALLBACK`
alongside `EMBEDDED_CONFIG`) needed to make the final "clear
localStorage" step actually safe rather than merely convenient.
