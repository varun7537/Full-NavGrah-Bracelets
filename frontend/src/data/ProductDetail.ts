import type { BraceletProduct } from "./Rashibracelets";

export interface PackOption {
  id: string; // "pack1", "pack2"
  label: string; // "Pack of 2"
  quantity: number;
  price: number;
  extraOff?: string;
  tag?: string;
}

export interface GalleryItem {
  id: number;
  src: string; // image (video ho to poster)
  alt: string;
  videoUrl?: string;
  thumb?: string;
}

export interface Ingredient {
  name: string;
  benefit: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatarUrl: string;
  verified: boolean;
  rating: number;
  text: string;
}

export interface ReelItem {
  id: number;
  thumbnailUrl: string;
  views: string;
  caption: string;
  videoUrl?: string;
}

export interface InfoSection {
  id: string;
  title: string;
  content: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  text: string;
  verified: boolean;
  createdAt: string;
}

export interface ReviewSummary {
  average: number;
  total: number;
  breakdown: { stars: number; count: number }[];
  /** true = asli approved reviews hain, bars dikhao. */
  hasBreakdown: boolean;
}

export interface ProductDetail {
  product: BraceletProduct;
  tagline: string;
  badges: string[];
  labCertified: boolean;
  intro: string;
  careNote: string;
  ingredients: Ingredient[];
  gallery: GalleryItem[];
  packs: PackOption[];
  relatedProducts: BraceletProduct[];
  testimonials: Testimonial[];
  reels: ReelItem[];
  infoSections: InfoSection[];
  faqs: FaqItem[];
  specs: SpecRow[];
  reviewPhotos: string[];
  lovedByText: string;
  offerEndsAt: string | null;
  stockCount: number | null;
  reviewSummary: ReviewSummary;
  reviews: ReviewItem[];
}

export interface DeliveryResult {
  serviceable: boolean;
  etaDate?: string; // ISO
  days?: number;
  message?: string;
}