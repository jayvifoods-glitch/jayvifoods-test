#!/usr/bin/env node
/*
 * Jayvi Foods — Config schema parity check (V32.5)
 *
 * WHY THIS EXISTS
 * app.js's EMBEDDED_CONFIG and admin.js's CONFIG_FALLBACK are two
 * independent hardcoded object literals that are supposed to have the
 * exact same shape (store/homepage/categories/products/combos/
 * announcements/mealTags/reviews), because the "Copy Full Catalogue
 * JSON" production procedure (see DEPLOY.md) copies Admin's live data
 * — which is CONFIG_FALLBACK-shaped — and pastes it wholesale into
 * BOTH files. If the two literals ever drift apart (a field added to
 * one file's defaults but not the other's), a routine product edit
 * could silently drop real storefront configuration — this is exactly
 * what happened with `deliveryMode`/`paymentMode`/`otpProvider` before
 * this script was added; see CHANGELOG_V32.5_config_schema_fix.md.
 *
 * WHAT IT DOES
 * Extracts both object literals directly from the current app.js and
 * admin.js source (no manual copy-paste, so it can't go stale), then
 * compares their key sets: top-level, `store`, `homepage`, and the
 * shape of one representative element from each data array
 * (products/categories/combos/announcements/mealTags). Data ARRAYS
 * are expected to hold different content (that's the whole point of
 * the catalogue) — this checks structure, not content.
 *
 * WHEN TO RUN
 * Before every deploy that touches EMBEDDED_CONFIG or CONFIG_FALLBACK
 * — this is step 0 of the production procedure in DEPLOY.md. Exits
 * with a non-zero status and a readable diff if anything doesn't
 * match, so it can be wired into a pre-deploy check/CI step if useful.
 *
 * Usage: node verify_config_schema.js
 */
const fs = require('fs');
const path = require('path');

const APP_JS = path.join(__dirname, 'app.js');
const ADMIN_JS = path.join(__dirname, 'admin.js');

function extractObjectLiteral(src, constName) {
  const re = new RegExp('const\\s+' + constName + '\\s*=');
  const m = re.exec(src);
  if (!m) throw new Error(`Could not find "const ${constName} =" — has it been renamed?`);
  const braceStart = src.indexOf('{', m.index);
  let depth = 0, i = braceStart;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(braceStart, i);
}

function loadLiteral(filePath, constName) {
  const src = fs.readFileSync(filePath, 'utf8');
  const literalSrc = extractObjectLiteral(src, constName);
  // eslint-disable-next-line no-eval -- trusted local source files only, never remote/user input
  return eval('(' + literalSrc + ')');
}

function diffKeys(a, b, label) {
  const ak = new Set(Object.keys(a || {}));
  const bk = new Set(Object.keys(b || {}));
  const onlyA = [...ak].filter(k => !bk.has(k));
  const onlyB = [...bk].filter(k => !ak.has(k));
  const problems = [];
  if (onlyA.length) problems.push(`  Only in EMBEDDED_CONFIG${label}: ${onlyA.join(', ')}`);
  if (onlyB.length) problems.push(`  Only in CONFIG_FALLBACK${label}: ${onlyB.join(', ')}`);
  return problems;
}

function main() {
  let EMBEDDED_CONFIG, CONFIG_FALLBACK;
  try {
    EMBEDDED_CONFIG = loadLiteral(APP_JS, 'EMBEDDED_CONFIG');
    CONFIG_FALLBACK = loadLiteral(ADMIN_JS, 'CONFIG_FALLBACK');
  } catch (e) {
    console.error('Could not parse one of the config literals:', e.message);
    process.exit(2);
  }

  const problems = [
    ...diffKeys(EMBEDDED_CONFIG, CONFIG_FALLBACK, ''),
    ...diffKeys(EMBEDDED_CONFIG.store, CONFIG_FALLBACK.store, '.store'),
    ...diffKeys(EMBEDDED_CONFIG.homepage, CONFIG_FALLBACK.homepage, '.homepage'),
    ...diffKeys(EMBEDDED_CONFIG.products?.[0], CONFIG_FALLBACK.products?.[0], '.products[0]'),
    ...diffKeys(EMBEDDED_CONFIG.categories?.[0], CONFIG_FALLBACK.categories?.[0], '.categories[0]'),
    ...diffKeys(EMBEDDED_CONFIG.combos?.[0], CONFIG_FALLBACK.combos?.[0], '.combos[0]'),
    ...diffKeys(EMBEDDED_CONFIG.announcements?.[0], CONFIG_FALLBACK.announcements?.[0], '.announcements[0]'),
    ...diffKeys(EMBEDDED_CONFIG.mealTags?.[0], CONFIG_FALLBACK.mealTags?.[0], '.mealTags[0]'),
  ];

  if (problems.length) {
    console.error('❌ SCHEMA MISMATCH between EMBEDDED_CONFIG (app.js) and CONFIG_FALLBACK (admin.js):\n');
    console.error(problems.join('\n'));
    console.error('\nDo NOT proceed with "Copy Full Catalogue JSON" / the production procedure until this is resolved — a field missing from one side can be silently dropped when the copied JSON is pasted in. See DEPLOY.md\'s PRODUCTION PROCEDURE section.');
    process.exit(1);
  }

  console.log('✅ EMBEDDED_CONFIG and CONFIG_FALLBACK are structurally identical. Safe to proceed with the production procedure in DEPLOY.md.');
  process.exit(0);
}

main();
