// ============================================
// DRIPCULT — main.js
// Theme toggle + Cart + Rendering + Animations
// ============================================

// ⚠️ APNA WHATSAPP NUMBER YAHA DAALO (country code ke saath, bina + ke)
const WHATSAPP_NUMBER = "919999999999";

// localStorage can throw (private mode, disabled cookies, full quota).
// A throw used to kill the theme toggle and cart saves outright, so all
// storage access goes through these guards and degrades to in-memory state.
function storageGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable — keep in-memory state */ }
}

const fmt = (n) => "\u20b9" + n.toLocaleString("en-IN");
// Product names/tags come from products.js, which the shop owner edits by
// hand — a stray <, & or " in a name used to break the markup (or an
// attribute) wherever it was interpolated into innerHTML. Escape for both
// text and attribute contexts before interpolating.
const esc = (v) =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const imgSrc = (name) => `images/products/${name}.jpg`;
// A missing or zero MRP used to produce NaN/Infinity in the "% off" badge,
// and a price above MRP produced a negative discount. Clamp to a sane 0-100.
const offPct = (p) => {
  if (!p.mrp || p.mrp <= 0) return 0;
  return Math.max(0, Math.round((1 - p.price / p.mrp) * 100));
};

/* ==================== THEME TOGGLE ==================== */
const rootEl = document.documentElement;

function updateThemeIcons() {
  const dark = rootEl.getAttribute("data-theme") === "dark";
  document.querySelectorAll("[data-theme-toggle] .t-icon").forEach((i) => {
    i.textContent = dark ? "\u2600\ufe0f" : "\ud83c\udf19";
  });
  // The browser chrome colour stayed dark even in light mode; keep the
  // theme-color meta in sync so the address bar matches the theme.
  // (Pages without the meta tag simply skip this.)
  const themeMeta = document.querySelector("meta[name='theme-color']");
  if (themeMeta) themeMeta.setAttribute("content", dark ? "#0a0a0a" : "#f6f6f4");
}

document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const next = rootEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
    rootEl.setAttribute("data-theme", next);
    storageSet("theme", next);
    updateThemeIcons();
  });
});
updateThemeIcons();

/* ==================== MOBILE MENU ==================== */
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
// Single close path shared by the menu links and the Escape key, so the
// expanded state, label and body scroll lock can never drift apart.
function closeMobileMenu() {
  if (!burger || !mobileMenu) return;
  mobileMenu.classList.remove("open");
  burger.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-label", "Open menu");
  syncBodyScroll();
}
if (burger && mobileMenu) {
  // The button had no expanded state, so assistive tech could not tell
  // whether the menu was open. Set it here (no HTML change needed) and
  // keep it in sync on every open/close path.
  burger.setAttribute("aria-controls", "mobileMenu");
  burger.setAttribute("aria-expanded", "false");
  burger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    // The label used to stay "Open menu" while the menu was open.
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    syncBodyScroll();
  });
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", closeMobileMenu)
  );
}
// The menu hides itself via CSS past the mobile breakpoint, but the body
// scroll lock set on open stays until closeMobileMenu() runs — and on
// desktop the burger is gone, so the page would stay unscrollable.
// Close it properly when the viewport grows past the breakpoint.
const menuMedia = window.matchMedia("(min-width: 961px)");
const closeMenuOnDesktop = (e) => { if (e.matches) closeMobileMenu(); };
if (menuMedia.addEventListener) menuMedia.addEventListener("change", closeMenuOnDesktop);
else menuMedia.addListener(closeMenuOnDesktop);

/* ==================== CART DRAWER (injected) ==================== */
document.body.insertAdjacentHTML(
  "beforeend",
  `
  <div class="cart-overlay" id="cartOverlay"></div>
  <aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
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
// Both the cart drawer and the mobile menu lock body scroll while open,
// and either one closing used to clear the lock for both — so closing the
// menu while the cart was open left the page scrollable behind the drawer
// (and vice versa). Derive the lock from the two open states instead, so
// one layer closing never unlocks the other.
function syncBodyScroll() {
  const locked =
    (cartDrawer && cartDrawer.classList.contains("open")) ||
    (mobileMenu && mobileMenu.classList.contains("open"));
  document.body.style.overflow = locked ? "hidden" : "";
}
// The drawer starts closed but off-screen, so keep it out of the tab order
// until it is opened — otherwise keyboard users tab through hidden controls.
cartDrawer.inert = true;

function openCart(open) {
  cartDrawer.classList.toggle("open", open);
  cartOverlay.classList.toggle("open", open);
  cartDrawer.inert = !open;
  syncBodyScroll();
  // Move focus into the drawer when it opens and back to the cart button
  // when it closes, so keyboard users are never stranded behind it.
  // (inert is cleared first, otherwise the focus call is a no-op.)
  if (open) document.getElementById("cartClose").focus();
  else document.getElementById("cartBtn")?.focus();
}
document.getElementById("cartBtn")?.addEventListener("click", () => openCart(true));
document.getElementById("cartClose").addEventListener("click", () => openCart(false));
cartOverlay.addEventListener("click", () => openCart(false));
// Keyboard users had no way to dismiss the drawer except the close button.
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  // The cart sits above the menu, so one Escape used to dismiss both
  // layers at once. Close only the topmost open layer per press.
  if (cartDrawer.classList.contains("open")) { openCart(false); return; }
  // Keyboard users previously had no way to dismiss the mobile menu.
  if (mobileMenu && mobileMenu.classList.contains("open")) closeMobileMenu();
});
// The drawer is a modal (aria-modal="true") but Tab could still leave it
// and wander the page behind it — focus moved in on open, but nothing kept
// it there. Trap Tab inside the drawer while it is open.
cartDrawer.addEventListener("keydown", (e) => {
  if (e.key !== "Tab" || !cartDrawer.classList.contains("open")) return;
  const focusables = [...cartDrawer.querySelectorAll(
    "button, a[href], input, [tabindex]:not([tabindex='-1'])"
  )].filter((el) => !el.disabled);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* ==================== CART LOGIC ==================== */
let cart = [];
try {
  const stored = JSON.parse(storageGet("dripcult_cart") || "[]");
  // Valid JSON is not necessarily a cart: a hand-edited or foreign value
  // (object, string, number) would crash renderCart's reduce/find, so
  // only accept an array and fall back to an empty cart otherwise.
  // Also normalise quantities: a hand-edited value (0, negative, fraction,
  // non-number) would otherwise show a wrong count or a negative total.
  cart = Array.isArray(stored)
    ? stored
        .filter((c) => c && Number.isFinite(c.qty))
        .map((c) => ({ ...c, qty: Math.max(1, Math.floor(c.qty)) }))
    : [];
} catch (e) { cart = []; }

function saveCart() {
  storageSet("dripcult_cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id, size) {
  // Ignore unknown products/sizes instead of creating a dead cart entry
  // that renderCart and checkout would silently skip.
  const product = PRODUCTS.find((x) => x.id === id);
  if (!product || !Array.isArray(product.sizes) || !product.sizes.includes(size)) return;
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
  // The count changed silently for screen readers; announce it so the
  // add/remove feedback is not visual-only.
  if (countEl) countEl.setAttribute("aria-live", "polite");
  if (countEl) countEl.textContent = count;
  // An empty cart used to leave a live Checkout button that did nothing on
  // click. Disable it (CSS already dims :disabled buttons) and re-enable
  // it as soon as something is added.
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.disabled = !cart.length;

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
          <img src="${imgSrc(p.images[0])}" alt="${esc(p.name)}" onerror="imgFail(this)">
        </div>
        <div>
          <h4>${esc(p.name)}</h4>
          <p class="ci-meta">Size: ${c.size} · ${fmt(p.price)}</p>
          <div class="qty-row">
            <button class="qty-btn" data-qty="-1" data-i="${i}" aria-label="Decrease quantity of ${esc(p.name)}">−</button>
            <span>${c.qty}</span>
            <button class="qty-btn" data-qty="1" data-i="${i}" aria-label="Increase quantity of ${esc(p.name)}">+</button>
          </div>
        </div>
        <button class="ci-remove" data-remove="${i}" aria-label="Remove ${esc(p.name)} from cart">Remove</button>
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
  // Skip items whose product left the catalogue since they were added —
  // without this guard a stale cart entry crashed checkout on p.price.
  const lines = cart
    .map((c) => {
      const p = PRODUCTS.find((x) => x.id === c.id);
      if (!p) return null;
      total += p.price * c.qty;
      return `• ${p.name} (${c.size}) x${c.qty} — ${fmt(p.price * c.qty)}`;
    })
    .filter(Boolean);
  if (!lines.length) {
    // Every entry is stale (its product left the catalogue): drop them
    // so the next click is not another dead one, and re-render to show
    // the empty cart instead of leaving the dead entries in place.
    cart = cart.filter((c) => PRODUCTS.some((x) => x.id === c.id));
    saveCart();
    return;
  }
  const msg = `Hi DRIPCULT! Mera order:\n\n${lines.join("\n")}\n\nTotal: ${fmt(total)}`;
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  // window.open returns null when the popup is blocked — without a
  // fallback the click silently does nothing, so navigate in the same tab.
  const win = window.open(waUrl, "_blank");
  if (!win) window.location.href = waUrl;
});

renderCart();

/* ==================== PRODUCT CARD ==================== */
function productCard(p) {
  // Only show the struck-through MRP and "% off" when there is a real
  // discount — a missing MRP used to render as "₹NaN" with "0% off".
  const hasDiscount = p.mrp && p.mrp > p.price;
  const discountHtml = hasDiscount
    ? `<s class="mrp">${fmt(p.mrp)}</s><span class="off">${offPct(p)}% off</span>`
    : "";
  // A product with no images used to render "undefined.jpg" (broken img
  // plus a wrong placeholder label). Render the placeholder shell only.
  const images = Array.isArray(p.images) ? p.images : [];
  const imgHtml = images[0]
    ? `<img src="${imgSrc(images[0])}" alt="${esc(p.name)}" loading="lazy" onerror="imgFail(this)">`
    : "";
  return `
  <a class="card" href="product.html?id=${p.id}" data-images="${images.join(',')}">
    <div class="card-img ph-wrap" data-label="${images[0] ? images[0] + '.jpg' : ''}">
      ${imgHtml}
      <span class="tag">${esc(p.tag)}</span>
    </div>
    <div class="card-info">
      <h4>${esc(p.name)}</h4>
      <div class="price-row">
        <span class="price">${fmt(p.price)}</span>
        ${discountHtml}
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
      wrap.classList.remove("ph");
      wrap.dataset.label = names[i] + ".jpg";
      img.src = imgSrc(names[i]);
      // imgFail hides a broken image on error; restoring display here
      // would resurrect it on mouseleave (show(0)), so only unhide an
      // image that actually loaded. A fresh src is still loading
      // (complete === false), so it is unhidden optimistically and
      // imgFail re-hides it if the load errors.
      if (!img.complete || img.naturalWidth > 0) img.style.display = "";
    };
    card.addEventListener("mouseenter", () => {
      // Baaki images preload, taki swap smooth ho
      names.forEach((nm) => { const pre = new Image(); pre.src = imgSrc(nm); });
      clearInterval(timer);
      timer = setInterval(() => show((i + 1) % names.length), 1000);
      // Keep the id on the card so a grid re-render can stop it (see
      // clearCardCyclers): without this the interval keeps firing on a
      // detached card after a filter swap.
      card._cyclerTimer = timer;
    });
    card.addEventListener("mouseleave", () => {
      clearInterval(timer);
      timer = null;
      card._cyclerTimer = null;
      show(0);
    });
  });
}

/* A filter re-render replaces the grid's cards while a hovered card's
   cycler interval keeps firing on the detached node — invisible, but the
   interval runs forever. Clear every live cycler before swapping the grid. */
function clearCardCyclers(scope) {
  scope.querySelectorAll(".card").forEach((card) => {
    if (card._cyclerTimer) clearInterval(card._cyclerTimer);
    card._cyclerTimer = null;
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
    // "new" is a tag filter, not a category: show products tagged New Drop.
    const list =
      filter === "all" ? PRODUCTS
      : filter === "new" ? PRODUCTS.filter((p) => p.tag === "New Drop")
      : PRODUCTS.filter((p) => p.category === filter);
    clearCardCyclers(shopGrid);
    shopGrid.innerHTML = list.map(productCard).join("") || `<p class="cart-empty">No products yet.</p>`;
    attachCardCycler(shopGrid);
  };

  const params = new URLSearchParams(location.search);
  let active = params.get("cat") || "all";
  const btns = document.querySelectorAll(".filter-btn");
  const validCats = [...btns].map((b) => b.dataset.filter);
  if (!validCats.includes(active)) active = "all";

  // Keep aria-pressed in sync with the visual .active state so the
  // selected filter is announced, not just shown.
  const syncFilterPressed = () =>
    btns.forEach((x) => x.setAttribute("aria-pressed", String(x.classList.contains("active"))));
  btns.forEach((b) => {
    b.classList.toggle("active", b.dataset.filter === active);
    b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      syncFilterPressed();
      renderGrid(b.dataset.filter);
      // Keep the URL in sync so a refresh or a shared link re-opens the
      // same filter instead of silently falling back to "All".
      history.replaceState(null, "", `?cat=${b.dataset.filter}`);
    });
  });
  syncFilterPressed();
  renderGrid(active);
  // shop.html hard-codes "8 pieces" — it goes stale the moment a product
  // is added or removed, so derive the count from the catalogue instead.
  const pageSub = document.querySelector(".page-sub");
  if (pageSub) {
    pageSub.textContent = `${PRODUCTS.length} ${PRODUCTS.length === 1 ? "piece" : "pieces"}. Zero fillers. All heat.`;
  }
}

/* ==================== PRODUCT PAGE ==================== */
const productPage = document.getElementById("productPage");
if (productPage) {
  const id = +(new URLSearchParams(location.search).get("id") || 1);
  const p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];
  // A product with no sizes array used to throw on p.sizes[1] and kill the
  // whole product page (gallery, related products included). Treat a
  // missing/empty sizes list as "no size to pick" — addToCart already
  // rejects a null size, and the WhatsApp link falls back to a generic order.
  const sizes = Array.isArray(p.sizes) ? p.sizes : [];
  let selectedSize = sizes[1] || sizes[0] || null;

  document.title = `${p.name} — DRIPCULT`;
  document.getElementById("crumbName").textContent = p.name;
  document.getElementById("pName").textContent = p.name;
  // The gallery image had a generic "Product image" alt in HTML; give
  // screen readers the actual product name instead.
  document.getElementById("mainImg").alt = p.name;
  document.getElementById("pPrice").textContent = fmt(p.price);
  const hasDiscount = p.mrp && p.mrp > p.price;
  document.getElementById("pMrp").textContent = hasDiscount ? fmt(p.mrp) : "";
  document.getElementById("pOff").textContent = hasDiscount ? offPct(p) + "% off" : "";
  document.getElementById("pDesc").textContent = p.desc;
  // The "Fabric & Fit" line was hard-coded in HTML, so every product —
  // cargos, sneakers included — claimed "Model is wearing size M".
  // Use the product's own fit note, falling back to the old line.
  document.getElementById("pFit").textContent =
    p.fit || "Oversized fit. Model is wearing size M.";
  document.getElementById("sPrice").textContent = fmt(p.price);
  document.getElementById("sMrp").textContent = hasDiscount ? fmt(p.mrp) : "";

  // Gallery
  const mainImg = document.getElementById("mainImg");
  const mainWrap = document.getElementById("galleryMain");
  const thumbs = document.getElementById("thumbs");
  const galleryImages = Array.isArray(p.images) ? p.images : [];

  function setMain(name) {
    mainWrap.classList.remove("ph");
    mainWrap.dataset.label = name + ".jpg";
    mainImg.style.display = "";
    mainImg.src = imgSrc(name);
    mainImg.onerror = () => imgFail(mainImg);
    if (window.gsap) gsap.fromTo(mainImg, { opacity: 0.4, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.4 });
  }

  thumbs.innerHTML = galleryImages
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
  if (galleryImages.length) setMain(galleryImages[0]);

  // Sizes
  const sizesEl = document.getElementById("sizes");
  sizesEl.innerHTML = sizes
    .map((s) => `<button class="size-btn${s === selectedSize ? " active" : ""}" data-size="${s}" aria-pressed="${s === selectedSize}">${s}</button>`)
    .join("");
  // A product with no sizes used to leave two live "Add to Cart" buttons
  // that silently did nothing (addToCart rejects a null size). Disable
  // both and say why, instead of a dead click.
  if (!sizes.length) {
    sizesEl.innerHTML = `<p>Sizes not available for this product yet.</p>`;
    for (const id of ["addBtn", "stickyAdd"]) {
      const btn = document.getElementById(id);
      if (btn) {
        btn.disabled = true;
        btn.title = "No sizes available for this product";
      }
    }
  }
  sizesEl.querySelectorAll(".size-btn").forEach((b) =>
    b.addEventListener("click", () => {
      sizesEl.querySelectorAll(".size-btn").forEach((x) => {
        x.classList.remove("active");
        // The selected size was only visual; keep aria-pressed in sync so
        // screen readers announce which size is currently picked.
        x.setAttribute("aria-pressed", String(x === b));
      });
      b.classList.add("active");
      selectedSize = b.dataset.size;
      document.getElementById("waBtn").href = waOrderUrl(selectedSize);
    })
  );

  // Actions
  document.getElementById("addBtn").addEventListener("click", () => addToCart(p.id, selectedSize));
  document.getElementById("stickyAdd").addEventListener("click", () => addToCart(p.id, selectedSize));
  // The WhatsApp link embeds the size, so it must be rebuilt on every size
  // change — building it once here left it stuck on the default size.
  const waOrderUrl = (size) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent(
      size
        ? `Hi DRIPCULT! I want to order: ${p.name} (Size ${size}) — ${fmt(p.price)}`
        : `Hi DRIPCULT! I want to order: ${p.name} — ${fmt(p.price)}`
    );
  document.getElementById("waBtn").href = waOrderUrl(selectedSize);

  // Related products
  const related = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 6);
  const relatedRow = document.getElementById("relatedRow");
  relatedRow.innerHTML = related.map(productCard).join("");
  attachCardCycler(relatedRow);
}

/* ==================== NEWSLETTER ==================== */
// The footer form used to carry its submit logic inline in index.html
// (onsubmit="..."). Keeping it here means the behaviour lives with the
// rest of the site JS and the markup stays declarative. There is no
// backend yet, so confirm locally and never reload the page — a plain
// submit would wipe the cart drawer's state and scroll position.
document.querySelectorAll(".news-form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector("button");
    const input = form.querySelector("input");
    btn.textContent = "Subscribed ✓";
    btn.disabled = true;
    // The button text change is not announced to screen readers; add a
    // live-region confirmation so the success is spoken, not just seen.
    const note = document.createElement("p");
    note.setAttribute("role", "status");
    note.textContent = "Thanks — you're on the list.";
    form.appendChild(note);
    input.value = "";
  });
});

/* ==================== ANIMATIONS (sirf hero entrance — scroll simple/native hai) ==================== */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && window.gsap && document.querySelector(".hero-title")) {
  gsap.from(".hero-title span", { yPercent: 110, opacity: 0, duration: 1, stagger: 0.12, ease: "power4.out" });
  gsap.from(".hero-sub, .hero-cta", { y: 28, opacity: 0, duration: 0.8, delay: 0.45, stagger: 0.14, ease: "power3.out" });
  gsap.from(".hero-img", { x: 60, opacity: 0, duration: 1.1, delay: 0.3, ease: "power3.out" });
}
