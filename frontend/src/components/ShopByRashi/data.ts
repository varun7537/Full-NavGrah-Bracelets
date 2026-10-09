// src/components/RashiBracelets/data.ts

export type Element = "fire" | "earth" | "air" | "water";

export interface Rashi {
  id: string;
  sanskritName: string;
  englishName: string;
  symbol: string;
  element: Element;
  rulingPlanet: string;
  gemstone: string;
  benefit: string;
  slug: string;
}

export interface ElementPalette {
  label: string;
  sanskrit: string;
  light: string;
  base: string;
  dark: string;
}

export interface ElementInfo {
  tagline: string;
  description: string;
}

/** Muted, premium-leaning tones — kept close to the original palette. */
export const ELEMENT_PALETTE: Record<Element, ElementPalette> = {
  fire: {
    label: "Fire",
    sanskrit: "Agni",
    light: "#EFAE83",
    base: "#C2622F",
    dark: "#7A3A18",
  },
  earth: {
    label: "Earth",
    sanskrit: "Prithvi",
    light: "#CBC08D",
    base: "#8C7B3E",
    dark: "#584C22",
  },
  air: {
    label: "Air",
    sanskrit: "Vayu",
    light: "#B8C1E8",
    base: "#6E79AC",
    dark: "#3A4268",
  },
  water: {
    label: "Water",
    sanskrit: "Jal",
    light: "#8FC2CB",
    base: "#3C7581",
    dark: "#1E3C44",
  },
};

export const ELEMENT_INFO: Record<Element, ElementInfo> = {
  fire: {
    tagline: "Momentum, courage, self-belief",
    description:
      "Fire signs move first and think on the way. Their energy is warm, direct, and quick to act — the spark that turns intention into motion.",
  },
  earth: {
    tagline: "Patience, comfort, steady growth",
    description:
      "Earth signs build slowly and thoroughly. Their energy is grounded and practical — the kind of steadiness that compounds over years, not days.",
  },
  air: {
    tagline: "Curiosity, connection, clarity",
    description:
      "Air signs think in conversation and move in ideas. Their energy is light and quick-witted — drawn to people, patterns, and new perspectives.",
  },
  water: {
    tagline: "Intuition, feeling, quiet depth",
    description:
      "Water signs feel first and reason after. Their energy runs deep and inward — sensitive to what others miss, and slow to let it go.",
  },
};

/** True zodiac order, starting from Mesha (Aries). */
export const DEFAULT_RASHIS: Rashi[] = [
  {
    id: "mesha",
    sanskritName: "Mesha",
    englishName: "Aries",
    symbol: "\u2648",
    element: "fire",
    rulingPlanet: "Mangal (Mars)",
    gemstone: "Red Coral",
    benefit: "Sparks initiative and fearless momentum.",
    slug: "mesha",
  },
  {
    id: "vrishabha",
    sanskritName: "Vrishabha",
    englishName: "Taurus",
    symbol: "\u2649",
    element: "earth",
    rulingPlanet: "Shukra (Venus)",
    gemstone: "Diamond",
    benefit: "Grounds you in comfort, patience, and steady progress.",
    slug: "vrishabha",
  },
  {
    id: "mithuna",
    sanskritName: "Mithuna",
    englishName: "Gemini",
    symbol: "\u264A",
    element: "air",
    rulingPlanet: "Budh (Mercury)",
    gemstone: "Emerald",
    benefit: "Sharpens curiosity and easy conversation.",
    slug: "mithuna",
  },
  {
    id: "karka",
    sanskritName: "Karka",
    englishName: "Cancer",
    symbol: "\u264B",
    element: "water",
    rulingPlanet: "Chandra (Moon)",
    gemstone: "Pearl",
    benefit: "Softens the heart and steadies emotional tides.",
    slug: "karka",
  },
  {
    id: "simha",
    sanskritName: "Simha",
    englishName: "Leo",
    symbol: "\u264C",
    element: "fire",
    rulingPlanet: "Surya (Sun)",
    gemstone: "Ruby",
    benefit: "Restores confidence and warm, natural leadership.",
    slug: "simha",
  },
  {
    id: "kanya",
    sanskritName: "Kanya",
    englishName: "Virgo",
    symbol: "\u264D",
    element: "earth",
    rulingPlanet: "Budh (Mercury)",
    gemstone: "Emerald",
    benefit: "Brings order, precision, and quiet focus.",
    slug: "kanya",
  },
  {
    id: "tula",
    sanskritName: "Tula",
    englishName: "Libra",
    symbol: "\u264E",
    element: "air",
    rulingPlanet: "Shukra (Venus)",
    gemstone: "Diamond",
    benefit: "Balances relationships and everyday decisions.",
    slug: "tula",
  },
  {
    id: "vrishchika",
    sanskritName: "Vrishchika",
    englishName: "Scorpio",
    symbol: "\u264F",
    element: "water",
    rulingPlanet: "Mangal (Mars)",
    gemstone: "Red Coral",
    benefit: "Channels intensity into quiet resolve.",
    slug: "vrishchika",
  },
  {
    id: "dhanu",
    sanskritName: "Dhanu",
    englishName: "Sagittarius",
    symbol: "\u2650",
    element: "fire",
    rulingPlanet: "Guru (Jupiter)",
    gemstone: "Yellow Sapphire",
    benefit: "Opens the mind to growth and good fortune.",
    slug: "dhanu",
  },
  {
    id: "makara",
    sanskritName: "Makara",
    englishName: "Capricorn",
    symbol: "\u2651",
    element: "earth",
    rulingPlanet: "Shani (Saturn)",
    gemstone: "Blue Sapphire",
    benefit: "Builds discipline for long, patient climbs.",
    slug: "makara",
  },
  {
    id: "kumbha",
    sanskritName: "Kumbha",
    englishName: "Aquarius",
    symbol: "\u2652",
    element: "air",
    rulingPlanet: "Shani (Saturn)",
    gemstone: "Blue Sapphire",
    benefit: "Frees original thought and independent vision.",
    slug: "kumbha",
  },
  {
    id: "meena",
    sanskritName: "Meena",
    englishName: "Pisces",
    symbol: "\u2653",
    element: "water",
    rulingPlanet: "Guru (Jupiter)",
    gemstone: "Yellow Sapphire",
    benefit: "Deepens compassion and creative intuition.",
    slug: "meena",
  },
];

export const ZODIAC_ORDER = DEFAULT_RASHIS.map((rashi) => rashi.id);

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: "01",
    title: "Discover your rashi",
    description:
      "Tell us your birth date, or trace the wheel yourself, to find the sign that governs your chart.",
  },
  {
    step: "02",
    title: "Understand your gemstone",
    description:
      "Each rashi is paired with a gemstone believed to strengthen its ruling planet's influence.",
  },
  {
    step: "03",
    title: "Choose your bracelet",
    description:
      "Browse pieces set with your gemstone, in a design and size that suits how you'll wear it daily.",
  },
  {
    step: "04",
    title: "Wear your energy",
    description:
      "Keep it on for the everyday moments — it's made to be worn, not kept in a drawer.",
  },
];

export interface Benefit {
  title: string;
  description: string;
}

export const WHY_CHOOSE: Benefit[] = [
  {
    title: "Personalised to your rashi",
    description:
      "Every piece is matched to your specific sign, not a generic birthstone chart.",
  },
  {
    title: "Gemstone-led design",
    description:
      "The gemstone is the starting point of each design, not an afterthought set into a template.",
  },
  {
    title: "Crafted for everyday wear",
    description:
      "Finished and set to withstand daily wear — you shouldn't have to take it off to live your life.",
  },
  {
    title: "A meaningful connection",
    description:
      "Rooted in Vedic astrology's understanding of how planetary energy is believed to shape us.",
  },
  {
    title: "Considered jewellery, first",
    description:
      "Designed to be worn on its own merits — the meaning is a layer, not the only reason to wear it.",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is a rashi?",
    answer:
      "A rashi is one of the twelve zodiac signs used in Vedic astrology, determined by the position of the moon at your time of birth. It's the foundation most Vedic gemstone recommendations are built on.",
  },
  {
    question: "How do I find my rashi?",
    answer:
      "Your rashi is calculated from your birth date, time, and place — it isn't always the same as your Western sun sign. Use the wheel above to explore each sign, or share your birth details with us and we'll confirm it for you.",
  },
  {
    question: "How is my gemstone selected?",
    answer:
      "Each rashi is ruled by a planet, and Vedic tradition pairs that planet with a specific gemstone believed to strengthen its influence. We follow that same pairing for every bracelet in the collection.",
  },
  {
    question: "Which bracelet should I choose?",
    answer:
      "Start with your rashi's gemstone, then choose the design, bead size, and wrist fit that suits how you dress day to day. Our team is also happy to help you pick if you're unsure.",
  },
  {
    question: "Can I wear my bracelet every day?",
    answer:
      "Yes — every piece is finished for daily wear, including light exposure to water. We'd still suggest removing it before swimming or intense workouts to keep the setting in its best condition.",
  },
];

export interface FeaturedProduct {
  id: string;
  name: string;
  gemstone: string;
  element: Element;
  price: string;
  description: string;
}

export const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: "ruby-signature",
    name: "Ruby Signature Bracelet",
    gemstone: "Ruby",
    element: "fire",
    price: "\u20B9 8,900",
    description:
      "For Simha rashi. Faceted ruby beads on a brushed gold chain — bold in the light, quiet on the wrist.",
  },
  {
    id: "pearl-tide",
    name: "Pearl Tide Bracelet",
    gemstone: "Pearl",
    element: "water",
    price: "\u20B9 6,400",
    description:
      "For Karka rashi. Freshwater pearls set close together for a soft, continuous line of light.",
  },
  {
    id: "emerald-clarity",
    name: "Emerald Clarity Bracelet",
    gemstone: "Emerald",
    element: "air",
    price: "\u20B9 9,600",
    description:
      "For Mithuna and Kanya rashi. Clean-cut emerald beads with a single brushed-gold spacer.",
  },
  {
    id: "sapphire-depth",
    name: "Sapphire Depth Bracelet",
    gemstone: "Blue Sapphire",
    element: "earth",
    price: "\u20B9 11,200",
    description:
      "For Makara and Kumbha rashi. Deep blue sapphire beads finished with a matte gold clasp.",
  },
];