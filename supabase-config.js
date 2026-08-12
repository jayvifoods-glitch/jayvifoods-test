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

  RESOLVED (live-tested): 'phone' mode was tried against the real
  project and Supabase rejected it with "Phone signups are disabled"
  (native phone auth needs an SMS provider configured in Supabase even
  when no real SMS is ever sent — the friction flagged earlier turned
  out to be real). Switched to 'email-map', confirmed below.

  'phone'     — Supabase's native phone+password auth. Left in the code
                for reference / in case an SMS provider is added later,
                but not currently usable on this project without one.
  'email-map' — CURRENT MODE. Maps the phone number to a synthetic
                internal email (e.g. 9198xxxxxxx@customers.jayvifoods.internal)
                and uses standard email+password auth underneath. No SMS
                provider involved at all.

  IMPORTANT for 'email-map' to work: in Supabase Dashboard →
  Authentication → Providers → Email, turn OFF "Confirm email" (also
  called "Enable email confirmations" in some dashboard versions).
  These synthetic addresses end in .internal and can never receive a
  real confirmation email — if confirmation is required, the customer
  would be stuck unable to complete sign-in with no way to click a link
  that can never arrive. With confirmation off, signUp() returns a
  session immediately and the customer never sees or knows an email was
  involved at all.
*/
const AUTH_MODE = 'email-map'; // 'phone' | 'email-map'
const EMAIL_MAP_DOMAIN = 'customers.jayvifoods.internal';

// Base URL for calling Edge Functions (admin-reset-password, etc).
// Standard Supabase pattern: <project-url>/functions/v1/<function-name>
const EDGE_FUNCTIONS_URL = SUPABASE_URL.replace('.supabase.co', '.supabase.co/functions/v1');
