# Jayvi Foods v30.0 — Full Redesign

Complete visual and front-end rebuild on top of the existing v27/v28 data
architecture. All core commerce features are retained: catalogue, cart,
checkout (UPI QR + COD), guest and registered accounts, order tracking,
wishlist, meal-match, combos, reviews, and the local Admin portal.

## Deployment
- Branch: `main`
- Folder: `/` (root)
- Upload the **complete** package; do not mix files from v15–v28.
- Keep the entire `images/` directory.
- GitHub Pages: wait for the deployment to show "successful" before testing.
- `index.html` references `style.css?v=30.0` and `app.js?v=30.0` — if you
  keep any CDN/proxy caching in front of GitHub Pages, purge it after upload.

## What changed in v30.0

### Design
- Full mobile-first rebuild: base styles now target small screens first,
  with `min-width` media queries progressively enhancing tablet/desktop —
  the previous stylesheet was desktop-first with mobile bolted on via JS
  layout hacks (`fixMobileHeader`, `fixCartLayer`), which have been removed.
- New color system with higher-contrast text (16px base font instead of
  9–11px), a warm ivory/charcoal palette, terracotta primary accent, and
  dedicated success/danger/olive accent tones for status and freshness cues.
- New display typeface (Fraunces) paired with the existing DM Sans for a
  more contemporary, editorial food-brand feel.
- Native mobile app patterns added: a bottom tab bar (Home / Shop / Search
  / Account / Cart with live badge) and a floating "continue to cart" bar,
  matching modern delivery-app UX instead of a repurposed desktop nav.
- Product cards, modals, cart drawer and checkout redesigned with rounded
  surfaces, clearer hierarchy and consistent spacing across breakpoints.
- Admin portal restyled to the same design system (still fully separate
  from the customer-facing bundle, unlocked only via Admin login).

### Engineering / bug fixes
- Removed the three stacked runtime "patches" (V15/V22/V25/V28 IIFEs) that
  redefined the same functions on top of each other at load time. All logic
  is now written once, directly, in `app.js` — same behaviour, far less
  fragile.
- Fixed: the Meal Tags navigation ignored each tag's `enabled` flag and
  admin-configured `order`, and could render tags in the wrong order or
  show disabled ones. It now respects both.
- Fixed: **Admin login previously pre-filled the live admin email and
  password into the login form's HTML**, which meant anyone opening the
  page's source could read the production admin credentials. The fields
  are now empty by default.
- Fixed: a dead reference to a non-existent `#deliveryTop` element and a
  duplicate `sync()` call in the old boot sequence.
- Fixed: an unused dot/arrow gallery-indicator code path that no longer
  matched the shipped card design (v28 removed the UI but not the code).
- Removed a fragile DOM-text-parsing routine that reconstructed "Save ₹x"
  badges by parsing rendered price text; the badge is now written directly
  by the card/detail templates that already know the values.
- Cart/product/checkout data model and all `localStorage` keys are
  **unchanged** (`jayviStoreV14`, `jayviCartV14`, `jayviOrdersV14`,
  `jayviCustomersV14`, `jayviSessionV14`, `jayviWishlistV9`,
  `jayviAdminSessionV8`), so existing Admin-entered catalogue data, and any
  test orders/customers already saved in a browser, continue to work.

## Known limitations (unchanged from v28, inherent to a static/local build)
- All data lives in the browser's `localStorage`; there is no shared
  backend/database, so orders/customers are per-device and per-browser.
- Admin authentication is a client-side check with credentials visible in
  `admin-login.html`'s JavaScript — adequate for an internal prototype, not
  for production. Plan to move this behind a real backend before launch.
- Payment is manual (UPI QR + self-reported UTR, or COD); there is no
  payment gateway integration yet (Razorpay fields exist in Settings for
  when that's added).
