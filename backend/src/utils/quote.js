import Product from "../models/Product.js";
import { lineTotalFor } from "./pricing.js";

const MAX_ITEMS = 50;
const MAX_QTY = 10;

/** items: [{ productId, quantity }]. Price hamesha MongoDB se, client ka nahi. */
export async function buildQuote(items) {
  const clean = (Array.isArray(items) ? items : [])
    .filter((i) => i && typeof i.productId === "string" && Number.isFinite(i.quantity))
    .slice(0, MAX_ITEMS)
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
    lines.push({
      productId: p.productId,
      name: p.name,
      quantity: item.quantity,
      unitPrice: p.price,
      lineTotal,
    });
  }

  return { lines, unavailable, subtotal, savings, itemCount };
}