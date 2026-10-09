import { img } from "./img.js";
// Sanity document -> MongoDB document
export function mapSanityPost(d) {
  const content = (d.content || [])
    .filter((b) => b && b.text)
    .map((b) => ({ type: b.kind || "paragraph", text: b.text }));

  const words = content.map((b) => b.text).join(" ").split(/\s+/).filter(Boolean).length;

  return {
    sanityId: d._id,
    slug: d.slug,
    title: d.title,
    excerpt: d.excerpt || "",
    category: d.category || "General",
    coverImage: d.coverImage || "",
    coverImageAlt: d.coverImageAlt || d.title,
    publishedAt: d.publishedAt ? new Date(d.publishedAt) : new Date(),
    readTimeMinutes: d.readTimeMinutes || Math.max(1, Math.ceil(words / 200)),
    author: {
      name: d.author?.name || "Team",
      avatar: d.author?.avatar || "",
      role: d.author?.role || "",
    },
    content,
    tags: d.tags || [],
    relatedRashiId: d.relatedRashiId || "",
  };
}

// MongoDB document -> frontend `BlogPost` shape
export function toClient(d) {
  return {
    id: String(d._id),
    slug: d.slug,
    title: d.title,
    excerpt: d.excerpt,
    category: d.category,
    coverImage: img(d.coverImage, 900),
    coverImageAlt: d.coverImageAlt,
    publishedAt: new Date(d.publishedAt).toISOString(),
    readTimeMinutes: d.readTimeMinutes,
    author: { ...d.author, avatar: img(d.author?.avatar, 96) },
    content: d.content ?? [],
    tags: d.tags ?? [],
    relatedRashiId: d.relatedRashiId || undefined,
    views: d.views ?? 0,
  };
}