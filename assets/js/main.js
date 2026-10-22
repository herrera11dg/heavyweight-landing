/* ============================================================
   HeavyWeight — scripts principales
   GSAP (parallax, tilt) + e-commerce (carrito, tallas, checkout)
   ============================================================ */

/* ---------- Catálogo (fallback local; el stock real viene de /api/products) ---------- */
const PRODUCTS = {
  'again': {
    name: 'Again', price: 35, gsm: 240,
    img: 'assets/img/again-back.webp',
    sizes: { S: 2, M: 3, L: 2, XL: 1 }
  },
  'discipline': {
    name: 'Discipline', price: 35, gsm: 240,
    img: 'assets/img/discipline-back.webp',
    sizes: { S: 2, M: 3, L: 2, XL: 1 }
  },
  'focus': {
    name: 'Focus', price: 35, gsm: 240,
    img: 'assets/img/focus-back.webp',
    sizes: { S: 2, M: 3, L: 2, XL: 1 },
    colors: [
      { id: 'dark', name: 'color_dark', back: 'assets/img/focus-back.webp', front: 'assets/img/focus-front.webp' },
      { id: 'vinotinto', name: 'color_wine', back: 'assets/img/focus-vinotinto-back.webp', front: 'assets/img/focus-vinotinto-front.webp' }
    ]
  },
  'one-more-rep': {
    name: 'One More Rep', price: 35, gsm: 240,
    img: 'assets/img/one-more-rep-back.webp',
    sizes: { S: 2, M: 3, L: 2, XL: 2 }
  },
  'toji-fushiguro': {
    name: 'Toji Fushiguro', price: 35, gsm: 240,
    img: 'assets/img/toji-fushiguro-back.webp',
    sizes: { S: 2, M: 3, L: 2, XL: 1 }
  }
};

/* ---------- Sincronizar stock con el servidor ---------- */
async function loadStock() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) return;
    const list = await res.json();
    list.forEach((p) => {
      if (PRODUCTS[p.id]) PRODUCTS[p.id].sizes = p.sizes;
    });
  } catch (e) {
    // Sin servidor (desarrollo local): se usa el stock embebido.
  }
}

/* ---------- Estado del carrito (localStorage) ---------- */
const CART_KEY = 'heavyweight_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }
}
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function cartCount(cart) { return cart.reduce((n, i) => n + i.qty, 0); }
function cartTotal(cart) { return cart.reduce((n, i) => n + i.qty * i.price, 0); }

function updateCartBadge() {
  const n = cartCount(getCart());
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = n;
}

/* ---------- Añadir al carrito ---------- */
function addToCart(productId, size, qty = 1, colorId) {
  const p = PRODUCTS[productId];
  const cart = getCart();
  const color = colorId && p.colors ? p.colors.find((c) => c.id === colorId) : null;
  const key = productId + '|' + size + '|' + (color ? color.id : '');
  const existing = cart.find((i) => i.key === key);
  if (existing) existing.qty += qty;
  else {
    cart.push({
      key,
      id: productId,
      name: p.name,
      price: p.price,
      size,
      qty,
      img: color ? color.back : p.img,
      colorId: color ? color.id : null,
      colorName: color ? color.name : null
    });
  }
  saveCart(cart);
  updateCartBadge();
  const badge = document.getElementById('cart-count');
  if (badge) { badge.classList.remove('bounce'); void badge.offsetWidth; badge.classList.add('bounce'); }
  renderCart();
  openCartDrawer();
}

function changeQty(key, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
  saveCart(cart);
  updateCartBadge();
  renderCart();
}

function removeItem(key) {
  const cart = getCart().filter((i) => i.key !== key);
  saveCart(cart);
  updateCartBadge();
  renderCart();
}

/* ---------- Render del carrito ---------- */
function renderCart() {
  const wrap = document.getElementById('cart-items');
  if (!wrap) return;
  const cart = getCart();

  const sub = document.getElementById('cart-sub');
  if (sub) sub.textContent = cartCount(cart) + ' ' + t('cart_items_count');

  if (cart.length === 0) {
    wrap.innerHTML = `<p class="cart-empty">${t('cart_empty')}</p>`;
  } else {
    wrap.innerHTML = cart.map((i) => `
      <div class="cart-item">
        <img src="${i.img}" alt="" width="64" height="80" loading="lazy">
        <div class="cart-item-info">
          <div class="cart-item-name">${i.name}</div>
          <div class="cart-item-var">${i.size ? t('size_prefix') + ' ' + i.size : ''}${i.colorName ? ' · ' + t(i.colorName) : ''}</div>
          <div class="cart-item-price">${formatPrice(i.price)}</div>
          <div class="cart-qty">
            <button data-dec="${i.key}" aria-label="${t('cart_dec')}">−</button>
            <span>${i.qty}</span>
            <button data-inc="${i.key}" aria-label="${t('cart_inc')}">+</button>
          </div>
        </div>
        <button class="cart-remove" data-rm="${i.key}" aria-label="${t('cart_remove')}">×</button>
      </div>
    `).join('');
  }
  document.getElementById('cart-total').textContent = formatPrice(cartTotal(cart));
}

/* ---------- Drawer del carrito ---------- */
const cartDrawer = document.getElementById('cart-drawer');
function openCartDrawer() { cartDrawer.classList.add('open'); }
function closeCartDrawer() { cartDrawer.classList.remove('open'); }

/* ---------- Checkout (Stripe Checkout real) ---------- */
function validateCheckout(form) {
  const email = form.email.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phone = form.phone.value.trim();
  const phoneOk = phone === '' || /^[+0-9()\-\s]{7,}$/.test(phone);

  let firstInvalid = null;
  const setInvalid = (field, invalid) => {
    field.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    if (invalid && !firstInvalid) firstInvalid = field;
  };

  setInvalid(form.name, form.name.value.trim() === '');
  setInvalid(form.email, !emailOk);
  setInvalid(form.address, form.address.value.trim() === '');
  setInvalid(form.phone, !phoneOk);
  return firstInvalid;
}

async function checkoutWithStripe(form) {
  const customer = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim()
  };
  const items = getCart().map((i) => ({ id: i.id, size: i.size, qty: i.qty }));

  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, customer })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = document.getElementById('checkout-error');
    err.textContent = data.error || t('co_error');
    err.style.display = 'block';
    return null;
  }
  return data.url;
}

/* ---------- Selector de talla/color (producto destacado) ---------- */
let renderFeatured = function () {};

function initFeatured() {
  const sizesWrap = document.getElementById('featured-sizes');
  const stockBadge = document.getElementById('stock-badge');
  const buyBtn = document.getElementById('featured-buy');
  const p = PRODUCTS['toji-fushiguro'];
  let selectedSize = 'M';

  renderFeatured = function () {
    // tallas
    sizesWrap.innerHTML = Object.entries(p.sizes).map(([size, stock]) => `
      <button class="size ${selectedSize === size ? 'active' : ''}"
        data-size="${size}" ${stock === 0 ? 'disabled' : ''}
        aria-label="${t('size_label')} ${size}">${size}</button>
    `).join('');

    // stock
    if (!selectedSize) {
      stockBadge.textContent = t('stock_select');
      stockBadge.className = 'stock-badge';
      buyBtn.disabled = true;
    } else {
      const stock = p.sizes[selectedSize];
      if (stock === 0) {
        stockBadge.textContent = t('stock_out');
        stockBadge.className = 'stock-badge low';
        buyBtn.disabled = true;
      } else if (stock <= 3) {
        stockBadge.textContent = t('stock_low', { n: stock });
        stockBadge.className = 'stock-badge low';
        buyBtn.disabled = false;
      } else {
        stockBadge.textContent = t('stock_in');
        stockBadge.className = 'stock-badge';
        buyBtn.disabled = false;
      }
    }

    buyBtn.textContent = t('buy');
  };

  sizesWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.size');
    if (!btn || btn.disabled) return;
    selectedSize = btn.dataset.size;
    renderFeatured();
  });

  buyBtn.addEventListener('click', () => {
    addFeaturedToCart();
  });

  function addFeaturedToCart() {
    if (!selectedSize) { renderFeatured(); return; }
    addToCart('toji-fushiguro', selectedSize);
    buyBtn.classList.add('added');
    buyBtn.textContent = t('added');
    setTimeout(() => { buyBtn.classList.remove('added'); buyBtn.textContent = t('buy'); }, 1400);
  }
  window.addFeaturedToCart = addFeaturedToCart;

  renderFeatured();
}

/* ---------- Precios dinámicos ---------- */
function renderPrices() {
  const fp = document.getElementById('featured-price');
  if (fp) fp.textContent = formatPrice(PRODUCTS['toji-fushiguro'].price);
  document.querySelectorAll('[data-price]').forEach((el) => {
    el.textContent = formatPrice(PRODUCTS[el.dataset.price].price);
  });
  const mb = document.getElementById('mobile-buy-btn');
  if (mb) mb.textContent = t('buy') + ' ' + PRODUCTS['toji-fushiguro'].name + ' · ' + formatPrice(PRODUCTS['toji-fushiguro'].price);
}

/* ---------- Grid de productos ---------- */
function initGrid() {
  // Selector de color (solo productos con variantes de color, ej. Focus)
  document.querySelectorAll('[data-color-product]').forEach((wrap) => {
    const id = wrap.dataset.colorProduct;
    const p = PRODUCTS[id];
    if (!p || !p.colors) return;
    const card = wrap.closest('.card');
    const backImg = card && card.querySelector('.face.back img');
    const frontImg = card && card.querySelector('.face.front img');
    const backSrc = card && card.querySelector('.face.back source');
    const frontSrc = card && card.querySelector('.face.front source');

    const webpSrcset = (base) => base + ' 1x, ' + base.replace('.webp', '@2x.webp') + ' 2x';

    const applyColor = (colorId) => {
      wrap.querySelectorAll('.color-swatch').forEach((sw) =>
        sw.classList.toggle('active', sw.dataset.color === colorId)
      );
      const c = p.colors.find((col) => col.id === colorId);
      if (!c) return;
      if (backImg) backImg.src = c.back;
      if (backSrc) backSrc.srcset = webpSrcset(c.back);
      if (frontImg) frontImg.src = c.front;
      if (frontSrc) frontSrc.srcset = webpSrcset(c.front);
      wrap.dataset.active = colorId;
    };

    wrap.addEventListener('click', (e) => {
      const sw = e.target.closest('.color-swatch');
      if (!sw) return;
      applyColor(sw.dataset.color);
    });

    applyColor(p.colors[0].id);
  });

  document.querySelectorAll('.card .add').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.product;
      const wrap = btn.closest('.card').querySelector('[data-color-product]');
      const colorId = wrap ? wrap.dataset.active : null;
      addToCart(id, 'M', 1, colorId);
    });
  });
}

/* ---------- Modales genéricos (con focus trap) ---------- */
let lastFocused = null;

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  lastFocused = document.activeElement;
  modal.classList.add('open');
  const first = modal.querySelector('input, button, a[href], [tabindex]:not([tabindex="-1"])');
  (first || modal).focus();
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}
function closeAllModals() {
  const open = document.querySelector('.modal-backdrop.open');
  document.querySelectorAll('.modal-backdrop.open').forEach((m) => m.classList.remove('open'));
  closeCartDrawer();
  if (open && lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';
function trapFocus(container) {
  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusables = container.querySelectorAll(FOCUSABLE);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/* ---------- Cookies ---------- */
const COOKIE_KEY = 'heavyweight_cookies';
function initCookies() {
  if (localStorage.getItem(COOKIE_KEY)) return;
  const banner = document.getElementById('cookie-banner');
  banner.classList.add('show');
  document.getElementById('cookies-accept').addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    banner.classList.remove('show');
  });
  document.getElementById('cookies-reject').addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'rejected');
    banner.classList.remove('show');
  });
}

/* ---------- Animaciones GSAP ---------- */
function initAnimations() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;

  if (reduce) return; // respeta reducir movimiento

  // Hero — timeline cinematográfica
  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  heroTl
    .from('.hero-drop', { y: -20, opacity: 0, duration: 0.6 })
    .from('.hero-title', { y: 60, opacity: 0, duration: 1 }, '-=0.3')
    .from('.hero-shirt', { scale: 0.85, opacity: 0, duration: 1.2 }, '-=0.7')
    .from('.hero-sub, .hero-cta', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.5');

  // Parallax del hero
  gsap.fromTo('.hero-shirt',
    { y: 0 },
    {
      y: -120, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    }
  );

  // Apariciones por scroll
  gsap.from('.shop-head', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.shop', start: 'top 75%' } });
  gsap.from('.featured-info', { x: -60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.featured', start: 'top 70%' } });
  gsap.from('.featured-visual', { x: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.featured', start: 'top 70%' } });
  gsap.from('.card', { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: '.grid', start: 'top 75%' } });
  gsap.from('.manifesto-text', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.manifesto', start: 'top 75%' } });
  gsap.from('.manifesto-visual', { y: 50, opacity: 0, duration: 1, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.manifesto', start: 'top 75%' } });
  gsap.from('.fabric-item', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.fabric', start: 'top 75%' } });
  gsap.from('.custom-inner', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.custom-order', start: 'top 80%' } });

  // Zoom sutil en las imágenes de tarjeta al hacer scroll
  gsap.utils.toArray('.card-visual .face img').forEach((img) => {
    gsap.fromTo(img,
      { scale: 1 },
      { scale: 1.06, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } }
    );
  });

  function initTilt(stage) {
    if (isTouch) return;
    const hero = stage.closest('.hero');
    const intensity = hero ? 6 : 16; // tilt reducido en el hero (foto lifestyle)
    const rotY = gsap.quickTo(stage, 'rotationY', { duration: 0.5, ease: 'power3' });
    const rotX = gsap.quickTo(stage, 'rotationX', { duration: 0.5, ease: 'power3' });
    const posX = gsap.quickTo(stage, 'x', { duration: 0.6, ease: 'power3' });
    const posY = gsap.quickTo(stage, 'y', { duration: 0.6, ease: 'power3' });

    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * intensity);
      rotX(-py * intensity * 0.75);
      posX(px * (hero ? 6 : 10));
      posY(py * (hero ? 4 : 6));
    });
    stage.addEventListener('mouseleave', () => { rotY(0); rotX(0); posX(0); posY(0); });
  }
  document.querySelectorAll('.js-tilt').forEach(initTilt);
}

/* ---------- Flip frontal/trasera ---------- */
function initFlips() {
  document.querySelectorAll('.js-flip').forEach((flip) => {
    const toggle = () => flip.classList.toggle('is-flipped');
    flip.addEventListener('click', toggle);
    flip.setAttribute('role', 'button');
    flip.setAttribute('tabindex', '0');
    flip.setAttribute('aria-label', t('flip_hint'));
    flip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
}

/* ---------- Inicialización ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  updateCartBadge();
  renderCart();
  renderPrices();
  await loadStock();
  initFeatured();
  initGrid();
  initCookies();
  initFlips();

  // Focus trap en modales y drawer del carrito
  document.querySelectorAll('.modal-backdrop').forEach(trapFocus);
  trapFocus(document.getElementById('cart-drawer'));

  // Nav: fondo sólido al hacer scroll
  const header = document.getElementById('site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Botón de compra móvil
  const mobileBuy = document.getElementById('mobile-buy-btn');
  if (mobileBuy) mobileBuy.addEventListener('click', () => window.addFeaturedToCart && window.addFeaturedToCart());

  // Carrito
  document.getElementById('open-cart').addEventListener('click', openCartDrawer);
  document.getElementById('close-cart').addEventListener('click', closeCartDrawer);
  document.getElementById('cart-items').addEventListener('click', (e) => {
    const inc = e.target.closest('[data-inc]');
    const dec = e.target.closest('[data-dec]');
    const rm = e.target.closest('[data-rm]');
    if (inc) changeQty(inc.dataset.inc, 1);
    else if (dec) changeQty(dec.dataset.dec, -1);
    else if (rm) removeItem(rm.dataset.rm);
  });

  // Checkout
  document.getElementById('checkout-btn').addEventListener('click', () => {
    if (getCart().length === 0) return;
    closeCartDrawer();
    openModal('checkout-modal');
  });

  // Guía de tallas
  document.getElementById('size-guide-link').addEventListener('click', () => openModal('size-guide-modal'));
  document.querySelectorAll('[data-open-modal]').forEach((el) =>
    el.addEventListener('click', () => openModal(el.dataset.openModal))
  );

  // Cerrar modales
  document.querySelectorAll('.modal-backdrop [data-close], .modal-backdrop .close').forEach((b) =>
    b.addEventListener('click', () => closeAllModals())
  );
  document.querySelectorAll('.modal-backdrop').forEach((m) =>
    m.addEventListener('click', (e) => { if (e.target === m) closeAllModals(); })
  );

  // Formulario de checkout (Stripe Checkout)
  document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const err = document.getElementById('checkout-error');
    err.style.display = 'none';

    const firstInvalid = validateCheckout(form);
    if (firstInvalid) {
      err.textContent = t('co_error');
      err.style.display = 'block';
      firstInvalid.focus();
      return;
    }

    const btn = document.getElementById('checkout-confirm');
    btn.disabled = true;
    btn.textContent = t('co_redirecting') || '…';

    const url = await checkoutWithStripe(form);
    if (!url) {
      btn.disabled = false;
      btn.textContent = t('co_confirm');
      return;
    }
    // Redirigir a Stripe para el pago
    window.location.href = url;
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  initAnimations();
});

/* Re-render al cambiar de idioma */
window.onLanguageChange = function () {
  renderCart();
  renderPrices();
  renderFeatured();
};

/* Refrescar ScrollTrigger tras cargar imágenes */
window.addEventListener('load', () => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
window.addEventListener('load', () => {
  Promise.all(
    Array.from(document.images)
      .filter((img) => !img.complete)
      .map((img) => new Promise((res) => { img.onload = img.onerror = res; }))
  ).then(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
});
