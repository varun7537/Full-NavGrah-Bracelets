import mongoose from "mongoose";

// File alag collection me, taaki requests ki list fetch karte waqt 5 MB ki files load na hon.
const KundliFileSchema = new mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, index: true },
    data: { type: Buffer, required: true },
    mimeType: { type: String, required: true },
    originalName: { type: String, default: "kundli" },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.KundliFile || mongoose.model("KundliFile", KundliFileSchema);