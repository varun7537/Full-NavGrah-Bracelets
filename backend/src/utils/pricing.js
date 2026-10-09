/**
 * Quantity ka total, pack pricing ke saath.
 * Frontend ke lib/pricing.ts se bilkul same logic. Dono sync me rakhna.
 */
export function lineTotalFor(unitPrice, packs, quantity) {
  const tiers = (packs || [])
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