import mongoose from "mongoose";

const sub = (fields) => new mongoose.Schema(fields, { _id: false });

const PackSchema = sub({
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  tag: { type: String, default: "" },
});

const ProductSchema = new mongoose.Schema(
  {
    sanityId: { type: String, required: true, unique: true, index: true },
    // Frontend ka `product.id` aur URL slug (/collections/<productId>)
    productId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    type: { type: String, default: "", index: true },
    stone: { type: String, default: "", index: true },
    material: { type: String, default: "" },
    color: { type: String, default: "" },
    rashiId: { type: String, default: "", index: true },
    availability: {
      type: String,
      enum: ["In Stock", "Limited Stock", "Out of Stock"],
      default: "In Stock",
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    isBestSeller: { type: Boolean, default: false },
    salesRank: { type: Number, default: 9999 },
    sanityCreatedAt: { type: Date, default: Date.now, index: true },

    // ---- Product detail page ----
    tagline: { type: String, default: "" },
    badges: { type: [String], default: [] },
    labCertified: { type: Boolean, default: true },
    intro: { type: String, default: "" },
    careNote: { type: String, default: "" },
    ingredients: { type: [sub({ name: String, benefit: String })], default: [] },
    gallery: { type: [sub({ src: String, alt: String, videoUrl: String })], default: [] },
    packs: { type: [PackSchema], default: [] },
    relatedProductIds: { type: [String], default: [] },
    testimonials: {
      type: [sub({ name: String, avatar: String, rating: Number, text: String, verified: Boolean })],
      default: [],
    },
    reels: { type: [sub({ thumbnailUrl: String, views: String, caption: String, videoUrl: String })], default: [] },
    infoSections: { type: [sub({ title: String, lines: [String] })], default: [] },
    faqs: { type: [sub({ question: String, answer: String })], default: [] },
    specs: { type: [sub({ label: String, value: String })], default: [] },
    reviewPhotos: { type: [String], default: [] },
    lovedByText: { type: String, default: "" },
    offerEndsAt: { type: Date, default: null },
    stockCount: { type: Number, default: null },

        // ---- Home "Rashi Based Bracelets" section ----
    benefit: { type: String, default: "" },
    spec: { type: String, default: "" },
    featuredOnHome: { type: Boolean, default: false, index: true },
    featuredOrder: { type: Number, default: 9999 },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);