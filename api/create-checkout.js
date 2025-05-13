const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // ✅ Allow CORS from Framer custom domain
  res.setHeader("Access-Control-Allow-Origin", "https://www.creatorsupportscreator.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Block non-POST requests
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  // ✅ Check for Stripe secret key
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("🚨 STRIPE_SECRET_KEY is missing from environment variables");
    return res.status(500).json({ error: "Stripe secret key not found" });
  }

  // ✅ Extract cart from request body
  const { cart } = req.body;
  if (!cart || !Array.isArray(cart)) {
    return res.status(400).json({ error: "Invalid cart format" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: cart,
      mode: "payment",
      success_url: "https://creatorsupportscreator.com/success",
      cancel_url: "https://creatorsupportscreator.com/cancel",
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe session error:", error);
    res.status(500).json({ error: error.message });
  }
}
