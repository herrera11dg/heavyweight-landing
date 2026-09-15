/* POST /api/webhook — recibe eventos de Stripe (firma verificada)
   En checkout.session.completed envía el email de confirmación. */
async function sendConfirmationEmail(session) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('RESEND_API_KEY no configurada — email omitido');
    return;
  }
  const { Resend } = require('resend');
  const resend = new Resend(apiKey);

  const items = JSON.parse(session.metadata.items || '[]');
  const lines = items
    .map((i) => `- ${i.name || i.id}${i.size ? ' (' + i.size + ')' : ''} x${i.qty || 1}`)
    .join('\n');
  const total = (session.amount_total / 100).toFixed(2);

  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'HeavyWeight <pedidos@heavyweight.pt>',
    to: session.customer_details?.email || session.customer_email,
    subject: 'HeavyWeight — Pedido confirmado',
    text:
      `Obrigado pela tua compra!\n\n${lines}\n\nTotal: €${total}\n\n` +
      `Vamos processar e enviar o teu pedido em breve.\n\n— HeavyWeight`
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    res.status(503).json({ error: 'Webhook not configured' });
    return;
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  // Leer el body crudo para verificar la firma de Stripe
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      await sendConfirmationEmail(session);
      // TODO(stock): descontar stock en una BD (Vercel KV / Supabase)
      // cuando haya un backend de inventario multi-usuario.
    } catch (err) {
      console.error('Email error:', err);
    }
  }

  res.status(200).json({ received: true });
};

// Necesario para recibir el body crudo de Stripe
module.exports.config = { api: { bodyParser: false } };
