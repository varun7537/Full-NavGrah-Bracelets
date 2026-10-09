import mongoose from "mongoose";
import { STAGES } from "../utils/orderStages.js";

const ItemSchema = new mongoose.Schema(
  { productId: String, name: String, quantity: Number, unitPrice: Number, lineTotal: Number },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    submissionId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },

    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      address: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    items: { type: [ItemSchema], default: [] },
    itemCount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    savings: { type: Number, default: 0 },
    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending_payment", "payment_submitted", "paid", "cancelled"],
      default: "pending_payment",
      index: true,
    },

    // Manual mode me customer ka diya UTR (sirf claim, verify owner karta hai)
    utr: { type: String, unique: true, sparse: true },

    // Razorpay
    payment: {
      mode: { type: String, default: "" },
      qrId: { type: String, default: "" },
      qrIds: { type: [String], default: [] }, // purane QR par payment aaye to bhi match ho
      qrImageUrl: { type: String, default: "" },
      qrExpiresAt: { type: Date },
      paymentId: { type: String },
    },

    paidAt: { type: Date },
    adminNote: { type: String, default: "", maxlength: 1000 },

    notified: {
      received: { type: Boolean, default: false },
      paid: { type: Boolean, default: false },
      delivered: { type: Boolean, default: false },
      owner: { type: Boolean, default: false },
    },

    // Tracking
    stage: { type: String, enum: STAGES, default: "placed", index: true },
    trackingEvents: {
      type: [new mongoose.Schema({ stage: String, at: Date, note: { type: String, default: "" } }, { _id: false })],
      default: [],
    },
    courier: { type: String, default: "" },
    trackingNumber: { type: String, default: "" },
    trackingUrl: { type: String, default: "" },
    expectedDelivery: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ "payment.qrIds": 1 });
// Ek Razorpay payment sirf ek order ko paid kar sakti hai
OrderSchema.index(
  { "payment.paymentId": 1 },
  { unique: true, partialFilterExpression: { "payment.paymentId": { $type: "string" } } }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);