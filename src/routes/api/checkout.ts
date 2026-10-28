import { createFileRoute } from "@tanstack/react-router";
import { getServerProduct, isSize } from "@/server/catalog";

const BASE_URL =
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

type Item = { id: string; size?: string; qty?: number; name?: string };

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!process.env.STRIPE_SECRET_KEY) {
          return Response.json(
            { error: "Payment not configured (STRIPE_SECRET_KEY)" },
            { status: 503 },
          );
        }

        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        let body: { items?: Item[]; customer?: Record<string, string> } | null = null;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const { items, customer } = body ?? {};
        if (!Array.isArray(items) || items.length === 0) {
          return Response.json({ error: "Cart is empty" }, { status: 400 });
        }

        const origin = BASE_URL || new URL(request.url).origin;

        try {
          const line_items = [];
          const metaItems: Item[] = [];

          for (const item of items) {
            const p = getServerProduct(String(item.id));
            if (!p) {
              return Response.json({ error: `Unknown product: ${item.id}` }, { status: 400 });
            }
            const size = isSize(item.size) ? item.size : null;
            const stock = size ? p.sizes[size] : null;
            if (size && stock != null && stock <= 0) {
              return Response.json({ error: `Out of stock: ${p.name} ${size}` }, { status: 409 });
            }
            const qty = Math.max(1, Math.min(20, Number(item.qty) || 1));

            line_items.push({
              price_data: {
                currency: "eur",
                product_data: {
                  name: p.name + (size ? ` — ${size}` : ""),
                  images: [`${origin}${p.image}`],
                },
                unit_amount: Math.round(p.price * 100),
              },
              quantity: qty,
            });
            metaItems.push({ id: p.id, name: p.name, size: size ?? undefined, qty });
          }

          const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items,
            customer_email: customer?.email || undefined,
            metadata: {
              name: customer?.name || "",
              phone: customer?.phone || "",
              address: customer?.address || "",
              items: JSON.stringify(metaItems),
            },
            billing_address_collection: "auto",
            success_url: `${origin}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/#colecao`,
          });

          return Response.json({ url: session.url });
        } catch (err) {
          console.error("Checkout error:", err);
          return Response.json({ error: "Could not create checkout session" }, { status: 500 });
        }
      },
    },
  },
});
