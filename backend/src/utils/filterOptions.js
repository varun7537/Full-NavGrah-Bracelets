const PRICE_STEP = 50; // frontend slider ke step se match

const uniqueSorted = (arr) =>
  [...new Set(arr.filter(Boolean))].sort((a, b) => a.localeCompare(b));

/** Products ke data se filter options banata hai. Sanity me nayi value aate hi filter me aa jaati hai. */
export function buildFilterOptions(docs) {
  let priceBounds = [0, 5000];

  if (docs.length > 0) {
    const prices = docs.map((d) => d.price);
    const floor = Math.floor(Math.min(...prices) / PRICE_STEP) * PRICE_STEP;
    let ceiling = Math.ceil(Math.max(...prices) / PRICE_STEP) * PRICE_STEP;
    if (ceiling <= floor) ceiling = floor + PRICE_STEP;
    priceBounds = [floor, ceiling];
  }

  return {
    types: uniqueSorted(docs.map((d) => d.type)),
    stones: uniqueSorted(docs.map((d) => d.stone)),
    materials: uniqueSorted(docs.map((d) => d.material)),
    colors: uniqueSorted(docs.map((d) => d.color)),
    priceBounds,
  };
}