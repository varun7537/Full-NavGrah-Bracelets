import type { StaticImageData } from "next/image";

export interface Purpose {
  id:
    | "focus"
    | "balance"
    | "confidence"
    | "prosperity"
    | "calm"
    | "strength";

  number: string;
  name: string;
  tagline: string;
  material: string;
  productName: string;
  price: string;
  href: string;
  accent: string;
  accentSoft: string;
  image: StaticImageData;
  imageAlt: string;
}
