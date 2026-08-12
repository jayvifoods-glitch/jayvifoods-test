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

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const authHeader = req.headers.get('Authorization') || '';
  const callerToken = authHeader.replace('Bearer ', '');
  if (!callerToken) return new Response('Missing Authorization header', { status: 401 });

  // Verify the CALLER (using their own token, not service_role) is a
  // real, currently-valid session, then check their admin flag with
  // the service-role client. Two separate checks — a valid session
  // alone is not enough; profiles.role must say 'admin'.
  const callerClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: callerUser, error: callerErr } = await callerClient.auth.getUser(callerToken);
  if (callerErr || !callerUser?.user) return new Response('Invalid session', { status: 401 });

  const { data: profile } = await callerClient.from('profiles').select('role').eq('id', callerUser.user.id).single();
  if (profile?.role !== 'admin') return new Response('Not authorized — admin role required', { status: 403 });

  const { phone, newPassword } = await req.json();
  if (!phone || !/^\d{10}$/.test(phone)) return new Response('Valid 10-digit phone required', { status: 400 });
  if (!newPassword || newPassword.length < 6) return new Response('New password must be at least 6 characters', { status: 400 });

  // Find the target customer's profile by phone, then their auth user.
  const { data: targetProfile, error: targetErr } = await callerClient.from('profiles').select('id').eq('phone', phone).single();
  if (targetErr || !targetProfile) return new Response('No customer found with that phone number', { status: 404 });

  const { error: updateErr } = await callerClient.auth.admin.updateUserById(targetProfile.id, { password: newPassword });
  if (updateErr) return new Response('Could not reset password: ' + updateErr.message, { status: 500 });

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
