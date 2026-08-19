# Jayvi Foods — CHANGELOG V32.13

Bug-fix release on top of the current, live-tested **V32.3** code.
Nothing from V32.12.1/V32.3 has been reverted or rewritten — every
change below is a targeted fix for an issue reported after V32.3's
live test cycle. No schema changes were required (see §6).

---

## 1. Root cause found: Announcement admin + Gallery were both broken by the same JavaScript scoping bug

**This is the actual fix behind items 4 and 5 below — read this first.**

V32.3's announcement-form rewrite and the new Gallery admin page were
both added inside an existing `(function(){ 'use strict'; ... })();`
block near the bottom of `admin.js` (a pre-existing wrapper, originally
just for "V22 Admin polish" cosmetics). Plain `function foo(){}`
declarations inside that block are **local to that closure** — they
are invisible to:
- inline HTML event-handler attributes (`onclick="…"`, `onchange="…"`),
  which are always evaluated against the **global** scope, not the
  closure they happen to be textually written inside, and
- any code living **outside** that closure, such as `render()`'s tab
  dispatcher further up the file.

Two explicit `window.announcementForm = …` / `window.saveAnnouncement =
…` exports were already in place (which is why opening the form and
clicking Save both worked), but every other function the new UI
depended on was not exported, so it silently failed the moment it was
actually used:

- **`renderAnnouncementTypeFields()`** and **`updateCtaTargetVisibility()`**
  — wired to `onchange` on the General/Product radios, the
  Product/Combo sub-choice, and the CTA-type select. Undefined in
  global scope → clicking any of them did **nothing** (a
  `ReferenceError` thrown from an inline handler just aborts silently;
  it doesn't crash the page). This is exactly "there is no proper
  option to select the announcement target type" — the option was
  there, but selecting it had no visible effect.
- **`uploadAnnouncementFile()`** and **`removeAnnouncementMedia()`** —
  wired to the Add Photo/Add Video/Replace file inputs and the Remove
  button. Undefined in global scope → selecting a file never even
  reached the `sb.storage.from('announcement-media').upload(...)`
  call, so nothing was ever uploaded, and the UI kept showing
  "no media" no matter what was picked. This is exactly "after
  selecting/uploading media, the UI still indicates no media" and
  "uploaded media is not appearing."
- **`galleryPage()`** — called from `render()`'s tab dispatcher
  (`if(tab==='gallery')h=await galleryPage();`), which lives outside
  the closure entirely. `render()` sets `app.innerHTML` to a
  `Loading…` placeholder *before* calling `galleryPage()` — since the
  call threw immediately, `render()` never reached the line that
  replaces that placeholder with real content, so the Gallery tab
  showed "Loading…" **forever**, regardless of whether there were 0 or
  100 rows in `gallery_media`. This is exactly the reported symptom.
- **`uploadGalleryFiles()`, `updateGalleryCaption()`,
  `toggleGalleryActive()`, `moveGalleryItem()`, `deleteGalleryItem()`**
  — every button/control on the Gallery admin page, all wired via
  inline attributes, all equally unreachable — so even once the
  Loading-state bug above is fixed on its own, none of these would
  have worked either.

**Fix:** every one of the functions above is now explicitly re-exported
onto `window` at the top of that closure (function declarations are
hoisted, so this works regardless of where each one is textually
defined further down). Nothing about *how* any of these functions
behaves has changed — only their reachability from inline HTML
attributes and from `render()`. Verified with a static scan of the
whole file (every `onclick=`/`onchange=`/`oninput=` target now resolves
to something in global scope; every bare-identifier call inside
`render()`'s dispatcher does too — see "Offline verification" below).

This single fix is what makes items 4 and 5 below actually work — no
UI redesign, no schema change, no new files were needed for either.

---

## 2. Admin Orders — Search removed (spec §2)

The free-text Search box re-ran `render()` (a full page rebuild) on
every keystroke, which itself re-fetched orders from Supabase each
time — visibly slow and disruptive to type into, exactly as reported.

**Fixed, exactly as instructed — removed, not redesigned or debounced:**
- The `<input type="search">` box and its `oninput` handler are gone
  from `ordersPage()`.
- `ordersUi.q` and all filtering logic that referenced it are removed
  from `applyOrdersUi()`.
- The focus-restore workaround this search box needed (`_searchFocused`
  in `render()`) is removed along with it — it existed only to serve
  the search box.
- **Sort is untouched and still has all the same options**: Newest
  first / Oldest first / Highest order value / Lowest order value /
  Status. Status filter, Payment-status filter, and the From/To date
  range filters are also untouched — they only ever fired on a
  dropdown/date-picker change (not per character), which is not what
  was reported as broken, and the brief only asked to remove Search.
- The now-unused `.ordersToolbar input[type="search"]` CSS rule was
  removed from `admin.css` (dead code cleanup, no visible effect).

## 3. Password Reset — deferred, not touched (spec §3)

No changes made in this release, as instructed. The Edge Function
(`supabase_functions/admin-reset-password/index.ts`) is left exactly
as it was after V32.12.1's fix attempt (see `CHANGELOG_V32.12.1.md`
§1) — that attempt addressed a `.single()`/silent-error bug but the
live issue evidently persists under some other condition.

**Known/deferred issue for the next work item:** customer password
reset still fails to recognize the authenticated Admin caller
correctly in production. This needs to be investigated fresh against
live logs/session state next round — not attempted here, per
instruction, to keep V32.13 focused and low-risk.

## 4. Announcement Admin — now usable (spec §4)

With the scoping bug in §1 fixed, the existing V32.3 announcement form
now behaves as designed:
- **General / Product / Combo targeting** — the General/Product radio
  and its Product-vs-Combo sub-choice (shown only when "Product
  announcement" is selected) now actually respond to clicks and
  re-render the product/combo picker correctly. Combo targeting is
  supported via that sub-choice — this was already in the V32.3
  schema/design (`target_type` = `'product'` | `'combo'`), it just
  couldn't be reached before.
- **Media upload** now actually uploads to Supabase Storage (the
  existing `announcement-media` bucket — no new storage mechanism),
  and the visible preview/Replace/Remove UI (matching the
  Add Photo/Add Video → preview → Replace/Remove language used for
  Product/Combo media) now updates correctly after each action. Still
  exactly one media item per announcement (image *or* video, never
  both, never multiple) — enforced structurally, unchanged from V32.3.
- **Save → reopen → reload** now round-trips correctly end to end,
  since the upload that used to silently fail now actually completes
  and persists a real Storage URL onto the row.
- **Storefront read-back** (`app.js`'s `heroShow()`) was never part of
  this bug — it already read `announcementType`/`targetType`/`image`/
  `mediaType` correctly in V32.3; it simply never had real data to read
  because Admin could never successfully save any of it. No change was
  needed there.
- Delete (with confirm + safe Storage cleanup) was also never affected
  by this bug — `deleteAnnouncement()` lives at top-level scope, not
  inside the broken closure — but is called out here since it's part
  of the same acceptance flow.

## 5. Gallery — now loads correctly (spec §5)

With the scoping bug in §1 fixed:
- The Gallery tab no longer gets stuck on "Loading…" — `galleryPage()`
  is reachable from `render()` again, so it actually runs, fetches
  `gallery_media`, and renders.
- **Zero records** → renders the "No gallery items yet — add photos or
  a video above" empty state, with the **`+ Add Photos`** / **`+ Add
  Video`** buttons always visible above the (now-empty) grid — i.e.
  never an infinite Loading state, and always an Add Media action
  present, exactly as required.
- **Existing records** → render as a responsive grid of
  thumbnails/previews with caption, Active toggle, ↑/↓ reorder, and
  Delete — all of which now actually respond to clicks, since their
  `onclick`/`onchange` handlers are reachable again.
- **Storage URLs render correctly** — `<img src="…">`/`<video src="…">`
  bind directly to `gallery_media.media_url` (mapped to `g.url`), which
  was never itself wrong; it just never got a chance to render because
  the page never got past "Loading…."
- No schema change — this is the same `gallery_media` table and
  `gallery-media` Storage bucket introduced in
  `supabase_migration_v32_3.sql`. See §6.

## 6. Database — no migration in this release (spec §6)

Every issue above was a frontend/admin wiring problem (a JavaScript
scoping mistake and an unwanted `oninput` handler), **not** a schema
problem. `supabase_migration_v32_3.sql` (already deployed and tested in
your test environment, per your note) is unchanged and does not need to
be re-run or altered. **No new `.sql` file is included in this
release** — there was nothing that genuinely required one.

## 7. Version — V32.13 (spec §1)

Updated consistently, display behavior unchanged:
- `VERSION.txt` → `32.13`.
- The two customer-facing "Website vX.X" footer strings (`index.html`,
  `help.html`) → `Website v32.13`. Where and whether each page shows
  this text is exactly as before — only the version number changed.
- Cache-busting query strings (`?v=32.3` → `?v=32.13`) on the
  stylesheets/scripts in `index.html`, `admin.html`, `legal.html`, and
  `help.html`, so browsers/CDNs actually pick up this release's fixes
  instead of serving a cached V32.3 file.
- `config-lite.js`'s own header comment (`config-lite.js (V32.12.1)` →
  `(V32.13)`) — this is a live shipped file describing itself, not a
  historical migration/changelog entry, so it was updated along with
  everything else per item 1's instruction to "update the
  release/version references consistently." Historical `V32.x` comments
  scattered through `app.js`/`admin.js` describing *when* a past fix
  was introduced (e.g. "V32.12.1 fix: …") were deliberately left alone
  — those are historical record, not current-version display, per the
  standing "don't alter historical comments" instruction.

---

## Files changed

- `admin.js` — the scoping fix (§1: functions re-exported to `window`);
  Orders search removed (§2, `ordersUi`/`applyOrdersUi`/
  `setOrdersFilter`/`ordersPage`/`render`).
- `admin.css` — removed the now-unused `.ordersToolbar
  input[type="search"]` rule.
- `admin.html`, `index.html`, `legal.html`, `help.html` — cache-busting
  bumped to `?v=32.13`; `index.html`/`help.html` footer version text
  bumped to `v32.13`.
- `config-lite.js` — header comment version bumped.
- `VERSION.txt` — `32.13`.
- `CHANGELOG_V32.13.md`, `DEPLOY.md` — this release.

**Not changed:** `app.js` (no bug was found in the storefront —
`heroShow()`/`renderBrandGallery()` already read the right columns; see
§4-5), `supabase_migration_v32_3.sql` or any other `.sql` file (see
§6), checkout/coupons/cart/orders/auth/catalogue/payment logic,
password reset (§3, deferred by request).

---

## Offline verification performed

Cannot access your live Supabase project, website, or GitHub repo —
nothing below claims live testing; see "Requires live Supabase
testing" for what still needs your test cycle.

- `node --check admin.js` — passes.
- `node --check app.js` — passes.
- `node --check config-lite.js` — passes.
- **Static scan of every inline `onclick=`/`onchange=`/`oninput=`
  target in `admin.js`** against everything reachable from global
  scope (top-level declarations + explicit `window.x = …` exports):
  zero unresolved calls remain (this is exactly the class of bug in
  §1, re-run after the fix to confirm nothing else was missed).
- **Static scan of `render()`'s tab dispatcher** (`if(tab==='…')h=await
  …Page();`) against the same reachability set: `galleryPage` (and
  every other `…Page()` function it calls) now resolves; none are
  left dangling.
- Confirmed `ordersUi.q` / `_searchFocused` / the search `<input>` no
  longer appear anywhere in `admin.js` after removal.
- HTML tag-balance check (`div`/`section`/`article` open vs. close
  counts) on `index.html`, `admin.html`, `legal.html`, `help.html` —
  all balanced, no page was accidentally left malformed by the version
  string edits.
- Traced the Announcement save→reload flow and the Gallery
  empty/populated load paths by hand against the fixed code, function
  by function, against the acceptance criteria in the brief.

## Requires live Supabase testing (cannot be verified offline)

- The full Announcement acceptance test from the brief: General +
  image, Product + image/video, Combo + image/video, Replace, Remove,
  Delete, reopen-and-confirm-persistence, and storefront click-through
  to the correct product — against your real `announcement-media`
  bucket and real product/combo data.
- The full Gallery acceptance test: add multiple images, add a video,
  mixed image/video ordering, reorder, Active/inactive toggle, delete,
  and the resulting storefront slideshow — against your real
  `gallery-media` bucket and `gallery_media` rows.
- Orders: confirm Sort (all five options) and the Status/Payment/date
  filters behave as expected against your real order volume now that
  Search is gone.
- Confirming the two "Website v32.13" footer strings actually render
  correctly on your deployed `index.html`/`help.html`.
