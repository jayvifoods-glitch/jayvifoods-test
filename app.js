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
  "mealTags":[{"id":"idli","name":"Idli","enabled":true,"order":1},{"id":"dosa","name":"Dosa","enabled":true,"order":2},{"id":"chapati","name":"Chapati","enabled":true,"order":3},{"id":"rice","name":"Rice + Ghee","enabled":true,"order":4},{"id":"roti","name":"Roti","enabled":true,"order":5},{"id":"paratha","name":"Paratha","enabled":true,"order":6},{"id":"poori","name":"Poori","enabled":true,"order":7},{"id":"upma","name":"Upma","enabled":true,"order":8},{"id":"vada","name":"Vada","enabled":true,"order":9},{"id":"curd-rice","name":"Curd Rice","enabled":true,"order":10}],"mealLabels":{"idli":"Idli","dosa":"Dosa","chapati":"Chapati","rice":"Rice + Ghee","roti":"Roti","paratha":"Paratha","poori":"Poori","upma":"Upma","vada":"Vada","curd-rice":"Curd Rice"},
  "reviews":[{"source":"customer","name":"Prateeksha","rating":5,"text":"It was nice, perfect & tasty.","active":true},{"source":"customer","name":"Praveen Yandigeri","rating":5,"text":"Best Authentic Taste! The Peanut chutney is rich and nutty, while the Flaxseed is savory and spicy. These powders go perfectly with idli, dosa, rotis and sandwiches.","active":true},{"source":"customer","name":"Bhoomika","rating":5,"text":"The peanut chutney pudi was genuinely very good. We had it with chapati, curd, hot rice and ghee, and everyone at home loved it.","active":true},{"source":"customer","name":"Varada Rajesh","rating":5,"text":"Absolutely loved the taste! Feels very homemade and authentic. The peanut chutney is very tasty and the flaxseed one is unique.","active":true}]
};
let CONFIG=loadConfig(), products=[], categories=[], cat='all', heroIndex=0, heroTimer=null, meal='idli', selectedVariants={}, cart=loadCart(), wishlist=loadWishlist(), mapsReady=false;
const $=id=>document.getElementById(id), money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
function loadConfig(){try{const x=localStorage.getItem('jayviStoreV14');if(!x)return structuredClone(EMBEDDED_CONFIG);const d=structuredClone(EMBEDDED_CONFIG),u=JSON.parse(x);d.store={...d.store,...(u.store||{})};d.products=u.products||d.products;d.categories=u.categories||d.categories;d.combos=u.combos||d.combos;d.announcements=u.announcements||d.announcements;d.mealTags=u.mealTags||d.mealTags;d.mealLabels=Object.fromEntries((d.mealTags||[]).map(t=>[t.id,t.name]));d.reviews=u.reviews||d.reviews;d.pendingReviews=u.pendingReviews||[];return d}catch{return structuredClone(EMBEDDED_CONFIG)}}
function sync(){products=(CONFIG.products||[]).filter(p=>p.active);categories=(CONFIG.categories||[]).filter(c=>c.enabled).sort((a,b)=>a.order-b.order);if($('topShipping'))$('topShipping').textContent=`FREE SHIPPING ABOVE ${money(CONFIG.store.freeShippingThreshold)}`}
function saveConfig(){localStorage.setItem('jayviStoreV14',JSON.stringify(CONFIG))}
function getProduct(id){return products.find(p=>p.id===id)}
function getCombo(id){return (CONFIG.combos||[]).find(c=>c.id===id&&c.active)}
function getVariant(p,vid){return (p?.variants||[]).find(v=>v.id===vid&&v.active)||(p?.variants||[]).find(v=>v.active)}
function catName(id){return categories.find(c=>c.id===id)?.name||id}
function variantKey(id){return selectedVariants[id]||getVariant(getProduct(id))?.id}
function setVariant(id,vid){selectedVariants[id]=vid;renderBest();renderProducts();renderMeal();renderCombos()}
function imageMarkup(p,extra=''){return `<div class="productImage ${p.imageClass||''} ${extra}"><img src="${p.image}" alt="${escapeHtml(p.name)}" onerror="this.src='images/hero/jayvi-products.webp'"/></div>`}
function productGalleryMarkup(p){
 const media=(p.media||[]).filter(x=>x.type!=='video' && (x.path||x.file));
 const items=media.length?media:[{type:'hero',path:p.image}];
 return `<div class="productGallery"><div class="galleryMain"><img id="galleryMainImg" src="${items[0].path}" alt="${escapeHtml(p.name)}" onerror="this.src='images/hero/jayvi-products.webp'"></div><div class="galleryThumbs">${items.map((m,i)=>`<button type="button" class="${i===0?'active':''}" onclick="setGalleryImage('${escapeHtml(m.path)}',this)"><img src="${escapeHtml(m.path)}" alt=""></button>`).join('')}</div></div>`;
}
function setGalleryImage(path,btn){const img=document.getElementById('galleryMainImg');if(img){img.src=path;img.onerror=()=>img.src='images/hero/jayvi-products.webp'}document.querySelectorAll('.galleryThumbs button').forEach(x=>x.classList.remove('active'));btn?.classList.add('active')}
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function cartQtyFor(pid,vid){const x=cart.find(i=>i.type==='product'&&i.productId===pid&&i.variantId===vid);return x?.qty||0}
function loadWishlist(){try{return JSON.parse(localStorage.getItem('jayviWishlistV9')||'[]')}catch{return []}}
function saveWishlist(){localStorage.setItem('jayviWishlistV9',JSON.stringify(wishlist))}
function toggleWishlist(pid){if(wishlist.includes(pid))wishlist=wishlist.filter(x=>x!==pid);else wishlist.push(pid);saveWishlist();renderBest();renderProducts();showToast(wishlist.includes(pid)?'Added to favourites':'Removed from favourites')}
function productCard(p){const v=getVariant(p,variantKey(p.id));const off=v.mrp-v.price;const q=cartQtyFor(p.id,v.id);const actions=q?`<div class="pcActions"><div class="inlineQty"><button onclick="changeProductQty('${p.id}','${v.id}',-1)">−</button><b>${q}</b><button onclick="changeProductQty('${p.id}','${v.id}',1)">+</button></div><button onclick="openCart()">View cart</button></div>`:`<div class="pcActions"><button onclick="addToCart('${p.id}','${v.id}')">Add to cart</button><button onclick="buyNow('${p.id}','${v.id}')">Buy now</button></div>`;return `<article class="productCard"><div class="visualWrap" onclick="openProduct('${p.id}')">${imageMarkup(p)}${p.best?'<span class="badge">BESTSELLER</span>':''}<button class="heart ${wishlist.includes(p.id)?'isWish':''}" onclick="event.stopPropagation();toggleWishlist('${p.id}')" aria-label="Favourite ${escapeHtml(p.name)}"><i class="${wishlist.includes(p.id)?'fa-solid':'fa-regular'} fa-heart"></i></button></div><div class="pcBody"><small>${catName(p.category)}</small><h3 onclick="openProduct('${p.id}')">${escapeHtml(p.name)}</h3><div class="stars">★★★★★ <span>${p.rating} · ${p.reviewCount} reviews</span></div><p>${escapeHtml(p.short)}</p><div class="sizes">${p.variants.filter(x=>x.active).map(x=>`<button class="${x.id===v.id?'active':''}" onclick="setVariant('${p.id}','${x.id}')">${escapeHtml(x.label)}</button>`).join('')}</div><div class="price"><b>${money(v.price)}</b><del>${money(v.mrp)}</del><em>Save ${money(off)}</em></div>${actions}</div></article>`}
function renderBest(){$('bestGrid').innerHTML=products.filter(p=>p.best).slice(0,4).map(productCard).join('')}
function renderCategories(){$('categoryTabs').innerHTML=`<button class="active" onclick="setCat('all',this)">All</button>`+categories.map(c=>`<button onclick="setCat('${c.id}',this)">${escapeHtml(c.name)}</button>`).join('')}
function setCat(c,b){cat=c;document.querySelectorAll('.categoryTabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProducts()}
function renderProducts(){let q=($('productSearch').value||'').toLowerCase(),arr=products.filter(p=>(cat==='all'||p.category===cat)&&(`${p.name} ${catName(p.category)}`.toLowerCase().includes(q)));const s=$('sortSelect').value;if(s==='priceLow')arr.sort((a,b)=>getVariant(a,variantKey(a.id)).price-getVariant(b,variantKey(b.id)).price);if(s==='priceHigh')arr.sort((a,b)=>getVariant(b,variantKey(b.id)).price-getVariant(a,variantKey(a.id)).price);if(s==='rating')arr.sort((a,b)=>b.rating-a.rating);$('productGrid').innerHTML=arr.map(productCard).join('')||'<div class="empty">No products found.</div>'}
function renderCombos(){const cs=(CONFIG.combos||[]).filter(c=>c.active);$('comboCount').textContent=cs.length?`${cs.length} combo${cs.length>1?'s':''}`:'';$('comboGrid').innerHTML=cs.length?cs.map(c=>`<article class="comboCard"><div class="comboImage"><img src="${c.image}" alt="${escapeHtml(c.name)}"></div><div class="comboBody"><div class="eyebrow">COMBO</div><h3>${escapeHtml(c.name)}</h3><p>${escapeHtml(c.short)}</p><div class="comboItems">${c.items.map(i=>{const p=getProduct(i.productId),v=getVariant(p,i.variantId);return `<span>${escapeHtml(p.name)} · ${v?.label||''}</span>`}).join('')}</div><div class="comboPrice"><b>${money(c.price)}</b><del>${money(c.mrp)}</del><em>Save ${money(c.mrp-c.price)}</em></div><div class="pcActions comboActions"><button onclick="addCombo('${c.id}')">Add to cart</button><button onclick="buyCombo('${c.id}')">Buy now</button></div></div></article>`).join(''):'<div class="empty">No active combos yet. Admin can add them.</div>'}
function addCombo(id){const c=getCombo(id);if(!c)return;const key='combo:'+id;const x=cart.find(i=>i.key===key);if(x)x.qty++;else cart.push({key,type:'combo',comboId:id,qty:1});saveCart();renderCart();refreshProductViews();openCart();showToast(c.name+' added to cart')}
function buyCombo(id){const c=getCombo(id);if(!c)return;const key='combo:'+id;const x=cart.find(i=>i.key===key);if(x)x.qty++;else cart.push({key,type:'combo',comboId:id,qty:1});saveCart();renderCart();refreshProductViews();openCheckout()}
function renderMeal(){const labels=CONFIG.mealLabels||{};const tabs=Object.entries(labels);$('mealTabs').innerHTML=tabs.map(([id,label],i)=>`<button class="${id===meal?'active':''}" onclick="setMeal('${id}',this)">${escapeHtml(label)}</button>`).join('');const rec=products.filter(p=>p.mealTags?.includes(meal));const desc={idli:'Idli + your favourite podi or chutney',dosa:'Dosa + your favourite chutney flavour',chapati:'Chapati works with every chutney and podi',rice:'Rice + ghee + chutney powder or podi'}[meal]||'Pick from all products that fit this meal';$('mealRecommendations').innerHTML=`<div class="mealIntro"><b>${desc}</b><span>${rec.length} products</span></div><div class="miniProducts">${rec.map(p=>{const v=getVariant(p,variantKey(p.id));return `<button onclick="openProduct('${p.id}')"><div class="miniImg"><img src="${p.image}" alt=""></div><span>${escapeHtml(p.name)}</span><b>${money(v.price)}</b></button>`}).join('')}</div>`}
function setMeal(m){meal=m;renderMeal()}
function renderReviews(){const rev=(CONFIG.reviews||[]).filter(r=>r.active&&r.source==='customer').slice(0,4);$('reviewGrid').innerHTML=rev.map(r=>`<article><div class="stars">${'★'.repeat(r.rating)}</div><p>“${escapeHtml(r.text)}”</p><b>${escapeHtml(r.name)}</b><small>Customer review</small></article>`).join('')+`<article class="googleCard"><i class="fa-brands fa-google"></i><h3>More reviews on Google</h3><p>See the latest customer feedback directly on Google.</p><a href="${CONFIG.store.googleReviewsUrl}" target="_blank">View Google reviews →</a></article>`;$('googleReviewsTop').href=CONFIG.store.googleReviewsUrl}
function heroShow(){const a=(CONFIG.announcements||[]).filter(x=>x.active).sort((x,y)=>x.order-y.order);if(!a.length)return;const s=a[heroIndex%a.length];let p=s.productId?getProduct(s.productId):null,combo=s.comboId?getCombo(s.comboId):null;$('heroLabel').textContent=s.label;$('heroTitle').innerHTML=`${escapeHtml(s.title)}<br><em>${escapeHtml(s.em)}</em>`;$('heroDesc').textContent=s.text;$('heroPrice').textContent=money(p?getVariant(p,variantKey(p.id)).price:combo?.price||0);$('heroImg').src=p?.image||combo?.image||'images/hero/jayvi-products.webp';$('heroShop').onclick=()=>{const type=s.actionType||(s.comboId?'combo':'product'),target=s.actionTarget||(s.comboId?s.comboId:s.productId);if(type==='product'&&getProduct(target))openProduct(target);else if(type==='combo'&&getCombo(target))document.getElementById('combos').scrollIntoView({behavior:'smooth'});else if(type==='shop')document.getElementById('shop').scrollIntoView({behavior:'smooth'});else if(type==='reviews')document.getElementById('reviews').scrollIntoView({behavior:'smooth'});else if(type==='url'&&s.actionTarget)window.location.href=s.actionTarget;};$('heroDots').innerHTML=a.map((_,i)=>`<button class="${i===heroIndex?'active':''}" onclick="heroIndex=${i};heroShow();restartHero()"></button>`).join('');const g=document.querySelector('.heroGrid');g.classList.remove('heroChange');void g.offsetWidth;g.classList.add('heroChange')}
function restartHero(){clearInterval(heroTimer);startHero()}function startHero(){const n=(CONFIG.announcements||[]).filter(x=>x.active).length;if(CONFIG.homepage.heroAutoplay&&n>1)heroTimer=setInterval(()=>{heroIndex=(heroIndex+1)%n;heroShow()},CONFIG.homepage.heroSeconds*1000)}
function loadCart(){try{return JSON.parse(localStorage.getItem('jayviCartV14')||'[]')}catch{return []}}function saveCart(){localStorage.setItem('jayviCartV14',JSON.stringify(cart))}
function cartItemDetails(x){if(x.type==='combo'){const c=getCombo(x.comboId);return {name:c.name,price:c.price,mrp:c.mrp,image:c.image,label:'Combo'}}const p=getProduct(x.productId),v=getVariant(p,x.variantId);return {name:p.name,price:v.price,mrp:v.mrp,image:p.image,label:v.label}}
function refreshProductViews(){renderBest();renderProducts();renderMeal();renderCombos()}
function addToCart(pid,vid){const p=getProduct(pid),v=getVariant(p,vid);if(!p||!v)return;const key='product:'+pid+':'+v.id,x=cart.find(i=>i.key===key);if(x)x.qty++;else cart.push({key,type:'product',productId:pid,variantId:v.id,qty:1});saveCart();renderCart();refreshProductViews();openCart()}
function changeProductQty(pid,vid,d){const key='product:'+pid+':'+vid;let x=cart.find(i=>i.key===key);if(!x&&d>0){const p=getProduct(pid),v=getVariant(p,vid);if(!p||!v)return;cart.push({key,type:'product',productId:pid,variantId:v.id,qty:1});x=cart[cart.length-1]}else if(!x){return}else{x.qty+=d;if(x.qty<1)cart=cart.filter(i=>i.key!==key)}saveCart();renderCart();requestAnimationFrame(refreshProductViews)}
function buyNow(pid,vid){const p=getProduct(pid),v=getVariant(p,vid);if(!p||!v)return;const key='product:'+pid+':'+v.id,x=cart.find(i=>i.key===key);if(x)x.qty++;else cart.push({key,type:'product',productId:pid,variantId:v.id,qty:1});saveCart();renderCart();refreshProductViews();openCheckout()}
function changeQty(key,d){const x=cart.find(i=>i.key===key);if(!x)return;x.qty+=d;if(x.qty<1)cart=cart.filter(i=>i!==x);saveCart();renderCart();refreshProductViews()}
function cartTotals(){let sub=cart.reduce((s,x)=>{const d=cartItemDetails(x);return s+d.price*x.qty},0),th=CONFIG.store.freeShippingThreshold,ship=sub===0?0:sub>=th?0:CONFIG.store.shippingFlat;return{sub,ship,total:sub+ship,remaining:Math.max(0,th-sub)}}
function renderCart(){const count=cart.reduce((s,x)=>s+x.qty,0);$('cartCount').textContent=count;const t=cartTotals();$('cartSubtotal').textContent=money(t.sub);$('cartTotal').textContent=money(t.total);$('cartShipping').innerHTML=t.sub===0?'':t.ship===0?'<span class="free">FREE DELIVERY</span>':`Delivery ${money(t.ship)}`;$('cartHint').textContent=t.sub&&t.ship?`Add ${money(t.remaining)} more for free delivery.`:'';$('cartItems').innerHTML=cart.length?cart.map(x=>{const d=cartItemDetails(x);return `<div class="cartItem"><img src="${d.image}" alt=""><div><b>${escapeHtml(d.name)}</b><small>${escapeHtml(d.label)} · ${money(d.price)}</small><div class="qty"><button onclick="changeQty('${x.key}',-1)">−</button><span>${x.qty}</span><button onclick="changeQty('${x.key}',1)">+</button><button onclick="removeCart('${x.key}')">Remove</button></div></div></div>`}).join(''):`<div class="emptyCart"><i class="fa-solid fa-bag-shopping"></i><h3>Your bag is empty</h3><p>Add a Jayvi favourite to get started.</p></div>`}
function removeCart(key){cart=cart.filter(x=>x.key!==key);saveCart();renderCart();refreshProductViews();showToast('Removed from cart')}
function openCart(){$('cartOverlay').classList.add('open');renderCart()}function closeCart(){$('cartOverlay').classList.remove('open')}
function openProduct(id){const p=getProduct(id),v=getVariant(p,variantKey(id));const paused=!!CONFIG.store.vacationMode;const addAction=paused?"showToast('Ordering is paused while Jayvi Foods is on vacation.')":"addToCart('"+p.id+"','"+v.id+"')";const buyAction=paused?"showToast('Ordering is paused while Jayvi Foods is on vacation.')":"buyNow('"+p.id+"','"+v.id+"')";$('productContent').innerHTML=`<div class="detailGrid"><div class="detailImage">${productGalleryMarkup(p)}</div><div class="detailCopy"><div class="eyebrow">${escapeHtml(catName(p.category))}</div><h2>${escapeHtml(p.name)}</h2><div class="stars">★★★★★ <span>${p.rating} · ${p.reviewCount} reviews</span></div><p>${escapeHtml(p.short)}</p><div class="detailVariants">${p.variants.filter(x=>x.active).map(x=>`<button class="${x.id===v.id?'active':''}" onclick="selectedVariants['${p.id}']='${x.id}';openProduct('${p.id}')">${escapeHtml(x.label)}<small>${money(x.price)}</small></button>`).join('')}</div><div class="detailPrice"><b>${money(v.price)}</b><del>${money(v.mrp)}</del><em>Save ${money(v.mrp-v.price)}</em></div><div class="detailUse"><b>Works well with</b><span>${(p.mealTags||[]).map(m=>escapeHtml((CONFIG.mealTags||[]).find(t=>t.id===m)?.name||CONFIG.mealLabels?.[m]||m)).join(' · ')}</span></div><div class="detailBtns"><button class="btn light" ${paused?'disabled':''} onclick="${addAction}">${paused?'Orders paused':'Add to cart'}</button><button class="btn gold" ${paused?'disabled':''} onclick="${buyAction}">${paused?'Unavailable':'Buy now →'}</button></div></div></div>`;$('productOverlay').classList.add('open')}
function closeProduct(){$('productOverlay').classList.remove('open')}
function openSearch(){$('searchOverlay').classList.add('open');setTimeout(()=>$('searchBox').focus(),50)}function closeSearch(){$('searchOverlay').classList.remove('open')}function renderSearch(){const q=$('searchBox').value.toLowerCase();$('searchResults').innerHTML=products.filter(p=>(p.name+' '+catName(p.category)).toLowerCase().includes(q)).map(p=>`<button onclick="closeSearch();openProduct('${p.id}')"><b>${escapeHtml(p.name)}</b><span>${money(getVariant(p,variantKey(p.id)).price)}</span></button>`).join('')}
function getCustomers(){try{return JSON.parse(localStorage.getItem('jayviCustomersV14')||'[]')}catch{return []}}function saveCustomers(x){localStorage.setItem('jayviCustomersV14',JSON.stringify(x))}function getSession(){try{return JSON.parse(localStorage.getItem('jayviSessionV14')||'null')}catch{return null}}function setSession(x){if(x)localStorage.setItem('jayviSessionV14',JSON.stringify(x));else localStorage.removeItem('jayviSessionV14')}
async function hashPassword(p){if(window.crypto?.subtle){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(p));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}return btoa(unescape(encodeURIComponent(p)))}
function openAccount(){const s=getSession();$('accountContent').innerHTML=s?accountView(s):authView('login');$('accountOverlay').classList.add('open')}
function authView(mode){return `<div class="eyebrow">MY JAYVI</div><h2>${mode==='login'?'Welcome back.':'Create your Jayvi account.'}</h2><p class="muted">${mode==='login'?'Use your mobile number and password.':'Your mobile number is your Jayvi user ID.'}</p><form onsubmit="${mode==='login'?'loginSubmit(event)':'registerSubmit(event)'}">${mode==='register'?'<label>Name *<input id="authName" required></label>':' '}<label>Mobile number *<input id="authId" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" required placeholder="10-digit mobile number"></label><label>Password *<input id="authPass" type="password" minlength="6" required></label>${mode==='register'?'<label>Confirm password *<input id="authPass2" type="password" minlength="6" required></label>':''}<button class="btn gold full">${mode==='login'?'Sign in':'Create account'} →</button></form><div class="authSwitch">${mode==='login'?`New here? <button onclick="openAuth('register')">Create account</button>`:`Already have an account? <button onclick="openAuth('login')">Sign in</button>`}</div>${mode==='login'?'<button class="textBtn" onclick="showOtpUnavailable()">Use OTP instead</button>':''}<div class="guestNote">You can always <button onclick="closeAccount();openCheckout()">continue as guest</button> without creating an account.</div>`}
function showOtpUnavailable(){showToast('OTP login is not available yet. Password login is currently enabled.')}
function openAuth(m){$('accountContent').innerHTML=authView(m)}
async function registerSubmit(e){e.preventDefault();const name=$('authName').value.trim(),phone=$('authId').value.trim(),p=$('authPass').value,p2=$('authPass2').value;if(!/^\d{10}$/.test(phone)){showToast('Enter a valid 10-digit mobile number');return}if(p!==p2){showToast('Passwords do not match');return}const customers=getCustomers();if(customers.some(c=>c.phone===phone)){showToast('An account already exists with this mobile number');return}const user={id:'CUS'+Date.now().toString(36),name,login:phone,phone,passwordHash:await hashPassword(p),createdAt:new Date().toISOString(),address:null};customers.push(user);saveCustomers(customers);setSession({id:user.id});showToast('Account created');openAccount()}
async function loginSubmit(e){e.preventDefault();const login=$('authId').value.trim(),p=await hashPassword($('authPass').value),u=getCustomers().find(c=>c.phone===login&&c.passwordHash===p);if(!u){showToast('Mobile number or password is incorrect');return}setSession({id:u.id});showToast('Signed in');openAccount()}
function accountView(s){const u=getCustomers().find(c=>c.id===s.id);const orders=getOrders().filter(o=>o.customerId===s.id||o.guestContact===u?.phone);return `<div class="eyebrow">MY JAYVI</div><h2>Welcome, ${escapeHtml((u?.name||'Customer').split(' ')[0])}.</h2><p class="muted">${escapeHtml(u?.phone||u?.login||'')}</p><div class="accountTabs"><button class="active">Orders</button><button onclick="trackOrderPrompt()">Track order</button><button onclick="setSession(null);openAccount()">Sign out</button></div><div class="orders">${orders.length?orders.map(o=>`<div class="order"><b>${o.id}</b><span>${o.date}</span><strong>${money(o.total)}</strong><small>${escapeHtml(o.status)}</small></div>`).join(''):'<div class="empty">No orders yet.</div>'}</div>`}
function closeAccount(){$('accountOverlay').classList.remove('open')}
function openCheckout(){if(CONFIG.store.vacationMode){showToast(CONFIG.store.vacationMessage||'Ordering is temporarily paused.');return}if(!cart.length){showToast('Your cart is empty');return}closeCart();const t=cartTotals(),s=getSession(),u=s?getCustomers().find(c=>c.id===s.id):null;const upi=CONFIG.store.upiEnabled!==false,cod=CONFIG.store.codEnabled!==false;$('checkoutContent').innerHTML=`<div class="checkoutGrid"><div><div class="eyebrow">CHECKOUT</div><h2>Delivery details.</h2><p class="muted">Choose how you want to pay. You can order as a guest or sign in.</p><div class="deliveryEstimate"><b>Estimated delivery: ${CONFIG.store.deliveryMinDays||4}–${CONFIG.store.deliveryMaxDays||8} days</b><span>Delivery time varies by location and PIN code.</span></div><div class="guestChoice"><b>Checkout as ${u?'signed-in customer':'guest'}</b>${u?`<button onclick="setSession(null);openCheckout()">Use guest</button>`:'<button onclick="closeCheckout();openAccount()">Sign in / register</button>'}</div><form id="checkoutForm" onsubmit="placeOrder(event)"><label>Full name *<input id="coName" value="${escapeHtml(u?.name||'')}" required></label><label>Mobile *<input id="coPhone" value="${escapeHtml(u?.phone||'')}" required pattern="[0-9]{10}" maxlength="10"></label><label>Search delivery location <span class="tiny">Google Maps ready</span><div id="placeBox"></div></label><label>Address *<textarea id="coAddress" required rows="3" placeholder="House / flat, street, landmark"></textarea></label><div class="two"><label>City *<input id="coCity" required></label><label>State *<input id="coState" required></label></div><div class="pinRow"><label>PIN code *<input id="coPin" required inputmode="numeric" pattern="[0-9]{6}" maxlength="6"></label><button type="button" class="btn outline" onclick="verifyPincode()">Verify PIN</button></div><div id="pinStatus" class="pinStatus"></div><label>Country<select id="coCountry" disabled><option value="IN">India</option></select></label><div class="paymentChooser"><h3>Payment method</h3>${upi?`<label class="paymentOption active"><input type="radio" name="paymentMethod" value="upi" checked onchange="togglePaymentNote()"><span><b>Pay by UPI QR</b><small>Scan and pay the exact order amount</small></span></label>`:''}${cod?`<label class="paymentOption"><input type="radio" name="paymentMethod" value="cod" onchange="togglePaymentNote()"><span><b>Cash on Delivery</b><small>Pay when your order is delivered</small></span></label>`:''}<div id="paymentNote" class="paymentNote">${escapeHtml(CONFIG.store.paymentNote||'')}</div></div><button class="btn gold full" type="submit">Continue checkout <i class="fa-solid fa-arrow-right"></i></button></form></div><aside class="summary"><h3>Your order</h3>${cart.map(x=>{const d=cartItemDetails(x);return `<div class="line"><span>${escapeHtml(d.name)} · ${escapeHtml(d.label)} × ${x.qty}</span><b>${money(d.price*x.qty)}</b></div>`}).join('')}<div class="line"><span>Subtotal</span><b>${money(t.sub)}</b></div><div class="line"><span>Delivery</span><b>${t.ship?money(t.ship):'FREE'}</b></div><div class="line total"><span>Total</span><b>${money(t.total)}</b></div></aside></div>`;$('checkoutOverlay').classList.add('open');initPlaces()}
function closeCheckout(){$('checkoutOverlay').classList.remove('open')}
async function verifyPincode(){const pin=$('coPin').value.trim(),status=$('pinStatus');if(!/^\d{6}$/.test(pin)){status.className='pinStatus bad';status.textContent='Enter a 6-digit Indian PIN code.';return}if(CONFIG.store.deliveryMode!=='india'){status.className='pinStatus bad';status.textContent='Delivery is currently disabled.';return}const blocked=(CONFIG.store.blockedPincodes||[]).map(String);if(blocked.includes(pin)){status.className='pinStatus bad';status.textContent='Sorry, this PIN is currently not serviceable.';return}status.className='pinStatus good';status.textContent='PIN accepted for India delivery. Final address validation will run in the production backend.'}
async function initPlaces(){const box=$('placeBox');if(!box)return;if(!CONFIG.store.googleMapsApiKey){box.innerHTML='<input id="placeFallback" placeholder="Add Google Maps API key in Admin to search locations">';return}try{if(!window.google){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(CONFIG.store.googleMapsApiKey)}&v=weekly`;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}await google.maps.importLibrary('places');const el=new google.maps.places.PlaceAutocompleteElement({});el.setAttribute('placeholder','Search your address or area');el.includedRegionCodes=['in'];box.innerHTML='';box.appendChild(el);el.addEventListener('gmp-select',async({placePrediction})=>{const place=placePrediction.toPlace();await place.fetchFields({fields:['formattedAddress','addressComponents','location']});$('coAddress').value=place.formattedAddress||'';const comps=place.addressComponents||[];const get=t=>comps.find(c=>c.types?.includes(t))?.longText||'';$('coCity').value=get('locality')||get('administrative_area_level_2');$('coState').value=get('administrative_area_level_1');$('coPin').value=get('postal_code');verifyPincode()});mapsReady=true}catch(e){box.innerHTML='<input id="placeFallback" placeholder="Google Maps could not be loaded — enter address manually">'}}
function getOrders(){try{return JSON.parse(localStorage.getItem('jayviOrdersV14')||'[]')}catch{return []}}function saveOrders(x){localStorage.setItem('jayviOrdersV14',JSON.stringify(x))}
function makeOrderNumber(){const d=new Date();const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');const key=`jayviOrderSeq-${y}${m}${day}`;const n=+(localStorage.getItem(key)||0)+1;localStorage.setItem(key,String(n));return `JF-${y}${m}${day}-${String(n).padStart(4,'0')}`}
function placeOrder(e){e.preventDefault();const pin=$('coPin').value.trim();if(!/^\d{6}$/.test(pin)){verifyPincode();showToast('Please verify your 6-digit PIN');return}const t=cartTotals(),s=getSession(),u=s?getCustomers().find(c=>c.id===s.id):null;const customerId=u?.id||null;const method=document.querySelector('input[name=paymentMethod]:checked')?.value||'upi';const order={id:makeOrderNumber(),date:new Date().toLocaleString('en-IN'),estimatedDelivery:`${CONFIG.store.deliveryMinDays||4}-${CONFIG.store.deliveryMaxDays||8} days`,customerId,guestContact:$('coPhone').value.trim(),customerName:$('coName').value.trim(),phone:$('coPhone').value.trim(),address:$('coAddress').value.trim(),city:$('coCity').value.trim(),state:$('coState').value.trim(),country:'IN',pin,items:structuredClone(cart),subtotal:t.sub,shipping:t.ship,total:t.total,status:method==='upi'?'Payment verification pending':'Order received — COD',payment:method==='upi'?'UPI QR — awaiting verification':'Cash on Delivery',paymentMethod:method,utr:'',timeline:[{status:method==='upi'?'Payment verification pending':'Order received — COD',at:new Date().toISOString()}]};const os=getOrders();os.unshift(order);saveOrders(os);cart=[];saveCart();closeCheckout();if(method==='upi'){showUpiPayment(order)}else{showOrderSuccess(order)}if(customerId){const customers=getCustomers();const cu=customers.find(c=>c.id===customerId);if(cu){cu.address={line1:order.address,city:order.city,state:order.state,pincode:order.pin,landmark:''};saveCustomers(customers)}} }
function togglePaymentNote(){document.querySelectorAll('.paymentOption').forEach(x=>x.classList.toggle('active',x.querySelector('input')?.checked));const m=document.querySelector('input[name=paymentMethod]:checked')?.value;const n=$('paymentNote');if(n)n.textContent=m==='cod'?'Pay the delivery partner when your order arrives.':'Scan the QR, pay the exact total, then share the UTR/reference number so we can verify your payment.'}
function showUpiPayment(o){const qr=CONFIG.store.upiQrImage?`<img class="upiQr" src="${CONFIG.store.upiQrImage}" alt="Jayvi Foods UPI QR">`:`<div class="upiQr placeholder"><b>UPI QR</b><span>Upload your Jayvi QR from Admin</span></div>`;$('accountContent').innerHTML=`<div class="paymentSuccess"><div class="eyebrow">PAYMENT</div><h2>Pay ${money(o.total)}</h2><p class="muted">Scan this QR with any UPI app. Your order will move to processing after we verify the payment.</p>${qr}<div class="upiMeta"><b>${escapeHtml(CONFIG.store.upiName||'Jayvi Foods')}</b>${CONFIG.store.upiId?`<span>UPI ID: ${escapeHtml(CONFIG.store.upiId)}</span>`:''}</div><label>UPI transaction / UTR reference *<input id="utrInput" placeholder="Enter the reference after payment"></label><button class="btn gold full" onclick="submitUpiProof('${o.id}')">I have paid →</button><p class="tiny">Order ${o.id} · Payment verification pending</p></div>`;$('accountOverlay').classList.add('open')}
function submitUpiProof(id){const utr=$('utrInput')?.value.trim();if(!utr){showToast('Enter the UTR/reference number');return}const os=getOrders(),o=os.find(x=>x.id===id);if(!o)return;o.utr=utr;o.paymentStatus='Proof submitted';o.timeline=(o.timeline||[]).concat({status:'Payment proof submitted',at:new Date().toISOString()});saveOrders(os);showOrderSuccess(o)}
function showOrderSuccess(o){$('accountContent').innerHTML=`<div class="successIcon">✓</div><div class="eyebrow">ORDER RECEIVED</div><h2>${o.id}</h2><p class="muted">${escapeHtml(o.status)}. We'll update the order status as it moves through fulfilment.</p><div class="trackMini">${renderTimeline(o)}</div><button class="btn gold full" onclick="closeAccount()">Continue shopping</button>`;$('accountOverlay').classList.add('open')}
function renderTimeline(o){const steps=['Order received','Payment verified','Preparing','Packed','Shipped','Out for delivery','Delivered'];const current=o.status||'';return `<div class="timeline">${steps.map((s,i)=>`<div class="timelineStep ${current.toLowerCase().includes(s.toLowerCase())?'current':''}"><i>${i+1}</i><span>${s}</span></div>`).join('')}</div>`}
function trackOrderPrompt(){openAccount();$('accountContent').innerHTML=`<div class="eyebrow">TRACK ORDER</div><h2>Where is my order?</h2><p class="muted">Enter your order number and mobile number.</p><label>Order number<input id="trackId" placeholder="JF12345678"></label><label>Mobile<input id="trackPhone" maxlength="10"></label><button class="btn gold full" onclick="trackOrder()">Track order →</button>`}
function trackOrder(){const id=$('trackId').value.trim(),phone=$('trackPhone').value.trim(),o=getOrders().find(x=>x.id===id&&x.phone===phone);if(!o){showToast('Order not found for these details');return}$('accountContent').innerHTML=`<div class="eyebrow">ORDER ${escapeHtml(o.id)}</div><h2>${escapeHtml(o.status)}</h2><p class="muted">${escapeHtml(o.customerName)} · ${money(o.total)}</p>${renderTimeline(o)}<div class="orderTrackNote">For delivery updates, Jayvi's team can also send a WhatsApp update from Admin.</div>`}
function guestOrderSuccess(o){$('accountContent').innerHTML=`<div class="successIcon">✓</div><div class="eyebrow">ORDER RECEIVED</div><h2>${o.id}</h2><p class="muted">Your order details are saved on this device. You checked out as a guest.</p><div class="guestUpsell"><b>Want to track future orders faster?</b><p>Create a Jayvi account and we can associate orders with your customer profile.</p><button class="btn gold" onclick="openAuth('register')">Create account →</button></div><button class="textBtn" onclick="closeAccount()">Continue shopping</button>`;$('accountOverlay').classList.add('open')}
function toggleMenu(){$('mobileMenu').classList.toggle('open')}
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
    closeCart();closeProduct();closeSearch();closeAccount();closeCheckout();
  });
}
let toastTimer;function showToast(t){clearTimeout(toastTimer);$('toast').textContent=t;$('toast').classList.add('show');toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2400)}
function init(){initOverlayDismissal();sync();if(CONFIG.store.vacationMode){const b=$('vacationBanner');if(b){b.style.display='block';b.textContent=CONFIG.store.vacationMessage||'Orders are temporarily paused while Jayvi Foods is away.'}}if($('deliveryTop'))$('deliveryTop').textContent=`FRESHLY PACKED · DELIVERY IN ${CONFIG.store.deliveryMinDays||4}–${CONFIG.store.deliveryMaxDays||8} DAYS`;sync();$('topShipping').textContent=`FREE SHIPPING ABOVE ${money(CONFIG.store.freeShippingThreshold)}`;renderBest();renderCategories();renderProducts();renderCombos();renderMeal();renderReviews();renderCart();heroShow();startHero()}
init();

/* Jayvi Foods V15 customer UX patch
   Load AFTER app.js. No backend dependency. */
(function(){
  const wait = (fn)=>document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',fn,{once:true}) : fn();

  function safe(fn){ try{fn()}catch(e){console.warn('Jayvi V15 patch:',e)} }
  const esc = s => String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const money = n => '₹'+Number(n||0).toLocaleString('en-IN');

  function customerOrdersForPhone(phone){
    try{
      const os=JSON.parse(localStorage.getItem('jayviOrdersV14')||'[]');
      return os.filter(o=>String(o.phone||o.guestContact||'').replace(/\D/g,'')===String(phone||'').replace(/\D/g,''));
    }catch{return []}
  }

  /* Guest -> registered account association by mobile number. */
  const oldRegisterSubmit = window.registerSubmit;
  if(oldRegisterSubmit){
    window.registerSubmit = async function(e){
      const phone=(document.getElementById('authId')?.value||'').trim();
      await oldRegisterSubmit(e);
      if(e.defaultPrevented !== false){
        try{
          const s=JSON.parse(localStorage.getItem('jayviSessionV14')||'null');
          if(s?.id && /^\d{10}$/.test(phone)){
            const os=JSON.parse(localStorage.getItem('jayviOrdersV14')||'[]');
            let changed=false;
            os.forEach(o=>{
              if(!o.customerId && String(o.phone||o.guestContact||'').replace(/\D/g,'')===phone){
                o.customerId=s.id; changed=true;
              }
            });
            if(changed)localStorage.setItem('jayviOrdersV14',JSON.stringify(os));
          }
        }catch{}
      }
    };
  }

  /* Clearer account/order view. */
  window.accountView = function(s){
    let u=null,orders=[];
    try{
      const cs=JSON.parse(localStorage.getItem('jayviCustomersV14')||'[]');
      u=cs.find(c=>c.id===s.id);
      orders=JSON.parse(localStorage.getItem('jayviOrdersV14')||'[]')
        .filter(o=>o.customerId===s.id || String(o.phone||o.guestContact||'')===String(u?.phone||''));
    }catch{}
    const statusLabel=o=>esc(o.status||'Order received');
    return `<div class="eyebrow">MY JAYVI</div>
      <h2>Welcome, ${esc((u?.name||'Customer').split(' ')[0])}.</h2>
      <p class="muted">${esc(u?.phone||u?.login||'')}</p>
      <div class="accountTabs">
        <button class="active" onclick="accountOrdersView()">Orders</button>
        <button onclick="trackOrderPrompt()">Track order</button>
        <button onclick="setSession(null);openAccount()">Sign out</button>
      </div>
      <div class="orders" id="accountOrdersList">
      ${orders.length?orders.map(o=>`<button class="order" type="button" onclick="trackKnownOrder('${esc(o.id)}','${esc(o.phone||o.guestContact||'')}')">
        <b>${esc(o.id)}</b><span>${esc(o.date||'')}</span><strong>${money(o.total)}</strong>
        <small>${statusLabel(o)}</small></button>`).join(''):'<div class="empty">No orders yet.</div>'}
      </div>`;
  };

  window.accountOrdersView=function(){
    const s=typeof getSession==='function'?getSession():null;
    if(s) document.getElementById('accountContent').innerHTML=accountView(s);
  };

  window.trackKnownOrder=function(id,phone){
    const os=JSON.parse(localStorage.getItem('jayviOrdersV14')||'[]');
    const norm=x=>String(x||'').replace(/[^a-z0-9]/gi,'').toUpperCase();
    const o=os.find(x=>norm(x.id)===norm(id)&&norm(x.phone||x.guestContact)===norm(phone));
    if(!o){showToast('Order could not be found for this mobile number.');return;}
    document.getElementById('accountContent').innerHTML=
      `<div class="eyebrow">ORDER ${esc(o.id)}</div>
       <h2>${esc(o.status||'Order received')}</h2>
       <p class="muted">${esc(o.customerName||'Customer')} · ${money(o.total)}</p>
       ${renderTimeline(o)}
       <div class="orderTrackNote">${o.trackingUrl?`Tracking: <a href="${esc(o.trackingUrl)}" target="_blank">Open courier tracking →</a><br>`:''}
       ${o.deliveryPartner?`Courier: ${esc(o.deliveryPartner)}<br>`:''}
       Estimated delivery: ${esc(o.estimatedDelivery||'4–8 days')}.</div>`;
  };

  window.trackOrder=function(){
    const id=document.getElementById('trackId')?.value.trim();
    const phone=document.getElementById('trackPhone')?.value.trim();
    if(!/^\d{10}$/.test(phone)){showToast('Enter the 10-digit mobile number used for the order.');return;}
    trackKnownOrder(id,phone);
  };

  /* Manual UPI proof flow: status is deliberately separate from order status. */
  window.submitUpiProof=function(id){
    const utr=document.getElementById('utrInput')?.value.trim();
    if(!utr){showToast('Please enter the UPI reference / UTR.');return;}
    const os=JSON.parse(localStorage.getItem('jayviOrdersV14')||'[]');
    const o=os.find(x=>x.id===id);
    if(!o)return;
    o.utr=utr;
    o.paymentStatus='Proof submitted — awaiting verification';
    o.status='Payment verification pending';
    o.timeline=(o.timeline||[]).concat({status:'Payment proof submitted',at:new Date().toISOString()});
    localStorage.setItem('jayviOrdersV14',JSON.stringify(os));
    showToast('Payment proof submitted. Jayvi will verify it.');
    showOrderSuccess(o);
  };

  /* More visible customer notifications. */
  const oldToast=window.showToast;
  window.showToast=function(message){
    const x=document.getElementById('toast');
    if(!x)return oldToast?.(message);
    x.innerHTML=`<strong>${esc(message)}</strong>`;
    x.classList.add('show');
    clearTimeout(window.__jayviToastTimer);
    window.__jayviToastTimer=setTimeout(()=>x.classList.remove('show'),3200);
  };

  /* Cart: mobile-first sticky summary and robust live rendering. */
  function ensureMobileCartBar(){
    if(document.getElementById('mobileCartBar'))return;
    const el=document.createElement('button');
    el.id='mobileCartBar'; el.type='button';
    el.innerHTML='<span><b id="mobileCartCount">0</b> item(s)</span><strong id="mobileCartTotal">₹0</strong><span>View cart →</span>';
    el.onclick=()=>openCart();
    document.body.appendChild(el);
  }
  const oldRenderCart=window.renderCart;
  window.renderCart=function(){
    oldRenderCart?.();
    ensureMobileCartBar();
    const count=document.getElementById('cartCount')?.textContent||'0';
    const total=document.getElementById('cartTotal')?.textContent||'₹0';
    document.getElementById('mobileCartCount').textContent=count;
    document.getElementById('mobileCartTotal').textContent=total;
    document.getElementById('mobileCartBar').classList.toggle('hasItems',Number(count)>0);
  };

  /* Make Add-to-cart immediately visible on mobile and keep product/card state synced. */
  const oldAdd=window.addToCart;
  window.addToCart=function(pid,vid){
    oldAdd?.(pid,vid);
    requestAnimationFrame(()=>{
      window.renderCart?.();
      if(window.innerWidth<=760){
        const bar=document.getElementById('mobileCartBar');
        if(bar)bar.classList.add('pulse');
        setTimeout(()=>bar?.classList.remove('pulse'),450);
      }
    });
  };
  const oldChange=window.changeQty;
  window.changeQty=function(key,d){
    oldChange?.(key,d);
    requestAnimationFrame(()=>window.renderCart?.());
  };

  /* Product detail: mobile close button + gallery should stay inside viewport. */
  const oldOpenProduct=window.openProduct;
  window.openProduct=function(id){
    oldOpenProduct?.(id);
    document.body.classList.add('modalOpen');
  };
  const oldCloseProduct=window.closeProduct;
  window.closeProduct=function(){
    oldCloseProduct?.();
    document.body.classList.remove('modalOpen');
  };

  /* Vacation mode: keep catalogue visible; pause purchasing instead of erasing the storefront. */
  function applyVacation(){
    if(typeof CONFIG==='undefined')return;
    const banner=document.getElementById('vacationBanner');
    if(CONFIG.store?.vacationMode){
      if(banner){banner.style.display='block';banner.textContent=CONFIG.store.vacationMessage||'Orders are temporarily paused while Jayvi Foods is away.';}
      document.querySelectorAll('.pcActions button,.comboActions button').forEach(b=>{
        b.disabled=true;b.dataset.vacation='1';
        if(!b.dataset.originalText)b.dataset.originalText=b.textContent;
        b.textContent='Orders paused';
      });
    }else if(banner){banner.style.display='none';}
  }

  /* Hero announcement: allow manual swipe/touch as well as autoplay. */
  function enableHeroSwipe(){
    const hero=document.querySelector('.hero');
    if(!hero||hero.dataset.swipeReady)return;
    hero.dataset.swipeReady='1';
    let sx=0;
    hero.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
    hero.addEventListener('touchend',e=>{
      const dx=e.changedTouches[0].clientX-sx;
      const n=(CONFIG.announcements||[]).filter(x=>x.active).length;
      if(n>1 && Math.abs(dx)>35){
        heroIndex=(heroIndex+(dx<0?1:-1)+n)%n;
        heroShow();restartHero();
      }
    },{passive:true});
  }

  /* Remove horizontal page overflow on small devices. */
  function mobileHardening(){
    document.documentElement.style.overflowX='hidden';
    document.body.style.overflowX='hidden';
    document.querySelectorAll('.heroImage img,.productImage img').forEach(img=>img.loading='lazy');
  }

  wait(()=>{
    safe(()=>{
      ensureMobileCartBar();
      window.renderCart?.();
      applyVacation();
      enableHeroSwipe();
      mobileHardening();

      /* Repaint after any localStorage-driven admin change on the same browser. */
      window.addEventListener('storage',e=>{
        if(e.key==='jayviStoreV14'){
          CONFIG=loadConfig(); sync(); renderBest();renderCategories();renderProducts();renderCombos();renderMeal();renderReviews();renderCart();heroShow();applyVacation();
        }
      });
    });
  });
})();
/* Jayvi Foods V17 Cart UX Fix
   - Mobile-only floating cart summary
   - Never overlaps page controls
   - Automatically hides while cart drawer is open
   - Reserves bottom space while the bar is visible
   - Keeps cart drawer checkout controls accessible
*/
(function(){
  const ready=fn=>document.readyState==='loading'
    ?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();

  function sync(){
    const overlay=document.getElementById('cartOverlay');
    const bar=document.getElementById('mobileCartBar');
    if(!bar)return;
    const open=!!overlay?.classList.contains('open');
    const count=Number(document.getElementById('cartCount')?.textContent||0);
    bar.classList.toggle('cartDrawerOpen',open);
    bar.classList.toggle('hasItems',count>0 && !open);
    document.body.classList.toggle('mobileCartActive',count>0 && !open && window.innerWidth<=760);
    document.body.classList.toggle('cartDrawerOpen',open);

    if(overlay){
      overlay.style.zIndex='2200';
      const drawer=overlay.querySelector('.drawer');
      if(drawer){
        drawer.style.zIndex='2201';
        drawer.style.display='flex';
        drawer.style.flexDirection='column';
        drawer.style.height='100%';
        drawer.style.minHeight='0';
        drawer.style.overflow='hidden';
      }
      const items=overlay.querySelector('.cartItems');
      if(items){items.style.flex='1 1 auto';items.style.minHeight='0';items.style.overflowY='auto';items.style.overflowX='hidden';}
      const foot=overlay.querySelector('.cartFoot');
      if(foot){foot.style.flex='0 0 auto';foot.style.position='relative';foot.style.zIndex='30';}
    }
  }

  function ensureBar(){
    if(document.getElementById('mobileCartBar'))return;
    const el=document.createElement('button');
    el.id='mobileCartBar';
    el.type='button';
    el.innerHTML='<span><b id="mobileCartCount">0</b> item(s)</span><strong id="mobileCartTotal">₹0</strong><span>View cart →</span>';
    el.addEventListener('click',()=>window.openCart?.());
    document.body.appendChild(el);
  }

  function refresh(){
    ensureBar();
    const c=document.getElementById('cartCount')?.textContent||'0';
    const t=document.getElementById('cartTotal')?.textContent||'₹0';
    const bc=document.getElementById('mobileCartCount');
    const bt=document.getElementById('mobileCartTotal');
    if(bc)bc.textContent=c;
    if(bt)bt.textContent=t;
    sync();
  }

  function wrap(name){
    const fn=window[name];
    if(typeof fn!=='function'||fn.__v17)return;
    const wrapped=function(){
      const r=fn.apply(this,arguments);
      requestAnimationFrame(refresh);
      return r;
    };
    wrapped.__v17=true;
    window[name]=wrapped;
  }

  ready(()=>{
    ensureBar();
    ['openCart','closeCart','renderCart','addToCart','changeQty','removeCart','changeProductQty','buyNow','addCombo','buyCombo'].forEach(wrap);
    refresh();

    const overlay=document.getElementById('cartOverlay');
    if(overlay){
      new MutationObserver(sync).observe(overlay,{attributes:true,attributeFilter:['class']});
    }
    window.addEventListener('resize',sync);

    // Catch cart updates made by existing app code even if a function was already wrapped elsewhere.
    setInterval(()=>{
      const bar=document.getElementById('mobileCartBar');
      if(!bar){ensureBar();}
      refresh();
    },800);
  });
})();
/* Jayvi Foods V18 - mobile UX + checkout/cart hardening
   Goals:
   1) floating mobile cart is never visible above checkout
   2) reliable touch click on View cart
   3) smoother manual announcement swipes
   4) variant changes do not flash unrelated product images
   5) mobile overlays own the full viewport and lock page scrolling
*/
(function(){
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  const isMobile=()=>window.innerWidth<=760;
  const overlayOpen=id=>!!document.getElementById(id)?.classList.contains('open');

  function syncOverlayState(){
    const map={
      checkoutOverlay:'checkoutOpen',
      productOverlay:'productOpen',
      accountOverlay:'accountOpen',
      searchOverlay:'searchOpen',
      cartOverlay:'cartDrawerOpen'
    };
    Object.entries(map).forEach(([id,cls])=>document.body.classList.toggle(cls,overlayOpen(id)));
    const bar=document.getElementById('mobileCartBar');
    if(bar){
      const anySheet=['checkoutOverlay','productOverlay','accountOverlay','searchOverlay','cartOverlay'].some(overlayOpen);
      bar.classList.toggle('cartDrawerOpen',anySheet);
    }
  }

  function installReliableCartBar(){
    const bar=document.getElementById('mobileCartBar');
    if(!bar || bar.dataset.v18Bound)return;
    bar.dataset.v18Bound='1';
    const go=e=>{
      e.preventDefault(); e.stopPropagation();
      if(typeof window.openCart==='function') window.openCart();
    };
    bar.addEventListener('pointerup',go,{passive:false});
    bar.addEventListener('click',go,{passive:false});
    bar.addEventListener('touchend',go,{passive:false});
  }

  function installHeroSwipe(){
    const hero=document.querySelector('.heroGrid');
    if(!hero || hero.dataset.v18Swipe)return;
    hero.dataset.v18Swipe='1';
    let sx=0,sy=0,dragging=false;
    const getAnnouncements=()=>Array.from(document.querySelectorAll('#heroDots button'));
    const move=(dir)=>{
      const dots=getAnnouncements();
      if(!dots.length)return;
      const active=dots.findIndex(x=>x.classList.contains('active'));
      const next=(active+dir+dots.length)%dots.length;
      const target=dots[next];
      hero.classList.remove('heroSwipeNext','heroSwipePrev');
      void hero.offsetWidth;
      hero.classList.add(dir>0?'heroSwipeNext':'heroSwipePrev');
      target.click();
    };
    hero.addEventListener('touchstart',e=>{
      const t=e.changedTouches[0]; sx=t.clientX; sy=t.clientY; dragging=true;
    },{passive:true});
    hero.addEventListener('touchend',e=>{
      if(!dragging)return; dragging=false;
      const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
      if(Math.abs(dx)<45 || Math.abs(dx)<Math.abs(dy)*1.15)return;
      move(dx<0?1:-1);
    },{passive:true});
    hero.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;sx=e.clientX;sy=e.clientY;dragging=true;},{passive:true});
    hero.addEventListener('pointerup',e=>{
      if(e.pointerType==='mouse'||!dragging)return; dragging=false;
      const dx=e.clientX-sx,dy=e.clientY-sy;
      if(Math.abs(dx)<45||Math.abs(dx)<Math.abs(dy)*1.15)return;
      move(dx<0?1:-1);
    },{passive:true});
  }

  function patchVariantSelection(){
    if(typeof window.setVariant!=='function' || window.setVariant.__v18)return;
    const original=window.setVariant;
    const wrapped=function(id,vid){
      // Preload the selected product image before the existing renderer runs.
      const p=(window.products||[]).find?.(x=>x.id===id);
      if(p?.image){const im=new Image();im.src=p.image;}
      const scrollX=window.scrollX,scrollY=window.scrollY;
      const r=original.apply(this,arguments);
      requestAnimationFrame(()=>{window.scrollTo(scrollX,scrollY);syncOverlayState();});
      return r;
    };
    wrapped.__v18=true;
    window.setVariant=wrapped;
  }

  function observeOverlays(){
    document.querySelectorAll('.overlay').forEach(o=>{
      new MutationObserver(syncOverlayState).observe(o,{attributes:true,attributeFilter:['class']});
    });
  }

  ready(()=>{
    installReliableCartBar();
    installHeroSwipe();
    patchVariantSelection();
    observeOverlays();
    syncOverlayState();
    window.addEventListener('resize',syncOverlayState);
    setInterval(()=>{installReliableCartBar();syncOverlayState();patchVariantSelection();},1000);
  });
})();
/* Jayvi Foods V19
   Mobile floating cart removed deliberately.
   Keep cart accessible from the header and the cart drawer itself.
*/
(function(){
  function hideFloatingCart(){
    const selectors=['#mobileCartBar','.mobileCartBar','[data-mobile-cart-bar]'];
    selectors.forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>{
        el.style.setProperty('display','none','important');
        el.style.setProperty('visibility','hidden','important');
        el.style.setProperty('pointer-events','none','important');
      });
    });
  }
  const run=()=>{
    hideFloatingCart();
    setTimeout(hideFloatingCart,100);
    setTimeout(hideFloatingCart,500);
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
  new MutationObserver(hideFloatingCart).observe(document.body,{childList:true,subtree:true});
})();
/* Jayvi Foods V20 — checkout stability + visible version */
(function(){
  const VERSION='20.0';
  function setVersion(){
    const el=document.getElementById('siteVersion');
    if(el) el.textContent='Website v'+VERSION;
    document.documentElement.dataset.jayviVersion=VERSION;
  }
  function syncCheckoutState(){
    const checkout=document.getElementById('checkoutOverlay');
    if(!checkout) return;
    const open=checkout.classList.contains('open');
    document.body.classList.toggle('checkoutOpen',open);
    if(open){
      document.body.style.overflow='hidden';
      /* Ensure the checkout begins at its top and the user can scroll inside it. */
      const grid=checkout.querySelector('.checkoutGrid');
      if(grid && !grid.dataset.v20Init){ grid.scrollTop=0; grid.dataset.v20Init='1'; }
    }else{
      document.body.style.overflow='';
    }
  }
  function installObserver(){
    const el=document.getElementById('checkoutOverlay');
    if(!el) return;
    new MutationObserver(syncCheckoutState).observe(el,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});
    syncCheckoutState();
  }
  document.addEventListener('click',function(e){
    const t=e.target.closest('#checkoutOverlay .btn.full[type="submit"], #checkoutOverlay form .btn.full');
    if(t){
      /* Keep the action visible and avoid the WhatsApp/floating UI competing with it. */
      setTimeout(function(){
        const checkout=document.getElementById('checkoutOverlay');
        const grid=checkout&&checkout.querySelector('.checkoutGrid');
        if(grid) grid.scrollIntoView({block:'start'});
      },0);
    }
  },true);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{setVersion();installObserver();});
  else {setVersion();installObserver();}
})();

/* Jayvi Foods V21.0 — mobile UX/state patch
   Deliberately defensive: works as a final layer over the existing V15–V20 scripts. */
(function(){
  'use strict';
  const VERSION='21.0';
  const DUMMY=[
    ['Hero','images/products/peanut/hero.webp'],
    ['Front','images/gallery/peanut-front.svg'],
    ['Back','images/gallery/peanut-back.svg'],
    ['Serving','images/gallery/peanut-serving.svg']
  ];

  function version(){
    const el=document.getElementById('siteVersion');
    if(el) el.textContent='Website v'+VERSION;
    document.documentElement.dataset.jayviVersion=VERSION;
    document.body.dataset.jayviVersion=VERSION;
  }

  function isMobile(){return window.matchMedia && window.matchMedia('(max-width:760px)').matches;}

  function overlayIsOpen(){
    return [...document.querySelectorAll('.overlay')].some(x=>x.classList.contains('open'));
  }

  let locked=false;
  function syncScrollLock(){
    if(!isMobile()) return;
    const open=overlayIsOpen();
    document.body.classList.toggle('v21-overlay-open',open);
    if(open && !locked){
      document.documentElement.dataset.v21ScrollY=String(window.scrollY||0);
      document.body.style.overflow='hidden';
      locked=true;
    }else if(!open && locked){
      document.body.style.overflow='';
      locked=false;
    }
  }

  function makeMobileBackButtons(){
    if(!isMobile()) return;
    document.querySelectorAll('.overlay.open .close').forEach(btn=>{
      if(btn.dataset.v21Ready) return;
      btn.dataset.v21Ready='1';
      btn.setAttribute('aria-label','Back');
      btn.title='Back';
    });
  }

  /* A browser Back press closes the active mobile surface instead of navigating
     the page underneath it. */
  let historyArmed=false;
  function observeOverlays(){
    document.querySelectorAll('.overlay').forEach(el=>{
      new MutationObserver(()=>{
        syncScrollLock();
        makeMobileBackButtons();
        if(isMobile() && el.classList.contains('open') && !historyArmed){
          historyArmed=true;
          try{history.pushState({jayviOverlay:true},'','#'+(el.id||'overlay'));}catch(_){}
        }
        if(!el.classList.contains('open')) historyArmed=false;
      }).observe(el,{attributes:true,attributeFilter:['class']});
    });
    syncScrollLock();
  }
  window.addEventListener('popstate',function(){
    if(!isMobile()) return;
    const open=[...document.querySelectorAll('.overlay.open')].pop();
    if(!open) return;
    const fn={
      cartOverlay:window.closeCart,
      productOverlay:window.closeProduct,
      checkoutOverlay:window.closeCheckout,
      accountOverlay:window.closeAccount,
      searchOverlay:window.closeSearch
    }[open.id];
    if(typeof fn==='function') fn();
    else open.classList.remove('open');
    historyArmed=false;
    syncScrollLock();
  });

  /* Keep the product-card quantity controls in sync after checkout/order
     completion. The existing application remains the source of truth. */
  function refreshProductViews(){
    try{
      if(typeof window.renderProducts==='function') window.renderProducts();
    }catch(_){}
    try{
      if(typeof window.renderBestSellers==='function') window.renderBestSellers();
    }catch(_){}
    try{
      if(typeof window.renderBestsellers==='function') window.renderBestsellers();
    }catch(_){}
  }

  let lastCartText='';
  function watchCart(){
    const cart=document.getElementById('cartItems');
    if(!cart) return;
    const mo=new MutationObserver(()=>{
      const text=(cart.innerText||'').trim();
      if(text!==lastCartText){
        lastCartText=text;
        /* If cart has become empty, refresh product cards so stale "+ 1 -" state disappears. */
        if(!text || /your cart is empty|cart is empty/i.test(text)) {
          setTimeout(refreshProductViews,80);
        }
      }
    });
    mo.observe(cart,{childList:true,subtree:true,characterData:true});
  }

  /* Product gallery test data.
     We only add the gallery if the existing product modal currently has a
     single image. Existing multi-image galleries are left untouched. */
  function installGallery(){
    if(!isMobile()) return;
    const host=document.getElementById('productContent');
    if(!host || host.querySelector('.v21-gallery')) return;
    const imgs=[...host.querySelectorAll('img')].filter(i=>i.offsetWidth>0);
    if(!imgs.length) return;
    const main=imgs[0];
    const src=main.currentSrc||main.src;
    const gallery=document.createElement('div');
    gallery.className='v21-gallery';
    const mainBox=document.createElement('div');
    mainBox.className='v21-gallery-main';
    const mainImg=document.createElement('img');
    mainImg.src=src;
    mainImg.alt=main.alt||'Jayvi Foods product';
    mainBox.appendChild(mainImg);
    const thumbs=document.createElement('div');
    thumbs.className='v21-gallery-thumbs';
    DUMMY.forEach(([label,path],idx)=>{
      const b=document.createElement('button');
      b.type='button'; b.className='v21-gallery-thumb'+(idx===0?' active':'');
      b.setAttribute('aria-label',label);
      const im=document.createElement('img');
      im.src=idx===0?src:path;
      im.alt=label;
      b.appendChild(im);
      b.addEventListener('click',()=>{
        mainImg.src=idx===0?src:path;
        thumbs.querySelectorAll('.v21-gallery-thumb').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
      });
      thumbs.appendChild(b);
    });
    gallery.append(mainBox,thumbs);
    host.insertBefore(gallery,host.firstChild);
  }

  function observeProduct(){
    const host=document.getElementById('productContent');
    if(!host) return;
    new MutationObserver(()=>{
      if(document.getElementById('productOverlay')?.classList.contains('open')){
        setTimeout(installGallery,30);
      }
    }).observe(host,{childList:true,subtree:true});
  }

  /* Make cart/product/account/search surfaces consistent on mobile and stop
     click-through to the page behind them. */
  document.addEventListener('click',function(e){
    if(!isMobile()) return;
    const overlay=e.target.closest('.overlay.open');
    if(overlay){
      const surface=e.target.closest('.modal,.drawer');
      if(!surface && e.target===overlay) e.preventDefault();
      return;
    }
    const product=e.target.closest('.productCard');
    if(product){
      setTimeout(()=>{syncScrollLock();installGallery();},50);
    }
  },true);

  /* If the order form closes successfully, re-render cards after the cart state
     has settled. This fixes the stale quantity shown on product cards. */
  const checkout=document.getElementById('checkoutOverlay');
  if(checkout){
    new MutationObserver(()=>{
      if(!checkout.classList.contains('open')){
        setTimeout(refreshProductViews,150);
      }
    }).observe(checkout,{attributes:true,attributeFilter:['class']});
  }

  function init(){
    version();
    observeOverlays();
    observeProduct();
    watchCart();
    setTimeout(version,500);
    setInterval(version,3000);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
/* Jayvi Foods V22.0 — final mobile UX, gallery, announcement and checkout patch */
(function(){
'use strict';
const VERSION='22.0';
const demo={
 peanut:['images/products/peanut/hero.webp','images/v22-demo/peanut-front.svg','images/v22-demo/peanut-back.svg','images/v22-demo/peanut-serving.svg'],
 flaxseed:['images/products/flaxseed/hero.webp','images/v22-demo/flaxseed-front.svg','images/v22-demo/flaxseed-back.svg','images/v22-demo/flaxseed-serving.svg'],
 pudi:['images/products/pudi/hero.webp','images/v22-demo/pudi-front.svg','images/v22-demo/pudi-back.svg','images/v22-demo/pudi-serving.svg'],
 puffora:['images/products/puffora/hero.webp','images/v22-demo/puffora-front.svg','images/v22-demo/puffora-back.svg','images/v22-demo/puffora-serving.svg']
};
function $v(id){return document.getElementById(id)}
function mobile(){return matchMedia('(max-width:760px)').matches}
function version(){const e=$v('siteVersion');if(e)e.textContent='Website v'+VERSION;document.documentElement.dataset.jayviVersion=VERSION}
function lock(){if(!mobile())return;const open=[...document.querySelectorAll('.overlay.open')].length>0;document.documentElement.classList.toggle('v22-overlay-open',open);document.body.classList.toggle('v22-overlay-open',open);if(open){document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden'}else{document.documentElement.style.overflow='';document.body.style.overflow=''}}
function syncOverlay(){document.querySelectorAll('.overlay').forEach(o=>new MutationObserver(lock).observe(o,{attributes:true,attributeFilter:['class']}));lock()}

/* Use the real product-specific images, not the old shared hero collage. */
function fixProductImages(){try{products.forEach(p=>{if(demo[p.id])p.image=demo[p.id][0]})}catch(_){} }

/* One-product-at-a-time pairing guide. */
window.renderMeal=function(){
 const labels=CONFIG.mealLabels||{};const tabs=Object.entries(labels);const host=$v('mealRecommendations');if(!$v('mealTabs')||!host)return;
 $v('mealTabs').innerHTML=tabs.map(([id,label])=>`<button class="${id===meal?'active':''}" onclick="setMeal('${id}',this)">${escapeHtml(label)}</button>`).join('');
 const rec=products.filter(p=>p.mealTags?.includes(meal));
 const desc={idli:'Best with idli — choose a familiar podi or chutney.',dosa:'Pair your dosa with a rich, traditional chutney flavour.',chapati:'A simple pairing for chapati, roti and everyday meals.',rice:'Add a spoonful of chutney powder to rice and ghee.'}[meal]||'Pick a Jayvi favourite for this meal.';
 host.innerHTML=`<div class="mealIntro"><b>${desc}</b><span>${rec.length} matching products</span></div><div class="miniProducts">${rec.map(p=>{const v=getVariant(p,variantKey(p.id));return `<button onclick="openProduct('${p.id}')"><div class="miniImg"><img src="${p.image}" alt="${escapeHtml(p.name)}"></div><span>${escapeHtml(p.name)}</span><b>${money(v.price)}</b></button>`}).join('')}</div>`;
};

/* Product details: full-screen + swipeable image carousel. */
window.openProduct=function(id){
 const p=getProduct(id);if(!p)return;const v=getVariant(p,variantKey(id));const paused=!!CONFIG.store.vacationMode;const imgs=demo[p.id]||[p.image];
 const slides=imgs.map((src,i)=>`<div class="v22-slide"><img src="${src}" alt="${escapeHtml(p.name)} ${i+1}" onerror="this.src='${p.image}'"></div>`).join('');
 const dots=imgs.map((_,i)=>`<i class="${i===0?'active':''}"></i>`).join('');
 const add=paused?'showToast(\'Ordering is paused while Jayvi Foods is away.\')':`addToCart('${p.id}','${v.id}')`;
 const buy=paused?'showToast(\'Ordering is paused while Jayvi Foods is away.\')':`buyNow('${p.id}','${v.id}')`;
 $v('productContent').innerHTML=`<div class="v22-product"><div class="v22-carousel" id="v22Carousel">${slides}</div><div class="v22-galleryDots" id="v22GalleryDots">${dots}</div><div class="v22-productInfo"><div class="eyebrow">${escapeHtml(catName(p.category))}</div><h2>${escapeHtml(p.name)}</h2><div class="stars">★★★★★ <span>${p.rating} · ${p.reviewCount} reviews</span></div><p>${escapeHtml(p.short)}</p><div class="detailVariants">${p.variants.filter(x=>x.active).map(x=>`<button class="${x.id===v.id?'active':''}" onclick="selectedVariants['${p.id}']='${x.id}';openProduct('${p.id}')">${escapeHtml(x.label)}<small>${money(x.price)}</small></button>`).join('')}</div><div class="detailPrice"><b>${money(v.price)}</b><del>${money(v.mrp)}</del><em>Save ${money(v.mrp-v.price)}</em></div><div class="detailUse"><b>Works well with</b><span>${(p.mealTags||[]).map(m=>escapeHtml((CONFIG.mealTags||[]).find(t=>t.id===m)?.name||CONFIG.mealLabels?.[m]||m)).join(' · ')}</span></div><div class="v22-productInfo detailBtns"><button class="btn light" ${paused?'disabled':''} onclick="${add}">${paused?'Orders paused':'Add to cart'}</button><button class="btn gold" ${paused?'disabled':''} onclick="${buy}">${paused?'Unavailable':'Buy now →'}</button></div></div></div>`;
 $v('productOverlay').classList.add('open');lock();
 const c=$v('v22Carousel'),ds=[...$v('v22GalleryDots').children];if(c)c.addEventListener('scroll',()=>{const idx=Math.round(c.scrollLeft/c.clientWidth);ds.forEach((d,i)=>d.classList.toggle('active',i===idx))},{passive:true});
};

/* Full-screen account is intentionally simple; no centered modal. */
const oldOpenAccount=window.openAccount;
window.accountFavoritesView=function(){const fav=(wishlist||[]).map(id=>getProduct(id)).filter(Boolean);return `<div class="eyebrow">MY JAYVI</div><h2>My favourites.</h2><p class="muted">Saved on this device for quick access.</p><div class="v22-favList">${fav.length?fav.map(p=>{const v=getVariant(p,variantKey(p.id));return `<button class="v22-favItem" onclick="closeAccount();openProduct('${p.id}')"><img src="${p.image}" alt=""><span><b>${escapeHtml(p.name)}</b><small>${money(v.price)}</small></span><i>→</i></button>`}).join(''):'<div class="empty">No favourites yet. Tap the heart on a product to save it.</div>'}</div>`};
window.accountView=function(s){const u=getCustomers().find(c=>c.id===s.id);const orders=getOrders().filter(o=>o.customerId===s.id||o.guestContact===u?.phone);return `<div class="eyebrow">MY JAYVI</div><h2>Welcome, ${escapeHtml((u?.name||'Customer').split(' ')[0])}.</h2><p class="muted">${escapeHtml(u?.phone||u?.login||'')}</p><div class="accountTabs"><button class="active" onclick="this.classList.add('active');document.getElementById('v22AccountBody').innerHTML=window.accountOrdersHtml()">Orders</button><button onclick="this.classList.remove('active');document.getElementById('v22AccountBody').innerHTML=window.accountFavoritesView()">Favourites</button><button onclick="trackOrderPrompt()">Track order</button></div><div id="v22AccountBody">${window.accountOrdersHtml(s)}</div>`};
window.accountOrdersHtml=function(s){const u=getCustomers().find(c=>c.id===s?.id)||getCustomers().find(c=>c.id===getSession()?.id);const orders=getOrders().filter(o=>o.customerId===s?.id||o.guestContact===u?.phone);return `<div class="orders">${orders.length?orders.map(o=>`<div class="order"><b>${o.id}</b><span>${o.date}</span><strong>${money(o.total)}</strong><small>${escapeHtml(o.status)}</small></div>`).join(''):'<div class="empty">No orders yet.</div>'}</div>`};
window.openAccount=function(){const s=getSession();$v('accountContent').innerHTML=s?accountView(s):authView('login');$v('accountOverlay').classList.add('open');lock()};

/* Checkout: never hand off to the Account popup. Payment/success stay inside checkout. */
window.openCheckout=function(){
 if(CONFIG.store.vacationMode){showToast(CONFIG.store.vacationMessage||'Ordering is temporarily paused.');return}
 if(!cart.length){showToast('Your cart is empty');return}
 closeCart();const t=cartTotals(),s=getSession(),u=s?getCustomers().find(c=>c.id===s.id):null;const upi=CONFIG.store.upiEnabled!==false,cod=CONFIG.store.codEnabled===true;
 $v('checkoutContent').innerHTML=`<div class="checkoutPage"><div class="eyebrow">CHECKOUT</div><h2>Delivery details.</h2><p class="muted">Enter your delivery details. No account is required.</p><div class="deliveryEstimate"><b>Estimated delivery: ${CONFIG.store.deliveryMinDays||4}–${CONFIG.store.deliveryMaxDays||8} days</b><span>Delivery time varies by location and PIN code.</span></div><div class="guestChoice"><b>${u?'Signed-in customer':'Guest checkout'}</b>${u?`<button type="button" onclick="setSession(null);openCheckout()">Use guest</button>`:'<button type="button" onclick="closeCheckout();openAccount()">Sign in / register</button>'}</div><form id="checkoutForm" onsubmit="placeOrder(event)"><label>Full name *<input id="coName" value="${escapeHtml(u?.name||'')}" required></label><label>Mobile *<input id="coPhone" value="${escapeHtml(u?.phone||'')}" required pattern="[0-9]{10}" maxlength="10" inputmode="numeric"></label><label>Search delivery location<div id="placeBox"></div></label><label>Address *<textarea id="coAddress" required rows="3" placeholder="House / flat, street, landmark"></textarea></label><div class="two"><label>City *<input id="coCity" required></label><label>State *<input id="coState" required></label></div><div class="pinRow"><label>PIN code *<input id="coPin" required inputmode="numeric" pattern="[0-9]{6}" maxlength="6"></label><button type="button" class="btn outline" onclick="verifyPincode()">Verify PIN</button></div><div id="pinStatus" class="pinStatus"></div><label>Country<select id="coCountry" disabled><option value="IN">India</option></select></label><div class="paymentChooser checkoutPayment"><h3>Payment method</h3>${upi?`<label class="paymentOption active"><input type="radio" name="paymentMethod" value="upi" checked onchange="togglePaymentNote()"><span><b>Pay by UPI QR</b><small>Scan and pay the exact order amount</small></span></label>`:''}${cod?`<label class="paymentOption"><input type="radio" name="paymentMethod" value="cod" onchange="togglePaymentNote()"><span><b>Cash on Delivery</b><small>Pay when delivered</small></span></label>`:''}<div id="paymentNote" class="paymentNote">${escapeHtml(CONFIG.store.paymentNote||'')}</div></div><button id="placeOrderBtn" class="btn gold full" type="submit">Place order & continue →</button></form><aside class="summary"><h3>Your order</h3>${cart.map(x=>{const d=cartItemDetails(x);return `<div class="line"><span>${escapeHtml(d.name)} · ${escapeHtml(d.label)} × ${x.qty}</span><b>${money(d.price*x.qty)}</b></div>`}).join('')}<div class="line"><span>Subtotal</span><b>${money(t.sub)}</b></div><div class="line"><span>Delivery</span><b>${t.ship?money(t.ship):'FREE'}</b></div><div class="line total"><span>Total</span><b>${money(t.total)}</b></div></aside></div>`;
 $v('checkoutOverlay').classList.add('open');lock();initPlaces();
};
window.placeOrder=function(e){
 e.preventDefault();if(window.__v22Submitting)return;const form=$v('checkoutForm');if(!form)return;if(!form.checkValidity()){form.reportValidity();return}
 const pin=$v('coPin').value.trim();if(!/^\d{6}$/.test(pin)){verifyPincode();showToast('Enter and verify a valid 6-digit PIN');return}
 const btn=$v('placeOrderBtn');if(btn){btn.disabled=true;btn.textContent='Creating order…'}window.__v22Submitting=true;
 const t=cartTotals(),s=getSession(),u=s?getCustomers().find(c=>c.id===s.id):null,customerId=u?.id||null,method=document.querySelector('input[name=paymentMethod]:checked')?.value||'upi';
 const order={id:makeOrderNumber(),date:new Date().toLocaleString('en-IN'),estimatedDelivery:`${CONFIG.store.deliveryMinDays||4}-${CONFIG.store.deliveryMaxDays||8} days`,customerId,guestContact:$v('coPhone').value.trim(),customerName:$v('coName').value.trim(),phone:$v('coPhone').value.trim(),address:$v('coAddress').value.trim(),city:$v('coCity').value.trim(),state:$v('coState').value.trim(),country:'IN',pin,items:structuredClone(cart),subtotal:t.sub,shipping:t.ship,total:t.total,status:method==='upi'?'Payment verification pending':'Order received — COD',payment:method==='upi'?'UPI QR — awaiting verification':'Cash on Delivery',paymentMethod:method,utr:'',timeline:[{status:method==='upi'?'Payment verification pending':'Order received — COD',at:new Date().toISOString()}]};
 const os=getOrders();os.unshift(order);saveOrders(os);cart=[];saveCart();renderCart();refreshProductViews();
 if(customerId){const customers=getCustomers();const cu=customers.find(c=>c.id===customerId);if(cu){cu.address={line1:order.address,city:order.city,state:order.state,pincode:order.pin,landmark:''};saveCustomers(customers)}}
 if(method==='upi')showUpiPayment(order);else showOrderSuccess(order);window.__v22Submitting=false;
};
window.showUpiPayment=function(o){
 const qr=CONFIG.store.upiQrImage?`<img class="upiQr" src="${CONFIG.store.upiQrImage}" alt="Jayvi Foods UPI QR">`:`<div class="upiQr placeholder"><b>UPI QR</b><span>Upload your Jayvi QR from Admin</span></div>`;
 $v('checkoutContent').innerHTML=`<div class="v22-payment"><div class="eyebrow">PAYMENT</div><h2>Pay ${money(o.total)}</h2><p class="muted">Scan the QR, pay the exact amount, then enter the UTR/reference number below.</p>${qr}<div class="upiMeta"><b>${escapeHtml(CONFIG.store.upiName||'Jayvi Foods')}</b>${CONFIG.store.upiId?`<span>UPI ID: ${escapeHtml(CONFIG.store.upiId)}</span>`:''}</div><label>UPI transaction / UTR reference *<input id="utrInput" placeholder="Enter UTR/reference"></label><button class="btn gold full" onclick="submitUpiProof('${o.id}')">I have paid →</button><button class="btn light full" onclick="closeCheckout()">Pay later</button><p class="tiny">Order ${o.id} · Payment verification pending</p></div>`;
};
window.submitUpiProof=function(id){const utr=$v('utrInput')?.value.trim();if(!utr){showToast('Enter the UTR/reference number');return}const os=getOrders(),o=os.find(x=>x.id===id);if(!o)return;o.utr=utr;o.paymentStatus='Proof submitted';o.timeline=(o.timeline||[]).concat({status:'Payment proof submitted',at:new Date().toISOString()});saveOrders(os);showOrderSuccess(o)};
window.showOrderSuccess=function(o){$v('checkoutContent').innerHTML=`<div class="v22-success"><div class="successIcon">✓</div><div class="eyebrow">ORDER RECEIVED</div><h2>${escapeHtml(o.id)}</h2><p class="muted">${escapeHtml(o.status)}. Your order is saved successfully.</p>${renderTimeline(o)}<button class="btn gold full" onclick="closeCheckout();window.scrollTo({top:0,behavior:'smooth'})">Continue shopping</button></div>`};

/* Keep cards synced when checkout closes and ensure cart count is authoritative. */
const oldCloseCheckout=window.closeCheckout;window.closeCheckout=function(){oldCloseCheckout();renderCart();setTimeout(()=>{try{renderBest();renderProducts();renderMeal();renderCombos()}catch(_){}lock()},30)};

/* Announcement touch UX + admin-configured image/price. */
const oldHeroShow=window.heroShow;window.heroShow=function(){
 const a=(CONFIG.announcements||[]).filter(x=>x.active).sort((x,y)=>(x.order||0)-(y.order||0));if(!a.length)return;const s=a[heroIndex%a.length],p=s.productId?getProduct(s.productId):null,combo=s.comboId?getCombo(s.comboId):null;
 $v('heroLabel').textContent=s.label||'';$v('heroTitle').innerHTML=`${escapeHtml(s.title||'')}<br><em>${escapeHtml(s.em||'')}</em>`;$v('heroDesc').textContent=s.text||'';$v('heroPrice').textContent=money(p?getVariant(p,variantKey(p.id)).price:combo?.price||0);$v('heroPrice').style.display=s.showPrice===false?'none':'';$v('heroImg').src=s.image||p?.image||combo?.image||'images/hero/jayvi-products.webp';
 $v('heroShop').onclick=()=>{const type=s.actionType||(s.comboId?'combo':'product'),target=s.actionTarget||(s.comboId?s.comboId:s.productId);if(type==='product'&&getProduct(target))openProduct(target);else if(type==='combo'&&getCombo(target))document.getElementById('combos').scrollIntoView({behavior:'smooth'});else if(type==='shop')document.getElementById('shop').scrollIntoView({behavior:'smooth'});else if(type==='reviews')document.getElementById('reviews').scrollIntoView({behavior:'smooth'});else if(type==='url'&&s.actionTarget)window.location.href=s.actionTarget};
 $v('heroDots').innerHTML=a.map((_,i)=>`<button class="${i===heroIndex?'active':''}" onclick="heroIndex=${i};heroShow();restartHero()"></button>`).join('');const g=document.querySelector('.heroGrid');g.classList.remove('heroChange');void g.offsetWidth;g.classList.add('heroChange');
};
function heroTouch(){const h=document.querySelector('.hero');if(!h||h.dataset.v22Touch)return;h.dataset.v22Touch='1';let x=0,y=0;h.addEventListener('touchstart',e=>{x=e.changedTouches[0].clientX;y=e.changedTouches[0].clientY},{passive:true});h.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)){const n=(CONFIG.announcements||[]).filter(x=>x.active).length;if(n>1){heroIndex=(heroIndex+(dx<0?1:-1)+n)%n;heroShow();restartHero()}}},{passive:true})}

/* About link should stay on storefront, not jump to Help & Support. */
function fixAbout(){document.querySelector('.smallAbout')?.setAttribute('id','about');const a=document.querySelector('.smallAbout a');if(a){a.textContent='Our story →';a.href='#about'}}

function init(){version();fixProductImages();syncOverlay();heroTouch();fixAbout();setTimeout(()=>{version();fixProductImages();try{renderBest();renderProducts();renderMeal();renderCombos();heroShow()}catch(_){}},80);setInterval(version,3000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
