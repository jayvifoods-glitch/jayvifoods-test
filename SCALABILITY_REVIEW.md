# Jayvi Foods — Scalability Review (V32.12.1)

Scope, per the request: review the existing architecture for realistic
bottlenecks at "5+ years of data, thousands of orders, growing coupon/
redemption history, growing customer base" and "100+ concurrent users
browsing" — **not** a redesign. This document identifies what's already
fine, what's a real limitation, what was fixed this release, and what
to actually prioritize later, in that order — not everything gets equal
urgency.

---

## Current strengths (don't need to change)

- **Every catalogue read is already narrow and filtered.** Products/
  combos/categories/meal tags are fetched with `.eq('active',true)`/
  `.eq('enabled',true)` at the query level, not fetched-then-filtered
  in JS — the database does the filtering, not the browser.
- **The storefront never downloads order history.** Customers only ever
  see their *own* orders (RLS-scoped), and guest order tracking is a
  single-order lookup by order number + phone, not a list. There is no
  code path where a customer's browser fetches "all orders."
- **Product media already has a real optimization pipeline** — WebP,
  responsive `srcset` (400w/800w/1600w) for Storage-hosted images via
  Supabase's image-transformation endpoint, `loading="lazy"` on every
  product/cart image. This is the single highest-impact thing for
  100 concurrent users on a food e-commerce site (images dominate page
  weight far more than JSON), and it's already handled.
- **The storefront's own Supabase reads are already split into 3
  independent, cached-once-per-load fetches** (catalogue; categories/
  meal tags; settings/announcements/reviews) rather than one giant
  fetch or repeated per-render queries — each populates a plain
  in-memory `CONFIG`/`products`/`categories` object that every
  subsequent render reads from directly, with no re-fetch on every cart
  interaction, wishlist toggle, or overlay open.
- **RLS is doing real work, not decorative** — customers can only read
  their own orders/addresses; `profiles.role` gates every admin action,
  including the password-reset Edge Function. Nothing security-relevant
  was found to be a scalability *or* correctness risk in RLS itself.
- **`place_order()` is a single atomic, server-side transaction** —
  price/coupon/stale-config validation and the actual insert happen in
  one PL/pgSQL function call, not as separate round trips from the
  client that could race under concurrent load. This matters more at
  100 concurrent users than at 1 — a check-then-insert done as two
  separate client-driven steps is exactly where race conditions show up
  under real concurrency, and this architecture already avoids that
  shape entirely.

## Real limitations (this release's fixes)

- **Admin Orders had no server-side filtering at all** — the entire
  order table was fetched, unfiltered, every time the page opened. Fine
  today at low order volume; would become a real problem at "thousands
  of orders." **Fixed this release**: search/filter/sort UI added
  (`admin.js`), plus indexes on the columns it filters/sorts by
  (`status`, `payment_status`, `guest_phone`, `order_number`,
  `created_at`). **Still client-side over the full fetched set** — this
  is the deliberate, scoped-down version of the fix; see "recommended
  future improvements" below for the next step once volume actually
  requires it.
- **No index existed on `orders.status`/`orders.payment_status`/
  `orders.guest_phone`** despite the dashboard and Admin Orders already
  filtering/searching by all three. **Fixed this release** (additive
  indexes in `supabase_migration_v32_12_1.sql`).
- **`coupon_redemptions` had no index on `coupon_id`/`customer_phone`**
  despite `validate_coupon()` running a `count(*) ... where coupon_id =
  ...` and `... where coupon_id = ... and customer_phone = ...` on
  **every single coupon check** — including every keystroke-driven
  "Apply coupon" attempt and the new `revalidateAppliedCoupon()`, which
  now runs on every cart render. This is exactly the kind of small,
  frequently-run query that becomes noticeably slow once
  `coupon_redemptions` has thousands of rows, without an index. **Fixed
  this release.**
- **`products.active`/`combos.active` had no index** despite being the
  first filter on the two highest-traffic reads on the entire site
  (every storefront page load). **Fixed this release.**
- **Announcement/product media stored in a public bucket with no
  automatic cleanup** — confirmed and addressed under item 12 of the
  main changelog (orphaned-file cleanup on delete); not repeated here,
  but it's a real Storage-growth concern over "5+ years of data" and
  worth noting in this document too.

## Recommended future improvements (address later, not urgent yet)

Roughly in the order they'll actually start to matter as the business
grows — not all of these are worth doing today:

1. **Server-side pagination for Admin Orders**, once order volume grows
   past what's comfortable to fetch in one request (a few thousand
   rows is a reasonable point to revisit this). Today's fix (client-
   side filter/sort over one fetch, backed by real indexes) will
   continue to work correctly at that volume, just with a growing
   initial-fetch cost; the natural next step is `.range()`-based
   pagination combined with the same filters as actual `WHERE`/`ORDER
   BY` clauses in the query itself, rather than fetched-then-filtered
   in JS.
2. **`coupon_redemptions`/order-history retention policy.** At "5+
   years of data," these tables will keep growing indefinitely with no
   archival step. Not urgent today (indexes handle the query-speed side
   for a long time), but worth deciding, well before it's needed,
   whether historical redemptions/orders older than some threshold get
   moved to a cheaper archive table/export rather than living in the
   same hot table forever.
3. **Connection/concurrency headroom under Supabase's connection
   pooler** at 100+ truly concurrent users — every current query already
   goes through `supabase-js`, which uses Supabase's pooled REST/
   PostgREST layer, not raw persistent Postgres connections per
   browser tab, so this is a lower-risk item than it might sound; still
   worth a load test against your actual project's plan tier before a
   real high-traffic event (a sale, a viral moment), since PostgREST/
   Edge Function concurrency limits vary by plan.
4. **Storage delivery for very large product videos.** Confirmed
   `preload="metadata"` and no-autoplay are already in place for
   product/combo videos (V32.8) — fine for today's catalogue size. If
   the catalogue grows to many video-heavy products, consider a CDN in
   front of the Storage bucket (Supabase Storage already serves through
   a CDN on paid plans — confirm your plan includes this as video count
   grows, don't assume).
5. **Full-text/trigram search for Admin Orders at real scale.** This
   release adds an optional `pg_trgm` index on `orders.guest_name`
   wrapped so the migration still completes if your plan can't enable
   the extension. Confirm the extension actually enabled successfully
   on your project (see the migration's own verification query) — if
   not, the ILIKE search still works, just linearly, which is fine at
   today's volume but is the first thing to revisit if Admin Orders
   search feels slow later.
6. **Caching read-mostly config on the frontend more aggressively.**
   Store settings/categories/meal tags/active-offers are already
   fetched once per page load rather than per-interaction — a further
   step (not needed yet, flagged for completeness) would be a short
   client-side cache with a TTL (e.g. sessionStorage cache with a
   1–5 minute expiry) to reduce repeat fetches from a customer
   navigating between pages rapidly. Weigh this against the "browser is
   not the source of truth" principle adopted this release (item 6/16)
   before implementing — any such cache must never be consulted for
   checkout-affecting values (vacation mode, delivery config, coupon
   validity, price) or it would silently reintroduce the exact
   stale-state problem this release just fixed for those.

## What was explicitly NOT done, and why

- **No database sharding, read replicas, or queueing system** —
  nothing in the current, real numbers (a single-location food
  business, not yet at 100 concurrent users today) justifies this
  complexity, and the explicit instruction was not to redesign the
  architecture for a hypothetical scale. Revisit only if real traffic
  data says otherwise.
- **No caching layer (Redis, etc.) introduced.** Supabase's own
  PostgREST layer plus the indexes added this release should comfortably
  handle "100+ concurrent users browsing" for a catalogue this size —
  adding a cache layer without a demonstrated need would be exactly the
  "unnecessary complexity" the request asked to avoid.
