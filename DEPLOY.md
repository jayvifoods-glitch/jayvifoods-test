# Jayvi Foods V25.0 — Production Candidate

## Release
Website version: **V25.0**

This package is based on the V24.1 consolidated source and replaces the
accumulated V21–V24 mobile patch stack with one V25 event-driven stabilization
layer.

## Upload
Upload/replace the **complete contents** of this package in the repository root:

- `index.html`
- `style.css`
- `app.js`
- `admin.html`
- `admin.css`
- `admin.js`
- `admin-login.html`
- `help.html`
- `legal.html`
- `images/`
- `VERSION.txt`
- `V25-INSTALL.txt`
- `DEPLOY.md`

Do not mix older V15–V24 files with this release.

## GitHub Pages
Use:
- Branch: `main`
- Folder: `/ (root)`

The site assets are cache-busted as `style.css?v=25.0` and `app.js?v=25.0`.

## Data architecture
No storage architecture change is included in V25. The current application
continues to use the existing browser/localStorage prototype model. Google
Maps, backend order persistence, secure authentication, payment gateway
integration and production secrets remain separate future work.

## Testing priority
1. Mobile initial load
2. Normal page scrolling
3. Hamburger menu
4. Product image horizontal swipe
5. Cart -> checkout
6. Checkout vertical scrolling
7. PIN verification
8. UTR entry
9. Order confirmation
10. WhatsApp
11. Desktop product popup
12. Legal/footer
