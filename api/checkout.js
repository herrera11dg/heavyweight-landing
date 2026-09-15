/* POST /api/checkout — crea una sesión de Stripe Checkout
   Body: { items: [{ id, size, qty }], customer: { name, email, phone, address } }
   Respuesta: { url } (redirigir al usuario a Stripe) */
const { getProduct } = require('../lib/products');

const BASE_URL =
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(503).json({ error: 'Payment not configured (STRIPE_SECRET_KEY)' });
    return;
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  try {
    const { items, customer } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Cart is empty' });
      return;
    }

    // Validar productos y stock en el servidor
    const line_items = [];
    for (const item of items) {
      const p = getProduct(item.id);
      if (!p) {
        res.status(400).json({ error: 'Unknown product: ' + item.id });
        return;
      }
      const size = item.size && p.sizes[item.size] != null ? item.size : null;
      const stock = size ? p.sizes[size] : null;
      if (size && stock != null && stock <= 0) {
        res.status(409).json({ error: 'Out of stock: ' + p.name + ' ' + size });
        return;
      }
      const qty = Math.max(1, Math.min(20, Number(item.qty) || 1));
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: p.name + (size ? ' — ' + size : ''),
            images: [`${BASE_URL}/${p.image}`]
          },
          unit_amount: Math.round(p.price * 100)
        },
        quantity: qty
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      customer_email: customer?.email || undefined,
      metadata: {
        name: customer?.name || '',
        phone: customer?.phone || '',
        address: customer?.address || '',
        items: JSON.stringify(items)
      },
      billing_address_collection: 'auto',
      success_url: `${BASE_URL}/obrigado.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/#colecao`
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Could not create checkout session' });
  }
};
