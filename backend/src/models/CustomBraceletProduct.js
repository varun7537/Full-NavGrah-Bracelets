import mongoose from "mongoose";

const CustomBraceletProductSchema = new mongoose.Schema(
  {
    sanityId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, default: 0, min: 0 },
    mrp: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    whatsappNumber: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    sanityUpdatedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.CustomBraceletProduct ||
  mongoose.model("CustomBraceletProduct", CustomBraceletProductSchema);