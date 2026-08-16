# Jayvi Foods — V32.8 Changelog

Targeted fixes/documentation only, on top of the stable V32.7
performance baseline. **Not touched:** Supabase product/catalog
architecture, the V32.7 image optimization mechanism itself, cart,
checkout, orders, PIN/serviceability, payment, admin order management,
phone-based login architecture, or any other existing stable
functionality.

---

## Clarifications requested after initial V32.8 review

**1. Categories / Meal tags — confirmed, not a missed migration.**
Yes: Categories and Meal tags are still local/`EMBEDDED_CONFIG`-based
and are **not** live immediately from Supabase. Only Products and
Combos were migrated to Supabase (V32.6) — Categories, Meal tags, plus
store settings, announcements, and reviews were an explicit, documented
scope boundary at the time (see `FUTURE_product_catalog_migration.md`),
not something V32.8 touched or was ever asked to touch. The reworded
warning banner is intentional and technically correct as-is.

**2. Forgot Password — confirmed still pending, not resolved by
Security tab.** The Security tab (My Jayvi → Security) only works for
a customer who is **already signed in** — it is not a substitute for a
customer who has forgotten their password and cannot log in at all.
Today, that customer's only path is: Forgot Password → confirms the
account exists → hands off to WhatsApp → Admin manually resets a
temporary password → customer logs in with it → customer then uses
Security to set their own permanent password. There is still no
automated "enter mobile number → receive/set a new password → log in"
self-service path — that remains a real gap, unchanged by V32.8, and
requires an OTP or email provider to build (see the Phase 1 note above
`checkForgotPasswordPhone()` in `app.js`). **The full Admin-reset →
login → Security → re-login sequence was traced through the code
logically** (Admin's `updateUserById` changes the same Auth user
regardless of which login identifier — phone-mapped email — is later
used to sign in; Security's `updateUser()` operates on that same
session) but **could not be executed against a live Supabase project
from this environment** — this still needs to be run once, for real,
before considering item 3 fully closed.

**3. Combo media path on the live database — fix provided, full
migration rerun NOT recommended.** New file:
`supabase_migration_v32_8_combo_media_path_fix.sql` — a single
idempotent `UPDATE` scoped to the combo's existing row, safe to run any
number of times. Re-running the full
`supabase_migration_product_catalog.sql` instead was specifically
avoided: that file's product_media section does a `delete ... where
product_id in (...)` / `delete ... where combo_id = 'duo'` before
re-inserting its hardcoded seed list — running it today would silently
discard any media rows an Admin has added by hand since V32.6 went
live. Run the small file instead; the verification query is included at
the bottom of it.


## 🔴 Must-fix items

**1. Combo quantity number invisible — root cause found and fixed.**
Not a missing element: the quantity `<b>{qty}</b>` was rendering
correctly in the DOM the whole time. The dark-themed combo section
sets `color:#f4ece0` (light cream) on all descendants; the quantity
pill's background is the same light color used on normal product
cards, where the default dark text is visible. Light-on-light made the
combo number invisible while the exact same markup worked fine for
products. Fixed with one explicit, theme-independent rule:
`.inlineQty b{color:var(--ink)}` (`style.css`). No JS logic changed —
`cartQtyForCombo()`/`changeComboQty()` were already correct.

**2. Categories / Meal tags messaging — reviewed, not blindly removed.**
Checked first: Categories and Meal tags are genuinely still
local/`EMBEDDED_CONFIG`-based — only Products/Combos were migrated to
Supabase in V32.6. The warning banner's *substance* is therefore still
accurate; removing it outright would risk an admin losing changes
without realizing a redeploy step was still required. What changed is
the *framing* — `localCatalogWarning()` in `admin.js` no longer reads
like leftover debt ("⚠️ Not live... until synced") and instead
explains plainly why Categories/Meal tags differ from Products/Combos
(which do show the green "live everywhere" note). If/when
Categories/Meal tags are migrated to Supabase in a future release,
this is the one function that needs to change to reflect that.

**3. Password reset — Edge Function confirmed correct; missing
customer-side piece added.** `admin-reset-password`'s own logic already
called `auth.admin.updateUserById()` correctly (a real Auth password
change, not a fake success). What was genuinely missing: a signed-in
customer had no way to set their *own* password afterward. Added:
- **My Jayvi → Security** (new tab, `app.js`) — customer sets their own
  new password via Supabase's self-service `sb.auth.updateUser()`, a
  separate, unprivileged code path from Admin's reset.
- `admin.js`'s reset-failure messages now name the specific cause
  (404 "no profile found," 403 "not admin," 401 "session expired")
  instead of one generic failure string.
- Confirmed unchanged: phone-login architecture, Admin's email login,
  customer registration, and the WhatsApp-handoff "Forgot password"
  flow (that flow was checked and is unchanged by design — see
  DEPLOY.md for why it's not a self-service OTP flow yet).
- **Could not be verified end-to-end from source code alone** — this
  needs your live Supabase project. See "Password reset — deployment &
  verification checklist" in `DEPLOY.md` for the exact sequence to run
  yourself (deploy check → admin reset → customer login → customer
  changes password → re-login).

**4. Bestseller overlay.** Replaced the wide "BESTSELLER" text pill
(`.badge` in `style.css`) with a small 22px icon-only circular badge
(a star icon, `aria-label="Bestseller"` for accessibility) — no longer
wide enough to sit over product name/packaging/price on the photo.

**5. Version display.** `VERSION.txt`, the footer's visible "Website
v32.6" text, and every `?v=` cache-busting query string in
`index.html`/`admin.html` (`style.css`, `app.js`, `admin.css`,
`admin.js`, `supabase-config.js`) bumped to **32.8** — this also forces
browsers to fetch the actual changed files in this release rather than
a cached copy.

## 🟡 Architecture / future-proofing

**6. Combo dedicated media folders.** `images/combos/traditional-duo.webp`
moved into its own `images/combos/traditional-duo/hero.webp` — combos
now follow the exact same one-folder-per-item convention as products.
`scripts/generate-product-image-variants.py` now walks both
`images/products/` and `images/combos/` (previously products only) and
was re-run — the combo's placeholder image now has `-400w`/`-800w`
siblings too. `RESPONSIVE_PRODUCT_IMG` in `app.js` widened from
products-only to `images/(products|combos)/...` so combo media gets
the same `srcset`/`sizes` treatment as product media — this closes a
gap where `comboMediaMarkup()` was already calling the responsive
helper but the regex never matched combo paths. No new Supabase table
was needed: `product_media.combo_id` already existed since V32.6 and
already supports unlimited media per combo, exactly like products.

**7. Documentation.** New step-by-step **"Adding New Product
Images/Media"** section in `DEPLOY.md` covering folder/file naming,
source-size limits, running the optimization script, what happens if
you skip it, multiple images, videos, and the exact `product_media`
SQL shape — for both products and combos.

## Git files changed
- `style.css` — `.inlineQty b` color fix; `.badge` restyled (icon,
  smaller)
- `app.js` — Bestseller badge markup; widened responsive-image regex
  to include combos; new Security tab + `submitPasswordChange()`
- `admin.js` — `localCatalogWarning()` reworded;
  `promptResetPassword()` error messages split out by cause
- `index.html`, `admin.html` — version bumped to 32.8 (cache-bust +
  visible footer text)
- `VERSION.txt` — 32.7 → 32.8
- `scripts/generate-product-image-variants.py` — now processes
  `images/combos/` as well as `images/products/`
- `images/combos/traditional-duo/hero.webp` (moved from flat
  `images/combos/traditional-duo.webp`) + generated `-400w`/`-800w`
- `supabase_migration_product_catalog.sql` — updated seed path to match
  the new combo folder location (affects fresh seeds only — see next
  item for already-live projects)
- `supabase_migration_v32_8_combo_media_path_fix.sql` (new) — small,
  idempotent live-DB fix for projects seeded before this release
- `DEPLOY.md` — new "Adding New Product Images/Media" section; new
  V32.8 password-reset verification section; pointer to the new SQL
  fix-up file
- `CHANGELOG_V32.8.md` (this file, new)

## Acceptance checklist
- [ ] Existing products (Peanut, Flaxseed, Pudi, Puffora) still load
      and display correctly.
- [ ] Combo card: Add to Cart → shows **- 1 +**, increase → **- 2 +**,
      decrease → **- 1 +**, decrease to zero → back to "Add to Cart."
      Test on mobile specifically.
- [ ] Categories and Meal tags pages no longer show the old "⚠️ Not
      live... synced to your repo" wording (new wording explains the
      Products/Combos vs. Categories/Meal-tags distinction instead).
- [ ] Run the full password-reset sequence in `DEPLOY.md` against your
      live Supabase project (cannot be verified from this side).
- [ ] Admin email login unaffected.
- [ ] Bestseller badge is a small icon, doesn't overlap product photo
      content.
- [ ] Footer shows "Website v32.8"; hard-refresh confirms new
      `app.js`/`admin.js`/`style.css` are actually being served (not a
      cached v32.6/32.7 copy).
- [ ] V32.7 image-loading performance unchanged (no product image
      regressed back to serving an unoptimized master).
- [ ] Add a new combo photo, confirm it needs
      `scripts/generate-product-image-variants.py` to get responsive
      variants, matching the new DEPLOY.md documentation.
- [ ] No regression to cart, checkout, PIN validation, or orders.

---

# V32.8 — Round 2: Final UI Fixes / Mobile Admin Cleanup

Targeted CSS/UI fixes only, on top of the V32.8 package above (already
reviewed and approved with 3 clarifications). **Not touched:** product
data architecture, Supabase product/media functionality, cart,
checkout/payment, orders, PIN validation, authentication, the image
optimization mechanism, or any other existing working functionality.
No JS logic changed anywhere in this round — every fix below is
CSS-only.

## 1. Product card / gallery image shift on mobile — root cause found, fixed

**It was not a container-resizing bug.** `.cardMediaFrame` (and
`.comboImage`, `.productGallery .galleryMain`) already used a fixed
`aspect-ratio` box, which reserves its space immediately regardless of
when the image loads or what its native dimensions are — card heights
were never actually changing.

**What was actually happening:** the images inside used
`object-fit:cover`, which fills the box completely by *cropping*
whatever doesn't fit. Real product photos have real variance —
checked directly:

| File | Aspect ratio |
|---|---|
| `peanut/hero.webp` | 0.96 (near-square) |
| `flaxseed/hero.webp` | 0.95 (near-square) |
| `puffora/hero.webp` | 1.11 |
| `pudi/hero.webp` | 1.25 |
| `pudi/front.webp` | 1.50 (landscape) |

In a fixed 1:1 square box, `pudi/front.webp` had roughly a third of its
height cropped off (top+bottom) to fill the square, while
`peanut/hero.webp` showed almost the entire photo. Different products
were effectively showing different *crops* of their own photography —
that inconsistency is what read as the image "shifting" while
scrolling through a grid, not an actual layout/size change.

**Fix:** switched `object-fit:cover` → `object-fit:contain` in
`style.css` for:
- `.cardMediaSlide img` / `.cardMediaSlide.cardVideo video` (product
  grid cards)
- `.comboMediaScroller img` (combo cards)
- `.productGallery .galleryMain img` and `.galleryThumbs img` (product
  detail gallery)

The complete photo is now always visible, letterboxed on whichever
axis is shorter against the existing `var(--surface-2)` background,
never cropped. Container sizing (`aspect-ratio:1/1` / `16/10`) is
unchanged — cards were already a fixed height; now the photo inside
them is also fully, consistently visible.

Not changed (out of scope, smaller/less prominent, not reported):
`.miniImg` (meal-recommendation tiles), `.cartItem img`, admin's
`.thumb img` (already `contain` since it was written).

## 2. Homepage announcement cards overflowing on mobile (Admin) — root cause found, fixed

**Root cause:** `.announcementAdmin article` shared one CSS rule with
`.productAdminCard` / `.customerCard` / `.reviewAdmin article` —
`display:flex;gap:16px` (a row layout). That rule makes sense for the
other three because their markup wraps content into two clear columns
(a fixed-width thumb + an info block, or a text block + an actions
block). The announcement card's actual markup
(`homepagePage()` in `admin.js`) has **no such wrapper** — it's five
loose children directly in the row (`typeTag`, `h3`, `p`, `small`,
`cardActions`), none constrained in width, which the row-flex laid out
side by side with nothing to stop them overflowing a narrow viewport.

**Fix (admin.css only):** `.announcementAdmin article` now stacks its
children vertically (`flex-direction:column`) instead of sharing the
row layout — there's no thumb here to justify a row in the first
place, so this is correct at every width, not just mobile. Text now
wraps naturally inside the full card width; the actions row gets its
own top margin instead of fighting for horizontal space.

**Desktop note:** this does change how announcement cards look on
desktop too (stacked instead of the previous cramped row) — worth
saying plainly since it's a genuine visual change, but it's the
correct fix for a card style that never had a thumb to justify the row
layout it was inheriting.

## 3. Categories / Meal tags warning — re-verified again, confirmed still accurate, not removed

Re-checked the actual architecture directly against the source, one
more time, specifically to answer this request:
- No `categories` or `meal_tags` table exists in any `.sql` file in
  this project.
- `saveCategory()` / `saveMealTag()` in `admin.js` write straight to
  `data.categories` / `data.mealTags` in memory, then call `persist()`,
  which does exactly one thing: `localStorage.setItem(...)`.
- `app.js` (the storefront) never queries Supabase for categories or
  meal tags anywhere — it reads them from `EMBEDDED_CONFIG`/whatever
  `loadConfig()` resolved from `localStorage`.

This is unchanged from the last two review rounds and remains
factually accurate: Categories and Meal tags are still local-only. Per
your own instruction ("do not simply hide the warning if these
sections genuinely still require Git/JSON deployment"), **the warning
was not removed.** No code or wording change in this round beyond what
was already reworded in the previous round — an actual migration of
these two sections to Supabase remains a separate, not-yet-requested
piece of work.

## Git files changed (Round 2)
- `style.css` — `.cardMediaFrame` comment explaining the diagnosis;
  `object-fit:cover`→`contain` on 4 selectors (card slides, combo
  slides, gallery main, gallery thumbs)
- `admin.css` — `.announcementAdmin article` given its own
  `flex-direction:column` rule instead of sharing the thumb-oriented
  row layout
- `CHANGELOG_V32.8.md` — this section appended

## Verification performed
- [x] Confirmed real aspect-ratio variance across existing product
      photos (table above) that would produce inconsistent cropping
      under `cover` — this is what the fix addresses.
- [x] Confirmed `.cardMediaFrame`/`.comboImage`/`.productGallery
      .galleryMain` already reserve space via `aspect-ratio` — no
      change was needed there; container-level shift was not the
      actual bug.
- [x] Confirmed the announcement card's actual DOM structure (5 loose
      children, no wrapper) against the shared CSS rule, and confirmed
      `.reviewAdmin article` avoids the same problem only because its
      markup *does* wrap content in a div — this is why the fix is
      scoped to `.announcementAdmin article` alone, not the shared rule.
- [x] Re-verified, directly against source (no `categories`/`meal_tags`
      table anywhere, `persist()` is `localStorage.setItem` only, and
      `app.js` never fetches either from Supabase) that the Categories/
      Meal tags warning remains accurate.
- [x] `app.js`/`admin.js` re-validated for syntax (unchanged this
      round); `style.css`/`admin.css` brace-balance checked.
- [ ] **Still needs a real device/browser check on your side** (this
      environment has no browser to render and screenshot against):
      product cards for all 4 products + combo + gallery on an actual
      mobile viewport, and the announcement cards page on both mobile
      and desktop widths, to confirm the visual result matches this
      description.

