/* =========================================================
   Jayvi Foods — config-lite.js (V32.13)

   help.html and legal.html are static pages that don't load the full
   app.js storefront bundle (they have no cart/catalogue/checkout to
   run) — but two pieces of copy on them ("Orders at or above ₹599
   qualify for free delivery", "The current store estimate is 4–8
   days") were previously typed by hand directly into the HTML. That's
   exactly the hardcoding spec 7/8/10 asked to remove: Admin changing
   the free-delivery threshold or delivery estimate in Store Settings
   had no effect on these two pages, because they never read
   store_settings at all.

   This is intentionally NOT a second copy of app.js's Supabase client
   — no supabase-js SDK needed for one read-only, single-row select.
   It's a plain fetch() against Supabase's auto-generated REST API,
   using the SAME anon key and SAME store_settings row
   (`id = 'default'`) that STORE_FIELD_MAP in app.js maps into
   CONFIG.store.freeShippingThreshold/deliveryMinDays/deliveryMaxDays —
   so a change Admin makes in Store Settings shows up identically here,
   on the storefront, and in Help & Support/Policies & Legal, from one
   single source of truth.

   Usage: include supabase-config.js BEFORE this file (for
   SUPABASE_URL/SUPABASE_ANON_KEY), then mark any element that should
   show the free-delivery threshold or delivery timeline with:
     <span data-cfg="free-delivery-threshold">₹599</span>
     <span data-cfg="delivery-timeline">4–8 days</span>
   The existing text is left in place as a fallback and is only
   replaced once the live value is confirmed — if the fetch fails
   (offline, RLS misconfigured, etc.) the page still shows a reasonable
   last-published value instead of going blank.
   ========================================================= */
(function(){
  function money(n){ return '₹' + Math.round(Number(n)||0); }
  async function loadDeliveryConfig(){
    try{
      const url = SUPABASE_URL.replace(/\/$/,'') + '/rest/v1/store_settings?id=eq.default&select=free_shipping_threshold,delivery_min_days,delivery_max_days';
      const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY } });
      if(!res.ok) throw new Error('store_settings fetch failed: ' + res.status);
      const rows = await res.json();
      const row = Array.isArray(rows) ? rows[0] : null;
      if(!row) return;
      if(row.free_shipping_threshold != null){
        document.querySelectorAll('[data-cfg="free-delivery-threshold"]').forEach(el=>{ el.textContent = money(row.free_shipping_threshold); });
      }
      if(row.delivery_min_days != null && row.delivery_max_days != null){
        document.querySelectorAll('[data-cfg="delivery-timeline"]').forEach(el=>{ el.textContent = `${row.delivery_min_days}–${row.delivery_max_days} days`; });
      }
    }catch(err){
      // Fail quiet, fail safe: the HTML's existing text stays exactly
      // as it was, which is a real last-published value, not a
      // placeholder — never worse than the previous hardcoded behavior.
      console.warn('Could not load live delivery configuration — showing last-published copy:', err?.message||err);
    }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', loadDeliveryConfig);
  } else {
    loadDeliveryConfig();
  }
})();
