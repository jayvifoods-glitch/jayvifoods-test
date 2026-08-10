/* =========================================================
   Jayvi Foods — Supabase connection config
   Fill in the two values below before deploying. Both are safe to
   commit to Git — the anon key is meant to be public; it only grants
   whatever the RLS policies in supabase_schema_phase1_v3.sql allow.
   NEVER put the service_role key in this file or anywhere in Git.
   ========================================================= */

const SUPABASE_URL = 'https://jyrxwbnufygayrqbgfjt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Ywh8mxQHi7-LpUu7bkdisQ_GmVFlVTO';

/*
  AUTH_MODE — how customer phone+password login is implemented under
  the hood. The customer-facing UI is identical either way (they only
  ever see "mobile number" + "password") — this only changes what
  happens inside Supabase.

  'phone'     — uses Supabase's native phone+password auth
                (auth.users.phone). Simplest if your project's phone
                auth works without extra setup.
  'email-map' — maps the phone number to a synthetic internal email
                (e.g. 9198xxxxxxx@customers.jayvifoods.internal) and
                uses standard email+password auth underneath. Use this
                if 'phone' mode gives you an error mentioning an SMS
                provider (Supabase's phone auth provider requires one
                to be configured even when you don't intend to send
                real SMS — this has been a recurring point of friction
                in Supabase's phone-auth flow).

  Try 'phone' first. If registration fails with an SMS/provider error,
  switch this one line to 'email-map' and re-deploy — no other code
  changes needed, both paths are already implemented in app.js.
*/
const AUTH_MODE = 'phone'; // 'phone' | 'email-map'
const EMAIL_MAP_DOMAIN = 'customers.jayvifoods.internal';
