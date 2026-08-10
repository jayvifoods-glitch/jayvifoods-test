const KEY='jayviStoreV14';
const CONFIG_FALLBACK={store:{name:'Jayvi Foods',tagline:'Purely Traditional. Simply Delicious.',country:'IN',freeShippingThreshold:599,shippingFlat:49,deliveryMinDays:4,deliveryMaxDays:8,vacationMode:false,vacationMessage:'We are taking a short break. Orders will resume soon.',googleMapsApiKey:'',googleReviewsUrl:'https://www.google.com/search?q=Jayvi+Foods+reviews',whatsapp:'918861981003',instagram:'https://instagram.com/jayvifoods',razorpayKeyId:'',razorpayEnabled:false,upiEnabled:true,codEnabled:false,otpEnabled:false,upiId:'',upiName:'Jayvi Foods',upiQrImage:'',paymentNote:'Pay by UPI QR. Order moves to processing after payment verification.'},homepage:{heroAutoplay:true,heroSeconds:5},
categories:[{id:'chutney',name:'Chutney Powders',enabled:true,order:1},{id:'pudi',name:'Pudi',enabled:true,order:2},{id:'snacks',name:'Snacks',enabled:true,order:3},{id:'combos',name:'Combos',enabled:true,order:4}],
products:[
  {id:'peanut',sku:'JF-TAR-CLS-PNT',name:'Peanut Chutney',short:'Rich, nutty and comforting.',category:'chutney',active:true,best:true,image:'images/products/peanut-chutney.webp',imageClass:'peanut',variants:[{id:'peanut-200',label:'200g',weight:'200g',price:155,mrp:199,sku:'JF-TAR-CLS-PNT-200',active:true},{id:'peanut-400',label:'400g',weight:'400g',price:249,mrp:299,sku:'JF-TAR-CLS-PNT-400',active:true}],mealTags:['idli','dosa','chapati','rice'],rating:4.8,reviewCount:18},
  {id:'flaxseed',sku:'JF-TAR-CLS-FLX',name:'Flaxseed Chutney',short:'A distinctive traditional flavour.',category:'chutney',active:true,best:true,image:'images/hero/jayvi-products.webp',imageClass:'flaxseed',variants:[{id:'flaxseed-200',label:'200g',weight:'200g',price:155,mrp:199,sku:'JF-TAR-CLS-FLX-200',active:true},{id:'flaxseed-400',label:'400g',weight:'400g',price:249,mrp:299,sku:'JF-TAR-CLS-FLX-400',active:true}],mealTags:['idli','dosa','chapati','rice'],rating:4.8,reviewCount:12},
  {id:'pudi',sku:'JF-TAR-CLS-IDP',name:'Idli Dosa Pudi',short:'Made for idli, dosa and everyday meals.',category:'pudi',active:true,best:true,image:'images/hero/jayvi-products.webp',imageClass:'pudi',variants:[{id:'pudi-200',label:'200g',weight:'200g',price:155,mrp:199,sku:'JF-TAR-CLS-IDP-200',active:true},{id:'pudi-400',label:'400g',weight:'400g',price:249,mrp:299,sku:'JF-TAR-CLS-IDP-400',active:true}],mealTags:['idli','dosa','chapati','rice'],rating:4.8,reviewCount:9},
  {id:'puffora',sku:'JF-PUF',name:'Puffora',short:'Crunchy, puffy, made for anytime snacking.',category:'snacks',active:true,best:true,image:'images/hero/jayvi-products.webp',imageClass:'puffora',variants:[{id:'puffora-pack',label:'Pack',weight:'Pack',price:99,mrp:129,sku:'JF-PUF-200',active:true}],mealTags:[],rating:4.7,reviewCount:4}
],
combos:[{id:'duo',name:'Traditional Duo',short:'Peanut + Flaxseed. Two everyday favourites.',active:true,price:289,mrp:310,image:'images/hero/jayvi-products.webp',items:[{productId:'peanut',variantId:'peanut-200',qty:1},{productId:'flaxseed',variantId:'flaxseed-200',qty:1}]}],
announcements:[{id:'h1',label:'BESTSELLER',title:'Peanut Chutney',em:'for every meal.',text:'Rich, nutty and comforting — the everyday favourite.',productId:'peanut',actionType:'product',actionTarget:'peanut',active:true,order:1},{id:'h2',label:'NEW',title:'Puffora',em:'crunch time.',text:'A crunchy Jayvi snack for anytime munching.',productId:'puffora',actionType:'product',actionTarget:'puffora',active:true,order:2},{id:'h3',label:'COMBO',title:'Traditional Duo',em:'one easy choice.',text:'Peanut + Flaxseed together at ₹289.',comboId:'duo',actionType:'combo',actionTarget:'duo',active:true,order:3}],
mealLabels:{idli:'Idli',dosa:'Dosa',chapati:'Chapati',rice:'Rice + Ghee'},
mealTags:[
{id:'idli',name:'Idli',enabled:true,order:1},{id:'dosa',name:'Dosa',enabled:true,order:2},
{id:'chapati',name:'Chapati',enabled:true,order:3},{id:'rice',name:'Rice + Ghee',enabled:true,order:4},
{id:'roti',name:'Roti',enabled:true,order:5},{id:'paratha',name:'Paratha',enabled:true,order:6},
{id:'poori',name:'Poori',enabled:true,order:7},{id:'upma',name:'Upma',enabled:true,order:8},
{id:'vada',name:'Vada',enabled:true,order:9},{id:'curd-rice',name:'Curd Rice',enabled:true,order:10}
],
reviews:[]};

/* ---------- Supabase admin session ---------- */
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let adminUser = null, adminProfile = null;

async function requireAdminSession(){
  const {data} = await sb.auth.getSession();
  const user = data?.session?.user;
  if(!user){ location.href='admin-login.html'; return false; }
  const {data:profile, error} = await sb.from('profiles').select('*').eq('id', user.id).single();
  if(error || profile?.role !== 'admin'){
    await sb.auth.signOut();
    location.href='admin-login.html';
    return false;
  }
  adminUser = user; adminProfile = profile;
  return true;
}

let data=loadData(),tab='dashboard';
const app=document.getElementById('app'), title=document.getElementById('title');
const money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
function loadData(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return x?mergeDefaults(x):structuredClone(CONFIG_FALLBACK)}catch{return structuredClone(CONFIG_FALLBACK)}}
function mergeDefaults(x){const d=structuredClone(CONFIG_FALLBACK);Object.keys(x||{}).forEach(k=>d[k]=x[k]);d.store={...CONFIG_FALLBACK.store,...(x.store||{})};d.homepage={...CONFIG_FALLBACK.homepage,...(x.homepage||{})};d.categories=x.categories||d.categories;d.products=x.products||d.products;d.combos=x.combos||d.combos;d.announcements=x.announcements||d.announcements;d.mealTags=x.mealTags||d.mealTags;d.mealLabels=Object.fromEntries((d.mealTags||[]).map(t=>[t.id,t.name]));d.reviews=x.reviews||d.reviews;return d}
function persist(){localStorage.setItem(KEY,JSON.stringify(data));toast('Catalogue/settings saved to this browser. Per the agreed architecture, catalogue and store configuration stay Git-managed — sync this out to your repo when ready.')}
function toast(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2300)}
async function logout(){await sb.auth.signOut();location.href='admin-login.html'}

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

function catName(id){return data.categories.find(c=>c.id===id)?.name||id||'Uncategorised'}
function product(id){return data.products.find(p=>p.id===id)}
function variant(pid,vid){return product(pid)?.variants?.find(v=>v.id===vid)}
function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function setTab(t){tab=t;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));render()}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
async function render(){title.textContent=tab==='variants'?'Variants & sizes':tab==='mealtags'?'Meal tags':tab==='settings'?'Store settings':tab[0].toUpperCase()+tab.slice(1);document.getElementById('headerContext').innerHTML=tab==='dashboard'?'<span class="livePill">Connected to Supabase</span>':'';
 app.innerHTML = '<div class="empty">Loading…</div>';
 let h='';
 if(tab==='dashboard')h=await dashboard();
 if(tab==='orders')h=await ordersPage();
 if(tab==='customers')h=await customersPage();
 if(tab==='products')h=productsPage();
 if(tab==='variants')h=variantsPage();
 if(tab==='combos')h=combosPage();
 if(tab==='categories')h=categoriesPage();
 if(tab==='mealtags')h=mealTagsPage();
 if(tab==='homepage')h=homepagePage();
 if(tab==='reviews')h=await reviewsPage();
 if(tab==='settings')h=settingsPage();
 app.innerHTML=h;
}
async function dashboard(){
  const os=await fetchOrders(), cs=await fetchCustomers();
  const today=new Date().toLocaleDateString('en-IN');
  const todayOrders=os.filter(o=>new Date(o.created_at).toLocaleDateString('en-IN')===today);
  const sales=os.filter(o=>String(o.status||'').toLowerCase()!=='cancelled').reduce((s,o)=>s+Number(o.total||0),0);
  const todaySales=todayOrders.reduce((s,o)=>s+Number(o.total||0),0);
  const pending=os.filter(o=>/pending|received|preparing|packed|shipped|out for/i.test(o.status||'')).length;
  const delivered=os.filter(o=>String(o.status||'').toLowerCase().includes('delivered')).length;
  const top={};os.forEach(o=>(o.order_items||[]).forEach(i=>{const k=i.name||i.combo_id||'Combo';top[k]=(top[k]||0)+Number(i.qty||0)}));
  const topList=Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return `<section class="kpis"><article><small>ORDERS TODAY</small><b>${todayOrders.length}</b><span>${todaySales?money(todaySales):'No sales yet'}</span></article><article><small>TOTAL ORDERS</small><b>${os.length}</b><span>${delivered} delivered</span></article><article><small>SALES</small><b>${money(sales)}</b><span>All non-cancelled orders</span></article><article><small>REGISTERED CUSTOMERS</small><b>${cs.length}</b><span>Excludes guests</span></article><article><small>PENDING ORDERS</small><b>${pending}</b><span>Need attention</span></article><article><small>FREE SHIPPING</small><b>${money(data.store.freeShippingThreshold)}</b><span>Configured threshold</span></article></section><div class="dashboardGrid"><section class="panel wide"><div class="panelHead"><div><h2>Latest orders</h2><p>Your operational view: customer, amount, payment and current status.</p></div><button class="gold" onclick="setTab('orders')">View all orders →</button></div>${os.length?`<div class="orderTable"><div class="orderHead"><span>Order</span><span>Customer</span><span>Amount</span><span>Payment</span><span>Status</span></div>${os.slice(0,10).map(o=>`<button class="orderLine" onclick="orderView('${esc(o.order_number)}')"><span><b>${esc(o.order_number)}</b><small>${new Date(o.created_at).toLocaleDateString('en-IN')}</small></span><span><b>${esc(o.guest_name||'Guest')}</b><small>${esc(o.guest_phone||'')}</small></span><strong>${money(o.total)}</strong><span>${esc(o.payment_method||'')}</span><span class="statusTag">${esc(o.status||'')}</span></button>`).join('')}</div>`:'<div class="empty">No orders yet.</div>'}</section><section class="panel"><div class="panelHead"><div><h2>Top products</h2><p>Based on live Supabase orders.</p></div></div>${topList.length?topList.map(x=>`<div class="metricRow"><span>${esc(x[0])}</span><b>${x[1]} sold</b></div>`).join(''):'<div class="empty smallEmpty">No sales data yet.</div>'}</section><section class="panel"><div class="panelHead"><div><h2>Store operations</h2><p>Quick controls that affect ordering.</p></div><button class="outline" onclick="setTab('settings')">Open settings</button></div><div class="operation"><span>Vacation mode</span><b class="${data.store.vacationMode?'danger':'good'}">${data.store.vacationMode?'ON — ordering paused':'OFF — ordering open'}</b></div><div class="operation"><span>UPI</span><b class="good">${data.store.upiEnabled===false?'OFF':'ON'}</b></div><div class="operation"><span>COD</span><b>${data.store.codEnabled===false?'OFF':'ON'}</b></div><div class="operation"><span>Razorpay</span><b>${data.store.razorpayEnabled?'ON':'OFF'}</b></div><div class="operation"><span>OTP login</span><b>${data.store.otpEnabled?'ON':'OFF — future'}</b></div></section></div>`;
}
async function ordersPage(){
  const os=await fetchOrders();
  return `<section class="panel"><div class="panelHead"><div><h2>Orders</h2><p>Guest and registered orders are shown together. Open an order for the full customer, payment and delivery view.</p></div><div class="filterPills"><button class="outline" onclick="render()">Refresh</button></div></div>${os.length?`<div class="orderTable fullTable"><div class="orderHead"><span>Order</span><span>Customer</span><span>Amount</span><span>Payment</span><span>Status</span></div>${os.map(o=>`<button class="orderLine" onclick="orderView('${esc(o.order_number)}')"><span><b>${esc(o.order_number)}</b><small>${new Date(o.created_at).toLocaleDateString('en-IN')}</small></span><span><b>${esc(o.guest_name||'Guest')}</b><small>${esc(o.guest_phone||'')}</small></span><strong>${money(o.total)}</strong><span>${esc(o.payment_method||'')}</span><span class="statusTag">${esc(o.status||'')}</span></button>`).join('')}</div>`:'<div class="empty">No orders found.</div>'}</section>`;
}
async function orderView(orderNumber){
  const o = await fetchOrder(orderNumber);
  if(!o){ toast('Order not found'); return; }
  const timeline=(o.history||[]).map(t=>`<div class="timelineItem"><b>${esc(t.status)}</b><small>${new Date(t.created_at).toLocaleString('en-IN')}</small>${t.note?` — ${esc(t.note)}`:''}</div>`).join('');
  openModal(`<div class="eyebrow">ORDER</div><h2>${esc(o.order_number)}</h2><div class="detailColumns"><div><h3>Customer</h3><p><b>${esc(o.guest_name||'Guest')}</b><br>${esc(o.guest_phone||'')}</p><h3>Delivery</h3><p>${esc(o.address_line1||'')}<br>${esc(o.address_city||'')}, ${esc(o.address_state||'')} ${esc(o.address_pincode||'')}</p></div><div><h3>Payment</h3><p>${esc(o.payment_method||'')}<br>Status: <b>${esc(o.payment_status||'')}</b><br>UTR: ${esc(o.utr||'Not provided')}</p><h3>Items</h3>${(o.order_items||[]).map(i=>`<div class="miniLine"><span>${esc(i.name)} ${i.variant_label?'· '+esc(i.variant_label):''} × ${i.qty}</span><b>${money(i.line_total)}</b></div>`).join('')}<div class="miniLine total"><span>Total</span><b>${money(o.total)}</b></div></div></div><div class="statusEditor"><label>Order status<select id="orderStatus"><option>Order received</option><option>Order received — COD</option><option>Payment verification pending</option><option>Payment verified</option><option>Preparing</option><option>Packed</option><option>Shipped</option><option>Out for delivery</option><option>Delivered</option><option>Cancelled</option></select></label><label>Delivery partner<input id="deliveryPartner" value="${esc(o.delivery_partner||'')}"></label><label>Tracking number<input id="trackingNumber" value="${esc(o.tracking_number||'')}"></label><label>Tracking URL<input id="trackingUrl" value="${esc(o.tracking_url||'')}"></label><button class="gold full" onclick="updateOrder('${esc(o.order_number)}','${o.id}')">Update order</button></div><div class="timeline"><h3>Order timeline</h3>${timeline||'<div class="empty smallEmpty">No timeline yet.</div>'}</div><div class="notificationBox"><b>Customer update</b><p>Automated WhatsApp delivery will be connected later through WhatsApp Business messaging.</p><button class="outline" onclick="manualWhatsApp('${esc(o.guest_phone||'')}','${esc(o.order_number)}')">Open WhatsApp update</button></div>`);
  document.getElementById('orderStatus').value=o.status||'Order received';
}
async function updateOrder(orderNumber, orderId){
  const ns=document.getElementById('orderStatus').value;
  const deliveryPartner=document.getElementById('deliveryPartner').value.trim();
  const trackingNumber=document.getElementById('trackingNumber').value.trim();
  const trackingUrl=document.getElementById('trackingUrl').value.trim();
  const {error} = await sb.from('orders').update({
    status: ns, delivery_partner: deliveryPartner||null, tracking_number: trackingNumber||null, tracking_url: trackingUrl||null
  }).eq('order_number', orderNumber);
  if(error){ toast('Could not update order: '+error.message); return; }
  await sb.from('order_status_history').insert({ order_id: orderId, status: ns });
  closeModal();toast('Order updated');render();
}
function manualWhatsApp(phone,orderNumber){if(!phone){toast('Customer mobile number is missing');return}const msg=`Jayvi Foods order ${orderNumber}: Your order status has been updated. Please contact us if you need help.`;window.open('https://wa.me/'+phone.replace(/\D/g,'')+'?text='+encodeURIComponent(msg),'_blank')}
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
  openModal(`<div class="eyebrow">${c.type.toUpperCase()} CUSTOMER</div><h2>${esc(c.name)}</h2><p class="muted">${esc(c.phone)}</p><div class="orders" style="margin-top:16px">${c.orders.map(o=>`<button class="order" type="button" onclick="closeModal();orderView('${esc(o.order_number)}')"><b>${esc(o.order_number)}</b><span>${new Date(o.created_at).toLocaleDateString('en-IN')}</span><strong>${money(o.total)}</strong><small>${esc(o.status)}</small></button>`).join('')||'<div class="empty smallEmpty">No orders.</div>'}</div>`);
}

function productsPage(){return `<section class="panel"><div class="panelHead"><div><h2>Products</h2><p>Product catalogue, merchandising, multiple categories and media.</p></div><button class="gold" onclick="productForm()">+ Add product</button></div><div class="productAdminGrid">${data.products.map((p,i)=>`<article class="productAdminCard"><div class="thumb"><img src="${esc(p.image||'')}" alt=""></div><div class="productInfo"><span class="typeTag">${p.best?'BESTSELLER':'PRODUCT'}</span><h3>${esc(p.name)}</h3><p>${esc(p.short||'')}</p><small>${(p.categories||[p.category]).map(catName).join(' · ')} · ${p.variants?.length||0} variants</small><div class="cardActions"><button class="outline" onclick="productForm(${i})">Edit</button><button class="outline dangerBtn" onclick="deleteProduct(${i})">Delete</button></div></div></article>`).join('')}</div></section>`}
function productForm(index=-1){
 const p=index>=0?data.products[index]:{id:'',sku:'',name:'',short:'',description:'',category:data.categories[0]?.id||'',categories:[],active:true,best:false,image:'',mediaFolder:'',media:[],mealTags:[],rating:0,reviewCount:0,variants:[]};
 const selected=p.categories||[p.category].filter(Boolean);
 const folder=p.mediaFolder||`images/products/${p.id||'[product-id]'}/`;
 const media=p.media||[];
 const file=(type,def='')=>media.find(x=>x.type===type)?.file||media.find(x=>x.type===type)?.path?.split('/').pop()||def;
 openModal(`<div class="eyebrow">PRODUCT</div><h2>${index<0?'Add product':'Edit product'}</h2>
 <div class="formGrid">
 <label>Product ID<input id="pId" value="${esc(p.id)}" placeholder="peanut-chutney"></label>
 <label>SKU<input id="pSku" value="${esc(p.sku)}"></label>
 <label>Product name<input id="pName" value="${esc(p.name)}"></label>
 <label>Primary category<select id="pCat">${data.categories.map(c=>`<option value="${c.id}" ${c.id===(p.category||selected[0])?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label>
 <label class="fullLabel">Short description<textarea id="pShort" rows="3" maxlength="220" placeholder="Card text. Keep it concise; storefront clamps it visually.">${esc(p.short)}</textarea><small class="fieldHint">Up to 220 characters. Full description can be longer below.</small></label>
 <label class="fullLabel">Full product description<textarea id="pDesc" rows="7">${esc(p.description||'')}</textarea></label>
 </div>
 <div class="formSection"><h3>Categories / collections</h3><p>Select as many as needed. Primary category is separate from merchandising collections.</p><div class="checkGrid">${data.categories.map(c=>`<label><input type="checkbox" class="pCats" value="${c.id}" ${selected.includes(c.id)?'checked':''}> ${esc(c.name)}</label>`).join('')}</div></div>
 <div class="formSection"><h3>Meal tags</h3><p>Admin-managed. Add more from <b>Meal tags</b> in the sidebar; nothing is hardcoded to four choices.</p><div class="checkGrid">${(data.mealTags||[]).filter(t=>t.enabled).sort((a,b)=>a.order-b.order).map(t=>`<label><input type="checkbox" class="pMeals" value="${t.id}" ${(p.mealTags||[]).includes(t.id)?'checked':''}> ${esc(t.name)}</label>`).join('')}</div></div>
 <div class="formSection"><h3>Product media</h3>
 <div class="mediaHint"><b>Folder is automatic:</b> <code id="mediaFolderPreview">${esc(folder)}</code><br>
 You do <b>not</b> paste image paths here. Put the approved files in that product folder using the standard names below. The future Git-backed backend will read this folder/manifest automatically.</div>
 <div class="mediaFields">
 <label>Hero filename<input id="mHero" value="${esc(file('hero','hero.webp'))}" placeholder="hero.webp"></label>
 <label>Front / Back filename<input id="mPackaging" value="${esc(file('packaging','front-back.webp'))}" placeholder="front-back.webp"></label>
 <label>Ingredients filename<input id="mIngredients" value="${esc(file('ingredients','ingredients.webp'))}" placeholder="ingredients.webp"></label>
 <label>Serving / use case filename<input id="mServing" value="${esc(file('serving','serving.webp'))}" placeholder="serving.webp"></label>
 <label>Short video filename<input id="mVideo" value="${esc(file('video',''))}" placeholder="use-case.mp4"></label>
 </div>
 <div class="infoBox"><b>Media rule</b><p>WebP images · 4 core images/product · optional 5–15 sec MP4/H.264 video. The storefront will use the hero image in cards and the full gallery in product detail.</p></div>
 </div>
 <label class="checkOnly"><input type="checkbox" id="pActive" ${p.active?'checked':''}> Product visible</label>
 <label class="checkOnly"><input type="checkbox" id="pBest" ${p.best?'checked':''}> Bestseller</label>
 <button class="gold full" onclick="saveProduct(${index})">Save product</button>`);
}
function saveProduct(index){
 const id=document.getElementById('pId').value.trim();
 const folder=`images/products/${id||'product'}/`;
 const media=[
   ['hero',document.getElementById('mHero')?.value.trim()],
   ['packaging',document.getElementById('mPackaging')?.value.trim()],
   ['ingredients',document.getElementById('mIngredients')?.value.trim()],
   ['serving',document.getElementById('mServing')?.value.trim()],
   ['video',document.getElementById('mVideo')?.value.trim()]
 ].filter(x=>x[1]).map(x=>({type:x[0],file:x[1],path:folder+x[1]}));
 const p={id,sku:document.getElementById('pSku').value.trim(),name:document.getElementById('pName').value.trim(),
 short:document.getElementById('pShort').value.trim(),description:document.getElementById('pDesc').value.trim(),
 category:document.getElementById('pCat').value,categories:[...document.querySelectorAll('.pCats:checked')].map(x=>x.value),
 mealTags:[...document.querySelectorAll('.pMeals:checked')].map(x=>x.value),
 image:media.find(x=>x.type==='hero')?.path||folder+'hero.webp',mediaFolder:folder,media,
 active:document.getElementById('pActive').checked,best:document.getElementById('pBest').checked,
 variants:index>=0?data.products[index].variants:[],rating:index>=0?data.products[index].rating:0,
 reviewCount:index>=0?data.products[index].reviewCount:0};
 if(!p.id||!p.name){toast('Product ID and name are required');return}
 if(index<0)data.products.push(p);else data.products[index]=p;
 persist();closeModal();render();
}
function deleteProduct(i){if(confirm('Delete this product from the prototype catalogue?')){data.products.splice(i,1);persist();render()}}
function variantsPage(){return `<section class="panel"><div class="panelHead"><div><h2>Variants & sizes</h2><p>Each product controls its own available sizes. Future 1kg, 2kg or other variants can be added here.</p></div></div>${data.products.map((p,i)=>`<div class="variantBlock"><div class="variantTitle"><div><b>${esc(p.name)}</b><small>${esc(p.sku)}</small></div><button class="gold small" onclick="variantForm(${i})">+ Add size</button></div><div class="variantRows">${(p.variants||[]).map((v,j)=>`<div class="variantRow"><span><b>${esc(v.label)}</b><small>${esc(v.weight||v.label)} · ${esc(v.sku||'')}</small></span><strong>${money(v.price)}</strong><del>${money(v.mrp)}</del><span class="${v.active?'good':'danger'}">${v.active?'LIVE':'HIDDEN'}</span><button class="outline" onclick="variantForm(${i},${j})">Edit</button></div>`).join('')||'<div class="empty smallEmpty">No variants yet.</div>'}</div></div>`).join('')}</section>`}
function variantForm(pi,vi=-1){const p=data.products[pi],v=vi>=0?p.variants[vi]:{id:'',label:'',weight:'',price:'',mrp:'',sku:'',active:true};openModal(`<div class="eyebrow">VARIANT</div><h2>${vi<0?'Add size':'Edit size'} · ${esc(p.name)}</h2><div class="formGrid"><label>Variant ID<input id="vId" value="${esc(v.id)}"></label><label>Display label<input id="vLabel" value="${esc(v.label)}" placeholder="1kg"></label><label>Weight<input id="vWeight" value="${esc(v.weight)}"></label><label>SKU<input id="vSku" value="${esc(v.sku)}"></label><label>Selling price<input id="vPrice" type="number" value="${v.price}"></label><label>MRP<input id="vMrp" type="number" value="${v.mrp}"></label></div><label class="checkOnly"><input id="vActive" type="checkbox" ${v.active?'checked':''}> Available for sale</label><button class="gold full" onclick="saveVariant(${pi},${vi})">Save variant</button>`)}
function saveVariant(pi,vi){const p=data.products[pi];const v={id:document.getElementById('vId').value.trim(),label:document.getElementById('vLabel').value.trim(),weight:document.getElementById('vWeight').value.trim(),sku:document.getElementById('vSku').value.trim(),price:Number(document.getElementById('vPrice').value||0),mrp:Number(document.getElementById('vMrp').value||0),active:document.getElementById('vActive').checked};if(!v.id||!v.label){toast('Variant ID and label are required');return}if(vi<0)p.variants.push(v);else p.variants[vi]=v;persist();closeModal();render()}
function combosPage(){return `<section class="panel"><div class="panelHead"><div><h2>Combos</h2><p>Combo item size dropdowns are filtered to the selected product's own variants.</p></div><button class="gold" onclick="comboForm()">+ Add combo</button></div><div class="comboAdmin">${data.combos.map((c,i)=>`<article><span class="typeTag">COMBO</span><h3>${esc(c.name)}</h3><p>${esc(c.short||'')}</p><div class="chips">${(c.items||[]).map(it=>{const p=product(it.productId),v=variant(it.productId,it.variantId);return `<span>${esc(p?.name||'')} · ${esc(v?.label||'')} × ${it.qty}</span>`}).join('')}</div><strong>${money(c.price)}</strong><small>MRP ${money(c.mrp)} · ${c.active?'Live':'Hidden'}</small><div class="cardActions"><button class="outline" onclick="comboForm(${i})">Edit</button><button class="outline dangerBtn" onclick="data.combos.splice(${i},1);persist();render()">Delete</button></div></article>`).join('')}</div></section>`}
function comboForm(index=-1){const c=index>=0?data.combos[index]:{id:'',name:'',short:'',price:0,mrp:0,image:'',active:true,items:[]};openModal(`<div class="eyebrow">COMBO</div><h2>${index<0?'Add combo':'Edit combo'}</h2><div class="formGrid"><label>Combo ID<input id="cId" value="${esc(c.id)}"></label><label>Name<input id="cName" value="${esc(c.name)}"></label><label>Price<input id="cPrice" type="number" value="${c.price}"></label><label>MRP<input id="cMrp" type="number" value="${c.mrp}"></label><label class="fullLabel">Description<textarea id="cShort" rows="3">${esc(c.short||'')}</textarea></label><label class="fullLabel">Image path<input id="cImage" value="${esc(c.image||'')}" placeholder="images/combos/traditional-duo.webp"></label></div><div class="formSection"><h3>Combo items</h3><div id="comboItems"></div><button class="outline" onclick="addComboItemRow()">+ Add item</button></div><label class="checkOnly"><input id="cActive" type="checkbox" ${c.active?'checked':''}> Combo visible</label><button class="gold full" onclick="saveCombo(${index})">Save combo</button>`);window._comboDraft=structuredClone(c.items||[]);renderComboRows()}
function addComboItemRow(){window._comboDraft.push({productId:data.products[0]?.id||'',variantId:data.products[0]?.variants?.[0]?.id||'',qty:1});renderComboRows()}
function renderComboRows(){const box=document.getElementById('comboItems');if(!box)return;box.innerHTML=(window._comboDraft||[]).map((it,i)=>{const p=product(it.productId);const opts=(p?.variants||[]).filter(v=>v.active).map(v=>`<option value="${v.id}" ${v.id===it.variantId?'selected':''}>${esc(v.label)} — ${money(v.price)}</option>`).join('');return `<div class="comboItemForm"><select onchange="comboProductChanged(${i},this.value)">${data.products.filter(p=>p.active).map(p=>`<option value="${p.id}" ${p.id===it.productId?'selected':''}>${esc(p.name)}</option>`).join('')}</select><select onchange="window._comboDraft[${i}].variantId=this.value">${opts}</select><input type="number" min="1" value="${it.qty}" onchange="window._comboDraft[${i}].qty=Number(this.value||1)"><button onclick="window._comboDraft.splice(${i},1);renderComboRows()">×</button></div>`}).join('')||'<div class="empty smallEmpty">Add products to this combo.</div>'}
function comboProductChanged(i,pid){window._comboDraft[i].productId=pid;window._comboDraft[i].variantId=product(pid)?.variants?.find(v=>v.active)?.id||'';renderComboRows()}
function saveCombo(index){const c={id:document.getElementById('cId').value.trim(),name:document.getElementById('cName').value.trim(),price:Number(document.getElementById('cPrice').value||0),mrp:Number(document.getElementById('cMrp').value||0),short:document.getElementById('cShort').value.trim(),image:document.getElementById('cImage').value.trim(),active:document.getElementById('cActive').checked,items:structuredClone(window._comboDraft||[])};if(!c.id||!c.name){toast('Combo ID and name are required');return}if(index<0)data.combos.push(c);else data.combos[index]=c;persist();closeModal();render()}
function mealTagsPage(){
 return `<section class="panel"><div class="panelHead"><div><h2>Meal tags</h2><p>Manage the meals shown in product setup and the storefront's “Made for every meal” recommendations.</p></div><button class="gold" onclick="mealTagForm()">+ Add meal tag</button></div>
 <div class="categoryTable">${(data.mealTags||[]).sort((a,b)=>(a.order||0)-(b.order||0)).map((t,i)=>`<div class="categoryRow"><span><b>${esc(t.name)}</b><small>ID: ${esc(t.id)}</small></span><strong>${t.order||i+1}</strong><span class="${t.enabled?'good':'danger'}">${t.enabled?'VISIBLE':'HIDDEN'}</span><button class="outline" onclick="mealTagForm(${i})">Edit</button><button class="outline dangerBtn" onclick="deleteMealTag(${i})">Delete</button></div>`).join('')}</div></section>`;
}
function mealTagForm(index=-1){
 const t=index>=0?data.mealTags[index]:{id:'',name:'',enabled:true,order:data.mealTags.length+1};
 openModal(`<div class="eyebrow">MEAL TAG</div><h2>${index<0?'Add meal tag':'Edit meal tag'}</h2><div class="formGrid"><label>ID<input id="mtId" value="${esc(t.id)}"></label><label>Name<input id="mtName" value="${esc(t.name)}"></label><label>Display position<input id="mtOrder" type="number" value="${t.order||1}"></label></div><label class="checkOnly"><input id="mtEnabled" type="checkbox" ${t.enabled?'checked':''}> Visible</label><button class="gold full" onclick="saveMealTag(${index})">Save meal tag</button>`);
}
function saveMealTag(i){const t={id:document.getElementById('mtId').value.trim(),name:document.getElementById('mtName').value.trim(),order:Number(document.getElementById('mtOrder').value||1),enabled:document.getElementById('mtEnabled').checked};if(!t.id||!t.name){toast('ID and name are required');return}if(i<0)data.mealTags.push(t);else data.mealTags[i]=t;data.mealLabels=Object.fromEntries(data.mealTags.map(x=>[x.id,x.name]));persist();closeModal();render()}
function deleteMealTag(i){const id=data.mealTags[i]?.id;if(data.products.some(p=>(p.mealTags||[]).includes(id))){toast('Remove this tag from products before deleting it');return}if(confirm('Delete this meal tag?')){data.mealTags.splice(i,1);data.mealLabels=Object.fromEntries(data.mealTags.map(x=>[x.id,x.name]));persist();render()}}
function categoriesPage(){return `<section class="panel"><div class="panelHead"><div><h2>Categories</h2><p>Display position controls ordering. “Orders” is not used here.</p></div><button class="gold" onclick="categoryForm()">+ Add category</button></div><div class="categoryTable">${data.categories.map((c,i)=>`<div class="categoryRow"><span><b>${esc(c.name)}</b><small>ID: ${esc(c.id)}</small></span><strong>${c.order||i+1}</strong><span class="${c.enabled?'good':'danger'}">${c.enabled?'VISIBLE':'HIDDEN'}</span><button class="outline" onclick="categoryForm(${i})">Edit</button></div>`).join('')}</div></section>`}
function categoryForm(index=-1){const c=index>=0?data.categories[index]:{id:'',name:'',enabled:true,order:data.categories.length+1};openModal(`<div class="eyebrow">CATEGORY</div><h2>${index<0?'Add category':'Edit category'}</h2><div class="formGrid"><label>ID<input id="catId" value="${esc(c.id)}"></label><label>Name<input id="catName" value="${esc(c.name)}"></label><label>Display position<input id="catOrder" type="number" value="${c.order||1}"></label></div><label class="checkOnly"><input id="catEnabled" type="checkbox" ${c.enabled?'checked':''}> Visible on storefront</label><button class="gold full" onclick="saveCategory(${index})">Save category</button>`)}
function saveCategory(i){const c={id:document.getElementById('catId').value.trim(),name:document.getElementById('catName').value.trim(),order:Number(document.getElementById('catOrder').value||1),enabled:document.getElementById('catEnabled').checked};if(!c.id||!c.name){toast('Category ID and name are required');return}if(i<0)data.categories.push(c);else data.categories[i]=c;persist();closeModal();render()}
function homepagePage(){return `<section class="panel"><div class="panelHead"><div><h2>Homepage announcements</h2><p>Each slide has an explicit click action. The target is selected based on the action instead of entering a hidden URL target.</p></div><button class="gold" onclick="announcementForm()">+ Add announcement</button></div><div class="announcementAdmin">${data.announcements.sort((a,b)=>(a.order||0)-(b.order||0)).map((s,i)=>`<article><span class="typeTag">${esc(s.label||'ANNOUNCEMENT')}</span><h3>${esc(s.title||'')}</h3><p>${esc(s.text||'')}</p><small>Action: ${esc(s.actionType|| (s.productId?'Open product':s.comboId?'Open combo':'Shop'))}</small><div class="cardActions"><button class="outline" onclick="announcementForm(${i})">Edit</button></div></article>`).join('')}</div></section>`}
function announcementForm(index=-1){const s=index>=0?data.announcements[index]:{id:'',label:'',title:'',em:'',text:'',actionType:'product',actionTarget:'',active:true,order:data.announcements.length+1};openModal(`<div class="eyebrow">HOMEPAGE ANNOUNCEMENT</div><h2>${index<0?'Add announcement':'Edit announcement'}</h2><div class="formGrid"><label>Label<input id="aLabel" value="${esc(s.label)}"></label><label>Title<input id="aTitle" value="${esc(s.title)}"></label><label>Emphasis<input id="aEm" value="${esc(s.em)}"></label><label>Display position<input id="aOrder" type="number" value="${s.order||1}"></label><label class="fullLabel">Message<textarea id="aText" rows="3">${esc(s.text||'')}</textarea></label><label>Click action<select id="aAction" onchange="renderAnnouncementTarget()"><option value="product" ${s.actionType==='product'?'selected':''}>Open product</option><option value="combo" ${s.actionType==='combo'?'selected':''}>Open combo</option><option value="shop" ${s.actionType==='shop'?'selected':''}>Open Shop</option><option value="reviews" ${s.actionType==='reviews'?'selected':''}>Open Reviews</option><option value="url" ${s.actionType==='url'?'selected':''}>Open external link</option></select></label><div id="aTargetWrap"></div></div><label class="checkOnly"><input id="aActive" type="checkbox" ${s.active?'checked':''}> Active</label><button class="gold full" onclick="saveAnnouncement(${index})">Save announcement</button>`);window._announcementDraft=s;renderAnnouncementTarget()}
function renderAnnouncementTarget(){const type=document.getElementById('aAction')?.value, s=window._announcementDraft||{};let h='';if(type==='product')h=`<label>Product<select id="aTarget">${data.products.map(p=>`<option value="${p.id}" ${(s.productId||s.actionTarget)===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label>`;else if(type==='combo')h=`<label>Combo<select id="aTarget">${data.combos.map(c=>`<option value="${c.id}" ${(s.comboId||s.actionTarget)===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label>`;else if(type==='url')h=`<label>External URL<input id="aTarget" value="${esc(s.actionTarget||'')}" placeholder="https://..."></label>`;document.getElementById('aTargetWrap').innerHTML=h}
function saveAnnouncement(i){const type=document.getElementById('aAction').value,target=document.getElementById('aTarget')?.value||'';const s={id:document.getElementById('aId')?.value||('ann-'+Date.now().toString(36)),label:document.getElementById('aLabel').value.trim(),title:document.getElementById('aTitle').value.trim(),em:document.getElementById('aEm').value.trim(),text:document.getElementById('aText').value.trim(),actionType:type,actionTarget:target,productId:type==='product'?target:'',comboId:type==='combo'?target:'',active:document.getElementById('aActive').checked,order:Number(document.getElementById('aOrder').value||1)};if(i<0)data.announcements.push(s);else data.announcements[i]=s;persist();closeModal();render()}
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
  <div class="reviewAdmin">${rows.map((r,i)=>`<article><div><span class="typeTag">${esc(r.status.toUpperCase())}</span><span class="stars">${'★'.repeat(r.rating)}</span><h3>${esc(r.customer_name)}</h3><p>“${esc(r.review_text)}”</p><small>${r.product_id?'Product: '+esc(product(r.product_id)?.name||r.product_id)+' · ':''}${r.order_number?'Order: '+esc(r.order_number)+' · ':''}${new Date(r.created_at).toLocaleDateString('en-IN')}</small></div><div class="cardActions">${r.status!=='approved'?`<button class="gold" onclick="setReviewStatus('${r.id}','approved')">Approve</button>`:''}${r.status!=='rejected'?`<button class="outline dangerBtn" onclick="setReviewStatus('${r.id}','rejected')">Reject</button>`:''}${r.status!=='pending'?`<button class="outline" onclick="setReviewStatus('${r.id}','pending')">Move to pending</button>`:''}</div></article>`).join('')||'<div class="empty">No reviews in this tab.</div>'}</div>
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
function reviewForm(i=-1){const r=i>=0?data.reviews[i]:{source:'Google',name:'',rating:5,text:'',active:true,verifiedPurchase:false};openModal(`<div class="eyebrow">REVIEW</div><h2>${i<0?'Add Google review':'Edit review'}</h2><div class="formGrid"><label>Source<select id="rSource"><option value="Google" ${r.source==='Google'?'selected':''}>Google</option><option value="customer" ${r.source==='customer'?'selected':''}>Customer</option></select></label><label>Customer name<input id="rName" value="${esc(r.name)}"></label><label>Rating<select id="rRating">${[1,2,3,4,5].map(n=>`<option ${n===Number(r.rating)?'selected':''}>${n}</option>`).join('')}</select></label><label>Product (optional)<select id="rProduct"><option value="">General review</option>${data.products.map(p=>`<option value="${p.id}" ${r.productId===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label><label class="fullLabel">Review text<textarea id="rText" rows="5">${esc(r.text)}</textarea></label></div><label class="checkOnly"><input id="rActive" type="checkbox" ${r.active?'checked':''}> Published</label><label class="checkOnly"><input id="rVerified" type="checkbox" ${r.verifiedPurchase?'checked':''}> Verified purchase</label><button class="gold full" onclick="saveReview(${i})">Save review</button>`)}
function saveReview(i){const r={source:document.getElementById('rSource').value,name:document.getElementById('rName').value.trim(),rating:Number(document.getElementById('rRating').value),text:document.getElementById('rText').value.trim(),productId:document.getElementById('rProduct').value,active:document.getElementById('rActive').checked,verifiedPurchase:document.getElementById('rVerified').checked};if(!r.name||!r.text){toast('Name and review text are required');return}if(i<0)data.reviews.push(r);else data.reviews[i]=r;persist();closeModal();render()}
function toggleReview(i){data.reviews[i].active=!data.reviews[i].active;persist();render()}
function deleteReview(i){if(confirm('Delete this review?')){data.reviews.splice(i,1);persist();render()}}
function settingsPage(){
 const s=data.store;
 return `<section class="settingsGrid">
 <article class="settingCard"><span class="typeTag">STORE OPERATIONS</span><h2>Ordering</h2>
 <label class="toggleRow"><span>Vacation mode<small>Pause ordering without changing product stock.</small></span><input id="setVacation" type="checkbox" ${s.vacationMode?'checked':''}></label>
 <label>Vacation message<textarea id="setVacationMsg" rows="3">${esc(s.vacationMessage||'')}</textarea></label>
 <div class="two"><label>Delivery minimum days<input id="setMin" type="number" min="1" value="${s.deliveryMinDays||4}"></label><label>Delivery maximum days<input id="setMax" type="number" min="1" value="${s.deliveryMaxDays||8}"></label></div>
 <div class="two"><label>Free shipping above<input id="setFree" type="number" value="${s.freeShippingThreshold||599}"></label><label>Shipping charge<input id="setShip" type="number" value="${s.shippingFlat||49}"></label></div>
 <button class="gold full" onclick="saveStoreOperations()">Save operations</button></article>
 <article class="settingCard"><span class="typeTag">PAYMENT</span><h2>Payment methods</h2>
 <label class="toggleRow"><span>UPI QR<small>Primary payment method.</small></span><input id="setUpi" type="checkbox" ${s.upiEnabled!==false?'checked':''}></label>
 <label class="toggleRow"><span>Cash on Delivery<small>Show/hide COD at checkout.</small></span><input id="setCod" type="checkbox" ${s.codEnabled?'checked':''}></label>
 <label class="toggleRow"><span>Razorpay<small>Optional future gateway.</small></span><input id="setRazor" type="checkbox" ${s.razorpayEnabled?'checked':''}></label>
 <label>UPI ID<input id="setUpiId" value="${esc(s.upiId||'')}" placeholder="yourupi@bank"></label><label>UPI display name<input id="setUpiName" value="${esc(s.upiName||'Jayvi Foods')}"></label>
 <label>UPI QR filename<input id="setQr" value="${esc(s.upiQrImage||'')}" placeholder="images/payments/jayvi-upi.webp"></label>
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
function saveStoreOperations(){data.store.vacationMode=document.getElementById('setVacation').checked;data.store.vacationMessage=document.getElementById('setVacationMsg').value.trim();data.store.deliveryMinDays=Number(document.getElementById('setMin').value||4);data.store.deliveryMaxDays=Number(document.getElementById('setMax').value||8);data.store.freeShippingThreshold=Number(document.getElementById('setFree').value||599);data.store.shippingFlat=Number(document.getElementById('setShip').value||49);persist();render()}
function savePayments(){data.store.upiEnabled=document.getElementById('setUpi').checked;data.store.codEnabled=document.getElementById('setCod').checked;data.store.razorpayEnabled=document.getElementById('setRazor').checked;data.store.upiId=document.getElementById('setUpiId').value.trim();data.store.upiName=document.getElementById('setUpiName').value.trim();data.store.upiQrImage=document.getElementById('setQr').value.trim();data.store.razorpayKeyId=document.getElementById('setRzp').value.trim();persist();render()}
function saveAuth(){data.store.otpEnabled=document.getElementById('setOtp').checked;data.store.otpProvider=document.getElementById('setOtpProvider').value.trim()||'Not configured';persist();render()}
function saveLocationSettings(){data.store.googleMapsApiKey=document.getElementById('setMaps').value.trim();data.store.googleReviewsUrl=document.getElementById('setGoogleReviews').value.trim();persist();render()}
function saveContactSettings(){data.store.whatsapp=document.getElementById('setWhatsApp').value.trim();data.store.instagram=document.getElementById('setInstagram').value.trim();persist();render()}
function openModal(html){document.getElementById('modalBody').innerHTML=html;document.getElementById('modal').classList.add('open')}
function closeModal(){document.getElementById('modal').classList.remove('open')}
document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
requireAdminSession().then(ok=>{ if(ok) render(); });
/* Jayvi Foods V22 Admin polish */
(function(){
'use strict';
const oldAnn=window.announcementForm;
window.announcementForm=function(index=-1){
 const s=index>=0?data.announcements[index]:{id:'',label:'',title:'',em:'',text:'',image:'',showPrice:true,actionType:'product',actionTarget:'',active:true,order:data.announcements.length+1};
 openModal(`<div class="eyebrow">HOMEPAGE ANNOUNCEMENT</div><h2>${index<0?'Add announcement':'Edit announcement'}</h2><div class="formGrid"><label>Label<input id="aLabel" value="${esc(s.label||'')}"></label><label>Title<input id="aTitle" value="${esc(s.title||'')}"></label><label>Emphasis<input id="aEm" value="${esc(s.em||'')}"></label><label>Display position<input id="aOrder" type="number" value="${s.order||1}"></label><label class="fullLabel">Message<textarea id="aText" rows="3">${esc(s.text||'')}</textarea></label><label class="fullLabel">Announcement image path / URL<input id="aImage" value="${esc(s.image||'')}" placeholder="images/hero/announcement.webp or https://..."><small class="v22-admin-help">Optional. If empty, the linked product/combo image is used.</small></label><label>Click action<select id="aAction" onchange="renderAnnouncementTarget()"><option value="product" ${s.actionType==='product'?'selected':''}>Open product</option><option value="combo" ${s.actionType==='combo'?'selected':''}>Open combo</option><option value="shop" ${s.actionType==='shop'?'selected':''}>Open Shop</option><option value="reviews" ${s.actionType==='reviews'?'selected':''}>Open Reviews</option><option value="url" ${s.actionType==='url'?'selected':''}>Open external link</option></select></label><label class="checkOnly"><input id="aShowPrice" type="checkbox" ${s.showPrice!==false?'checked':''}> Show price badge</label><div id="aTargetWrap"></div></div><label class="checkOnly"><input id="aActive" type="checkbox" ${s.active!==false?'checked':''}> Active</label><button class="gold full" onclick="saveAnnouncement(${index})">Save announcement</button>`);
 window._announcementDraft=s;renderAnnouncementTarget();
};
window.saveAnnouncement=function(i){const type=document.getElementById('aAction').value,target=document.getElementById('aTarget')?.value||'';const s={id:data.announcements[i]?.id||('ann-'+Date.now().toString(36)),label:document.getElementById('aLabel').value.trim(),title:document.getElementById('aTitle').value.trim(),em:document.getElementById('aEm').value.trim(),text:document.getElementById('aText').value.trim(),image:document.getElementById('aImage').value.trim(),showPrice:document.getElementById('aShowPrice').checked,actionType:type,actionTarget:target,productId:type==='product'?target:'',comboId:type==='combo'?target:'',active:document.getElementById('aActive').checked,order:Number(document.getElementById('aOrder').value||1)};if(i<0)data.announcements.push(s);else data.announcements[i]=s;persist();closeModal();render()};
function polish(){document.querySelectorAll('.cardActions button').forEach(b=>b.classList.add('v22-action'));document.querySelectorAll('.reviewAdmin article,.announcementAdmin article').forEach(x=>x.classList.add('v22-admin-card'))}
new MutationObserver(polish).observe(document.getElementById('app'),{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',polish);else polish();
})();
