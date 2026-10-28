import { createFileRoute } from "@tanstack/react-router";
import { listServerProducts } from "@/server/catalog";

export const Route = createFileRoute("/api/products")({
  server: {
    handlers: {
      GET: async () =>
        Response.json(
          { products: listServerProducts() },
          { headers: { "cache-control": "no-store" } },
        ),
    },
  },
});
