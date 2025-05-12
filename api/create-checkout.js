const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { cart } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: cart,
      mode: 'payment',
      success_url: 'https://creatorsupportscreator.com/success',
      cancel_url: 'https://creatorsupportscreator.com/cancel',
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
