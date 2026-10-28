import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/store/LegalPage";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos e Condições — HeavyWeight™" },
      { name: "description", content: "Termos e condições de compra na loja HeavyWeight." },
      { property: "og:title", content: "Termos e Condições — HeavyWeight™" },
      { property: "og:description", content: "Termos e condições de compra na loja HeavyWeight." },
    ],
  }),
  component: () => <LegalPage doc="terms" />,
});
