# Future architecture requirement — Product Catalogue Migration

**✅ Status update (V32.11): the full architecture is now complete.**
Products/product media/combos were migrated in V32.6; Categories and
Meal tags in V32.10; Store settings, Announcements, and curated
Reviews (the last three pieces anywhere in the app that were still
local) in V32.11 — see `DEPLOY.md`'s "V32.11 update" section and
`supabase_migration_settings_announcements_reviews.sql`. As of V32.11,
Git holds only code, hosting, and product/combo media; Supabase holds
all business/customer data, with no remaining exceptions. The rest of
this file is kept as-is below for historical context (it accurately
describes the state of things through V32.9); it no longer describes
the current architecture.

**Status: not implemented. Documentation only, as of V32.5.**
This file exists purely to record a future requirement discussed
during V32.5 review. Nothing in this file has been built, and V32.5
does not change the current catalogue architecture in any way.

**Confirmed decision (do not revisit without explicit sign-off):** the
next dedicated catalogue release implements a real central Supabase
Product Master, per the flow below. **No temporary browser/localStorage
sync workaround will be introduced as an intermediate step** — e.g. no
"export from Admin, import into another browser" tool, no polling
mechanism between browsers, no partial sync of just some fields. The
localStorage architecture stays exactly as-is until the real migration
ships, and the Admin UI now says so explicitly (see "What changed in
V32.5" below) so this isn't mistaken for already being live.

## Confirmed future flow

```
Admin adds/edits product
        ↓
Supabase Product Master (single source of truth)
        ↓
Storefront (app.js) reads the central catalogue automatically
        ↓
All customers, all devices, same catalogue — no manual sync step
```

## Current architecture (unchanged in V32.5)

Products, categories, combos, meal tags, and related storefront
content live in each browser's own `localStorage` (key
`jayviStoreV14`), populated from a baseline `EMBEDDED_CONFIG` shipped
inside `app.js`. `admin.js` writes Admin's catalogue edits to that same
`localStorage` key (`persist()`), with a toast reminding Admin that
"catalogue and store configuration stay Git-managed — sync this out to
your repo when ready."

This is why a product added/edited on one device does not appear on
another device or browser — each one has its own local copy, and
there is no shared source of truth for the catalogue the way there
already is for `orders`, `customer_addresses`, `pincodes`, and
`delivery_states` (all genuinely in Supabase). This was confirmed as
the root cause of the "desktop shows 4 products, mobile shows 5"
finding during V32.5 testing — not a responsive-layout bug.

**Additional finding (V32.5 review):** `admin.js` has its own,
independent hardcoded fallback — `CONFIG_FALLBACK` — with the exact
same shape as `app.js`'s `EMBEDDED_CONFIG`. `loadData()` in `admin.js`
falls back to it whenever that browser's `localStorage` is empty. This
means there are currently **two separate places** a "default catalogue"
is hardcoded (one per file), which must be kept in sync by hand any
time the production procedure (documented in `DEPLOY.md`) is followed
— one more manual-sync failure mode that a real central Product Master
would remove entirely, since there would be exactly one source of
truth instead of two hardcoded fallbacks plus per-browser localStorage.

## Required future state

```
Admin Product Management
        ↓
Central Supabase Product Master
        ↓
Mobile + Desktop + All Customers (same data, everywhere, automatically)
```

When Admin adds, edits, activates/deactivates, or deletes a product,
every customer on every device should see that change without any
manual "sync to repo" step — the same pattern the pincode/delivery
system already uses successfully.

## Minimum fields the future Product Master needs to support

Based on the current `admin.js` product/variant model plus the
explicit ask during V32.5 review:

- Product (id, name, SKU)
- Category (primary + multiple collections, as today)
- Description (short + full)
- Images / videos (multiple media items per product, as today's
  `media` array already models — this part of the *shape* can likely
  carry over largely as-is)
- Variants / sizes (label, weight, price, MRP, SKU, active flag)
- MRP
- Selling price
- Active / inactive
- **Stock** — not currently modeled anywhere in the codebase at all
  (today's catalogue has no stock/inventory concept); this would be
  new, not a migration of existing data
- Combo configuration (combo items referencing product + variant + qty,
  as today's `combos` array already models)

## Why this is deliberately out of scope for V32.5

This is a genuine database migration — moving the catalogue's source
of truth from per-browser `localStorage` to Supabase tables, rewriting
`sync()`/`loadConfig()` in `app.js` and the entire product/variant/combo
admin flow in `admin.js` to read/write Supabase instead of
`localStorage`, plus (new) stock tracking, RLS policies, and a data
migration path for whatever catalogue currently exists in each admin's
browser. That is a multi-file, multi-workflow change on the scale of
the original pincode/orders migration — not a targeted fix, and
explicitly called out as something V32.5 should not attempt.

## What changed in V32.5 (UI clarity only, not architecture)

Products, Variants, Combos, Categories, and Meal Tags in Admin now show
a persistent (non-fading) banner at the top of each page stating
plainly that saves there are local to that browser only and are not
visible to customers until manually copied into `app.js`'s
`EMBEDDED_CONFIG` and redeployed. This replaces relying on a toast
message that disappears after a few seconds — the goal is that clicking
Save can never be mistaken for "published." No underlying behavior
changed: `persist()` still writes to `localStorage` exactly as before.

## Suggested next step (separate round, not started)

Scope this as its own dedicated release once V32.5 is stable in
customer testing: likely mirrors the existing `pincodes` /
`delivery_states` pattern (Supabase tables + RLS + an RPC or direct
`sb.from(...)` calls from both `app.js` and `admin.js`), plus a
one-time data migration to seed the Supabase tables from whatever
catalogue is currently considered canonical.
