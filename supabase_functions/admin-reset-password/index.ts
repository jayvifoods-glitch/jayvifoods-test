// Jayvi Foods — Edge Function: admin-reset-password
//
// Why this has to be an Edge Function, not frontend code: changing
// ANOTHER user's password requires Supabase's Admin API
// (auth.admin.updateUserById), which only works with the service_role
// key. That key must never reach the browser — this function is the
// one safe place it can be used, because it runs on Supabase's server,
// authenticates the CALLER itself, and verifies that caller is an
// admin before doing anything privileged.
//
// Deploy with: supabase functions deploy admin-reset-password
//
// No new secrets needed beyond what Supabase auto-provides
// (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) — this function only
// touches Auth, not email.
//
// Called from admin.js like:
//   const { data: session } = await sb.auth.getSession();
//   await fetch(EDGE_FUNCTION_URL + '/admin-reset-password', {
//     method: 'POST',
//     headers: {
//       'Authorization': 'Bearer ' + session.session.access_token,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ phone: '9198xxxxxxx', newPassword: '...' })
//   });
//
// ---------------------------------------------------------------------
// V32.12.1 fix (this file): live testing against the real Supabase
// project confirmed CORS/auth/session are all fine —
//   CORS OPTIONS -> 200, fresh admin login -> auth.getUser() succeeds,
//   the caller's own profiles row genuinely has role = admin —
// yet the function still returned "403 Not authorized — admin role
// required". The cause was in the profile lookup, not the caller's
// session or their actual role:
//
//   const { data: profile } = await callerClient.from('profiles')
//     .select('role').eq('id', callerUser.user.id).single();
//   if (profile?.role !== 'admin') return ...403...
//
// `.single()` throws/returns an error (and a null `data`) if the query
// doesn't return EXACTLY one row for any reason — and that error was
// silently discarded (`const { data: profile }` never looked at
// `error`). So *any* transient reason the row didn't come back as a
// single clean match (RLS edge case, a stray duplicate id, a timing
// hiccup right after login, etc.) collapsed into `profile === null` ->
// `profile?.role !== 'admin'` -> the exact same generic 403, with zero
// diagnostic trail — indistinguishable from a genuine non-admin.
//
// Fixed by: capturing and logging the query's own error instead of
// discarding it; switching to `.maybeSingle()` (returns `null` cleanly
// when no row matches, instead of throwing, so a real "no row" case
// and a real query error are no longer conflated); looking the profile
// up by the EXACT id `auth.getUser(callerToken)` just returned (this
// was already correct, kept as-is); and adding safe, secret-free
// diagnostic logging at each decision point so a future failure is
// visible in `supabase functions logs admin-reset-password` instead of
// being another silent 403. The admin-role check itself is UNCHANGED
// and NOT weakened — this only makes the path to that check (and any
// failure inside it) observable and robust.
// ---------------------------------------------------------------------
//
// V32.5 fix (Priority 1, item 3): this was the earlier cause of a
// reported "Failed to fetch". admin.js calls this function from the
// browser with a custom Authorization header and Content-Type:
// application/json — that combination makes the browser send a CORS
// preflight (OPTIONS) request before the real POST. This function
// never answered OPTIONS and never sent an Access-Control-Allow-Origin
// header on any response, so the browser blocked the request entirely
// and fetch() threw a network-level TypeError ("Failed to fetch")
// before the POST ever reached this code. Fixed then, unchanged now.
//
// This does NOT remove the separate deployment dependency: this fix
// only matters once the function is actually deployed
// (`supabase functions deploy admin-reset-password`). If it has not
// been deployed yet, the request will still fail the same way, because
// there is no function at that URL to answer it at all.
// ---------------------------------------------------------------------

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// Matches app.js's EMAIL_MAP_DOMAIN — if that constant ever changes,
// update this to match, or password reset will look up the wrong
// synthetic email.
const EMAIL_MAP_DOMAIN = 'customers.jayvifoods.internal';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function corsResponse(body: string, init: ResponseInit = {}) {
  return new Response(body, { ...init, headers: { ...CORS_HEADERS, ...(init.headers || {}) } });
}

// Safe diagnostic logger — NEVER pass tokens/keys/passwords/secrets
// into this. Every call site below only logs: a user id (not a
// secret — it's a public-ish UUID, already visible to the admin
// themselves in Supabase Dashboard), a boolean success/failure, and a
// role string ('admin' | 'customer' | null). Nothing else.
function logDiag(event: string, fields: Record<string, unknown> = {}) {
  console.log(JSON.stringify({ fn: 'admin-reset-password', event, ...fields }));
}

Deno.serve(async (req) => {
  // Preflight — must be answered with the CORS headers above, or the
  // browser never sends the actual POST at all.
  if (req.method === 'OPTIONS') return corsResponse('ok', { status: 200 });
  if (req.method !== 'POST') return corsResponse('Method not allowed', { status: 405 });

  const authHeader = req.headers.get('Authorization') || '';
  const callerToken = authHeader.replace('Bearer ', '');
  if (!callerToken) {
    logDiag('missing_auth_header');
    return corsResponse('Missing Authorization header', { status: 401 });
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    // Never happens in a correctly configured Supabase project (both
    // env vars are auto-provisioned), but if it ever did, fail loudly
    // in the logs rather than crash with an unhelpful stack trace.
    logDiag('missing_env', { hasUrl: !!SUPABASE_URL, hasServiceKey: !!SERVICE_ROLE_KEY });
    return corsResponse('Server misconfiguration', { status: 500 });
  }
  // Server-side client, initialized with the service-role key — this
  // is required for both auth.getUser(token) on an arbitrary caller
  // token and for auth.admin.updateUserById() later. Kept as a single
  // client for both, same as before; only the diagnostics and the
  // profile-lookup robustness below have changed.
  const callerClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Verify the CALLER (using their own token, not service_role) is a
  // real, currently-valid session.
  const { data: callerUser, error: callerErr } = await callerClient.auth.getUser(callerToken);
  if (callerErr || !callerUser?.user) {
    logDiag('caller_session_invalid', { error: callerErr?.message || 'no user on token' });
    return corsResponse('Invalid session', { status: 401 });
  }
  const callerId = callerUser.user.id;
  logDiag('caller_verified', { callerId });

  // V32.12.1 fix: capture the profiles-query error instead of
  // discarding it, and use .maybeSingle() so "no matching row" (a
  // clean null) is never confused with a thrown query error — both
  // are now logged distinctly, and only a genuine, successfully
  // fetched role of 'admin' is ever allowed through.
  const { data: profile, error: profileErr } = await callerClient
    .from('profiles')
    .select('role')
    .eq('id', callerId) // exact id returned by auth.getUser(callerToken) above — never re-derived any other way
    .maybeSingle();

  if (profileErr) {
    logDiag('profile_query_failed', { callerId, error: profileErr.message });
    return corsResponse('Could not verify admin access. Please try again.', { status: 500 });
  }
  logDiag('profile_query_ok', { callerId, role: profile?.role ?? null });

  if (!profile || profile.role !== 'admin') {
    logDiag('not_admin', { callerId, role: profile?.role ?? null });
    return corsResponse('Not authorized — admin role required', { status: 403 });
  }

  let phone: string | undefined, newPassword: string | undefined;
  try {
    const body = await req.json();
    phone = body.phone; newPassword = body.newPassword;
  } catch {
    return corsResponse('Request body must be valid JSON', { status: 400 });
  }
  if (!phone || !/^\d{10}$/.test(phone)) return corsResponse('Valid 10-digit phone required', { status: 400 });
  if (!newPassword || newPassword.length < 6) return corsResponse('New password must be at least 6 characters', { status: 400 });

  // Find the target customer's profile by phone, then their auth user.
  const { data: targetProfile, error: targetErr } = await callerClient
    .from('profiles')
    .select('id')
    .eq('phone', phone)
    .maybeSingle();
  if (targetErr) {
    logDiag('target_lookup_failed', { error: targetErr.message });
    return corsResponse('Could not look up that customer. Please try again.', { status: 500 });
  }
  if (!targetProfile) {
    logDiag('target_not_found');
    return corsResponse('No customer found with that phone number', { status: 404 });
  }

  const { error: updateErr } = await callerClient.auth.admin.updateUserById(targetProfile.id, { password: newPassword });
  if (updateErr) {
    logDiag('update_failed', { targetId: targetProfile.id, error: updateErr.message });
    return corsResponse('Could not reset password: ' + updateErr.message, { status: 500 });
  }

  logDiag('password_reset_ok', { targetId: targetProfile.id });
  return corsResponse(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
