// Sirf types. Koi hardcoded data nahi, sab backend se aata hai.

export type BlogBlockType = "paragraph" | "heading" | "quote";

export interface BlogBlock {
  type: BlogBlockType;
  text: string;
}

export interface BlogAuthor {
  name: string;
  avatar: string;
  role?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  coverImageAlt: string;
  publishedAt: string; // ISO
  readTimeMinutes: number;
  author: BlogAuthor;
  content: BlogBlock[];
  tags: string[];
  relatedRashiId?: string;
  views?: number;
}