# Jayvi Foods v31.0

Follow-up refinement pass on top of the v30.0 redesign. Same data
architecture and commerce features throughout (catalogue, cart, checkout,
accounts, orders, wishlist, meal-match, combos, reviews, Admin portal).

## Deployment
- Branch: `main`, Folder: `/` (root)
- Upload the **complete** package; don't mix in older v15–v30 files.
- Keep the entire `images/` directory.
- `index.html` references `style.css?v=31.0` / `app.js?v=31.0` — purge any
  CDN/proxy cache in front of GitHub Pages after upload.

## Admin login

- **URL:** `admin-login.html` (also linked from the storefront footer)
- **Email:** `admin@jayvifoods.com`
- **Password:** `JayviAdmin@2026`

These are the same demo credentials the site shipped with before — v30
only stopped **pre-filling** them into the visible login form (previously
anyone could view-source the page and read the live password directly out
of the HTML). The credentials themselves are unchanged and still live in
plain text inside `admin-login.html`'s `<script>` block, because this is a
fully static site with no backend to check them against.

**To set your own admin password:** open `admin-login.html` in a text
editor and find this line near the bottom:
```js
if(email==='admin@jayvifoods.com' && password==='JayviAdmin@2026'){
```
Replace the two values with your own email and password, save, and
re-upload the file. That's the entire login check — there's no database
row or hash to update elsewhere.

This approach is fine for an internal prototype but is not secure for a
public production store (anyone with the file can read/change it). Before
handling real traffic, this should move behind a real server-side login.

## What changed in v31.0

1. **Cart quantity stepper didn't fit on product cards.** The −/qty/+
   control and the "View cart" button were competing for space on
   narrow 2-column mobile cards, causing overflow/wrapping. The stepper
   is now a fixed-width pill and "View cart" is now a compact icon-only
   button, so both fit cleanly at every card size.

2. **Section backgrounds were too uniform** (most sections shared the same
   ivory background), making it hard to tell one section from the next.
   Added a deliberate alternating rhythm: hero (soft gradient) → trust
   strip (ivory) → Bestsellers (white, bordered) → Shop (ivory) → Combos
   (dark) → Meal Match (sage tint) → Reviews (white) → About (terracotta
   tint) → final CTA + footer (dark). Each band now reads as a distinct
   section at a glance, on both mobile and desktop.

3. **Hamburger menu had a see-through background.** It's now a solid dark
   slide-in drawer (matching the footer/combo dark tone) with its own
   logo, close button, icon-labelled links and a WhatsApp CTA at the
   bottom — clearly opaque and easy to read, with a dimmed backdrop behind
   it that closes the menu on tap.

4. **Combo cards only ever showed one image.** Combos now show a
   swipeable gallery built from the combo's hero image plus each
   included product's image (deduplicated), with the same `1 / N` counter
   used on product cards — so a two-item combo shows up to three images
   with no new Admin fields required.

## Carried over from v30.0
- Mobile-first CSS, bottom tab bar, floating cart bar, redesigned
  cart/checkout/product modals, admin panel restyle.
- Fixed meal-tag ordering/enabled bug, removed dead code and the stacked
  runtime "patches" from earlier versions.
- Same `localStorage` keys as before (`jayviStoreV14`, `jayviCartV14`,
  `jayviOrdersV14`, `jayviCustomersV14`, `jayviSessionV14`,
  `jayviWishlistV9`, `jayviAdminSessionV8`) — existing Admin-entered data
  and any test orders already in a browser keep working.

## Known limitations (inherent to a static/local build)
- All data lives in the browser's `localStorage` — no shared backend, so
  orders/customers are per-device, per-browser.
- Admin auth is a client-side check (see above) — fine for review, not for
  production traffic.
- Payment is manual (UPI QR + self-reported UTR, or COD) — no gateway
  integration yet (Razorpay fields exist in Settings for later).
