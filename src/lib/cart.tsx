import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PRODUCTS, getProduct, type Size } from "./products";

export type CartItem = {
  key: string;
  productId: string;
  size: Size;
  color?: string | undefined;
  qty: number;
};

export function addItem(
  items: CartItem[],
  productId: string,
  size: Size,
  color?: string,
): CartItem[] {
  const p = getProduct(productId);
  const key = `${productId}|${size}|${color ?? ""}`;
  const existing = items.find((i) => i.key === key);
  const max = p.stock[size];
  if (existing)
    return items.map((i) => (i.key === key ? { ...i, qty: Math.min(max, i.qty + 1) } : i));
  if (max <= 0) return items;
  return [...items, { key, productId, size, color, qty: 1 }];
}

export function setQty(items: CartItem[], key: string, qty: number): CartItem[] {
  return items
    .map((i) =>
      i.key === key ? { ...i, qty: Math.min(getProduct(i.productId).stock[i.size], qty) } : i,
    )
    .filter((i) => i.qty > 0);
}

export const cartTotal = (items: CartItem[]) =>
  items.reduce((s, i) => s + getProduct(i.productId).price * i.qty, 0);
export const cartCount = (items: CartItem[]) => items.reduce((s, i) => s + i.qty, 0);

type Ctx = {
  items: CartItem[];
  add: (id: string, size: Size, color?: string) => void;
  update: (key: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  checkout: boolean;
  setCheckout: (o: boolean) => void;
  guide: boolean;
  setGuide: (o: boolean) => void;
  bump: number;
};
const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [guide, setGuide] = useState(false);
  const [bump, setBump] = useState(0);
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("hw-cart") || "[]"));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);
  // Sincroniza el stock con la fuente de verdad del servidor.
  useEffect(() => {
    let alive = true;
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          data: { products?: { id: string; price: number; sizes: Record<Size, number> }[] } | null,
        ) => {
          if (!alive || !data?.products) return;
          data.products.forEach((s) => {
            const p = PRODUCTS.find((x) => x.id === s.id);
            if (!p) return;
            p.price = s.price;
            p.stock = { ...p.stock, ...s.sizes };
          });
        },
      )
      .catch(() => {
        /* offline: se mantiene el stock local */
      });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem("hw-cart", JSON.stringify(items));
  }, [items, loaded]);
  return (
    <CartCtx.Provider
      value={{
        items,
        add: (id, size, color) => {
          setItems((it) => addItem(it, id, size, color));
          setBump((b) => b + 1);
        },
        update: (key, qty) => setItems((it) => setQty(it, key, qty)),
        clear: () => setItems([]),
        open,
        setOpen,
        checkout,
        setCheckout,
        guide,
        setGuide,
        bump,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
