const KEY='jayviStoreV14';
const CONFIG_FALLBACK={
  "store": {
    "name": "Jayvi Foods",
    "tagline": "Purely Traditional. Simply Delicious.",
    "country": "IN",
    "freeShippingThreshold": 599,
    "shippingFlat": 49,
    "deliveryMinDays": 4,
    "deliveryMaxDays": 8,
    "vacationMode": false,
    "vacationMessage": "We are taking a short break. Orders will resume soon.",
    "googleMapsApiKey": "",
    "googleReviewsUrl": "https://www.google.com/search?q=Jayvi+Foods+reviews",
    "whatsapp": "918861981003",
    "instagram": "https://instagram.com/jayvifoods",
    "razorpayKeyId": "",
    "razorpayEnabled": false,
    "upiEnabled": true,
    "codEnabled": false,
    "otpEnabled": false,
    "upiId": "",
    "upiName": "Jayvi Foods",
    "upiQrImage": "",
    "upiMc": "",
    "paymentNote": "Pay by UPI QR. Order moves to processing after payment verification.",
    "refundBusinessDays": 4,
    "announcementSpeed": "normal",
    "homepageReviewCount": 6,
    "deliveryMode": "india",
    "paymentMode": "upi_manual",
    "otpProvider": ""
  },
  "homepage": {
    "heroAutoplay": true,
    "heroSeconds": 5
  },
  "categories": [
    {
      "id": "chutney",
      "name": "Chutney Powders",
      "enabled": true,
      "order": 1
    },
    {
      "id": "pudi",
      "name": "Pudi",
      "enabled": true,
      "order": 2
    },
    {
      "id": "snacks",
      "name": "Snacks",
      "enabled": true,
      "order": 3
    },
    {
      "id": "combos",
      "name": "Combos",
      "enabled": true,
      "order": 4
    }
  ],
  "products": [
    {
      "id": "peanut",
      "sku": "JF-TAR-CLS-PNT",
      "name": "Peanut Chutney",
      "short": "Rich, nutty and comforting.",
      "category": "chutney",
      "active": true,
      "best": true,
      "image": "images/products/peanut/hero.webp",
      "imageClass": "peanut",
      "variants": [
        {
          "id": "peanut-200",
          "label": "200g",
          "weight": "200g",
          "price": 155,
          "mrp": 199,
          "sku": "JF-TAR-CLS-PNT-200",
          "active": true
        },
        {
          "id": "peanut-400",
          "label": "400g",
          "weight": "400g",
          "price": 249,
          "mrp": 299,
          "sku": "JF-TAR-CLS-PNT-400",
          "active": true
        }
      ],
      "mealTags": [
        "idli",
        "dosa",
        "chapati",
        "rice"
      ],
      "rating": 4.8,
      "reviewCount": 18
    },
    {
      "id": "flaxseed",
      "sku": "JF-TAR-CLS-FLX",
      "name": "Flaxseed Chutney",
      "short": "A distinctive traditional flavour.",
      "category": "chutney",
      "active": true,
      "best": true,
      "image": "images/hero/jayvi-products.webp",
      "imageClass": "flaxseed",
      "variants": [
        {
          "id": "flaxseed-200",
          "label": "200g",
          "weight": "200g",
          "price": 155,
          "mrp": 199,
          "sku": "JF-TAR-CLS-FLX-200",
          "active": true
        },
        {
          "id": "flaxseed-400",
          "label": "400g",
          "weight": "400g",
          "price": 249,
          "mrp": 299,
          "sku": "JF-TAR-CLS-FLX-400",
          "active": true
        }
      ],
      "mealTags": [
        "idli",
        "dosa",
        "chapati",
        "rice"
      ],
      "rating": 4.8,
      "reviewCount": 12
    },
    {
      "id": "pudi",
      "sku": "JF-TAR-CLS-IDP",
      "name": "Idli Dosa Pudi",
      "short": "Made for idli, dosa and everyday meals.",
      "category": "pudi",
      "active": true,
      "best": true,
      "image": "images/hero/jayvi-products.webp",
      "imageClass": "pudi",
      "variants": [
        {
          "id": "pudi-200",
          "label": "200g",
          "weight": "200g",
          "price": 155,
          "mrp": 199,
          "sku": "JF-TAR-CLS-IDP-200",
          "active": true
        },
        {
          "id": "pudi-400",
          "label": "400g",
          "weight": "400g",
          "price": 249,
          "mrp": 299,
          "sku": "JF-TAR-CLS-IDP-400",
          "active": true
        }
      ],
      "mealTags": [
        "idli",
        "dosa",
        "chapati",
        "rice"
      ],
      "rating": 4.8,
      "reviewCount": 9
    },
    {
      "id": "puffora",
      "sku": "JF-PUF",
      "name": "Puffora",
      "short": "Crunchy, puffy, made for anytime snacking.",
      "category": "snacks",
      "active": true,
      "best": true,
      "image": "images/hero/jayvi-products.webp",
      "imageClass": "puffora",
      "variants": [
        {
          "id": "puffora-pack",
          "label": "Pack",
          "weight": "Pack",
          "price": 99,
          "mrp": 129,
          "sku": "JF-PUF-200",
          "active": true
        }
      ],
      "mealTags": [],
      "rating": 4.7,
      "reviewCount": 4
    },
    {
      "id": "Jamun",
      "sku": "JF-TAR-CLS-SWT",
      "name": "Jamun",
      "short": "",
      "description": "Test",
      "category": "snacks",
      "categories": [
        "snacks"
      ],
      "mealTags": [
        "vada"
      ],
      "image": "images/products/Jamun/hero.webp",
      "mediaFolder": "images/products/Jamun/",
      "media": [
        {
          "type": "hero",
          "file": "hero.webp",
          "path": "images/products/Jamun/hero.webp"
        },
        {
          "type": "packaging",
          "file": "front-back.webp",
          "path": "images/products/Jamun/front-back.webp"
        },
        {
          "type": "ingredients",
          "file": "ingredients.webp",
          "path": "images/products/Jamun/ingredients.webp"
        },
        {
          "type": "serving",
          "file": "serving.webp",
          "path": "images/products/Jamun/serving.webp"
        }
      ],
      "active": true,
      "best": false,
      "variants": [
        {
          "id": "200g",
          "label": "200g",
          "weight": "200g",
          "sku": "Jamun",
          "price": 199,
          "mrp": 299,
          "active": true
        }
      ],
      "rating": 0,
      "reviewCount": 0
    }
  ],
  "combos": [
    {
      "id": "duo",
      "name": "Traditional Duo",
      "short": "Peanut + Flaxseed. Two everyday favourites.",
      "active": true,
      "price": 289,
      "mrp": 310,
      "image": "images/hero/jayvi-products.webp",
      "items": [
        {
          "productId": "peanut",
          "variantId": "peanut-200",
          "qty": 1
        },
        {
          "productId": "flaxseed",
          "variantId": "flaxseed-200",
          "qty": 1
        }
      ]
    }
  ],
  "announcements": [
    {
      "id": "h1",
      "label": "BESTSELLER",
      "title": "Peanut Chutney",
      "em": "for every meal.",
      "text": "Rich, nutty and comforting — the everyday favourite.",
      "productId": "peanut",
      "actionType": "product",
      "actionTarget": "peanut",
      "active": true,
      "order": 1
    },
    {
      "id": "h2",
      "label": "NEW",
      "title": "Puffora",
      "em": "crunch time.",
      "text": "A crunchy Jayvi snack for anytime munching.",
      "productId": "puffora",
      "actionType": "product",
      "actionTarget": "puffora",
      "active": true,
      "order": 2
    },
    {
      "id": "h3",
      "label": "COMBO",
      "title": "Traditional Duo",
      "em": "one easy choice.",
      "text": "Peanut + Flaxseed together at ₹289.",
      "comboId": "duo",
      "actionType": "combo",
      "actionTarget": "duo",
      "active": true,
      "order": 3
    }
  ],
  "mealTags": [
    {
      "id": "idli",
      "name": "Idli",
      "enabled": true,
      "order": 1
    },
    {
      "id": "dosa",
      "name": "Dosa",
      "enabled": true,
      "order": 2
    },
    {
      "id": "chapati",
      "name": "Chapati",
      "enabled": true,
      "order": 3
    },
    {
      "id": "rice",
      "name": "Rice + Ghee",
      "enabled": true,
      "order": 4
    },
    {
      "id": "roti",
      "name": "Roti",
      "enabled": true,
      "order": 5
    },
    {
      "id": "paratha",
      "name": "Paratha",
      "enabled": true,
      "order": 6
    },
    {
      "id": "poori",
      "name": "Poori",
      "enabled": true,
      "order": 7
    },
    {
      "id": "upma",
      "name": "Upma",
      "enabled": true,
      "order": 8
    },
    {
      "id": "vada",
      "name": "Vada",
      "enabled": true,
      "order": 9
    },
    {
      "id": "curd-rice",
      "name": "Curd Rice",
      "enabled": true,
      "order": 10
    }
  ],
  "reviews": [],
  "mealLabels": {
    "idli": "Idli",
    "dosa": "Dosa",
    "chapati": "Chapati",
    "rice": "Rice + Ghee",
    "roti": "Roti",
    "paratha": "Paratha",
    "poori": "Poori",
    "upma": "Upma",
    "vada": "Vada",
    "curd-rice": "Curd Rice"
  }
};

/* ---------- Supabase admin session ---------- */
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let adminUser = null, adminProfile = null;

async function requireAdminSession(){
  const {data} = await sb.auth.getSession();
  const user = data?.session?.user;
  if(!user){ location.href='index.html?returnTo=admin'; return false; }
  const {data:profile, error} = await sb.from('profiles').select('*').eq('id', user.id).single();
  if(error || profile?.role !== 'admin'){
    await sb.auth.signOut();
    location.href='index.html?returnTo=admin';
    return false;
  }
  adminUser = user; adminProfile = profile;
  return true;
}

let data=loadData(),tab='dashboard';
const app=document.getElementById('app'), title=document.getElementById('title');
const money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
// V32.5 (config-schema parity fix): always route through mergeDefaults(),
// even on a completely fresh browser with no localStorage at all — this
// guarantees mealLabels (and any future derived field) is always computed
// fresh from mealTags, rather than a truly-first-load browser getting a
// raw CONFIG_FALLBACK clone that skipped derivation entirely.
function loadData(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return mergeDefaults(x||{})}catch{return mergeDefaults({})}}
function mergeDefaults(x){const d=structuredClone(CONFIG_FALLBACK);Object.keys(x||{}).forEach(k=>d[k]=x[k]);d.store={...CONFIG_FALLBACK.store,...(x.store||{})};d.homepage={...CONFIG_FALLBACK.homepage,...(x.homepage||{})};d.categories=x.categories||d.categories;d.products=x.products||d.products;d.combos=x.combos||d.combos;d.announcements=x.announcements||d.announcements;d.mealTags=x.mealTags||d.mealTags;d.mealLabels=Object.fromEntries((d.mealTags||[]).map(t=>[t.id,t.name]));d.reviews=x.reviews||d.reviews;return d}
function persist(){localStorage.setItem(KEY,JSON.stringify(data));toast('Settings saved to this browser. This applies to store settings, announcements, and reviews only — Products, Combos, Categories, and Meal tags are all stored centrally in Supabase and update live for every customer immediately.')}
// V32.10: localCatalogWarning() (the "Local configuration" banner
// previously shown on Categories/Meal tags) has been removed — both
// are now Supabase-backed, same as Products/Combos, so the banner's
// premise is no longer true. See liveCatalogNote() below, now also
// used on those two pages. mergeDefaults() above still keeps
// CONFIG_FALLBACK.categories/mealTags as a same-session fallback
// display value only, exactly like it already does for
// CONFIG_FALLBACK.products/combos — the moment fetchCategories()/
// fetchMealTags() run (i.e. the instant either page is opened),
// data.categories/data.mealTags are overwritten with the live
// Supabase rows.
function toast(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2300)}
async function logout(){await sb.auth.signOut();location.href='index.html'}

/* ---------- Orders & customers now come from Supabase, not localStorage ---------- */
async function fetchOrders(){
  const {data:orders, error} = await sb.from('orders').select('*, order_items(*)').order('created_at',{ascending:false});
  if(error){ toast('Could not load orders: '+error.message); return []; }
  return orders||[];
}
async function fetchOrder(orderNumber){
  const {data:orders, error} = await sb.from('orders').select('*, order_items(*)').eq('order_number', orderNumber).single();
  if(error) return null;
  const {data:history} = await sb.from('order_status_history').select('*').eq('order_id', orders.id).order('created_at',{ascending:true});
  orders.history = history||[];
  return orders;
}
async function fetchCustomers(){
  const {data:profiles, error} = await sb.from('profiles').select('*').eq('role','customer').order('created_at',{ascending:false});
  if(error){ toast('Could not load customers: '+error.message); return []; }
  return profiles||[];
}

/* ---------- Product catalogue: Supabase, not localStorage (V32.6) ----------
   Products, product media, and combos are the real source of truth in
   Supabase now (see supabase_migration_product_catalog.sql). data.products
   / data.combos below are just an in-memory cache refreshed every time
   the relevant Admin page is opened, so the rest of admin.js (combo
   item pickers, announcement targets, review product pickers, meal-tag
   deletion guard) keeps working unchanged. Store settings, categories,
   meal tags, announcements, and reviews remain local/unchanged. */
function liveCatalogNote(){
  return `<div class="catalogWarning" style="border-color:#2f7a3d;background:#eefbf0"><b>✅ Live for every customer, on every device</b><p>Products, media, and combos are stored centrally in Supabase now — saving here updates the storefront immediately for everyone, no Git sync or redeploy needed.</p></div>`;
}
async function fetchProductMediaRows(){
  const {data:rows,error}=await sb.from('product_media').select('*').order('display_order',{ascending:true});
  if(error){ toast('Could not load product media: '+error.message); return []; }
  return rows||[];
}
async function fetchProducts(){
  const {data:rows,error}=await sb.from('products').select('*').order('display_order',{ascending:true});
  if(error){ toast('Could not load products: '+error.message); return []; }
  const mediaRows=await fetchProductMediaRows();
  const products=(rows||[]).map(p=>({
    id:p.id, sku:p.sku||'', name:p.name||'', short:p.short_description||'', description:p.description||'',
    category:p.category||'', categories:p.categories||[], mealTags:p.meal_tags||[],
    active:p.active, best:p.best, displayOrder:p.display_order||0,
    variants:p.variants||[], rating:p.rating||0, reviewCount:p.review_count||0,
    media:mediaRows.filter(m=>m.product_id===p.id).map(m=>({id:m.id,type:m.media_type,path:m.media_url,poster:m.poster_url||'',order:m.display_order,isPrimary:!!m.is_primary})),
  }));
  products.forEach(p=>{p.image=(p.media.find(m=>m.isPrimary)||p.media[0])?.path||''});
  data.products=products;
  data._productMediaAllRows=mediaRows; // reused by combosPage for combo media
  return products;
}
async function fetchCombos(){
  const {data:rows,error}=await sb.from('combos').select('*').order('display_order',{ascending:true});
  if(error){ toast('Could not load combos: '+error.message); return []; }
  const mediaRows=data._productMediaAllRows||await fetchProductMediaRows();
  const combos=(rows||[]).map(c=>({
    id:c.id, name:c.name||'', short:c.short_description||'', active:c.active,
    price:c.price, mrp:c.mrp, items:c.items||[],
    media:mediaRows.filter(m=>m.combo_id===c.id).map(m=>({id:m.id,type:m.media_type,path:m.media_url,poster:m.poster_url||'',order:m.display_order,isPrimary:!!m.is_primary})),
  }));
  combos.forEach(c=>{c.image=c.media[0]?.path||''});
  data.combos=combos;
  return combos;
}
// V32.10: Categories and Meal tags now come from Supabase, same
// pattern as products/combos above — fetch-into-data.*, save via
// upsert, delete via a real row delete. This closes the last two
// pieces of the catalogue that were still per-browser localStorage.
async function fetchCategories(){
  const {data:rows,error}=await sb.from('categories').select('*').order('display_order',{ascending:true});
  if(error){ toast('Could not load categories: '+error.message); return []; }
  const categories=(rows||[]).map(c=>({id:c.id, name:c.name||'', enabled:c.enabled, order:c.display_order||0}));
  data.categories=categories;
  return categories;
}
async function saveCategoryToSupabase(c){
  const {error}=await sb.from('categories').upsert({id:c.id, name:c.name, enabled:c.enabled, display_order:c.order});
  if(error){ toast('Could not save category: '+error.message); return false; }
  return true;
}
async function fetchMealTags(){
  const {data:rows,error}=await sb.from('meal_tags').select('*').order('display_order',{ascending:true});
  if(error){ toast('Could not load meal tags: '+error.message); return []; }
  const mealTags=(rows||[]).map(t=>({id:t.id, name:t.name||'', enabled:t.enabled, order:t.display_order||0}));
  data.mealTags=mealTags;
  data.mealLabels=Object.fromEntries(mealTags.map(x=>[x.id,x.name]));
  return mealTags;
}
async function saveMealTagToSupabase(t){
  const {error}=await sb.from('meal_tags').upsert({id:t.id, name:t.name, enabled:t.enabled, display_order:t.order});
  if(error){ toast('Could not save meal tag: '+error.message); return false; }
  return true;
}
async function deleteMealTagFromSupabase(id){
  const {error}=await sb.from('meal_tags').delete().eq('id',id);
  if(error){ toast('Could not delete meal tag: '+error.message); return false; }
  return true;
}
// V32.11: Store settings, Announcements, and curated ("Google")
// Reviews now come from Supabase too — the last three pieces of
// business data that were still local. Same fetch-into-data.*/
// upsert/delete pattern as everything else above.
const STORE_FIELD_MAP = {
  name:'name', tagline:'tagline', country:'country',
  freeShippingThreshold:'free_shipping_threshold', shippingFlat:'shipping_flat',
  deliveryMinDays:'delivery_min_days', deliveryMaxDays:'delivery_max_days',
  vacationMode:'vacation_mode', vacationMessage:'vacation_message',
  googleMapsApiKey:'google_maps_api_key', googleReviewsUrl:'google_reviews_url',
  whatsapp:'whatsapp', instagram:'instagram',
  razorpayKeyId:'razorpay_key_id', razorpayEnabled:'razorpay_enabled',
  upiEnabled:'upi_enabled', codEnabled:'cod_enabled', otpEnabled:'otp_enabled',
  upiId:'upi_id', upiName:'upi_name', upiQrImage:'upi_qr_image', upiMc:'upi_mc',
  paymentNote:'payment_note', refundBusinessDays:'refund_business_days',
  announcementSpeed:'announcement_speed', homepageReviewCount:'homepage_review_count',
  deliveryMode:'delivery_mode', paymentMode:'payment_mode', otpProvider:'otp_provider'
};
async function fetchStoreSettings(){
  const {data:row,error}=await sb.from('store_settings').select('*').eq('id','default').single();
  if(error){ toast('Could not load store settings: '+error.message); return; }
  if(!row) return;
  const store={};
  Object.entries(STORE_FIELD_MAP).forEach(([jsKey,dbKey])=>{ store[jsKey]=row[dbKey]; });
  data.store=store;
  data.homepage={heroAutoplay:row.hero_autoplay, heroSeconds:row.hero_seconds};
}
// Writes the CURRENT full data.store/data.homepage object back to the
// single settings row — every one of the 5 settings save functions
// below calls this after mutating its own subset of fields on the same
// shared in-memory object, so nothing else already saved is clobbered.
async function saveStoreSettingsToSupabase(){
  const row={id:'default', hero_autoplay:!!data.homepage.heroAutoplay, hero_seconds:Number(data.homepage.heroSeconds)||5};
  Object.entries(STORE_FIELD_MAP).forEach(([jsKey,dbKey])=>{ row[dbKey]=data.store[jsKey]; });
  const {error}=await sb.from('store_settings').upsert(row);
  if(error){ toast('Could not save settings: '+error.message); return false; }
  return true;
}
async function fetchAnnouncements(){
  const {data:rows,error}=await sb.from('announcements').select('*').order('display_order',{ascending:true});
  if(error){ toast('Could not load announcements: '+error.message); return []; }
  const announcements=(rows||[]).map(a=>({
    id:a.id, label:a.label||'', title:a.title||'', em:a.em||'', text:a.text||'',
    image:a.image||'', mediaType:a.media_type||'image', posterUrl:a.poster_url||'',
    showPrice:a.show_price,
    // V32.3 (spec 3): announcementType/targetType are the explicit
    // "does this announcement belong to a product?" relationship —
    // separate from actionType/actionTarget below, which is only the
    // CLICK destination for a *general* announcement's optional CTA.
    announcementType:a.announcement_type||(a.product_id?'product':a.combo_id?'product':'general'),
    targetType:a.target_type||(a.product_id?'product':a.combo_id?'combo':''),
    actionType:a.action_type||'product', actionTarget:a.action_target||'',
    productId:a.product_id||'', comboId:a.combo_id||'', active:a.active, order:a.display_order||0
  }));
  data.announcements=announcements;
  return announcements;
}
async function saveAnnouncementToSupabase(a){
  const {error}=await sb.from('announcements').upsert({
    id:a.id, label:a.label, title:a.title, em:a.em, text:a.text, image:a.image||'',
    media_type:a.mediaType||'image', poster_url:a.posterUrl||'',
    show_price:a.showPrice!==false,
    announcement_type:a.announcementType||'general', target_type:a.targetType||null,
    action_type:a.actionType, action_target:a.actionTarget,
    product_id:a.productId||null, combo_id:a.comboId||null, active:a.active, display_order:a.order
  });
  if(error){ toast('Could not save announcement: '+error.message); return false; }
  return true;
}
// V32.3 (spec 6): safe Storage cleanup for announcement media, same
// "never delete a file another row still references" philosophy as
// cleanupOrphanedMedia() (products/combos) — see there for the full
// rationale. Announcements only ever have ONE media file (image OR
// video, never both) held in image/poster_url, so this checks both
// columns against every OTHER announcement row before removing
// anything from the announcement-media bucket.
const ANNOUNCEMENT_STORAGE_PREFIX = SUPABASE_URL.replace(/\/$/,'') + '/storage/v1/object/public/announcement-media/';
function announcementStoragePathFromUrl(url){
  if(!url || typeof url !== 'string' || !url.startsWith(ANNOUNCEMENT_STORAGE_PREFIX)) return null;
  try{ return decodeURIComponent(url.slice(ANNOUNCEMENT_STORAGE_PREFIX.length)); }catch{ return null; }
}
async function cleanupAnnouncementMedia(urls, keepAnnouncementId){
  const set = new Set((urls||[]).filter(Boolean));
  for(const url of set){
    const path = announcementStoragePathFromUrl(url);
    if(!path) continue; // external URL / legacy path — never touched
    let q = sb.from('announcements').select('id',{count:'exact',head:true}).or(`image.eq.${url},poster_url.eq.${url}`);
    if(keepAnnouncementId) q = q.neq('id', keepAnnouncementId);
    const {count} = await q;
    if(count && count>0) continue; // still referenced by another announcement — leave the file in Storage
    const {error:rmErr} = await sb.storage.from('announcement-media').remove([path]);
    if(rmErr) console.warn('Could not remove orphaned announcement Storage file (left in place, no data was lost):', path, rmErr.message);
  }
}
async function deleteAnnouncement(id){
  const a = data.announcements.find(x=>x.id===id);
  if(!a) return;
  if(!confirm('Delete this announcement?')) return;
  const oldUrls = [a.image, a.posterUrl].filter(Boolean);
  const {error} = await sb.from('announcements').delete().eq('id',id);
  if(error){ toast('Could not delete announcement: '+error.message); return; }
  await cleanupAnnouncementMedia(oldUrls, null);
  toast('Announcement deleted');
  render();
}
async function fetchCuratedReviews(){
  const {data:rows,error}=await sb.from('curated_reviews').select('*').order('display_order',{ascending:true});
  if(error){ toast('Could not load reviews: '+error.message); return []; }
  const reviews=(rows||[]).map(r=>({
    id:r.id, source:r.source||'Google', name:r.name||'', rating:r.rating||5, text:r.text||'',
    productId:r.product_id||'', active:r.active, verifiedPurchase:r.verified_purchase, order:r.display_order||0
  }));
  data.reviews=reviews;
  return reviews;
}
async function saveCuratedReviewToSupabase(r){
  const row={
    source:r.source, name:r.name, rating:r.rating, text:r.text,
    product_id:r.productId||null, active:r.active, verified_purchase:r.verifiedPurchase, display_order:r.order||0
  };
  if(r.id) row.id=r.id;
  const {error}=await sb.from('curated_reviews').upsert(row);
  if(error){ toast('Could not save review: '+error.message); return false; }
  return true;
}
async function deleteCuratedReviewFromSupabase(id){
  const {error}=await sb.from('curated_reviews').delete().eq('id',id);
  if(error){ toast('Could not delete review: '+error.message); return false; }
  return true;
}
// Upserts a product row + fully replaces its product_media rows from
// the given media draft array (simplest safe way to persist reordering
// and deletions without tracking per-row diffs).
async function saveProductToSupabase(p, mediaDraft){
  const {error:pErr}=await sb.from('products').upsert({
    id:p.id, sku:p.sku, name:p.name, short_description:p.short, description:p.description,
    category:p.category, categories:p.categories, meal_tags:p.mealTags,
    active:p.active, best:p.best, variants:p.variants, rating:p.rating||0, review_count:p.reviewCount||0
  });
  if(pErr){ toast('Could not save product: '+pErr.message); return false; }
  const {error:delErr}=await sb.from('product_media').delete().eq('product_id',p.id);
  if(delErr){ toast('Product saved, but could not update media: '+delErr.message); return false; }
  if(mediaDraft.length){
    const hasPrimary = mediaDraft.some(m=>m.primary);
    const {error:insErr}=await sb.from('product_media').insert(mediaDraft.map((m,i)=>({
      product_id:p.id, media_type:m.type, media_url:m.path, poster_url:m.poster||null, display_order:i+1,
      is_primary: hasPrimary ? !!m.primary : i===0 // no explicit primary chosen → first item, matching the display-order convention this always had
    })));
    if(insErr){ toast('Product saved, but could not save media: '+insErr.message); return false; }
  }
  return true;
}
async function saveComboToSupabase(c, mediaDraft){
  const {error:cErr}=await sb.from('combos').upsert({
    id:c.id, name:c.name, short_description:c.short, active:c.active, price:c.price, mrp:c.mrp, items:c.items
  });
  if(cErr){ toast('Could not save combo: '+cErr.message); return false; }
  const {error:delErr}=await sb.from('product_media').delete().eq('combo_id',c.id);
  if(delErr){ toast('Combo saved, but could not update media: '+delErr.message); return false; }
  if(mediaDraft.length){
    const hasPrimary = mediaDraft.some(m=>m.primary);
    const {error:insErr}=await sb.from('product_media').insert(mediaDraft.map((m,i)=>({
      combo_id:c.id, media_type:m.type, media_url:m.path, poster_url:m.poster||null, display_order:i+1,
      is_primary: hasPrimary ? !!m.primary : i===0
    })));
    if(insErr){ toast('Combo saved, but could not save media: '+insErr.message); return false; }
  }
  return true;
}
// Shared "+ Add Media" list editor used by both the product and combo
// forms — no per-product/per-combo special cases (item 7 of the spec).
// No fixed slot count: window._mediaDraft is a plain array, any length.
function mediaRowsMarkup(){
  const list=window._mediaDraft||[];
  const anyPrimary = list.some(m=>m.primary);
  return list.length ? list.map((m,i)=>{
    const isPrimary = anyPrimary ? m.primary : i===0;
    const isStorage = /\/storage\/v1\/object\/public\//.test(m.path||'');
    return `<div class="comboItemForm mediaRow${isPrimary?' isPrimaryRow':''}">
    <select onchange="window._mediaDraft[${i}].type=this.value">
      <option value="image" ${m.type==='image'?'selected':''}>Image</option>
      <option value="video" ${m.type==='video'?'selected':''}>Video</option>
    </select>
    <input value="${esc(m.path)}" placeholder="images/products/.../file.webp or https://..." onchange="window._mediaDraft[${i}].path=this.value">
    ${m.type==='video'?`<input value="${esc(m.poster||'')}" placeholder="poster image URL (optional)" onchange="window._mediaDraft[${i}].poster=this.value" style="max-width:160px">`:''}
    <span class="mediaSourceTag" title="${isStorage?'Stored in Supabase Storage':'Git-repo path or external URL'}">${isStorage?'☁️ Storage':'📁 Git/URL'}</span>
    <button type="button" title="${isPrimary?'This is the primary (product-card) image':'Set as primary'}" class="${isPrimary?'primaryBtn active':'primaryBtn'}" onclick="setPrimaryMediaRow(${i})">${isPrimary?'★ Primary':'☆ Set primary'}</button>
    <button type="button" title="Move up" onclick="moveMediaRow(${i},-1)">↑</button>
    <button type="button" title="Move down" onclick="moveMediaRow(${i},1)">↓</button>
    <button type="button" onclick="window._mediaDraft.splice(${i},1);renderMediaRows()">×</button>
  </div>`}).join('') : '<div class="empty smallEmpty">No media yet — add at least one image.</div>';
}
function mediaEditorMarkup(){
  return `<div class="formSection"><h3>Media</h3><p>Any number of images/videos, in any order. Use <b>+ Add Photo</b>/<b>+ Add Video</b> to upload a real file straight into Supabase Storage (the <code>product-media</code> bucket — recommended, this is the Workstream 3 architecture), or <b>+ Add Media (URL)</b> to reference an existing Git-repo path or external <code>https://</code> URL — both work identically on the storefront and can be mixed freely during migration.</p>
  <div class="mediaUploadRow">
    <label class="outline uploadBtn">📷 + Add Photo<input type="file" accept="image/webp,image/jpeg,image/png,image/avif" style="display:none" onchange="uploadMediaFile(event,'image')"></label>
    <label class="outline uploadBtn">🎬 + Add Video<input type="file" accept="video/mp4,video/webm" style="display:none" onchange="uploadMediaFile(event,'video')"></label>
    <button type="button" class="outline" onclick="addMediaRow()">+ Add Media (URL)</button>
  </div>
  <div id="mediaUploadStatus" class="mediaUploadStatus"></div>
  <div id="mediaRows">${mediaRowsMarkup()}</div>
  </div>`;
}
function renderMediaRows(){const box=document.getElementById('mediaRows');if(box)box.innerHTML=mediaRowsMarkup()}
function addMediaRow(){window._mediaDraft.push({type:'image',path:'',poster:'',primary:false});renderMediaRows()}
function moveMediaRow(i,dir){const list=window._mediaDraft;const j=i+dir;if(j<0||j>=list.length)return;[list[i],list[j]]=[list[j],list[i]];renderMediaRows()}
function setPrimaryMediaRow(i){(window._mediaDraft||[]).forEach((m,j)=>{m.primary=(j===i)});renderMediaRows()}
// Workstream 3.13 — real file upload into Supabase Storage's
// `product-media` bucket (see supabase_migration_product_media_storage.sql),
// instead of Admin having to already have a hosted URL to type in. The
// resulting public URL is inserted as a new media row automatically —
// same downstream shape (`media_url`) as a hand-typed Git path or
// external URL, so nothing else in admin.js/app.js needs to know the
// difference (spec 3.14: "the application should never need to know
// where the image is stored").
async function uploadMediaFile(evt, kind){
  const file = evt.target.files?.[0]; if(!file) return;
  const statusEl = document.getElementById('mediaUploadStatus');
  const typedId = document.getElementById('pId')?.value.trim() || document.getElementById('cId')?.value.trim();
  const owner = (typedId ? (document.getElementById('cId') && !document.getElementById('pId') ? 'combo-'+typedId : typedId) : window._mediaOwnerId) || 'unassigned';
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g,'-').toLowerCase();
  const path = `${owner}/${kind==='video'?'videos/':''}${Date.now()}-${safeName}`;
  if(statusEl) statusEl.textContent = `Uploading ${file.name}…`;
  const {error: upErr} = await sb.storage.from('product-media').upload(path, file, {cacheControl:'31536000', upsert:false});
  if(upErr){
    if(statusEl) statusEl.textContent = '';
    toast('Upload failed: '+upErr.message+' — has supabase_migration_product_media_storage.sql been run, and does this bucket exist yet?');
    evt.target.value='';
    return;
  }
  const {data:pub} = sb.storage.from('product-media').getPublicUrl(path);
  window._mediaDraft.push({type:kind, path:pub.publicUrl, poster:'', primary:false});
  renderMediaRows();
  if(statusEl) statusEl.textContent = `Uploaded ${file.name}.`;
  evt.target.value='';
}

function catName(id){return data.categories.find(c=>c.id===id)?.name||id||'Uncategorised'}
function product(id){return data.products.find(p=>p.id===id)}
function variant(pid,vid){return product(pid)?.variants?.find(v=>v.id===vid)}
function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function setTab(t){tab=t;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));pushAdminHistory(t);render()}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
async function refreshNotifBadge(){
  const {count} = await sb.from('notification_events').select('id',{count:'exact',head:true}).eq('dashboard_read', false);
  const el = document.getElementById('notifCount');
  if(!el) return;
  if(count && count>0){ el.textContent = count>99?'99+':count; el.style.display='grid'; }
  else { el.style.display='none'; }
}
async function openNotifications(){
  const {data, error} = await sb.from('notification_events').select('*').order('created_at',{ascending:false}).limit(30);
  if(error){ toast('Could not load notifications: '+error.message); return; }
  const EVENT_LABELS = {new_order:'New order', payment_verification:'Payment verification needed', payment_failed:'Payment failed', order_confirmed:'Order confirmed', preparing:'Preparing', packed_shipped:'Packed & shipped', out_for_delivery:'Out for delivery', delivered:'Delivered', cancelled:'Cancelled', refund_pending:'Refund pending', refunded:'Refunded', delivery_failed:'Delivery failed', manual_review:'Needs manual review'};
  openModal(`<div class="eyebrow">NOTIFICATIONS</div><h2>Recent activity</h2>
    <div class="orders" style="margin-top:14px">${(data||[]).map(n=>`<button class="order" type="button" style="${n.dashboard_read?'opacity:.55':''}" onclick="closeModal();markNotificationRead('${n.id}');orderView('${esc(n.order_number||'')}')"><b>${esc(EVENT_LABELS[n.event_type]||n.event_type)}</b><span>${new Date(n.created_at).toLocaleString('en-IN')}</span><strong>${esc(n.order_number||'')}</strong><small>${n.dashboard_read?'Read':'Unread'}${n.email_sent?' · Emailed':n.email_error?' · Email failed':''}</small></button>`).join('')||'<div class="empty smallEmpty">No notifications yet.</div>'}</div>
    ${(data||[]).some(n=>!n.dashboard_read)?'<button class="outline full" style="margin-top:12px" onclick="markAllNotificationsRead()">Mark all as read</button>':''}`);
}
async function markNotificationRead(id){
  if(!id) return;
  await sb.rpc('mark_notification_read', {p_id:id});
  refreshNotifBadge();
}
async function markAllNotificationsRead(){
  await sb.from('notification_events').update({dashboard_read:true}).eq('dashboard_read', false);
  closeModal(); refreshNotifBadge(); toast('All notifications marked read');
}

async function render(){title.textContent=tab==='variants'?'Variants & sizes':tab==='mealtags'?'Meal tags':tab==='settings'?'Store settings':tab==='pincodes'?'Delivery / Pincodes':tab[0].toUpperCase()+tab.slice(1);document.getElementById('headerContext').innerHTML=tab==='dashboard'?'<span class="livePill">Connected to Supabase</span>':'';
 refreshNotifBadge();
 app.innerHTML = '<div class="empty">Loading…</div>';
 let h='';
 if(tab==='dashboard')h=await dashboard();
 if(tab==='orders')h=await ordersPage();
 if(tab==='customers')h=await customersPage();
 if(tab==='products')h=await productsPage();
 if(tab==='variants')h=await variantsPage();
 if(tab==='combos')h=await combosPage();
 if(tab==='categories')h=await categoriesPage();
 if(tab==='mealtags')h=await mealTagsPage();
 if(tab==='homepage')h=await homepagePage();
 if(tab==='gallery')h=await galleryPage();
 if(tab==='pincodes')h=await pincodesPage();
 if(tab==='coupons')h=await couponsPage();
 if(tab==='social')h=await socialLinksPage();
 if(tab==='reviews')h=await reviewsPage();
 if(tab==='settings')h=await settingsPage();
 app.innerHTML=h;
}
// V32.6 (item 11): one single, documented definition of "counts as a
// successful sale" — used everywhere revenue/sales/product-sales are
// computed, so KPIs, charts, and lists can never disagree with each
// other. See PRODUCT_MEDIA_MIGRATION.md / CHANGELOG_V32.6.md for the
// full rationale. Payment Pending / Payment Verification are excluded
// because payment isn't confirmed yet; Payment Failed, Cancelled,
// Refund Pending, Refunded, and Returned are excluded because the sale
// did not (or no longer) results in retained revenue.
const REVENUE_ORDER_STATUSES = ['Order Confirmed','Preparing','Packed & Shipped','Out for Delivery','Delivered','Delivery Failed','On Hold / Manual Review'];
const isRevenueOrder = o => REVENUE_ORDER_STATUSES.includes(o.status);
async function dashboard(){
  const os=await fetchOrders(), cs=await fetchCustomers();
  await fetchStoreSettings();
  const today=new Date().toLocaleDateString('en-IN');
  const todayOrders=os.filter(o=>new Date(o.created_at).toLocaleDateString('en-IN')===today);
  const sales=os.filter(isRevenueOrder).reduce((s,o)=>s+Number(o.total||0),0);
  const todaySales=todayOrders.filter(isRevenueOrder).reduce((s,o)=>s+Number(o.total||0),0);
  const refunded=os.filter(o=>['Refund Pending','Refunded'].includes(o.status)).reduce((s,o)=>s+Number(o.total||0),0);
  const pending=os.filter(o=>/pending|received|preparing|packed|shipped|out for/i.test(o.status||'')).length;
  const delivered=os.filter(o=>String(o.status||'').toLowerCase().includes('delivered')).length;
  const top={};os.filter(isRevenueOrder).forEach(o=>(o.order_items||[]).forEach(i=>{const k=i.name||i.combo_id||'Combo';top[k]=(top[k]||0)+Number(i.qty||0)}));
  const topList=Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return `<section class="kpis"><article><small>ORDERS TODAY</small><b>${todayOrders.length}</b><span>${todaySales?money(todaySales):'No sales yet'}</span></article><article><small>TOTAL ORDERS</small><b>${os.length}</b><span>${delivered} delivered</span></article><article><small>SALES</small><b>${money(sales)}</b><span>Confirmed/fulfilled orders only — excludes pending payment, failed, cancelled, and refunded</span></article><article><small>REFUNDED</small><b>${money(refunded)}</b><span>Refund pending + refunded</span></article><article><small>REGISTERED CUSTOMERS</small><b>${cs.length}</b><span>Excludes guests</span></article><article><small>PENDING ORDERS</small><b>${pending}</b><span>Need attention</span></article></section><div class="dashboardGrid"><section class="panel wide"><div class="panelHead"><div><h2>Latest orders</h2><p>Your operational view: customer, amount, payment and current status.</p></div><button class="gold" onclick="setTab('orders')">View all orders →</button></div>${os.length?`<div class="orderTable"><div class="orderHead"><span>Order</span><span>Customer</span><span>Amount</span><span>Payment</span><span>Status</span></div>${os.slice(0,10).map(o=>`<button class="orderLine" onclick="orderView('${esc(o.order_number)}')"><span><b>${esc(o.order_number)}</b><small>${new Date(o.created_at).toLocaleDateString('en-IN')}</small></span><span><b>${esc(o.guest_name||'Guest')}</b><small>${esc(o.guest_phone||'')}</small></span><strong>${money(o.total)}</strong><span>${esc(o.payment_method||'')}</span><span class="statusTag">${esc(o.status||'')}</span></button>`).join('')}</div>`:'<div class="empty">No orders yet.</div>'}</section><section class="panel"><div class="panelHead"><div><h2>Top products</h2><p>Based on live Supabase orders (revenue-counted statuses only).</p></div></div>${topList.length?topList.map(x=>`<div class="metricRow"><span>${esc(x[0])}</span><b>${x[1]} sold</b></div>`).join(''):'<div class="empty smallEmpty">No sales data yet.</div>'}</section><section class="panel"><div class="panelHead"><div><h2>Store operations</h2><p>Quick controls that affect ordering.</p></div><button class="outline" onclick="setTab('settings')">Open settings</button></div><div class="operation"><span>Vacation mode</span><b class="${data.store.vacationMode?'danger':'good'}">${data.store.vacationMode?'ON — ordering paused':'OFF — ordering open'}</b></div><div class="operation"><span>UPI</span><b class="good">${data.store.upiEnabled===false?'OFF':'ON'}</b></div><div class="operation"><span>COD</span><b>${data.store.codEnabled===false?'OFF':'ON'}</b></div><div class="operation"><span>Razorpay</span><b>${data.store.razorpayEnabled?'ON':'OFF'}</b></div><div class="operation"><span>OTP login</span><b>${data.store.otpEnabled?'ON':'OFF — future'}</b></div></section></div>`;
}
// V32.12.1 (spec 11 — "Admin Orders — Search / Filter / Sort").
// Deliberately client-side over the already-fetched fetchOrders()
// result (same data source as before, no new query shape) — order
// volumes here are still small enough that this stays simple and fast;
// SCALABILITY_REVIEW.md flags server-side pagination/filtering as the
// next step once volume grows past what's comfortable to fetch in one
// shot. State lives in a small module-level object so it survives
// between render() calls (e.g. after Refresh) without needing to touch
// every other admin.js render path.
const ordersUi = { status:'', payment:'', from:'', to:'', sort:'newest' };
function applyOrdersUi(rows){
  let out = rows.slice();
  // V32.13 (spec 2): the free-text Search box has been removed —
  // re-rendering the whole Orders list on every keystroke (see the
  // removed oninput handler this used to have) made typing unusable in
  // live testing. Status/Payment/date filtering and Sort are untouched
  // and still work exactly as before (this only fires on a dropdown
  // change or date-picker close, not per-character).
  if(ordersUi.status) out = out.filter(o=>o.status===ordersUi.status);
  if(ordersUi.payment) out = out.filter(o=>o.payment_status===ordersUi.payment);
  if(ordersUi.from) out = out.filter(o=>new Date(o.created_at) >= new Date(ordersUi.from+'T00:00:00'));
  if(ordersUi.to) out = out.filter(o=>new Date(o.created_at) <= new Date(ordersUi.to+'T23:59:59'));
  switch(ordersUi.sort){
    case 'oldest': out.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at)); break;
    case 'highest': out.sort((a,b)=>Number(b.total||0)-Number(a.total||0)); break;
    case 'lowest': out.sort((a,b)=>Number(a.total||0)-Number(b.total||0)); break;
    case 'status': out.sort((a,b)=>String(a.status||'').localeCompare(String(b.status||''))); break;
    default: out.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)); // newest
  }
  return out;
}
function setOrdersFilter(field,val){ ordersUi[field]=val; render(); }
async function ordersPage(){
  const os=await fetchOrders();
  const statuses=[...new Set(os.map(o=>o.status).filter(Boolean))].sort();
  const paymentStatuses=[...new Set(os.map(o=>o.payment_status).filter(Boolean))].sort();
  const filtered = applyOrdersUi(os);
  return `<section class="panel"><div class="panelHead"><div><h2>Orders</h2><p>Guest and registered orders are shown together. Open an order for the full customer, payment and delivery view.</p></div><div class="filterPills"><button class="outline" onclick="render()">Refresh</button></div></div>
  <div class="ordersToolbar">
    <select onchange="setOrdersFilter('status', this.value)"><option value="">All statuses</option>${statuses.map(s=>`<option value="${esc(s)}" ${ordersUi.status===s?'selected':''}>${esc(s)}</option>`).join('')}</select>
    <select onchange="setOrdersFilter('payment', this.value)"><option value="">All payment statuses</option>${paymentStatuses.map(s=>`<option value="${esc(s)}" ${ordersUi.payment===s?'selected':''}>${esc(s)}</option>`).join('')}</select>
    <label class="tiny">From<input type="date" value="${esc(ordersUi.from)}" onchange="setOrdersFilter('from', this.value)"></label>
    <label class="tiny">To<input type="date" value="${esc(ordersUi.to)}" onchange="setOrdersFilter('to', this.value)"></label>
    <select onchange="setOrdersFilter('sort', this.value)">
      <option value="newest" ${ordersUi.sort==='newest'?'selected':''}>Newest first</option>
      <option value="oldest" ${ordersUi.sort==='oldest'?'selected':''}>Oldest first</option>
      <option value="highest" ${ordersUi.sort==='highest'?'selected':''}>Highest order value</option>
      <option value="lowest" ${ordersUi.sort==='lowest'?'selected':''}>Lowest order value</option>
      <option value="status" ${ordersUi.sort==='status'?'selected':''}>Status</option>
    </select>
    ${(ordersUi.status||ordersUi.payment||ordersUi.from||ordersUi.to)?`<button class="outline" onclick="ordersUi.status='';ordersUi.payment='';ordersUi.from='';ordersUi.to='';render()">Clear filters</button>`:''}
  </div>
  <p class="tiny muted">${filtered.length} of ${os.length} order${os.length===1?'':'s'}</p>
  ${filtered.length?`<div class="orderTable fullTable"><div class="orderHead"><span>Order</span><span>Customer</span><span>Amount</span><span>Payment</span><span>Status</span></div>${filtered.map(o=>`<button class="orderLine" onclick="orderView('${esc(o.order_number)}')"><span><b>${esc(o.order_number)}</b><small>${new Date(o.created_at).toLocaleDateString('en-IN')}</small></span><span><b>${esc(o.guest_name||'Guest')}</b><small>${esc(o.guest_phone||'')}</small></span><strong>${money(o.total)}</strong><span>${esc(o.payment_method||'')}</span><span class="statusTag">${esc(o.status||'')}</span></button>`).join('')}</div>`:'<div class="empty">No orders match these filters.</div>'}</section>`;
}
async function orderView(orderNumber){
  const o = await fetchOrder(orderNumber);
  if(!o){ toast('Order not found'); return; }
  await fetchStoreSettings();
  const timeline=(o.history||[]).map(t=>`<div class="timelineItem"><b>${esc(t.status)}</b><small>${new Date(t.created_at).toLocaleString('en-IN')} · ${esc(t.actor||'system')}</small>${t.note?` — ${esc(t.note)}`:''}</div>`).join('');
  // V: only offer statuses the transition table actually allows from
  // this order's current status — never show an option that would be
  // rejected on save. The database trigger enforces this regardless;
  // this is the UI half of "don't allow selection then reject after
  // submission."
  const {data: allowed} = await sb.from('status_transitions').select('to_status').eq('from_status', o.status);
  const nextOptions = (allowed||[]).map(a=>a.to_status);
  const statusOptions = [o.status, ...nextOptions].map(s=>`<option value="${esc(s)}" ${s===o.status?'selected':''}>${esc(s)}${s===o.status?' (current)':''}</option>`).join('');
  openModal(`<div class="eyebrow">ORDER</div><h2>${esc(o.order_number)}</h2><div class="detailColumns"><div><h3>Customer</h3><p><b>${esc(o.guest_name||'Guest')}</b><br>${esc(o.guest_phone||'')}</p><h3>Delivery</h3><p>${esc(o.address_line1||'')}<br>${esc(o.address_city||'')}, ${esc(o.address_state||'')} ${esc(o.address_pincode||'')}</p><h3>Delivery estimate</h3><p>${esc(o.estimated_delivery||'—')}${o.dispatch_date?'<br>Dispatched: '+esc(o.dispatch_date):''}</p></div><div><h3>Payment</h3><p>${esc(o.payment_method||'')}<br>UTR: ${esc(o.utr||'Not provided')}</p><label>Payment status<select id="paymentStatus"><option value="pending" ${o.payment_status==='pending'?'selected':''}>Pending</option><option value="proof_submitted" ${o.payment_status==='proof_submitted'?'selected':''}>Proof submitted / verification</option><option value="verified" ${o.payment_status==='verified'?'selected':''}>Verified</option><option value="failed" ${o.payment_status==='failed'?'selected':''}>Failed</option><option value="refund_pending" ${o.payment_status==='refund_pending'?'selected':''}>Refund pending</option><option value="refunded" ${o.payment_status==='refunded'?'selected':''}>Refunded</option></select></label><h3>Items</h3>${(o.order_items||[]).map(i=>`<div class="miniLine"><span>${esc(i.name)} ${i.variant_label?'· '+esc(i.variant_label):''} × ${i.qty}</span><b>${money(i.line_total)}</b></div>`).join('')}<div class="miniLine total"><span>Total</span><b>${money(o.total)}</b></div></div></div><div class="statusEditor"><label>Order status <small class="v22-admin-help">Only valid next statuses are shown, per the approved transition rules.</small><select id="orderStatus">${statusOptions}</select></label><label>Delivery partner<input id="deliveryPartner" value="${esc(o.delivery_partner||'')}"></label><div class="two"><label>Tracking number<input id="trackingNumber" value="${esc(o.tracking_number||'')}"></label><label>Reference number<input id="referenceNumber" value="${esc(o.reference_number||'')}"></label></div><label>Tracking URL<input id="trackingUrl" value="${esc(o.tracking_url||'')}"></label><label>Dispatch date<input id="dispatchDate" type="date" value="${esc(o.dispatch_date||'')}"></label><button class="gold full" onclick="updateOrder('${esc(o.order_number)}','${o.id}')">Update order</button></div><div class="timeline"><h3>Order timeline</h3>${timeline||'<div class="empty smallEmpty">No timeline yet.</div>'}</div><div class="notificationBox"><b>Customer update</b><p>Message is generated automatically from the current order status. If the customer doesn't have WhatsApp, use Copy Message and send it via SMS/email/phone instead.</p><div class="cardActions"><button class="outline" onclick="manualWhatsApp('${esc(o.guest_phone||'')}','${esc(o.order_number)}','${esc(o.status)}','${esc(o.tracking_number||'')}','${esc(o.estimated_delivery||'')}')">WhatsApp Customer</button><button class="outline" onclick="copyOrderMessage('${esc(o.order_number)}','${esc(o.status)}','${esc(o.tracking_number||'')}','${esc(o.estimated_delivery||'')}')">Copy Message</button></div></div>`);
}
async function updateOrder(orderNumber, orderId){
  const ns=document.getElementById('orderStatus').value;
  const ps=document.getElementById('paymentStatus').value;
  const deliveryPartner=document.getElementById('deliveryPartner').value.trim();
  const trackingNumber=document.getElementById('trackingNumber').value.trim();
  const referenceNumber=document.getElementById('referenceNumber').value.trim();
  const trackingUrl=document.getElementById('trackingUrl').value.trim();
  const dispatchDate=document.getElementById('dispatchDate').value||null;
  const {error} = await sb.from('orders').update({
    status: ns, payment_status: ps,
    delivery_partner: deliveryPartner||null, tracking_number: trackingNumber||null,
    reference_number: referenceNumber||null, tracking_url: trackingUrl||null,
    dispatch_date: dispatchDate
  }).eq('order_number', orderNumber);
  if(error){ toast('Could not update order: '+error.message); return; }
  await sb.from('order_status_history').insert({ order_id: orderId, status: ns, actor: 'admin' });
  closeModal();toast('Order updated');render();
}
const WHATSAPP_STATUS_TEMPLATES = {
  'Order Confirmed': (o)=>`Your Jayvi Foods order ${o.orderNumber} has been confirmed. We have received your order and will start preparing it shortly.`,
  'Preparing': (o)=>`Your Jayvi Foods order ${o.orderNumber} is now being prepared.`,
  'Packed & Shipped': (o)=>`Your Jayvi Foods order ${o.orderNumber} has been packed and shipped. Tracking number: ${o.trackingNumber||'to be shared shortly'}. Expected delivery: ${o.estimatedDelivery||'soon'}.`,
  'Out for Delivery': (o)=>`Your Jayvi Foods order ${o.orderNumber} is out for delivery today.`,
  'Delivered': (o)=>`Your Jayvi Foods order ${o.orderNumber} has been delivered. We hope you enjoy it!`,
  'Cancelled': (o)=>`Your Jayvi Foods order ${o.orderNumber} has been cancelled. If payment was made, your refund will be credited within ${data.store.refundBusinessDays||4} business days.`,
  'Refund Pending': (o)=>`Your refund for Jayvi Foods order ${o.orderNumber} has been initiated and is being processed.`,
  'Refunded': (o)=>`Your refund for Jayvi Foods order ${o.orderNumber} has been completed.`,
  'Payment Failed': (o)=>`Payment for your Jayvi Foods order ${o.orderNumber} was not completed. Please retry the payment to confirm your order.`,
  'Payment Pending': (o)=>`Your Jayvi Foods order ${o.orderNumber} has been received. Please complete payment to confirm it.`,
  'Payment Verification': (o)=>`We've received your payment details for Jayvi Foods order ${o.orderNumber} and are verifying them now.`,
  'Delivery Failed': (o)=>`We were unable to complete delivery of your Jayvi Foods order ${o.orderNumber}. Our team will contact you regarding the next step.`,
  'Returned': (o)=>`Your Jayvi Foods order ${o.orderNumber} has been returned to us. Our team will contact you regarding the next step.`,
  'On Hold / Manual Review': (o)=>`Your Jayvi Foods order ${o.orderNumber} needs a quick manual check on our end. We'll update you shortly.`
};
// V32.5 fix (Priority 4, item 10): pulled the message text out of
// manualWhatsApp() so the exact same standard status-specific template is
// reused by the new Copy Message fallback below — never a second,
// different message for the same status.
function buildStatusMessage(orderNumber,status,trackingNumber,estimatedDelivery){
  const tmpl = WHATSAPP_STATUS_TEMPLATES[status];
  return tmpl ? tmpl({orderNumber,trackingNumber,estimatedDelivery}) : `Jayvi Foods order ${orderNumber}: Your order status has been updated. Please contact us if you need help.`;
}
function manualWhatsApp(phone,orderNumber,status,trackingNumber,estimatedDelivery){
  if(!phone){toast('Customer mobile number is missing');return}
  const msg = buildStatusMessage(orderNumber,status,trackingNumber,estimatedDelivery);
  // Fixed: wa.me requires the full international number — the bare
  // 10-digit customer phone alone (with no country code) was a
  // confirmed bug in the previous version of this function.
  const digits = phone.replace(/\D/g,'');
  const withCountryCode = digits.length===10 ? '91'+digits : digits;
  window.open('https://wa.me/'+withCountryCode+'?text='+encodeURIComponent(msg),'_blank');
}
// V32.5 (Priority 4, item 10): fallback for customers without WhatsApp.
// Deliberately NOT trying to detect whether WhatsApp is installed (per the
// spec) — just a plain, always-available Copy Message button next to
// WhatsApp Customer, reusing the exact same standard template. Admin pastes
// it into SMS/email/a phone call note manually.
// V32.5: shared clipboard helper — extracted so the new "Copy Full
// Catalogue JSON" button below can reuse the exact same
// copy-with-fallback behavior as the existing Copy Message button,
// rather than duplicating it.
async function copyTextToClipboard(text, successToast, failTitle){
  try{
    if(navigator.clipboard?.writeText){
      await navigator.clipboard.writeText(text);
    }else{
      // Older/non-secure-context fallback — hidden textarea + execCommand.
      const ta=document.createElement('textarea');
      ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      document.execCommand('copy'); ta.remove();
    }
    toast(successToast);
  }catch(e){
    // Never fail silently: if copy genuinely can't happen (e.g. clipboard
    // permission blocked), show the text itself so Admin can still copy it
    // by hand rather than hitting a dead end.
    openModal(`<div class="eyebrow">${esc(failTitle)}</div><h2>Copy failed — copy manually</h2><textarea readonly style="width:100%;min-height:300px;font-family:monospace;font-size:11px">${esc(text)}</textarea>`);
  }
}
async function copyOrderMessage(orderNumber,status,trackingNumber,estimatedDelivery){
  const msg = buildStatusMessage(orderNumber,status,trackingNumber,estimatedDelivery);
  await copyTextToClipboard(msg, 'Message copied — paste it into SMS, email, or your messaging app of choice.', 'MESSAGE');
}
// V32.5: "Copy Full Catalogue JSON" — replaces the manual DevTools
// console step (`copy(localStorage.getItem('jayviStoreV14'))`) from
// DEPLOY.md's production procedure with one click. Copies the live
// in-memory `data` object (identical to what persist() just wrote to
// localStorage, since persist() is JSON.stringify(data) into the same
// key) — pretty-printed so it's easy to review before pasting into
// EMBEDDED_CONFIG/CONFIG_FALLBACK. This does NOT change the
// production procedure itself: it's still a manual paste-replace of
// both app.js's EMBEDDED_CONFIG and admin.js's CONFIG_FALLBACK, still
// requires a deploy, and still requires clearing jayviStoreV14
// afterward per DEPLOY.md — this button only removes the DevTools
// step and the risk of a mistyped/partial manual copy.
async function copyFullCatalogueJSON(){
  const json = JSON.stringify(data, null, 2);
  await copyTextToClipboard(
    json,
    'Full catalogue JSON copied. Paste it to replace BOTH EMBEDDED_CONFIG (app.js) and CONFIG_FALLBACK (admin.js) — see DEPLOY.md.',
    'FULL CATALOGUE JSON'
  );
}
window._customerListCache = [];
async function customersPage(){
  const cs=await fetchCustomers(), os=await fetchOrders();
  // Registered customers: from Supabase profiles, order count matched by customer_id.
  const registered = cs.map(c=>({
    type:'Registered', name:c.name||'Customer', phone:c.phone||'',
    orderCount: os.filter(o=>o.customer_id===c.id).length,
    orders: os.filter(o=>o.customer_id===c.id)
  }));
  // Guest customers: no Supabase Auth account exists (and none is created here,
  // by design) — grouped client-side from orders with no customer_id, keyed by
  // phone number, so Admin gets a useful customer view without fabricating
  // fake accounts for people who never registered.
  const guestOrders = os.filter(o=>!o.customer_id);
  const byPhone = {};
  guestOrders.forEach(o=>{
    const key = o.guest_phone||'unknown';
    if(!byPhone[key]) byPhone[key] = {type:'Guest', name:o.guest_name||'Guest customer', phone:key, orderCount:0, orders:[]};
    byPhone[key].orderCount++; byPhone[key].orders.push(o);
    if(o.guest_name) byPhone[key].name = o.guest_name; // most recent name wins
  });
  const guests = Object.values(byPhone).sort((a,b)=>b.orderCount-a.orderCount);
  const all = [...registered, ...guests].sort((a,b)=>b.orderCount-a.orderCount);
  window._customerListCache = all;
  return `<section class="panel"><div class="panelHead"><div><h2>Customers</h2><p>Registered customers (Supabase accounts) and guest buyers (identified by phone number from their orders — no account is created for them) shown together.</p></div><span class="countPill">${registered.length} registered · ${guests.length} guest</span></div>${all.length?`<div class="customerGrid">${all.map((c,i)=>`<article class="customerCard"><div><span class="typeTag">${c.type}</span><h3>${esc(c.name)}</h3><p>${esc(c.phone)}</p></div><b>${c.orderCount} order${c.orderCount===1?'':'s'}</b><button class="outline" style="margin-top:10px" onclick="customerOrderHistory(${i})">View orders</button></article>`).join('')}</div>`:'<div class="empty">No customers yet.</div>'}</section>`;
}
function customerOrderHistory(i){
  const c = window._customerListCache[i]; if(!c) return;
  const resetBtn = c.type==='Registered'
    ? `<button class="outline" style="margin-top:14px" onclick="promptResetPassword('${esc(c.phone)}')">Reset password (R4)</button>`
    : '';
  openModal(`<div class="eyebrow">${c.type.toUpperCase()} CUSTOMER</div><h2>${esc(c.name)}</h2><p class="muted">${esc(c.phone)}</p>${resetBtn}<div class="orders" style="margin-top:16px">${c.orders.map(o=>`<button class="order" type="button" onclick="closeModal();orderView('${esc(o.order_number)}')"><b>${esc(o.order_number)}</b><span>${new Date(o.created_at).toLocaleDateString('en-IN')}</span><strong>${money(o.total)}</strong><small>${esc(o.status)}</small></button>`).join('')||'<div class="empty smallEmpty">No orders.</div>'}</div>`);
}
async function promptResetPassword(phone){
  const newPassword = prompt(`Set a new password for ${phone} (at least 6 characters).\nGive this to the customer via WhatsApp after resetting — it is not shown anywhere else. They'll be able to set their own password afterwards from My Jayvi → Security.`);
  if(!newPassword) return;
  if(newPassword.length < 6){ toast('Password must be at least 6 characters'); return; }
  const {data:session} = await sb.auth.getSession();
  if(!session?.session?.access_token){ toast('Your admin session has expired — please sign in again and retry.'); return; }
  try{
    const res = await fetch(EDGE_FUNCTIONS_URL + '/admin-reset-password', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + session.session.access_token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, newPassword })
    });
    // V32.8 (item 3): distinguish the specific server-side reasons this
    // can fail, instead of one generic "Reset failed: <raw body>" for
    // everything — each of these is a different root cause requiring a
    // different fix, and the old undifferentiated message made it hard
    // to tell "function not deployed" apart from "wrong phone number"
    // apart from "you're not actually an admin in this session."
    if(!res.ok){
      const t = await res.text();
      if(res.status===404) toast('Reset failed: no customer profile found with phone '+phone+'. Check the number is correct (10 digits, no country code).');
      else if(res.status===401) toast('Reset failed: your admin session is not valid ('+t+'). Sign out and sign back in, then retry.');
      else if(res.status===403) toast('Reset failed: this signed-in account is not flagged as admin in profiles.role ('+t+').');
      else toast('Reset failed ('+res.status+'): '+t);
      return;
    }
    toast('Password reset in Supabase Auth. Send the new password to the customer via WhatsApp now — they can set their own permanent password afterwards from My Jayvi → Security.');
    window.open('https://wa.me/91'+phone+'?text='+encodeURIComponent('Your Jayvi Foods password has been reset. You can now log in using your registered mobile number and the new password provided here by our team. Once logged in, go to My Jayvi → Security to set your own password.'), '_blank');
  }catch(e){
    // V32.5 (Priority 1, item 3): a caught fetch() exception here (as
    // opposed to an !res.ok response above) means the request never got a
    // real HTTP response at all — either the admin-reset-password Edge
    // Function isn't deployed yet, or it returned a response the browser
    // rejected before we could read it (a missing CORS header, fixed in
    // this Edge Function in V32.5 — see supabase_functions/admin-reset-password).
    // Meaningful message instead of a bare error, per the requirement:
    // never show success or silently swallow this, and say clearly that
    // the password was NOT changed.
    //
    // V32.8: this remains the #1 real-world cause of "reset doesn't
    // work" — the Edge Function existing in this repo's source tree
    // does NOT mean it's deployed to the live Supabase project. It must
    // be deployed separately with:
    //   supabase functions deploy admin-reset-password
    // See "Password reset — deployment check" in DEPLOY.md.
    toast('Password was NOT changed — could not reach the admin-reset-password function ('+e.message+'). This almost always means it has not been deployed yet: run `supabase functions deploy admin-reset-password` (see DEPLOY.md), then retry.');
  }
}

async function productsPage(){
 await fetchProducts(); await fetchCategories(); await fetchMealTags();
 return `<section class="panel">${liveCatalogNote()}<div class="panelHead"><div><h2>Products</h2><p>Product catalogue, merchandising, multiple categories and media — stored in Supabase.</p></div><button class="gold" onclick="productForm()">+ Add product</button></div><div class="productAdminGrid">${data.products.map(p=>`<article class="productAdminCard"><div class="thumb"><img src="${esc(p.image||'')}" alt=""></div><div class="productInfo"><span class="typeTag">${p.best?'BESTSELLER':'PRODUCT'}</span><h3>${esc(p.name)}</h3><p>${esc(p.short||'')}</p><small>${(p.categories?.length?p.categories:[p.category]).map(catName).join(' · ')} · ${p.variants?.length||0} variants · ${p.media?.length||0} media</small><div class="cardActions"><button class="outline" onclick="productForm('${esc(p.id)}')">Edit</button><button class="outline dangerBtn" onclick="deleteProduct('${esc(p.id)}')">Delete</button></div></div></article>`).join('')}</div></section>`;
}
function productForm(id=null){
 const p=id?product(id):{id:'',sku:'',name:'',short:'',description:'',category:data.categories[0]?.id||'',categories:[],active:true,best:false,media:[],mealTags:[],rating:0,reviewCount:0,variants:[]};
 const selected=p.categories?.length?p.categories:[p.category].filter(Boolean);
 window._mediaDraft=structuredClone(p.media||[]).map(m=>({type:m.type,path:m.path,poster:m.poster||'',primary:!!m.isPrimary}));
 window._mediaOwnerId=p.id||'new-product';
 openModal(`<div class="eyebrow">PRODUCT</div><h2>${id?'Edit product':'Add product'}</h2>
 <div class="formGrid">
 <label>Product ID<input id="pId" value="${esc(p.id)}" placeholder="peanut-chutney" ${id?'disabled':''}></label>
 <label>SKU<input id="pSku" value="${esc(p.sku)}"></label>
 <label>Product name<input id="pName" value="${esc(p.name)}"></label>
 <label>Primary category<select id="pCat">${data.categories.map(c=>`<option value="${c.id}" ${c.id===(p.category||selected[0])?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label>
 <label class="fullLabel">Short description<textarea id="pShort" rows="3" maxlength="220" placeholder="Card text. Keep it concise; storefront clamps it visually.">${esc(p.short)}</textarea><small class="fieldHint">Up to 220 characters. Full description can be longer below.</small></label>
 <label class="fullLabel">Full product description<textarea id="pDesc" rows="7">${esc(p.description||'')}</textarea></label>
 </div>
 <div class="formSection"><h3>Categories / collections</h3><p>Select as many as needed. Primary category is separate from merchandising collections.</p><div class="checkGrid">${data.categories.map(c=>`<label><input type="checkbox" class="pCats" value="${c.id}" ${selected.includes(c.id)?'checked':''}> ${esc(c.name)}</label>`).join('')}</div></div>
 <div class="formSection"><h3>Meal tags</h3><p>Admin-managed. Add more from <b>Meal tags</b> in the sidebar; nothing is hardcoded to four choices.</p><div class="checkGrid">${(data.mealTags||[]).filter(t=>t.enabled).sort((a,b)=>a.order-b.order).map(t=>`<label><input type="checkbox" class="pMeals" value="${t.id}" ${(p.mealTags||[]).includes(t.id)?'checked':''}> ${esc(t.name)}</label>`).join('')}</div></div>
 ${mediaEditorMarkup()}
 <label class="checkOnly"><input type="checkbox" id="pActive" ${p.active?'checked':''}> Product visible</label>
 <label class="checkOnly"><input type="checkbox" id="pBest" ${p.best?'checked':''}> Bestseller</label>
 <button class="gold full" onclick="saveProduct('${id?esc(id):''}')">Save product</button>`);
}
async function saveProduct(existingId){
 const id=(existingId||document.getElementById('pId').value.trim());
 const media=(window._mediaDraft||[]).filter(m=>m.path);
 const existing=existingId?product(existingId):null;
 const p={id,sku:document.getElementById('pSku').value.trim(),name:document.getElementById('pName').value.trim(),
 short:document.getElementById('pShort').value.trim(),description:document.getElementById('pDesc').value.trim(),
 category:document.getElementById('pCat').value,categories:[...document.querySelectorAll('.pCats:checked')].map(x=>x.value),
 mealTags:[...document.querySelectorAll('.pMeals:checked')].map(x=>x.value),
 active:document.getElementById('pActive').checked,best:document.getElementById('pBest').checked,
 variants:existing?existing.variants:[],rating:existing?existing.rating:0,
 reviewCount:existing?existing.reviewCount:0};

 // Item Q — required-field validation before publish. Missing core
 // fields block the save outright, named individually. Variants are a
 // special case: a brand-new product can't have one yet (they're
 // added via Variants & sizes *after* the product exists), so instead
 // of blocking creation, an incomplete product is silently forced
 // inactive (hidden from the storefront) regardless of the checkbox —
 // this is the actual fix for the confirmed crash (a product with zero
 // active variants reaching the customer UI). The admin is told why.
 const missing = [];
 if(!p.id) missing.push('Product ID');
 if(!p.name) missing.push('Product name');
 if(!p.category) missing.push('Category');
 if(!p.short && !p.description) missing.push('Description');
 if(!media.length) missing.push('At least one media item');
 if(missing.length){
   toast(`${missing.length} required field${missing.length===1?'':'s'} missing: ${missing.join(', ')}`);
   return;
 }
 const hasSellableVariant = (p.variants||[]).some(v=>v.active && v.price>0 && v.mrp>0);
 if(p.active && !hasSellableVariant){
   p.active = false;
   toast('Saved as hidden: add at least one variant with a price and MRP (Variants & sizes) before making this visible on the storefront.');
 }
 const ok=await saveProductToSupabase(p, media);
 if(!ok) return;
 closeModal();render();
}
// V32.12.1 (spec 12 — "Product Deletion Must Clean Up Associated
// Data"). public.product_media rows already cascade-delete with their
// parent product/combo (foreign keys with ON DELETE CASCADE — see
// supabase_migration_product_catalog.sql) — that part needed no
// change. What was missing: the actual Storage OBJECTS those rows
// pointed at (uploaded via uploadMediaFile() above, into the
// 'product-media' bucket) were never removed, only the database rows
// referencing them — Postgres has no visibility into Supabase Storage
// to cascade against automatically.
//
// Fixed by capturing every Storage-hosted media_url/poster_url BEFORE
// the delete, then — spec 12's explicit safety requirement — checking
// whether each exact file is still referenced by ANY other
// product_media row (shared/reused media) before removing it from
// Storage. External URLs and legacy Git-committed paths (anything not
// under this project's public Storage URL) are never touched here at
// all, matching the "do not blindly delete shared media" instruction.
const STORAGE_PUBLIC_PREFIX = SUPABASE_URL.replace(/\/$/,'') + '/storage/v1/object/public/product-media/';
function storagePathFromUrl(url){
  if(!url || typeof url !== 'string' || !url.startsWith(STORAGE_PUBLIC_PREFIX)) return null;
  try{ return decodeURIComponent(url.slice(STORAGE_PUBLIC_PREFIX.length)); }catch{ return null; }
}
async function cleanupOrphanedMedia(mediaRows){
  const urls = new Set();
  (mediaRows||[]).forEach(r=>{ if(r.media_url) urls.add(r.media_url); if(r.poster_url) urls.add(r.poster_url); });
  for(const url of urls){
    const path = storagePathFromUrl(url);
    if(!path) continue; // external URL / legacy Git path — never touched, per spec 12
    const { count } = await sb.from('product_media').select('id',{count:'exact',head:true}).or(`media_url.eq.${url},poster_url.eq.${url}`);
    if(count && count>0) continue; // still referenced by another product/combo's media — leave the file in Storage
    const { error: rmErr } = await sb.storage.from('product-media').remove([path]);
    if(rmErr) console.warn('Could not remove orphaned Storage file (left in place, no data was lost):', path, rmErr.message);
  }
}
function deleteProduct(id){
 if(!confirm('Delete this product? This also deletes its media rows and, where the file isn\'t used elsewhere, its uploaded media. This cannot be undone.')) return;
 (async()=>{
   const {data:mediaRows} = await sb.from('product_media').select('media_url,poster_url').eq('product_id',id);
   const {error} = await sb.from('products').delete().eq('id',id);
   if(error){ toast('Could not delete: '+error.message); return; }
   await cleanupOrphanedMedia(mediaRows||[]);
   render();
 })();
}
async function variantsPage(){
 await fetchProducts();
 return `<section class="panel">${liveCatalogNote()}<div class="panelHead"><div><h2>Variants & sizes</h2><p>Each product controls its own available sizes. Future 1kg, 2kg or other variants can be added here.</p></div></div>${data.products.map(p=>`<div class="variantBlock"><div class="variantTitle"><div><b>${esc(p.name)}</b><small>${esc(p.sku)}</small></div><button class="gold small" onclick="variantForm('${esc(p.id)}')">+ Add size</button></div><div class="variantRows">${(p.variants||[]).map((v,j)=>`<div class="variantRow"><span><b>${esc(v.label)}</b><small>${esc(v.weight||v.label)} · ${esc(v.sku||'')}</small></span><strong>${money(v.price)}</strong><del>${money(v.mrp)}</del><span class="${v.active?'good':'danger'}">${v.active?'LIVE':'HIDDEN'}</span><button class="outline" onclick="variantForm('${esc(p.id)}',${j})">Edit</button></div>`).join('')||'<div class="empty smallEmpty">No variants yet.</div>'}</div></div>`).join('')}</section>`;
}
function variantForm(pid,vi=-1){const p=product(pid),v=vi>=0?p.variants[vi]:{id:'',label:'',weight:'',price:'',mrp:'',sku:'',active:true};openModal(`<div class="eyebrow">VARIANT</div><h2>${vi<0?'Add size':'Edit size'} · ${esc(p.name)}</h2><div class="formGrid"><label>Variant ID<input id="vId" value="${esc(v.id)}"></label><label>Display label<input id="vLabel" value="${esc(v.label)}" placeholder="1kg"></label><label>Weight<input id="vWeight" value="${esc(v.weight)}"></label><label>SKU<input id="vSku" value="${esc(v.sku)}"></label><label>Selling price<input id="vPrice" type="number" value="${v.price}"></label><label>MRP<input id="vMrp" type="number" value="${v.mrp}"></label></div><label class="checkOnly"><input id="vActive" type="checkbox" ${v.active?'checked':''}> Available for sale</label><button class="gold full" onclick="saveVariant('${esc(pid)}',${vi})">Save variant</button>`)}
async function saveVariant(pid,vi){
 const p=product(pid);
 const v={id:document.getElementById('vId').value.trim(),label:document.getElementById('vLabel').value.trim(),weight:document.getElementById('vWeight').value.trim(),sku:document.getElementById('vSku').value.trim(),price:Number(document.getElementById('vPrice').value||0),mrp:Number(document.getElementById('vMrp').value||0),active:document.getElementById('vActive').checked};
 if(!v.id||!v.label){toast('Variant ID and label are required');return}
 const variants=structuredClone(p.variants||[]);
 if(vi<0)variants.push(v);else variants[vi]=v;
 const {error}=await sb.from('products').update({variants}).eq('id',pid);
 if(error){ toast('Could not save variant: '+error.message); return; }
 closeModal();render();
}
async function combosPage(){
 await fetchProducts(); await fetchCombos();
 return `<section class="panel">${liveCatalogNote()}<div class="panelHead"><div><h2>Combos</h2><p>Combo item size dropdowns are filtered to the selected product's own variants. Combo media works exactly like product media.</p></div><button class="gold" onclick="comboForm()">+ Add combo</button></div><div class="comboAdmin">${data.combos.map(c=>`<article><span class="typeTag">COMBO</span><h3>${esc(c.name)}</h3><p>${esc(c.short||'')}</p><div class="chips">${(c.items||[]).map(it=>{const p=product(it.productId),v=p?.variants?.find(x=>x.id===it.variantId);return `<span>${esc(p?.name||'')} · ${esc(v?.label||'')} × ${it.qty}</span>`}).join('')}</div><strong>${money(c.price)}</strong><small>MRP ${money(c.mrp)} · ${c.active?'Live':'Hidden'} · ${c.media?.length||0} media</small><div class="cardActions"><button class="outline" onclick="comboForm('${esc(c.id)}')">Edit</button><button class="outline dangerBtn" onclick="deleteCombo('${esc(c.id)}')">Delete</button></div></article>`).join('')}</div></section>`;
}
function comboForm(id=null){
 const c=id?data.combos.find(x=>x.id===id):{id:'',name:'',short:'',price:0,mrp:0,active:true,items:[],media:[]};
 window._mediaDraft=structuredClone(c.media||[]).map(m=>({type:m.type,path:m.path,poster:m.poster||'',primary:!!m.isPrimary}));
 window._mediaOwnerId=c.id?('combo-'+c.id):'new-combo';
 openModal(`<div class="eyebrow">COMBO</div><h2>${id?'Edit combo':'Add combo'}</h2><div class="formGrid"><label>Combo ID<input id="cId" value="${esc(c.id)}" ${id?'disabled':''}></label><label>Name<input id="cName" value="${esc(c.name)}"></label><label>Price<input id="cPrice" type="number" value="${c.price}"></label><label>MRP<input id="cMrp" type="number" value="${c.mrp}"></label><label class="fullLabel">Description<textarea id="cShort" rows="3">${esc(c.short||'')}</textarea></label></div><div class="formSection"><h3>Combo items</h3><div id="comboItems"></div><button class="outline" onclick="addComboItemRow()">+ Add item</button></div>${mediaEditorMarkup()}<label class="checkOnly"><input id="cActive" type="checkbox" ${c.active?'checked':''}> Combo visible</label><button class="gold full" onclick="saveCombo('${id?esc(id):''}')">Save combo</button>`);window._comboDraft=structuredClone(c.items||[]);renderComboRows()}
function addComboItemRow(){window._comboDraft.push({productId:data.products[0]?.id||'',variantId:data.products[0]?.variants?.[0]?.id||'',qty:1});renderComboRows()}
function renderComboRows(){const box=document.getElementById('comboItems');if(!box)return;box.innerHTML=(window._comboDraft||[]).map((it,i)=>{const p=product(it.productId);const opts=(p?.variants||[]).filter(v=>v.active).map(v=>`<option value="${v.id}" ${v.id===it.variantId?'selected':''}>${esc(v.label)} — ${money(v.price)}</option>`).join('');return `<div class="comboItemForm"><select onchange="comboProductChanged(${i},this.value)">${data.products.filter(p=>p.active).map(p=>`<option value="${p.id}" ${p.id===it.productId?'selected':''}>${esc(p.name)}</option>`).join('')}</select><select onchange="window._comboDraft[${i}].variantId=this.value">${opts}</select><input type="number" min="1" value="${it.qty}" onchange="window._comboDraft[${i}].qty=Number(this.value||1)"><button onclick="window._comboDraft.splice(${i},1);renderComboRows()">×</button></div>`}).join('')||'<div class="empty smallEmpty">Add products to this combo.</div>'}
function comboProductChanged(i,pid){window._comboDraft[i].productId=pid;window._comboDraft[i].variantId=product(pid)?.variants?.find(v=>v.active)?.id||'';renderComboRows()}
async function saveCombo(existingId){
 const media=(window._mediaDraft||[]).filter(m=>m.path);
 const c={id:existingId||document.getElementById('cId').value.trim(),name:document.getElementById('cName').value.trim(),price:Number(document.getElementById('cPrice').value||0),mrp:Number(document.getElementById('cMrp').value||0),short:document.getElementById('cShort').value.trim(),active:document.getElementById('cActive').checked,items:structuredClone(window._comboDraft||[])};
 if(!c.id||!c.name){toast('Combo ID and name are required');return}
 const ok=await saveComboToSupabase(c, media);
 if(!ok) return;
 closeModal();render();
}
function deleteCombo(id){
 if(!confirm('Delete this combo? This also deletes its media rows and, where the file isn\'t used elsewhere, its uploaded media. This cannot be undone.')) return;
 (async()=>{
   const {data:mediaRows} = await sb.from('product_media').select('media_url,poster_url').eq('combo_id',id);
   const {error} = await sb.from('combos').delete().eq('id',id);
   if(error){ toast('Could not delete: '+error.message); return; }
   await cleanupOrphanedMedia(mediaRows||[]);
   render();
 })();
}
async function mealTagsPage(){
 await fetchMealTags();
 return `<section class="panel">${liveCatalogNote()}<div class="panelHead"><div><h2>Meal tags</h2><p>Manage the meals shown in product setup and the storefront's "Made for every meal" recommendations.</p></div><button class="gold" onclick="mealTagForm()">+ Add meal tag</button></div>
 <div class="categoryTable">${(data.mealTags||[]).sort((a,b)=>(a.order||0)-(b.order||0)).map((t,i)=>`<div class="categoryRow"><span><b>${esc(t.name)}</b><small>ID: ${esc(t.id)}</small></span><strong>${t.order||i+1}</strong><span class="${t.enabled?'good':'danger'}">${t.enabled?'VISIBLE':'HIDDEN'}</span><button class="outline" onclick="mealTagForm(${i})">Edit</button><button class="outline dangerBtn" onclick="deleteMealTag(${i})">Delete</button></div>`).join('')}</div></section>`;
}
function mealTagForm(index=-1){
 const t=index>=0?data.mealTags[index]:{id:'',name:'',enabled:true,order:data.mealTags.length+1};
 openModal(`<div class="eyebrow">MEAL TAG</div><h2>${index<0?'Add meal tag':'Edit meal tag'}</h2><div class="formGrid"><label>ID<input id="mtId" value="${esc(t.id)}" ${index>=0?'disabled':''}></label><label>Name<input id="mtName" value="${esc(t.name)}"></label><label>Display position<input id="mtOrder" type="number" value="${t.order||1}"></label></div><label class="checkOnly"><input id="mtEnabled" type="checkbox" ${t.enabled?'checked':''}> Visible</label><button class="gold full" onclick="saveMealTag(${index})">Save meal tag</button>`);
}
async function saveMealTag(i){
  const existingId=i>=0?data.mealTags[i].id:null;
  const t={id:existingId||document.getElementById('mtId').value.trim(),name:document.getElementById('mtName').value.trim(),order:Number(document.getElementById('mtOrder').value||1),enabled:document.getElementById('mtEnabled').checked};
  if(!t.id||!t.name){toast('ID and name are required');return}
  const ok=await saveMealTagToSupabase(t);
  if(!ok)return;
  closeModal();render();
}
async function deleteMealTag(i){
  const id=data.mealTags[i]?.id;
  if(data.products.some(p=>(p.mealTags||[]).includes(id))){toast('Remove this tag from products before deleting it');return}
  if(!confirm('Delete this meal tag?'))return;
  const ok=await deleteMealTagFromSupabase(id);
  if(!ok)return;
  render();
}
async function categoriesPage(){
 await fetchCategories();
 return `<section class="panel">${liveCatalogNote()}<div class="panelHead"><div><h2>Categories</h2><p>Display position controls ordering. "Orders" is not used here.</p></div><button class="gold" onclick="categoryForm()">+ Add category</button></div><div class="categoryTable">${data.categories.map((c,i)=>`<div class="categoryRow"><span><b>${esc(c.name)}</b><small>ID: ${esc(c.id)}</small></span><strong>${c.order||i+1}</strong><span class="${c.enabled?'good':'danger'}">${c.enabled?'VISIBLE':'HIDDEN'}</span><button class="outline" onclick="categoryForm(${i})">Edit</button></div>`).join('')}</div></section>`;
}
function categoryForm(index=-1){const c=index>=0?data.categories[index]:{id:'',name:'',enabled:true,order:data.categories.length+1};openModal(`<div class="eyebrow">CATEGORY</div><h2>${index<0?'Add category':'Edit category'}</h2><div class="formGrid"><label>ID<input id="catId" value="${esc(c.id)}" ${index>=0?'disabled':''}></label><label>Name<input id="catName" value="${esc(c.name)}"></label><label>Display position<input id="catOrder" type="number" value="${c.order||1}"></label></div><label class="checkOnly"><input id="catEnabled" type="checkbox" ${c.enabled?'checked':''}> Visible on storefront</label><button class="gold full" onclick="saveCategory(${index})">Save category</button>`)}
async function saveCategory(i){
  const existingId=i>=0?data.categories[i].id:null;
  const c={id:existingId||document.getElementById('catId').value.trim(),name:document.getElementById('catName').value.trim(),order:Number(document.getElementById('catOrder').value||1),enabled:document.getElementById('catEnabled').checked};
  if(!c.id||!c.name){toast('Category ID and name are required');return}
  const ok=await saveCategoryToSupabase(c);
  if(!ok)return;
  closeModal();render();
}
async function homepagePage(){await fetchAnnouncements();return `<section class="panel">${liveCatalogNote()}<div class="panelHead"><div><h2>Homepage announcements</h2><p>General announcements need no product. Product announcements are explicitly linked to a product or combo, which is used for both the click destination and the media fallback.</p></div><button class="gold" onclick="announcementForm()">+ Add announcement</button></div><div class="announcementAdmin">${data.announcements.sort((a,b)=>(a.order||0)-(b.order||0)).map((s,i)=>{
  const isProduct=s.announcementType==='product';
  const targetName=isProduct?(s.targetType==='combo'?(combo(s.comboId)?.name||'(deleted combo)'):(product(s.productId)?.name||'(deleted product)')):'';
  return `<article><div class="announcementInfo"><span class="typeTag">${isProduct?'PRODUCT':'GENERAL'}</span><span class="typeTag">${esc(s.label||'ANNOUNCEMENT')}</span><h3>${esc(s.title||'')}</h3><p>${esc(s.text||'')}</p><small>${isProduct?`Linked to: ${esc(targetName)}`:`CTA: ${esc(s.actionType==='none'||!s.actionType?'None':s.actionType)}`} · ${s.mediaType==='video'?'🎬 Video':s.image?'🖼️ Image':'No media'} · ${s.active?'Active':'Inactive'}</small></div><div class="cardActions"><button class="outline" onclick="announcementForm(${i})">Edit</button><button class="outline dangerBtn" onclick="deleteAnnouncement('${esc(s.id)}')">Delete</button></div></article>`;
}).join('')||'<div class="empty smallEmpty">No announcements yet.</div>'}</div></section>`}
function combo(id){return data.combos.find(c=>c.id===id)}
// NOTE (V32.3): announcementForm()/saveAnnouncement() used to be
// (re-)defined twice more further down this file, each patch replacing
// the previous release's version — the same "override at the bottom"
// pattern this codebase has used for every incremental release. V32.3
// removes those superseded, dead definitions (they referenced
// renderAnnouncementTarget(), a function that was called but never
// actually defined anywhere in V32.12.1 — a pre-existing bug this
// release also fixes) and defines the real, current versions in one
// place, further down, alongside the new General/Product + single-media
// UI (spec 3-8) and deleteAnnouncement() (spec 6).
let _reviewsTab='pending', _reviewsSort='newest', _reviewsSearch='', _reviewsOffset=0;
const REVIEWS_PAGE_SIZE=20;
async function fetchWebsiteReviews(reset=true){
  if(reset) _reviewsOffset=0;
  let q = sb.from('website_reviews').select('*',{count:'exact'}).eq('status',_reviewsTab);
  if(_reviewsSearch.trim()){
    const term = _reviewsSearch.trim().replace(/[%,]/g,'');
    q = q.or(`customer_name.ilike.%${term}%,review_text.ilike.%${term}%`);
  }
  const sortMap = {newest:['created_at',false], oldest:['created_at',true], ratingHigh:['rating',false], ratingLow:['rating',true]};
  const [col,asc] = sortMap[_reviewsSort]||sortMap.newest;
  q = q.order(col,{ascending:asc}).range(_reviewsOffset, _reviewsOffset+REVIEWS_PAGE_SIZE-1);
  const {data:rows, error, count} = await q;
  if(error){ toast('Could not load reviews: '+error.message); return {rows:[], count:0}; }
  return {rows:rows||[], count:count||0};
}
async function reviewsPage(){
  const {rows, count} = await fetchWebsiteReviews(true);
  await fetchCuratedReviews();
  const counts = {};
  for(const s of ['pending','approved','rejected']){
    const {count:c} = await sb.from('website_reviews').select('id',{count:'exact',head:true}).eq('status',s);
    counts[s]=c||0;
  }
  window._websiteReviewsCache = rows;
  return `<section class="panel"><div class="panelHead"><div><h2>Website reviews</h2><p>Customer-submitted reviews from the storefront. Separate workflow from Google reviews below — these are stored in Supabase, not localStorage, so this stays usable as volume grows.</p></div></div>
  <div class="reviewFilters">
    <button class="${_reviewsTab==='pending'?'gold':'outline'}" onclick="setReviewsTab('pending')">Pending (${counts.pending})</button>
    <button class="${_reviewsTab==='approved'?'gold':'outline'}" onclick="setReviewsTab('approved')">Approved (${counts.approved})</button>
    <button class="${_reviewsTab==='rejected'?'gold':'outline'}" onclick="setReviewsTab('rejected')">Rejected (${counts.rejected})</button>
  </div>
  <div class="formGrid" style="margin:14px 0">
    <input placeholder="Search name or review text..." value="${esc(_reviewsSearch)}" onchange="setReviewsSearch(this.value)">
    <select onchange="setReviewsSort(this.value)">
      <option value="newest" ${_reviewsSort==='newest'?'selected':''}>Newest first</option>
      <option value="oldest" ${_reviewsSort==='oldest'?'selected':''}>Oldest first</option>
      <option value="ratingHigh" ${_reviewsSort==='ratingHigh'?'selected':''}>Highest rating</option>
      <option value="ratingLow" ${_reviewsSort==='ratingLow'?'selected':''}>Lowest rating</option>
    </select>
  </div>
  <div class="reviewAdmin">${rows.map((r,i)=>`<article><div><span class="typeTag">${esc(r.status.toUpperCase())}${r.featured?' · FEATURED':''}</span><span class="stars">${'★'.repeat(r.rating)}</span><h3>${esc(r.customer_name)}</h3><p>“${esc(r.review_text)}”</p><small>${r.product_id?'Product: '+esc(product(r.product_id)?.name||r.product_id)+' · ':''}${r.order_number?'Order: '+esc(r.order_number)+' · ':''}${new Date(r.created_at).toLocaleDateString('en-IN')}</small></div><div class="cardActions">${r.status!=='approved'?`<button class="gold" onclick="setReviewStatus('${r.id}','approved')">Approve</button>`:''}${r.status!=='rejected'?`<button class="outline dangerBtn" onclick="setReviewStatus('${r.id}','rejected')">Reject</button>`:''}${r.status!=='pending'?`<button class="outline" onclick="setReviewStatus('${r.id}','pending')">Move to pending</button>`:''}${r.status==='approved'?`<button class="outline" onclick="toggleReviewFeatured('${r.id}',${!r.featured})">${r.featured?'Unfeature':'Feature'}</button>`:''}</div></article>`).join('')||'<div class="empty">No reviews in this tab.</div>'}</div>
  ${count>REVIEWS_PAGE_SIZE?`<button class="outline full" onclick="loadMoreReviews()">Load more (${Math.max(0,count-_reviewsOffset-REVIEWS_PAGE_SIZE)} remaining)</button>`:''}
  </section>
  <section class="panel" style="margin-top:16px"><div class="panelHead"><div><h2>Google reviews</h2><p>Manually managed testimonial content shown alongside the "View Google reviews" link — separate from the customer-submitted reviews above.</p></div><button class="gold" onclick="reviewForm()">+ Add Google review</button></div>
  <div class="reviewAdmin">${data.reviews.map((r,i)=>`<article><div><span class="typeTag">${esc(r.source||'Google')}</span><span class="stars">${'★'.repeat(Number(r.rating||0))}</span><h3>${esc(r.name||'Customer')}</h3><p>“${esc(r.text||'')}”</p><small>${r.verifiedPurchase?'Verified purchase · ':''}${r.active?'Published':'Hidden'}</small></div><div class="cardActions"><button class="outline" onclick="reviewForm(${i})">Edit</button><button class="outline" onclick="toggleReview(${i})">${r.active?'Hide':'Publish'}</button><button class="outline dangerBtn" onclick="deleteReview(${i})">Delete</button></div></article>`).join('')||'<div class="empty">No managed reviews yet.</div>'}</div></section>`;
}
function setReviewsTab(t){_reviewsTab=t;_reviewsOffset=0;render()}
function setReviewsSearch(v){_reviewsSearch=v;_reviewsOffset=0;render()}
function setReviewsSort(v){_reviewsSort=v;_reviewsOffset=0;render()}
async function loadMoreReviews(){ _reviewsOffset+=REVIEWS_PAGE_SIZE; render(); }
async function setReviewStatus(id,status){
  const {error} = await sb.from('website_reviews').update({status, reviewed_at:new Date().toISOString(), reviewed_by:adminUser?.id||null}).eq('id',id);
  if(error){ toast('Could not update review: '+error.message); return; }
  toast('Review '+status);
  render();
}
async function toggleReviewFeatured(id,featured){
  const {error} = await sb.from('website_reviews').update({featured}).eq('id',id);
  if(error){ toast('Could not update review: '+error.message); return; }
  toast(featured?'Marked as featured':'Removed from featured');
  render();
}
function reviewForm(i=-1){const r=i>=0?data.reviews[i]:{source:'Google',name:'',rating:5,text:'',active:true,verifiedPurchase:false};openModal(`<div class="eyebrow">REVIEW</div><h2>${i<0?'Add Google review':'Edit review'}</h2><div class="formGrid"><label>Source<select id="rSource"><option value="Google" ${r.source==='Google'?'selected':''}>Google</option><option value="customer" ${r.source==='customer'?'selected':''}>Customer</option></select></label><label>Customer name<input id="rName" value="${esc(r.name)}"></label><label>Rating<select id="rRating">${[1,2,3,4,5].map(n=>`<option ${n===Number(r.rating)?'selected':''}>${n}</option>`).join('')}</select></label><label>Product (optional)<select id="rProduct"><option value="">General review</option>${data.products.map(p=>`<option value="${p.id}" ${r.productId===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label><label class="fullLabel">Review text<textarea id="rText" rows="5">${esc(r.text)}</textarea></label></div><label class="checkOnly"><input id="rActive" type="checkbox" ${r.active?'checked':''}> Published</label><label class="checkOnly"><input id="rVerified" type="checkbox" ${r.verifiedPurchase?'checked':''}> Verified purchase</label><button class="gold full" onclick="saveReview(${i})">Save review</button>`)}
async function saveReview(i){
  const r={id:i>=0?data.reviews[i].id:undefined,source:document.getElementById('rSource').value,name:document.getElementById('rName').value.trim(),rating:Number(document.getElementById('rRating').value),text:document.getElementById('rText').value.trim(),productId:document.getElementById('rProduct').value,active:document.getElementById('rActive').checked,verifiedPurchase:document.getElementById('rVerified').checked,order:i>=0?data.reviews[i].order:data.reviews.length+1};
  if(!r.name||!r.text){toast('Name and review text are required');return}
  const ok=await saveCuratedReviewToSupabase(r);
  if(!ok)return;
  closeModal();render();
}
async function toggleReview(i){
  const r=data.reviews[i];
  const ok=await saveCuratedReviewToSupabase({...r,active:!r.active});
  if(!ok)return;
  render();
}
async function deleteReview(i){
  if(!confirm('Delete this review?'))return;
  const ok=await deleteCuratedReviewFromSupabase(data.reviews[i].id);
  if(!ok)return;
  render();
}
/* ---------- Delivery / Pincode management (item B) ---------- */
let _expandedState = null, _pincodeSearch = '', _pincodeOffset = 0;
const PINCODE_PAGE_SIZE = 100;

async function pincodesPage(){
  const {data: states, error} = await sb.from('delivery_states').select('*').order('state');
  if(error) return `<section class="panel"><div class="empty">Could not load delivery states: ${esc(error.message)}. Has supabase_migration_pincodes_schema.sql been run?</div></section>`;
  // One lightweight count query per state (only 25 states, cheap) rather
  // than pulling all ~19,300 pincode rows into the browser to count them.
  const counts = await Promise.all(states.map(s => sb.from('pincodes').select('pincode',{count:'exact',head:true}).eq('state', s.state)));
  const withCounts = states.map((s,i)=>({...s, count: counts[i].count||0}));
  window._pincodeStatesCache = withCounts;

  let expandedHtml = '';
  if(_expandedState){
    // V32.6 (item 9 fix): the actual bug was here — this used to always
    // pass reset=true, which zeroed _pincodeOffset back to 0 on *every*
    // render(), including the render() that loadMorePincodes() itself
    // triggers after incrementing the offset. So "Load more" always
    // silently reloaded page 1. Resetting to 0 now only happens where
    // it should — expanding a (possibly different) state or changing
    // the search box, both of which already set _pincodeOffset=0
    // explicitly before calling render() (see onchange/onclick below).
    const {rows, count} = await fetchPincodesForState(_expandedState, false);
    window._pincodeRowsCache = rows;
    expandedHtml = `<div class="formSection">
      <div class="panelHead"><h3>${esc(_expandedState)} — ${count} PIN code${count===1?'':'s'}</h3><button class="outline" onclick="_expandedState=null;render()">Collapse</button></div>
      <input placeholder="Search PIN code..." value="${esc(_pincodeSearch)}" onchange="setPincodeSearch(this.value)" style="margin-bottom:10px">
      <div class="categoryTable">
        <div class="categoryRow" style="font-weight:800;font-size:10.5px;color:var(--ink-faint);text-transform:uppercase"><span>PIN code</span><span>District/City</span><span>Serviceable</span><span></span></div>
        ${rows.map(p=>`<div class="categoryRow"><b>${esc(p.pincode)}</b><small>${esc(p.district||p.city||'—')}</small><label class="checkOnly" style="margin:0!important"><input type="checkbox" ${p.serviceable?'checked':''} onchange="togglePincodeServiceable('${esc(p.pincode)}',this.checked)"> ${p.serviceable?'Yes':'No'}</label><button class="outline dangerBtn" style="padding:6px 12px" onclick="deletePincode('${esc(p.pincode)}')">Remove</button></div>`).join('')||'<div class="empty smallEmpty">No PIN codes match.</div>'}
      </div>
      ${count>_pincodeOffset+PINCODE_PAGE_SIZE?`<button class="outline full" onclick="loadMorePincodes()">Load more (${count-_pincodeOffset-PINCODE_PAGE_SIZE} remaining)</button>`:''}
      <button class="gold full" style="margin-top:12px" onclick="pincodeForm('${esc(_expandedState)}')">+ Add PIN code to ${esc(_expandedState)}</button>
    </div>`;
  }

  return `<section class="panel"><div class="panelHead"><div><h2>Delivery / Pincode management</h2><p>Customer delivery calculation is always Pincode → Serviceability → Delivery Rule. State grouping below is an admin convenience — disabling a state overrides serviceability for every PIN in it without changing any individual PIN's own setting; re-enabling the state restores exactly what each PIN had before. <b>State defaults</b> (V32.5) fill in delivery charge/ETA/courier for any PIN in that state that doesn't set its own — a PIN's own value always wins over the state default.</p></div>
    <div class="cardActions"><button class="gold" onclick="pincodeQuickAddForm()">+ Add PIN code</button><button class="outline" onclick="exportPincodes()">Export CSV</button><label class="outline" style="cursor:pointer;display:inline-flex;align-items:center;padding:10px 16px;border-radius:99px">Import CSV<input type="file" accept=".csv" style="display:none" onchange="importPincodesFile(this.files[0])"></label></div>
  </div>
  <div class="categoryTable">
    <div class="categoryRow" style="font-weight:800;font-size:10.5px;color:var(--ink-faint);text-transform:uppercase"><span>State / circle</span><span>PIN codes / defaults</span><span>Serviceable</span><span></span></div>
    ${withCounts.map(s=>{
      const defParts=[];
      if(s.default_delivery_charge!=null) defParts.push(`₹${s.default_delivery_charge} delivery`);
      if(s.default_min_eta_days!=null||s.default_max_eta_days!=null) defParts.push(`${s.default_min_eta_days??'?'}–${s.default_max_eta_days??'?'} days`);
      if(s.default_courier_partner) defParts.push(esc(s.default_courier_partner));
      return `<div class="categoryRow"><b>${esc(s.state)}</b><small>${s.count} PIN codes${defParts.length?' · Default: '+defParts.join(' · '):' · No state default set'}</small><label class="checkOnly" style="margin:0!important"><input type="checkbox" ${s.enabled?'checked':''} onchange="toggleStateEnabled('${esc(s.state)}',this.checked)"> ${s.enabled?'ON':'OFF'}</label><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="outline" style="padding:6px 12px" onclick="stateDefaultsForm('${esc(s.state)}')">${defParts.length?'Edit defaults':'Set defaults'}</button><button class="outline" onclick="_expandedState='${esc(s.state)}';_pincodeOffset=0;_pincodeSearch='';render()">${_expandedState===s.state?'Collapse':'Expand'}</button></div></div>`;
    }).join('')}
  </div>
  ${expandedHtml}
  <div id="importPreview"></div>
  </section>`;
}
// V32.5 (Priority 3, item 9): edit a state's delivery defaults. Requires
// supabase_migration_state_delivery_defaults.sql to have been applied —
// same "additive migration, run once" pattern as the rest of this file.
function stateDefaultsForm(state){
  const s = (window._pincodeStatesCache||[]).find(x=>x.state===state) || {};
  openModal(`<div class="eyebrow">STATE DEFAULTS</div><h2>${esc(state)}</h2>
    <p class="v22-admin-help">Applies to every PIN in ${esc(state)} that doesn't set its own delivery charge/ETA/courier (Add/Edit PIN code). Leave a field blank to remove that default. A PIN's own value always takes priority over this.</p>
    <div class="formGrid">
      <label>Default delivery charge (₹, optional)<input id="sdCharge" type="number" min="0" step="1" value="${s.default_delivery_charge??''}"></label>
      <label>Default min ETA days (optional)<input id="sdMin" type="number" min="1" value="${s.default_min_eta_days??''}"></label>
      <label>Default max ETA days (optional)<input id="sdMax" type="number" min="1" value="${s.default_max_eta_days??''}"></label>
      <label>Default courier/partner (optional)<input id="sdCourier" value="${esc(s.default_courier_partner||'')}"></label>
    </div>
    <button class="gold full" onclick="saveStateDefaults('${esc(state)}')">Save defaults</button>`);
}
async function saveStateDefaults(state){
  const charge = document.getElementById('sdCharge').value;
  const min = document.getElementById('sdMin').value;
  const max = document.getElementById('sdMax').value;
  const courier = document.getElementById('sdCourier').value.trim();
  const {error} = await sb.from('delivery_states').update({
    default_delivery_charge: charge?Number(charge):null,
    default_min_eta_days: min?Number(min):null,
    default_max_eta_days: max?Number(max):null,
    default_courier_partner: courier||null,
    updated_at: new Date().toISOString()
  }).eq('state', state);
  if(error){ toast('Could not save state defaults: '+error.message+' — has supabase_migration_state_delivery_defaults.sql been run?'); return; }
  toast(`${state} defaults saved`);
  closeModal(); render();
}
async function fetchPincodesForState(state, reset){
  if(reset) _pincodeOffset = 0;
  let q = sb.from('pincodes').select('*',{count:'exact'}).eq('state', state);
  if(_pincodeSearch.trim()) q = q.ilike('pincode', _pincodeSearch.trim()+'%');
  q = q.order('pincode').range(_pincodeOffset, _pincodeOffset+PINCODE_PAGE_SIZE-1);
  const {data, error, count} = await q;
  if(error){ toast('Could not load PIN codes: '+error.message); return {rows:[], count:0}; }
  return {rows:data||[], count:count||0};
}
function setPincodeSearch(v){_pincodeSearch=v;_pincodeOffset=0;render()}
function loadMorePincodes(){_pincodeOffset+=PINCODE_PAGE_SIZE;render()}
async function toggleStateEnabled(state, enabled){
  const {error} = await sb.from('delivery_states').update({enabled, updated_at:new Date().toISOString()}).eq('state', state);
  if(error){ toast('Could not update state: '+error.message); return; }
  toast(`${state} delivery is now ${enabled?'ON':'OFF'}`);
  render();
}
async function togglePincodeServiceable(pincode, serviceable){
  const {error} = await sb.from('pincodes').update({serviceable, updated_at:new Date().toISOString(), source:'admin_edited'}).eq('pincode', pincode);
  if(error){ toast('Could not update PIN: '+error.message); return; }
  toast(`${pincode} marked ${serviceable?'serviceable':'not serviceable'}`);
}
// V32.6 (item 8): the general "add a PIN code" entry point. State is
// derived automatically from the existing pincode master wherever
// possible (never invented) — City/District is always typed by Admin,
// since the master genuinely doesn't contain it (see
// FUTURE_product_catalog_migration.md-equivalent note in CHANGELOG_V32.6.md).
// If the master has no unambiguous state for this PIN (brand-new PIN,
// or one whose neighbouring PINs span more than one state), Admin must
// pick the state explicitly from the real list of configured states —
// never a free-text guess — so a typo or fabricated state can never
// silently create serviceability data that isn't backed by the master.
function pincodeQuickAddForm(){
  openModal(`<div class="eyebrow">ADD PIN CODE</div><h2>Add PIN code</h2>
    <div class="formGrid">
      <label>PIN code * <input id="qpPincode" maxlength="6" pattern="[0-9]{6}" onchange="deriveStateForQuickAdd(this.value)"></label>
      <label>State <span id="qpStateWrap"><input id="qpState" value="" placeholder="Enter PIN first" disabled></span></label>
    </div>
    <div id="qpLookupNote" class="v22-admin-help"></div>
    <div class="formGrid">
      <label>City/District * <input id="qpCity" placeholder="Manually entered — not in the PIN master"></label>
      <label>Delivery charge (₹, optional)<input id="qpCharge" type="number" min="0" step="1"></label>
      <label>Min ETA days (optional)<input id="qpMin" type="number" min="1"></label>
      <label>Max ETA days (optional)<input id="qpMax" type="number" min="1"></label>
      <label>Courier/partner (optional)<input id="qpCourier"></label>
    </div>
    <label class="checkOnly"><input id="qpServiceable" type="checkbox" checked> Serviceable</label>
    <button class="gold full" onclick="saveQuickAddPincode()">Add PIN code</button>`);
}
async function deriveStateForQuickAdd(pin){
  pin=pin.trim();
  const noteEl=document.getElementById('qpLookupNote'), stateWrap=document.getElementById('qpStateWrap');
  if(!/^\d{6}$/.test(pin)){ noteEl.textContent='Enter a valid 6-digit PIN code.'; return; }
  const {data:exact}=await sb.from('pincodes').select('pincode').eq('pincode',pin).limit(1);
  if(exact?.length){
    noteEl.innerHTML=`<b style="color:#b23">This PIN code already exists.</b> Expand its state below to edit it instead of adding a duplicate.`;
    stateWrap.innerHTML=`<input id="qpState" value="" disabled placeholder="Already exists">`;
    return;
  }
  // Derive from the real master: look at existing PINs sharing the same
  // first 3 digits (the standard India Post sorting-district prefix).
  // If they all agree on one state, prefill it read-only. If they don't
  // agree (or none exist), Admin must pick a real configured state —
  // never a typed guess.
  const prefix=pin.slice(0,3);
  const {data:neighbours}=await sb.from('pincodes').select('state').ilike('pincode',prefix+'%').limit(200);
  const states=[...new Set((neighbours||[]).map(n=>n.state))];
  if(states.length===1){
    noteEl.innerHTML=`State derived from ${neighbours.length} existing PIN code(s) starting with <b>${esc(prefix)}</b> in the master.`;
    stateWrap.innerHTML=`<input id="qpState" value="${esc(states[0])}" readonly>`;
  }else if(states.length>1){
    const {data:allStates}=await sb.from('delivery_states').select('state').order('state');
    noteEl.innerHTML=`PIN codes starting with <b>${esc(prefix)}</b> span more than one state in the master (${states.map(esc).join(', ')}) — please confirm which one this PIN actually belongs to.`;
    stateWrap.innerHTML=`<select id="qpState">${(allStates||[]).map(s=>`<option value="${esc(s.state)}" ${s.state===states[0]?'selected':''}>${esc(s.state)}</option>`).join('')}</select>`;
  }else{
    const {data:allStates}=await sb.from('delivery_states').select('state').order('state');
    noteEl.innerHTML=`No existing PIN codes near <b>${esc(prefix)}</b> to derive a state from — please pick the correct state manually.`;
    stateWrap.innerHTML=`<select id="qpState">${(allStates||[]).map(s=>`<option value="${esc(s.state)}">${esc(s.state)}</option>`).join('')}</select>`;
  }
}
async function saveQuickAddPincode(){
  const pincode=document.getElementById('qpPincode').value.trim();
  const state=document.getElementById('qpState')?.value?.trim();
  const city=document.getElementById('qpCity').value.trim();
  if(!/^\d{6}$/.test(pincode)){ toast('Enter a valid 6-digit PIN code'); return; }
  if(!state){ toast('Look up or select a state before saving — a PIN can never be added without one'); return; }
  if(!city){ toast('City/District is required — it is never auto-filled from the PIN master'); return; }
  const row={
    pincode, state, city,
    delivery_charge: document.getElementById('qpCharge').value ? Number(document.getElementById('qpCharge').value) : null,
    min_eta_days: document.getElementById('qpMin').value ? Number(document.getElementById('qpMin').value) : null,
    max_eta_days: document.getElementById('qpMax').value ? Number(document.getElementById('qpMax').value) : null,
    courier_partner: document.getElementById('qpCourier').value.trim()||null,
    serviceable: document.getElementById('qpServiceable').checked,
    source: 'admin_added'
  };
  const {error}=await sb.from('pincodes').insert(row);
  if(error){ toast('Could not add PIN code: '+error.message); return; }
  toast('PIN code added');
  closeModal(); render();
}
function pincodeForm(state){
  // V32.5 (Priority 3, item 9): show the state's current defaults so
  // Admin knows what a blank field will actually resolve to, without
  // needing to re-enter the same charge/ETA/courier for every PIN.
  const s = (window._pincodeStatesCache||[]).find(x=>x.state===state) || {};
  const hint = (label,val)=> val!=null && val!=='' ? ` — leave blank to inherit ${esc(String(val))} from ${esc(state)}'s default` : ' — no state default set for this yet';
  openModal(`<div class="eyebrow">ADD PIN CODE</div><h2>Add to ${esc(state)}</h2>
    <p class="v22-admin-help">Delivery charge/ETA/courier are optional here: leave any of them blank to automatically use ${esc(state)}'s state default (set via "Set/Edit defaults" on the Delivery page). Only fill them in if this specific PIN needs to differ.</p>
    <div class="formGrid">
      <label>PIN code * <input id="pfPincode" maxlength="6" pattern="[0-9]{6}"></label>
      <label>District/City<input id="pfCity"></label>
      <label>Delivery charge (₹, optional)${hint('charge',s.default_delivery_charge!=null?'₹'+s.default_delivery_charge:null)}<input id="pfCharge" type="number" min="0" step="1"></label>
      <label>Min ETA days (optional)${hint('min',s.default_min_eta_days)}<input id="pfMin" type="number" min="1"></label>
      <label>Max ETA days (optional)${hint('max',s.default_max_eta_days)}<input id="pfMax" type="number" min="1"></label>
      <label>Courier/partner (optional)${hint('courier',s.default_courier_partner)}<input id="pfCourier"></label>
    </div>
    <label class="checkOnly"><input id="pfServiceable" type="checkbox" checked> Serviceable</label>
    <button class="gold full" onclick="savePincode('${esc(state)}')">Add PIN code</button>`);
}
async function savePincode(state){
  const pincode = document.getElementById('pfPincode').value.trim();
  if(!/^\d{6}$/.test(pincode)){ toast('Enter a valid 6-digit PIN code'); return; }
  const row = {
    pincode, state,
    city: document.getElementById('pfCity').value.trim()||null,
    delivery_charge: document.getElementById('pfCharge').value ? Number(document.getElementById('pfCharge').value) : null,
    min_eta_days: document.getElementById('pfMin').value ? Number(document.getElementById('pfMin').value) : null,
    max_eta_days: document.getElementById('pfMax').value ? Number(document.getElementById('pfMax').value) : null,
    courier_partner: document.getElementById('pfCourier').value.trim()||null,
    serviceable: document.getElementById('pfServiceable').checked,
    source: 'admin_added'
  };
  const {error} = await sb.from('pincodes').insert(row);
  if(error){ toast('Could not add PIN code: '+error.message); return; }
  toast('PIN code added');
  closeModal(); render();
}
async function deletePincode(pincode){
  if(!confirm(`Remove PIN code ${pincode}? This does not affect any past orders.`)) return;
  const {error} = await sb.from('pincodes').delete().eq('pincode', pincode);
  if(error){ toast('Could not remove PIN: '+error.message); return; }
  toast('PIN code removed'); render();
}

/* ---------- Coupons & Offers (item 16) ----------
   Admin CRUD only in V32.6 — see the top of
   supabase_migration_coupons.sql for exactly what is/isn't wired up
   yet and why (validate_coupon() is real and server-side-authoritative,
   but nothing in the customer checkout calls it this release). */
async function couponsPage(){
  const {data:rows,error}=await sb.from('coupons').select('*').order('created_at',{ascending:false});
  if(error) return `<section class="panel"><div class="empty">Could not load coupons: ${esc(error.message)}. Has supabase_migration_coupons.sql been run?</div></section>`;
  data._coupons=rows||[];
  await fetchProducts(); await fetchCategories(); // needed for the applicable-products/categories checkboxes in couponForm()
  return `<section class="panel"><div class="catalogWarning" style="border-color:#1a7a3d;background:#e9f7ee"><b>✅ Live on the storefront</b><p>Coupons you create, edit, enable or disable here take effect immediately for customers — no redeploy needed. Every discount is checked on our server at the moment an order is placed, so an expired, disabled, over-used, or restricted coupon can never actually be applied, even if a customer's screen hadn't refreshed yet. Customers see active offers on the homepage banner, a floating offer button, and a dropdown in Cart that only lists offers their current cart actually qualifies for.</p></div>
  <div class="panelHead"><div><h2>Coupons &amp; Offers</h2><p>Percentage or fixed discounts, with optional date range, minimum order value, usage limits, and product/category restrictions.</p></div><button class="gold" onclick="couponForm()">+ Add coupon</button></div>
  <div class="comboAdmin">${(rows||[]).map(c=>`<article><span class="typeTag">${esc(c.discount_type.toUpperCase())}</span><h3>${esc(c.code)} — ${esc(c.name)}</h3><p>${esc(c.description||'')}</p><strong>${c.discount_type==='percentage'?c.discount_value+'% off':money(c.discount_value)+' off'}</strong><small>Min order ${money(c.min_order_value||0)}${c.max_discount?' · Max discount '+money(c.max_discount):''}${c.usage_limit?' · Limit '+c.usage_limit+' uses':''} · ${c.active?'Active':'Disabled'}${(c.applicable_products?.length)?' · '+c.applicable_products.length+' product(s) only':''}${(c.applicable_categories?.length)?' · '+c.applicable_categories.length+' categor'+(c.applicable_categories.length===1?'y':'ies')+' only':''}</small><div class="cardActions"><button class="outline" onclick="couponForm('${esc(c.id)}')">Edit</button><button class="outline" onclick="toggleCouponActive('${esc(c.id)}',${!c.active})">${c.active?'Disable':'Enable'}</button><button class="outline dangerBtn" onclick="deleteCoupon('${esc(c.id)}')">Delete</button></div></article>`).join('')||'<div class="empty smallEmpty">No coupons yet.</div>'}</div>
  </section>`;
}
function couponForm(id=null){
  const c=id?(data._coupons||[]).find(x=>x.id===id):{code:'',name:'',description:'',active:true,start_date:'',end_date:'',discount_type:'percentage',discount_value:'',min_order_value:0,max_discount:'',usage_limit:'',per_customer_limit:1,applicable_products:[],applicable_categories:[]};
  const selProducts = c.applicable_products||[], selCategories = c.applicable_categories||[];
  openModal(`<div class="eyebrow">COUPON</div><h2>${id?'Edit coupon':'Add coupon'}</h2>
  <div class="formGrid">
    <label>Code * <input id="cpCode" value="${esc(c.code)}" placeholder="WELCOME10" style="text-transform:uppercase"></label>
    <label>Name * <input id="cpName" value="${esc(c.name)}"></label>
    <label class="fullLabel">Description<textarea id="cpDesc" rows="2">${esc(c.description||'')}</textarea></label>
    <label>Discount type<select id="cpType"><option value="percentage" ${c.discount_type==='percentage'?'selected':''}>Percentage</option><option value="fixed" ${c.discount_type==='fixed'?'selected':''}>Fixed amount (₹)</option></select></label>
    <label>Discount value * <input id="cpValue" type="number" min="0" step="0.01" value="${c.discount_value}"></label>
    <label>Minimum order value (₹)<input id="cpMin" type="number" min="0" value="${c.min_order_value||0}"></label>
    <label>Maximum discount (₹, optional — caps a percentage)<input id="cpMax" type="number" min="0" value="${c.max_discount??''}"></label>
    <label>Total usage limit (optional)<input id="cpLimit" type="number" min="1" value="${c.usage_limit??''}"></label>
    <label>Per-customer limit<input id="cpPerCustomer" type="number" min="1" value="${c.per_customer_limit??1}"></label>
    <label>Start date (optional)<input id="cpStart" type="date" value="${c.start_date?String(c.start_date).slice(0,10):''}"></label>
    <label>End date (optional)<input id="cpEnd" type="date" value="${c.end_date?String(c.end_date).slice(0,10):''}"></label>
  </div>
  <div class="formSection"><h3>Product restriction (optional)</h3><p>Leave nothing checked to allow every product. If any are checked, this coupon only applies when <b>every</b> item in the cart is one of these (server-enforced — see <code>public.validate_coupon</code>).</p><div class="checkGrid">${(data.products||[]).map(p=>`<label><input type="checkbox" class="cpProducts" value="${esc(p.id)}" ${selProducts.includes(p.id)?'checked':''}> ${esc(p.name)}</label>`).join('')||'<span class="tiny">No products yet.</span>'}</div></div>
  <div class="formSection"><h3>Category restriction (optional)</h3><p>Leave nothing checked to allow every category. If both product and category restrictions are set, the cart must satisfy both.</p><div class="checkGrid">${(data.categories||[]).map(cat=>`<label><input type="checkbox" class="cpCategories" value="${esc(cat.id)}" ${selCategories.includes(cat.id)?'checked':''}> ${esc(cat.name)}</label>`).join('')||'<span class="tiny">No categories yet.</span>'}</div></div>
  <label class="checkOnly"><input id="cpActive" type="checkbox" ${c.active!==false?'checked':''}> Active</label>
  <button class="gold full" onclick="saveCoupon('${id?esc(id):''}')">Save coupon</button>`);
}
async function saveCoupon(id){
  const row={
    code:document.getElementById('cpCode').value.trim().toUpperCase(),
    name:document.getElementById('cpName').value.trim(),
    description:document.getElementById('cpDesc').value.trim()||null,
    discount_type:document.getElementById('cpType').value,
    discount_value:Number(document.getElementById('cpValue').value||0),
    min_order_value:Number(document.getElementById('cpMin').value||0),
    max_discount:document.getElementById('cpMax').value?Number(document.getElementById('cpMax').value):null,
    usage_limit:document.getElementById('cpLimit').value?Number(document.getElementById('cpLimit').value):null,
    per_customer_limit:document.getElementById('cpPerCustomer').value?Number(document.getElementById('cpPerCustomer').value):null,
    start_date:document.getElementById('cpStart').value||null,
    end_date:document.getElementById('cpEnd').value||null,
    active:document.getElementById('cpActive').checked,
    applicable_products:[...document.querySelectorAll('.cpProducts:checked')].map(x=>x.value),
    applicable_categories:[...document.querySelectorAll('.cpCategories:checked')].map(x=>x.value)
  };
  if(!row.code||!row.name||!row.discount_value){ toast('Code, name, and discount value are required'); return; }
  const {error}=id?await sb.from('coupons').update(row).eq('id',id):await sb.from('coupons').insert(row);
  if(error){ toast('Could not save coupon: '+error.message); return; }
  toast('Coupon saved'); closeModal(); render();
}
async function toggleCouponActive(id,active){
  const {error}=await sb.from('coupons').update({active}).eq('id',id);
  if(error){ toast('Could not update coupon: '+error.message); return; }
  render();
}
async function deleteCoupon(id){
  if(!confirm('Delete this coupon? Past redemption history is kept for records.')) return;
  const {error}=await sb.from('coupons').delete().eq('id',id);
  if(error){ toast('Could not delete: '+error.message); return; }
  render();
}

/* ---------- Social links (item 14) ---------- */
const SOCIAL_PLATFORM_LABELS={whatsapp:'WhatsApp',instagram:'Instagram',facebook:'Facebook',youtube:'YouTube',x:'X / Twitter',linkedin:'LinkedIn',other:'Other / custom'};
async function socialLinksPage(){
  const {data:rows,error}=await sb.from('social_links').select('*').order('display_order');
  if(error) return `<section class="panel"><div class="empty">Could not load social links: ${esc(error.message)}. Has supabase_migration_social_links.sql been run?</div></section>`;
  data._socialLinks=rows||[];
  return `<section class="panel"><div class="panelHead"><div><h2>Social Links</h2><p>Controls the footer's "Connect" links. Only enabled links appear, in this order.</p></div><button class="gold" onclick="socialLinkForm()">+ Add link</button></div>
  <div class="categoryTable">${(rows||[]).map((s,i)=>`<div class="categoryRow"><span><b>${esc(SOCIAL_PLATFORM_LABELS[s.platform]||s.platform)}</b><small>${esc(s.label||s.url)}</small></span><strong>${s.display_order}</strong><span class="${s.enabled?'good':'danger'}">${s.enabled?'VISIBLE':'HIDDEN'}</span><button class="outline" onclick="socialLinkForm('${esc(s.id)}')">Edit</button><button class="outline dangerBtn" onclick="deleteSocialLink('${esc(s.id)}')">Delete</button></div>`).join('')||'<div class="empty smallEmpty">No social links yet.</div>'}</div>
  </section>`;
}
function socialLinkForm(id=null){
  const s=id?(data._socialLinks||[]).find(x=>x.id===id):{platform:'whatsapp',label:'',url:'',enabled:true,display_order:(data._socialLinks?.length||0)+1};
  openModal(`<div class="eyebrow">SOCIAL LINK</div><h2>${id?'Edit link':'Add link'}</h2>
  <div class="formGrid">
    <label>Platform<select id="slPlatform">${Object.entries(SOCIAL_PLATFORM_LABELS).map(([k,v])=>`<option value="${k}" ${s.platform===k?'selected':''}>${v}</option>`).join('')}</select></label>
    <label>Label (optional — shown as-is for "Other")<input id="slLabel" value="${esc(s.label||'')}"></label>
    <label class="fullLabel">URL * <input id="slUrl" value="${esc(s.url||'')}" placeholder="https://..."></label>
    <label>Display position<input id="slOrder" type="number" value="${s.display_order||1}"></label>
  </div>
  <label class="checkOnly"><input id="slEnabled" type="checkbox" ${s.enabled!==false?'checked':''}> Visible in footer</label>
  <button class="gold full" onclick="saveSocialLink('${id?esc(id):''}')">Save link</button>`);
}
async function saveSocialLink(id){
  const row={
    platform:document.getElementById('slPlatform').value,
    label:document.getElementById('slLabel').value.trim()||null,
    url:document.getElementById('slUrl').value.trim(),
    display_order:Number(document.getElementById('slOrder').value||1),
    enabled:document.getElementById('slEnabled').checked
  };
  if(!row.url){ toast('URL is required'); return; }
  const {error}=id?await sb.from('social_links').update(row).eq('id',id):await sb.from('social_links').insert(row);
  if(error){ toast('Could not save link: '+error.message); return; }
  toast('Social link saved'); closeModal(); render();
}
async function deleteSocialLink(id){
  if(!confirm('Remove this social link?')) return;
  const {error}=await sb.from('social_links').delete().eq('id',id);
  if(error){ toast('Could not delete: '+error.message); return; }
  render();
}

async function exportPincodes(){
  toast('Preparing export — this may take a moment for the full list...');
  let all = [], from = 0, pageSize = 1000, more = true;
  while(more){
    const {data, error} = await sb.from('pincodes').select('pincode,state,district,city,serviceable,delivery_zone,delivery_charge,min_eta_days,max_eta_days,courier_partner,cod_available,active').range(from, from+pageSize-1).order('pincode');
    if(error){ toast('Export failed: '+error.message); return; }
    all = all.concat(data||[]);
    more = (data||[]).length===pageSize;
    from += pageSize;
  }
  const headers = ['pincode','state','district','city','serviceable','delivery_zone','delivery_charge','min_eta_days','max_eta_days','courier_partner','cod_available','active'];
  const csv = [headers.join(',')].concat(all.map(r=>headers.map(h=>{
    const v = r[h]; return v==null?'':String(v).includes(',')?`"${v}"`:v;
  }).join(','))).join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `jayvi-pincodes-export-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  toast(`Exported ${all.length} PIN codes`);
}
function parseCsvLine(line){
  // Minimal CSV parser handling quoted fields with commas — sufficient
  // for the fixed export format above, not a general-purpose parser.
  const out=[]; let cur=''; let inQ=false;
  for(let i=0;i<line.length;i++){
    const c=line[i];
    if(inQ){ if(c==='"'){ if(line[i+1]==='"'){cur+='"';i++;} else inQ=false; } else cur+=c; }
    else { if(c==='"') inQ=true; else if(c===','){out.push(cur);cur='';} else cur+=c; }
  }
  out.push(cur);
  return out;
}
async function importPincodesFile(file){
  if(!file) return;
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(l=>l.trim().length);
  if(!lines.length){ toast('Empty file'); return; }
  const headers = parseCsvLine(lines[0]).map(h=>h.trim());
  const required = ['pincode','state'];
  const missing = required.filter(h=>!headers.includes(h));
  if(missing.length){ toast('Missing required column(s): '+missing.join(', ')); return; }

  const knownStates = new Set((window._pincodeStatesCache||[]).map(s=>s.state));
  const seen = new Set();
  const valid = [], invalid = [], duplicates = [];
  for(let i=1;i<lines.length;i++){
    const cells = parseCsvLine(lines[i]);
    const row = {}; headers.forEach((h,idx)=>row[h]=(cells[idx]||'').trim());
    const errors = [];
    if(!/^\d{6}$/.test(row.pincode)) errors.push('PIN must be exactly 6 digits');
    if(!row.state) errors.push('state is required');
    else if(!knownStates.has(row.state)) errors.push(`unknown state "${row.state}" — add it as a state first`);
    if(row.serviceable && !['true','false','True','False','1','0',''].includes(row.serviceable)) errors.push('serviceable must be true/false');
    if(seen.has(row.pincode)) duplicates.push(row.pincode);
    seen.add(row.pincode);
    if(errors.length) invalid.push({row: i+1, pincode:row.pincode, errors});
    else valid.push({
      pincode: row.pincode, state: row.state,
      district: row.district||null, city: row.city||null,
      serviceable: row.serviceable ? ['true','1'].includes(row.serviceable.toLowerCase()) : true,
      delivery_zone: row.delivery_zone||null,
      delivery_charge: row.delivery_charge?Number(row.delivery_charge):null,
      min_eta_days: row.min_eta_days?Number(row.min_eta_days):null,
      max_eta_days: row.max_eta_days?Number(row.max_eta_days):null,
      courier_partner: row.courier_partner||null,
      cod_available: ['true','1'].includes((row.cod_available||'').toLowerCase()),
      active: row.active ? ['true','1'].includes(row.active.toLowerCase()) : true,
      source: 'admin_import'
    });
  }
  window._pendingImport = valid;
  document.getElementById('importPreview').innerHTML = `<div class="infoBox" style="margin-top:16px">
    <b>Import validation complete</b>
    Total rows: ${lines.length-1}<br>Valid: ${valid.length}<br>Invalid: ${invalid.length}<br>Duplicate PINs in file: ${duplicates.length}
    ${invalid.length?`<details style="margin-top:8px"><summary>View errors (${invalid.length})</summary>${invalid.slice(0,50).map(e=>`Row ${e.row} (${esc(e.pincode)}): ${esc(e.errors.join('; '))}`).join('<br>')}${invalid.length>50?'<br>…and '+(invalid.length-50)+' more':''}</details>`:''}
    <div class="cardActions" style="margin-top:10px">
      <button class="gold" onclick="confirmImportPincodes()">Import ${valid.length} valid record${valid.length===1?'':'s'}</button>
      <button class="outline" onclick="document.getElementById('importPreview').innerHTML='';window._pendingImport=null">Cancel</button>
    </div>
  </div>`;
}
async function confirmImportPincodes(){
  const rows = window._pendingImport||[];
  if(!rows.length){ toast('Nothing to import'); return; }
  toast('Importing '+rows.length+' records...');
  const CHUNK=500;
  for(let i=0;i<rows.length;i+=CHUNK){
    const {error} = await sb.from('pincodes').upsert(rows.slice(i,i+CHUNK), {onConflict:'pincode'});
    if(error){ toast('Import failed partway ('+i+' of '+rows.length+'): '+error.message); return; }
  }
  toast('Import complete: '+rows.length+' records');
  window._pendingImport = null;
  document.getElementById('importPreview').innerHTML='';
  render();
}

async function settingsPage(){
 await fetchStoreSettings();
 const s=data.store;
 return `<section class="settingsGrid">
 <article class="settingCard"><span class="typeTag">STORE OPERATIONS</span><h2>Ordering</h2>
 <label class="toggleRow"><span>Vacation mode<small>Pause ordering without changing product stock.</small></span><input id="setVacation" type="checkbox" ${s.vacationMode?'checked':''}></label>
 <label class="toggleRow"><span>Delivery enabled<small>Master switch — OFF stops checkout storefront-wide with "Delivery is currently unavailable. Please try again later." (checked both when a PIN is verified and again, server-side, when the order is placed). Separate from, and checked before, individual state/PIN serviceability below.</small></span><input id="setDeliveryEnabled" type="checkbox" ${s.deliveryMode==='india'?'checked':''}></label>
 <label>Vacation message<textarea id="setVacationMsg" rows="3">${esc(s.vacationMessage||'')}</textarea></label>
 <div class="two"><label>Delivery minimum days<input id="setMin" type="number" min="1" value="${s.deliveryMinDays||4}"></label><label>Delivery maximum days<input id="setMax" type="number" min="1" value="${s.deliveryMaxDays||8}"></label></div>
 <div class="two"><label>Free shipping above<input id="setFree" type="number" value="${s.freeShippingThreshold||599}"></label><label>Shipping charge<input id="setShip" type="number" value="${s.shippingFlat||49}"></label></div>
 <label>Refund processing time (business days) <small class="v22-admin-help">Used in cancellation/refund messages to customers — item E/X, not hard-coded.</small><input id="setRefundDays" type="number" min="1" value="${s.refundBusinessDays||4}"></label>
 <label>Announcement scroll speed<select id="setAnnouncementSpeed"><option value="slow" ${s.announcementSpeed==='slow'?'selected':''}>Slow</option><option value="normal" ${!s.announcementSpeed||s.announcementSpeed==='normal'?'selected':''}>Normal</option><option value="fast" ${s.announcementSpeed==='fast'?'selected':''}>Fast</option></select></label>
 <label>Homepage review count <small class="v22-admin-help">How many customer-submitted reviews show on the homepage before "View all."</small><input id="setReviewCount" type="number" min="1" max="12" value="${s.homepageReviewCount||6}"></label>
 <button class="gold full" onclick="saveStoreOperations()">Save operations</button></article>
 <article class="settingCard"><span class="typeTag">PAYMENT</span><h2>Payment methods</h2>
 <label class="toggleRow"><span>UPI QR<small>Primary payment method.</small></span><input id="setUpi" type="checkbox" ${s.upiEnabled!==false?'checked':''}></label>
 <label class="toggleRow"><span>Cash on Delivery<small>Show/hide COD at checkout.</small></span><input id="setCod" type="checkbox" ${s.codEnabled?'checked':''}></label>
 <label class="toggleRow"><span>Razorpay<small>Optional future gateway.</small></span><input id="setRazor" type="checkbox" ${s.razorpayEnabled?'checked':''}></label>
 <label>UPI ID<input id="setUpiId" value="${esc(s.upiId||'')}" placeholder="yourupi@bank"></label><label>UPI display name<input id="setUpiName" value="${esc(s.upiName||'Jayvi Foods')}"></label>
 <label>Merchant Category Code (MCC) <small class="v22-admin-help">Required for the "Pay with UPI app" deep link to work on this VPA — get it from ICICI/Eazypay onboarding (not something we can guess). Without it, some UPI apps reject the link with "receiver not accepting payments" / "not permitted by PSP" even though the same VPA works fine when paid to manually.</small><input id="setUpiMc" value="${esc(s.upiMc||'')}" placeholder="e.g. 5411" maxlength="4"></label>
 <label>UPI QR code <small class="v22-admin-help">Upload the QR image below — it's stored in Supabase Storage and works on the live site regardless of repo file paths. You can still paste a path/URL directly in the field instead if you prefer.</small></label>
 <div id="upiQrPreviewBox">${renderUpiQrPreview(s.upiQrImage||'')}</div>
 <input id="setQr" value="${esc(s.upiQrImage||'')}" placeholder="images/jayvi-upi.webp or a full https:// URL" oninput="document.getElementById('upiQrPreviewBox').innerHTML=renderUpiQrPreview(this.value)">
 <div id="upiQrUploadStatus" style="font-size:11px;color:#888;margin-top:4px"></div>
 <label class="outline uploadBtn" style="margin-top:8px">📷 Upload QR image<input type="file" accept="image/webp,image/jpeg,image/png" style="display:none" onchange="uploadUpiQrFile(event)"></label>
 <label>Razorpay Key ID<input id="setRzp" value="${esc(s.razorpayKeyId||'')}" placeholder="Add later"></label>
 <button class="gold full" onclick="savePayments()">Save payment settings</button></article>
 <article class="settingCard"><span class="typeTag">CUSTOMER LOGIN</span><h2>Authentication</h2><div class="infoBox"><b>User ID = mobile number</b><p>Password login is active. OTP is a future option and can remain disabled until a provider is configured.</p></div>
 <label class="toggleRow"><span>Password login<small>Current primary login.</small></span><input type="checkbox" checked disabled></label>
 <label class="toggleRow"><span>OTP login<small>If enabled without a provider, storefront shows “OTP service not available yet”.</small></span><input id="setOtp" type="checkbox" ${s.otpEnabled?'checked':''}></label>
 <label>OTP provider<input id="setOtpProvider" value="${esc(s.otpProvider||'Not configured')}" placeholder="Provider name later"></label><button class="gold full" onclick="saveAuth()">Save authentication settings</button></article>
 <article class="settingCard"><span class="typeTag">LOCATION & PIN</span><h2>Address validation</h2><p>Google Maps is optional. Manual address entry must always remain available.</p>
 <label>Google Maps API key<input id="setMaps" value="${esc(s.googleMapsApiKey||'')}" placeholder="Add later"></label>
 <div class="infoBox"><b>PIN validation</b><p>Planned production source: Government of India All India Pincode Directory. We will import/refresh the trusted dataset on the backend and separately maintain Jayvi serviceability. Admin will not manually maintain thousands of PINs.</p></div>
 <label>Google reviews URL<input id="setGoogleReviews" value="${esc(s.googleReviewsUrl||'')}"></label><button class="gold full" onclick="saveLocationSettings()">Save location settings</button></article>
 <article class="settingCard"><span class="typeTag">NOTIFICATIONS</span><h2>Customer updates</h2><div class="infoBox"><b>WhatsApp automation</b><p>Framework is prepared for order-status messages. Automated Business API connection will be added later. Manual WhatsApp update can already be used from an order.</p></div>
 <label>WhatsApp number<input id="setWhatsApp" value="${esc(s.whatsapp||'')}"></label><label>Instagram URL<input id="setInstagram" value="${esc(s.instagram||'')}"></label><button class="gold full" onclick="saveContactSettings()">Save contact settings</button></article>
 </section>`;
}
async function saveStoreOperations(){data.store.vacationMode=document.getElementById('setVacation').checked;data.store.deliveryMode=document.getElementById('setDeliveryEnabled').checked?'india':'disabled';data.store.vacationMessage=document.getElementById('setVacationMsg').value.trim();data.store.deliveryMinDays=Number(document.getElementById('setMin').value||4);data.store.deliveryMaxDays=Number(document.getElementById('setMax').value||8);data.store.freeShippingThreshold=Number(document.getElementById('setFree').value||599);data.store.shippingFlat=Number(document.getElementById('setShip').value||49);data.store.refundBusinessDays=Number(document.getElementById('setRefundDays').value||4);data.store.announcementSpeed=document.getElementById('setAnnouncementSpeed').value;data.store.homepageReviewCount=Number(document.getElementById('setReviewCount').value||6);const ok=await saveStoreSettingsToSupabase();if(!ok)return;render()}
// Small preview so Admin can see immediately whether the configured
// QR path/URL actually resolves to an image — same broken-path bug
// (an admin-entered filename that doesn't match any real file/Storage
// object) is now visible here instead of only being discovered by a
// customer at checkout. Mirrors resolveUpiQrSrc()'s logic in app.js.
function renderUpiQrPreview(raw){
  // Inline-styled rather than relying on the .upiQr/.tiny classes,
  // since those are defined in style.css (storefront), which
  // admin.html/admin.css does not load — keeps this self-contained
  // without pulling in an extra stylesheet just for this preview.
  const boxStyle='max-width:180px;max-height:180px;border-radius:8px;display:flex;align-items:center;justify-content:center;text-align:center;padding:16px;background:#f4f4f4;color:#888;font-size:12px';
  const p = String(raw||'').trim();
  if(!p) return `<div style="${boxStyle}"><span><b>UPI QR</b><br>No QR set yet</span></div>`;
  const src = /^https?:\/\//i.test(p) ? p : p.replace(/^\/+/, '');
  return `<img src="${esc(src)}" alt="UPI QR preview" style="max-width:180px;max-height:180px;border-radius:8px;display:block;border:1px solid #ddd" onerror="this.outerHTML='&lt;div style=&quot;${boxStyle}&quot;&gt;&lt;span&gt;&lt;b&gt;Could not load&lt;/b&gt;&lt;br&gt;This path/URL does not resolve to an image&lt;/span&gt;&lt;/div&gt;'">`;
}
// Same Storage upload pattern as uploadAnnouncementFile()/uploadMediaFile()
// — uploads into the dedicated 'payment-media' bucket (see
// supabase_migration_upi_payment_fix.sql for the bucket + policies),
// then writes the resulting public URL straight into the #setQr field
// so it gets saved by the normal "Save payment settings" button below.
// A public Storage URL works on the deployed GitHub Pages site
// regardless of repo file layout, which is what was actually broken
// before (an admin-entered filename that didn't match any real file).
async function uploadUpiQrFile(evt){
  const file=evt.target.files?.[0]; if(!file) return;
  const statusEl=document.getElementById('upiQrUploadStatus');
  const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,'-').toLowerCase();
  const path=`${Date.now()}-${safeName}`;
  if(statusEl) statusEl.textContent=`Uploading ${file.name}...`;
  const {error:upErr}=await sb.storage.from('payment-media').upload(path,file,{cacheControl:'31536000',upsert:false});
  if(upErr){
    if(statusEl) statusEl.textContent='';
    toast('Upload failed: '+upErr.message+' — has supabase_migration_upi_payment_fix.sql been run, and does the payment-media bucket exist yet?');
    evt.target.value=''; return;
  }
  const {data:pub}=sb.storage.from('payment-media').getPublicUrl(path);
  const input=document.getElementById('setQr');
  if(input) input.value=pub.publicUrl;
  const previewBox=document.getElementById('upiQrPreviewBox');
  if(previewBox) previewBox.innerHTML=renderUpiQrPreview(pub.publicUrl);
  if(statusEl) statusEl.textContent=`Uploaded ${file.name}. Click "Save payment settings" to apply.`;
  evt.target.value='';
}
async function savePayments(){data.store.upiEnabled=document.getElementById('setUpi').checked;data.store.codEnabled=document.getElementById('setCod').checked;data.store.razorpayEnabled=document.getElementById('setRazor').checked;data.store.upiId=document.getElementById('setUpiId').value.trim();data.store.upiName=document.getElementById('setUpiName').value.trim();data.store.upiMc=document.getElementById('setUpiMc').value.trim();data.store.upiQrImage=document.getElementById('setQr').value.trim();data.store.razorpayKeyId=document.getElementById('setRzp').value.trim();const ok=await saveStoreSettingsToSupabase();if(!ok)return;render()}
async function saveAuth(){data.store.otpEnabled=document.getElementById('setOtp').checked;data.store.otpProvider=document.getElementById('setOtpProvider').value.trim()||'Not configured';const ok=await saveStoreSettingsToSupabase();if(!ok)return;render()}
async function saveLocationSettings(){data.store.googleMapsApiKey=document.getElementById('setMaps').value.trim();data.store.googleReviewsUrl=document.getElementById('setGoogleReviews').value.trim();const ok=await saveStoreSettingsToSupabase();if(!ok)return;render()}
async function saveContactSettings(){data.store.whatsapp=document.getElementById('setWhatsApp').value.trim();data.store.instagram=document.getElementById('setInstagram').value.trim();const ok=await saveStoreSettingsToSupabase();if(!ok)return;render()}
function openModal(html){document.getElementById('modalBody').innerHTML=html;document.getElementById('modal').classList.add('open')}
function closeModal(){document.getElementById('modal').classList.remove('open')}
document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});

/* ---------- Back-button / history sync (item 12) ---------- */
// Small and deliberately not a routing framework, matching the app.js
// approach: Dashboard → Products → (Edit) Product modal, then Back
// closes the modal back to Products, Back again returns to Dashboard —
// instead of the browser Back button leaving Admin entirely or landing
// somewhere unrelated. Tab switches (setTab) push one history entry
// each; the modal's open/close is tracked the same class-attribute-
// watching way app.js uses for its overlays, so every one of the many
// openModal(...) call sites across this file is covered automatically.
let _adminPushedForModal=false;
function pushAdminHistory(t){ history.pushState({jayviAdminTab:t}, '', location.href); }
(function initAdminBackNavigation(){
  history.replaceState({jayviAdminTab:tab}, '', location.href);
  const modalEl=document.getElementById('modal');
  const observer=new MutationObserver(()=>{
    const isOpen=modalEl.classList.contains('open');
    if(isOpen && !_adminPushedForModal){
      _adminPushedForModal=true;
      history.pushState({jayviAdminModal:true}, '', location.href);
    }else if(!isOpen && _adminPushedForModal){
      _adminPushedForModal=false;
      if(history.state?.jayviAdminModal) history.back();
    }
  });
  observer.observe(modalEl,{attributes:true,attributeFilter:['class']});
  window.addEventListener('popstate', e=>{
    if(modalEl.classList.contains('open')){
      // Back while the modal is open: close it, don't touch the tab.
      closeModal(); _adminPushedForModal=false; return;
    }
    const t=e.state?.jayviAdminTab;
    if(t){
      tab=t;
      document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));
      render();
    }
  });
})();
requireAdminSession().then(async ok=>{ if(ok){ await fetchProducts(); await fetchCombos(); render(); } });
/* Jayvi Foods V22 Admin polish */
(function(){
'use strict';
// =====================================================================
// V32.13 — CRITICAL FIX: every function below that is called from an
// inline onclick="…"/onchange="…" HTML attribute (or, in galleryPage()'s
// case, from render() outside this closure) MUST be reachable from the
// global scope, because inline event-handler attributes are evaluated
// against `window`, not against this IIFE's local scope. A plain
// `function foo(){}` declared inside `(function(){ ... })()` is only a
// local binding — it is invisible to inline HTML attributes and to code
// outside this closure, even though it looks identical to a normal
// top-level function declaration everywhere else in this file.
//
// This was the actual root cause of both V32.3 blockers reported after
// live testing:
//   - Announcement admin: clicking the General/Product radio, the
//     Product/Combo sub-choice, or the CTA-type select all called
//     onchange="renderAnnouncementTypeFields()" / "updateCtaTargetVisibility()"
//     — both undefined in global scope, so the click silently did
//     nothing (a ReferenceError thrown inside an inline handler doesn't
//     crash the page, it just aborts that one handler). Same for
//     onchange="uploadAnnouncementFile(...)" and
//     onclick="removeAnnouncementMedia()" — the upload/replace/remove
//     buttons visibly did nothing because the call never even reached
//     Supabase Storage.
//   - Gallery: render()'s dispatcher (`if(tab==='gallery')h=await
//     galleryPage();`) lives OUTSIDE this closure and could not see
//     galleryPage() either — calling it threw before render() ever
//     reached `app.innerHTML=h`, leaving the "Loading…" placeholder
//     (set at the top of render()) on screen forever, on every visit,
//     regardless of whether there were 0 or 100 gallery rows.
//
// The fix is to explicitly re-export every such function onto `window`
// (function DECLARATIONS are hoisted, so this works regardless of where
// in the file each one is textually defined below). Nothing about how
// these functions behave has changed — only their reachability.
window.renderAnnouncementTypeFields = function(){ return renderAnnouncementTypeFields.apply(this, arguments); };
window.updateCtaTargetVisibility = function(){ return updateCtaTargetVisibility.apply(this, arguments); };
window.uploadAnnouncementFile = function(){ return uploadAnnouncementFile.apply(this, arguments); };
window.removeAnnouncementMedia = function(){ return removeAnnouncementMedia.apply(this, arguments); };
window.galleryPage = function(){ return galleryPage.apply(this, arguments); };
window.uploadGalleryFiles = function(){ return uploadGalleryFiles.apply(this, arguments); };
window.updateGalleryCaption = function(){ return updateGalleryCaption.apply(this, arguments); };
window.toggleGalleryActive = function(){ return toggleGalleryActive.apply(this, arguments); };
window.moveGalleryItem = function(){ return moveGalleryItem.apply(this, arguments); };
window.deleteGalleryItem = function(){ return deleteGalleryItem.apply(this, arguments); };
// (Wrapped in a tiny forwarding function, rather than
// `window.foo = foo;`, purely so hoisting order can never matter here —
// each wrapper only looks up the real function by name at CALL time,
// well after every function declaration below has been hoisted.)

// V32.3 — full rewrite of the announcement form (spec 3-8): explicit
// General/Product typing (decoupled from the click-action concept),
// a proper single-media upload/preview/replace/remove UI matching
// Product → Media, and safe Storage cleanup on delete/replace.
window.announcementForm=function(index=-1){
 const s=index>=0?data.announcements[index]:{id:'',label:'',title:'',em:'',text:'',image:'',mediaType:'image',posterUrl:'',showPrice:true,announcementType:'general',targetType:'',actionType:'shop',actionTarget:'',productId:'',comboId:'',active:true,order:data.announcements.length+1};
 window._announcementDraft=s;
 window._annDraft={image:s.image||'',mediaType:s.mediaType||'image',posterUrl:s.posterUrl||''};
 openModal(`<div class="eyebrow">HOMEPAGE ANNOUNCEMENT</div><h2>${index<0?'Add announcement':'Edit announcement'}</h2><div class="formGrid"><label>Label<input id="aLabel" value="${esc(s.label||'')}"></label><label>Title<input id="aTitle" value="${esc(s.title||'')}"></label><label>Emphasis<input id="aEm" value="${esc(s.em||'')}"></label><label>Display position<input id="aOrder" type="number" value="${s.order||1}"></label><label class="fullLabel">Message<textarea id="aText" rows="3">${esc(s.text||'')}</textarea></label></div>
<div class="formSection">
  <h3>Announcement type</h3>
  <p>A General announcement (e.g. "Independence Day special") needs no product. A Product announcement (e.g. "Peanut Chutney — perfect for breakfast") is explicitly linked to one product or combo — that link drives both the click destination and the media fallback, separate from any custom media below.</p>
  <label class="checkOnly"><input type="radio" name="aType" value="general" ${s.announcementType!=='product'?'checked':''} onchange="renderAnnouncementTypeFields()"> General announcement</label>
  <label class="checkOnly"><input type="radio" name="aType" value="product" ${s.announcementType==='product'?'checked':''} onchange="renderAnnouncementTypeFields()"> Product announcement</label>
  <div id="aTypeFields" class="formGrid" style="margin-top:10px"></div>
</div>
<div class="formSection">
  <h3>Announcement media</h3>
  <p>Optional. One image <b>or</b> one video — never both. If a Product announcement has no custom media, the linked product/combo's own image is used automatically.</p>
  <div id="aMediaBlockInner"></div>
  <div id="aMediaUploadStatus" class="mediaUploadStatus"></div>
</div>
<label class="checkOnly"><input id="aShowPrice" type="checkbox" ${s.showPrice!==false?'checked':''}> Show price badge (Product announcements only)</label>
<label class="checkOnly"><input id="aActive" type="checkbox" ${s.active!==false?'checked':''}> Active</label>
<button class="gold full" onclick="saveAnnouncement(${index})">Save announcement</button>`);
 renderAnnouncementTypeFields();
 renderAnnouncementMediaPreview();
};
// Renders the "type-specific" half of the form: for Product, a
// Product/Combo sub-choice + the matching select (spec 3: the
// association is explicit and separate from any click-action idea);
// for General, an optional CTA link (spec 9: "General announcement —
// it can have an optional CTA/link").
function renderAnnouncementTypeFields(){
  const box=document.getElementById('aTypeFields'); if(!box) return;
  const type=document.querySelector('input[name="aType"]:checked')?.value||'general';
  const s=window._announcementDraft||{};
  if(type==='product'){
    const targetType=document.querySelector('input[name="aTargetType"]:checked')?.value || s.targetType || (s.comboId?'combo':'product');
    const productOptions=(data.products||[]).filter(p=>p.active).map(p=>`<option value="${esc(p.id)}" ${p.id===s.productId?'selected':''}>${esc(p.name)}</option>`).join('');
    const comboOptions=(data.combos||[]).filter(c=>c.active).map(c=>`<option value="${esc(c.id)}" ${c.id===s.comboId?'selected':''}>${esc(c.name)}</option>`).join('');
    box.innerHTML=`
      <label class="checkOnly"><input type="radio" name="aTargetType" value="product" ${targetType!=='combo'?'checked':''} onchange="renderAnnouncementTypeFields()"> Product</label>
      <label class="checkOnly"><input type="radio" name="aTargetType" value="combo" ${targetType==='combo'?'checked':''} onchange="renderAnnouncementTypeFields()"> Combo</label>
      <label class="fullLabel">Select ${targetType==='combo'?'combo':'product'}<select id="aTargetSelect">${(targetType==='combo'?comboOptions:productOptions)||'<option value="">No active items</option>'}</select></label>
      <p class="v22-admin-help">Clicking this announcement opens the selected ${targetType==='combo'?'combo':'product'} directly.</p>`;
  } else {
    const cta=s.announcementType==='product'?'shop':(s.actionType||'shop');
    box.innerHTML=`
      <label class="fullLabel">Optional link (CTA)<select id="aCtaType" onchange="updateCtaTargetVisibility()">
        <option value="none" ${cta==='none'?'selected':''}>None</option>
        <option value="shop" ${cta==='shop'?'selected':''}>Open Shop</option>
        <option value="reviews" ${cta==='reviews'?'selected':''}>Open Reviews</option>
        <option value="url" ${cta==='url'?'selected':''}>External link</option>
      </select></label>
      <div id="aCtaTargetWrap" class="fullLabel">${cta==='url'?`<label class="fullLabel">Link URL<input id="aCtaTarget" value="${esc(s.actionType==='url'?(s.actionTarget||''):'')}" placeholder="https://..."></label>`:''}</div>`;
  }
}
function updateCtaTargetVisibility(){
  const type=document.getElementById('aCtaType')?.value;
  const wrap=document.getElementById('aCtaTargetWrap'); if(!wrap) return;
  wrap.innerHTML = type==='url' ? `<label class="fullLabel">Link URL<input id="aCtaTarget" placeholder="https://..."></label>` : '';
}
// Single-media preview/replace/remove UI (spec 4) — mirrors the visual
// language of Product → Media but enforces the "one image OR one
// video, never both, never multiple" rule structurally: there is only
// ever one slot, so there is nothing to add once it's filled, only
// Replace or Remove.
function renderAnnouncementMediaPreview(){
  const box=document.getElementById('aMediaBlockInner'); if(!box) return;
  const d=window._annDraft||{};
  if(!d.image){
    box.innerHTML=`<div class="mediaUploadRow">
      <label class="outline uploadBtn">📷 + Add Photo<input type="file" accept="image/webp,image/jpeg,image/png,image/avif" style="display:none" onchange="uploadAnnouncementFile(event,'image')"></label>
      <label class="outline uploadBtn">🎬 + Add Video<input type="file" accept="video/mp4,video/webm" style="display:none" onchange="uploadAnnouncementFile(event,'video')"></label>
    </div>`;
    return;
  }
  const preview = d.mediaType==='video'
    ? `<video src="${esc(d.image)}" ${d.posterUrl?`poster="${esc(d.posterUrl)}"`:''} controls style="max-width:220px;max-height:220px;border-radius:8px;display:block"></video>`
    : `<img src="${esc(d.image)}" alt="" style="max-width:220px;max-height:220px;border-radius:8px;display:block">`;
  box.innerHTML=`<div class="mediaSinglePreview">${preview}<div class="mediaUploadRow">
      <label class="outline small uploadBtn">Replace<input type="file" accept="${d.mediaType==='video'?'video/mp4,video/webm':'image/webp,image/jpeg,image/png,image/avif'}" style="display:none" onchange="uploadAnnouncementFile(event,'${d.mediaType}')"></label>
      <button type="button" class="outline small dangerBtn" onclick="removeAnnouncementMedia()">Remove</button>
    </div></div>`;
}
function removeAnnouncementMedia(){ window._annDraft.image=''; window._annDraft.mediaType='image'; window._annDraft.posterUrl=''; renderAnnouncementMediaPreview(); }
// Same Storage upload pattern as uploadMediaFile() for products/combos,
// into the dedicated 'announcement-media' bucket — see
// supabase_migration_v32_12_1.sql for the bucket + policies. The old
// file (if any) is left in Storage until Save actually succeeds, at
// which point saveAnnouncement() below cleans it up if it's no longer
// referenced anywhere (spec 6/7: safe replace, no orphan-deleting on
// a cancelled edit).
async function uploadAnnouncementFile(evt,kind){
  const file=evt.target.files?.[0]; if(!file) return;
  const statusEl=document.getElementById('aMediaUploadStatus');
  const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,'-').toLowerCase();
  const path=`${Date.now()}-${safeName}`;
  if(statusEl) statusEl.textContent=`Uploading ${file.name}...`;
  const {error:upErr}=await sb.storage.from('announcement-media').upload(path,file,{cacheControl:'31536000',upsert:false});
  if(upErr){
    if(statusEl) statusEl.textContent='';
    toast('Upload failed: '+upErr.message+' - has supabase_migration_v32_12_1.sql / supabase_migration_v32_3.sql been run, and does the announcement-media bucket exist yet?');
    evt.target.value=''; return;
  }
  const {data:pub}=sb.storage.from('announcement-media').getPublicUrl(path);
  window._annDraft={image:pub.publicUrl, mediaType:kind, posterUrl:''};
  renderAnnouncementMediaPreview();
  if(statusEl) statusEl.textContent=`Uploaded ${file.name}.`;
  evt.target.value='';
}
window.saveAnnouncement=async function(i){
  const type=document.querySelector('input[name="aType"]:checked')?.value||'general';
  const d=window._annDraft||{};
  const prev=window._announcementDraft||{};
  let productId='',comboId='',targetType='',actionType='shop',actionTarget='';
  if(type==='product'){
    targetType=document.querySelector('input[name="aTargetType"]:checked')?.value||'product';
    const targetId=document.getElementById('aTargetSelect')?.value||'';
    if(!targetId){ toast('Select a product or combo for a Product announcement'); return; }
    if(targetType==='combo') comboId=targetId; else productId=targetId;
    actionType=targetType; actionTarget=targetId;
  } else {
    actionType=document.getElementById('aCtaType')?.value||'none';
    actionTarget=actionType==='url'?(document.getElementById('aCtaTarget')?.value.trim()||''):'';
  }
  const s={
    id:data.announcements[i]?.id||prev.id||('ann-'+Date.now().toString(36)),
    label:document.getElementById('aLabel').value.trim(),
    title:document.getElementById('aTitle').value.trim(),
    em:document.getElementById('aEm').value.trim(),
    text:document.getElementById('aText').value.trim(),
    image:d.image||'', mediaType:d.mediaType||'image', posterUrl:d.posterUrl||'',
    showPrice:document.getElementById('aShowPrice').checked,
    announcementType:type, targetType:type==='product'?targetType:'',
    actionType, actionTarget, productId, comboId,
    active:document.getElementById('aActive').checked,
    order:Number(document.getElementById('aOrder').value||1)
  };
  if(!s.label||!s.title){ toast('Label and title are required'); return; }
  const ok=await saveAnnouncementToSupabase(s);
  if(!ok) return;
  // Old media that got replaced/removed above is only cleaned up NOW,
  // after the row that pointed to it has already been updated — see
  // cleanupAnnouncementMedia() for why this is safe against shared use.
  const oldImage=prev.image||'', oldPoster=prev.posterUrl||'';
  if(oldImage && oldImage!==s.image) await cleanupAnnouncementMedia([oldImage,oldPoster]);
  closeModal(); render();
};
// =====================================================================
// V32.3 — Gallery (spec 11-18): Admin-managed, Supabase-Storage-backed
// general visual content (customer photos, food/menu/festival/brand
// photos). Separate from Products/Combos/Announcements/Reviews.
// Supports multiple images AND videos, mixed freely, each with its own
// display order and active flag — unlike announcements' single-media
// rule, there is no cap here.
// =====================================================================
async function fetchGalleryMedia(){
  const {data:rows,error}=await sb.from('gallery_media').select('*').order('display_order',{ascending:true});
  if(error){ toast('Could not load gallery: '+error.message); return []; }
  const items=(rows||[]).map(g=>({id:g.id, type:g.media_type, url:g.media_url, poster:g.poster_url||'', caption:g.caption||'', order:g.display_order||0, active:g.active}));
  data.gallery=items;
  return items;
}
const GALLERY_STORAGE_PREFIX = SUPABASE_URL.replace(/\/$/,'') + '/storage/v1/object/public/gallery-media/';
function galleryStoragePathFromUrl(url){
  if(!url || typeof url !== 'string' || !url.startsWith(GALLERY_STORAGE_PREFIX)) return null;
  try{ return decodeURIComponent(url.slice(GALLERY_STORAGE_PREFIX.length)); }catch{ return null; }
}
// Same "never delete a file another row still references" safety used
// for product/combo/announcement media (spec 18: "never blindly delete
// shared Storage objects").
async function cleanupGalleryMedia(urls, keepId){
  const set=new Set((urls||[]).filter(Boolean));
  for(const url of set){
    const path=galleryStoragePathFromUrl(url);
    if(!path) continue; // external URL — never touched
    let q=sb.from('gallery_media').select('id',{count:'exact',head:true}).or(`media_url.eq.${url},poster_url.eq.${url}`);
    if(keepId) q=q.neq('id',keepId);
    const {count}=await q;
    if(count && count>0) continue;
    const {error:rmErr}=await sb.storage.from('gallery-media').remove([path]);
    if(rmErr) console.warn('Could not remove orphaned gallery Storage file (left in place, no data was lost):', path, rmErr.message);
  }
}
async function galleryPage(){
  await fetchGalleryMedia();
  const items=(data.gallery||[]).slice().sort((a,b)=>(a.order||0)-(b.order||0));
  return `<section class="panel">${liveCatalogNote()}<div class="panelHead"><div><h2>Gallery</h2><p>General visual content shown on the homepage slideshow — customer photos, food/menu photos, festival or brand photos. Any mix of images and videos, in the order below.</p></div></div>
  <div class="mediaUploadRow">
    <label class="outline uploadBtn">📷 + Add Photos<input type="file" accept="image/webp,image/jpeg,image/png,image/avif" multiple style="display:none" onchange="uploadGalleryFiles(event,'image')"></label>
    <label class="outline uploadBtn">🎬 + Add Video<input type="file" accept="video/mp4,video/webm" multiple style="display:none" onchange="uploadGalleryFiles(event,'video')"></label>
  </div>
  <div id="galleryUploadStatus" class="mediaUploadStatus"></div>
  <div class="galleryAdminGrid">${items.map((g,i)=>`
    <div class="galleryAdminCard">
      ${g.type==='video'?`<video src="${esc(g.url)}" ${g.poster?`poster="${esc(g.poster)}"`:''} controls preload="metadata"></video>`:`<img src="${esc(g.url)}" alt="${esc(g.caption)}" loading="lazy">`}
      <div class="galleryAdminMeta">
        <input class="galleryCaption" value="${esc(g.caption)}" placeholder="Optional caption" onchange="updateGalleryCaption('${esc(g.id)}',this.value)">
        <div class="galleryAdminRow">
          <label class="checkOnly"><input type="checkbox" ${g.active?'checked':''} onchange="toggleGalleryActive('${esc(g.id)}',this.checked)"> Active</label>
          <small>${i+1} / ${items.length}</small>
        </div>
        <div class="cardActions">
          <button class="outline" ${i===0?'disabled':''} onclick="moveGalleryItem('${esc(g.id)}',-1)" title="Move earlier">↑</button>
          <button class="outline" ${i===items.length-1?'disabled':''} onclick="moveGalleryItem('${esc(g.id)}',1)" title="Move later">↓</button>
          <button class="outline dangerBtn" onclick="deleteGalleryItem('${esc(g.id)}')">Delete</button>
        </div>
      </div>
    </div>`).join('')||'<div class="empty smallEmpty">No gallery items yet — add photos or a video above.</div>'}
  </div></section>`;
}
// Real file upload straight into Supabase Storage's `gallery-media`
// bucket, same pattern as uploadMediaFile()/uploadAnnouncementFile() —
// multiple files at once are supported (spec 14), each becomes its own
// row with the next available display_order.
async function uploadGalleryFiles(evt,kind){
  const files=Array.from(evt.target.files||[]); if(!files.length) return;
  const statusEl=document.getElementById('galleryUploadStatus');
  let order=(data.gallery||[]).reduce((m,g)=>Math.max(m,g.order||0),0);
  for(const file of files){
    order+=1;
    const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,'-').toLowerCase();
    const path=`${kind==='video'?'videos/':'images/'}${Date.now()}-${order}-${safeName}`;
    if(statusEl) statusEl.textContent=`Uploading ${file.name}…`;
    const {error:upErr}=await sb.storage.from('gallery-media').upload(path,file,{cacheControl:'31536000',upsert:false});
    if(upErr){ toast('Upload failed for '+file.name+': '+upErr.message+' — has supabase_migration_v32_3.sql been run, and does the gallery-media bucket exist yet?'); continue; }
    const {data:pub}=sb.storage.from('gallery-media').getPublicUrl(path);
    const {error:insErr}=await sb.from('gallery_media').insert({media_type:kind, media_url:pub.publicUrl, poster_url:'', caption:'', display_order:order, active:true});
    if(insErr) toast('Uploaded but could not save gallery row for '+file.name+': '+insErr.message);
  }
  if(statusEl) statusEl.textContent='';
  evt.target.value='';
  render();
}
async function updateGalleryCaption(id,val){
  const {error}=await sb.from('gallery_media').update({caption:val.trim()}).eq('id',id);
  if(error) toast('Could not save caption: '+error.message);
}
async function toggleGalleryActive(id,val){
  const {error}=await sb.from('gallery_media').update({active:val}).eq('id',id);
  if(error){ toast('Could not update: '+error.message); }
  render();
}
async function moveGalleryItem(id,dir){
  const items=(data.gallery||[]).slice().sort((a,b)=>(a.order||0)-(b.order||0));
  const idx=items.findIndex(g=>g.id===id);
  const j=idx+dir;
  if(idx<0||j<0||j>=items.length) return;
  const a=items[idx], b=items[j];
  const [oa,ob]=[a.order,b.order];
  await Promise.all([
    sb.from('gallery_media').update({display_order:ob}).eq('id',a.id),
    sb.from('gallery_media').update({display_order:oa}).eq('id',b.id)
  ]);
  render();
}
async function deleteGalleryItem(id){
  const g=(data.gallery||[]).find(x=>x.id===id); if(!g) return;
  if(!confirm('Delete this gallery item?')) return;
  const oldUrls=[g.url,g.poster].filter(Boolean);
  const {error}=await sb.from('gallery_media').delete().eq('id',id);
  if(error){ toast('Could not delete gallery item: '+error.message); return; }
  await cleanupGalleryMedia(oldUrls,null);
  toast('Gallery item deleted');
  render();
}
function polish(){document.querySelectorAll('.cardActions button').forEach(b=>b.classList.add('v22-action'));document.querySelectorAll('.reviewAdmin article,.announcementAdmin article').forEach(x=>x.classList.add('v22-admin-card'))}
new MutationObserver(polish).observe(document.getElementById('app'),{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',polish);else polish();
})();
