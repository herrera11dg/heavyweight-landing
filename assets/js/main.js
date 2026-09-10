/* ============================================================
   HeavyWeight — scripts principales
   GSAP (parallax, tilt) + e-commerce (carrito, tallas, checkout)
   ============================================================ */

/* ---------- Catálogo (precios en euros) ---------- */
const PRODUCTS = {
  'iron-core': {
    name: 'Iron Core',
    price: 39,
    gsm: 280,
    colors: ['#14110d', '#3a3733', '#8a8578'],
    colorNames: ['color_black', 'color_graphite', 'color_taupe'],
    sizes: { S: 5, M: 9, L: 7, XL: 2 }
  },
  'atlas': {
    name: 'Atlas',
    price: 45,
    gsm: 320,
    sizes: { S: 3, M: 6, L: 4, XL: 0 }
  },
  'grind': {
    name: 'Grind',
    price: 34,
    gsm: 240,
    sizes: { S: 8, M: 11, L: 9, XL: 5 }
  }
};

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
function addToCart(productId, size, colorName, qty = 1) {
  const p = PRODUCTS[productId];
  const cart = getCart();
  const key = productId + '|' + size + '|' + (colorName || '');
  const existing = cart.find((i) => i.key === key);
  if (existing) existing.qty += qty;
  else {
    cart.push({
      key,
      id: productId,
      name: p.name,
      price: p.price,
      size,
      color: colorName || null,
      qty,
      img: productId === 'iron-core' ? 'assets/img/frontal.webp' : (productId === 'atlas' ? 'assets/img/trasera.webp' : 'assets/img/frontal.webp')
    });
  }
  saveCart(cart);
  updateCartBadge();
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

  if (cart.length === 0) {
    wrap.innerHTML = `<p class="cart-empty">${t('cart_empty')}</p>`;
  } else {
    wrap.innerHTML = cart.map((i) => `
      <div class="cart-item">
        <img src="${i.img}" alt="" width="60" height="80" loading="lazy">
        <div class="cart-item-info">
          <div class="cart-item-name">${i.name}</div>
          <div class="cart-item-var">${i.size ? t('size_prefix') + ' ' + i.size : ''}${i.color ? ' · ' + t(i.color) : ''}</div>
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

/* ---------- Checkout (simulación de pedido) ---------- */
function placeOrder(form) {
  const order = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim(),
    items: getCart()
  };
  if (!order.name || !order.email || !order.address) return false;

  // Simulación: en producción conectarías aquí un procesador de pago
  // (Stripe, MB WAY, etc.) y un backend para persistir el pedido.
  const orderNumber = 'HW-' + Date.now().toString().slice(-6);
  saveCart([]);
  updateCartBadge();
  return orderNumber;
}

/* ---------- Selector de talla/color (producto destacado) ---------- */
let renderFeatured = function () {};

function initFeatured() {
  const sizesWrap = document.getElementById('featured-sizes');
  const colorsWrap = document.getElementById('featured-colors');
  const stockBadge = document.getElementById('stock-badge');
  const buyBtn = document.getElementById('featured-buy');
  const p = PRODUCTS['iron-core'];
  let selectedSize = null;
  let selectedColor = p.colorNames[0];

  renderFeatured = function () {
    // tallas
    sizesWrap.innerHTML = Object.entries(p.sizes).map(([size, stock]) => `
      <button class="size ${selectedSize === size ? 'active' : ''}"
        data-size="${size}" ${stock === 0 ? 'disabled' : ''}
        aria-label="${t('size_label')} ${size}">${size}</button>
    `).join('');

    // colores
    colorsWrap.innerHTML = p.colors.map((c, idx) => `
      <button class="color ${selectedColor === p.colorNames[idx] ? 'active' : ''}"
        data-color="${p.colorNames[idx]}" aria-label="${t('color_label')} ${t(p.colorNames[idx])}">
        <span class="swatch" style="background:${c}"></span>
      </button>
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

  colorsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.color');
    if (!btn) return;
    selectedColor = btn.dataset.color;
    renderFeatured();
  });

  buyBtn.addEventListener('click', () => {
    if (!selectedSize) { renderFeatured(); return; }
    addToCart('iron-core', selectedSize, selectedColor);
    buyBtn.classList.add('added');
    buyBtn.textContent = t('added');
    setTimeout(() => { buyBtn.classList.remove('added'); buyBtn.textContent = t('buy'); }, 1400);
  });

  renderFeatured();
}

/* ---------- Precios dinámicos ---------- */
function renderPrices() {
  const fp = document.getElementById('featured-price');
  if (fp) fp.textContent = formatPrice(PRODUCTS['iron-core'].price);
  document.querySelectorAll('[data-price]').forEach((el) => {
    el.textContent = formatPrice(PRODUCTS[el.dataset.price].price);
  });
}

/* ---------- Grid de productos ---------- */
function initGrid() {
  document.querySelectorAll('.card .add').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.product;
      addToCart(id, 'M', null);
    });
  });
}

/* ---------- Modales genéricos ---------- */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function closeAllModals() {
  document.querySelectorAll('.modal-backdrop.open').forEach((m) => m.classList.remove('open'));
  closeCartDrawer();
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

  gsap.from('.hero-label, .hero-title, .hero-sub', { y: 40, opacity: 0, duration: 1, ease: 'power4.out', stagger: 0.08 });
  gsap.from('.js-zoom', { scale: 0.6, y: 80, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 });

  gsap.fromTo('.js-zoom',
    { scale: 0.7, y: 60 },
    {
      scale: 1.6, y: -140, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    }
  );

  gsap.from('.shop-head', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.shop', start: 'top 75%' } });
  gsap.from('.featured-info', { x: -60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.featured', start: 'top 70%' } });
  gsap.from('.featured-visual', { x: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.featured', start: 'top 70%' } });
  gsap.from('.card', { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: '.grid', start: 'top 75%' } });

  function initTilt(stage) {
    if (isTouch) return;
    const rotY = gsap.quickTo(stage, 'rotationY', { duration: 0.5, ease: 'power3' });
    const rotX = gsap.quickTo(stage, 'rotationX', { duration: 0.5, ease: 'power3' });
    const posX = gsap.quickTo(stage, 'x', { duration: 0.6, ease: 'power3' });
    const posY = gsap.quickTo(stage, 'y', { duration: 0.6, ease: 'power3' });

    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * 16);
      rotX(-py * 12);
      posX(px * 10);
      posY(py * 6);
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
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCart();
  renderPrices();
  initFeatured();
  initGrid();
  initCookies();
  initFlips();

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

  // Formulario de checkout
  document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const orderNumber = placeOrder(e.target);
    if (!orderNumber) {
      document.getElementById('checkout-error').style.display = 'block';
      return;
    }
    closeModal('checkout-modal');
    renderCart();
    openModal('order-modal');
    document.getElementById('order-number').textContent = orderNumber;
    e.target.reset();
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
