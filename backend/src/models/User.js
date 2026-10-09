import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, unique: true }, // 10 digit, OTP se verified
    phoneVerifiedAt: { type: Date },
    email: { type: String, default: "", trim: true, lowercase: true },
    address: { type: String, default: "", maxlength: 300 },
    pincode: { type: String, default: "" },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);