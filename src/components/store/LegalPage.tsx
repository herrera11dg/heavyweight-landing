import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function LegalPage({ doc }: { doc: "privacy" | "terms" | "shipping" }) {
  const { t } = useI18n();
  const d = t.legal[doc];
  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <Link to="/" className="label-mono text-muted-foreground hover:text-foreground">
        {t.legal.back}
      </Link>
      <h1 className="font-display mt-8 text-5xl sm:text-7xl">{d.title}</h1>
      <ol className="mt-10 flex flex-col gap-6">
        {d.body.map((p, i) => (
          <li key={i} className="flex gap-6 border-t border-border pt-6">
            <span className="label-mono text-primary-text">{String(i + 1).padStart(2, "0")}</span>
            <p className="leading-relaxed text-muted-foreground">{p}</p>
          </li>
        ))}
      </ol>
    </article>
  );
}
