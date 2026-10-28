import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "HeavyWeight — Pedido confirmado" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Obrigado,
});

function Obrigado() {
  const { t } = useI18n();
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-4 py-32 sm:px-6">
      <p className="label-mono text-primary-text">{t.thanks.kick}</p>
      <h1 className="font-display mt-6 text-6xl sm:text-8xl">{t.thanks.title}</h1>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">{t.thanks.body}</p>
      <Link to="/" className="btn-primary mt-10">
        {t.thanks.cta} →
      </Link>
    </section>
  );
}
