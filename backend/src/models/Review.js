import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    verified: { type: Boolean, default: false }, // order system aane par true karna
    // Naye reviews pehle "pending" rehte hain. Approve karne par hi page par dikhte hain.
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);