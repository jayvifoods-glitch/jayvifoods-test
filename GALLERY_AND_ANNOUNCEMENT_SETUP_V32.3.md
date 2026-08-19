# V32.3 — Gallery & Announcement setup / migration instructions

## Announcements — migration notes

No manual data migration is required. Running
`supabase_migration_v32_3.sql` automatically backfills every existing
`public.announcements` row's new `announcement_type`/`target_type`
columns from its existing `product_id`/`combo_id`:

| Existing row has...              | becomes...                              |
|-----------------------------------|------------------------------------------|
| `product_id` set, no `combo_id`   | `announcement_type='product'`, `target_type='product'` |
| `combo_id` set, no `product_id`   | `announcement_type='product'`, `target_type='combo'`   |
| neither set                       | `announcement_type='general'`           |

After applying the migration, verify with:
```sql
select id, announcement_type, target_type, product_id, combo_id, active, display_order
  from public.announcements order by display_order;
```
You should see your existing announcements (e.g. the seeded `h1`/`h2`
"product" rows and `h3`, a combo-linked row) now carrying a sensible
`announcement_type`/`target_type`, with nothing else changed.

No Storage migration is needed — announcements continue to use the
existing `announcement-media` bucket created in
`supabase_migration_v32_12_1.sql`.

## Gallery — setup (this is a new feature, not a migration)

1. Run `supabase_migration_v32_3.sql`. This creates:
   - `public.gallery_media` (empty table — there is no existing data to
     seed; see "Existing Git gallery" below).
   - The `gallery-media` Storage bucket, public read / admin write.
2. Verify:
   ```sql
   select id, public from storage.buckets where id = 'gallery-media';
   select count(*) from public.gallery_media; -- expect 0 on a fresh apply
   ```
3. In Admin → **Gallery**, use **+ Add Photos** / **+ Add Video** to
   upload your first gallery items. Each upload:
   - Goes straight into the `gallery-media` bucket.
   - Creates one `gallery_media` row, `active=true`, with the next
     available `display_order`.
4. Use the ↑/↓ buttons to reorder, the caption field for an optional
   caption, the Active checkbox to hide an item without deleting it,
   and Delete to remove it (this also removes the underlying Storage
   file, unless — per the safe-cleanup rule — some other gallery row
   still happens to reference that exact same file).
5. The homepage gallery section is hidden automatically until at least
   one item is Active. No code change is needed to show it once you've
   added content.

## Existing Git-based gallery (`images/gallery/`)

Reviewed as instructed before building this feature:
- `images/gallery/manifest.json` was already `[]` (empty) — the old
  marquee gallery had **no live content** at the time of this release.
  There is nothing to migrate.
- `images/gallery/*.svg` are leftover per-ingredient illustration
  assets (flaxseed/peanut/pudi/puffora), not photos that were ever
  actually shown in the old marquee (the manifest never listed them).
  They have been left in place, untouched, per the instruction not to
  delete existing gallery files outright. If any of them are actually
  wanted in the new customer-facing gallery, re-upload them through
  Admin → Gallery like any other image — there is no automatic import,
  since they were never live gallery content to begin with.
- `generate-gallery-manifest.js` still exists, marked deprecated in its
  header comment. It has no effect on the storefront anymore.
