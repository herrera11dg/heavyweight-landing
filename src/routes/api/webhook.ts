import { createFileRoute } from "@tanstack/react-router";

type CheckoutSession = {
  amount_total: number | null;
  customer_details?: { email?: string | null } | null;
  customer_email?: string | null;
  metadata?: { items?: string } | null;
};

type MetadataItem = { id: string; name?: string; size?: string; qty?: number };

async function sendConfirmationEmail(session: CheckoutSession) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY no configurada — email omitido");
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const items = JSON.parse(session.metadata?.items || "[]") as MetadataItem[];
  const lines = items
    .map((i) => `- ${i.name || i.id}${i.size ? ` (${i.size})` : ""} x${i.qty || 1}`)
    .join("\n");
  const total = ((session.amount_total ?? 0) / 100).toFixed(2);

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "HeavyWeight <pedidos@heavyweight.pt>",
    to: session.customer_details?.email || session.customer_email || "",
    subject: "HeavyWeight — Pedido confirmado",
    text:
      `Obrigado pela tua compra!\n\n${lines}\n\nTotal: €${total}\n\n` +
      `Vamos processar e enviar o teu pedido em breve.\n\n— HeavyWeight`,
  });
}

export const Route = createFileRoute("/api/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
          return Response.json({ error: "Webhook not configured" }, { status: 503 });
        }

        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const rawBody = await request.text();
        const signature = request.headers.get("stripe-signature") || "";

        let event;
        try {
          event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET,
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "Invalid signature";
          console.error("Webhook signature error:", message);
          return new Response(`Webhook Error: ${message}`, { status: 400 });
        }

        if (event.type === "checkout.session.completed") {
          try {
            await sendConfirmationEmail(event.data.object as CheckoutSession);
            // TODO(stock): descontar stock en una BD (Vercel KV / Supabase)
            // cuando haya un backend de inventario multi-usuario.
          } catch (err) {
            console.error("Email error:", err);
          }
        }

        return Response.json({ received: true });
      },
    },
  },
});
