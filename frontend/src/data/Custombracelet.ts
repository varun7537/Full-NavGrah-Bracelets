export type Gender = "female" | "male" | "other";
export type KundliMode = "manual" | "upload";

export interface AstrologyDetails {
  fullName: string;
  gender: Gender | "";
  phone: string; // sirf 10 digit
  whatsappSameAsPhone: boolean;
  email: string;
  kundliMode: KundliMode;
  dob: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:mm
  timeUnknown: boolean;
  placeOfBirth: string;
  notes: string;
  consent: boolean;
  kundliFileName: string | null;
}

export const EMPTY_ASTROLOGY_DETAILS: AstrologyDetails = {
  fullName: "",
  gender: "",
  phone: "",
  whatsappSameAsPhone: true,
  email: "",
  kundliMode: "manual",
  dob: "",
  timeOfBirth: "",
  timeUnknown: false,
  placeOfBirth: "",
  notes: "",
  consent: false,
  kundliFileName: null,
};

export const ACCEPTED_KUNDLI_TYPES: string[] = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const MAX_KUNDLI_FILE_MB = 5;

/** Sanity ke "Custom Bracelet" document se aata hai (backend: GET /api/custom-bracelet/product). */
export interface CustomBraceletProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  mrp: number;
  imageUrl: string;
  imageAlt: string;
  highlights: string[];
  /** Country code ke saath, bina + ya space ke. Jaise 918595873812 */
  whatsappNumber: string;
}

/** Backend down ho to bhi form chalta rahe (WhatsApp tab bhi khul jayega). */
export const FALLBACK_CUSTOM_PRODUCT: CustomBraceletProduct = {
  id: "custom-bracelet",
  name: "Custom Kundli Bracelet",
  tagline: "",
  description: "",
  price: 0,
  mrp: 0,
  imageUrl: "",
  imageAlt: "",
  highlights: [],
  whatsappNumber: "918595873812",
};