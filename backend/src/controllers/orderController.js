import crypto from "node:crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { buildQuote } from "../utils/quote.js";
import { STAGES } from "../utils/orderStages.js";
import { img } from "../utils/img.js";
import { notifyOrder, notifyOwner } from "../services/notify.js";
import { createUpiQr, paymentMode, razorpayConfigured } from "../services/razorpay.js";

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const makeReference = () =>
  "NG-" + Array.from(crypto.randomBytes(6), (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");

const str = (v, max) => String(v ?? "").trim().slice(0, max);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const STAGE_LABEL = {
  placed: "Order placed",
  confirmed: "Order confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

/* ------------------------------ helpers ------------------------------ */

function toClient(order) {
  const mode = paymentMode();
  const base = {
    reference: order.reference,
    amount: order.amount,
    status: order.status,
    itemCount: order.itemCount,
    mode,
  };

  // if (mode === "razorpay") {
  //   return {
  //     ...base,
  //     qrImageUrl: order.payment?.qrImageUrl || "",
  //     qrExpiresAt: order.payment?.qrExpiresAt || null,
  //   };
  // }

  const vpa = process.env.UPI_VPA || "";
  const payeeName = process.env.UPI_PAYEE_NAME || "Store";
  const params = new URLSearchParams({
    pa: vpa,
    pn: payeeName,
    am: order.amount.toFixed(2),
    cu: "INR",
    tn: `Order ${order.reference}`,
    tr: order.reference,
  });
  return { ...base, vpa, payeeName, upiLink: `upi://pay?${params.toString().replace(/\+/g, "%20")}` };
}

/** Razorpay mode: QR na ho ya 2 min me expire hone wala ho to naya banao. */
async function ensureQr(order) {
  // if (paymentMode() !== "razorpay" || order.status !== "pending_payment") return order;

  // const exp = order.payment?.qrExpiresAt ? new Date(order.payment.qrExpiresAt).getTime() : 0;
  // if (order.payment?.qrId && exp > Date.now() + 2 * 60 * 1000) return order;

  // const qr = await createUpiQr(order);
  // order.set("payment.mode", "razorpay");
  // order.set("payment.qrId", qr.id);
  // order.set("payment.qrImageUrl", qr.imageUrl);
  // order.set("payment.qrExpiresAt", qr.expiresAt);
  // order.payment.qrIds.push(qr.id);
  // await order.save();
  return order;
}

/* ------------------------------ CUSTOMER ------------------------------ */

// POST /api/orders   (login zaroori)
export async function createOrder(req, res) {
  try {
    const mode = paymentMode();
    if (mode === "razorpay" && !razorpayConfigured()) {
      return res.status(500).json({ message: "Payments are not set up yet. Please contact us." });
    }
    if (mode === "manual" && !process.env.UPI_VPA) {
      return res.status(500).json({ message: "Payments are not set up yet. Please contact us." });
    }

    const { submissionId, details = {}, items } = req.body || {};
    if (!/^[A-Za-z0-9-]{8,64}$/.test(String(submissionId ?? ""))) {
      return res.status(400).json({ message: "Invalid request. Please refresh and try again." });
    }

    // Same request dobara: pehla order hi do (sirf usi user ko)
    const existing = await Order.findOne({ submissionId });
    if (existing) {
      if (String(existing.user) !== String(req.user._id)) {
        return res.status(400).json({ message: "Invalid request. Please refresh and try again." });
      }
      try {
        await ensureQr(existing);
      } catch (e) {
        console.error(e.message);
        return res.status(502).json({ message: "Could not start payment. Please try again." });
      }
      return res.json(toClient(existing));
    }

    const customer = {
      name: str(details.name, 100) || req.user.name,
      phone: req.user.phone, // OTP se verified number
      email: str(details.email, 254).toLowerCase(),
      address: str(details.address, 300),
      pincode: str(details.pincode, 6),
    };

    if (customer.name.length < 2) return res.status(400).json({ message: "Please enter your name." });
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email)) {
      return res.status(400).json({ message: "Enter a valid email." });
    }
    if (customer.address.length < 10) return res.status(400).json({ message: "Please enter your full address." });
    if (!/^[1-8]\d{5}$/.test(customer.pincode)) return res.status(400).json({ message: "Enter a valid pincode." });

    const quote = await buildQuote(items);
    if (quote.lines.length === 0) return res.status(400).json({ message: "Your cart has no available items." });
    if (quote.unavailable.length > 0) {
      return res.status(400).json({ message: "Some items are no longer available. Please review your cart." });
    }

    let order = null;
    for (let i = 0; i < 5 && !order; i++) {
      try {
        order = await Order.create({
          reference: makeReference(),
          submissionId,
          user: req.user._id,
          customer,
          items: quote.lines,
          itemCount: quote.itemCount,
          subtotal: quote.subtotal,
          savings: quote.savings,
          amount: quote.subtotal, // shipping free
          trackingEvents: [{ stage: "placed", at: new Date(), note: "Order placed" }],
        });
      } catch (err) {
        if (err.code !== 11000) throw err;
        if (err.keyPattern?.submissionId) {
          const ex = await Order.findOne({ submissionId });
          if (ex && String(ex.user) === String(req.user._id)) return res.json(toClient(ex));
        }
      }
    }
    if (!order) throw new Error("Could not generate a unique order reference");

    try {
      await ensureQr(order);
    } catch (e) {
      console.error(e.message);
      // Order pending hai. Retry (same submissionId) par QR dobara banega.
      return res.status(502).json({ message: "Could not start payment. Please try again." });
    }

    if (!req.user.address) {
      User.updateOne({ _id: req.user._id }, { $set: { address: customer.address, pincode: customer.pincode } }).catch(() => {});
    }

    res.status(201).json(toClient(order));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create your order. Please try again." });
  }
}

// GET /api/orders/:reference/status   (frontend isse poll karta hai)
export async function orderStatus(req, res) {
  try {
    const o = await Order.findOne({ reference: req.params.reference, user: req.user._id }).select("status stage").lean();
    if (!o) return res.status(404).json({ message: "Order not found." });
    res.json({ status: o.status, stage: o.stage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not check payment status." });
  }
}

// POST /api/orders/:reference/qr   (QR expire ho gaya to naya)
export async function refreshQr(req, res) {
  try {
    const order = await Order.findOne({ reference: req.params.reference, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found." });
    await ensureQr(order);
    res.json(toClient(order));
  } catch (err) {
    console.error(err.message);
    res.status(502).json({ message: "Could not create a new QR. Please try again." });
  }
}

// POST /api/orders/:reference/payment   body: { utr }   (SIRF manual mode)
// Ye payment CONFIRM nahi karta. Owner bank me dekhkar hi paid karta hai.
export async function submitPayment(req, res) {
  try {
    if (paymentMode() !== "manual") {
      return res.status(400).json({ message: "Payment is confirmed automatically. No UTR needed." });
    }

    const utr = String(req.body?.utr ?? "").trim();
    if (!/^\d{12}$/.test(utr)) {
      return res.status(400).json({ message: "Enter the 12-digit UTR from your UPI app." });
    }

    const order = await Order.findOne({ reference: req.params.reference, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.status === "paid") return res.json({ ok: true });
    if (order.status === "cancelled") return res.status(400).json({ message: "This order was cancelled." });

    order.utr = utr;
    order.status = "payment_submitted";
    try {
      await order.save();
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: "This transaction ID is already used for another order." });
      }
      throw err;
    }

    notifyOrder(order, "received");
    notifyOwner(order.toObject());

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not submit payment details." });
  }
}

// GET /api/orders/mine
export async function listMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("reference status stage amount itemCount items createdAt")
      .lean();

    res.json({
      orders: orders.map((o) => ({
        reference: o.reference,
        status: o.status,
        stage: o.stage,
        amount: o.amount,
        itemCount: o.itemCount,
        items: (o.items || []).map((i) => ({ name: i.name, quantity: i.quantity, lineTotal: i.lineTotal })),
        createdAt: o.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}

/* ------------------------------ PUBLIC TRACKING ------------------------------ */

// GET /api/orders/track/:reference
export async function trackOrder(req, res) {
  try {
    const reference = String(req.params.reference ?? "").trim().toUpperCase();
    if (!/^NG-[A-Z0-9]{6}$/.test(reference)) {
      return res.status(400).json({ message: "Enter a valid order ID (like NG-ABC123)." });
    }

    const o = await Order.findOne({ reference }).lean();
    if (!o) return res.status(404).json({ message: "Order not found. Please check your order ID." });

    const prods = await Product.find({ productId: { $in: (o.items || []).map((i) => i.productId) } })
      .select("productId imageUrl")
      .lean();
    const imgById = new Map(prods.map((p) => [p.productId, p.imageUrl]));

    const events = o.trackingEvents?.length
      ? o.trackingEvents
      : [{ stage: "placed", at: o.createdAt, note: "Order placed" }];

    res.json({
      reference: o.reference,
      customerName: o.customer.name.split(" ")[0],
      status: o.status,
      stage: o.stage || "placed",
      placedAt: o.createdAt,
      amount: o.amount,
      itemCount: o.itemCount,
      items: (o.items || []).map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineTotal: i.lineTotal,
        imageUrl: img(imgById.get(i.productId) || "", 160),
      })),
      events: events.map((e) => ({ stage: e.stage, at: e.at, note: e.note || "" })),
      courier: o.courier || "",
      trackingNumber: o.trackingNumber || "",
      trackingUrl: o.trackingUrl || "",
      expectedDelivery: o.expectedDelivery || null,
      deliveredAt: o.deliveredAt || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch order status." });
  }
}

/* ------------------------------ ADMIN (x-admin-secret) ------------------------------ */

const VIEWS = {
  verify: { status: "payment_submitted" },
  unpaid: { status: "pending_payment" },
  active: { status: "paid", stage: { $ne: "delivered" } },
  delivered: { status: "paid", stage: "delivered" },
  cancelled: { status: "cancelled" },
  all: {},
};

// GET /api/orders?view=active&q=NG-ABC&page=1
export async function listOrders(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 30, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const view = VIEWS[req.query.view] ? req.query.view : "all";

    const filter = { ...VIEWS[view] };
    const q = str(req.query.q, 30);
    if (q) {
      const digits = q.replace(/\D/g, "");
      filter.$or = [{ reference: new RegExp("^" + escapeRe(q), "i") }];
      if (digits.length >= 6) filter.$or.push({ "customer.phone": digits.slice(-10) });
    }

    const keys = Object.keys(VIEWS);
    const [orders, total, ...counts] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-submissionId -payment.qrIds -payment.qrImageUrl -notified")
        .lean(),
      Order.countDocuments(filter),
      ...keys.map((k) => Order.countDocuments(VIEWS[k])),
    ]);

    res.json({
      orders,
      total,
      page,
      pages: Math.ceil(total / limit),
      counts: Object.fromEntries(keys.map((k, i) => [k, counts[i]])),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}

// PATCH /api/orders/:reference
// body: { status?, stage?, stageNote?, courier?, trackingNumber?, trackingUrl?, expectedDelivery?, adminNote? }
export async function updateOrder(req, res) {
  try {
    const b = req.body || {};
    const order = await Order.findOne({ reference: req.params.reference });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const now = new Date();
    let changed = false;

    if (b.status !== undefined) {
      if (!["pending_payment", "payment_submitted", "paid", "cancelled"].includes(b.status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      if (order.status === "paid" && b.status !== "paid" && b.status !== "cancelled") {
        return res.status(400).json({ message: "A paid order can only be cancelled." });
      }
      order.status = b.status;
      if (b.status === "paid") {
        if (!order.paidAt) order.paidAt = now;
        if (order.stage === "placed") {
          order.stage = "confirmed";
          order.trackingEvents.push({ stage: "confirmed", at: now, note: STAGE_LABEL.confirmed });
        }
      }
      changed = true;
    }

    if (b.stage !== undefined) {
      if (!STAGES.includes(b.stage)) {
        return res.status(400).json({ message: `Invalid stage. Use one of: ${STAGES.join(", ")}` });
      }
      if (order.status === "cancelled") return res.status(400).json({ message: "This order is cancelled." });
      if (order.status !== "paid") return res.status(400).json({ message: "Mark the payment as paid first." });
      if (b.stage !== order.stage) {
        order.stage = b.stage;
        order.trackingEvents.push({ stage: b.stage, at: now, note: str(b.stageNote, 200) || STAGE_LABEL[b.stage] });
        if (b.stage === "delivered") order.deliveredAt = now;
        changed = true;
      }
    }

    if (b.courier !== undefined) { order.courier = str(b.courier, 80); changed = true; }
    if (b.trackingNumber !== undefined) { order.trackingNumber = str(b.trackingNumber, 80); changed = true; }
    if (b.trackingUrl !== undefined) {
      const url = str(b.trackingUrl, 300);
      if (url && !/^https?:\/\//i.test(url)) {
        return res.status(400).json({ message: "Tracking URL must start with http:// or https://" });
      }
      order.trackingUrl = url;
      changed = true;
    }
    if (b.expectedDelivery !== undefined) {
      const d = b.expectedDelivery ? new Date(b.expectedDelivery) : undefined;
      if (d && Number.isNaN(d.getTime())) return res.status(400).json({ message: "Invalid expected delivery date" });
      order.expectedDelivery = d;
      changed = true;
    }
    if (b.adminNote !== undefined) { order.adminNote = str(b.adminNote, 1000); changed = true; }

    if (!changed) return res.status(400).json({ message: "Nothing to update" });

    await order.save();

    const plain = order.toObject();
    if (order.status === "paid") notifyOrder(plain, "paid"); // flag se ek hi baar jata hai
    if (order.status === "paid" && order.stage === "delivered") notifyOrder(plain, "delivered");

    res.json({ reference: order.reference, status: order.status, stage: order.stage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order" });
  }
}