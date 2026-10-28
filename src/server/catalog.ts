import { SIZES, type Size } from "@/lib/products";

export type ServerProduct = {
  id: string;
  name: string;
  price: number;
  gsm: number;
  image: string;
  sizes: Record<Size, number>;
};

/**
 * Catálogo y stock (fuente de verdad en el servidor).
 * El frontend obtiene una copia vía GET /api/products.
 */
export const SERVER_PRODUCTS: Record<string, ServerProduct> = {
  again: {
    id: "again",
    name: "Again",
    price: 35,
    gsm: 240,
    image: "/img/again-back.webp",
    sizes: { S: 2, M: 3, L: 2, XL: 1 },
  },
  discipline: {
    id: "discipline",
    name: "Discipline",
    price: 35,
    gsm: 240,
    image: "/img/discipline-back.webp",
    sizes: { S: 2, M: 3, L: 2, XL: 1 },
  },
  focus: {
    id: "focus",
    name: "Focus",
    price: 35,
    gsm: 240,
    image: "/img/focus-back.webp",
    sizes: { S: 2, M: 3, L: 2, XL: 1 },
  },
  "one-more-rep": {
    id: "one-more-rep",
    name: "One More Rep",
    price: 35,
    gsm: 240,
    image: "/img/one-more-rep-back.webp",
    sizes: { S: 2, M: 3, L: 2, XL: 2 },
  },
  "toji-fushiguro": {
    id: "toji-fushiguro",
    name: "Toji Fushiguro",
    price: 35,
    gsm: 240,
    image: "/img/toji-fushiguro-back.webp",
    sizes: { S: 2, M: 3, L: 2, XL: 1 },
  },
};

export const getServerProduct = (id: string) => SERVER_PRODUCTS[id] ?? null;

export const listServerProducts = () =>
  Object.values(SERVER_PRODUCTS).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    gsm: p.gsm,
    image: p.image,
    sizes: { ...p.sizes },
  }));

export const isSize = (v: unknown): v is Size => SIZES.includes(v as Size);
