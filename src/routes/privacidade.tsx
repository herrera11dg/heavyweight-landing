import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/store/LegalPage";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — HeavyWeight™" },
      { name: "description", content: "Como a HeavyWeight recolhe e protege os teus dados." },
      { property: "og:title", content: "Política de Privacidade — HeavyWeight™" },
      {
        property: "og:description",
        content: "Como a HeavyWeight recolhe e protege os teus dados.",
      },
    ],
  }),
  component: () => <LegalPage doc="privacy" />,
});
