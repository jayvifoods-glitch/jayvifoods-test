/* =========================================================
   Jayvi Foods — v31.0 storefront logic
   Data model and localStorage keys are unchanged from v27/28
   so existing Admin-entered data keeps working after this
   upgrade. All UI/interaction code has been rewritten as a
   single clean pass (no runtime "patches") for v31.
   ========================================================= */

const EMBEDDED_CONFIG = {
  "store":{"name":"Jayvi Foods","tagline":"Purely Traditional. Simply Delicious.","country":"IN","freeShippingThreshold":599,"shippingFlat":49,"deliveryMode":"india","googleMapsApiKey":"","googleReviewsUrl":"https://www.google.com/search?q=Jayvi+Foods+reviews","whatsapp":"918861981003","instagram":"https://instagram.com/jayvifoods","razorpayKeyId":"","paymentMode":"upi_manual","upiEnabled":true,"codEnabled":false,"upiId":"","upiName":"Jayvi Foods","upiQrImage":"","paymentNote":"Pay by UPI QR. Order moves to processing after payment verification.","vacationMode":false,"vacationMessage":"We are taking a short break. Orders will resume soon.","deliveryMinDays":4,"deliveryMaxDays":8,"otpEnabled":false,"otpProvider":"","razorpayEnabled":false},
  "homepage":{"heroAutoplay":true,"heroSeconds":5},
  "categories":[{"id":"chutney","name":"Chutney Powders","enabled":true,"order":1},{"id":"pudi","name":"Pudi","enabled":true,"order":2},{"id":"snacks","name":"Snacks","enabled":true,"order":3},{"id":"combos","name":"Combos","enabled":true,"order":4}],
  "products":[
    {"id":"peanut","sku":"JF-TAR-CLS-PNT","name":"Peanut Chutney","short":"Rich, nutty and comforting.","category":"chutney","active":true,"best":true,"image":"images/products/peanut-chutney.webp","imageClass":"peanut","variants":[{"id":"peanut-200","label":"200g","weight":"200g","price":155,"mrp":199,"sku":"JF-TAR-CLS-PNT-200","active":true},{"id":"peanut-400","label":"400g","weight":"400g","price":249,"mrp":299,"sku":"JF-TAR-CLS-PNT-400","active":true}],"mealTags":["idli","dosa","chapati","rice"],"rating":4.8,"reviewCount":18},
    {"id":"flaxseed","sku":"JF-TAR-CLS-FLX","name":"Flaxseed Chutney","short":"A distinctive traditional flavour.","category":"chutney","active":true,"best":true,"image":"images/hero/jayvi-products.webp","imageClass":"flaxseed","variants":[{"id":"flaxseed-200","label":"200g","weight":"200g","price":155,"mrp":199,"sku":"JF-TAR-CLS-FLX-200","active":true},{"id":"flaxseed-400","label":"400g","weight":"400g","price":249,"mrp":299,"sku":"JF-TAR-CLS-FLX-400","active":true}],"mealTags":["idli","dosa","chapati","rice"],"rating":4.8,"reviewCount":12},
    {"id":"pudi","sku":"JF-TAR-CLS-IDP","name":"Idli Dosa Pudi","short":"Made for idli, dosa and everyday meals.","category":"pudi","active":true,"best":true,"image":"images/hero/jayvi-products.webp","imageClass":"pudi","variants":[{"id":"pudi-200","label":"200g","weight":"200g","price":155,"mrp":199,"sku":"JF-TAR-CLS-IDP-200","active":true},{"id":"pudi-400","label":"400g","weight":"400g","price":249,"mrp":299,"sku":"JF-TAR-CLS-IDP-400","active":true}],"mealTags":["idli","dosa","chapati","rice"],"rating":4.8,"reviewCount":9},
    {"id":"puffora","sku":"JF-PUF","name":"Puffora","short":"Crunchy, puffy, made for anytime snacking.","category":"snacks","active":true,"best":true,"image":"images/hero/jayvi-products.webp","imageClass":"puffora","variants":[{"id":"puffora-pack","label":"Pack","weight":"Pack","price":99,"mrp":129,"sku":"JF-PUF-200","active":true}],"mealTags":[],"rating":4.7,"reviewCount":4}
  ],
  "combos":[{"id":"duo","name":"Traditional Duo","short":"Peanut + Flaxseed. Two everyday favourites.","active":true,"price":289,"mrp":310,"image":"images/hero/jayvi-products.webp","items":[{"productId":"peanut","variantId":"peanut-200","qty":1},{"productId":"flaxseed","variantId":"flaxseed-200","qty":1}]}],
  "announcements":[{"id":"h1","label":"BESTSELLER","title":"Peanut Chutney","em":"for every meal.","text":"Rich, nutty and comforting — the everyday favourite.","productId":"peanut","actionType":"product","actionTarget":"peanut","active":true,"order":1},{"id":"h2","label":"NEW","title":"Puffora","em":"crunch time.","text":"A crunchy Jayvi snack for anytime munching.","productId":"puffora","actionType":"product","actionTarget":"puffora","active":true,"order":2},{"id":"h3","label":"COMBO","title":"Traditional Duo","em":"one easy choice.","text":"Peanut + Flaxseed together at ₹289.","comboId":"duo","actionType":"combo","actionTarget":"duo","active":true,"order":3}],
  "mealTags":[{"id":"idli","name":"Idli","enabled":true,"order":1},{"id":"dosa","name":"Dosa","enabled":true,"order":2},{"id":"chapati","name":"Chapati","enabled":true,"order":3},{"id":"rice","name":"Rice + Ghee","enabled":true,"order":4},{"id":"roti","name":"Roti","enabled":true,"order":5},{"id":"paratha","name":"Paratha","enabled":true,"order":6},{"id":"poori","name":"Poori","enabled":true,"order":7},{"id":"upma","name":"Upma","enabled":true,"order":8},{"id":"vada","name":"Vada","enabled":true,"order":9},{"id":"curd-rice","name":"Curd Rice","enabled":true,"order":10}],
  "reviews":[{"source":"customer","name":"Prateeksha","rating":5,"text":"It was nice, perfect & tasty.","active":true},{"source":"customer","name":"Praveen Yandigeri","rating":5,"text":"Best Authentic Taste! The Peanut chutney is rich and nutty, while the Flaxseed is savory and spicy. These powders go perfectly with idli, dosa, rotis and sandwiches.","active":true},{"source":"customer","name":"Bhoomika","rating":5,"text":"The peanut chutney pudi was genuinely very good. We had it with chapati, curd, hot rice and ghee, and everyone at home loved it.","active":true},{"source":"customer","name":"Varada Rajesh","rating":5,"text":"Absolutely loved the taste! Feels very homemade and authentic. The peanut chutney is very tasty and the flaxseed one is unique.","active":true}]
};

const DEFAULT_PRODUCT_MEDIA={
 peanut:[{type:'image',path:'images/products/peanut/hero.webp'},{type:'image',path:'images/gallery/peanut-front.svg'},{type:'image',path:'images/gallery/peanut-back.svg'},{type:'image',path:'images/gallery/peanut-serving.svg'}],
 flaxseed:[{type:'image',path:'images/products/flaxseed/hero.webp'},{type:'image',path:'images/gallery/flaxseed-front.svg'},{type:'image',path:'images/gallery/flaxseed-back.svg'},{type:'image',path:'images/gallery/flaxseed-serving.svg'}],
 pudi:[{type:'image',path:'images/products/pudi/hero.webp'},{type:'image',path:'images/gallery/pudi-front.svg'},{type:'image',path:'images/gallery/pudi-back.svg'},{type:'image',path:'images/gallery/pudi-serving.svg'}],
 puffora:[{type:'image',path:'images/products/puffora/hero.webp'},{type:'image',path:'images/gallery/puffora-front.svg'},{type:'image',path:'images/gallery/puffora-back.svg'},{type:'image',path:'images/gallery/puffora-serving.svg'}]
};

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
    d.pendingReviews=u.pendingReviews||[];
    return d;
  }catch{ return structuredClone(EMBEDDED_CONFIG); }
}
function sync(){
  products=(CONFIG.products||[]).filter(p=>p.active).map(p=>({...p,media:p.media?.length?p.media:(DEFAULT_PRODUCT_MEDIA[p.id]||[{type:'image',path:p.image}])}));
  categories=(CONFIG.categories||[]).filter(c=>c.enabled).sort((a,b)=>a.order-b.order);
  mealTagList=(CONFIG.mealTags||[]).filter(t=>t.enabled).sort((a,b)=>a.order-b.order);
  if($('topShipping')) $('topShipping').textContent=`FREE SHIPPING ABOVE ${money(CONFIG.store.freeShippingThreshold)}`;
}
function getProduct(id){return products.find(p=>p.id===id)}
function getCombo(id){return (CONFIG.combos||[]).find(c=>c.id===id&&c.active)}
function getVariant(p,vid){return (p?.variants||[]).find(v=>v.id===vid&&v.active)||(p?.variants||[]).find(v=>v.active)}
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
function cardMediaMarkup(p){
  const media=(p.media?.length?p.media:DEFAULT_PRODUCT_MEDIA[p.id]||[{type:'image',path:p.image}]).filter(Boolean);
  const count=media.length;
  const slides=media.map((m,i)=>m.type==='video'&&m.path
    ? `<div class="cardMediaSlide cardVideo"><video controls playsinline preload="metadata" poster="${escapeHtml(m.poster||'')}"><source src="${escapeHtml(m.path)}" type="video/mp4"></video><span class="mediaLabel">Video</span></div>`
    : `<div class="cardMediaSlide"><img src="${escapeHtml(m.path||m)}" alt="${escapeHtml(p.name)} image ${i+1}" loading="${i?'lazy':'eager'}" onerror="this.closest('.cardMediaSlide')?.remove()"></div>`
  ).join('');
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
  return `<div class="productGallery"><div class="galleryMain"><img id="galleryMainImg" src="${items[0].path}" alt="${escapeHtml(p.name)}" onerror="this.src='images/hero/jayvi-products.webp'"></div><div class="galleryThumbs">${items.map((m,i)=>`<button type="button" class="${i===0?'active':''}" onclick="setGalleryImage('${escapeHtml(m.path)}',this)"><img src="${escapeHtml(m.path)}" alt=""></button>`).join('')}</div></div>`;
}
function setGalleryImage(path,btn){
  const img=$('galleryMainImg');
  if(img){img.src=path;img.onerror=()=>img.src='images/hero/jayvi-products.webp'}
  document.querySelectorAll('.galleryThumbs button').forEach(x=>x.classList.remove('active'));
  btn?.classList.add('active');
}

/* ---------- Product card / grids ---------- */
function productCard(p){
  const v=getVariant(p,variantKey(p.id)),off=v.mrp-v.price,q=cartQtyFor(p.id,v.id);
  const actions=q
    ?`<div class="pcActions hasQty"><div class="inlineQty"><button onclick="changeProductQty('${p.id}','${v.id}',-1)" aria-label="Decrease quantity">−</button><b>${q}</b><button onclick="changeProductQty('${p.id}','${v.id}',1)" aria-label="Increase quantity">+</button></div><button class="viewCartBtn" onclick="openCart()" aria-label="View cart"><i class="fa-solid fa-bag-shopping"></i></button></div>`
    :`<div class="pcActions"><button onclick="addToCart('${p.id}','${v.id}')">Add to cart</button><button onclick="buyNow('${p.id}','${v.id}')">Buy now</button></div>`;
  return `<article class="productCard" data-product-id="${p.id}">
    <div class="visualWrap" onclick="openProduct('${p.id}')">${cardMediaMarkup(p)}${p.best?'<span class="badge">BESTSELLER</span>':''}<button class="heart ${wishlist.includes(p.id)?'isWish':''}" onclick="event.stopPropagation();toggleWishlist('${p.id}')" aria-label="Favourite ${escapeHtml(p.name)}"><i class="${wishlist.includes(p.id)?'fa-solid':'fa-regular'} fa-heart"></i></button></div>
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
  const itemImages=(c.items||[]).map(i=>getProduct(i.productId)?.image).filter(Boolean);
  const media=[c.image,...itemImages].filter(Boolean);
  const unique=[...new Set(media)];
  const count=unique.length;
  const slides=unique.map((src,i)=>`<div class="comboSlide"><img src="${escapeHtml(src)}" alt="${escapeHtml(c.name)} image ${i+1}" loading="${i?'lazy':'eager'}"></div>`).join('');
  const controls=count>1?`<span class="galleryCount">1 / ${count}</span>`:'';
  return `<div class="comboMediaScroller" data-count="${count}" aria-label="${escapeHtml(c.name)} images">${slides}</div>${controls}`;
}
function renderCombos(){
  if(!$('comboGrid'))return;
  const cs=(CONFIG.combos||[]).filter(c=>c.active);
  $('comboCount').textContent=cs.length?`${cs.length} combo${cs.length>1?'s':''}`:'';
  $('comboGrid').innerHTML=cs.length?cs.map(c=>`<article class="comboCard">
    <div class="comboImage">${comboMediaMarkup(c)}</div>
    <div class="comboBody">
      <div class="eyebrow" style="color:#e8d9b6">COMBO</div>
      <h3>${escapeHtml(c.name)}</h3><p>${escapeHtml(c.short)}</p>
      <div class="comboItems">${c.items.map(i=>{const p=getProduct(i.productId),v=p?getVariant(p,i.variantId):null;return `<span>${escapeHtml(p?.name||'')} · ${v?.label||''}</span>`}).join('')}</div>
      <div class="comboPrice"><b>${money(c.price)}</b><del>${money(c.mrp)}</del><em>Save ${money(c.mrp-c.price)}</em></div>
      <div class="pcActions comboActions"><button onclick="addCombo('${c.id}')">Add to cart</button><button onclick="buyCombo('${c.id}')">Buy now</button></div>
    </div></article>`).join(''):'<div class="empty" style="color:#cbbca8">No active combos yet.</div>';
  bindComboGalleryScrollers();
}
function addCombo(id){const c=getCombo(id);if(!c)return;const key='combo:'+id;const x=cart.find(i=>i.key===key);if(x)x.qty++;else cart.push({key,type:'combo',comboId:id,qty:1});saveCart();renderCart();refreshProductViews();openCart();showToast(c.name+' added to cart')}
function buyCombo(id){const c=getCombo(id);if(!c)return;const key='combo:'+id;const x=cart.find(i=>i.key===key);if(x)x.qty++;else cart.push({key,type:'combo',comboId:id,qty:1});saveCart();renderCart();refreshProductViews();openCheckout()}

/* ---------- Meal match ---------- */
const MEAL_DESCRIPTIONS={idli:'Idli + your favourite podi or chutney',dosa:'Dosa + your favourite chutney flavour',chapati:'Chapati works with every chutney and podi',rice:'Rice + ghee + chutney powder or podi'};
function renderMeal(){
  if(!$('mealTabs'))return;
  $('mealTabs').innerHTML=mealTagList.map(t=>`<button class="${t.id===meal?'active':''}" onclick="setMeal('${t.id}')">${escapeHtml(t.name)}</button>`).join('');
  const rec=products.filter(p=>p.mealTags?.includes(meal));
  const desc=MEAL_DESCRIPTIONS[meal]||'Pick from all products that fit this meal';
  $('mealRecommendations').innerHTML=`<div class="mealIntro"><b>${escapeHtml(desc)}</b><span>${rec.length} product${rec.length===1?'':'s'}</span></div>
    <div class="miniProducts">${rec.map(p=>{const v=getVariant(p,variantKey(p.id));return `<button onclick="openProduct('${p.id}')"><div class="miniImg"><img src="${p.image}" alt=""></div><span>${escapeHtml(p.name)}</span><b>${money(v.price)}</b></button>`}).join('')||'<div class="empty">No matching products yet.</div>'}</div>`;
}
function setMeal(m){meal=m;renderMeal()}

/* ---------- Reviews ---------- */
function renderReviews(){
  if(!$('reviewGrid'))return;
  const rev=(CONFIG.reviews||[]).filter(r=>r.active&&r.source==='customer').slice(0,4);
  $('reviewGrid').innerHTML=rev.map(r=>`<article><div class="stars">${'★'.repeat(r.rating)}</div><p>“${escapeHtml(r.text)}”</p><b>${escapeHtml(r.name)}</b><small>Customer review</small></article>`).join('')+
    `<article class="googleCard"><i class="fa-brands fa-google"></i><h3>More reviews on Google</h3><p>See the latest customer feedback directly on Google.</p><a href="${CONFIG.store.googleReviewsUrl}" target="_blank">View Google reviews →</a></article>`;
  if($('googleReviewsTop'))$('googleReviewsTop').href=CONFIG.store.googleReviewsUrl;
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
function refreshProductViews(){renderBest();renderProducts();renderMeal();renderCombos()}
function addToCart(pid,vid){
  const p=getProduct(pid),v=getVariant(p,vid); if(!p||!v)return;
  const key='product:'+pid+':'+v.id, x=cart.find(i=>i.key===key);
  if(x)x.qty++; else cart.push({key,type:'product',productId:pid,variantId:v.id,qty:1});
  saveCart();renderCart();refreshProductViews();openCart();
}
function changeProductQty(pid,vid,d){
  const key='product:'+pid+':'+vid; let x=cart.find(i=>i.key===key);
  if(!x&&d>0){const p=getProduct(pid),v=getVariant(p,vid);if(!p||!v)return;cart.push({key,type:'product',productId:pid,variantId:v.id,qty:1})}
  else if(!x){return}
  else{x.qty+=d; if(x.qty<1)cart=cart.filter(i=>i.key!==key)}
  saveCart();renderCart();refreshProductViews();
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
}
function removeCart(key){cart=cart.filter(x=>x.key!==key);saveCart();renderCart();refreshProductViews();showToast('Removed from cart')}
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
    return `<div class="cartItem"><img src="${d.image}" alt=""><div><b>${escapeHtml(d.name)}</b><small>${escapeHtml(d.label)} · ${money(d.price)}</small>
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
function closeAccount(){$('accountOverlay').classList.remove('open');document.body.classList.remove('modalOpen')}
function openAuth(m){$('accountContent').innerHTML=authView(m)}
function authView(mode){
  return `<div class="eyebrow">MY JAYVI</div><h2>${mode==='login'?'Welcome back.':'Create your Jayvi account.'}</h2>
  <p class="muted">${mode==='login'?'Use your mobile number and password.':'Your mobile number is your Jayvi user ID.'}</p>
  <form onsubmit="${mode==='login'?'loginSubmit(event)':'registerSubmit(event)'}">
    ${mode==='register'?'<label>Name *<input id="authName" required></label>':''}
    <label>Mobile number *<input id="authId" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" required placeholder="10-digit mobile number"></label>
    <label>Password *<input id="authPass" type="password" minlength="6" required></label>
    ${mode==='register'?'<label>Confirm password *<input id="authPass2" type="password" minlength="6" required></label>':''}
    <button class="btn gold full">${mode==='login'?'Sign in':'Create account'} →</button>
  </form>
  <div id="authError" class="tiny" style="color:var(--danger)"></div>
  <div class="authSwitch">${mode==='login'?`New here? <button onclick="openAuth('register')">Create account</button>`:`Already have an account? <button onclick="openAuth('login')">Sign in</button>`}</div>
  ${mode==='login'?'<button class="textBtn" onclick="showOtpUnavailable()">Use OTP instead</button>':''}
  <div class="guestNote">You can always <button onclick="closeAccount();openCheckout()">continue as guest</button> without creating an account.</div>`;
}
function showOtpUnavailable(){showToast('OTP login is not available yet. Password login is currently enabled.')}
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
    authErr(/already|exists|registered/i.test(error.message) ? 'An account already exists with this mobile number' : error.message);
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
  const phone=$('authId').value.trim(), p=$('authPass').value;
  const {data, error} = AUTH_MODE==='phone'
    ? await sb.auth.signInWithPassword({ phone, password:p })
    : await sb.auth.signInWithPassword({ email:phoneToAuthEmail(phone), password:p });
  if(error){ authErr('Mobile number or password is incorrect'); return; }
  currentUser = data.user;
  await refreshProfile();
  showToast('Signed in');
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
  $('accountContent').innerHTML = `<div class="eyebrow">MY JAYVI</div><h2>Welcome, ${escapeHtml((currentProfile?.name||'Customer').split(' ')[0])}.</h2>
    <p class="muted">${escapeHtml(currentProfile?.phone||'')}</p>
    <div class="accountTabs">
      <button class="${activeTab==='orders'?'active':''}" onclick="renderAccountView('orders')">Orders</button>
      <button class="${activeTab==='addresses'?'active':''}" onclick="renderAccountView('addresses')">Addresses</button>
      <button onclick="trackOrderPrompt()">Track order</button>
      <button onclick="signOut()">Sign out</button>
    </div>
    <div id="accountTabBody">Loading…</div>`;
  if(activeTab==='addresses') renderAddressTab(); else renderOrdersTab();
}
async function renderOrdersTab(){
  const body = $('accountTabBody'); if(!body) return;
  const {data, error} = await sb.from('orders')
    .select('order_number,status,total,created_at')
    .order('created_at',{ascending:false});
  if(error){ body.innerHTML = `<div class="empty">Could not load orders: ${escapeHtml(error.message)}</div>`; return; }
  body.innerHTML = `<div class="orders">${(data||[]).length ? data.map(o=>
    `<button class="order" type="button" onclick="trackKnownOrder('${escapeHtml(o.order_number)}','${escapeHtml(currentProfile?.phone||'')}')"><b>${escapeHtml(o.order_number)}</b><span>${new Date(o.created_at).toLocaleDateString('en-IN')}</span><strong>${money(o.total)}</strong><small>${escapeHtml(o.status)}</small></button>`
  ).join('') : '<div class="empty">No orders yet.</div>'}</div>`;
}
async function renderAddressTab(){
  const body = $('accountTabBody'); if(!body) return;
  const {data, error} = await sb.from('customer_addresses').select('*').order('is_default',{ascending:false});
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
async function openCheckout(){
  if(CONFIG.store.vacationMode){showToast(CONFIG.store.vacationMessage||'Ordering is temporarily paused.');return}
  if(!cart.length){showToast('Your cart is empty');return}
  closeCart();
  const t=cartTotals();
  const u = currentUser ? currentProfile : null;
  let savedAddr = null;
  if(currentUser){
    const {data} = await sb.from('customer_addresses').select('*').order('is_default',{ascending:false}).limit(1);
    savedAddr = data?.[0] || null;
  }
  const upi=CONFIG.store.upiEnabled!==false, cod=CONFIG.store.codEnabled!==false;
  $('checkoutContent').innerHTML=`<div class="checkoutGrid">
    <div>
      <div class="eyebrow">CHECKOUT</div><h2>Delivery details.</h2>
      <p class="muted">Choose how you want to pay. You can order as a guest or sign in.</p>
      <div class="deliveryEstimate"><b>Estimated delivery: ${CONFIG.store.deliveryMinDays||4}–${CONFIG.store.deliveryMaxDays||8} days</b><span>Delivery time varies by location and PIN code.</span></div>
      <div class="guestChoice"><b>Checkout as ${u?'signed-in customer':'guest'}</b>${u?`<button onclick="signOut().then(openCheckout)">Use guest</button>`:'<button onclick="closeCheckout();openAccount()">Sign in / register</button>'}</div>
      <form id="checkoutForm" onsubmit="placeOrder(event)">
        <label>Full name *<input id="coName" value="${escapeHtml(u?.name||'')}" required></label>
        <label>Mobile *<input id="coPhone" value="${escapeHtml(u?.phone||'')}" required pattern="[0-9]{10}" maxlength="10"></label>
        <label>Search delivery location <span class="tiny">Google Maps ready</span><div id="placeBox"></div></label>
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
      <div class="line"><span>Delivery</span><b>${t.ship?money(t.ship):'FREE'}</b></div>
      <div class="line total"><span>Total</span><b>${money(t.total)}</b></div>
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
async function verifyPincode(){
  const pin=$('coPin').value.trim(), status=$('pinStatus');
  if(!/^\d{6}$/.test(pin)){status.className='pinStatus bad';status.textContent='Enter a 6-digit Indian PIN code.';return}
  if(CONFIG.store.deliveryMode!=='india'){status.className='pinStatus bad';status.textContent='Delivery is currently disabled.';return}
  const blocked=(CONFIG.store.blockedPincodes||[]).map(String);
  if(blocked.includes(pin)){status.className='pinStatus bad';status.textContent='Sorry, this PIN is currently not serviceable.';return}
  status.className='pinStatus good';status.textContent='PIN accepted for India delivery. Final address validation will run in the production backend.';
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
  const t=cartTotals();
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
      p_subtotal: t.sub, p_shipping: t.ship, p_total: t.total,
      p_payment_method: method,
      p_estimated_delivery: `${CONFIG.store.deliveryMinDays||4}-${CONFIG.store.deliveryMaxDays||8} days`,
      p_items: items
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
  $('accountContent').innerHTML=`<div class="paymentSuccess"><div class="eyebrow">PAYMENT</div><h2>Pay ${money(o.total)}</h2>
    <p class="muted">Scan this QR with any UPI app. Your order will move to processing after we verify the payment.</p>${qr}
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
  const steps=['Order received','Payment verified','Preparing','Packed','Shipped','Out for delivery','Delivered'];
  const current=o.status||'';
  return `<div class="timeline">${steps.map((s,i)=>`<div class="timelineStep ${current.toLowerCase().includes(s.toLowerCase())?'current':''}"><i>${i+1}</i><span>${s}</span></div>`).join('')}</div>`;
}
function trackOrderPrompt(){
  openAccount();
  $('accountContent').innerHTML=`<div class="eyebrow">TRACK ORDER</div><h2>Where is my order?</h2><p class="muted">Enter your order number and mobile number.</p>
    <label>Order number<input id="trackId" placeholder="JF-YYYYMMDD-XXXXXX"></label>
    <label>Mobile<input id="trackPhone" maxlength="10"></label>
    <button class="btn gold full" onclick="trackOrder()">Track order →</button>`;
}
async function trackKnownOrder(orderNumber, phone){
  const {data, error} = await sb.rpc('track_guest_order', {p_order_number:orderNumber, p_phone:phone});
  const o = data?.[0];
  if(error || !o){showToast('Order could not be found for this mobile number.');return}
  $('accountContent').innerHTML=`<div class="eyebrow">ORDER ${escapeHtml(o.order_number)}</div><h2>${escapeHtml(o.status||'Order received')}</h2>
    <p class="muted">${money(o.total)}</p>${renderTimeline(o)}
    <div class="orderTrackNote">${o.tracking_url?`Tracking: <a href="${escapeHtml(o.tracking_url)}" target="_blank">Open courier tracking →</a><br>`:''}${o.delivery_partner?`Courier: ${escapeHtml(o.delivery_partner)}<br>`:''}Estimated delivery: ${escapeHtml(o.estimated_delivery||'4–8 days')}.</div>`;
  $('accountOverlay').classList.add('open');document.body.classList.add('modalOpen');
}
function trackOrder(){
  const id=$('trackId').value.trim(), phone=$('trackPhone').value.trim();
  if(!/^\d{10}$/.test(phone)){showToast('Enter the 10-digit mobile number used for the order.');return}
  trackKnownOrder(id,phone);
}

/* ---------- Product detail ---------- */
function openProduct(id){
  const p=getProduct(id); if(!p)return;
  if(isMobile()){
    const card=document.querySelector(`[data-product-id="${id}"]`);
    card?.scrollIntoView({behavior:'smooth',block:'start'});
  }
  const v=getVariant(p,variantKey(id));
  const paused=!!CONFIG.store.vacationMode;
  const addAction=paused?"showToast('Ordering is paused while Jayvi Foods is on vacation.')":`addToCart('${p.id}','${v.id}')`;
  const buyAction=paused?"showToast('Ordering is paused while Jayvi Foods is on vacation.')":`buyNow('${p.id}','${v.id}')`;
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
      <div class="detailBtns"><button class="btn light" ${paused?'disabled':''} onclick="${addAction}">${paused?'Orders paused':'Add to cart'}</button><button class="btn gold" ${paused?'disabled':''} onclick="${buyAction}">${paused?'Unavailable':'Buy now →'}</button></div>
    </div></div>`;
  $('productOverlay').classList.add('open');document.body.classList.add('modalOpen');
}
function closeProduct(){$('productOverlay').classList.remove('open');document.body.classList.remove('modalOpen')}

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
  sync();
  if(CONFIG.store.vacationMode){
    const b=$('vacationBanner');
    if(b){b.style.display='block';b.textContent=CONFIG.store.vacationMessage||'Orders are temporarily paused while Jayvi Foods is away.'}
  }
  renderBest();renderCategories();renderProducts();renderCombos();renderMeal();renderReviews();renderCart();
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
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
