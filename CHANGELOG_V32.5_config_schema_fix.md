# Jayvi Foods V32.5 — Config schema parity fix

## Your finding was correct, and there was one more you didn't catch

I ran a full programmatic diff of `EMBEDDED_CONFIG` (`app.js`) against
`CONFIG_FALLBACK` (`admin.js`) — every key, top-level and nested. Your
three fields were confirmed exactly as reported, plus one more:

**Only in `EMBEDDED_CONFIG.store` (missing from `CONFIG_FALLBACK`):**
- `deliveryMode` — **this one is genuinely dangerous.**
  `verifyPincode()` in `app.js` blocks **all** delivery storefront-wide
  unless this is exactly `'india'`. It had zero Admin UI, so Admin
  couldn't see it, and it would have been silently dropped by a
  wholesale "Copy Full Catalogue JSON" replace — the very next product
  edit could have broken checkout for every customer.
- `paymentMode` — unused by any runtime logic anywhere. Dead field.
- `otpProvider` — already had a working Admin field
  (`setOtpProvider`/`saveAuth()`), just missing from this literal's
  own defaults.

**Only in `CONFIG_FALLBACK` (not in `EMBEDDED_CONFIG`):**
- `mealLabels` — a static field that's actually redundant: both
  `app.js` and `admin.js` already recompute it fresh from `mealTags`
  every time. On inspection, this one was never actually a copy-safety
  risk (`app.js` unconditionally overwrites it regardless of what's
  pasted into `EMBEDDED_CONFIG`), but it's a real structural
  difference worth cleaning up per your ask that it stay derived-only.

**Verified (your ask #5): no other fields differ.** Checked every
top-level key, `store`, `homepage`, and the shape of a representative
product/category/combo/announcement/meal-tag — everything else
matches exactly.

## What I fixed

1. **Added `deliveryMode`, `paymentMode`, `otpProvider` to
   `CONFIG_FALLBACK.store`** with the same default values `app.js`
   already used — zero behavior change, just closes the gap.
2. **Added a real Admin control for `deliveryMode`** — Settings →
   Store Operations → new "Delivery enabled" toggle. This is the one
   field that actually needed more than just schema parity: it's
   load-bearing and previously invisible to Admin entirely.
   `paymentMode` was **not** wired to any new behavior (it's unused —
   adding functionality to a dead field would be an unnecessary
   change to a working flow, which you asked me to avoid).
3. **Removed the static `mealLabels` field from `CONFIG_FALLBACK`**,
   and changed `loadData()` to always route through `mergeDefaults()`
   (even on a completely fresh browser with no `localStorage` at all)
   so `mealLabels` is guaranteed to always be freshly derived from
   `mealTags`, exactly matching how `app.js` already behaves.
4. **Added `verify_config_schema.js`** — a standalone Node script that
   extracts both literals directly from the current source (no manual
   copy-paste, so it can't itself go stale) and fails loudly if they
   ever drift apart again. This is your ask #6: a programmatic
   guarantee, not a one-time manual check. I tested it both ways —
   confirmed it passes now, and confirmed it correctly catches an
   injected mismatch when I deliberately broke parity temporarily to
   verify the script actually works (then restored the file before
   this was final).
5. **`DEPLOY.md` updated**: the production procedure now has a
   mandatory step 0 (run the verify script *before* copying) and a new
   step 3a (run it *again* right after pasting, to catch a bad paste
   before it reaches production) — full detail in the new "A schema
   mismatch was actually found and fixed" section, which also corrects
   an inaccurate claim from the previous draft ("no risk of forgetting
   a field" — that wasn't true until this fix).

## Why this is safe and targeted

- **No behavior change** to any currently-working flow. `deliveryMode`
  defaults to `'india'` (delivery on) everywhere it already was;
  `paymentMode`/`otpProvider` were either unused or already
  functionally present — this only makes their *schema* consistent.
- **No changes to order/auth/payment logic** — only `admin.js`'s
  config literal, one new settings toggle, and `loadData()`'s fallback
  routing.
- **The verification script is read-only** — it never modifies either
  file, it only reports.

## Files changed

- `admin.js` — `CONFIG_FALLBACK.store` gained 3 fields; removed static
  `mealLabels`; `loadData()` always routes through `mergeDefaults()`;
  new "Delivery enabled" toggle in Settings → Store Operations;
  `saveStoreOperations()` persists it.
- `verify_config_schema.js` — new file.
- `DEPLOY.md` — production procedure section updated with steps 0 and
  3a, and the new "schema mismatch found and fixed" explanation.

## Confirmation for your sign-off

With this fix, `node verify_config_schema.js` passes (verified,
output included below), and the workflow you asked to be genuinely
safe now is:

```
Admin adds/edits product → Save → verify script passes →
Copy Full Catalogue JSON → paste into BOTH files → verify script
passes again → Git deploy → clear jayviStoreV14 → customer sees
the change — with no possibility of silently dropping payment,
delivery, or auth configuration, because the two files are now
provably identical in structure and a script checks this
automatically before every deploy.
```

```
$ node verify_config_schema.js
✅ EMBEDDED_CONFIG and CONFIG_FALLBACK are structurally identical. Safe to proceed with the production procedure in DEPLOY.md.
```
