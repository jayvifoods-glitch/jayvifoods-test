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

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// Matches app.js's EMAIL_MAP_DOMAIN — if that constant ever changes,
// update this to match, or password reset will look up the wrong
// synthetic email.
const EMAIL_MAP_DOMAIN = 'customers.jayvifoods.internal';

// ---------------------------------------------------------------------
// V32.5 fix (Priority 1, item 3): this is the actual cause of the
// reported "Failed to fetch". admin.js calls this function from the
// browser with a custom Authorization header and Content-Type: application/
// json — that combination makes the browser send a CORS preflight
// (OPTIONS) request before the real POST. This function never answered
// OPTIONS and never sent an Access-Control-Allow-Origin header on any
// response, so the browser blocked the request entirely and fetch()
// threw a network-level TypeError ("Failed to fetch") before the POST
// ever reached this code — Admin never even got as far as a real
// success/failure response.
//
// This does NOT remove the separate deployment dependency: this fix
// only matters once the function is actually deployed
// (`supabase functions deploy admin-reset-password`). If it has not
// been deployed yet, the request will still fail the same way, because
// there is no function at that URL to answer it at all.
// ---------------------------------------------------------------------
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
function corsResponse(body: string, init: ResponseInit = {}) {
  return new Response(body, { ...init, headers: { ...CORS_HEADERS, ...(init.headers || {}) } });
}

Deno.serve(async (req) => {
  // Preflight — must be answered with the CORS headers above, or the
  // browser never sends the actual POST at all.
  if (req.method === 'OPTIONS') return corsResponse('ok', { status: 200 });
  if (req.method !== 'POST') return corsResponse('Method not allowed', { status: 405 });

  const authHeader = req.headers.get('Authorization') || '';
  const callerToken = authHeader.replace('Bearer ', '');
  if (!callerToken) return corsResponse('Missing Authorization header', { status: 401 });

  // Verify the CALLER (using their own token, not service_role) is a
  // real, currently-valid session, then check their admin flag with
  // the service-role client. Two separate checks — a valid session
  // alone is not enough; profiles.role must say 'admin'.
  const callerClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: callerUser, error: callerErr } = await callerClient.auth.getUser(callerToken);
  if (callerErr || !callerUser?.user) return corsResponse('Invalid session', { status: 401 });

  const { data: profile } = await callerClient.from('profiles').select('role').eq('id', callerUser.user.id).single();
  if (profile?.role !== 'admin') return corsResponse('Not authorized — admin role required', { status: 403 });

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
  const { data: targetProfile, error: targetErr } = await callerClient.from('profiles').select('id').eq('phone', phone).single();
  if (targetErr || !targetProfile) return corsResponse('No customer found with that phone number', { status: 404 });

  const { error: updateErr } = await callerClient.auth.admin.updateUserById(targetProfile.id, { password: newPassword });
  if (updateErr) return corsResponse('Could not reset password: ' + updateErr.message, { status: 500 });

  return corsResponse(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
