# Jayvi Foods V32.5 — Production procedure for adding a product

**Documentation only — no architecture change.** One small wording
update in `admin.js`'s existing banner to point at the new procedure;
everything else is `DEPLOY.md`.

## Your understanding — confirmed 100% correct

Clicking Save in Admin is not enough. Publishing a catalogue change
today requires manually copying the change into `app.js`'s
`EMBEDDED_CONFIG` and redeploying. There was previously no written
procedure for this — there is now, as a new section at the very top of
`DEPLOY.md` ("⚠️ PRODUCTION PROCEDURE — Adding a product after
launch").

## What's new in `DEPLOY.md`

- The exact 5-step procedure (Admin save → read localStorage via
  DevTools → hand-merge into `EMBEDDED_CONFIG` → commit/push/redeploy
  with a cache-bust version bump → **clear the Admin browser's own
  saved catalogue data**).
- Direct answers to all six of your questions, in place.
- **One important finding surfaced while tracing this precisely**, not
  previously documented anywhere: any browser that has ever saved
  anything from `/admin.html` — including the Admin's own everyday
  browser — will keep using **its own locally-saved product/category/
  combo/meal-tag list** instead of whatever gets freshly deployed,
  because of exactly how `loadConfig()` merges local data with
  `EMBEDDED_CONFIG` (`u.products||d.products`, same pattern for
  categories/combos/announcements/meal tags/reviews). This means the
  person who just published a change is the one most likely to see a
  storefront that doesn't match what they shipped, unless they clear
  that browser's saved catalogue data after every deploy. This is now
  step 5 of the documented procedure and is flagged as not optional.
- A clearly-marked, **not implemented**, optional suggestion: a
  one-click "Copy full catalogue JSON" button in Admin to replace the
  manual DevTools console step, reducing copy-paste risk. Flagged only
  as something to consider — nothing built, since this round is
  documentation only.

## What changed in `admin.js`

One line: the existing catalogue-page warning banner (added in the
previous pass) now points at the new procedure section in `DEPLOY.md`
and explicitly mentions the "clear this browser's data after
publishing" step, instead of just saying "sync it to your repo."
Purely a wording change to text already added last round — no new
banners, no new pages, no behavior change.

## What did NOT change

- No export/import tool was added.
- No change to `persist()`, `loadConfig()`, `sync()`, or any storage
  behavior.
- No Supabase schema, table, or RPC added.
- No files touched other than `DEPLOY.md` and one string in `admin.js`.
