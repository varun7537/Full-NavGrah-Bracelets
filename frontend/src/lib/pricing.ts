import type { PackTier } from "../data/Rashibracelets";

/**
 * Quantity ka total, pack pricing ke saath.
 * Bade pack pehle lagte hain (3 piece = ₹1499), bacha hua single price par.
 * Backend ke utils/pricing.js se bilkul same logic. Dono sync me rakhna.
 */
export function lineTotalFor(unitPrice: number, packs: PackTier[] | undefined, quantity: number): number {
  const tiers = (packs ?? [])
    .filter((p) => p.quantity > 1 && p.price > 0 && p.price < p.quantity * unitPrice)
    .sort((a, b) => b.quantity - a.quantity);

  let remaining = quantity;
  let total = 0;
  for (const tier of tiers) {
    const n = Math.floor(remaining / tier.quantity);
    total += n * tier.price;
    remaining -= n * tier.quantity;
  }
  return total + remaining * unitPrice;
}