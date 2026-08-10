/* Jayvi Foods V29.0 — one small, event-driven frontend layer */
(() => {
  "use strict";

  const VERSION = "29.0";
  const CART_KEY = "jayvi_cart_v29";
  const ORDER_KEY = "jayvi_orders_v29";

  const products = [
    {
      id:"peanut",
      name:"Peanut Chutney",
      category:"Chutney Powders",
      desc:"Rich, nutty and comforting.",
      rating:"4.8 · 18 reviews",
      badge:"BESTSELLER",
      variants:[
        {size:"200g",price:155,mrp:199},
        {size:"400g",price:249,mrp:299}
      ],
      images:[
        "images/Peanut-Chutney.webp",
        "images/Peanut-Chutney-2.webp",
        "images/Peanut-Chutney-3.webp",
        "images/Peanut-Chutney-4.webp"
      ]
    },
    {
      id:"flaxseed",
      name:"Flaxseed Chutney",
      category:"Chutney Powders",
      desc:"A distinctive traditional flavour.",
      rating:"4.8 · 12 reviews",
      badge:"BESTSELLER",
      variants:[
        {size:"200g",price:155,mrp:199},
        {size:"400g",price:249,mrp:299}
      ],
      images:[
        "images/Flaxseed-Chutney.webp",
        "images/Flaxseed-Chutney-2.webp",
        "images/Flaxseed-Chutney-3.webp",
        "images/Flaxseed-Chutney-4.webp"
      ]
    },
    {
      id:"pudi",
      name:"Idli Dosa Pudi",
      category:"Breakfast",
      desc:"The everyday breakfast companion.",
      rating:"4.8 · 10 reviews",
      badge:"POPULAR",
      variants:[
        {size:"200g",price:155,mrp:199},
        {size:"400g",price:249,mrp:299}
      ],
      images:[
        "images/Idli-Dosa-Pudi.webp",
        "images/Idli-Dosa-Pudi-2.webp",
        "images/Idli-Dosa-Pudi-3.webp",
        "images/Idli-Dosa-Pudi-4.webp"
      ]
    },
    {
      id:"combo",
      name:"Traditional Duo",
      category:"Combo",
      desc:"Peanut + Flaxseed together at ₹289.",
      rating:"4.9 · customer favourite",
      badge:"COMBO",
      variants:[{size:"2 × 200g",price:289,mrp:398}],
      images:[
        "images/Traditional-Duo.webp",
        "images/Traditional-Duo-2.webp",
        "images/Traditional-Duo-3.webp",
        "images/Traditional-Duo-4.webp"
      ]
    }
  ];

  let cart = loadJSON(CART_KEY, []);
  let selectedVariants = Object.fromEntries(products.map(p => [p.id, 0]));
  let activeProduct = null;

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch (_) { return fallback; }
  }
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }
  function money(n){ return `₹${Number(n).toLocaleString("en-IN")}`; }
  function escapeHTML(v){
    return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  function imageHTML(src, alt){
    return `<img src="${src}" alt="${escapeHTML(alt)}" loading="lazy"
      onerror="this.dataset.failed='1';this.closest('.media-item').classList.add('media-fallback')">`;
  }

  function mediaHTML(product, detail=false){
    const items = product.images.map((src,i) =>
      `<div class="media-item">${imageHTML(src, product.name + " image " + (i+1))}</div>`
    ).join("");
    return `<div class="${detail ? "detail-gallery" : "product-media"}">
      <div class="media-track">${items}</div>
      <span class="media-count">1 / ${product.images.length}</span>
    </div>`;
  }

  function renderProducts(){
    const q = ($("#searchInput")?.value || "").trim().toLowerCase();
    const sort = $("#sortSelect")?.value || "popular";
    let list = products.filter(p => `${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(q));

    if(sort === "price-low") list.sort((a,b)=>a.variants[0].price-b.variants[0].price);
    if(sort === "price-high") list.sort((a,b)=>b.variants[0].price-a.variants[0].price);
    if(sort === "name") list.sort((a,b)=>a.name.localeCompare(b.name));

    $("#productGrid").innerHTML = list.length ? list.map(cardHTML).join("") :
      `<div class="empty" style="grid-column:1/-1;color:#6f655d"><strong>No favourites found</strong>Try another search.</div>`;
    bindProductEvents();
  }

  function cardHTML(p){
    const vi = selectedVariants[p.id] || 0;
    const v = p.variants[vi];
    const save = v.mrp - v.price;
    return `<article class="product-card" data-id="${p.id}">
      ${mediaHTML(p)}
      <div class="product-body">
        <span class="badge">${p.badge}</span>
        <div class="eyebrow">${p.category}</div>
        <h3>${escapeHTML(p.name)}</h3>
        <div class="rating">★★★★★ <span style="color:#7b7169">${escapeHTML(p.rating)}</span></div>
        <p class="desc">${escapeHTML(p.desc)}</p>
        <div class="variants">
          ${p.variants.map((x,i)=>`<button class="variant ${i===vi?"active":""}" data-variant="${i}">${escapeHTML(x.size)}</button>`).join("")}
        </div>
        <div class="price-row"><strong class="price">${money(v.price)}</strong><span class="mrp">${money(v.mrp)}</span><span class="saving">Save ${money(save)}</span></div>
        <div class="product-actions">
          <button class="add" data-action="add">Add to cart</button>
          <button class="buy" data-action="buy">Buy now</button>
        </div>
      </div>
    </article>`;
  }

  function bindProductEvents(){
    $$(".product-card").forEach(card => {
      const id = card.dataset.id, p = products.find(x=>x.id===id);
      card.querySelectorAll(".variant").forEach(btn => btn.addEventListener("click", e => {
        selectedVariants[id] = Number(e.currentTarget.dataset.variant);
        renderProducts();
      }));
      card.querySelector('[data-action="add"]').addEventListener("click", () => addToCart(p, selectedVariants[id] || 0));
      card.querySelector('[data-action="buy"]').addEventListener("click", () => {
        addToCart(p, selectedVariants[id] || 0);
        openCart();
      });
      card.querySelector(".product-media").addEventListener("click", () => openProduct(p));
      setupGallery(card.querySelector(".media-track"), card.querySelector(".media-count"));
    });
  }

  function setupGallery(track, counter){
    if(!track || !counter) return;
    const update = () => {
      const width = track.clientWidth || 1;
      const index = Math.min(track.children.length, Math.max(1, Math.round(track.scrollLeft / width) + 1));
      counter.textContent = `${index} / ${track.children.length}`;
    };
    track.addEventListener("scroll", update, {passive:true});
    update();
  }

  function addToCart(p, vi){
    const variant = p.variants[vi];
    const key = `${p.id}:${variant.size}`;
    const found = cart.find(x=>x.key===key);
    if(found) found.qty += 1;
    else cart.push({key,id:p.id,size:variant.size,price:variant.price,mrp:variant.mrp,name:p.name,qty:1,image:p.images[0]});
    saveJSON(CART_KEY,cart); renderCart(); updateCartCount();
    openCart();
  }

  function updateCartCount(){
    $("#cartCount").textContent = cart.reduce((s,x)=>s+x.qty,0);
  }

  function renderCart(){
    const body = $("#cartBody");
    if(!cart.length){
      body.innerHTML = `<div class="empty"><div style="font-size:45px;margin-bottom:15px">▣</div><strong>Your bag is empty</strong><span>Add a Jayvi favourite to get started.</span></div>`;
    } else {
      body.innerHTML = cart.map((x,i)=>`<div class="cart-line">
        <img src="${x.image}" alt="${escapeHTML(x.name)}">
        <div><h4>${escapeHTML(x.name)}</h4><p>${escapeHTML(x.size)} · ${money(x.price)}</p>
          <div class="qty"><button data-i="${i}" data-q="-1">−</button><span>${x.qty}</span><button data-i="${i}" data-q="1">+</button></div>
        </div><strong>${money(x.price*x.qty)}</strong>
      </div>`).join("");
      $$(".qty button").forEach(b=>b.addEventListener("click",()=>{
        const i=Number(b.dataset.i); cart[i].qty += Number(b.dataset.q);
        if(cart[i].qty<=0) cart.splice(i,1);
        saveJSON(CART_KEY,cart); renderCart(); updateCartCount();
      }));
    }
    $("#cartTotal").textContent = money(cart.reduce((s,x)=>s+x.price*x.qty,0));
    $("#checkoutBtn").disabled = !cart.length;
    $("#checkoutBtn").style.opacity = cart.length ? "1" : ".55";
  }

  function openCart(){
    $("#cartDrawer").classList.add("open");
    $("#cartDrawer").setAttribute("aria-hidden","false");
    $("#overlay").classList.add("open");
    document.body.classList.add("locked");
  }
  function closeCart(){
    $("#cartDrawer").classList.remove("open");
    $("#cartDrawer").setAttribute("aria-hidden","true");
    if(!$("#productDialog").open && !$("#checkoutDialog").open) $("#overlay").classList.remove("open");
    if(!$("#productDialog").open && !$("#checkoutDialog").open) document.body.classList.remove("locked");
  }

  function openProduct(p){
    activeProduct = p;
    const vi = selectedVariants[p.id] || 0, v = p.variants[vi];
    $("#productDialogBody").innerHTML = `<div class="product-detail">
      ${mediaHTML(p,true)}
      <div class="detail-info">
        <p class="eyebrow">${p.category}</p><h2>${escapeHTML(p.name)}</h2>
        <div class="rating">★★★★★ <span style="color:#7b7169">${escapeHTML(p.rating)}</span></div>
        <p class="desc">${escapeHTML(p.desc)}</p>
        <div class="variants">${p.variants.map((x,i)=>`<button class="variant ${i===vi?"active":""}" data-detail-variant="${i}">${escapeHTML(x.size)}</button>`).join("")}</div>
        <div class="price-row"><strong class="price">${money(v.price)}</strong><span class="mrp">${money(v.mrp)}</span><span class="saving">Save ${money(v.mrp-v.price)}</span></div>
        <div class="product-actions"><button id="detailAdd">Add to cart</button><button class="buy" id="detailBuy">Buy now</button></div>
      </div>
    </div>`;
    const d=$("#productDialog");
    d.showModal();
    $("#overlay").classList.add("open"); document.body.classList.add("locked");
    setupGallery(d.querySelector(".media-track"),d.querySelector(".media-count"));
    $$("#productDialog .variant").forEach(b=>b.addEventListener("click",()=>{selectedVariants[p.id]=Number(b.dataset.detailVariant);openProduct(p)}));
    $("#detailAdd").addEventListener("click",()=>addToCart(p,selectedVariants[p.id]||0));
    $("#detailBuy").addEventListener("click",()=>{addToCart(p,selectedVariants[p.id]||0);d.close();openCart()});
  }

  function closeDialogs(){
    [$("#productDialog"),$("#checkoutDialog"),$("#successDialog")].forEach(d=>{if(d.open)d.close()});
    if(!$("#cartDrawer").classList.contains("open")){$("#overlay").classList.remove("open");document.body.classList.remove("locked")}
  }

  function init(){
    renderProducts(); renderCart(); updateCartCount();

    $("#searchInput").addEventListener("input",renderProducts);
    $("#sortSelect").addEventListener("change",renderProducts);
    $("#cartBtn").addEventListener("click",openCart);
    $("#checkoutBtn").addEventListener("click",()=>{
      if(!cart.length)return;
      $("#checkoutDialog").showModal(); $("#overlay").classList.add("open"); document.body.classList.add("locked");
    });

    $("#menuBtn").addEventListener("click",()=>{
      const menu=$("#mobileMenu"), open=menu.classList.toggle("open");
      $("#menuBtn").setAttribute("aria-expanded",String(open)); menu.setAttribute("aria-hidden",String(!open));
    });
    $$("#mobileMenu a").forEach(a=>a.addEventListener("click",()=>$("#mobileMenu").classList.remove("open")));

    $("#accountBtn").addEventListener("click",()=>location.href="#story");
    $("#searchBtn").addEventListener("click",()=>$("#searchInput").focus());

    $("#overlay").addEventListener("click",()=>{closeCart();closeDialogs()});
    $$(".close-btn").forEach(b=>b.addEventListener("click",closeCart));
    $("#productDialogClose").addEventListener("click",()=>{$("#productDialog").close();closeDialogs()});
    $("#checkoutClose").addEventListener("click",()=>{$("#checkoutDialog").close();closeDialogs()});
    $("#successClose").addEventListener("click",()=>{$("#successDialog").close();closeDialogs();location.hash="#products"});

    $("#verifyPin").addEventListener("click",()=>{
      const pin=$('input[name="pincode"]').value.trim();
      $("#pinMessage").textContent = /^\d{6}$/.test(pin) ? "Pincode looks good." : "Please enter a valid 6-digit pincode.";
    });

    $("#checkoutForm").addEventListener("submit",e=>{
      e.preventDefault();
      const fd=new FormData(e.currentTarget);
      const orderId=`JF-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${String(Date.now()).slice(-4)}`;
      const order={orderId,createdAt:new Date().toISOString(),customer:Object.fromEntries(fd.entries()),items:cart,total:cart.reduce((s,x)=>s+x.price*x.qty,0)};
      const orders=loadJSON(ORDER_KEY,[]);orders.push(order);saveJSON(ORDER_KEY,orders);
      cart=[];saveJSON(CART_KEY,cart);renderCart();updateCartCount();
      $("#checkoutDialog").close();$("#successDialog").showModal();
      $("#orderMessage").textContent=`Order ${orderId} has been saved successfully on this device.`;
      e.currentTarget.reset();
    });

    document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();closeDialogs()}});
  }

  document.addEventListener("DOMContentLoaded",init);
})();
