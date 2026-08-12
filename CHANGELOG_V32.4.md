# Jayvi Foods v32.4 — Login fix (mobile number OR email)

Single targeted fix, no other V32.3 functionality touched. Only
`app.js` changed.

## Bug

After merging Customer and Admin login into one page (V32.3, item J),
the shared identifier field had `pattern="[0-9]{10}"` — a browser-level
HTML5 validation rule that physically blocked typing an email address
into the field at all. Even had that not existed, the JS logic
unconditionally treated whatever was typed as a phone number and ran it
through the phone→synthetic-email mapping, which would have mangled a
real email address (e.g. `jayvifoods@gmail.com`) into something like
`jayvifoods@gmail.com@customers.jayvifoods.internal` — not a real
account. Both issues together fully blocked Admin from logging in via
the merged page.

## Fix

- **`authView('login')`** now renders a plain text field (no numeric
  pattern) labeled "Mobile number or email," and no longer shares that
  markup with the registration form — registration is unchanged and
  stays phone-only, since customers still register by phone.
- **`loginSubmit()`** now checks whether the typed identifier contains
  `@`. If so, it signs in with that email directly (no phone mapping
  applied) — this is the path Admin's real email account uses. If not,
  it validates as a 10-digit number and follows the exact same
  phone-login logic as before (unchanged for customers).
- **Redirect to Admin Dashboard is now unconditional** on
  `profiles.role === 'admin'` after a successful login, rather than
  only firing when the visit arrived via `?returnTo=admin`. Visiting
  `/admin.html` directly without a session still redirects to this
  same login page as before — that part of the V32.3 flow is
  unchanged.

## Why a customer can't gain Admin access by typing an email

This is enforced by the database, not by this login logic:
- Authentication itself requires the correct password for a real,
  already-provisioned Supabase Auth account — typing an arbitrary
  email with no matching password simply fails, same as any wrong
  password attempt.
- `profiles.role` is read fresh from Supabase for the authenticated
  user's own id after login succeeds — never inferred from which
  format was typed.
- A customer's own profile row cannot say `role = 'admin'` unless an
  actual admin set it that way — self-escalation is blocked by the
  `prevent_privilege_escalation` trigger from the Phase 1 schema
  (unchanged, not touched by this fix).
- Every real Admin data query in `admin.js` is separately gated by RLS
  policies checking `public.is_admin()` at the database level,
  regardless of this redirect — so even a hypothetical bypass of the
  frontend redirect would still see empty/forbidden results from
  Supabase directly.

## What I verified vs. what still needs your test

I traced both the customer-phone and admin-email code paths line by
line against the corrected code, and confirmed: JS syntax is valid,
HTML tags balance, no reference to `admin-login.html` exists anywhere
except explanatory comments, and version strings are consistent. I
have no way to launch a live browser session against your Supabase
project from here, so this is a careful static trace, not the same
claim as "ran it and watched it work." Please verify directly:

1. Customer login with an existing phone number + password → signs in
   normally, lands on the account view (unchanged from before this
   fix).
2. Admin login with `jayvifoods@gmail.com` + password → signs in, and
   is taken straight to `/admin.html` automatically.
3. Try Admin's email with a wrong password → get the standard
   "incorrect" message with the Forgot Password link, no access.
4. Confirm `/admin.html` visited directly with no session still lands
   back on this same login page (no separate admin-login page exists).
