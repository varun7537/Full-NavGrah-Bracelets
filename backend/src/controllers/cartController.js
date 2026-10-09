import Product from "../models/Product.js";
import { productToClient } from "../utils/productMapper.js";

const MAX_IDS = 50;
const MAX_QTY = 10;

// POST /api/cart/resolve   body: { ids: string[] }
export async function resolveCart(req, res) {
  try {
    const raw = req.body?.ids;
    if (!Array.isArray(raw)) return res.status(400).json({ message: "ids must be an array" });

    const ids = [...new Set(raw.filter((x) => typeof x === "string" && x.trim()))].slice(0, MAX_IDS);
    if (ids.length === 0) return res.json({ products: [], missing: [] });

    const docs = await Product.find({ productId: { $in: ids } }).lean();
    const found = new Set(docs.map((d) => d.productId));

    res.json({
      products: docs.map(productToClient),
      missing: ids.filter((id) => !found.has(id)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to resolve cart" });
  }
}

// POST /api/cart/quote   body: { items: [{ productId, quantity }] }
// Price aur pack pricing hamesha MongoDB se, client ka bheja hua price kabhi nahi.
export async function quoteCart(req, res) {
  try {
    const items = req.body?.items;
    if (!Array.isArray(items)) return res.status(400).json({ message: "items must be an array" });

    const clean = items
      .filter((i) => i && typeof i.productId === "string" && Number.isFinite(i.quantity))
      .slice(0, MAX_IDS)
      .map((i) => ({
        productId: i.productId,
        quantity: Math.min(MAX_QTY, Math.max(1, Math.round(i.quantity))),
      }));

    const docs = await Product.find({ productId: { $in: clean.map((i) => i.productId) } }).lean();
    const byId = new Map(docs.map((d) => [d.productId, d]));

    const lines = [];
    const unavailable = [];
    let subtotal = 0;
    let savings = 0;
    let itemCount = 0;

    for (const item of clean) {
      const p = byId.get(item.productId);
      if (!p || p.availability === "Out of Stock") {
        unavailable.push(item.productId);
        continue;
      }
      const lineTotal = lineTotalFor(p.price, p.packs, item.quantity);
      subtotal += lineTotal;
      savings += Math.max(0, (p.mrp || p.price) * item.quantity - lineTotal);
      itemCount += item.quantity;
      lines.push({ productId: p.productId, quantity: item.quantity, unitPrice: p.price, lineTotal });
    }

    res.json({ lines, itemCount, subtotal, savings, unavailable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to quote cart" });
  }
}