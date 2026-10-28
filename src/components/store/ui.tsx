import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useI18n, fmt } from "@/lib/i18n";
import { SIZES, type Product, type Size } from "@/lib/products";

export function Logo() {
  return (
    <span className="font-display text-2xl tracking-wide">
      Heavy<b className="font-normal text-primary-text">Weight</b>
      <sup className="ml-0.5 text-[0.5em]">™</sup>
    </span>
  );
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets: HTMLElement[] = el.classList.contains("reveal") ? [el] : [];
    targets.push(...(Array.from(el.querySelectorAll(".reveal")) as HTMLElement[]));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && (e.target.classList.add("is-in"), io.unobserve(e.target)),
        ),
      { threshold: 0.15 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return ref;
}

export function FlipImage({
  back,
  front,
  alt,
  tilt = false,
  eager = false,
  className = "",
}: {
  back: string;
  front: string;
  alt: string;
  tilt?: boolean;
  eager?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  const [flipped, setFlipped] = useState(false);
  const [zoom, setZoom] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setZoom(!!e?.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e: MouseEvent) => {
    if (
      !tilt ||
      reducedMotion() ||
      !window.matchMedia("(pointer: fine)").matches ||
      !tiltRef.current
    )
      return;
    const r = tiltRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tiltRef.current.style.transform = `rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  };
  const onLeave = () => tiltRef.current && (tiltRef.current.style.transform = "");
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  return (
    <div
      ref={wrap}
      className={`flip ${zoom ? "zoom-in" : ""} ${className}`}
      data-flipped={flipped}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${alt} — ${t.col.flip}`}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={onKey}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 1200 }}
    >
      <div
        ref={tiltRef}
        style={{ transition: "transform .3s ease", transformStyle: "preserve-3d" }}
      >
        <div className="flip-inner">
          <div className="flip-face bg-secondary">
            <img
              src={back}
              alt={alt}
              width={800}
              height={1000}
              loading={eager ? "eager" : "lazy"}
            />
          </div>
          <div className="flip-face flip-back bg-secondary">
            <img src={front} alt="" width={800} height={1000} loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StockBadge({ n }: { n: number }) {
  const { t } = useI18n();
  if (n <= 0)
    return (
      <span className="label-mono border border-border px-2 py-1 text-muted-foreground">
        {t.col.soldOut}
      </span>
    );
  if (n <= 3)
    return (
      <span className="label-mono border border-primary-text px-2 py-1 text-primary-text">
        {fmt(t.col.only, { n })}
      </span>
    );
  return (
    <span className="label-mono inline-flex items-center gap-2 border border-stock px-2 py-1 text-stock">
      <span className="h-1.5 w-1.5 bg-stock" aria-hidden /> {t.col.inStock}
    </span>
  );
}

export function SizeSelector({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: Size | null;
  onChange: (s: Size) => void;
}) {
  const { t } = useI18n();
  return (
    <div role="radiogroup" aria-label={t.col.size} className="flex gap-2">
      {SIZES.map((s) => {
        const out = product.stock[s] <= 0;
        const active = value === s;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={out}
            onClick={() => onChange(s)}
            className={`label-mono h-11 w-12 border transition-colors ${
              active
                ? "border-primary bg-primary text-foreground"
                : "border-border hover:border-foreground"
            } ${out ? "cursor-not-allowed line-through opacity-35" : ""}`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

/** Accessible modal: focus trap, Escape, backdrop click, focus restore. */
export function Modal({
  open,
  onClose,
  label,
  children,
  side = false,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  side?: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const el = panel.current!;
    const focusables = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])',
        ),
      ).filter((x) => !x.hasAttribute("disabled"));
    (focusables()[0] || el).focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1]?.focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className={`fixed inset-0 z-[60] flex bg-overlay ${side ? "justify-end" : "items-center justify-center p-4"}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={
          side
            ? "drawer-in flex h-full w-full max-w-md flex-col border-l border-border bg-card"
            : "max-h-[90vh] w-full max-w-lg overflow-y-auto border border-border bg-card p-6 sm:p-8"
        }
      >
        {children}
      </div>
    </div>
  );
}

export function CloseBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center border border-border text-xl hover:border-foreground"
    >
      ×
    </button>
  );
}
