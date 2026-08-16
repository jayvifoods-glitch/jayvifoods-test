# Jayvi Foods — V32.9 Changelog

Follow-up patch answering the review questions on V32.8's UI fixes.
One real code change (announcement card responsiveness); everything
else is confirmation of what V32.8 already did, verified again against
source. **Not touched:** Supabase product/catalog architecture, image
optimization mechanism, cart, checkout, orders, PIN validation,
authentication, or any other stable functionality.

## 1. Product image `object-fit:contain` — confirmed, point by point

- **Entire product image always visible, nothing cropped:** yes — that
  is the specific difference between `contain` (fits the whole image
  inside the box, no cropping) and the old `cover` (fills the box,
  crops whatever doesn't fit). This was the point of the change.
- **Container stays the same size for all products:** yes, unchanged
  from before — `.cardMediaFrame{aspect-ratio:1/1}` /
  `.comboImage{aspect-ratio:16/10}` /
  `.productGallery .galleryMain{aspect-ratio:1/1}` reserve fixed boxes
  regardless of the photo's own dimensions. This was already true
  before this round and remains true.
- **Different aspect ratios don't move card height/layout:** yes, same
  reason — the box size is driven by CSS `aspect-ratio`, never by the
  image.
- **Empty space from `contain` is intentional:** yes — for any photo
  that isn't exactly the frame's ratio (e.g. `pudi/front.webp` at
  1.5:1 in a 1:1 box), `contain` letterboxes the shorter axis against
  the frame's existing `var(--surface-2)` background rather than
  cropping. That empty space is the direct, expected trade-off of
  "never crop" — there's no way to guarantee zero cropping AND zero
  letterboxing when source photos have different aspect ratios.
- **Same behavior across products, combos, gallery, thumbnails:**
  confirmed — all four (`cardMediaSlide`, `comboMediaScroller`,
  `galleryMain`, `galleryThumbs`) use `contain`, applied identically.

**On mobile image size:** worth being direct about the trade-off here
rather than just asserting it's fine. For photos already close to the
frame's own ratio (peanut/flaxseed, both ~0.95–0.96), `contain` and
`cover` look almost identical — the photo fills nearly the whole box
either way. For photos further from square (`pudi/front.webp` at
1.5:1), the visible product is now somewhat smaller within the same
frame than `cover` would have shown, because the full image — including
the parts `cover` used to crop off — is now visible. That's the
direct, unavoidable cost of "show the complete image, never crop" on a
fixed-shape frame; it can't be fully avoided without either cropping
again (the original complaint) or changing the frame's aspect ratio
per-photo (which would reintroduce the original card-height variance
this whole fix exists to prevent). This wasn't independently re-tested
against a live mobile screen in this round — worth a visual check on
your end specifically for `pudi` given it has the widest aspect ratio
of the current catalogue.

## 2. Image loading performance — confirmed unchanged

Checked directly against `app.js` source, line by line: `srcset`,
`sizes`, the 400w/800w responsive tiers, `loading="lazy"` on every
non-first slide, `decoding="async"`, and `preload="metadata"` on every
`<video>` are all present, unchanged, in every location (card grid,
combo cards, product gallery + thumbnails, cart drawer, meal
recommendations). This round only changed the CSS `object-fit`
property and one piece of admin-only HTML structure (item 3 below) —
nothing in the responsive-image or lazy-loading code path was touched.

## 3. Homepage announcement cards — now actually responsive, not just stacked

Previous round's fix (unconditional `flex-direction:column`) solved
the mobile overflow but also flattened desktop into the same single
stacked column, even though desktop has the width to spare — a
reasonable point to push back on.

**Real fix this round:**
- `admin.js`: the announcement card's text (label/title/message/action)
  is now wrapped in its own `<div class="announcementInfo">` — the
  same wrapping pattern `reviewAdmin` cards already use elsewhere in
  this file. Previously these were four loose elements directly in the
  row with nothing to constrain their width; now there's a single
  child that can be given `min-width:0;flex:1` so it can actually
  shrink and wrap.
- `admin.css`: mobile default stays `flex-direction:column` (fixes the
  original overflow). At `min-width:900px` — the same breakpoint the
  announcement grid itself already switches to 2 columns at — the
  card switches to a row: `.announcementInfo` takes the remaining
  width and wraps text normally, `.cardActions` sits to the right
  without stretching.
- No overflow at either breakpoint; text wraps naturally in both
  layouts; nothing else about the announcement card (its data, click
  actions, or the Edit flow) changed.

## 4 & 5. Categories / Meal tags — rewritten shorter, and treated as a known, settled item

**Rewritten** `localCatalogWarning()` in `admin.js` per the suggested
wording — short, plain-language, no developer/deployment mechanics in
the Admin-facing text:

> **Local configuration**
> Categories and Meal tags are currently stored locally in this browser
> and are not yet centrally managed through Supabase. Changes made
> here will not automatically appear to other devices or customers.

The removed detail (`EMBEDDED_CONFIG`/`CONFIG_FALLBACK`, copying the
full catalogue JSON, redeploying, when it's safe to clear browser data)
was **not deleted** — it already lives in `DEPLOY.md`'s "PRODUCTION
PROCEDURE" section, which is where deployment mechanics belong rather
than in a normal Admin user's daily UI. The banner still links to that
button/section for anyone who does need to actually publish a change.

**Confirmed, explicitly, per your question 5:** yes, Categories and
Meal tags intentionally remain local for now. This is not an oversight
or a partially-finished migration — re-verified directly against
source again this round (no `categories`/`meal_tags` Supabase table
exists; `saveCategory()`/`saveMealTag()` write to `localStorage` only;
`app.js` never queries Supabase for either). Treating this as a known,
settled architecture item rather than something to keep re-litigating
each release: if a real migration of these two sections to Supabase is
ever wanted, that's its own separate, explicitly-scoped piece of work —
nothing here should be read as already doing it, and nothing in this
patch moves toward it.

## 6. Version bump

`VERSION.txt`, the footer's visible "Website v32.8" → "v32.9", and
every `?v=` cache-busting reference in `index.html`/`admin.html`
(`style.css`, `app.js`, `admin.css`, `admin.js`, `supabase-config.js`)
updated to **32.9**.

## Git files changed
- `admin.js` — `homepagePage()`: announcement card text wrapped in
  `.announcementInfo`; `localCatalogWarning()` shortened per the
  suggested wording
- `admin.css` — `.announcementInfo` added; row layout restored at
  `min-width:900px` (previous round's column-only fix updated to be
  responsive instead of permanent)
- `index.html`, `admin.html` — version bumped to 32.9
- `VERSION.txt` — 32.8 → 32.9
- `CHANGELOG_V32.9.md` (this file, new — kept separate from
  `CHANGELOG_V32.8.md` for a clean, concise record of just this round)

## Verification performed
- [x] Re-confirmed every responsive-image code path (`srcset`, `sizes`,
      400w/800w, lazy loading, `decoding="async"`, video
      `preload="metadata"`) is present and unmodified — checked
      directly against `app.js`, not assumed.
- [x] Re-verified Categories/Meal tags architecture from scratch again
      (no Supabase table, `localStorage`-only writes, storefront never
      queries Supabase for either) before rewriting the banner text.
- [x] `app.js`/`admin.js` re-validated for syntax; `style.css`/
      `admin.css` brace-balance checked; no duplicate/colliding class
      names introduced.
- [ ] **Still needs a real mobile + desktop browser check on your
      side** — this environment has no browser to render/screenshot
      against. Specifically worth checking: the announcement page at
      a genuine ~900px tablet width (the exact breakpoint used) to
      confirm the row layout doesn't feel cramped there, and `pudi`'s
      product card specifically for how much smaller the visible photo
      looks with letterboxing vs. the old cropped version.
- [ ] Full regression list from your message (cart, checkout, combo
      quantity `-1+`, product media navigation, login/customer/admin)
      — unchanged by this patch (no JS logic touched), but not
      independently re-run in this round since nothing in those paths
      was modified.
