# Jayvi Foods V24.0 — final consolidated pre-production build

This package consolidates the latest Git project into a single V24 upload set.

## Upload

Upload/replace the complete contents of this package in the repository root.

Core files:
- `index.html` — storefront and V24 mobile stability layer
- `app.js` — storefront logic, catalogue, cart, checkout, account and V24 fixes
- `style.css` — complete storefront styling and responsive/mobile rules
- `admin.html` — admin portal
- `admin.js` — admin logic
- `admin.css` — admin styling
- `admin-login.html` — admin login
- `help.html` — help/support page
- `images/` — brand, hero, product and gallery assets

## Version

Website version: **V24.0**

## V24 scope

V24 is the consolidated UI/mobile stability pass. It includes the fixes listed
in `V24-INSTALL.txt`.

## Data architecture

No data-storage architecture change is included in V24. The current project
continues to use the existing browser/localStorage prototype model. Backend
database, secure authentication, server-side order persistence, payment
verification and Google Maps production configuration remain a later phase.

## GitHub Pages

GitHub Pages should publish:
- Branch: `main`
- Folder: `/ (root)`

Do not mix older patch files into this release.
