import type { BraceletProduct } from "../data/Rashibracelets";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export interface ResolveResponse {
  products: BraceletProduct[];
  /** Ye ids backend me nahi mili (Sanity se hata di gayi). */
  missing: string[];
}

export async function resolveCartProducts(ids: string[]): Promise<ResolveResponse> {
  const res = await fetch(`${API}/cart/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load cart products");
  return res.json();
}

export interface QuoteResponse {
  lines: { productId: string; quantity: number; unitPrice: number; lineTotal: number }[];
  itemCount: number;
  subtotal: number;
  savings: number;
  unavailable: string[]; // out of stock ya missing ids (total me shamil nahi)
}

/** Checkout par call karo: server-side, tamper-proof total. */
export async function quoteCart(
  items: { productId: string; quantity: number }[]
): Promise<QuoteResponse> {
  const res = await fetch(`${API}/cart/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to quote cart");
  return res.json();
}