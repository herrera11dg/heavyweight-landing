/* ============================================================
   HeavyWeight — Catálogo y stock (fuente de verdad en el servidor)
   Este módulo se usa en /api para validar stock y crear sesiones
   de pago. El frontend obtiene una copia vía GET /api/products.
   ============================================================ */

const PRODUCTS = {
  again: {
    id: 'again', name: 'Again', price: 35, gsm: 240,
    image: 'assets/img/again-back.webp',
    sizes: { S: 2, M: 3, L: 2, XL: 1 }
  },
  discipline: {
    id: 'discipline', name: 'Discipline', price: 35, gsm: 240,
    image: 'assets/img/discipline-back.webp',
    sizes: { S: 2, M: 3, L: 2, XL: 1 }
  },
  focus: {
    id: 'focus', name: 'Focus', price: 35, gsm: 240,
    image: 'assets/img/focus-back.webp',
    sizes: { S: 2, M: 3, L: 2, XL: 1 }
  },
  'one-more-rep': {
    id: 'one-more-rep', name: 'One More Rep', price: 35, gsm: 240,
    image: 'assets/img/one-more-rep-back.webp',
    sizes: { S: 2, M: 3, L: 2, XL: 2 }
  },
  'toji-fushiguro': {
    id: 'toji-fushiguro', name: 'Toji Fushiguro', price: 35, gsm: 240,
    image: 'assets/img/toji-fushiguro-back.webp',
    sizes: { S: 2, M: 3, L: 2, XL: 1 }
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
