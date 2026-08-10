# Jayvi Foods v32.1 — Stabilization + Admin completion

This release fixes every item from the V32.0 testing report. Same
visual design as v31.0/v32.0 throughout — no redesign, per instruction.
Two database migrations apply to this release; see "Database changes"
below before deploying.

## Database changes for this release (apply in this order)

1. `supabase_schema_phase1_v3.sql` — unchanged, already applied if
   you're on V32.0. Skip if already run.
2. **`supabase_migration_reviews_v32_1.sql` — NEW, run this now.**
   Adds the `website_reviews` table + RLS for the new customer review
   workflow (item 15/16 below). Additive only — does not touch any
   existing table, policy, or function.
3. **`cleanup_test_orders.sql` — review, then run yourself.** I have no
   live database connection (per the ongoing "offline work" constraint),
   so I cannot execute or verify this. It's a two-step SELECT-then-DELETE
   targeting only `TEST-%`/`HACK-%` order numbers — read the comments in
   the file, and reply with the exact order numbers it found so there's
   a real confirmed record, not just my assertion that it worked.

## A. Storefront UI fixes

1. **Hamburger menu transparency** — real bug, not cosmetic: the
   drawer's `z-index` (59) was lower than the sticky header's (60), so
   the semi-transparent blurred header rendered on top of the drawer
   near the top of the screen. Raised the drawer/scrim z-index above
   the header's.
2. **Logo appearing blank/white (menu)** and **6. same issue (footer)**
   — found the actual cause by inspecting the image file directly:
   your logo is a detailed, full-color circular badge (portrait, gold
   filigree, red background, white script text) — not a simple
   monochrome mark. The CSS (`filter:brightness(0) invert(1)`) was
   designed for wordmark-style logos and was flattening the entire
   opaque circle to solid white, erasing all detail. Removed that
   filter from both locations; the real logo now displays, and I sized
   both up slightly (26px→40px in the menu, 30px→52px in the footer)
   since the detail is illegible any smaller.
3. **Header logo too small next to icons** — 34px→46px.
4. **+/- cart controls not contained in circles** — switched from text
   glyphs (`−`/`+`, prone to inconsistent font-metric centering) to
   Font Awesome icons inside a fixed 28×28px flex-centered circle.
5. **Dead "Our Story" link** — confirmed by inspection: it was a
   literal self-link (`href="#about"` sitting inside `id="about"`) —
   clicking it did nothing because it was already the current section.
   Expanded the About copy with an actual short story paragraph and
   pointed the link to Reviews instead.
7. **Announcement text** — updated to "Purely Traditional · Simply
   Delicious" in both the visible and the `aria-hidden` marquee-loop
   copy (the ticker duplicates its content for a seamless scroll).

## B. Admin login wording

8. Removed the real admin email from both the visible copy ("Sign in
   to Jayvi Foods Admin" — no address named) and the email field's
   `placeholder` attribute, which was also silently exposing it (fixed
   even though not explicitly flagged). Authentication mechanism itself
   is completely unchanged — still Supabase Auth + `profiles.role`
   check, no hardcoded credential anywhere.

## D/E/F/G/H. Catalogue, variants, combos, categories, guest customers

**Root cause, confirmed by inspection:** `admin.js` and `app.js` each
had their own independent hardcoded fallback dataset. `app.js`'s
`EMBEDDED_CONFIG` had the real 4 products/variants, 1 combo, and 4
categories baked in; `admin.js`'s `CONFIG_FALLBACK` had empty arrays
for all three. Two unrelated sources of truth, exactly as suspected —
this is why Admin showed nothing while the storefront showed
everything, and why the existing (already-functional) variant/combo/
category management UI in `admin.js` appeared broken — it was working
correctly against data that simply didn't exist yet.

**Fix:** mirrored the real dataset from `app.js` into `admin.js`'s
fallback. One data fix resolves items 11, 12, 13, and 14 simultaneously
— no new Admin UI code was needed; `productsPage()`, `variantsPage()`,
`combosPage()`, `categoriesPage()`, and their forms already existed and
work correctly once given real data.

**Architecture confirmation (explicitly requested, not changing
silently):** catalogue/variants/combos/categories/store settings
**remain Git/Admin-JSON-managed, exactly as already agreed.** Nothing
in this release moves any of that to Supabase. Only `website_reviews`
(item 15 below) is new Supabase surface, and that was your own explicit
architecture decision in this request, not one I made.

**Guest customers (item 10):** now shown in Admin's Customers page,
grouped client-side from existing orders where `customer_id is null`,
keyed by phone number — no Supabase Auth account is created for them,
per your explicit requirement. Each entry shows name (from their most
recent order), phone, order count, and a "View orders" button opening
their order history. Registered and guest customers are shown together,
sorted by order count, with a type tag distinguishing them.

## I. Customer review workflow (items 15, 16)

New, complete, and — per your explicit architecture decision in this
request — Supabase-backed rather than localStorage:

- **Storefront:** a "Write a review" card in the Reviews section opens
  a form (name, star rating, optional product, optional order number,
  review text) inside the existing account-modal chrome — no new
  overlay/page, reusing what's already there. Submissions insert
  directly into `website_reviews` with `status='pending'`, enforced
  server-side (a client cannot submit as anything but pending — see
  the migration's RLS policy).
- **Storefront display:** the Reviews section now shows three
  independent things side by side without mixing their management
  workflows: curated Google-linked testimonials (unchanged, still
  Admin-JSON), live approved customer reviews (new, fetched from
  Supabase), and the "View Google reviews" link (unchanged). Approving
  a review in Admin makes it appear here automatically — no redeploy.
- **Admin:** a new "Website reviews" panel with Pending/Approved/
  Rejected tabs (with live counts), a search box (name or review text),
  a sort dropdown (newest/oldest/highest/lowest rating), and Approve/
  Reject/Move-to-pending actions. Built to stay usable at volume: every
  query is server-side filtered and paginated (20 per page, "Load more"
  rather than fetching everything at once) — not a full-table fetch
  that gets slower as reviews accumulate.
- **Google Reviews management is completely untouched** — same
  `reviewForm`/`saveReview`/`toggleReview`/`deleteReview` functions,
  same `data.reviews` Admin-JSON storage, rendered in its own separate
  panel below the new website-reviews panel. Never sharing a workflow,
  exactly as instructed.

## J. Admin session leaking into the storefront's "My Orders"

**This was real, and worth explaining precisely rather than just
patching.** The storefront's order/address queries (`renderOrdersTab`,
`renderAddressTab`, and the checkout's saved-address lookup) had no
explicit filter — they relied entirely on RLS to narrow results to
"the signed-in user's own rows." For a regular customer, RLS does
exactly that correctly. For an admin account, RLS's own admin policy
*correctly* allows reading every order at the database level — that's
by design and is not a security bug. The actual bug was one layer up:
the storefront UI didn't distinguish "what the database permits this
identity to read" from "what this specific UI is asking for," so it
displayed whatever came back, which for an admin session was
everything.

**Approach taken (frontend-only, RLS completely untouched, as
instructed):** every one of those queries now has an explicit
`.eq('customer_id', currentUser.id)` — regardless of whether a
customer or an admin is signed in, "My Orders"/"My Addresses" now only
ever asks the database for rows matching that literal signed-in user's
own ID, never leaning on RLS's broader (and correct) admin allowance to
narrow things implicitly. On top of that, if the signed-in identity has
`profiles.role = 'admin'`, the account view now shows a small notice —
"You're signed in with an Admin account... use the Admin panel" — so
it's not just silently empty-looking, it's explained. Net effect: an
admin who opens the storefront and taps Account sees only their own
personal order history (correctly, almost always empty) plus a link to
the actual Admin panel — never every customer's orders.

## K. Guest Track Order entry point

Confirmed by inspection: the tracking backend and logic already
existed and worked (verified in the RLS testing), but there was
genuinely no way for a logged-out visitor to reach it — the only
"Track order" button lived inside the signed-in account view, which a
guest never sees (they see the login form instead). Added a reachable
entry point in four places: desktop header nav, mobile hamburger menu,
footer, and a line on the guest login screen itself ("Already placed
an order? Track it here"). All four call the same existing
`track_guest_order()` RPC — minimal fields only (no address, UTR, or
customer ID), exactly as verified in the RLS work; nothing about that
backend or its guarantees changed.

## L. Admin verification — still your call, not mine

You noted Admin hasn't been smoke-tested yet on your side. I did fix
what was reported and re-verified each fix against the actual code (not
from memory) — every item above was confirmed by direct inspection
before I touched it. But "the code is correct" and "it behaves
correctly when you click through it live" are different claims, same
distinction as every other release in this project. Checklist below.

## Verification checklist

**Storefront (re-test after this release)**
1. Open the site on mobile width. Tap the hamburger menu — background
   should be solid dark, logo should show the full-color badge clearly,
   text should be easily readable.
2. Check the footer logo — same full-color badge, not a white blob.
3. Compare header logo size to the Search/Account/Cart icons — logo
   should read as clearly more prominent now.
4. Add a product to cart from a product card — the −/qty/+ pill should
   look like two clean filled circles with centered icons, not
   misaligned glyphs.
5. Scroll to About Jayvi → click "See what customers say" — should
   jump to the Reviews section, not do nothing.
6. Check the top announcement ticker reads "Purely Traditional · Simply
   Delicious."
7. Log out (or use an incognito window) → click "Track Order" in the
   header nav, footer, or mobile menu → enter an order number + phone
   → confirm it works and shows no address/UTR.
8. Go to Reviews section → click "Write a review" → submit one →
   confirm it does NOT appear on the site yet (still pending).

**Admin (full pass, not yet done on your side)**
9. Log in at `admin-login.html` — heading should say "Sign in to Jayvi
   Foods Admin," no email shown anywhere, including the empty field's
   placeholder text.
10. Dashboard — confirm KPIs load without error.
11. Products — confirm all 4 products now appear (Peanut, Flaxseed,
    Idli Dosa Pudi, Puffora), each with variants.
12. Variants & sizes — confirm 200g/400g (and Puffora's single "Pack"
    size) are visible and editable.
13. Combos — confirm "Traditional Duo" appears with its two items.
14. Categories — confirm 4 categories appear (Chutney Powders, Pudi,
    Snacks, Combos).
15. Make a small edit to a product (e.g. change its short description)
    and save — then check the *storefront* in a fresh/incognito browser
    that never had this Admin session's localStorage. **Expected: the
    storefront will NOT show your change** — this is the known,
    already-documented catalogue-sync limitation (Admin writes only to
    this browser's localStorage; nothing pushes it to Git/the deployed
    site automatically). Confirming this still applies, not a new bug.
16. Customers — confirm both registered and guest customers appear,
    with correct order counts, and "View orders" opens their history.
17. Orders — open an order, change status/delivery partner/tracking
    number/tracking URL, save, confirm it persists on reopen.
18. Website reviews — approve the test review from storefront step 8
    → refresh the storefront's Reviews section → confirm it now
    appears there.
19. Reject a review → confirm it moves to the Rejected tab and does
    NOT appear on the storefront.
20. Search/sort in the reviews panel — confirm both narrow the list.
21. **Sign in to Admin, then open the storefront (same browser, same
    session) and tap Account** → confirm you see the "signed in as
    Admin" notice and an empty/near-empty personal order list — NOT
    every customer's orders. This is the item J fix; test it
    specifically before considering this resolved.
22. Store configuration — spot-check that vacation mode, UPI/COD
    toggles, and delivery settings still save correctly (unchanged in
    this release, but worth confirming nothing else broke them).

If anything in this checklist doesn't match, tell me exactly which
numbered step and what happened instead — same process as every
previous round in this project.

## Carried forward, unchanged in this release

- Supabase remains the source of truth for auth, profiles, addresses,
  orders, order items, order status history (Phase 1, frozen).
- `website_reviews` is the one addition, explicitly authorized by you
  in this request's architecture list.
- No `service_role` or any secret key anywhere in the frontend/Git —
  confirmed again by inspection, nothing in this release changes how
  Supabase is authenticated to.
- Catalogue/variants/combos/categories/store settings stay
  Git/Admin-JSON-managed — not moved to Supabase, not silently changed.
- AUTH_MODE remains `'email-map'` (set in the previous round after
  live-testing showed native phone auth needs an SMS provider).
