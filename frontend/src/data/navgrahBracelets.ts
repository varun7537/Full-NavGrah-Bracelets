// src/data/navgrahBracelets.ts

export interface NavgrahBracelet {
  id: string;
  slug: string;
  planet: string;
  planetName: string;
  planetLabel: string;
  name: string;
  material: string;
  positioning: string;
  price: number;
  compareAtPrice?: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  accent: string;
}

export const NAVGRAH_BRACELETS: NavgrahBracelet[] = [
  {
    id: "navgrah-surya",
    slug: "surya-bracelet",
    planet: "surya",
    planetName: "Surya",
    planetLabel: "Sun",
    name: "Surya Navgrah Bracelet",
    material: "Ruby-hue bead & copper",
    positioning:
      "Traditionally worn for confidence, leadership and vitality — the Sun's bead in the Navgrah tradition.",
    price: 2499,
    compareAtPrice: 2999,
    rating: 4.6,
    reviewCount: 128,
    image: "/products/navgrah/surya.jpg",
    accent: "#C97A3D",
  },
  {
    id: "navgrah-chandra",
    slug: "chandra-bracelet",
    planet: "chandra",
    planetName: "Chandra",
    planetLabel: "Moon",
    name: "Chandra Navgrah Bracelet",
    material: "Moonstone bead & silver-tone",
    positioning:
      "Traditionally associated with calm and emotional balance — the Moon's bead in the Navgrah tradition.",
    price: 1999,
    rating: 4.7,
    reviewCount: 94,
    image: "/products/navgrah/chandra.jpg",
    accent: "#8FA3AE",
  },
  {
    id: "navgrah-mangal",
    slug: "mangal-bracelet",
    planet: "mangal",
    planetName: "Mangal",
    planetLabel: "Mars",
    name: "Mangal Navgrah Bracelet",
    material: "Red coral-hue bead & copper",
    positioning:
      "Traditionally worn for courage and drive — Mars's bead in the Navgrah tradition.",
    price: 2299,
    compareAtPrice: 2699,
    rating: 4.5,
    reviewCount: 76,
    image: "/products/navgrah/mangal.jpg",
    accent: "#B4523A",
  },
  {
    id: "navgrah-budh",
    slug: "budh-bracelet",
    planet: "budh",
    planetName: "Budh",
    planetLabel: "Mercury",
    name: "Budh Navgrah Bracelet",
    material: "Emerald-hue bead & panchdhatu",
    positioning:
      "Traditionally associated with clarity and communication — Mercury's bead in the Navgrah tradition.",
    price: 1899,
    rating: 4.4,
    reviewCount: 52,
    image: "/products/navgrah/budh.jpg",
    accent: "#6B8E5A",
  },
  {
    id: "navgrah-guru",
    slug: "guru-bracelet",
    planet: "guru",
    planetName: "Guru",
    planetLabel: "Jupiter",
    name: "Guru Navgrah Bracelet",
    material: "Yellow sapphire-hue bead & gold-tone",
    positioning:
      "Traditionally worn for wisdom and growth — Jupiter's bead in the Navgrah tradition.",
    price: 2599,
    rating: 4.8,
    reviewCount: 141,
    image: "/products/navgrah/guru.jpg",
    accent: "#B8923F",
  },
  {
    id: "navgrah-shukra",
    slug: "shukra-bracelet",
    planet: "shukra",
    planetName: "Shukra",
    planetLabel: "Venus",
    name: "Shukra Navgrah Bracelet",
    material: "Cut crystal bead & silver-tone",
    positioning:
      "Traditionally associated with harmony and relationships — Venus's bead in the Navgrah tradition.",
    price: 2199,
    rating: 4.6,
    reviewCount: 88,
    image: "/products/navgrah/shukra.jpg",
    accent: "#C08A8A",
  },
  {
    id: "navgrah-shani",
    slug: "shani-bracelet",
    planet: "shani",
    planetName: "Shani",
    planetLabel: "Saturn",
    name: "Shani Navgrah Bracelet",
    material: "Amethyst-hue bead & iron-tone",
    positioning:
      "Traditionally worn for discipline and patience — Saturn's bead in the Navgrah tradition.",
    price: 2399,
    compareAtPrice: 2799,
    rating: 4.5,
    reviewCount: 63,
    image: "/products/navgrah/shani.jpg",
    accent: "#5F6B73",
  },
  {
    id: "navgrah-rahu",
    slug: "rahu-bracelet",
    planet: "rahu",
    planetName: "Rahu",
    planetLabel: "Rahu",
    name: "Rahu Navgrah Bracelet",
    material: "Hessonite-hue bead & panchdhatu",
    positioning:
      "Traditionally associated with ambition and focus — Rahu's bead in the Navgrah tradition.",
    price: 2099,
    rating: 4.3,
    reviewCount: 41,
    image: "/products/navgrah/rahu.jpg",
    accent: "#7C6E86",
  },
  {
    id: "navgrah-ketu",
    slug: "ketu-bracelet",
    planet: "ketu",
    planetName: "Ketu",
    planetLabel: "Ketu",
    name: "Ketu Navgrah Bracelet",
    material: "Cat's eye-hue bead & panchdhatu",
    positioning:
      "Traditionally worn for introspection and release — Ketu's bead in the Navgrah tradition.",
    price: 2099,
    rating: 4.3,
    reviewCount: 37,
    image: "/products/navgrah/ketu.jpg",
    accent: "#7A7266",
  },
];