import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { LANGS, useI18n } from "@/lib/i18n";
import { cartCount, cartTotal, useCart } from "@/lib/cart";
import { getProduct } from "@/lib/products";
import { CloseBtn, Logo, Modal } from "./ui";

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { items, setOpen, bump } = useCart();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const count = cartCount(items);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const nav = [
    { hash: "colecao", label: t.nav.shop },
    { hash: "lookbook", label: t.nav.brand },
    { hash: "contacto", label: t.nav.contact },
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${solid || menu ? "border-border bg-background/85 backdrop-blur-md" : "border-transparent"}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="HeavyWeight">
          <Logo />
        </Link>
        <nav className="hidden md:block" aria-label="Principal">
          <ul className="flex gap-8">
            {nav.map((n) => (
              <li key={n.hash}>
                <Link
                  to="/"
                  hash={n.hash}
                  className="label-mono text-muted-foreground transition-colors hover:text-foreground"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex" role="group" aria-label={t.nav.lang}>
            {LANGS.map((l, i) => (
              <span key={l} className="flex items-center">
                {i > 0 && <span className="label-mono px-1 text-border">|</span>}
                <button
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  className={`label-mono px-1 py-2 ${lang === l ? "text-primary-text" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {l.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`${t.nav.cart} (${count})`}
            className="btn-ghost relative"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M6 7h12l-1 13H7L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span
              key={bump}
              className={`label-mono flex h-5 min-w-5 items-center justify-center px-1 ${count ? "bg-primary text-foreground" : "bg-secondary"} ${bump ? "bounce" : ""}`}
            >
              {count}
            </span>
          </button>
          <button
            type="button"
            className="btn-ghost md:hidden"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            onClick={() => setMenu((m) => !m)}
          >
            {t.nav.menu}
          </button>
        </div>
      </div>
      {menu && (
        <div id="mobile-menu" className="border-t border-border px-4 pb-6 md:hidden">
          <ul className="flex flex-col gap-1 pt-4">
            {nav.map((n) => (
              <li key={n.hash}>
                <Link
                  to="/"
                  hash={n.hash}
                  onClick={() => setMenu(false)}
                  className="font-display block py-2 text-3xl"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2" role="group" aria-label={t.nav.lang}>
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
                className={`label-mono border px-3 py-2 ${lang === l ? "border-primary bg-primary" : "border-border"}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  const { setGuide } = useCart();
  return (
    <footer id="contacto" className="border-t border-border bg-card pb-24 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="label-mono mt-4 text-muted-foreground">{t.footer.tagline}</p>
        </div>
        <FooterCol title={t.footer.shop}>
          <Link to="/" hash="colecao" className="hover:text-foreground">
            {t.footer.all}
          </Link>
          <button
            type="button"
            onClick={() => setGuide(true)}
            className="text-left hover:text-foreground"
          >
            {t.footer.guide}
          </button>
        </FooterCol>
        <FooterCol title={t.footer.help}>
          <Link to="/envios" className="hover:text-foreground">
            {t.footer.shipping}
          </Link>
          <Link to="/privacidade" className="hover:text-foreground">
            {t.footer.privacy}
          </Link>
          <Link to="/termos" className="hover:text-foreground">
            {t.footer.terms}
          </Link>
        </FooterCol>
        <FooterCol title={t.footer.contact}>
          <a
            href="https://instagram.com/heavyweight.pt"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            Instagram
          </a>
          <a href="mailto:hello@heavyweight.pt" className="hover:text-foreground">
            hello@heavyweight.pt
          </a>
        </FooterCol>
      </div>
      <div className="border-t border-border">
        <p className="label-mono mx-auto max-w-7xl px-4 py-6 text-muted-foreground sm:px-6">
          © 2026 HeavyWeight
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="label-mono mb-4 text-foreground">{title}</h3>
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export function CartDrawer() {
  const { t, price } = useI18n();
  const { items, open, setOpen, update, setCheckout } = useCart();
  const close = () => setOpen(false);
  return (
    <Modal open={open} onClose={close} label={t.cart.title} side>
      <div className="flex items-center justify-between border-b border-border p-5">
        <h2 className="font-display text-3xl">{t.cart.title}</h2>
        <CloseBtn onClick={close} label={t.cart.close} />
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {items.length === 0 ? (
          <p className="text-muted-foreground">{t.cart.empty}</p>
        ) : (
          <ul className="flex flex-col gap-5">
            {items.map((i) => {
              const p = getProduct(i.productId);
              const img = p.colors?.find((c) => c.id === i.color)?.back ?? p.back;
              return (
                <li key={i.key} className="flex gap-4 border-b border-border pb-5">
                  <img
                    src={img}
                    alt=""
                    width={80}
                    height={100}
                    className="h-[100px] w-20 object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-display text-xl">{p.name}</p>
                        <p className="label-mono text-muted-foreground">
                          {i.size}
                          {i.color ? ` · ${t.col.colors[i.color as "dark" | "wine"]}` : ""}
                        </p>
                      </div>
                      <p className="font-mono">{price(p.price * i.qty)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          aria-label={t.cart.dec}
                          onClick={() => update(i.key, i.qty - 1)}
                          className="h-9 w-9 hover:bg-secondary"
                        >
                          −
                        </button>
                        <span className="font-mono w-8 text-center" aria-live="polite">
                          {i.qty}
                        </span>
                        <button
                          type="button"
                          aria-label={t.cart.inc}
                          disabled={i.qty >= p.stock[i.size]}
                          onClick={() => update(i.key, i.qty + 1)}
                          className="h-9 w-9 hover:bg-secondary disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => update(i.key, 0)}
                        className="label-mono text-muted-foreground underline hover:text-foreground"
                      >
                        {t.cart.remove}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {items.length > 0 && (
        <div className="border-t border-border p-5">
          <div className="mb-1 flex justify-between">
            <span className="label-mono">{t.cart.total}</span>
            <span className="font-mono text-lg">{price(cartTotal(items))}</span>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">{t.cart.shippingNote}</p>
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => {
              setOpen(false);
              setCheckout(true);
            }}
          >
            {t.cart.checkout}
          </button>
        </div>
      )}
    </Modal>
  );
}

type Fields = { name: string; email: string; phone: string; address: string };
export function CheckoutModal() {
  const { t, price } = useI18n();
  const { items, checkout, setCheckout } = useCart();
  const [v, setV] = useState<Fields>({ name: "", email: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const close = () => {
    setCheckout(false);
    setErrors({});
    setError("");
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    (Object.keys(v) as (keyof Fields)[]).forEach((k) => {
      if (!v[k].trim()) er[k] = t.checkout.required;
    });
    if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) er.email = t.checkout.invalidEmail;
    setErrors(er);
    setError("");
    if (Object.keys(er).length) return;

    setSending(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.productId, size: i.size, qty: i.qty })),
          customer: v,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "Não foi possível iniciar o pagamento.");
        setSending(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Falha de rede. Tenta novamente.");
      setSending(false);
    }
  };
  const field = (k: keyof Fields, type = "text", auto?: string) => (
    <div>
      <label htmlFor={`co-${k}`} className="label-mono mb-2 block">
        {t.checkout[k]}
      </label>
      <input
        id={`co-${k}`}
        type={type}
        autoComplete={auto}
        value={v[k]}
        onChange={(e) => setV({ ...v, [k]: e.target.value })}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `co-${k}-err` : undefined}
        className="w-full border border-border bg-background px-4 py-3 outline-none focus:border-foreground aria-[invalid=true]:border-primary-text"
      />
      {errors[k] && (
        <p id={`co-${k}-err`} className="mt-1 text-xs text-primary-text">
          {errors[k]}
        </p>
      )}
    </div>
  );
  return (
    <Modal open={checkout} onClose={close} label={t.checkout.title}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-4xl">{t.checkout.title}</h2>
          <CloseBtn onClick={close} label={t.cart.close} />
        </div>
        {field("name", "text", "name")}
        {field("email", "email", "email")}
        {field("phone", "tel", "tel")}
        {field("address", "text", "street-address")}
        <div className="flex justify-between border-t border-border pt-4">
          <span className="label-mono">{t.cart.total}</span>
          <span className="font-mono">{price(cartTotal(items))}</span>
        </div>
        {error && (
          <p role="alert" className="text-sm text-primary-text">
            {error}
          </p>
        )}
        <button type="submit" className="btn-primary" disabled={sending || items.length === 0}>
          {sending ? t.checkout.redirecting : t.checkout.confirm}
        </button>
        <p className="text-center text-xs text-muted-foreground">{t.checkout.simulated}</p>
      </form>
    </Modal>
  );
}

const GUIDE = [
  ["S", 104, 68, 47],
  ["M", 110, 71, 49],
  ["L", 116, 74, 51],
  ["XL", 122, 77, 53],
] as const;
export function SizeGuideModal() {
  const { t } = useI18n();
  const { guide, setGuide } = useCart();
  return (
    <Modal open={guide} onClose={() => setGuide(false)} label={t.guide.title}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-4xl">{t.guide.title}</h2>
        <CloseBtn onClick={() => setGuide(false)} label={t.cart.close} />
      </div>
      <table className="w-full font-mono text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            {[t.guide.size, t.guide.chest, t.guide.length, t.guide.shoulder].map((h) => (
              <th key={h} scope="col" className="py-3 font-normal uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GUIDE.map(([s, ...r]) => (
            <tr key={s} className="border-b border-border">
              <th scope="row" className="py-3 text-left">
                {s}
              </th>
              {r.map((x, i) => (
                <td key={i} className="py-3">
                  {x}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-muted-foreground">{t.guide.note}</p>
    </Modal>
  );
}

export function CookieBanner() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => setShow(!localStorage.getItem("hw-cookies")), []);
  if (!show) return null;
  return (
    <div
      role="region"
      aria-label="Cookies"
      className="fixed bottom-20 left-4 right-4 z-40 border border-border bg-card p-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm"
    >
      <p className="text-sm text-muted-foreground">{t.cookie.text}</p>
      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          className="btn-primary px-4 py-2"
          onClick={() => {
            localStorage.setItem("hw-cookies", "1");
            setShow(false);
          }}
        >
          {t.cookie.accept}
        </button>
        <button
          type="button"
          className="label-mono text-muted-foreground underline hover:text-foreground"
          onClick={() => {
            localStorage.setItem("hw-cookies", "0");
            setShow(false);
          }}
        >
          {t.cookie.reject}
        </button>
        <Link
          to="/privacidade"
          className="label-mono text-muted-foreground underline hover:text-foreground"
        >
          {t.cookie.more}
        </Link>
      </div>
    </div>
  );
}
