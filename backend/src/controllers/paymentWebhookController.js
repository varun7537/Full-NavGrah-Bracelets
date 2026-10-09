import Order from "../models/Order.js";
import { verifyWebhookSignature } from "../services/razorpay.js";
import { notifyOrder, notifyOwner } from "../services/notify.js";

// POST /api/webhooks/razorpay  (raw body, server.js me express.json se PEHLE mount hai)
export async function razorpayWebhook(req, res) {
  const signature = req.get("x-razorpay-signature") || "";

  if (!Buffer.isBuffer(req.body) || !verifyWebhookSignature(req.body, signature)) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  let event;
  try {
    event = JSON.parse(req.body.toString("utf8"));
  } catch {
    return res.status(400).json({ message: "Bad payload" });
  }

  if (event.event !== "qr_code.credited") return res.json({ ignored: true });

  try {
    const qrId = event.payload?.qr_code?.entity?.id;
    const pay = event.payload?.payment?.entity;
    if (!qrId || !pay) return res.json({ ignored: true });

    const order = await Order.findOne({ "payment.qrIds": qrId });
    if (!order) {
      console.warn("Razorpay: QR ke liye order nahi mila:", qrId);
      return res.json({ ignored: true });
    }

    // Amount aur currency match karna zaroori hai
    if (pay.status !== "captured" || pay.currency !== "INR" || pay.amount !== Math.round(order.amount * 100)) {
      console.error(`Razorpay mismatch for ${order.reference}: got ${pay.amount} ${pay.currency} ${pay.status}`);
      await Order.updateOne(
        { _id: order._id },
        { $set: { adminNote: `Payment mismatch (${pay.id}): got ${pay.amount / 100} ${pay.currency}, status ${pay.status}` } }
      );
      return res.json({ ignored: true });
    }

    const now = new Date();
    const paid = await Order.findOneAndUpdate(
      { _id: order._id, status: { $in: ["pending_payment", "payment_submitted"] } },
      {
        $set: { status: "paid", paidAt: now, stage: "confirmed", "payment.paymentId": pay.id },
        $push: { trackingEvents: { stage: "confirmed", at: now, note: "Payment received. Order confirmed" } },
      },
      { new: true }
    ).lean();

    if (!paid) {
      // Pehle se paid, ya order cancelled tha
      if (order.status === "cancelled") {
        await Order.updateOne(
          { _id: order._id },
          { $set: { adminNote: `REFUND NEEDED: paid after cancel (${pay.id})` } }
        );
        console.error(`⚠️ ${order.reference} cancelled tha par payment aayi (${pay.id}). Refund karo.`);
      }
      return res.json({ ok: true });
    }

    notifyOrder(paid, "paid"); // customer: order ID wala message
    notifyOwner(paid); // owner: naya paid order
    res.json({ ok: true });
  } catch (err) {
    if (err.code === 11000) return res.json({ ok: true }); // same payment dobara
    console.error("Razorpay webhook error:", err);
    res.status(500).json({ message: "Webhook failed" }); // Razorpay dobara bhejega
  }
}