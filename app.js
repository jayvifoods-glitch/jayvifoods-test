/* =========================================================
   Jayvi Foods — v32.5 storefront logic
   Data model and localStorage keys are unchanged from v27/28
   so existing Admin-entered data keeps working after this
   upgrade. All UI/interaction code has been rewritten as a
   single clean pass (no runtime "patches") for v31.
   ========================================================= */

const EMBEDDED_CONFIG = {
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

// V32.6: the generic-gallery fallback (images/gallery/*) that used to
// backfill missing per-product media has been removed on purpose — see
// PLACEHOLDER_MEDIA below and cardMediaMarkup(). A product with no
// media of its own now shows an explicit placeholder, never another
// product's (or a generic marketing) image. Product media is now
// sourced from Supabase's product_media table (see loadCatalogFromSupabase()).
const PLACEHOLDER_MEDIA=[{type:'image',path:'images/hero/jayvi-products.webp'}];

// V32.7 — performance fix (spec items 6 & 9): product photos are shipped
// as "images/products/<slug>/<name>.webp" masters. V32.8 extended the
// same dedicated-folder convention to combos too
// ("images/combos/<slug>/<name>.webp" — see CHANGELOG_V32.8.md item 7),
// so both are covered here. scripts/generate-product-image-variants.py
// generates a "-400w"/"-800w" sibling next to every one of those masters
// (see that script for details) — the master itself doubles as the
// ~1600px "desktop" tier. This helper turns a plain path into a srcset
// ONLY for paths that convention guarantees have those siblings;
// anything else (external URLs, SVGs, images/gallery/, brand assets, a
// future product/combo photo that hasn't been through the script yet)
// is left completely alone and just renders as a normal <img src>. No
// database/schema change and no per-product/per-combo code was needed
// for this — the same generic component handles every product and
// every combo, present or future.
const RESPONSIVE_PRODUCT_IMG = /^images\/(products|combos)\/.+\.webp$/i;
function responsiveImgAttrs(path,sizes){
  if(!path || !RESPONSIVE_PRODUCT_IMG.test(path)) return {src:path,srcset:'',sizes:''};
  const stem=path.slice(0,-5); // strip ".webp"
  return {
    src:`${stem}-800w.webp`,
    srcset:`${stem}-400w.webp 400w, ${stem}-800w.webp 800w, ${path} 1600w`,
    sizes:sizes||'(max-width:600px) 45vw, 280px'
  };
}

/* ---------- State ---------- */
let CONFIG, products=[], categories=[], mealTagList=[];
let cat='all', heroIndex=0, heroTimer=null, meal='idli', selectedVariants={};
let cart=loadCart(), wishlist=loadWishlist(), mapsReady=false;

/* ---------- Helpers ---------- */
const $=id=>document.getElementById(id);
const money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
const isMobile=()=>window.matchMedia('(max-width:959px)').matches;
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

/* ---------- Config / data ---------- */
function loadConfig(){
  try{
    const raw=localStorage.getItem('jayviStoreV14');
    const d=structuredClone(EMBEDDED_CONFIG);
    const u=raw?JSON.parse(raw):{};
    d.store={...d.store,...(u.store||{})};
    const baseById=Object.fromEntries((d.products||[]).map(p=>[p.id,p]));
    d.products=(u.products||d.products).map(p=>{
      const base=baseById[p.id]||{};
      const badImage=!p.image||String(p.image).includes('jayvi-products.webp')||String(p.image).includes('v22-demo');
      return {...base,...p,image:badImage?base.image:p.image,media:p.media?.length?p.media:(base.media||[])};
    });
    d.categories=u.categories||d.categories;
    d.combos=u.combos||d.combos;
    d.announcements=u.announcements||d.announcements;
    d.mealTags=u.mealTags||d.mealTags;
    d.mealLabels=Object.fromEntries((d.mealTags||[]).map(t=>[t.id,t.name]));
    d.reviews=u.reviews||d.reviews;
    return d;
  }catch{ return structuredClone(EMBEDDED_CONFIG); }
}
// V32.6: products, product media, and combos now come from Supabase —
// the single source of truth shared by every browser/device (mobile
// and desktop included), replacing the per-browser localStorage
// catalogue. This is intentionally the smallest safe change: store
// settings, categories, meal tags, announcements, and reviews are
// untouched and keep working exactly as before. If the fetch fails for
// any reason (offline, RLS misconfigured, etc.) we fall back to
// whatever CONFIG already has (EMBEDDED_CONFIG / localStorage) so the
// storefront never goes blank — "minimum risk" per the agreed spec.
async function loadCatalogFromSupabase(){
  try{
    const [{data:dbProducts,error:pErr},{data:dbCombos,error:cErr},{data:dbMedia,error:mErr}]=await Promise.all([
      sb.from('products').select('*').eq('active',true),
      sb.from('combos').select('*').eq('active',true),
      sb.from('product_media').select('*').eq('is_active',true).order('display_order',{ascending:true})
    ]);
    if(pErr||cErr||mErr) throw (pErr||cErr||mErr);
    if(!dbProducts) throw new Error('No product data returned');

    const mediaFor=(ownerKey,ownerId)=>dbMedia
      .filter(m=>m[ownerKey]===ownerId)
      .map(m=>({type:m.media_type,path:m.media_url,poster:m.poster_url||''}));

    CONFIG.products=[...dbProducts].sort((a,b)=>(a.display_order||0)-(b.display_order||0)).map(p=>{
      const media=mediaFor('product_id',p.id);
      return {
        id:p.id, sku:p.sku, name:p.name, short:p.short_description,
        description:p.description, category:p.category, categories:p.categories,
        mealTags:p.meal_tags, active:p.active, best:p.best,
        image:media[0]?.path||'', media,
        variants:p.variants||[], rating:p.rating, reviewCount:p.review_count
      };
    });

    CONFIG.combos=(dbCombos||[]).map(c=>({
      id:c.id, name:c.name, short:c.short_description, active:c.active,
      price:c.price, mrp:c.mrp, items:c.items||[],
      image:mediaFor('combo_id',c.id)[0]?.path||'', media:mediaFor('combo_id',c.id)
    }));
    return true;
  }catch(err){
    console.warn('Falling back to embedded/local catalogue — Supabase product fetch failed:', err?.message||err);
    return false;
  }
}
function sync(){
  // Item T: announcement speed is Admin-configurable (was a hardcoded
  // 22s) — 'normal' is intentionally a bit faster than the old fixed
  // value, per the approved spec ("slightly faster than current").
  const speedMap = {slow:26, normal:18, fast:11};
  const speed = speedMap[CONFIG.store.announcementSpeed] || speedMap.normal;
  document.documentElement.style.setProperty('--marquee-duration', speed+'s');
  // Item Q, defensive half: even if a fundamentally incomplete product
  // (no id, no name, no image, or zero sellable variants) somehow ends
  // up in the data, it's filtered out here — never reaches
  // productCard()/openProduct(), which would otherwise crash on
  // getVariant() returning undefined. Every other valid product keeps
  // rendering normally; nothing here can take down the whole grid.
  const isSellable = p => p && p.id && p.name && p.image &&
    (p.variants||[]).some(v=>v && v.active && Number(v.price)>0 && Number(v.mrp)>0);
  products=(CONFIG.products||[]).filter(p=>p.active && isSellable(p))
    .map(p=>({...p,media:p.media?.length?p.media:(p.image?[{type:'image',path:p.image}]:PLACEHOLDER_MEDIA)}));
  categories=(CONFIG.categories||[]).filter(c=>c.enabled).sort((a,b)=>a.order-b.order);
  mealTagList=(CONFIG.mealTags||[]).filter(t=>t.enabled).sort((a,b)=>a.order-b.order);
  if($('topShipping')) $('topShipping').textContent=`FREE SHIPPING ABOVE ${money(CONFIG.store.freeShippingThreshold)}`;
}
function getProduct(id){return products.find(p=>p.id===id)}
function getCombo(id){return (CONFIG.combos||[]).find(c=>c.id===id&&c.active)}
function getVariant(p,vid){
  if(!p) return null;
  return (p.variants||[]).find(v=>v && v.id===vid && v.active && Number(v.price)>0)
    || (p.variants||[]).find(v=>v && v.active && Number(v.price)>0)
    || null;
}
function catName(id){return categories.find(c=>c.id===id)?.name||id}
function variantKey(id){return selectedVariants[id]||getVariant(getProduct(id))?.id}
function setVariant(id,vid){selectedVariants[id]=vid;refreshProductViews()}
function cartQtyFor(pid,vid){const x=cart.find(i=>i.type==='product'&&i.productId===pid&&i.variantId===vid);return x?.qty||0}

/* ---------- Wishlist ---------- */
function loadWishlist(){try{return JSON.parse(localStorage.getItem('jayviWishlistV9')||'[]')}catch{return []}}
function saveWishlist(){localStorage.setItem('jayviWishlistV9',JSON.stringify(wishlist))}
function toggleWishlist(pid){
  wishlist=wishlist.includes(pid)?wishlist.filter(x=>x!==pid):[...wishlist,pid];
  saveWishlist();refreshProductViews();
  showToast(wishlist.includes(pid)?'Added to favourites':'Removed from favourites');
}

/* ---------- Product media / gallery ---------- */
// V32.5 fix (Priority 2, item 7): a broken/missing image used to just
// vanish from the DOM (onerror removed the slide) while data-count and the
// "1 / N" badge kept the ORIGINAL count — so a product with e.g. 4
// configured media entries but a bad path on 3 of them silently ended up
// with a single working slide (no scroll possible) while still claiming
// "1 / 4". This keeps the count/controls in sync with what's actually still
// in the DOM, and removes the counter entirely once only one slide is left
// — matching the spec: a genuinely single-media product stays static, a
// multi-media one keeps scrolling, and this is fully automatic for every
// product (no per-product exception).
function handleMediaError(imgEl){
  const frame = imgEl.closest('.cardMediaFrame');
  imgEl.closest('.cardMediaSlide')?.remove();
  if(!frame) return;
  const scroller = frame.querySelector('.cardMediaScroller');
  const remaining = scroller ? scroller.querySelectorAll('.cardMediaSlide').length : 0;
  if(scroller) scroller.dataset.count = remaining;
  const badge = frame.querySelector('.galleryCount');
  if(remaining<=1) badge?.remove();
  else if(badge) badge.textContent = `1 / ${remaining}`;
}
function cardMediaMarkup(p){
  // No generic-gallery fallback: a product with no media of its own
  // shows the explicit placeholder, never another product's image.
  const media=(p.media?.length?p.media:(p.image?[{type:'image',path:p.image}]:PLACEHOLDER_MEDIA)).filter(Boolean);
  const count=media.length;
  const slides=media.map((m,i)=>{
    if(m.type==='video'&&m.path) return `<div class="cardMediaSlide cardVideo"><video controls playsinline preload="metadata" poster="${escapeHtml(m.poster||'')}"><source src="${escapeHtml(m.path)}" type="video/mp4"></video><span class="mediaLabel">Video</span></div>`;
    const a=responsiveImgAttrs(m.path||m,'(max-width:600px) 45vw, 280px');
    return `<div class="cardMediaSlide"><img src="${escapeHtml(a.src)}"${a.srcset?` srcset="${escapeHtml(a.srcset)}" sizes="${escapeHtml(a.sizes)}"`:''} alt="${escapeHtml(p.name)} image ${i+1}" loading="${i?'lazy':'eager'}" decoding="async" onerror="handleMediaError(this)"></div>`;
  }).join('');
  const controls=count>1?`<span class="galleryCount">1 / ${count}</span>`:'';
  return `<div class="cardMediaFrame"><div class="cardMediaScroller" data-count="${count}" aria-label="${escapeHtml(p.name)} media">${slides}</div>${controls}</div>`;
}
function refreshGalleryCounts(){
  document.querySelectorAll('.cardMediaFrame').forEach(frame=>{
    const s=frame.querySelector('.cardMediaScroller'), c=frame.querySelector('.galleryCount');
    if(!s||!c)return;
    const count=Math.max(1,Number(s.dataset.count||1));
    const idx=Math.max(0,Math.min(count-1,Math.round(s.scrollLeft/(s.clientWidth||1))));
    c.textContent=`${idx+1} / ${count}`;
  });
}
function refreshComboGalleryCounts(){
  document.querySelectorAll('.comboImage').forEach(frame=>{
    const s=frame.querySelector('.comboMediaScroller'), c=frame.querySelector('.galleryCount');
    if(!s||!c)return;
    const count=Math.max(1,Number(s.dataset.count||1));
    const idx=Math.max(0,Math.min(count-1,Math.round(s.scrollLeft/(s.clientWidth||1))));
    c.textContent=`${idx+1} / ${count}`;
  });
}
function bindComboGalleryScrollers(){
  document.querySelectorAll('.comboMediaScroller').forEach(s=>{
    if(s.dataset.bound)return; s.dataset.bound='1';
    s.addEventListener('scroll',refreshComboGalleryCounts,{passive:true});
    let down=false,startX=0,startScroll=0,moved=false;
    s.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;moved=false;startX=e.clientX;startScroll=s.scrollLeft;s.setPointerCapture?.(e.pointerId)});
    s.addEventListener('pointermove',e=>{if(!down||e.pointerType!=='mouse')return;const dx=e.clientX-startX;if(Math.abs(dx)>5)moved=true;if(moved)s.scrollLeft=startScroll-dx});
    const end=e=>{if(e.pointerType==='mouse')down=false};
    s.addEventListener('pointerup',end);s.addEventListener('pointercancel',end);
  });
  refreshComboGalleryCounts();
}
function bindGalleryScrollers(){
  document.querySelectorAll('.cardMediaScroller').forEach(s=>{
    if(s.dataset.bound)return; s.dataset.bound='1';
    s.addEventListener('scroll',refreshGalleryCounts,{passive:true});
    // Desktop mouse-drag support
    let down=false,startX=0,startScroll=0,moved=false;
    s.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;moved=false;startX=e.clientX;startScroll=s.scrollLeft;s.setPointerCapture?.(e.pointerId)});
    s.addEventListener('pointermove',e=>{if(!down||e.pointerType!=='mouse')return;const dx=e.clientX-startX;if(Math.abs(dx)>5)moved=true;if(moved)s.scrollLeft=startScroll-dx});
    const end=e=>{if(e.pointerType==='mouse')down=false};
    s.addEventListener('pointerup',end);s.addEventListener('pointercancel',end);
    s.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},{capture:true});
  });
  refreshGalleryCounts();
}
function productGalleryMarkup(p){
  const media=(p.media||[]).filter(x=>x.type!=='video'&&(x.path||x.file));
  const items=media.length?media:[{path:p.image}];
  const main=responsiveImgAttrs(items[0].path,'(max-width:600px) 92vw, 480px');
  return `<div class="productGallery"><div class="galleryMain"><img id="galleryMainImg" src="${escapeHtml(main.src)}"${main.srcset?` srcset="${escapeHtml(main.srcset)}" sizes="${escapeHtml(main.sizes)}"`:''} data-full="${escapeHtml(items[0].path)}" alt="${escapeHtml(p.name)}" decoding="async" onerror="this.removeAttribute('srcset');this.src='images/hero/jayvi-products.webp'"></div><div class="galleryThumbs">${items.map((m,i)=>{const t=responsiveImgAttrs(m.path,'80px');return `<button type="button" class="${i===0?'active':''}" onclick="setGalleryImage('${escapeHtml(m.path)}',this)"><img src="${escapeHtml(t.src)}"${t.srcset?` srcset="${escapeHtml(t.srcset)}" sizes="${escapeHtml(t.sizes)}"`:''} loading="lazy" decoding="async" alt=""></button>`}).join('')}</div></div>`;
}
function setGalleryImage(path,btn){
  const img=$('galleryMainImg');
  if(img){
    const a=responsiveImgAttrs(path,'(max-width:600px) 92vw, 480px');
    img.src=a.src;
    if(a.srcset){img.srcset=a.srcset;img.sizes=a.sizes} else img.removeAttribute('srcset');
    img.dataset.full=path;
    img.onerror=()=>{img.removeAttribute('srcset');img.src='images/hero/jayvi-products.webp'};
  }
  document.querySelectorAll('.galleryThumbs button').forEach(x=>x.classList.remove('active'));
  btn?.classList.add('active');
}

/* ---------- Product card / grids ---------- */
function productCard(p){
  const v=getVariant(p,variantKey(p.id));
  if(!v) return ''; // defensive: should never happen post-sync(), but never crash the grid if it does
  const off=v.mrp-v.price,q=cartQtyFor(p.id,v.id);
  const actions=q
    ?`<div class="pcActions hasQty"><div class="inlineQty"><button onclick="changeProductQty('${p.id}','${v.id}',-1)" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button><b>${q}</b><button onclick="changeProductQty('${p.id}','${v.id}',1)" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button></div><button class="viewCartBtn" onclick="openCart()" aria-label="View cart"><i class="fa-solid fa-bag-shopping"></i></button></div>`
    :`<div class="pcActions"><button onclick="addToCart('${p.id}','${v.id}')">Add to cart</button><button onclick="buyNow('${p.id}','${v.id}')">Buy now</button></div>`;
  return `<article class="productCard" data-product-id="${p.id}">
    <div class="visualWrap" onclick="openProduct('${p.id}')">${cardMediaMarkup(p)}${p.best?'<span class="badge" title="Bestseller" aria-label="Bestseller"><i class="fa-solid fa-star" aria-hidden="true"></i></span>':''}<button class="heart ${wishlist.includes(p.id)?'isWish':''}" onclick="event.stopPropagation();toggleWishlist('${p.id}')" aria-label="Favourite ${escapeHtml(p.name)}"><i class="${wishlist.includes(p.id)?'fa-solid':'fa-regular'} fa-heart"></i></button></div>
    <div class="pcBody">
      <small>${escapeHtml(catName(p.category))}</small>
      <h3 onclick="openProduct('${p.id}')">${escapeHtml(p.name)}</h3>
      <div class="stars">★★★★★ <span>${p.rating} · ${p.reviewCount} reviews</span></div>
      <p>${escapeHtml(p.short)}</p>
      <div class="sizes">${p.variants.filter(x=>x.active).map(x=>`<button class="${x.id===v.id?'active':''}" onclick="event.stopPropagation();setVariant('${p.id}','${x.id}')">${escapeHtml(x.label)}</button>`).join('')}</div>
      <div class="price"><b>${money(v.price)}</b><del>${money(v.mrp)}</del>${off>0?`<em>Save ${money(off)}</em>`:''}</div>
      ${actions}
    </div>
  </article>`;
}
function renderBest(){ if($('bestGrid')) $('bestGrid').innerHTML=products.filter(p=>p.best).slice(0,4).map(productCard).join(''); bindGalleryScrollers(); }
function renderCategories(){
  if(!$('categoryTabs'))return;
  $('categoryTabs').innerHTML=`<button class="${cat==='all'?'active':''}" onclick="setCat('all',this)">All</button>`+
    categories.map(c=>`<button class="${cat===c.id?'active':''}" onclick="setCat('${c.id}',this)">${escapeHtml(c.name)}</button>`).join('');
}
function setCat(c,b){cat=c;document.querySelectorAll('.categoryTabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProducts()}
function renderProducts(){
  if(!$('productGrid'))return;
  const q=($('productSearch')?.value||'').toLowerCase();
  let arr=products.filter(p=>(cat==='all'||p.category===cat)&&(`${p.name} ${catName(p.category)}`.toLowerCase().includes(q)));
  const s=$('sortSelect')?.value;
  if(s==='priceLow')arr.sort((a,b)=>getVariant(a,variantKey(a.id)).price-getVariant(b,variantKey(b.id)).price);
  if(s==='priceHigh')arr.sort((a,b)=>getVariant(b,variantKey(b.id)).price-getVariant(a,variantKey(a.id)).price);
  if(s==='rating')arr.sort((a,b)=>b.rating-a.rating);
  $('productGrid').innerHTML=arr.map(productCard).join('')||'<div class="empty">No products found.</div>';
  bindGalleryScrollers();
}
function comboMediaMarkup(c){
  // V32.6: combos now follow the exact same product_media architecture
  // as products (item 14 of the spec) — c.media comes straight from
  // Supabase. Falls back to the old item-image composite only for a
  // combo that somehow has no media rows of its own, so nothing breaks.
  const media=(c.media||[]).filter(Boolean);
  const slidesSrc = media.length
    ? media
    : [c.image,...(c.items||[]).map(i=>getProduct(i.productId)?.image)].filter(Boolean).map(path=>({type:'image',path}));
  const unique=[...new Map(slidesSrc.map(m=>[m.path,m])).values()];
  const count=unique.length;
  const slides=unique.map((m,i)=>{
    if(m.type==='video'&&m.path) return `<div class="comboSlide cardVideo"><video controls playsinline preload="metadata" poster="${escapeHtml(m.poster||'')}"><source src="${escapeHtml(m.path)}" type="video/mp4"></video><span class="mediaLabel">Video</span></div>`;
    const a=responsiveImgAttrs(m.path,'(max-width:600px) 45vw, 280px');
    return `<div class="comboSlide"><img src="${escapeHtml(a.src)}"${a.srcset?` srcset="${escapeHtml(a.srcset)}" sizes="${escapeHtml(a.sizes)}"`:''} alt="${escapeHtml(c.name)} image ${i+1}" loading="${i?'lazy':'eager'}" decoding="async"></div>`;
  }).join('');
  const controls=count>1?`<span class="galleryCount">1 / ${count}</span>`:'';
  return `<div class="comboMediaScroller" data-count="${count}" aria-label="${escapeHtml(c.name)} images">${slides}</div>${controls}`;
}
function cartQtyForCombo(cid){const x=cart.find(i=>i.type==='combo'&&i.comboId===cid);return x?.qty||0}
function renderCombos(){
  if(!$('comboGrid'))return;
  const cs=(CONFIG.combos||[]).filter(c=>c.active);
  $('comboCount').textContent=cs.length?`${cs.length} combo${cs.length>1?'s':''}`:'';
  $('comboGrid').innerHTML=cs.length?cs.map(c=>{
    // V32.5 fix (Priority 2, item 5): same data-driven qty-stepper pattern
    // as productCard() — a combo already in the cart must show -/+ just
    // like every other product, not a static Add to cart button forever.
    const q=cartQtyForCombo(c.id);
    const actions=q
      ?`<div class="pcActions comboActions hasQty"><div class="inlineQty"><button onclick="changeComboQty('${c.id}',-1)" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button><b>${q}</b><button onclick="changeComboQty('${c.id}',1)" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button></div><button class="viewCartBtn" onclick="openCart()" aria-label="View cart"><i class="fa-solid fa-bag-shopping"></i></button></div>`
      :`<div class="pcActions comboActions"><button onclick="addCombo('${c.id}')">Add to cart</button><button onclick="buyCombo('${c.id}')">Buy now</button></div>`;
    return `<article class="comboCard">
    <div class="comboImage">${comboMediaMarkup(c)}</div>
    <div class="comboBody">
      <div class="eyebrow" style="color:#e8d9b6">COMBO</div>
      <h3>${escapeHtml(c.name)}</h3><p>${escapeHtml(c.short)}</p>
      <div class="comboItems">${c.items.map(i=>{const p=getProduct(i.productId),v=p?getVariant(p,i.variantId):null;return `<span>${escapeHtml(p?.name||'')} · ${v?.label||''}</span>`}).join('')}</div>
      <div class="comboPrice"><b>${money(c.price)}</b><del>${money(c.mrp)}</del><em>Save ${money(c.mrp-c.price)}</em></div>
      ${actions}
    </div></article>`;
  }).join(''):'<div class="empty" style="color:#cbbca8">No active combos yet.</div>';
  bindComboGalleryScrollers();
}
function addCombo(id){
  const c=getCombo(id);if(!c)return;const key='combo:'+id;const x=cart.find(i=>i.key===key);
  if(x)x.qty++; else cart.push({key,type:'combo',comboId:id,qty:1});
  saveCart();renderCart();refreshProductViews();
  // V32.5 fix (Priority 2, item 5): must match addToCart()'s UX exactly —
  // stay on the page and show a toast, never auto-open the cart drawer.
  showCartAddedToast(c.name);
}
function buyCombo(id){const c=getCombo(id);if(!c)return;const key='combo:'+id;const x=cart.find(i=>i.key===key);if(x)x.qty++;else cart.push({key,type:'combo',comboId:id,qty:1});saveCart();renderCart();refreshProductViews();openCheckout()}
function changeComboQty(id,d){
  const key='combo:'+id; let x=cart.find(i=>i.key===key);
  if(!x&&d>0){const c=getCombo(id);if(!c)return;cart.push({key,type:'combo',comboId:id,qty:1})}
  else if(!x){return}
  else{x.qty+=d; if(x.qty<1)cart=cart.filter(i=>i.key!==key)}
  saveCart();renderCart();refreshProductViews();
}

/* ---------- Meal match ---------- */
const MEAL_DESCRIPTIONS={idli:'Idli + your favourite podi or chutney',dosa:'Dosa + your favourite chutney flavour',chapati:'Chapati works with every chutney and podi',rice:'Rice + ghee + chutney powder or podi'};
function renderMeal(){
  if(!$('mealTabs'))return;
  $('mealTabs').innerHTML=mealTagList.map(t=>`<button class="${t.id===meal?'active':''}" onclick="setMeal('${t.id}')">${escapeHtml(t.name)}</button>`).join('');
  const rec=products.filter(p=>p.mealTags?.includes(meal));
  const desc=MEAL_DESCRIPTIONS[meal]||'Pick from all products that fit this meal';
  // V32.6 (root cause of the "combo -/+ doesn't show" bug, item 6): this
  // used to call getVariant(p,...) and read v.price with no null-check.
  // A product with zero active/sellable variants made getVariant()
  // return null, so v.price threw — and because refreshProductViews()
  // runs renderMeal() BEFORE renderCombos(), that uncaught exception
  // silently aborted the rest of the chain, leaving the combo card (and
  // anything else queued after it) stuck showing "Add to cart" even
  // though the cart itself had already updated correctly. Filtering out
  // unsellable products here (same defensive pattern productCard()
  // already uses) fixes this at the actual source, for every product,
  // not just combos — see also the defensive per-call wrapping in
  // refreshProductViews() below, which now guarantees one broken
  // section can never again block its siblings from re-rendering.
  const sellableRec = rec.filter(p=>getVariant(p,variantKey(p.id)));
  $('mealRecommendations').innerHTML=`<div class="mealIntro"><b>${escapeHtml(desc)}</b><span>${sellableRec.length} product${sellableRec.length===1?'':'s'}</span></div>
    <div class="miniProducts">${sellableRec.map(p=>{const v=getVariant(p,variantKey(p.id));const a=responsiveImgAttrs(p.image,'64px');return `<button onclick="openProduct('${p.id}')"><div class="miniImg"><img src="${escapeHtml(a.src)}"${a.srcset?` srcset="${escapeHtml(a.srcset)}" sizes="${escapeHtml(a.sizes)}"`:''} loading="lazy" decoding="async" alt=""></div><span>${escapeHtml(p.name)}</span><b>${money(v.price)}</b></button>`}).join('')||'<div class="empty">No matching products yet.</div>'}</div>`;
}
function setMeal(m){meal=m;renderMeal()}

/* ---------- Footer social links (item 14) ---------- */
const SOCIAL_ICONS={whatsapp:'fa-whatsapp',instagram:'fa-instagram',facebook:'fa-facebook',youtube:'fa-youtube',x:'fa-x-twitter',linkedin:'fa-linkedin'};
const SOCIAL_LABELS={whatsapp:'WhatsApp',instagram:'Instagram',facebook:'Facebook',youtube:'YouTube',x:'X',linkedin:'LinkedIn'};
async function renderFooterSocialLinks(){
  const box=$('footerSocialLinks'); if(!box) return;
  try{
    const {data,error}=await sb.from('social_links').select('*').eq('enabled',true).order('display_order',{ascending:true});
    if(error||!data) throw error||new Error('empty');
    if(!data.length) return; // keep the two hardcoded fallback links already in the HTML rather than showing nothing
    box.innerHTML=data.map(s=>`<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.label||SOCIAL_LABELS[s.platform]||s.platform)}</a>`).join('');
  }catch(err){
    // Migration not yet run, or a transient fetch failure — the two
    // links already hard-coded in index.html stay exactly as they were,
    // so the footer is never empty.
    console.warn('Footer social links: using fallback (Supabase fetch failed):', err?.message||err);
  }
}

/* ---------- Brand/promo gallery (V32.6, item 3) ----------
   Independent of the product-media architecture on purpose — this is
   general brand/promo imagery (customer photos, ads, festival
   banners), never a product. The ONLY place any filename from
   images/gallery/ is ever listed is the generated manifest.json (see
   generate-gallery-manifest.js) — this function never hardcodes a
   single image name, and a brand-new .webp file becomes part of the
   rotation automatically once the manifest is regenerated and
   deployed, with no code change. No image is ever clickable/linked. */
async function renderBrandGallery(){
  const section=$('brandGallery'), track=$('galleryTrack');
  if(!section||!track) return;
  let files=[];
  try{
    const res=await fetch('images/gallery/manifest.json',{cache:'no-store'});
    if(!res.ok) throw new Error('manifest.json not found ('+res.status+')');
    files=await res.json();
    if(!Array.isArray(files)) throw new Error('manifest.json is not a list');
  }catch(err){
    // No manifest yet, empty list, or a fetch hiccup — hide gracefully
    // rather than show a broken/empty section. This is expected and
    // silent until images/gallery/ actually has content.
    section.style.display='none';
    return;
  }
  files=files.filter(Boolean);
  if(!files.length){ section.style.display='none'; return; }

  const imgTag=f=>`<img src="images/gallery/${escapeHtml(f)}" alt="" loading="lazy">`;
  if(files.length===1){
    // A single image: show it once, statically — no loop, nothing to rotate.
    track.classList.remove('isAnimating');
    track.style.removeProperty('--gallery-marquee-duration');
    track.innerHTML=imgTag(files[0]);
  }else{
    // Multiple images: duplicate the list once for a seamless loop
    // (same technique as the existing announcement ticker), speed
    // scaled to the number of images so more photos don't just fly by
    // faster.
    track.innerHTML=files.map(imgTag).join('')+files.map(imgTag).join('');
    track.style.setProperty('--gallery-marquee-duration',Math.max(18,files.length*6)+'s');
    track.classList.add('isAnimating');
  }
  section.style.display='';
}

/* ---------- Reviews ---------- */
async function renderReviews(){
  if(!$('reviewGrid'))return;
  // Two separate, independently-sourced pipelines rendered into the same
  // grid: curated Google-linked testimonials (Admin-JSON, unchanged) and
  // live customer-submitted reviews (Supabase, approved only). They are
  // never mixed into one workflow — Admin manages Google Reviews content
  // as before, and approves/rejects website reviews separately.
  // Item O: homepage shows a small curated/recent set only, with a
  // dedicated "View all reviews" action for the full paginated list —
  // never renders the whole review table directly here.
  const curated=(CONFIG.reviews||[]).filter(r=>r.active&&r.source==='customer').slice(0,3);
  let live=[], liveCount=0;
  try{
    const {data, count} = await sb.from('website_reviews').select('customer_name,rating,review_text,created_at,featured',{count:'exact'}).eq('status','approved').order('featured',{ascending:false}).order('created_at',{ascending:false}).limit(CONFIG.store.homepageReviewCount||6);
    live = data||[]; liveCount = count||0;
  }catch{}
  const curatedCards = curated.map(r=>`<article><div class="stars">${'★'.repeat(r.rating)}</div><p>“${escapeHtml(r.text)}”</p><b>${escapeHtml(r.name)}</b><small>Customer review</small></article>`).join('');
  const liveCards = live.map(r=>`<article>${r.featured?'<span class="typeTag" style="background:var(--gold-soft);color:#8a6a1a">FEATURED</span>':''}<div class="stars">${'★'.repeat(r.rating)}</div><p>“${escapeHtml(r.review_text)}”</p><b>${escapeHtml(r.customer_name)}</b><small>Verified Jayvi customer</small></article>`).join('');
  const writeReviewCard = `<article class="googleCard" style="background:var(--brand-soft)!important"><i class="fa-regular fa-pen-to-square"></i><h3>Bought something recently?</h3><p>Tell other customers what you thought.</p><a href="#" onclick="openReviewForm();return false">Write a review →</a></article>`;
  const viewAllCard = liveCount>live.length ? `<article class="googleCard"><i class="fa-solid fa-list"></i><h3>${liveCount} customer reviews</h3><p>See every approved review from Jayvi customers.</p><a href="#" onclick="openAllReviews();return false">View all reviews →</a></article>` : '';
  $('reviewGrid').innerHTML = curatedCards + liveCards + writeReviewCard + viewAllCard +
    `<article class="googleCard"><i class="fa-brands fa-google"></i><h3>More reviews on Google</h3><p>See the latest customer feedback directly on Google.</p><a href="${CONFIG.store.googleReviewsUrl}" target="_blank">View Google reviews →</a></article>`;
  if($('googleReviewsTop'))$('googleReviewsTop').href=CONFIG.store.googleReviewsUrl;
}
let _allReviewsOffset = 0;
const ALL_REVIEWS_PAGE_SIZE = 10;
async function openAllReviews(reset=true){
  if(reset) _allReviewsOffset = 0;
  $('accountOverlay').classList.add('open');document.body.classList.add('modalOpen');
  const {data, count, error} = await sb.from('website_reviews')
    .select('customer_name,rating,review_text,created_at,featured',{count:'exact'})
    .eq('status','approved')
    .order('featured',{ascending:false}).order('created_at',{ascending:false})
    .range(_allReviewsOffset, _allReviewsOffset+ALL_REVIEWS_PAGE_SIZE-1);
  if(error){ showToast('Could not load reviews'); return; }
  const rows = data||[];
  $('accountContent').innerHTML = `<div class="eyebrow">CUSTOMER REVIEWS</div><h2>${count||0} reviews</h2>
    <div class="reviewGrid" style="grid-template-columns:1fr;margin-top:14px">${rows.map(r=>`<article>${r.featured?'<span class="typeTag" style="background:var(--gold-soft);color:#8a6a1a">FEATURED</span>':''}<div class="stars">${'★'.repeat(r.rating)}</div><p>“${escapeHtml(r.review_text)}”</p><b>${escapeHtml(r.customer_name)}</b><small>${new Date(r.created_at).toLocaleDateString('en-IN')}</small></article>`).join('')||'<div class="empty">No reviews yet.</div>'}</div>
    ${count>_allReviewsOffset+ALL_REVIEWS_PAGE_SIZE?`<button class="btn light full" style="margin-top:14px" onclick="_allReviewsOffset+=${ALL_REVIEWS_PAGE_SIZE};openAllReviews(false)">Load more</button>`:''}`;
}
function openReviewForm(){
  $('accountOverlay').classList.add('open');document.body.classList.add('modalOpen');
  $('accountContent').innerHTML = `<div class="eyebrow">WRITE A REVIEW</div><h2>Tell us what you thought.</h2>
    <p class="muted">Your review is checked by Jayvi before it appears on the site — this usually takes a day or two.</p>
    <form onsubmit="submitReview(event)">
      <label>Your name *<input id="revName" required value="${escapeHtml(currentProfile?.name||'')}"></label>
      <label>Rating *<select id="revRating" required>
        <option value="5">★★★★★ — Excellent</option><option value="4">★★★★ — Good</option>
        <option value="3">★★★ — Okay</option><option value="2">★★ — Not great</option><option value="1">★ — Poor</option>
      </select></label>
      <label>Which product? (optional)<select id="revProduct"><option value="">General review</option>${products.map(p=>`<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('')}</select></label>
      <label>Order number (optional)<input id="revOrder" placeholder="JF-YYYYMMDD-XXXXXX"></label>
      <label>Your review *<textarea id="revText" required rows="4" placeholder="What did you think?"></textarea></label>
      <button class="btn gold full" type="submit">Submit review →</button>
    </form>`;
}
async function submitReview(e){
  e.preventDefault();
  const payload = {
    customer_id: currentUser?.id || null,
    customer_name: $('revName').value.trim(),
    rating: Number($('revRating').value),
    review_text: $('revText').value.trim(),
    product_id: $('revProduct').value || null,
    order_number: $('revOrder').value.trim() || null,
    status: 'pending'
  };
  if(!payload.customer_name || !payload.review_text){ showToast('Please fill in your name and review'); return; }
  const {error} = await sb.from('website_reviews').insert(payload);
  if(error){ showToast('Could not submit review: '+error.message); return; }
  $('accountContent').innerHTML = `<div class="successIcon"><i class="fa-solid fa-check"></i></div><div class="eyebrow">THANK YOU</div><h2>Review submitted.</h2><p class="muted">Jayvi will review it shortly — approved reviews appear on the site automatically.</p><button class="btn gold full" onclick="closeAccount()">Close</button>`;
}

/* ---------- Hero ---------- */
function heroShow(){
  const a=(CONFIG.announcements||[]).filter(x=>x.active).sort((x,y)=>x.order-y.order);
  if(!a.length||!$('heroLabel'))return;
  const s=a[heroIndex%a.length];
  const p=s.productId?getProduct(s.productId):null, combo=s.comboId?getCombo(s.comboId):null;
  $('heroLabel').textContent=s.label;
  $('heroTitle').innerHTML=`${escapeHtml(s.title)}<br><em>${escapeHtml(s.em)}</em>`;
  $('heroDesc').textContent=s.text;
  $('heroPrice').textContent=money(p?getVariant(p,variantKey(p.id)).price:combo?.price||0);
  $('heroImg').src=p?.image||combo?.image||'images/hero/jayvi-products.webp';
  $('heroShop').onclick=()=>{
    const type=s.actionType||(s.comboId?'combo':'product'), target=s.actionTarget||(s.comboId?s.comboId:s.productId);
    if(type==='product'&&getProduct(target))openProduct(target);
    else if(type==='combo'&&getCombo(target))$('combos').scrollIntoView({behavior:'smooth'});
    else if(type==='shop')$('shop').scrollIntoView({behavior:'smooth'});
    else if(type==='reviews')$('reviews').scrollIntoView({behavior:'smooth'});
    else if(type==='url'&&s.actionTarget)window.location.href=s.actionTarget;
  };
  $('heroDots').innerHTML=a.map((_,i)=>`<button class="${i===heroIndex?'active':''}" onclick="heroIndex=${i};heroShow();restartHero()"></button>`).join('');
  const g=document.querySelector('.heroGrid');
  g.classList.remove('heroChange'); void g.offsetWidth; g.classList.add('heroChange');
}
function restartHero(){clearInterval(heroTimer);startHero()}
function startHero(){
  const n=(CONFIG.announcements||[]).filter(x=>x.active).length;
  if(CONFIG.homepage.heroAutoplay&&n>1)heroTimer=setInterval(()=>{heroIndex=(heroIndex+1)%n;heroShow()},CONFIG.homepage.heroSeconds*1000);
}
function enableHeroSwipe(){
  const hero=document.querySelector('.hero');
  if(!hero)return;
  let sx=0;
  hero.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  hero.addEventListener('touchend',e=>{
    const dx=e.changedTouches[0].clientX-sx;
    const n=(CONFIG.announcements||[]).filter(x=>x.active).length;
    if(n>1&&Math.abs(dx)>35){heroIndex=(heroIndex+(dx<0?1:-1)+n)%n;heroShow();restartHero()}
  },{passive:true});
}

/* ---------- Cart ---------- */
function loadCart(){try{return JSON.parse(localStorage.getItem('jayviCartV14')||'[]')}catch{return []}}
function saveCart(){localStorage.setItem('jayviCartV14',JSON.stringify(cart))}
function cartItemDetails(x){
  if(x.type==='combo'){const c=getCombo(x.comboId);return c?{name:c.name,price:c.price,mrp:c.mrp,image:c.image,label:'Combo'}:{name:'Unavailable combo',price:0,mrp:0,image:'',label:''}}
  const p=getProduct(x.productId),v=p?getVariant(p,x.variantId):null;
  return p&&v?{name:p.name,price:v.price,mrp:v.mrp,image:p.image,label:v.label}:{name:'Unavailable product',price:0,mrp:0,image:'',label:''};
}
// V32.6 (item 6 defense-in-depth, re-verified in this release): each
// render function is isolated so a bug/exception in any one of them
// can never again silently prevent the others from running — this is
// what let a renderMeal() crash block renderCombos() before the real
// fix (see renderMeal() above). Not a combo-specific workaround: every
// section gets identical protection, and errors are still visible in
// the console for debugging rather than being swallowed silently.
// renderCombos() is also intentionally ordered right after renderBest
// here (not last) as a second, independent layer of defense — even if
// a future bug appeared in renderProducts()/renderMeal(), the combo
// card would already be updated before either of them ever runs.
function refreshProductViews(){
  [renderBest,renderCombos,renderProducts,renderMeal].forEach(fn=>{
    try{ fn(); }catch(err){ console.error(`${fn.name} failed to render:`, err); }
  });
}
function addToCart(pid,vid){
  const p=getProduct(pid),v=getVariant(p,vid); if(!p||!v)return;
  const key='product:'+pid+':'+v.id, x=cart.find(i=>i.key===key);
  if(x)x.qty++; else cart.push({key,type:'product',productId:pid,variantId:v.id,qty:1});
  saveCart();renderCart();refreshProductViews();refreshOpenProductDetail(pid);
  // Item S (approved spec): Add to Cart must NOT open the cart drawer —
  // customers adding several items shouldn't be bounced to the cart
  // after each one. Confirmation toast with an explicit "View cart"
  // action instead; only that action (or the cart icon) opens it.
  showCartAddedToast(p.name);
}
function changeProductQty(pid,vid,d){
  const key='product:'+pid+':'+vid; let x=cart.find(i=>i.key===key);
  if(!x&&d>0){const p=getProduct(pid),v=getVariant(p,vid);if(!p||!v)return;cart.push({key,type:'product',productId:pid,variantId:v.id,qty:1})}
  else if(!x){return}
  else{x.qty+=d; if(x.qty<1)cart=cart.filter(i=>i.key!==key)}
  saveCart();renderCart();refreshProductViews();refreshOpenProductDetail(pid);
}
function buyNow(pid,vid){
  const p=getProduct(pid),v=getVariant(p,vid); if(!p||!v)return;
  const key='product:'+pid+':'+v.id, x=cart.find(i=>i.key===key);
  if(x)x.qty++; else cart.push({key,type:'product',productId:pid,variantId:v.id,qty:1});
  saveCart();renderCart();refreshProductViews();openCheckout();
}
function changeQty(key,d){
  const x=cart.find(i=>i.key===key); if(!x)return;
  x.qty+=d; if(x.qty<1)cart=cart.filter(i=>i!==x);
  saveCart();renderCart();refreshProductViews();
  if(x.type==='product') refreshOpenProductDetail(x.productId);
}
function removeCart(key){
  const x=cart.find(i=>i.key===key);
  cart=cart.filter(i=>i.key!==key);saveCart();renderCart();refreshProductViews();showToast('Removed from cart');
  if(x?.type==='product') refreshOpenProductDetail(x.productId);
}
function cartTotals(){
  let sub=cart.reduce((s,x)=>{const d=cartItemDetails(x);return s+d.price*x.qty},0);
  const th=CONFIG.store.freeShippingThreshold, ship=sub===0?0:sub>=th?0:CONFIG.store.shippingFlat;
  return {sub,ship,total:sub+ship,remaining:Math.max(0,th-sub)};
}
function renderCart(){
  if(!$('cartItems'))return;
  const count=cart.reduce((s,x)=>s+x.qty,0);
  $('cartCount').textContent=count;
  const t=cartTotals();
  $('cartSubtotal').textContent=money(t.sub);
  $('cartTotal').textContent=money(t.total);
  $('cartShipping').innerHTML=t.sub===0?'':t.ship===0?'<span class="free">FREE DELIVERY</span>':`Delivery ${money(t.ship)}`;
  $('cartHint').textContent=t.sub&&t.ship?`Add ${money(t.remaining)} more for free delivery.`:'';
  $('cartItems').innerHTML=cart.length?cart.map(x=>{
    const d=cartItemDetails(x);
    const a=responsiveImgAttrs(d.image,'64px');
    return `<div class="cartItem"><img src="${a.src}"${a.srcset?` srcset="${a.srcset}" sizes="${a.sizes}"`:''} loading="lazy" decoding="async" alt=""><div><b>${escapeHtml(d.name)}</b><small>${escapeHtml(d.label)} · ${money(d.price)}</small>
      <div class="qty"><button onclick="changeQty('${x.key}',-1)">−</button><span>${x.qty}</span><button onclick="changeQty('${x.key}',1)">+</button><button onclick="removeCart('${x.key}')">Remove</button></div></div></div>`;
  }).join(''):`<div class="emptyCart"><i class="fa-solid fa-bag-shopping"></i><h3>Your bag is empty</h3><p>Add a Jayvi favourite to get started.</p></div>`;
  updateMobileCartBar(count,t.total);
  updateBottomNavBadge(count);
}
function openCart(){$('cartOverlay').classList.add('open');document.body.classList.add('modalOpen');renderCart()}
function closeCart(){$('cartOverlay').classList.remove('open');document.body.classList.remove('modalOpen')}

/* ---------- Mobile bottom bar / nav badges ---------- */
function updateMobileCartBar(count,total){
  const bar=$('mobileCartBar'); if(!bar)return;
  bar.classList.toggle('hasItems',count>0);
  $('mobileCartCount').textContent=count;
  $('mobileCartTotal').textContent=money(total);
}
function updateBottomNavBadge(count){
  const b=$('bottomNavCartBadge'); if(!b)return;
  b.textContent=count; b.style.display=count>0?'grid':'none';
}

/* ---------- Search ---------- */
function openSearch(){$('searchOverlay').classList.add('open');document.body.classList.add('modalOpen');setTimeout(()=>$('searchBox').focus(),80)}
function closeSearch(){$('searchOverlay').classList.remove('open');document.body.classList.remove('modalOpen')}
function renderSearch(){
  const q=$('searchBox').value.toLowerCase();
  $('searchResults').innerHTML=products.filter(p=>(p.name+' '+catName(p.category)).toLowerCase().includes(q))
    .map(p=>`<button onclick="closeSearch();openProduct('${p.id}')"><b>${escapeHtml(p.name)}</b><span>${money(getVariant(p,variantKey(p.id)).price)}</span></button>`).join('')
    ||'<div class="empty">No products found.</div>';
}

/* ---------- Customers / auth ---------- */
/* ---------- Supabase client + auth (customers, addresses, session) ---------- */
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentUser = null;   // { id, email/phone } from supabase auth
let currentProfile = null; // row from public.profiles

function phoneToAuthEmail(phone){ return phone + '@' + EMAIL_MAP_DOMAIN; }

async function getSessionUser(){
  const {data} = await sb.auth.getSession();
  return data?.session?.user || null;
}
async function refreshProfile(){
  if(!currentUser){ currentProfile = null; return null; }
  const {data, error} = await sb.from('profiles').select('*').eq('id', currentUser.id).single();
  if(error){ currentProfile = null; return null; }
  currentProfile = data;
  return data;
}
function openAccount(){
  $('accountOverlay').classList.add('open');document.body.classList.add('modalOpen');
  if(currentUser) renderAccountView(); else $('accountContent').innerHTML = authView('login');
}
function openTrackOrder(){
  $('accountOverlay').classList.add('open');document.body.classList.add('modalOpen');
  trackOrderPrompt();
}
function closeAccount(){$('accountOverlay').classList.remove('open');document.body.classList.remove('modalOpen')}
function openAuth(m){$('accountContent').innerHTML=authView(m)}
function authView(mode){
  // Login accepts mobile number OR email (customers use phone, Admin
  // uses email) — registration stays phone-only, customers don't
  // register with email. The HTML pattern attribute previously forced
  // 10-digit-numeric on this same shared field for both modes, which
  // is what silently blocked an email address from even being typed.
  const idField = mode==='login'
    ? `<label>Mobile number or email *<input id="authId" required placeholder="10-digit mobile number or email"></label>`
    : `<label>Mobile number *<input id="authId" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" required placeholder="10-digit mobile number"></label>`;
  return `<div class="eyebrow">MY JAYVI</div><h2>${mode==='login'?'Welcome back.':'Create your Jayvi account.'}</h2>
  <p class="muted">${mode==='login'?'Use your mobile number or email, and password.':'Your mobile number is your Jayvi user ID.'}</p>
  <form onsubmit="${mode==='login'?'loginSubmit(event)':'registerSubmit(event)'}">
    ${mode==='register'?'<label>Name *<input id="authName" required></label>':''}
    ${idField}
    <label>Password *<input id="authPass" type="password" minlength="6" required></label>
    ${mode==='register'?'<label>Confirm password *<input id="authPass2" type="password" minlength="6" required></label>':''}
    <button class="btn gold full">${mode==='login'?'Sign in':'Create account'} →</button>
  </form>
  <div id="authError" class="tiny" style="color:var(--danger)"></div>
  <div class="authSwitch">${mode==='login'?`New here? <button onclick="openAuth('register')">Create account</button>`:`Already have an account? <button onclick="openAuth('login')">Sign in</button>`}</div>
  ${mode==='login'?'<button class="textBtn" onclick="openForgotPassword()">Forgot password?</button>':''}
  <div class="guestNote">You can always <button onclick="closeAccount();openCheckout()">continue as guest</button> without creating an account. Already placed an order? <button onclick="trackOrderPrompt()">Track it here</button>.</div>`;
}
function openForgotPassword(){
  $('accountContent').innerHTML = `<div class="eyebrow">FORGOT PASSWORD</div><h2>Let's find your account.</h2>
    <p class="muted">Enter the mobile number your account is registered with.</p>
    <label>Mobile number *<input id="fpPhone" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" required placeholder="10-digit mobile number"></label>
    <button class="btn gold full" onclick="checkForgotPasswordPhone()">Continue →</button>
    <div class="authSwitch"><button onclick="openAuth('login')">← Back to sign in</button></div>`;
}
async function checkForgotPasswordPhone(){
  const phone = $('fpPhone').value.trim();
  if(!/^\d{10}$/.test(phone)){ showToast('Enter a valid 10-digit mobile number'); return; }
  const {data:exists} = await sb.rpc('check_phone_registered', {p_phone:phone});
  if(!exists){
    $('accountContent').innerHTML = `<div class="eyebrow">FORGOT PASSWORD</div><h2>No account found.</h2>
      <p class="muted">We couldn't find a Jayvi account with that mobile number.</p>
      <button class="btn gold full" onclick="openAuth('register')">Create an account instead →</button>
      <div class="authSwitch"><button onclick="openAuth('login')">← Back to sign in</button></div>`;
    return;
  }
  // Phase 1 (R2/R3): no automated OTP/email verification yet — identity
  // is confirmed by Jayvi's team via WhatsApp, then Admin resets the
  // password. Architecture leaves room to swap this for self-service
  // OTP/email later without changing the account system itself.
  const waMsg = encodeURIComponent(`Hello Jayvi Foods, I need help resetting the password for my account registered with ${phone}.`);
  $('accountContent').innerHTML = `<div class="eyebrow">FORGOT PASSWORD</div><h2>We found your account.</h2>
    <p class="muted">We can't automatically verify your identity yet. Please contact Jayvi Foods to reset your password.</p>
    <a class="btn gold full" href="https://wa.me/${CONFIG.store.whatsapp}?text=${waMsg}" target="_blank">WhatsApp Jayvi Foods →</a>
    <button class="btn light full" style="margin-top:10px" onclick="closeAccount();openCheckout()">Continue as guest</button>
    <div class="authSwitch"><button onclick="openAuth('login')">← Back to sign in</button></div>`;
}
function authErr(msg){ const el=$('authError'); if(el) el.textContent=msg; else showToast(msg); }

async function registerSubmit(e){
  e.preventDefault();
  const name=$('authName').value.trim(), phone=$('authId').value.trim(), p=$('authPass').value, p2=$('authPass2').value;
  if(!/^\d{10}$/.test(phone)){authErr('Enter a valid 10-digit mobile number');return}
  if(p!==p2){authErr('Passwords do not match');return}

  let signUpResult;
  if(AUTH_MODE==='phone'){
    signUpResult = await sb.auth.signUp({ phone, password:p, options:{ data:{ name, phone } } });
  }else{
    signUpResult = await sb.auth.signUp({ email:phoneToAuthEmail(phone), password:p, options:{ data:{ name, phone } } });
  }
  const {data, error} = signUpResult;
  if(error){
    if(/already|exists|registered/i.test(error.message)){
      // R1: existing account — offer Log in / Forgot password rather
      // than just an error with no way forward.
      $('accountContent').innerHTML = `<div class="eyebrow">MY JAYVI</div><h2>Account already exists.</h2>
        <p class="muted">An account already exists with this mobile number.</p>
        <button class="btn gold full" onclick="openAuth('login')">Log in →</button>
        <button class="btn light full" style="margin-top:10px" onclick="openForgotPassword()">Forgot password?</button>`;
    } else {
      authErr(error.message);
    }
    return;
  }
  currentUser = data.user;
  // Some Supabase configs require confirmation before a session exists yet.
  if(!data.session){
    const {data:signInData, error:signInErr} = AUTH_MODE==='phone'
      ? await sb.auth.signInWithPassword({ phone, password:p })
      : await sb.auth.signInWithPassword({ email:phoneToAuthEmail(phone), password:p });
    if(signInErr){ authErr('Account created — please sign in.'); openAuth('login'); return; }
    currentUser = signInData.user;
  }
  await refreshProfile();
  // Associate any existing guest orders placed with the same phone number.
  try{ await sb.rpc('link_guest_orders_to_me'); }catch{}
  showToast('Account created');
  renderAccountView();
}
async function loginSubmit(e){
  e.preventDefault();
  const identifier=$('authId').value.trim(), p=$('authPass').value;
  // Routing only — decides which Supabase Auth call to make, grants
  // nothing by itself. Actual access is decided after real
  // authentication succeeds, by reading profiles.role from the
  // database (see below) — never by which format was typed.
  const looksLikeEmail = identifier.includes('@');
  let result;
  if(looksLikeEmail){
    // Admin's account (or any other real-email account) — sign in
    // directly with the typed email. No phone-mapping applied.
    result = await sb.auth.signInWithPassword({ email: identifier, password:p });
  } else {
    if(!/^\d{10}$/.test(identifier)){
      authErr('Enter a valid 10-digit mobile number or email address');
      return;
    }
    result = AUTH_MODE==='phone'
      ? await sb.auth.signInWithPassword({ phone: identifier, password:p })
      : await sb.auth.signInWithPassword({ email: phoneToAuthEmail(identifier), password:p });
  }
  const {data, error} = result;
  if(error){
    // R6: incorrect password (or unknown identifier) — always offer
    // the recovery path right where the error appears, not just an error.
    $('authError').innerHTML = `Mobile number/email or password is incorrect. <button class="textBtn" onclick="openForgotPassword()" style="display:inline">Forgot password?</button>`;
    return;
  }
  currentUser = data.user;
  // Role comes from profiles.role, read fresh from Supabase for this
  // specific authenticated user's own id — never inferred from
  // whether they typed an email or a phone number. A customer typing
  // an arbitrary email cannot gain admin access this way: without the
  // correct password for a real admin account, auth itself fails
  // above; and even if someone's profile row were somehow inspected,
  // it can't say role='admin' unless an actual admin set it that way
  // (enforced by the prevent_privilege_escalation trigger — see
  // supabase_schema_phase1_v3.sql). Every real admin data query in
  // admin.js is separately gated by RLS checking public.is_admin() at
  // the database level regardless of what this redirect does, so this
  // check is a UX convenience, not the actual security boundary.
  await refreshProfile();
  showToast('Signed in');
  // Item J / this fix: any successful login where the account is
  // actually flagged admin goes straight to the Admin panel — no
  // separate admin-login page, no public "Admin login" link, and this
  // no longer depends on how the visit arrived (?returnTo=admin).
  if(currentProfile?.role==='admin'){
    location.href='admin.html';
    return;
  }
  renderAccountView();
}
async function signOut(){
  await sb.auth.signOut();
  currentUser = null; currentProfile = null;
  openAuth('login');
}

async function renderAccountView(activeTab='orders'){
  if(!currentUser){ $('accountContent').innerHTML = authView('login'); return; }
  if(!currentProfile) await refreshProfile();
  const isAdmin = currentProfile?.role === 'admin';
  $('accountContent').innerHTML = `<div class="eyebrow">MY JAYVI</div><h2>Welcome, ${escapeHtml((currentProfile?.name||'Customer').split(' ')[0])}.</h2>
    <p class="muted">${escapeHtml(currentProfile?.phone||'')}</p>
    ${isAdmin?`<div class="notice" style="background:var(--olive-soft);border-radius:var(--radius-md);padding:12px 14px;margin:10px 0;font-size:12.5px">You're signed in with an Admin account. This shows only orders placed directly by this account — for the full order list and order management, use <a href="admin.html" style="font-weight:700;color:var(--brand-dark)">the Admin panel</a>.</div>`:''}
    <div class="accountTabs">
      <button class="${activeTab==='orders'?'active':''}" onclick="renderAccountView('orders')">Orders</button>
      <button class="${activeTab==='addresses'?'active':''}" onclick="renderAccountView('addresses')">Addresses</button>
      <button class="${activeTab==='security'?'active':''}" onclick="renderAccountView('security')">Security</button>
      <button onclick="trackOrderPrompt()">Track order</button>
      <button onclick="signOut()">Sign out</button>
    </div>
    <div id="accountTabBody">Loading…</div>`;
  if(activeTab==='addresses') renderAddressTab();
  else if(activeTab==='security') renderSecurityTab();
  else renderOrdersTab();
}
// V32.8 (item 3): the piece that was actually missing end-to-end — a
// customer-facing way to SET THEIR OWN password, whether that's
// because Admin just gave them a temporary one via "Reset password",
// or they simply want to change it. This is a genuine gap fix, not a
// login-architecture change: it calls Supabase's own self-service
// sb.auth.updateUser() for the CURRENTLY signed-in user, which is a
// completely different, unprivileged code path from Admin's
// admin-reset-password Edge Function (that one needs the service_role
// key to change ANOTHER user's password; this one only ever touches
// the caller's own session and needs no special privilege at all).
// Phone-based login identity, registration behavior, and Admin's own
// email login are untouched by this addition.
async function renderSecurityTab(){
  const body = $('accountTabBody'); if(!body) return;
  body.innerHTML = `<p class="muted" style="margin-bottom:12px">Set a new password for your account. If Jayvi Foods support just reset your password for you, use this to replace it with one only you know.</p>
    <form onsubmit="submitPasswordChange(event)">
      <label>New password *<input id="secNewPass" type="password" minlength="6" required placeholder="At least 6 characters"></label>
      <label>Confirm new password *<input id="secNewPass2" type="password" minlength="6" required></label>
      <button class="btn gold full" type="submit">Update password →</button>
    </form>
    <div id="secMsg" class="tiny" style="margin-top:10px"></div>`;
}
async function submitPasswordChange(e){
  e.preventDefault();
  const p1 = $('secNewPass').value, p2 = $('secNewPass2').value;
  const msg = $('secMsg');
  if(p1.length < 6){ msg.style.color='var(--danger)'; msg.textContent='Password must be at least 6 characters.'; return; }
  if(p1 !== p2){ msg.style.color='var(--danger)'; msg.textContent='Passwords do not match.'; return; }
  const {error} = await sb.auth.updateUser({ password: p1 });
  if(error){
    // Root-cause message, not a generic failure — e.g. Supabase enforces
    // "new password must be different from the old password" server-side,
    // which otherwise looks like a silent no-op to the customer.
    msg.style.color='var(--danger)';
    msg.textContent = 'Could not update password: ' + error.message;
    return;
  }
  msg.style.color='var(--success)';
  msg.textContent = 'Password updated. Use it next time you sign in.';
  $('secNewPass').value=''; $('secNewPass2').value='';
  showToast('Password updated');
}
async function renderOrdersTab(){
  const body = $('accountTabBody'); if(!body) return;
  // Explicitly scoped to this signed-in user's own id — never relies on
  // RLS alone to narrow the result. RLS legitimately allows an admin
  // session to read every order (correct, at the database level); this
  // explicit filter keeps the storefront's "My Orders" UI showing only
  // this account's own orders regardless of what role is signed in, so
  // an admin session never has the full order list surfaced through the
  // customer-facing account view.
  const {data, error} = await sb.from('orders')
    .select('order_number,status,total,created_at')
    .eq('customer_id', currentUser.id)
    .order('created_at',{ascending:false});
  if(error){ body.innerHTML = `<div class="empty">Could not load orders: ${escapeHtml(error.message)}</div>`; return; }
  body.innerHTML = `<div class="orders">${(data||[]).length ? data.map(o=>
    `<button class="order" type="button" onclick="trackKnownOrder('${escapeHtml(o.order_number)}','${escapeHtml(currentProfile?.phone||'')}')"><b>${escapeHtml(o.order_number)}</b><span>${new Date(o.created_at).toLocaleDateString('en-IN')}</span><strong>${money(o.total)}</strong><small>${escapeHtml(o.status)}</small></button>`
  ).join('') : '<div class="empty">No orders yet.</div>'}</div>`;
}
async function renderAddressTab(){
  const body = $('accountTabBody'); if(!body) return;
  // Same explicit-scoping principle as renderOrdersTab() above.
  const {data, error} = await sb.from('customer_addresses').select('*').eq('customer_id', currentUser.id).order('is_default',{ascending:false});
  if(error){ body.innerHTML = `<div class="empty">Could not load addresses: ${escapeHtml(error.message)}</div>`; return; }
  body.innerHTML = `<div class="orders">${(data||[]).map(a=>`
    <div class="order" style="cursor:default">
      <div><b>${escapeHtml(a.line1)}</b><span>${escapeHtml(a.city)}, ${escapeHtml(a.state)} – ${escapeHtml(a.pincode)}${a.landmark?' · '+escapeHtml(a.landmark):''}</span></div>
      <button class="textBtn" type="button" onclick="deleteAddress('${a.id}')">Remove</button>
    </div>`).join('') || '<div class="empty">No saved addresses yet.</div>'}</div>
    <form onsubmit="addAddress(event)" style="margin-top:14px">
      <label>Address line *<input id="newAddrLine1" required placeholder="House/flat, street"></label>
      <label>Landmark<input id="newAddrLandmark"></label>
      <div class="two"><label>City *<input id="newAddrCity" required></label><label>State *<input id="newAddrState" required></label></div>
      <label>PIN code *<input id="newAddrPin" required maxlength="6" pattern="[0-9]{6}"></label>
      <button class="btn light full" type="submit">Save address</button>
    </form>`;
}
async function addAddress(e){
  e.preventDefault();
  const {error} = await sb.from('customer_addresses').insert({
    customer_id: currentUser.id,
    line1: $('newAddrLine1').value.trim(),
    landmark: $('newAddrLandmark').value.trim() || null,
    city: $('newAddrCity').value.trim(),
    state: $('newAddrState').value.trim(),
    pincode: $('newAddrPin').value.trim(),
    is_default: true
  });
  if(error){ showToast('Could not save address: '+error.message); return; }
  showToast('Address saved');
  renderAddressTab();
}
async function deleteAddress(id){
  const {error} = await sb.from('customer_addresses').delete().eq('id', id);
  if(error){ showToast('Could not remove address: '+error.message); return; }
  renderAddressTab();
}

/* ---------- Checkout ---------- */
let checkoutPinInfo = null; // set by verifyPincode() once a PIN is confirmed serviceable; drives both displayed AND charged shipping (item B) and the dynamic ETA shown (item H) — never two different numbers for the same thing.

function effectiveShipping(t){
  // V32.5 fix (Priority 3, item 8): free delivery above the configured
  // threshold must apply across every state/PIN, per the explicit
  // requirement ("Free delivery above ₹599 remains applicable across
  // states"). Previously, ANY non-null PIN-level delivery_charge always
  // overrode this — a real order above the free-shipping threshold could
  // still get charged shipping just because its PIN had a configured
  // charge. This was a pre-existing latent bug that becomes much more
  // impactful now that state-level defaults (item 8/9) mean most PINs
  // will have a resolved delivery_charge, so it's fixed here as part of
  // shipping this feature.
  if(t.sub > 0 && t.sub >= (CONFIG.store.freeShippingThreshold||0)) return 0;
  return checkoutPinInfo?.charge != null ? Number(checkoutPinInfo.charge) : t.ship;
}
function updateCheckoutSummary(){
  const t = cartTotals();
  const ship = effectiveShipping(t);
  const total = t.sub + ship;
  const shipEl = $('checkoutShipLine'), totalEl = $('checkoutTotalLine'), estEl = $('checkoutEstimate');
  if(shipEl) shipEl.textContent = ship ? money(ship) : 'FREE';
  if(totalEl) totalEl.textContent = money(total);
  if(estEl){
    const min = checkoutPinInfo?.min ?? CONFIG.store.deliveryMinDays ?? 4;
    const max = checkoutPinInfo?.max ?? CONFIG.store.deliveryMaxDays ?? 8;
    estEl.innerHTML = `<b>Estimated delivery: ${min}–${max} days</b><span>${checkoutPinInfo?.pinChecked?'Based on your PIN code.':'Delivery time varies by location and PIN code.'}</span>`;
  }
}
async function openCheckout(){
  if(CONFIG.store.vacationMode){showToast(CONFIG.store.vacationMessage||'Ordering is temporarily paused.');return}
  if(!cart.length){showToast('Your cart is empty');return}
  closeCart();
  checkoutPinInfo = null;
  const t=cartTotals();
  const u = currentUser ? currentProfile : null;
  let savedAddr = null;
  if(currentUser){
    const {data} = await sb.from('customer_addresses').select('*').eq('customer_id', currentUser.id).order('is_default',{ascending:false}).limit(1);
    savedAddr = data?.[0] || null;
  }
  const upi=CONFIG.store.upiEnabled!==false, cod=CONFIG.store.codEnabled!==false;
  $('checkoutContent').innerHTML=`<div class="checkoutGrid">
    <div>
      <div class="eyebrow">CHECKOUT</div><h2>Delivery details.</h2>
      <p class="muted">Choose how you want to pay. You can order as a guest or sign in.</p>
      <div class="deliveryEstimate" id="checkoutEstimate"><b>Estimated delivery: ${CONFIG.store.deliveryMinDays||4}–${CONFIG.store.deliveryMaxDays||8} days</b><span>Delivery time varies by location and PIN code.</span></div>
      <div class="guestChoice"><b>Checkout as ${u?'signed-in customer':'guest'}</b>${u?`<button onclick="signOut().then(openCheckout)">Use guest</button>`:'<button onclick="closeCheckout();openAccount()">Sign in / register</button>'}</div>
      <form id="checkoutForm" onsubmit="placeOrder(event)">
        <label>Full name *<input id="coName" value="${escapeHtml(u?.name||'')}" required></label>
        <label>Mobile *<input id="coPhone" value="${escapeHtml(u?.phone||'')}" required pattern="[0-9]{10}" maxlength="10"></label>
        <label>Search your Google location <span class="tiny">${CONFIG.store.googleMapsApiKey?'':'not yet configured'}</span><div id="placeBox"></div></label>
        <label>Address *<textarea id="coAddress" required rows="3" placeholder="House / flat, street, landmark">${escapeHtml(savedAddr?.line1||'')}</textarea></label>
        <div class="two"><label>City *<input id="coCity" required value="${escapeHtml(savedAddr?.city||'')}"></label><label>State *<input id="coState" required value="${escapeHtml(savedAddr?.state||'')}"></label></div>
        <div class="pinRow"><label>PIN code *<input id="coPin" required inputmode="numeric" pattern="[0-9]{6}" maxlength="6" value="${escapeHtml(savedAddr?.pincode||'')}"></label><button type="button" class="btn outline" onclick="verifyPincode()">Verify PIN</button></div>
        <div id="pinStatus" class="pinStatus"></div>
        <label>Country<select id="coCountry" disabled><option value="IN">India</option></select></label>
        <div class="paymentChooser"><h3>Payment method</h3>
          ${upi?`<label class="paymentOption active"><input type="radio" name="paymentMethod" value="upi" checked onchange="togglePaymentNote()"><span><b>Pay by UPI QR</b><small>Scan and pay the exact order amount</small></span></label>`:''}
          ${cod?`<label class="paymentOption"><input type="radio" name="paymentMethod" value="cod" onchange="togglePaymentNote()"><span><b>Cash on Delivery</b><small>Pay when your order is delivered</small></span></label>`:''}
          <div id="paymentNote" class="paymentNote">${escapeHtml(CONFIG.store.paymentNote||'')}</div>
        </div>
        <button class="btn gold full" type="submit">Continue checkout <i class="fa-solid fa-arrow-right"></i></button>
      </form>
    </div>
    <aside class="summary"><h3>Your order</h3>
      ${cart.map(x=>{const d=cartItemDetails(x);return `<div class="line"><span>${escapeHtml(d.name)} · ${escapeHtml(d.label)} × ${x.qty}</span><b>${money(d.price*x.qty)}</b></div>`}).join('')}
      <div class="line"><span>Subtotal</span><b>${money(t.sub)}</b></div>
      <div class="line"><span>Delivery</span><b id="checkoutShipLine">${t.ship?money(t.ship):'FREE'}</b></div>
      <div class="line total"><span>Total</span><b id="checkoutTotalLine">${money(t.total)}</b></div>
    </aside></div>`;
  $('checkoutOverlay').classList.add('open');document.body.classList.add('modalOpen');
  initPlaces();
}
function closeCheckout(){$('checkoutOverlay').classList.remove('open');document.body.classList.remove('modalOpen')}
function togglePaymentNote(){
  document.querySelectorAll('.paymentOption').forEach(x=>x.classList.toggle('active',x.querySelector('input')?.checked));
  const m=document.querySelector('input[name=paymentMethod]:checked')?.value;
  const n=$('paymentNote'); if(n)n.textContent=m==='cod'?'Pay the delivery partner when your order arrives.':'Scan the QR, pay the exact total, then share the UTR/reference number so we can verify your payment.';
}
const PIN_NOT_SERVICEABLE_MSG = 'Delivery is currently unavailable to this PIN code.';
async function verifyPincode(){
  const pin=$('coPin').value.trim(), status=$('pinStatus');
  if(!/^\d{6}$/.test(pin)){status.className='pinStatus bad';status.textContent='Enter a 6-digit Indian PIN code.';return}
  if(CONFIG.store.deliveryMode!=='india'){status.className='pinStatus bad';status.textContent='Delivery is currently disabled.';return}
  status.className='pinStatus';status.textContent='Checking delivery availability…';
  checkoutPinInfo = null;
  const {data, error} = await sb.rpc('check_pincode', {p_pincode:pin});
  const row = data?.[0];
  if(error){
    // Master lookup itself failed (network/infra hiccup, not a bad PIN) —
    // fail open to the generic estimate rather than blocking checkout over
    // an infrastructure issue. This is a genuinely different case from "PIN
    // not in master" below and is intentionally left as fail-open. Marked
    // as verified (not pin-specific) so placeOrder() still allows checkout
    // to proceed rather than getting stuck behind an outage.
    status.className='pinStatus good';
    status.textContent=`Estimated delivery: ${CONFIG.store.deliveryMinDays||4}–${CONFIG.store.deliveryMaxDays||8} days.`;
    checkoutPinInfo = { charge:null, min:CONFIG.store.deliveryMinDays||4, max:CONFIG.store.deliveryMaxDays||8, pinChecked:false, verifiedPin:pin };
    updateCheckoutSummary();
    return;
  }
  if(!row || !row.found){
    // V32.5 fix (Priority 1, item 1): a PIN that does not exist in the
    // pincode master must NEVER fall back to the generic estimate — that
    // silently told customers we deliver to an arbitrary/nonexistent PIN.
    // Treated identically to "not serviceable" (case C from the spec).
    // checkoutPinInfo is deliberately left null so placeOrder() below
    // blocks the order until a serviceable PIN is verified.
    status.className='pinStatus bad';
    status.textContent=PIN_NOT_SERVICEABLE_MSG;
    updateCheckoutSummary();
    return;
  }
  if(!row.effective_serviceable){
    // Never explains *why* (state disabled vs. individual PIN disabled
    // vs. inactive) — internal admin rules aren't exposed to customers.
    status.className='pinStatus bad';
    status.textContent=PIN_NOT_SERVICEABLE_MSG;
    updateCheckoutSummary();
    return;
  }
  const min = row.min_eta_days || CONFIG.store.deliveryMinDays || 4;
  const max = row.max_eta_days || CONFIG.store.deliveryMaxDays || 8;
  // This is the actual fix for the flagged gap: the same numbers used
  // in the status message below are stored here and are what
  // updateCheckoutSummary()/placeOrder() actually use — the displayed
  // amount and the charged amount can no longer diverge.
  checkoutPinInfo = { charge: row.delivery_charge, min, max, pinChecked: true, verifiedPin: pin };
  status.className='pinStatus good';
  status.textContent = row.delivery_charge!=null
    ? `Delivery available. Estimated delivery: ${min}–${max} days. Delivery charge for this PIN: ${row.delivery_charge>0?money(row.delivery_charge):'FREE'}.`
    : `Delivery available. Estimated delivery: ${min}–${max} days.`;
  updateCheckoutSummary();
}
async function initPlaces(){
  const box=$('placeBox'); if(!box)return;
  if(!CONFIG.store.googleMapsApiKey){box.innerHTML='<input id="placeFallback" placeholder="Add Google Maps API key in Admin to search locations">';return}
  try{
    if(!window.google){
      await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(CONFIG.store.googleMapsApiKey)}&v=weekly`;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
    }
    await google.maps.importLibrary('places');
    const el=new google.maps.places.PlaceAutocompleteElement({});
    el.setAttribute('placeholder','Search your address or area');
    el.includedRegionCodes=['in'];
    box.innerHTML='';box.appendChild(el);
    el.addEventListener('gmp-select',async({placePrediction})=>{
      const place=placePrediction.toPlace();
      await place.fetchFields({fields:['formattedAddress','addressComponents','location']});
      $('coAddress').value=place.formattedAddress||'';
      const comps=place.addressComponents||[];
      const get=t=>comps.find(c=>c.types?.includes(t))?.longText||'';
      $('coCity').value=get('locality')||get('administrative_area_level_2');
      $('coState').value=get('administrative_area_level_1');
      $('coPin').value=get('postal_code');
      verifyPincode();
    });
    mapsReady=true;
  }catch{ box.innerHTML='<input id="placeFallback" placeholder="Google Maps could not be loaded — enter address manually">'; }
}
function makeOrderNumber(){
  const d=new Date(), y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
  // Client-generated, but must be safe against collisions across different
  // devices/customers now that orders live in one shared database (a
  // simple local daily counter, as used pre-Supabase, is no longer safe).
  const suffix = Date.now().toString(36).slice(-4).toUpperCase() + Math.random().toString(36).slice(2,4).toUpperCase();
  return `JF-${y}${m}${day}-${suffix}`;
}
async function placeOrder(e){
  e.preventDefault();
  const pin=$('coPin').value.trim();
  if(!/^\d{6}$/.test(pin)){verifyPincode();showToast('Please verify your 6-digit PIN');return}
  // V32.5 fix (Priority 1, item 1): checkoutPinInfo is only populated by
  // verifyPincode() when the PIN is confirmed serviceable (or when the
  // lookup itself failed and we're intentionally failing open — see
  // verifyPincode()). If the PIN wasn't verified at all, or was verified
  // and found non-serviceable/nonexistent, or the customer edited the PIN
  // after verifying, checkoutPinInfo is null/stale here — re-run
  // verification and block the order rather than silently accepting it.
  if(!checkoutPinInfo || checkoutPinInfo.verifiedPin !== pin){
    verifyPincode();
    showToast('Please verify delivery availability for this PIN before placing the order.');
    return;
  }
  const t=cartTotals();
  const ship = effectiveShipping(t); // same value the summary just displayed — never a second, different number
  const total = t.sub + ship;
  const min = checkoutPinInfo?.min ?? CONFIG.store.deliveryMinDays ?? 4;
  const max = checkoutPinInfo?.max ?? CONFIG.store.deliveryMaxDays ?? 8;
  const method=document.querySelector('input[name=paymentMethod]:checked')?.value||'upi';
  const items = cart.map(x=>{
    const d=cartItemDetails(x);
    return {
      item_type: x.type, product_id: x.productId||null, variant_id: x.variantId||null, combo_id: x.comboId||null,
      name: d.name, variant_label: d.label, unit_price: d.price, qty: x.qty, line_total: Math.round(d.price*x.qty*100)/100
    };
  });
  const submitBtn = e.target.querySelector('button[type=submit]');
  if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Placing order…'; }

  let orderNumber = makeOrderNumber(), attempt = 0, result;
  while(attempt < 2){
    result = await sb.rpc('place_order', {
      p_order_number: orderNumber,
      p_guest_name: $('coName').value.trim(),
      p_guest_phone: $('coPhone').value.trim(),
      p_address_line1: $('coAddress').value.trim(),
      p_address_city: $('coCity').value.trim(),
      p_address_state: $('coState').value.trim(),
      p_address_pincode: pin,
      p_subtotal: t.sub, p_shipping: ship, p_total: total,
      p_payment_method: method,
      p_estimated_delivery: `${min}-${max} days`,
      p_items: items,
      p_eta_min_days: min, p_eta_max_days: max
    });
    if(!result.error || result.error.code !== '23505') break; // 23505 = unique_violation, retry with a new number
    orderNumber = makeOrderNumber(); attempt++;
  }
  if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Continue checkout'; }

  if(result.error){ showToast('Could not place order: '+result.error.message); return; }

  const phone = $('coPhone').value.trim(), name = $('coName').value.trim();
  cart=[]; saveCart();
  closeCheckout();
  const orderStub = { order_number: orderNumber, total: t.total, status: method==='upi'?'Payment verification pending':'Order received — COD', customerName:name, phone, estimated_delivery:`${CONFIG.store.deliveryMinDays||4}–${CONFIG.store.deliveryMaxDays||8} days` };
  if(method==='upi') showUpiPayment(orderStub); else showOrderSuccess(orderStub);
  refreshProductViews(); renderCart();
}
function showUpiPayment(o){
  const qr=CONFIG.store.upiQrImage?`<img class="upiQr" src="${CONFIG.store.upiQrImage}" alt="Jayvi Foods UPI QR">`:`<div class="upiQr placeholder"><b>UPI QR</b><span>Upload your Jayvi QR from Admin</span></div>`;
  // Item G: on mobile, a "Pay with UPI app" deep link is offered above
  // the QR — tapping it hands off to whichever UPI app the customer
  // has installed via the standard upi://pay intent. On desktop there's
  // no UPI app to hand off to, so only the QR + manual reference is
  // shown, exactly as specified ("Desktop → QR + manual reference
  // fallback"). Neither path can auto-confirm the payment — the UTR
  // field below is always required either way; this is explicitly NOT
  // claiming automatic reference retrieval, which the current
  // architecture cannot do without a real payment gateway.
  const upiLink = CONFIG.store.upiId
    ? `upi://pay?pa=${encodeURIComponent(CONFIG.store.upiId)}&pn=${encodeURIComponent(CONFIG.store.upiName||'Jayvi Foods')}&am=${encodeURIComponent(o.total)}&tn=${encodeURIComponent(o.order_number)}&cu=INR`
    : null;
  const intentButton = (isMobile() && upiLink)
    ? `<a class="btn gold full" href="${upiLink}">Pay with UPI app →</a><p class="tiny" style="text-align:center;margin:8px 0">or scan the QR below</p>`
    : '';
  $('accountContent').innerHTML=`<div class="paymentSuccess"><div class="eyebrow">PAYMENT</div><h2>Pay ${money(o.total)}</h2>
    <p class="muted">${isMobile()?'Pay with your UPI app, or scan the QR.':'Scan this QR with any UPI app.'} Your order will move to processing after we verify the payment.</p>
    ${intentButton}${qr}
    <div class="upiMeta"><b>${escapeHtml(CONFIG.store.upiName||'Jayvi Foods')}</b>${CONFIG.store.upiId?`<span>UPI ID: ${escapeHtml(CONFIG.store.upiId)}</span>`:''}</div>
    <label>UPI transaction / UTR reference *<input id="utrInput" placeholder="Enter the reference after payment"></label>
    <button class="btn gold full" onclick="submitUpiProof('${escapeHtml(o.order_number)}','${escapeHtml(o.phone)}')">I have paid →</button>
    <p class="tiny">Order ${escapeHtml(o.order_number)} · Payment verification pending</p></div>`;
  $('accountOverlay').classList.add('open');document.body.classList.add('modalOpen');
}
async function submitUpiProof(orderNumber, phone){
  const utr=$('utrInput')?.value.trim();
  if(!utr){showToast('Enter the UTR/reference number');return}
  const {error} = await sb.rpc('submit_payment_proof', {p_order_number:orderNumber, p_phone:phone, p_utr:utr});
  if(error){ showToast('Could not submit payment proof: '+error.message); return; }
  showToast('Payment proof submitted. Jayvi will verify it.');
  showOrderSuccess({ order_number:orderNumber, phone, status:'Payment verification pending', total:null });
}
function showOrderSuccess(o){
  $('accountContent').innerHTML=`<div class="successIcon"><i class="fa-solid fa-check"></i></div><div class="eyebrow">ORDER RECEIVED</div><h2>${escapeHtml(o.order_number)}</h2>
    <p class="muted">${escapeHtml(o.status)}. We'll update the order status as it moves through fulfilment.</p>
    <div class="trackMini">${renderTimeline(o)}</div>
    <button class="btn gold full" onclick="closeAccount()">Continue shopping</button>`;
  $('accountOverlay').classList.add('open');document.body.classList.add('modalOpen');
}
function renderTimeline(o){
  const status = o.status||'';
  // Item N: a cancelled or delivery-failed order must NOT render the
  // normal happy-path timeline — each gets its own track, per the
  // approved spec's exact examples.
  const NORMAL = ['Order Confirmed','Preparing','Packed & Shipped','Out for Delivery','Delivered'];
  const CANCELLED = ['Order Confirmed','Preparing','Cancelled','Refund Pending','Refunded'];
  const FAILED = ['Packed & Shipped','Out for Delivery','Delivery Failed','Returned'];

  let steps;
  if(['Cancelled','Refund Pending','Refunded'].includes(status)) steps = CANCELLED;
  else if(['Delivery Failed','Returned'].includes(status)) steps = FAILED;
  else steps = NORMAL;

  const idx = steps.indexOf(status);
  return `<div class="timeline">${steps.map((s,i)=>{
    const cls = i===idx ? 'current' : (idx>=0 && i<idx ? 'done' : '');
    return `<div class="timelineStep ${cls}"><i>${i<idx?'✓':i+1}</i><span>${s}</span></div>`;
  }).join('')}</div>`;
}
function trackOrderPrompt(){
  openAccount();
  $('accountContent').innerHTML=`<div class="eyebrow">TRACK ORDER</div><h2>Where is my order?</h2><p class="muted">Enter your order number and mobile number.</p>
    <label>Order number<input id="trackId" placeholder="JF-YYYYMMDD-XXXXXX"></label>
    <label>Mobile<input id="trackPhone" maxlength="10"></label>
    <button class="btn gold full" onclick="trackOrder()">Track order →</button>`;
}
const CANCELLABLE_STATUSES = ['Order Confirmed','Preparing']; // mirrors status_transitions exactly — server enforces the real rule regardless, this only decides whether to show the button
// V32.5 fix (Priority 1, item 2): statuses from which the state machine
// (supabase_migration_order_state_machine.sql) allows moving back into
// "Payment Verification" — i.e. a payment that never happened or didn't
// go through. This is what "Retry Payment" is for: never a new order.
const RETRY_PAYMENT_STATUSES = ['Payment Pending','Payment Failed'];
async function trackKnownOrder(orderNumber, phone){
  const {data, error} = await sb.rpc('track_guest_order', {p_order_number:orderNumber, p_phone:phone});
  const o = data?.[0];
  if(error || !o){showToast('Order could not be found for this mobile number.');return}
  const canCancel = CANCELLABLE_STATUSES.includes(o.status);
  const canRetryPayment = RETRY_PAYMENT_STATUSES.includes(o.status);
  $('accountContent').innerHTML=`<div class="eyebrow">ORDER ${escapeHtml(o.order_number)}</div><h2>${escapeHtml(o.status||'Order received')}</h2>
    <p class="muted">${money(o.total)}</p>${renderTimeline(o)}
    <div class="orderTrackNote">
      ${o.tracking_url?`Tracking: <a href="${escapeHtml(o.tracking_url)}" target="_blank">Open courier tracking →</a><br>`:''}
      ${o.tracking_number?`Tracking number: <b>${escapeHtml(o.tracking_number)}</b><br>`:''}
      ${o.reference_number?`Reference number: <b>${escapeHtml(o.reference_number)}</b><br>`:''}
      ${o.delivery_partner?`Delivery partner: ${escapeHtml(o.delivery_partner)}<br>`:''}
      ${formatDynamicEta(o)}
    </div>
    ${canRetryPayment?`<button class="btn gold full" style="margin-top:14px" onclick="retryPayment('${escapeHtml(o.order_number)}','${escapeHtml(phone)}')">Retry Payment</button>`:''}
    ${canCancel?`<button class="btn light full" style="margin-top:14px" onclick="confirmCancelOrder('${escapeHtml(o.order_number)}','${escapeHtml(phone)}')">Cancel order</button>`
      : (o.status==='Packed & Shipped'||o.status==='Out for Delivery' ? `<p class="tiny" style="margin-top:10px">Cancellation is no longer available because your order has already been shipped.</p>` : '')}`;
  $('accountOverlay').classList.add('open');document.body.classList.add('modalOpen');
}
// V32.5 fix (Priority 1, item 2): re-opens payment for an EXISTING order —
// never calls place_order, so no duplicate order is ever created. Re-fetches
// the order first so a stale button (e.g. Admin already verified payment in
// another tab) can't reopen payment on an order that's moved on.
// Payment method: UPI only for now, matching the current single-method
// checkout. When more payment methods exist, branch here on the order's own
// payment_method (once track_guest_order exposes it) instead of assuming UPI.
async function retryPayment(orderNumber, phone){
  const {data, error} = await sb.rpc('track_guest_order', {p_order_number:orderNumber, p_phone:phone});
  const o = data?.[0];
  if(error || !o){showToast('Order could not be found for this mobile number.');return}
  if(!RETRY_PAYMENT_STATUSES.includes(o.status)){
    showToast(`This order is already "${o.status}" — no payment retry needed.`);
    trackKnownOrder(orderNumber, phone);
    return;
  }
  showUpiPayment({ order_number:o.order_number, phone, total:o.total });
}
function formatDynamicEta(o){
  // Item H: reflects the order's OWN stored estimate, and firms up as
  // status progresses — never just re-shows the generic 4–8 days after
  // the order has moved on.
  if(o.status==='Delivered') return `Delivered.`;
  if(o.dispatch_date && ['Packed & Shipped','Out for Delivery'].includes(o.status)){
    return `Shipped. Expected delivery: ${new Date(o.dispatch_date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}${o.eta_max_days?' – '+new Date(new Date(o.dispatch_date).getTime()+o.eta_max_days*86400000).toLocaleDateString('en-IN',{day:'numeric',month:'short'}):''}.`;
  }
  if(o.status==='Out for Delivery') return `Expected today.`;
  return `Estimated delivery: ${o.estimated_delivery||'4–8 days'}.`;
}
async function confirmCancelOrder(orderNumber, phone){
  if(!confirm(`Cancel order ${orderNumber}? This can't be undone.`)) return;
  const {error} = await sb.rpc('cancel_order', {p_order_number:orderNumber, p_phone:phone});
  if(error){ showToast('Could not cancel: '+error.message); return; }
  showToast(`Order ${orderNumber} cancelled. If payment was made, your refund will be credited within ${CONFIG.store.refundBusinessDays||4} business days.`);
  trackKnownOrder(orderNumber, phone);
}
function trackOrder(){
  const id=$('trackId').value.trim(), phone=$('trackPhone').value.trim();
  if(!/^\d{10}$/.test(phone)){showToast('Enter the 10-digit mobile number used for the order.');return}
  trackKnownOrder(id,phone);
}

/* ---------- Product detail ---------- */
// V32.5 fix (Priority 2, item 6): tracks which product's detail modal is
// currently open so cart-mutating actions (addToCart/changeProductQty/
// buyNow, and the cart drawer's own changeQty/removeCart) can refresh it.
// This is the actual root cause of "newly added products don't show
// quantity controls": the detail modal's Add to cart/Buy now buttons were
// static HTML that never re-rendered after adding to cart, for ANY
// product — most testing happens via the grid card (which already
// re-renders correctly on every cart change), so it only surfaced when a
// just-added product was tested through the detail view.
let openProductId = null;
function refreshOpenProductDetail(pid){
  if(openProductId===pid && $('productOverlay')?.classList.contains('open')) openProduct(pid);
}
function openProduct(id){
  const p=getProduct(id); if(!p)return;
  if(isMobile()){
    const card=document.querySelector(`[data-product-id="${id}"]`);
    card?.scrollIntoView({behavior:'smooth',block:'start'});
  }
  const v=getVariant(p,variantKey(id));
  if(!v){ showToast('This product is currently unavailable.'); return; } // defensive, same reasoning as productCard()
  openProductId = id;
  const paused=!!CONFIG.store.vacationMode;
  const addAction=paused?"showToast('Ordering is paused while Jayvi Foods is on vacation.')":`addToCart('${p.id}','${v.id}')`;
  const buyAction=paused?"showToast('Ordering is paused while Jayvi Foods is on vacation.')":`buyNow('${p.id}','${v.id}')`;
  // Data-driven, same as productCard(): once this variant is in the cart,
  // show the -/+ stepper instead of Add to cart — works automatically for
  // every product, new or existing, with no product-specific code.
  const q=paused?0:cartQtyFor(p.id,v.id);
  const detailActions = q
    ? `<div class="detailBtns hasQty"><div class="inlineQty"><button onclick="changeProductQty('${p.id}','${v.id}',-1)" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button><b>${q}</b><button onclick="changeProductQty('${p.id}','${v.id}',1)" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button></div><button class="btn gold" onclick="openCart()">View cart</button></div>`
    : `<div class="detailBtns"><button class="btn light" ${paused?'disabled':''} onclick="${addAction}">${paused?'Orders paused':'Add to cart'}</button><button class="btn gold" ${paused?'disabled':''} onclick="${buyAction}">${paused?'Unavailable':'Buy now →'}</button></div>`;
  $('productContent').innerHTML=`<div class="detailGrid">
    <div class="detailImage">${productGalleryMarkup(p)}</div>
    <div class="detailCopy">
      <div class="eyebrow">${escapeHtml(catName(p.category))}</div>
      <h2>${escapeHtml(p.name)}</h2>
      <div class="stars">★★★★★ <span>${p.rating} · ${p.reviewCount} reviews</span></div>
      <p>${escapeHtml(p.short)}</p>
      <div class="detailVariants">${p.variants.filter(x=>x.active).map(x=>`<button class="${x.id===v.id?'active':''}" onclick="selectedVariants['${p.id}']='${x.id}';openProduct('${p.id}')">${escapeHtml(x.label)}<small>${money(x.price)}</small></button>`).join('')}</div>
      <div class="detailPrice"><b>${money(v.price)}</b><del>${money(v.mrp)}</del>${v.mrp>v.price?`<em>Save ${money(v.mrp-v.price)}</em>`:''}</div>
      <div class="detailUse"><b>Works well with</b><span>${(p.mealTags||[]).map(m=>escapeHtml(mealTagList.find(t=>t.id===m)?.name||CONFIG.mealLabels?.[m]||m)).join(' · ')||'Everyday meals'}</span></div>
      ${detailActions}
    </div></div>`;
  $('productOverlay').classList.add('open');document.body.classList.add('modalOpen');
}
function closeProduct(){openProductId=null;$('productOverlay').classList.remove('open');document.body.classList.remove('modalOpen')}

/* ---------- Back-button / history sync (item 12) ---------- */
// Not a routing framework — deliberately kept small per the spec. Every
// overlay in this app (cart, product detail, search, account, checkout)
// is opened from several different call sites via a plain
// classList.add('open'), so instead of touching every one of those call
// sites individually (higher risk of missing one), this watches the
// overlays' class attribute directly: whenever any overlay becomes
// open, it pushes exactly one history entry; whenever it's dismissed
// (Escape, backdrop click, an explicit close button — anything that
// removes the 'open' class) it consumes that same entry via
// history.back() so the two states never drift apart. The result:
// pressing the hardware/browser/gesture Back button while any overlay
// is open closes that overlay and returns to the underlying page —
// exactly like closing it any other way — instead of leaving the site
// or losing where the customer was.
function initBackNavigation(){
  const overlayIds=['cartOverlay','productOverlay','searchOverlay','accountOverlay','checkoutOverlay','mobileMenu'];
  let pushedForOverlay=false;
  const anyOverlayOpen=()=>overlayIds.some(id=>$(id)?.classList.contains('open'));
  const observer=new MutationObserver(()=>{
    const isOpen=anyOverlayOpen();
    if(isOpen && !pushedForOverlay){
      pushedForOverlay=true;
      history.pushState({jayviOverlay:true}, '', location.href);
    }else if(!isOpen && pushedForOverlay){
      pushedForOverlay=false;
      // Closed via a UI action (not Back) while our entry is still the
      // current one — consume it so a later Back press doesn't land on
      // a dead, already-dismissed overlay state.
      if(history.state?.jayviOverlay) history.back();
    }
  });
  overlayIds.forEach(id=>{ const el=$(id); if(el) observer.observe(el,{attributes:true,attributeFilter:['class']}); });
  window.addEventListener('popstate', ()=>{
    // A real Back press: if something is still open at this point, it
    // means Back itself is what should close it (the case above already
    // handled UI-driven closes and won't still show anything open here).
    if(anyOverlayOpen()){
      closeCart();closeProduct();closeSearch();closeAccount();closeCheckout();closeMenu();
      pushedForOverlay=false;
    }
  });
}

/* ---------- Misc UI ---------- */
function toggleMenu(){$('mobileMenu').classList.toggle('open');$('menuScrim')?.classList.toggle('open')}
function closeMenu(){$('mobileMenu').classList.remove('open');$('menuScrim')?.classList.remove('open')}
function initOverlayDismissal(){
  document.querySelectorAll('.overlay').forEach(o=>o.addEventListener('click',e=>{
    if(e.target!==o)return;
    if(o.id==='cartOverlay')closeCart();
    else if(o.id==='productOverlay')closeProduct();
    else if(o.id==='searchOverlay')closeSearch();
    else if(o.id==='accountOverlay')closeAccount();
    else if(o.id==='checkoutOverlay')closeCheckout();
  }));
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape')return;
    closeCart();closeProduct();closeSearch();closeAccount();closeCheckout();closeMenu();
  });
}
let toastTimer;
function showToast(t){
  clearTimeout(toastTimer);
  const el=$('toast'); el.innerHTML=`<strong>${escapeHtml(t)}</strong>`;
  el.classList.add('show');
  toastTimer=setTimeout(()=>el.classList.remove('show'),2800);
}
function showCartAddedToast(productName){
  clearTimeout(toastTimer);
  const el=$('toast');
  el.innerHTML = `<span class="toastRow"><strong>✓ ${escapeHtml(productName)} added to your bag</strong><button onclick="openCart()">View Cart</button></span>`;
  el.classList.add('show');
  toastTimer=setTimeout(()=>el.classList.remove('show'),3600);
}
function applyVacation(){
  const banner=$('vacationBanner');
  if(CONFIG.store?.vacationMode){
    if(banner){banner.style.display='block';banner.textContent=CONFIG.store.vacationMessage||'Orders are temporarily paused while Jayvi Foods is away.'}
    document.querySelectorAll('.pcActions button,.comboActions button').forEach(b=>{b.disabled=true;b.textContent='Orders paused'});
  }else if(banner){banner.style.display='none'}
}
function setupAnnouncementTicker(){
  const viewport=document.querySelector('.announcementViewport');
  if(!viewport)return;
  let resume;
  const pause=()=>viewport.closest('.topbar').classList.add('paused');
  const play=()=>{clearTimeout(resume);resume=setTimeout(()=>viewport.closest('.topbar').classList.remove('paused'),1800)};
  viewport.addEventListener('pointerdown',pause,{passive:true});
  viewport.addEventListener('pointerup',play,{passive:true});
  viewport.addEventListener('pointerleave',play,{passive:true});
}

/* ---------- Boot ---------- */
async function init(){
  CONFIG=loadConfig();
  initOverlayDismissal();
  initBackNavigation();
  // V32.6: products/media/combos come from Supabase now (see
  // loadCatalogFromSupabase). CONFIG.products/CONFIG.combos are
  // overwritten in place when the fetch succeeds; on failure they keep
  // whatever loadConfig() already gave them, so the storefront never
  // renders empty.
  await loadCatalogFromSupabase();
  sync();
  if(CONFIG.store.vacationMode){
    const b=$('vacationBanner');
    if(b){b.style.display='block';b.textContent=CONFIG.store.vacationMessage||'Orders are temporarily paused while Jayvi Foods is away.'}
  }
  renderBest();renderCategories();renderProducts();renderCombos();renderMeal();renderReviews();renderCart();
  renderFooterSocialLinks();
  renderBrandGallery();
  heroShow();startHero();enableHeroSwipe();setupAnnouncementTicker();
  applyVacation();

  // Restore a persistent Supabase session (works across devices in the
  // sense that signing in on any device authenticates against the same
  // Supabase account — profile/orders/addresses always come from
  // Supabase, never from this device's localStorage).
  currentUser = await getSessionUser();
  if(currentUser) await refreshProfile();
  sb.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
    if(!currentUser) currentProfile = null;
  });

  // Item J: arriving from Admin's own redirect (no session yet) opens
  // straight to login, or straight to the Admin panel if already
  // signed in as an admin — either way, no separate admin-login page.
  if(new URLSearchParams(location.search).get('returnTo')==='admin'){
    if(currentUser && currentProfile?.role==='admin') location.href='admin.html';
    else openAccount();
  }
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
