import againBack from "@/assets/again-back.webp";
import againFront from "@/assets/again-front.webp";
import disciplineBack from "@/assets/discipline-back.webp";
import disciplineFront from "@/assets/discipline-front.webp";
import focusBack from "@/assets/focus-back.webp";
import focusFront from "@/assets/focus-front.webp";
import focusWineBack from "@/assets/focus-vinotinto-back.webp";
import focusWineFront from "@/assets/focus-vinotinto-front.webp";
import omrBack from "@/assets/one-more-rep-back.webp";
import omrFront from "@/assets/one-more-rep-front.webp";
import tojiBack from "@/assets/toji-fushiguro-back.webp";
import tojiFront from "@/assets/toji-fushiguro-front.webp";

export const SIZES = ["S", "M", "L", "XL"] as const;
export type Size = (typeof SIZES)[number];

export type Color = { id: string; hex: string; back: string; front: string };
export type Product = {
  id: string;
  name: string;
  drop: string;
  price: number;
  stock: Record<Size, number>;
  back: string;
  front: string;
  colors?: Color[];
};

export const PRODUCTS: Product[] = [
  {
    id: "again",
    name: "Again",
    drop: "001",
    price: 35,
    stock: { S: 2, M: 3, L: 2, XL: 1 },
    back: againBack,
    front: againFront,
  },
  {
    id: "discipline",
    name: "Discipline",
    drop: "002",
    price: 35,
    stock: { S: 2, M: 3, L: 2, XL: 1 },
    back: disciplineBack,
    front: disciplineFront,
  },
  {
    id: "focus",
    name: "Focus",
    drop: "003",
    price: 35,
    stock: { S: 2, M: 3, L: 2, XL: 1 },
    back: focusBack,
    front: focusFront,
    colors: [
      { id: "dark", hex: "#2b2b2b", back: focusBack, front: focusFront },
      { id: "wine", hex: "#5a2533", back: focusWineBack, front: focusWineFront },
    ],
  },
  {
    id: "one-more-rep",
    name: "One More Rep",
    drop: "004",
    price: 35,
    stock: { S: 2, M: 3, L: 2, XL: 2 },
    back: omrBack,
    front: omrFront,
  },
  {
    id: "toji-fushiguro",
    name: "Toji Fushiguro",
    drop: "005",
    price: 35,
    stock: { S: 2, M: 3, L: 2, XL: 1 },
    back: tojiBack,
    front: tojiFront,
  },
];

export const FEATURED_ID = "toji-fushiguro";
export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id)!;
export const totalStock = (p: Product) => SIZES.reduce((s, k) => s + p.stock[k], 0);
