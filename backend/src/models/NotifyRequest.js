import mongoose from "mongoose";

const NotifyRequestSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    notified: { type: Boolean, default: false }, // email bhejne ke baad true karna
  },
  { timestamps: true }
);

// Ek email ek product ke liye sirf ek baar
NotifyRequestSchema.index({ productId: 1, email: 1 }, { unique: true });

export default mongoose.models.NotifyRequest || mongoose.model("NotifyRequest", NotifyRequestSchema);