import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["paragraph", "heading", "quote"], default: "paragraph" },
    text: { type: String, required: true },
  },
  { _id: false }
);

const BlogPostSchema = new mongoose.Schema(
  {
    sanityId: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    category: { type: String, default: "General", index: true },
    coverImage: { type: String, default: "" },
    coverImageAlt: { type: String, default: "" },
    publishedAt: { type: Date, default: Date.now, index: true },
    readTimeMinutes: { type: Number, default: 1 },
    author: {
      name: { type: String, default: "Team" },
      avatar: { type: String, default: "" },
      role: { type: String, default: "" },
    },
    content: { type: [BlockSchema], default: [] },
    tags: { type: [String], default: [] },
    relatedRashiId: { type: String, default: "" },
    views: { type: Number, default: 0 }, // sirf MongoDB me, Sanity sync isko overwrite nahi karta
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);