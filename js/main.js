// ============================================
// DRIPCULT — main.js
// Theme toggle + Cart + Rendering + Animations
// ============================================

// ⚠️ APNA WHATSAPP NUMBER YAHA DAALO (country code ke saath, bina + ke)
const WHATSAPP_NUMBER = "919999999999";

const fmt = (n) => "\u20b9" + n.toLocaleString("en-IN");
const imgSrc = (name) => `images/products/${name}.jpg`;
const offPct = (p) => Math.round((1 - p.price / p.mrp) * 100);

/* ==================== THEME TOGGLE ==================== */
const rootEl = document.documentElement;

function updateThemeIcons() {
  const dark = rootEl.getAttribute("data-theme") === "dark";
  document.querySelectorAll("[data-theme-toggle] .t-icon").forEach((i) => {
    i.textContent = dark ? "\u2600\ufe0f" : "\ud83c\udf19";
  });
}

document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const next = rootEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
    rootEl.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeIcons();
  });
});
updateThemeIcons();

/* ==================== MOBILE MENU ==================== */
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    burger.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      burger.classList.remove("open");
      document.body.style.overflow = "";
    })
  );
}

/* ==================== CART DRAWER (injected) ==================== */
document.body.insertAdjacentHTML(
  "beforeend",
  `
  <div class="cart-overlay" id="cartOverlay"></div>
  <aside class="cart-drawer" id="cartDrawer" aria-label="Shopping cart">
    <div class="cart-head">
      <h3>Your Cart</h3>
      <button class="icon-btn" id="cartClose" aria-label="Close cart">✕</button>
    </div>
    <div class="cart-items" id="cartItems"></div>
    <div class="cart-foot">
      <div class="cart-total"><span>Total</span><span id="cartTotal">\u20b90</span></div>
      <button class="btn btn-wa" id="checkoutBtn">Checkout on WhatsApp</button>
    </div>
  </aside>
  <a class="wa-float" id="waFloat" href="#" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">💬</a>
  `
);

document.getElementById("waFloat").href =
  `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent("Hi DRIPCULT! I have a question 👋");

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCart(open) {
  cartDrawer.classList.toggle("open", open);
  cartOverlay.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
}
document.getElementById("cartBtn")?.addEventListener("click", () => openCart(true));
document.getElementById("cartClose").addEventListener("click", () => openCart(false));
cartOverlay.addEventListener("click", () => openCart(false));

/* ==================== CART LOGIC ==================== */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("dripcult_cart") || "[]"); } catch (e) { cart = []; }

function saveCart() {
  localStorage.setItem("dripcult_cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id, size) {
  const found = cart.find((c) => c.id === id && c.size === size);
  if (found) found.qty += 1;
  else cart.push({ id, size, qty: 1 });
  saveCart();
  openCart(true);
}

function renderCart() {
  const wrap = document.getElementById("cartItems");
  const countEl = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotal");
  const count = cart.reduce((s, c) => s + c.qty, 0);
  if (countEl) countEl.textContent = count;

  if (!cart.length) {
    wrap.innerHTML = `<p class="cart-empty">Cart khali hai 👀<br>Kuch heat add karo!</p>`;
    totalEl.textContent = fmt(0);
    return;
  }

  let total = 0;
  wrap.innerHTML = cart
    .map((c, i) => {
      const p = PRODUCTS.find((x) => x.id === c.id);
      if (!p) return "";
      total += p.price * c.qty;
      return `
      <div class="cart-item">
        <div class="ci-img ph-wrap" data-label="">
          <img src="${imgSrc(p.images[0])}" alt="${p.name}" onerror="imgFail(this)">
        </div>
        <div>
          <h4>${p.name}</h4>
          <p class="ci-meta">Size: ${c.size} · ${fmt(p.price)}</p>
          <div class="qty-row">
            <button class="qty-btn" data-qty="-1" data-i="${i}" aria-label="Decrease">−</button>
            <span>${c.qty}</span>
            <button class="qty-btn" data-qty="1" data-i="${i}" aria-label="Increase">+</button>
          </div>
        </div>
        <button class="ci-remove" data-remove="${i}">Remove</button>
      </div>`;
    })
    .join("");
  totalEl.textContent = fmt(total);

  wrap.querySelectorAll("[data-qty]").forEach((b) =>
    b.addEventListener("click", () => {
      const i = +b.dataset.i;
      cart[i].qty += +b.dataset.qty;
      if (cart[i].qty <= 0) cart.splice(i, 1);
      saveCart();
    })
  );
  wrap.querySelectorAll("[data-remove]").forEach((b) =>
    b.addEventListener("click", () => {
      cart.splice(+b.dataset.remove, 1);
      saveCart();
    })
  );
}

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return;
  let total = 0;
  const lines = cart.map((c) => {
    const p = PRODUCTS.find((x) => x.id === c.id);
    total += p.price * c.qty;
    return `• ${p.name} (${c.size}) x${c.qty} — ${fmt(p.price * c.qty)}`;
  });
  const msg = `Hi DRIPCULT! Mera order:\n\n${lines.join("\n")}\n\nTotal: ${fmt(total)}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
});

renderCart();

/* ==================== PRODUCT CARD ==================== */
function productCard(p) {
  return `
  <a class="card" href="product.html?id=${p.id}" data-images="${p.images.join(',')}">
    <div class="card-img ph-wrap" data-label="${p.images[0]}.jpg">
      <img src="${imgSrc(p.images[0])}" alt="${p.name}" loading="lazy" onerror="imgFail(this)">
      <span class="tag">${p.tag}</span>
    </div>
    <div class="card-info">
      <h4>${p.name}</h4>
      <div class="price-row">
        <span class="price">${fmt(p.price)}</span>
        <s class="mrp">${fmt(p.mrp)}</s>
        <span class="off">${offPct(p)}% off</span>
      </div>
    </div>
  </a>`;
}

/* Hover par product ki 4 images auto-cycle hoti hai (1 image / second) */
function attachCardCycler(scope) {
  scope.querySelectorAll(".card[data-images]").forEach((card) => {
    const img = card.querySelector(".card-img img");
    const wrap = card.querySelector(".card-img");
    if (!img || !wrap) return;
    const names = card.dataset.images.split(",");
    if (names.length < 2) return;
    let i = 0;
    let timer = null;
    const show = (n) => {
      i = n;
      img.style.display = "";
      wrap.classList.remove("ph");
      wrap.dataset.label = names[i] + ".jpg";
      img.src = imgSrc(names[i]);
    };
    card.addEventListener("mouseenter", () => {
      // Baaki images preload, taki swap smooth ho
      names.forEach((nm) => { const pre = new Image(); pre.src = imgSrc(nm); });
      clearInterval(timer);
      timer = setInterval(() => show((i + 1) % names.length), 1000);
    });
    card.addEventListener("mouseleave", () => {
      clearInterval(timer);
      timer = null;
      show(0);
    });
  });
}

/* ==================== HOME: FEATURED ROW ==================== */
const featuredRow = document.getElementById("featuredRow");
if (featuredRow) {
  featuredRow.innerHTML = PRODUCTS.map(productCard).join("");
  attachCardCycler(featuredRow);
}

/* ==================== SHOP PAGE ==================== */
const shopGrid = document.getElementById("shopGrid");
if (shopGrid) {
  const renderGrid = (filter) => {
    const list = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
    shopGrid.innerHTML = list.map(productCard).join("") || `<p class="cart-empty">No products yet.</p>`;
    attachCardCycler(shopGrid);
  };

  const params = new URLSearchParams(location.search);
  let active = params.get("cat") || "all";
  const btns = document.querySelectorAll(".filter-btn");
  const validCats = [...btns].map((b) => b.dataset.filter);
  if (!validCats.includes(active)) active = "all";

  btns.forEach((b) => {
    b.classList.toggle("active", b.dataset.filter === active);
    b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      renderGrid(b.dataset.filter);
    });
  });
  renderGrid(active);
}

/* ==================== PRODUCT PAGE ==================== */
const productPage = document.getElementById("productPage");
if (productPage) {
  const id = +(new URLSearchParams(location.search).get("id") || 1);
  const p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];
  let selectedSize = p.sizes[1] || p.sizes[0];

  document.title = `${p.name} — DRIPCULT`;
  document.getElementById("crumbName").textContent = p.name;
  document.getElementById("pName").textContent = p.name;
  document.getElementById("pPrice").textContent = fmt(p.price);
  document.getElementById("pMrp").textContent = fmt(p.mrp);
  document.getElementById("pOff").textContent = offPct(p) + "% off";
  document.getElementById("pDesc").textContent = p.desc;
  document.getElementById("sPrice").textContent = fmt(p.price);
  document.getElementById("sMrp").textContent = fmt(p.mrp);

  // Gallery
  const mainImg = document.getElementById("mainImg");
  const mainWrap = document.getElementById("galleryMain");
  const thumbs = document.getElementById("thumbs");

  function setMain(name) {
    mainWrap.classList.remove("ph");
    mainWrap.dataset.label = name + ".jpg";
    mainImg.style.display = "";
    mainImg.src = imgSrc(name);
    mainImg.onerror = () => imgFail(mainImg);
    if (window.gsap) gsap.fromTo(mainImg, { opacity: 0.4, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.4 });
  }

  thumbs.innerHTML = p.images
    .map(
      (name, i) => `
    <button class="thumb ph-wrap${i === 0 ? " active" : ""}" data-name="${name}" data-label="${name}" aria-label="View image ${i + 1}">
      <img src="${imgSrc(name)}" alt="" loading="lazy" onerror="imgFail(this)">
    </button>`
    )
    .join("");

  thumbs.querySelectorAll(".thumb").forEach((t) =>
    t.addEventListener("click", () => {
      thumbs.querySelectorAll(".thumb").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      setMain(t.dataset.name);
    })
  );
  setMain(p.images[0]);

  // Sizes
  const sizesEl = document.getElementById("sizes");
  sizesEl.innerHTML = p.sizes
    .map((s) => `<button class="size-btn${s === selectedSize ? " active" : ""}" data-size="${s}">${s}</button>`)
    .join("");
  sizesEl.querySelectorAll(".size-btn").forEach((b) =>
    b.addEventListener("click", () => {
      sizesEl.querySelectorAll(".size-btn").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      selectedSize = b.dataset.size;
    })
  );

  // Actions
  document.getElementById("addBtn").addEventListener("click", () => addToCart(p.id, selectedSize));
  document.getElementById("stickyAdd").addEventListener("click", () => addToCart(p.id, selectedSize));
  document.getElementById("waBtn").href =
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent(`Hi DRIPCULT! I want to order: ${p.name} (Size ${selectedSize}) — ${fmt(p.price)}`);

  // Related products
  const related = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 6);
  const relatedRow = document.getElementById("relatedRow");
  relatedRow.innerHTML = related.map(productCard).join("");
  attachCardCycler(relatedRow);
}

/* ==================== ANIMATIONS (sirf hero entrance — scroll simple/native hai) ==================== */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && window.gsap && document.querySelector(".hero-title")) {
  gsap.from(".hero-title span", { yPercent: 110, opacity: 0, duration: 1, stagger: 0.12, ease: "power4.out" });
  gsap.from(".hero-sub, .hero-cta", { y: 28, opacity: 0, duration: 0.8, delay: 0.45, stagger: 0.14, ease: "power3.out" });
  gsap.from(".hero-img", { x: 60, opacity: 0, duration: 1.1, delay: 0.3, ease: "power3.out" });
}
