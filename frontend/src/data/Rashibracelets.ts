export type Availability = "In Stock" | "Limited Stock" | "Out of Stock";

export interface PackTier {
  quantity: number;
  price: number;
}

export interface BraceletProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  imageUrl: string;
  imageAlt?: string;
  stone: string;
  material: string;
  color: string;
  type: string;
  rashiId: string;
  availability: Availability;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  salesRank: number; // 1 = best selling
  createdOrder: number; // 1 = newest
  packs?: PackTier[];
}

export interface Rashi {
  id: string;
  name: string; // "Mesh"
  nameHi: string; // "मेष"
  english: string; // "Aries"
  symbol?: string; // "♈"
  image: string; // public folder ka path
}

export const RASHIS: readonly Rashi[] = [
  { id: "mesh", name: "Mesh", nameHi: "मेष", english: "Aries", symbol: "♈", image: "../public/images/aries_image.jpg" },
  { id: "vrishabh", name: "Vrishabh", nameHi: "वृषभ", english: "Taurus", symbol: "♉", image: "../public/images/taurus_image.jpg" },
  { id: "mithun", name: "Mithun", nameHi: "मिथुन", english: "Gemini", symbol: "♊", image: "../public/images/gemini_image.jpg" },
  { id: "kark", name: "Kark", nameHi: "कर्क", english: "Cancer", symbol: "♋", image: "../public/images/cancer_image.jpg" },
  { id: "singh", name: "Singh", nameHi: "सिंह", english: "Leo", symbol: "♌", image: "../public/images/leo_image.jpg" },
  { id: "kanya", name: "Kanya", nameHi: "कन्या", english: "Virgo", symbol: "♍", image: "../public/images/virgo_image.jpg" },
  { id: "tula", name: "Tula", nameHi: "तुला", english: "Libra", symbol: "♎", image: "../public/images/libra_image.jpg" },
  { id: "vrishchik", name: "Vrishchik", nameHi: "वृश्चिक", english: "Scorpio", symbol: "♏", image: "../public/images/scorpio_image.jpg" },
  { id: "dhanu", name: "Dhanu", nameHi: "धनु", english: "Sagittarius", symbol: "♐", image: "../public/images/sagitarius_image.jpg" },
  { id: "makar", name: "Makar", nameHi: "मकर", english: "Capricorn", symbol: "♑", image: "../public/images/capricorn_image.jpg" },
  { id: "kumbh", name: "Kumbh", nameHi: "कुम्भ", english: "Aquarius", symbol: "♒", image: "../public/images/aquarius_image.jpg" },
  { id: "meen", name: "Meen", nameHi: "मीन", english: "Pisces", symbol: "♓", image: "../public/images/pisces_image.jpg" },
];

const rashiMap = new Map(RASHIS.map((r) => [r.id, r]));

export function rashiById(id?: string): Rashi | undefined {
  return id ? rashiMap.get(id) : undefined;
}

export function discountPercent(product: Pick<BraceletProduct, "price" | "mrp">): number {
  if (!product.mrp || product.mrp <= product.price) return 0;
  return Math.round((1 - product.price / product.mrp) * 100);
}

/* ---------- Rashi bracelets section (home) ---------- */

export type Element = "Fire" | "Earth" | "Air" | "Water";

// Agar tumhari purani file me alag colors the, to wahi rakho. Component sirf .base aur .dark use karta hai.
export const ELEMENT_ACCENT: Record<Element, { base: string; dark: string }> = {
  Fire: { base: "#C4552D", dark: "#8A3418" },
  Earth: { base: "#7A8B4F", dark: "#4F5C2F" },
  Air: { base: "#5B8CA8", dark: "#375C73" },
  Water: { base: "#3F6FA3", dark: "#264A73" },
};

export type RashiBadge = "bestseller" | "new" | "limited";

export interface RashiBracelet {
  id: string;
  slug: string;
  name: string;
  rashiId: string;
  rashi: string; // "Mesh"
  rashiEnglish: string; // "Aries"
  element: Element;
  rulingPlanet: string; // "Mars"
  gemstone: string;
  benefit: string;
  spec: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  imageAlt: string;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  badge?: RashiBadge;
}