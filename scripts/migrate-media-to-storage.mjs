#!/usr/bin/env node
/**
 * Jayvi Foods — migrate-media-to-storage.mjs (V32.12 Workstream 3.11)
 *
 * One-time (repeatable/idempotent) utility that finds every
 * public.product_media row still pointing at a Git-repo file path
 * (e.g. "images/products/peanut-chutney/hero.webp") and:
 *   1. Locates that file on disk, in THIS repo checkout.
 *   2. Uploads it to the `product-media` Supabase Storage bucket
 *      (see supabase_migration_product_media_storage.sql), under
 *      "<product-or-combo-id>/<filename>" — the same convention
 *      Admin's own "+ Add Photo"/"+ Add Video" upload buttons use
 *      (admin.js: uploadMediaFile()), so a migrated row looks
 *      identical to one Admin uploaded by hand.
 *   3. Updates ONLY that row's `media_url` (and `poster_url`, for a
 *      video's Git-path poster image) to the new Storage public URL.
 *   4. Does NOT touch `display_order` or `is_primary` — those columns
 *      are simply never included in the update payload, so whatever
 *      Admin already configured is preserved exactly.
 *   5. NEVER deletes the original file from Git/disk. This script is
 *      read-only with respect to the filesystem.
 *
 * SAFE TO RUN MORE THAN ONCE:
 *   - A row whose media_url already points at Storage
 *     (".../storage/v1/object/public/...") is skipped — already done.
 *   - Before uploading, the script checks whether an object with the
 *     same name already exists at the destination path in the bucket
 *     (via storage.list()) and, if so, reuses it instead of uploading
 *     again or creating a duplicate — this is what makes a re-run (or
 *     a re-run after a partial failure) safe.
 *   - A file that can't be found on disk, or a file the Storage upload
 *     rejects, is skipped with a clear warning in the summary — it
 *     never stops the rest of the batch, and the row's media_url is
 *     left completely untouched (old Git path keeps working — the
 *     existing fallback, see PRODUCT_MEDIA_MIGRATION.md, still
 *     applies to it).
 *
 * USAGE
 *   1. npm install @supabase/supabase-js   (from the repo root)
 *   2. Set two environment variables — NEVER hard-code these, and
 *      NEVER commit the service_role key to Git:
 *        SUPABASE_URL
 *        SUPABASE_SERVICE_ROLE_KEY   (Project Settings → API — this is
 *                                     the privileged key; this script
 *                                     is the one safe place to use it,
 *                                     same reasoning as the
 *                                     admin-reset-password Edge
 *                                     Function — it never runs in the
 *                                     browser)
 *   3. Preview first, with no writes at all:
 *        node scripts/migrate-media-to-storage.mjs --dry-run
 *   4. Migrate everything:
 *        node scripts/migrate-media-to-storage.mjs
 *   5. Or migrate just one product/combo first, per spec 3.11 Phase D
 *      ("Test with a few products" before doing the rest):
 *        node scripts/migrate-media-to-storage.mjs --only=peanut
 *        node scripts/migrate-media-to-storage.mjs --only=combo-breakfast-combo
 *
 * This script is deliberately NOT wired into any web page or Edge
 * Function — it's a one-time operator tool run from a terminal with
 * the service_role key in the environment, never in the browser.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const BUCKET = 'product-media';

const DRY_RUN = process.argv.includes('--dry-run');
const onlyArg = process.argv.find(a => a.startsWith('--only='));
const ONLY_OWNER = onlyArg ? onlyArg.split('=')[1] : null; // e.g. "peanut" or "combo-breakfast-combo"

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set as environment variables.');
  console.error('This script refuses to run without them rather than guessing/defaulting — the service_role key must never be hard-coded in this file.');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const MIME_BY_EXT = {
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.avif': 'image/avif',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
};

const STORAGE_URL_RE = /\/storage\/v1\/object\/public\//;

function ownerIdFor(row) {
  return row.product_id ? row.product_id : `combo-${row.combo_id}`;
}

function storagePathFor(row, filename) {
  const owner = ownerIdFor(row);
  return row.media_type === 'video' ? `${owner}/videos/${filename}` : `${owner}/${filename}`;
}

// Returns the existing public URL if an object with this exact name is
// already present at the destination folder — this is the idempotency
// check that makes re-running the script safe (spec 3.3: "avoid
// duplicates").
async function findExistingObjectUrl(folder, filename) {
  const { data, error } = await sb.storage.from(BUCKET).list(folder, { search: filename });
  if (error) return null;
  const hit = (data || []).find(f => f.name === filename);
  if (!hit) return null;
  const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(`${folder}/${filename}`);
  return pub.publicUrl;
}

async function uploadGitFileToStorage(gitRelativePath, storagePath) {
  const absPath = path.resolve(REPO_ROOT, gitRelativePath);
  // Defence in depth against path traversal in a media_url value —
  // this script only ever uploads files that resolve to inside this
  // repo checkout.
  if (!absPath.startsWith(REPO_ROOT)) {
    throw new Error(`refused to read a path outside the repo: ${gitRelativePath}`);
  }
  if (!fssync.existsSync(absPath)) {
    throw new Error(`file not found on disk: ${gitRelativePath} (looked at ${absPath})`);
  }
  const bytes = await fs.readFile(absPath);
  const ext = path.extname(absPath).toLowerCase();
  const contentType = MIME_BY_EXT[ext] || 'application/octet-stream';
  const { error } = await sb.storage.from(BUCKET).upload(storagePath, bytes, {
    contentType, cacheControl: '31536000', upsert: false,
  });
  if (error) throw error;
  const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(storagePath);
  return pub.publicUrl;
}

async function migrateOneUrl(row, gitPath, kind /* 'media_url' | 'poster_url' */) {
  const filename = path.basename(gitPath);
  const folder = kind === 'media_url' ? path.dirname(storagePathFor(row, filename)) : ownerIdFor(row);
  const storagePath = kind === 'media_url' ? storagePathFor(row, filename) : `${folder}/${filename}`;

  const existing = await findExistingObjectUrl(folder, filename);
  if (existing) {
    return { url: existing, action: 'reused-existing-object' };
  }
  if (DRY_RUN) {
    return { url: null, action: 'would-upload', plannedPath: storagePath };
  }
  const url = await uploadGitFileToStorage(gitPath, storagePath);
  return { url, action: 'uploaded' };
}

async function main() {
  console.log(`\nJayvi Foods media migration — ${DRY_RUN ? 'DRY RUN (no writes will be made)' : 'LIVE RUN'}${ONLY_OWNER ? ` — restricted to owner "${ONLY_OWNER}"` : ''}\n`);

  const { data: rows, error } = await sb
    .from('product_media')
    .select('id, product_id, combo_id, media_type, media_url, poster_url, display_order, is_primary')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Could not read product_media:', error.message);
    process.exit(1);
  }

  const candidates = (rows || []).filter(r => {
    if (STORAGE_URL_RE.test(r.media_url || '')) return false; // already migrated
    if (ONLY_OWNER && ownerIdFor(r) !== ONLY_OWNER) return false;
    return true;
  });

  console.log(`Found ${rows.length} total media rows; ${candidates.length} still on a Git-repo path and in scope for this run.\n`);

  const summary = { migrated: 0, reused: 0, skippedNotFound: 0, failed: 0, wouldMigrate: 0 };

  for (const row of candidates) {
    const owner = ownerIdFor(row);
    const label = `[${owner}] ${row.media_type} media_url="${row.media_url}"`;
    try {
      const result = await migrateOneUrl(row, row.media_url, 'media_url');
      let posterResult = null;
      if (row.media_type === 'video' && row.poster_url && !STORAGE_URL_RE.test(row.poster_url)) {
        posterResult = await migrateOneUrl(row, row.poster_url, 'poster_url');
      }

      if (result.action === 'would-upload') {
        console.log(`  WOULD MIGRATE  ${label}\n                  → ${result.plannedPath}`);
        summary.wouldMigrate++;
        continue;
      }

      const update = { media_url: result.url };
      if (posterResult && posterResult.url) update.poster_url = posterResult.url;
      // display_order and is_primary are deliberately NOT in this
      // object — nothing about ordering/primary status is touched.
      const { error: updErr } = await sb.from('product_media').update(update).eq('id', row.id);
      if (updErr) throw updErr;

      console.log(`  ${result.action === 'reused-existing-object' ? 'REUSED' : 'MIGRATED'}  ${label}\n                  → ${result.url}`);
      if (result.action === 'reused-existing-object') summary.reused++; else summary.migrated++;
    } catch (err) {
      console.warn(`  SKIPPED (error) ${label}\n                  reason: ${err.message}`);
      if (/file not found on disk/.test(err.message)) summary.skippedNotFound++; else summary.failed++;
    }
  }

  console.log('\n--- Summary ---');
  if (DRY_RUN) {
    console.log(`Would migrate: ${summary.wouldMigrate}`);
  } else {
    console.log(`Migrated (new upload):        ${summary.migrated}`);
    console.log(`Reused (already in Storage):  ${summary.reused}`);
  }
  console.log(`Skipped — file not found:    ${summary.skippedNotFound}`);
  console.log(`Failed (other error):         ${summary.failed}`);
  console.log('\nNo original Git files were deleted. Re-run any time — already-migrated rows are skipped automatically.\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
