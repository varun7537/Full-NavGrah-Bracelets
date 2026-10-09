import mongoose from "mongoose";

const OtpCodeSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  codeHash: { type: String, default: "" }, // OTP kabhi plain save nahi hota
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, required: true },
  hourStart: { type: Date, required: true },
  sentInHour: { type: Number, default: 0 },
  purgeAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }, // Mongo khud delete kar deta hai
});

export default mongoose.models.OtpCode || mongoose.model("OtpCode", OtpCodeSchema);