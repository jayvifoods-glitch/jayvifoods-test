#!/usr/bin/env node
/* =========================================================
   Jayvi Foods — Brand gallery manifest generator (V32.6, item 3)

   ⚠ DEPRECATED as of V32.3 — kept only per the brief's explicit
   instruction not to delete existing gallery assets/scripts outright
   (spec 19). The customer-facing gallery is no longer driven by
   images/gallery/manifest.json — it now reads Admin-managed items from
   Supabase (public.gallery_media, `gallery-media` Storage bucket; see
   supabase_migration_v32_3.sql and renderBrandGallery() in app.js).
   This script and images/gallery/ are left in place, unused, for
   reference/rollback only. images/gallery/manifest.json was already an
   empty `[]` at the time of this release, so there was no live gallery
   content to migrate. Do not add new images to images/gallery/ or run
   this script expecting it to affect the storefront — it no longer
   does. Manage the gallery from Admin → Gallery instead.
   ========================================================= */

/* =========================================================
   Jayvi Foods — Brand gallery manifest generator (V32.6, item 3)
   [Original V32.6 documentation below, preserved for reference.]

   WHY THIS SCRIPT EXISTS (please read before assuming it can be
   skipped): this is a static site with no server and no build step.
   A static site genuinely cannot ask its own web server "what files
   are in this folder right now" at page-load time — there is no
   universal, reliable API for that on plain static hosting (Netlify,
   GitHub Pages, Vercel static export, etc. all disable directory
   listing by default, and even where it's enabled the HTML format
   differs per host, so parsing it in the browser would be fragile
   and could silently break on a hosting change).

   The standard, reliable way to get "drop a file in a folder and have
   the app pick it up automatically" on a static site is a generated
   manifest: this script lists every image in images/gallery/ and
   writes that list to images/gallery/manifest.json. app.js then reads
   ONLY manifest.json — it never hardcodes a single filename. Adding a
   new image is still just two steps: (1) put the .webp file in
   images/gallery/, (2) run this script (or your CI can run it
   automatically as a deploy step — see the "CI" note below). Nothing
   in app.js/admin.js/index.html ever needs to change.

   USAGE:
     node generate-gallery-manifest.js

   CI (optional, recommended): add `node generate-gallery-manifest.js`
   as a step in your deploy pipeline, before the static files are
   published, so you never have to remember to run it by hand. If your
   host has no build step at all (pure git-push-to-deploy), just run
   this locally and commit the updated manifest.json alongside the new
   image(s) — one extra `git add` for a file the app itself generates.
   ========================================================= */
const fs = require('fs');
const path = require('path');

const GALLERY_DIR = path.join(__dirname, 'images', 'gallery');
const MANIFEST_PATH = path.join(GALLERY_DIR, 'manifest.json');

if (!fs.existsSync(GALLERY_DIR)) {
  console.error(`Folder not found: ${GALLERY_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(GALLERY_DIR)
  .filter(f => f.toLowerCase().endsWith('.webp'))
  .sort(); // stable, predictable order run to run

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(files, null, 2) + '\n');

console.log(`Wrote ${files.length} image(s) to ${MANIFEST_PATH}`);
if (files.length === 0) {
  console.log('No .webp files found in images/gallery/ — the homepage gallery will stay hidden until you add some.');
} else {
  files.forEach(f => console.log(`  - ${f}`));
}
