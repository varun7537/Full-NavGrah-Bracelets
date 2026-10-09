// ============ MANUAL MODE (abhi active) ============
// orderController.js ke imports na tootein, isliye ye stubs hain.
export const paymentMode = () => "manual";
export const razorpayConfigured = () => false;
export async function createUpiQr() {
  throw new Error("Razorpay is disabled (manual UPI mode).");
}
export function verifyWebhookSignature() {
  return false;
}

// ============ RAZORPAY (band hai) ============
// Wapas chalu karne ke liye: upar ke 4 stubs hata do, neeche ka code uncomment karo,
// .env me PAYMENT_MODE=razorpay karo, aur server.js me webhook route uncomment karo.

// import crypto from "node:crypto";
//
// const BASE = "https://api.razorpay.com/v1";
//
// /** "razorpay" (secure, auto-verify) ya "manual" (UTR, owner khud verify kare) */
// export const paymentMode = () => (process.env.PAYMENT_MODE === "razorpay" ? "razorpay" : "manual");
//
// export const razorpayConfigured = () =>
//   Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET);
//
// const authHeader = () =>
//   "Basic " + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
//
// /** Fixed amount ka single-use UPI QR. Amount hamesha order se, client se kabhi nahi. */
// export async function createUpiQr(order, minutes = 30) {
//   const closeBy = Math.floor(Date.now() / 1000) + minutes * 60;
//
//   const res = await fetch(`${BASE}/payments/qr_codes`, {
//     method: "POST",
//     headers: { Authorization: authHeader(), "Content-Type": "application/json" },
//     body: JSON.stringify({
//       type: "upi_qr",
//       name: (process.env.UPI_PAYEE_NAME || "Navgrah Bracelets").slice(0, 40),
//       usage: "single_use",
//       fixed_amount: true,
//       payment_amount: Math.round(order.amount * 100), // paise
//       description: `Order ${order.reference}`,
//       close_by: closeBy,
//       notes: { order_ref: order.reference },
//     }),
//     signal: AbortSignal.timeout(15000),
//   });
//
//   if (!res.ok) throw new Error(`Razorpay QR ${res.status}: ${await res.text()}`);
//   const d = await res.json();
//   return { id: d.id, imageUrl: d.image_url, expiresAt: new Date(closeBy * 1000) };
// }
//
// /** Webhook asli Razorpay se aaya hai ya nahi (HMAC SHA256 of raw body). */
// export function verifyWebhookSignature(rawBody, signature) {
//   const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
//   if (!secret || !signature) return false;
//   const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
//   const a = Buffer.from(expected);
//   const b = Buffer.from(String(signature));
//   return a.length === b.length && crypto.timingSafeEqual(a, b);
// }

// import crypto from "node:crypto";

// const BASE = "https://api.razorpay.com/v1";

// /** "razorpay" (secure, auto-verify) ya "manual" (UTR, owner khud verify kare) */
// export const paymentMode = () => (process.env.PAYMENT_MODE === "razorpay" ? "razorpay" : "manual");

// export const razorpayConfigured = () =>
//   Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET);

// const authHeader = () =>
//   "Basic " + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");

// /** Fixed amount ka single-use UPI QR. Amount hamesha order se, client se kabhi nahi. */
// export async function createUpiQr(order, minutes = 30) {
//   const closeBy = Math.floor(Date.now() / 1000) + minutes * 60;

//   const res = await fetch(`${BASE}/payments/qr_codes`, {
//     method: "POST",
//     headers: { Authorization: authHeader(), "Content-Type": "application/json" },
//     body: JSON.stringify({
//       type: "upi_qr",
//       name: (process.env.UPI_PAYEE_NAME || "Navgrah Bracelets").slice(0, 40),
//       usage: "single_use",
//       fixed_amount: true,
//       payment_amount: Math.round(order.amount * 100), // paise
//       description: `Order ${order.reference}`,
//       close_by: closeBy,
//       notes: { order_ref: order.reference },
//     }),
//     signal: AbortSignal.timeout(15000),
//   });

//   if (!res.ok) throw new Error(`Razorpay QR ${res.status}: ${await res.text()}`);
//   const d = await res.json();
//   return { id: d.id, imageUrl: d.image_url, expiresAt: new Date(closeBy * 1000) };
// }

// /** Webhook asli Razorpay se aaya hai ya nahi (HMAC SHA256 of raw body). */
// export function verifyWebhookSignature(rawBody, signature) {
//   const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
//   if (!secret || !signature) return false;
//   const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
//   const a = Buffer.from(expected);
//   const b = Buffer.from(String(signature));
//   return a.length === b.length && crypto.timingSafeEqual(a, b);
// }