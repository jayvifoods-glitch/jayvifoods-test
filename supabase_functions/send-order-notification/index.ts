// Jayvi Foods — Edge Function: send-order-notification
//
// Triggered by a Supabase Database Webhook on INSERT into
// public.notification_events (set this up in the Dashboard, see
// DEPLOY.md — "Deploying the Edge Functions"). Sends an event-specific
// email to the configured Jayvi Foods business address via Resend.
//
// Deploy with: supabase functions deploy send-order-notification
//
// Required secrets (set via `supabase secrets set` or Dashboard →
// Edge Functions → Secrets — NEVER put these in frontend code or Git):
//   RESEND_API_KEY            — from resend.com (free tier available)
//   ADMIN_NOTIFICATION_EMAIL  — e.g. jayvifoods@gmail.com (item K4:
//                               configurable here, not hardcoded in
//                               any .js file; changing it later means
//                               updating this one secret, no redeploy
//                               of the website needed)
//   WEBHOOK_SHARED_SECRET     — any random string you choose; must
//                               match the header configured on the
//                               Database Webhook (see DEPLOY.md)
//
// Supabase automatically provides SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY to every Edge Function's environment —
// you do not set those yourself, and they are never exposed to the
// browser. This is the one place in the whole project the service
// role key is meant to exist.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const ADMIN_EMAIL = Deno.env.get('ADMIN_NOTIFICATION_EMAIL')!;
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SHARED_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// One template per event type (K3 — never one generic message for
// every event). money() renders paise-free INR the same way the
// storefront does.
function money(n: number | null | undefined) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

function template(eventType: string, orderNumber: string, payload: any) {
  const name = payload.customer_name || 'Customer';
  const phone = payload.customer_phone || '';
  const total = money(payload.total);
  const templates: Record<string, {subject: string; body: string}> = {
    new_order: {
      subject: `New Jayvi Foods Order – ${orderNumber}`,
      body: `New order received\n\nOrder: ${orderNumber}\nAmount: ${total}\nCustomer: ${name} (${phone})\nPayment method: ${payload.payment_method || ''}\nStatus: ${payload.status || ''}\n\nOpen in Admin to review.`
    },
    payment_verification: {
      subject: `Payment verification needed – ${orderNumber}`,
      body: `Order ${orderNumber} (${total}) has a payment proof awaiting verification.\nCustomer: ${name} (${phone})\n\nOpen in Admin to verify.`
    },
    payment_failed: {
      subject: `Payment failed – ${orderNumber}`,
      body: `Payment for order ${orderNumber} (${total}) failed or was not completed.\nCustomer: ${name} (${phone})`
    },
    order_confirmed: {
      subject: `Order confirmed – ${orderNumber}`,
      body: `Order ${orderNumber} (${total}) is confirmed.\nCustomer: ${name} (${phone})`
    },
    preparing: {
      subject: `Order in preparation – ${orderNumber}`,
      body: `Order ${orderNumber} is now marked Preparing.`
    },
    packed_shipped: {
      subject: `Order packed & shipped – ${orderNumber}`,
      body: `Order ${orderNumber} has been packed and shipped.\nDelivery partner: ${payload.delivery_partner || 'not set'}\nTracking number: ${payload.tracking_number || 'not set'}`
    },
    out_for_delivery: {
      subject: `Order out for delivery – ${orderNumber}`,
      body: `Order ${orderNumber} is out for delivery.`
    },
    delivered: {
      subject: `Order delivered – ${orderNumber}`,
      body: `Order ${orderNumber} has been marked delivered.`
    },
    cancelled: {
      subject: `Order cancelled – ${orderNumber}`,
      body: `Order ${orderNumber} (${total}) has been cancelled.\nCustomer: ${name} (${phone})`
    },
    refund_pending: {
      subject: `Refund pending – ${orderNumber}`,
      body: `A refund has been initiated for order ${orderNumber} (${total}).`
    },
    refunded: {
      subject: `Refund completed – ${orderNumber}`,
      body: `The refund for order ${orderNumber} (${total}) has been completed.`
    },
    delivery_failed: {
      subject: `Delivery failed – ${orderNumber}`,
      body: `Delivery attempt failed for order ${orderNumber}.\nCustomer: ${name} (${phone})`
    },
    manual_review: {
      subject: `Order needs manual review – ${orderNumber}`,
      body: `Order ${orderNumber} has been flagged for manual review/hold.`
    },
  };
  return templates[eventType] || {
    subject: `Jayvi Foods order update – ${orderNumber}`,
    body: `Order ${orderNumber} status event: ${eventType}`
  };
}

Deno.serve(async (req) => {
  if (WEBHOOK_SECRET) {
    const got = req.headers.get('x-webhook-secret');
    if (got !== WEBHOOK_SECRET) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  const body = await req.json();
  const record = body.record; // Supabase Database Webhook payload shape: { type, table, record, ... }
  if (!record) return new Response('No record in payload', { status: 400 });

  const { id, order_number, event_type, payload, email_sent } = record;
  if (email_sent) {
    return new Response('Already sent, skipping', { status: 200 }); // extra guard alongside the DB-level unique constraint (K5)
  }

  const { subject, body: emailBody } = template(event_type, order_number || '', payload || {});

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Jayvi Foods <notifications@yourdomain.example>', // see DEPLOY.md — must be a domain verified in Resend
        to: ADMIN_EMAIL,
        subject,
        text: emailBody,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      await admin.from('notification_events').update({ email_error: errText }).eq('id', id);
      return new Response('Resend API error: ' + errText, { status: 502 });
    }
    await admin.from('notification_events').update({ email_sent: true, email_error: null }).eq('id', id);
    return new Response('Sent', { status: 200 });
  } catch (e) {
    await admin.from('notification_events').update({ email_error: String(e) }).eq('id', id);
    return new Response('Error: ' + String(e), { status: 500 });
  }
});
