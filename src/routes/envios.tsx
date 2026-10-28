import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/store/LegalPage";

export const Route = createFileRoute("/envios")({
  head: () => ({
    meta: [
      { title: "Envios e Devoluções — HeavyWeight™" },
      {
        name: "description",
        content: "Expedição em 1–3 dias úteis para Portugal e Europa. Devoluções em 15 dias.",
      },
      { property: "og:title", content: "Envios e Devoluções — HeavyWeight™" },
      {
        property: "og:description",
        content: "Expedição em 1–3 dias úteis para Portugal e Europa. Devoluções em 15 dias.",
      },
    ],
  }),
  component: () => <LegalPage doc="shipping" />,
});
