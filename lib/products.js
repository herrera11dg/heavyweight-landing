/* ============================================================
   HeavyWeight — Catálogo y stock (fuente de verdad en el servidor)
   Este módulo se usa en /api para validar stock y crear sesiones
   de pago. El frontend obtiene una copia vía GET /api/products.
   ============================================================ */

const PRODUCTS = {
  progress: {
    id: 'progress', name: 'Progress', price: 35, gsm: 240,
    image: 'assets/img/progress-frente.webp',
    sizes: { S: 2, M: 3, L: 3, XL: 2 }
  },
  again: {
    id: 'again', name: 'Again', price: 35, gsm: 240,
    image: 'assets/img/again-frente.webp',
    sizes: { S: 2, M: 2, L: 2, XL: 1 }
  },
  focus: {
    id: 'focus', name: 'Focus', price: 35, gsm: 240,
    image: 'assets/img/focus-frente.webp',
    sizes: { S: 2, M: 3, L: 2, XL: 1 }
  },
  gojo: {
    id: 'gojo', name: 'Gojo', price: 35, gsm: 240,
    image: 'assets/img/gojo-frente.webp',
    sizes: { S: 1, M: 2, L: 2, XL: 1 }
  },
  toji: {
    id: 'toji', name: 'Toji', price: 35, gsm: 240,
    image: 'assets/img/toji-frente.webp',
    sizes: { S: 2, M: 2, L: 1, XL: 1 }
  },
  'one-more-rep': {
    id: 'one-more-rep', name: 'One More Rep', price: 35, gsm: 240,
    image: 'assets/img/frontal.webp',
    sizes: { S: 2, M: 3, L: 2, XL: 2 }
  }
};

function getProduct(id) {
  return PRODUCTS[id] || null;
}

function listProducts() {
  return Object.values(PRODUCTS).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    gsm: p.gsm,
    image: p.image,
    sizes: { ...p.sizes }
  }));
}

module.exports = { PRODUCTS, getProduct, listProducts };
