import Product from "../models/Product.js";
import Order from "../models/Order.js";

// ⚠️ Apni store ki asli policies yaha likho. Bot sirf yahi facts batayega.
const STORE_FACTS = `
- Store: Navgrah Bracelets, natural crystal and rashi-gemstone bracelets (India).
- Payment: UPI QR code at checkout. After paying, the customer enters the 12-digit UTR; we verify and confirm the order.
- Order updates are sent on the customer's verified mobile number via WhatsApp and SMS.
- Delivery: usually 3 days for metro cities, about 5 days elsewhere in India. Shipping is free on all orders.
- Returns: 7-day easy returns if unused and in original packaging.
- Bracelets are lab certified. Pack discounts exist on some products (e.g. pack of 2 or 3).
- Custom kundli-based bracelet: customer fills the form at /custom-bracelet and our astrologer contacts them.
- Login is by name + mobile OTP. Profile and order history are at /profile.
`;

const STATUS_TEXT = {
  pending_payment: "payment pending",
  payment_submitted: "payment received, being verified by us",
  paid: "payment confirmed, order is being prepared",
  cancelled: "cancelled",
};

let catalogCache = { text: "", at: 0 };

async function catalogText() {
  if (Date.now() - catalogCache.at < 60_000 && catalogCache.text) return catalogCache.text;

  const docs = await Product.find()
    .sort({ salesRank: 1 })
    .limit(80)
    .select("productId name price mrp stone rashiId availability")
    .lean();

  const text = docs.length
    ? docs
        .map(
          (p) =>
            `- ${p.name} | id: ${p.productId} | Rs ${p.price}${p.mrp > p.price ? ` (MRP ${p.mrp})` : ""} | stone: ${
              p.stone || "-"
            } | rashi: ${p.rashiId || "all"} | ${p.availability} | page: /bracelets/${p.productId}`
        )
        .join("\n")
    : "(no products available right now)";

  catalogCache = { text, at: Date.now() };
  return text;
}

async function userContext(user) {
  if (!user) {
    return "The visitor is NOT logged in. For order questions, ask them to login using the Login button in the top menu, then check /profile.";
  }
  const orders = await Order.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("reference status amount items createdAt")
    .lean();

  const list = orders.length
    ? orders
        .map(
          (o) =>
            `- ${o.reference} | ${new Date(o.createdAt).toLocaleDateString("en-IN")} | Rs ${o.amount} | ${
              STATUS_TEXT[o.status] || o.status
            } | items: ${(o.items || []).map((i) => `${i.name} x${i.quantity}`).join(", ")}`
        )
        .join("\n")
    : "(no orders yet)";

  return `The visitor is logged in as ${user.name}. Their own recent orders (only share these with them):\n${list}`;
}

function buildSystem(catalog, ctx) {
  const wa = process.env.DEFAULT_WHATSAPP_NUMBER;
  return `You are the friendly shopping assistant of Navgrah Bracelets, an Indian online store.

LANGUAGE: Reply in the same language the customer writes in (Hinglish, Hindi or English). Keep replies short (under 120 words), warm and clear. Plain text only, no markdown, no asterisks.

RULES:
- Use ONLY the store facts and product list below for prices, stock, policies and order status. Never invent a product, price, offer or delivery date. If you do not know, say so and offer WhatsApp support${wa ? ` on +${wa}` : ""}.
- When you suggest a product, mention its name, price and its page path like /bracelets/<id> so the customer can open it.
- Astrology and gemstone benefits are traditional beliefs. Never promise guaranteed results, and never give medical, legal or financial advice.
- For a personal kundli-based recommendation, suggest /custom-bracelet.
- Never ask for or accept OTPs, passwords, card or bank details. For a payment problem, ask them to contact support.
- Stay on topic (the store, bracelets, rashi, orders, delivery). Politely decline unrelated requests.

STORE FACTS:
${STORE_FACTS}

PRODUCTS:
${catalog}

CUSTOMER:
${ctx}`;
}

// POST /api/chat   body: { messages: [{ role, content }] }
export async function chat(req, res) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(503).json({ message: "Chat is not available right now." });

  const raw = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const messages = raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 1000) }));

  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ message: "Please type a message." });
  }

  try {
    const [catalog, ctx] = await Promise.all([catalogText(), userContext(req.user)]);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.CHAT_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: buildSystem(catalog, ctx),
        messages,
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!r.ok) {
      console.error("Chat API error:", r.status, await r.text());
      return res.status(502).json({ message: "Sorry, I couldn't answer right now. Please try again." });
    }

    const data = await r.json();
    const reply = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    res.json({ reply: reply || "Sorry, I couldn't understand that. Could you rephrase?" });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(502).json({ message: "Sorry, I couldn't answer right now. Please try again." });
  }
}