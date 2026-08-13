# Jayvi Foods V32.5 — Corrections pass

This is a **documentation and confirmation pass only** — nothing in
the previously-delivered V32.5 code (app.js, admin.js, the Edge
Function, the new SQL migration) changed. Per your review, I re-read
every relevant code path to confirm each point below rather than
re-writing anything, and I did not touch any unrelated file.

## What actually changed in this pass

1. **`DEPLOY.md` corrected** — removed the outdated line saying
   fail-open for unmatched PINs is "unchanged, per your explicit
   instruction to keep it for now." That was true for V32.3/V32.4, not
   V32.5. It now points to the corrected behavior.
2. **New `## V32.5` section added at the top of `DEPLOY.md`** —
   answers your review items 1–4 directly and in one place (PIN
   behavior, the one new SQL file, state-default resolution order +
   free-shipping confirmation, and the Edge Function deployment
   requirement), instead of leaving them scattered across older
   per-letter notes from the V32.3 round.
3. **New `FUTURE_product_catalog_migration.md`** — documents the
   product-catalogue-to-Supabase migration as a future requirement,
   exactly as you specified (diagram, minimum fields, why it's out of
   scope now). **Nothing implemented — the current localStorage-based
   catalogue architecture is completely unchanged**, per your explicit
   instruction not to touch it in V32.5.
4. **`DEPLOY.md` verification checklist extended** — added an explicit
   "nonexistent PIN" checkout test and a "≥₹599 still shows FREE even
   with a configured delivery charge" test, sitting next to the
   existing hamburger-menu-on-a-real-phone check that was already
   there from the V32.3 round.

## Confirmations (re-verified, no code change needed)

- **PIN behavior** matches your diagram exactly: not-in-master and
  found-but-not-serviceable both resolve to the same "Delivery is
  currently unavailable to this PIN code" message and both block
  checkout; only a genuine infra/lookup failure (not a bad PIN) still
  fails open — that's a separate, intentional branch, clearly commented
  in `verifyPincode()`.
- **SQL for this round**: confirmed, exactly one new file —
  `supabase_migration_state_delivery_defaults.sql`. It only adds 4
  nullable columns to `delivery_states` and updates `check_pincode()`;
  it does not touch, rewrite, or drop anything in `pincodes`. None of
  your other migrations (PIN master schema, 19,299 PIN seed files,
  notifications, account recovery, order state machine, reviews) need
  to be re-run.
- **State-default resolution order**: confirmed
  `PIN's own value → state default → null`, implemented as a single
  `coalesce()` per field in `check_pincode()`. Re-traced your Karnataka
  example (₹40 / 4–6 days) against the actual SQL — a PIN with no
  override resolves to the state default; a PIN with its own value
  (`560002`-style) keeps that value regardless of what the state
  default is. Adding/editing a state's defaults only writes to
  `delivery_states` — confirmed no `pincodes` row is touched by that
  operation anywhere in `admin.js`.
- **Free delivery ≥ ₹599 regardless of state/PIN charge**: confirmed —
  `effectiveShipping()` in `app.js` checks the free-shipping threshold
  *before* it ever looks at a configured PIN/state charge, so this
  holds everywhere, not just where no charge is configured.
- **Admin password reset Edge Function**: confirmed name is
  `admin-reset-password` (the existing one, not a new function).
  Deploy/redeploy command documented clearly in the new DEPLOY.md
  section. Confirmed `admin.js` cannot show "success" without a real
  success response from the function, and a genuine unreachable-function
  failure now says so explicitly instead of a bare `Failed to fetch`.
- **Hamburger menu structure**: re-checked `index.html` — `#mobileMenu`
  and `.menuScrim` are still siblings of `<header>`, not nested inside
  it (the actual fix for the original Safari `backdrop-filter` +
  `position:fixed` rendering bug, from the V32.3 round). No regression
  found in the markup. Please still verify visually on an actual phone
  — I have no way to render a live mobile browser session from here.
- **Combo add-to-cart / quantity control, new-product quantity control,
  Peanut media counter logic**: re-read all four functions
  (`addCombo`, `renderCombos`/`changeComboQty`, `openProduct`/
  `refreshOpenProductDetail`, `cardMediaMarkup`/`handleMediaError`) —
  all match what was delivered in the previous V32.5 package, no
  regressions introduced by this pass.
- **Customer login (mobile) / Admin login (email)**: confirmed
  `loginSubmit()`, `authView()`, and `phoneToAuthEmail()` in `app.js`
  were not touched by any V32.5 change, in this pass or the previous
  one.

## Still needs your action (unchanged from before, repeating so it's
not lost)

- Run `supabase_migration_state_delivery_defaults.sql`.
- Deploy/redeploy `admin-reset-password`.
- Confirm Peanut Chutney's product media fields in Admin match the
  other three products (code fix is in place; this is a data check
  only I cannot do from here).
- Visually verify the hamburger menu on an actual phone.

## Full deployment checklist

**1. SQL to run** (in order, skip any already applied):
```
supabase_migration_pincodes_schema.sql        -- already applied, skip
supabase_seed_pincodes_01_states.sql … _21.sql -- already applied, skip
supabase_migration_notifications.sql          -- already applied, skip
supabase_migration_account_recovery.sql       -- already applied, skip
supabase_migration_order_state_machine.sql    -- already applied, skip
supabase_migration_reviews_featured.sql       -- already applied, skip
supabase_migration_state_delivery_defaults.sql -- NEW — run this one
```

**2. Edge Functions to deploy:**
```
supabase functions deploy admin-reset-password
```
(`send-order-notification` deployment is a separate, already-documented
item unrelated to this round — see the K-section notes further down in
`DEPLOY.md` if/when you're ready to wire up email notifications.)

**3. Git / frontend deployment:**
- Push `app.js`, `admin.js`, `index.html`, `admin.html`,
  `supabase_functions/admin-reset-password/index.ts`,
  `supabase_migration_state_delivery_defaults.sql`, `DEPLOY.md`,
  `FUTURE_product_catalog_migration.md`, `CHANGELOG_V32.5.md`,
  `VERSION.txt`.
- No other files changed in this corrections pass.

**4. Cache/version considerations:**
- `index.html`/`admin.html` already reference `?v=32.5` for
  `app.js`/`admin.js`/`style.css`/`admin.css` — no further cache-bust
  needed for this corrections pass since no JS/CSS content changed,
  only docs and the SQL migration.
- If your hosting/CDN caches HTML itself, purge `index.html` once so
  visitors don't keep an old cached copy referencing pre-V32.5 assets.

**5. Live verification checklist** (superset of the V32.5 changelog's
checklist, plus this round's specific asks):
- [ ] `000000` and any other nonexistent PIN → "Delivery is currently
      unavailable to this PIN code," checkout blocked
- [ ] Serviceable PIN → correct charge/ETA, checkout proceeds
- [ ] Cart ≥ ₹599 on a PIN/state with a configured charge → FREE
      delivery still shown and charged
- [ ] Karnataka-style state default → PIN with no override inherits
      it; PIN with its own override keeps its own value
- [ ] Retry Payment reopens the same order, no duplicate
- [ ] Admin password reset (after redeploying the Edge Function) →
      real success or a specific, readable error
- [ ] Combo add-to-cart stays on page + shows qty stepper
- [ ] Brand-new product's detail-view Add to Cart updates in place
- [ ] Peanut Chutney gallery scrolls once media fields are confirmed
- [ ] Copy Message text matches WhatsApp Customer text for the same
      order status
- [ ] Hamburger menu on an actual phone — solid background, readable
- [ ] Customer login via mobile number
- [ ] Admin login via email
