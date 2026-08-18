#!/usr/bin/env node
/**
 * Jayvi Foods — list-orphaned-storage-files.mjs (V32.12, spec item "Storage cleanup")
 *
 * WHY THIS EXISTS: deleting a public.product_media ROW (via Admin's
 * media-row "×" button, or via "Delete product"/"Delete combo", both
 * of which delete their product_media rows too) does NOT delete the
 * underlying file from the `product-media` Storage bucket — Storage
 * objects and database rows are two independent systems. Over time
 * this can leave orphaned files in Storage that nothing references
 * any more, quietly using up bucket storage.
 *
 * WHAT THIS SCRIPT DOES: read-only. It lists every object actually
 * present in the `product-media` bucket, compares that against every
 * `media_url`/`poster_url` currently referenced by public.product_media,
 * and reports any Storage object that no row points to any more.
 *
 * WHAT THIS SCRIPT DELIBERATELY DOES NOT DO: delete anything, ever.
 * Per the explicit instruction that automatic deletion is too risky to
 * introduce right now — a file that LOOKS orphaned could still be
 * referenced by something this script doesn't know about (a draft
 * Admin edit not yet saved, a direct Storage URL pasted into a
 * different feature later, etc.). This script's job is only to give a
 * human a clear, accurate list to review — any deletion is a separate,
 * manual, deliberate action the store owner takes afterwards (e.g. via
 * the Supabase Dashboard's Storage browser), never automated here.
 *
 * USAGE
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/list-orphaned-storage-files.mjs
 *
 *   Add --csv to also print a copy-pasteable CSV of orphan paths, for
 *   feeding into a manual review/deletion pass later.
 */

import { createClient } from '@supabase/supabase-js';

const BUCKET = 'product-media';
const CSV = process.argv.includes('--csv');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set as environment variables.');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// Recursively lists every file under a bucket, since storage.list()
// only returns one folder level at a time. Bounded to a sane depth so
// a misconfigured bucket can't cause runaway recursion.
async function listAllFiles(prefix = '', depth = 0) {
  if (depth > 4) return [];
  const { data, error } = await sb.storage.from(BUCKET).list(prefix, { limit: 1000 });
  if (error) { console.warn(`Could not list "${prefix}":`, error.message); return []; }
  let files = [];
  for (const entry of data || []) {
    const fullPath = prefix ? `${prefix}/${entry.name}` : entry.name;
    // Supabase Storage's list() returns folders as entries with
    // id === null and no metadata — that's the reliable "is this a
    // folder" signal (a real file always has metadata.size etc).
    const isFolder = entry.id === null && !entry.metadata;
    if (isFolder) {
      files = files.concat(await listAllFiles(fullPath, depth + 1));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function extractStoragePath(url) {
  const m = (url || '').match(/\/storage\/v1\/object\/public\/product-media\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

async function main() {
  console.log(`\nJayvi Foods — orphaned Storage file report (${BUCKET})\n`);

  const [{ data: rows, error: dbErr }, allFiles] = await Promise.all([
    sb.from('product_media').select('media_url, poster_url'),
    listAllFiles(),
  ]);
  if (dbErr) { console.error('Could not read product_media:', dbErr.message); process.exit(1); }

  const referenced = new Set();
  for (const r of rows || []) {
    const a = extractStoragePath(r.media_url); if (a) referenced.add(a);
    const b = extractStoragePath(r.poster_url); if (b) referenced.add(b);
  }

  const orphans = allFiles.filter(f => !referenced.has(f));

  console.log(`Files in bucket:               ${allFiles.length}`);
  console.log(`Referenced by product_media:   ${referenced.size}`);
  console.log(`Orphaned (not referenced):     ${orphans.length}\n`);

  if (orphans.length) {
    console.log('These files exist in Storage but no product_media row points to them.');
    console.log('Nothing was deleted. Review each one manually before removing it');
    console.log('(Supabase Dashboard → Storage → product-media), e.g. to confirm it');
    console.log("isn't a very recent upload from an edit that hasn't been saved yet:\n");
    orphans.forEach(f => console.log('  -', f));
    if (CSV) {
      console.log('\nCSV:\npath');
      orphans.forEach(f => console.log(f));
    }
  } else {
    console.log('No orphaned files found.');
  }
  console.log('');
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1); });
