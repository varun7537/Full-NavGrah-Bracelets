import mongoose from "mongoose";

const KundliMetaSchema = new mongoose.Schema(
  {
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "KundliFile" },
    originalName: String,
    mimeType: String,
    size: Number,
  },
  { _id: false }
);

const CustomRequestSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true }, // jaise CB-7K3M9Q
    submissionId: { type: String, required: true, unique: true }, // double-submit se bachne ke liye
    productName: { type: String, default: "Custom Bracelet" },

    fullName: { type: String, required: true },
    gender: { type: String, enum: ["female", "male", "other"], required: true },
    phone: { type: String, required: true }, // 10 digit
    whatsappSameAsPhone: { type: Boolean, default: true },
    email: { type: String, default: "" },

    kundliMode: { type: String, enum: ["manual", "upload"], required: true },
    dob: { type: String, default: "" }, // YYYY-MM-DD
    timeOfBirth: { type: String, default: "" }, // HH:mm
    timeUnknown: { type: Boolean, default: false },
    placeOfBirth: { type: String, default: "" },
    kundli: { type: KundliMetaSchema, default: undefined },

    notes: { type: String, required: true },
    consentAt: { type: Date, required: true },

    // Admin ke liye
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "completed", "cancelled"],
      default: "new",
      index: true,
    },
    adminNote: { type: String, default: "", maxlength: 1000 },
  },
  { timestamps: true }
);

CustomRequestSchema.index({ createdAt: -1 });

export default mongoose.models.CustomRequest || mongoose.model("CustomRequest", CustomRequestSchema);