import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import {
  FEATURED_ID,
  PRODUCTS,
  getProduct,
  totalStock,
  type Product,
  type Size,
} from "@/lib/products";
import {
  FlipImage,
  SizeSelector,
  StockBadge,
  reducedMotion,
  useReveal,
} from "@/components/store/ui";
import lookbook from "@/assets/lookbook.webp";

const SITE = "https://heavyweight-sigma.vercel.app";
const OG_IMAGE = `${SITE}/img/toji-fushiguro-back.webp`;

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: "HeavyWeight",
  url: `${SITE}/`,
  description:
    "T-shirts de algodão pesado de 240 gsm com estampados DTF. Corte boxy, feito em Portugal.",
  currenciesAccepted: "EUR",
  paymentAccepted: "Cartão de crédito, Apple Pay, Google Pay",
  priceRange: "€35",
  itemListElement: PRODUCTS.map((p, i) => ({
    "@type": "Product",
    position: i + 1,
    name: p.name,
    offers: {
      "@type": "Offer",
      price: "35.00",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  })),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeavyWeight™ — T-shirts de ginásio 240 GSM" },
      {
        name: "description",
        content:
          "T-shirts portuguesas de algodão pesado de 240 gsm com estampados DTF de grande formato. Corte boxy e queda firme para anos de treino.",
      },
      { name: "theme-color", content: "#0f0f0f" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "HeavyWeight" },
      { property: "og:title", content: "HeavyWeight — Peso que se nota" },
      {
        property: "og:description",
        content: "T-shirts portuguesas de algodão pesado para anos de treino.",
      },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:locale", content: "pt_PT" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "HeavyWeight — Peso que se nota" },
      {
        name: "twitter:description",
        content: "T-shirts portuguesas de algodão pesado para anos de treino.",
      },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: `${SITE}/` },
      { rel: "alternate", hrefLang: "pt", href: `${SITE}/?lang=pt` },
      { rel: "alternate", hrefLang: "en", href: `${SITE}/?lang=en` },
      { rel: "alternate", hrefLang: "es", href: `${SITE}/?lang=es` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE}/` },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/img/toji-fushiguro-back.webp" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(storeJsonLd) }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Collection />
      <Lookbook />
      <Fabric />
      <Custom />
      <MobileBar />
    </>
  );
}

function Hero() {
  const { t } = useI18n();
  const shirts = useRef<HTMLDivElement>(null);
  const toji = getProduct(FEATURED_ID);
  const disc = getProduct("discipline");
  useEffect(() => {
    if (reducedMotion()) return;
    const on = () => {
      if (shirts.current) shirts.current.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="label-mono hero-in text-primary-text">{t.hero.label}</p>
          <h1
            className="font-display hero-in mt-6 text-[clamp(56px,10vw,120px)]"
            style={{ ["--d" as string]: "120ms" }}
          >
            {t.hero.l1}
            <br />
            {t.hero.l2}
          </h1>
          <div className="hero-in" style={{ ["--d" as string]: "600ms" }}>
            <p className="label-mono mt-6 text-muted-foreground">{t.hero.sub}</p>
            <a href="#colecao" className="btn-primary mt-8">
              {t.hero.cta} →
            </a>
          </div>
        </div>
        <div ref={shirts} className="grid grid-cols-2 gap-4 will-change-transform">
          {[
            { p: toji, cap: t.hero.cap1, cls: "-translate-y-6", d: "300ms" },
            { p: disc, cap: t.hero.cap2, cls: "translate-y-10", d: "450ms" },
          ].map(({ p, cap, cls, d }) => (
            <figure key={p.id} className={`hero-in ${cls}`} style={{ ["--d" as string]: d }}>
              <img
                src={p.back}
                alt={`${p.name} — HeavyWeight`}
                width={800}
                height={1000}
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption className="label-mono mt-3 text-muted-foreground">{cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead({ label, title, right }: { label: string; title: string; right?: string }) {
  return (
    <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
      <div>
        <p className="label-mono text-muted-foreground">{label}</p>
        <h2 className="font-display mt-3 text-6xl sm:text-8xl">{title}</h2>
      </div>
      {right && <p className="label-mono text-muted-foreground">{right}</p>}
    </div>
  );
}

function Collection() {
  const { t } = useI18n();
  const ref = useReveal<HTMLElement>();
  return (
    <section id="colecao" ref={ref} className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead label={t.col.label} title={t.col.title} right={t.col.count} />
        <Featured />
        <ul className="mt-20 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <li
              key={p.id}
              className={`reveal ${i % 2 ? "bg-card-alt" : "bg-card"}`}
              style={{ ["--d" as string]: `${(i % 3) * 120}ms` }}
            >
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Featured() {
  const { t, price } = useI18n();
  const { add, setGuide } = useCart();
  const p = getProduct(FEATURED_ID);
  const [size, setSize] = useState<Size | null>(null);
  const [msg, setMsg] = useState("");
  const onAdd = () => {
    if (!size) {
      setMsg(t.col.pickSize);
      return;
    }
    add(p.id, size);
    setMsg(`${t.col.added}: ${p.name} · ${size}`);
  };
  return (
    <article className="reveal grid gap-10 border border-border bg-card p-4 sm:p-8 lg:grid-cols-[1.1fr_1fr]">
      <div className="relative">
        <span className="label-mono absolute left-3 top-3 z-10 bg-primary px-2 py-1">
          {t.col.featured}
        </span>
        <FlipImage back={p.back} front={p.front} alt={p.name} tilt />
        <p className="label-mono mt-3 text-muted-foreground">{t.col.flip}</p>
      </div>
      <div className="flex flex-col justify-center gap-6">
        <p className="label-mono text-primary-text">DROP {p.drop}</p>
        <h3 className="font-display text-6xl sm:text-7xl">{p.name}</h3>
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-mono text-2xl">{price(p.price)}</span>
          <StockBadge n={size ? p.stock[size] : totalStock(p)} />
        </div>
        <p className="max-w-md leading-relaxed text-muted-foreground">{t.col.featuredDesc}</p>
        <div>
          <p className="label-mono mb-3">{t.col.size}</p>
          <SizeSelector
            product={p}
            value={size}
            onChange={(s) => {
              setSize(s);
              setMsg("");
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <button id="featured-add" type="button" className="btn-primary" onClick={onAdd}>
            {t.col.add}
          </button>
          <button
            type="button"
            className="label-mono text-muted-foreground underline hover:text-foreground"
            onClick={() => setGuide(true)}
          >
            {t.col.guide}
          </button>
        </div>
        <p className="label-mono min-h-4 text-muted-foreground" aria-live="polite">
          {msg}
        </p>
      </div>
    </article>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const { t, price } = useI18n();
  const { add } = useCart();
  const [color, setColor] = useState(p.colors?.[0]?.id);
  const [size, setSize] = useState<Size | null>(null);
  const c = p.colors?.find((x) => x.id === color);
  const firstAvailable = (["M", "L", "S", "XL"] as Size[]).find((s) => p.stock[s] > 0);
  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <FlipImage back={c?.back ?? p.back} front={c?.front ?? p.front} alt={p.name} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label-mono text-primary-text">DROP {p.drop}</p>
          <h3 className="font-display mt-1 text-3xl">{p.name}</h3>
        </div>
        <span className="font-mono">{price(p.price)}</span>
      </div>
      {p.colors && (
        <div role="radiogroup" aria-label={t.col.color} className="flex items-center gap-2">
          {p.colors.map((x) => (
            <button
              key={x.id}
              type="button"
              role="radio"
              aria-checked={color === x.id}
              aria-label={t.col.colors[x.id as "dark" | "wine"]}
              onClick={() => setColor(x.id)}
              className={`h-7 w-7 border-2 ${color === x.id ? "border-foreground" : "border-border"}`}
              style={{ backgroundColor: x.hex }}
            />
          ))}
          <span className="label-mono ml-2 text-muted-foreground">
            {t.col.colors[color as "dark" | "wine"]}
          </span>
        </div>
      )}
      <SizeSelector product={p} value={size} onChange={setSize} />
      <div className="mt-auto flex items-center justify-between gap-3">
        <StockBadge n={size ? p.stock[size] : totalStock(p)} />
        <button
          type="button"
          className="btn-primary px-5 py-3"
          onClick={() => add(p.id, size ?? firstAvailable!, color)}
          disabled={!firstAvailable}
        >
          {t.col.addShort}
        </button>
      </div>
    </div>
  );
}

function Lookbook() {
  const { t } = useI18n();
  const ref = useReveal<HTMLElement>();
  return (
    <section id="lookbook" ref={ref} className="scroll-mt-20 border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal grid gap-8 lg:grid-cols-2">
          <div>
            <p className="label-mono text-muted-foreground">{t.brand.label}</p>
            <h2 className="font-display mt-4 text-6xl sm:text-8xl">{t.brand.title}</h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-muted-foreground">{t.brand.body}</p>
        </div>
        <img
          src={lookbook}
          alt="Lookbook HeavyWeight Drop 001"
          width={1600}
          height={912}
          loading="lazy"
          className="reveal mt-14 w-full object-cover"
        />
      </div>
    </section>
  );
}

function Fabric() {
  const { t } = useI18n();
  const ref = useReveal<HTMLElement>();
  return (
    <section id="fabric" ref={ref} className="border-t border-border bg-card py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="label-mono reveal text-muted-foreground">{t.fabric.label}</p>
        <ol className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {t.fabric.items.map(([h, b], i) => (
            <li
              key={h}
              className="reveal bg-card p-6"
              style={{ ["--d" as string]: `${i * 100}ms` }}
            >
              <span className="label-mono text-primary-text">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display mt-6 text-4xl">{h}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Custom() {
  const { t } = useI18n();
  const ref = useReveal<HTMLElement>();
  return (
    <section id="personalizar" ref={ref} className="border-t border-border py-24">
      <div className="reveal mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-5xl sm:text-7xl">{t.custom.title}</h2>
          <p className="mt-4 text-muted-foreground">{t.custom.body}</p>
        </div>
        <a href="mailto:hello@heavyweight.pt" className="btn-primary">
          {t.custom.cta} →
        </a>
      </div>
    </section>
  );
}

function MobileBar() {
  const { t, price } = useI18n();
  const { add, setOpen } = useCart();
  const p = getProduct(FEATURED_ID);
  const firstAvailable = (["M", "L", "S", "XL"] as Size[]).find((s) => p.stock[s] > 0);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
      <div>
        <p className="font-display text-lg">{p.name}</p>
        <p className="font-mono text-sm text-muted-foreground">{price(p.price)}</p>
      </div>
      <button
        type="button"
        className="btn-primary px-5 py-3"
        disabled={!firstAvailable}
        onClick={() => {
          if (!firstAvailable) return;
          add(p.id, firstAvailable);
          setOpen(true);
        }}
      >
        {t.mobile.buy}
      </button>
    </div>
  );
}
