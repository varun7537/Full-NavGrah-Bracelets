"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useCart } from "./CartContext";
import { useAuth } from "../Auth/AuthContext";
import { formatINR } from "../../lib/Currency";
// Razorpay ke liye (band): getOrderStatus, refreshQr
import { createOrder, submitPayment, OrderError, type OrderResult } from "../../lib/orderApi";
// import { createOrder, getOrderStatus, refreshQr, submitPayment, OrderError, type OrderResult } from "../../lib/orderApi";
import { CloseIcon } from "../Collections/icons";

type Step = "details" | "pay" | "done";

const inputCls =
  "w-full rounded-lg border border-[#e7dfd5] bg-white px-3 py-2.5 text-sm text-[#241c16] outline-none focus:border-[#a47735]";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `sub-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { lines, subtotal, clear } = useCart();

  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    address: user?.address ?? "",
    pincode: user?.pincode ?? "",
  });
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Retry / double click par duplicate order na bane
  const submissionId = useRef(newId());

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const close = () => onClose();

  /* ================= RAZORPAY (band) =================
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  // Payment aate hi apne aap confirm (har 3 sec status check)
  useEffect(() => {
    if (step !== "pay" || !order || order.mode !== "razorpay") return;
    let stopped = false;
    const tick = async () => {
      try {
        const s = await getOrderStatus(order.reference);
        if (stopped) return;
        if (s.status === "paid") { clear(); setStep("done"); }
        else if (s.status === "cancelled") setError("This order was cancelled. Please place a new order.");
      } catch {}
    };
    const id = window.setInterval(tick, 3000);
    return () => { stopped = true; window.clearInterval(id); };
  }, [step, order, clear]);

  // QR expiry countdown
  useEffect(() => {
    if (step !== "pay" || !order?.qrExpiresAt) return setSecondsLeft(null);
    const end = new Date(order.qrExpiresAt).getTime();
    const update = () => setSecondsLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [step, order?.qrExpiresAt]);

  const newQr = async () => {
    if (!order) return;
    setError(""); setLoading(true);
    try { setOrder(await refreshQr(order.reference)); }
    catch (e) { setError(e instanceof OrderError ? e.message : "Something went wrong."); }
    finally { setLoading(false); }
  };
  (Razorpay JSX bhi yahi tha: <img src={order.qrImageUrl} /> + "Waiting for your payment" + expiry/"Get a new QR")
  ===================================================== */

  const generateQr = async () => {
    if (!user) return setError("Please login first to continue.");
    if (form.name.trim().length < 2) return setError("Please enter your name.");
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      return setError("Enter a valid email, or leave it blank.");
    }
    if (form.address.trim().length < 10) return setError("Please enter your full address.");
    if (!/^[1-8]\d{5}$/.test(form.pincode)) return setError("Enter a valid 6-digit pincode.");

    const items = lines
      .filter((l) => l.product.availability !== "Out of Stock")
      .map((l) => ({ productId: l.product.id, quantity: l.quantity }));
    if (items.length === 0) return setError("Your cart has no available items.");

    setError("");
    setLoading(true);
    try {
      const result = await createOrder({
        submissionId: submissionId.current,
        details: {
          name: form.name.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          pincode: form.pincode,
        },
        items,
      });
      setOrder(result);
      setStep("pay");
    } catch (e) {
      setError(
        e instanceof OrderError && e.status === 401
          ? "Your session expired. Please login again."
          : e instanceof OrderError
          ? e.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  /* UTR sirf claim hai: order confirm NAHI hota, owner bank me dekhkar "paid" karta hai */
  const submitUtr = async () => {
    if (!order) return;
    if (!/^\d{12}$/.test(utr.trim())) return setError("Enter the 12-digit UTR / transaction ID from your UPI app.");
    setError("");
    setLoading(true);
    try {
      await submitPayment(order.reference, utr.trim());
      clear();
      setStep("done");
    } catch (e) {
      setError(e instanceof OrderError ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:px-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={close} className="absolute inset-0 bg-black/40" />

      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[#6d6259] hover:bg-[#f5eee5]"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        {/* STEP 1: details */}
        {step === "details" && (
          <div className="space-y-3">
            <h2 className="pr-8 text-lg font-semibold text-[#241c16]">Delivery details</h2>
            <p className="text-sm text-[#6d6259]">
              Total: <span className="font-semibold text-[#241c16]">{formatINR(subtotal)}</span>
            </p>

            <input className={inputCls} placeholder="Full name" value={form.name} onChange={set("name")} autoComplete="name" />
            <p className="rounded-lg bg-[#faf8f4] px-3 py-2 text-xs text-[#6d6259]">
              Order updates will be sent to <span className="font-medium text-[#241c16]">+91 {user?.phone}</span> (verified)
            </p>
            <input className={inputCls} placeholder="Email (optional)" value={form.email} onChange={set("email")} type="email" autoComplete="email" />
            <textarea
              className={`${inputCls} resize-none`}
              placeholder="Full address (house, street, city, state)"
              rows={3}
              value={form.address}
              onChange={set("address")}
              autoComplete="street-address"
            />
            <input
              className={inputCls}
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
              inputMode="numeric"
              maxLength={6}
              autoComplete="postal-code"
            />

            {error && <p role="alert" className="text-xs text-red-700">{error}</p>}

            <button
              type="button"
              onClick={generateQr}
              disabled={loading}
              className="w-full rounded-full bg-[#211b17] py-3 text-sm font-semibold text-white transition hover:bg-[#332822] disabled:opacity-60"
            >
              {loading ? "Please wait…" : "Generate payment QR"}
            </button>
          </div>
        )}

        {/* STEP 2: QR */}
        {step === "pay" && order && order.upiLink && (
          <div className="space-y-4 text-center">
            <h2 className="pr-8 text-left text-lg font-semibold text-[#241c16]">Scan & pay</h2>

            <p className="text-3xl font-semibold text-[#241c16]">{formatINR(order.amount)}</p>

            <div className="mx-auto flex w-fit rounded-2xl border border-[#e7dfd5] bg-white p-4">
              <QRCodeSVG value={order.upiLink} size={208} level="M" marginSize={0} />
            </div>

            <p className="text-xs text-[#6d6259]">
              Open any UPI app (GPay, PhonePe, Paytm…) and scan this QR. The amount is filled in for you.
            </p>

            <a
              href={order.upiLink}
              className="inline-block rounded-full border border-[#e7dfd5] px-5 py-2 text-xs font-semibold text-[#241c16] hover:border-[#a47735] sm:hidden"
            >
              On your phone? Open UPI app
            </a>

            <p className="text-xs text-[#6d6259]">
              UPI ID: <span className="font-medium text-[#241c16]">{order.vpa}</span> · Order{" "}
              <span className="font-semibold tracking-wide text-[#241c16]">{order.reference}</span>
            </p>

            <div className="border-t border-[#efe8dc] pt-4 text-left">
              <label htmlFor="utr" className="block text-sm font-medium text-[#241c16]">
                After paying, enter the UTR / transaction ID
              </label>
              <input
                id="utr"
                className={`${inputCls} mt-2`}
                placeholder="12-digit UTR"
                value={utr}
                onChange={(e) => setUtr(e.target.value.replace(/\D/g, "").slice(0, 12))}
                inputMode="numeric"
              />
              <p className="mt-2 text-[11px] text-[#a89d8f]">
                Your order is confirmed only after we see the payment in our bank account.
              </p>
              {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
              <button
                type="button"
                onClick={submitUtr}
                disabled={loading}
                className="mt-3 w-full rounded-full bg-[#211b17] py-3 text-sm font-semibold text-white transition hover:bg-[#332822] disabled:opacity-60"
              >
                {loading ? "Submitting…" : "I have paid"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: done */}
        {step === "done" && order && (
          <div className="py-4 text-center">
            <p className="text-lg font-semibold text-[#241c16]">Thank you!</p>
            <p className="mt-2 text-sm text-[#6d6259]">
              We received your payment details. Your order will be confirmed once we verify the payment. You will get a
              WhatsApp / SMS with your order confirmation.
            </p>
            <p className="mx-auto mt-4 w-fit rounded-xl border border-[#e7dfd5] px-4 py-2.5 text-sm text-[#241c16]">
              Order ID: <span className="font-semibold tracking-wide">{order.reference}</span>
            </p>
            <Link
              href={`/order-tracking?id=${order.reference}`}
              onClick={close}
              className="mt-4 inline-block text-sm font-semibold text-[#8c6327] underline underline-offset-2"
            >
              Track this order
            </Link>
            <div>
              <button
                type="button"
                onClick={close}
                className="mt-5 rounded-full bg-[#211b17] px-8 py-2.5 text-sm font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div> 
    </div>
  );
}


// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import { QRCodeSVG } from "qrcode.react";
// import { useCart } from "./CartContext";
// import { useAuth } from "../Auth/AuthContext";
// import { formatINR } from "../../lib/Currency";
// import {
//   createOrder,
//   getOrderStatus,
//   refreshQr,
//   submitPayment,
//   OrderError,
//   type OrderResult,
// } from "../../lib/orderApi";
// import { CloseIcon } from "../Collections/icons";

// type Step = "details" | "pay" | "done";

// const inputCls =
//   "w-full rounded-lg border border-[#e7dfd5] bg-white px-3 py-2.5 text-sm text-[#241c16] outline-none focus:border-[#a47735]";

// function newId(): string {
//   if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
//   return `sub-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
// }

// export default function CheckoutModal({ onClose }: { onClose: () => void }) {
//   const { user } = useAuth();
//   const { lines, subtotal, clear } = useCart();

//   const [step, setStep] = useState<Step>("details");
//   const [form, setForm] = useState({
//     name: user?.name ?? "",
//     email: user?.email ?? "",
//     address: user?.address ?? "",
//     pincode: user?.pincode ?? "",
//   });
//   const [order, setOrder] = useState<OrderResult | null>(null);
//   const [utr, setUtr] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

//   const submissionId = useRef(newId());

//   const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
//     setForm((f) => ({ ...f, [k]: e.target.value }));

//   const close = () => {
//     if (step === "done") clear();
//     onClose();
//   };

//   /* ---- Razorpay: payment aate hi apne aap confirm (har 3 sec status check) ---- */
//   useEffect(() => {
//     if (step !== "pay" || !order || order.mode !== "razorpay") return;
//     let stopped = false;

//     const tick = async () => {
//       try {
//         const s = await getOrderStatus(order.reference);
//         if (stopped) return;
//         if (s.status === "paid") {
//           clear(); // paisa aa gaya, ab cart saaf
//           setStep("done");
//         } else if (s.status === "cancelled") {
//           setError("This order was cancelled. Please place a new order.");
//         }
//       } catch {
//         /* network blip: agli baar dobara */
//       }
//     };

//     const id = window.setInterval(tick, 3000);
//     return () => {
//       stopped = true;
//       window.clearInterval(id);
//     };
//   }, [step, order, clear]);

//   /* ---- QR expiry countdown ---- */
//   useEffect(() => {
//     if (step !== "pay" || !order?.qrExpiresAt) return setSecondsLeft(null);
//     const end = new Date(order.qrExpiresAt).getTime();
//     const update = () => setSecondsLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
//     update();
//     const id = window.setInterval(update, 1000);
//     return () => window.clearInterval(id);
//   }, [step, order?.qrExpiresAt]);

//   const generateQr = async () => {
//     if (!user) return setError("Please login first to continue.");
//     if (form.name.trim().length < 2) return setError("Please enter your name.");
//     if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
//       return setError("Enter a valid email, or leave it blank.");
//     }
//     if (form.address.trim().length < 10) return setError("Please enter your full address.");
//     if (!/^[1-8]\d{5}$/.test(form.pincode)) return setError("Enter a valid 6-digit pincode.");

//     const items = lines
//       .filter((l) => l.product.availability !== "Out of Stock")
//       .map((l) => ({ productId: l.product.id, quantity: l.quantity }));
//     if (items.length === 0) return setError("Your cart has no available items.");

//     setError("");
//     setLoading(true);
//     try {
//       const result = await createOrder({
//         submissionId: submissionId.current,
//         details: {
//           name: form.name.trim(),
//           email: form.email.trim(),
//           address: form.address.trim(),
//           pincode: form.pincode,
//         },
//         items,
//       });
//       setOrder(result);
//       if (result.status === "paid") {
//         clear();
//         setStep("done");
//       } else {
//         setStep("pay");
//       }
//     } catch (e) {
//       setError(
//         e instanceof OrderError && e.status === 401
//           ? "Your session expired. Please login again."
//           : e instanceof OrderError
//           ? e.message
//           : "Something went wrong."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const newQr = async () => {
//     if (!order) return;
//     setError("");
//     setLoading(true);
//     try {
//       setOrder(await refreshQr(order.reference));
//     } catch (e) {
//       setError(e instanceof OrderError ? e.message : "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---- Manual mode: UTR sirf claim hai, order confirm NAHI hota ---- */
//   const submitUtr = async () => {
//     if (!order) return;
//     if (!/^\d{12}$/.test(utr.trim())) return setError("Enter the 12-digit UTR / transaction ID from your UPI app.");
//     setError("");
//     setLoading(true);
//     try {
//       await submitPayment(order.reference, utr.trim());
//       clear();
//       setStep("done");
//     } catch (e) {
//       setError(e instanceof OrderError ? e.message : "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const expired = secondsLeft !== null && secondsLeft <= 0;
//   const mm = secondsLeft !== null ? String(Math.floor(secondsLeft / 60)).padStart(2, "0") : "";
//   const ss = secondsLeft !== null ? String(secondsLeft % 60).padStart(2, "0") : "";
//   const confirmed = order?.mode === "razorpay";

//   return (
//     <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:px-4" role="dialog" aria-modal="true">
//       <button type="button" aria-label="Close" onClick={close} className="absolute inset-0 bg-black/40" />

//       <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
//         <button
//           type="button"
//           onClick={close}
//           aria-label="Close"
//           className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[#6d6259] hover:bg-[#f5eee5]"
//         >
//           <CloseIcon className="h-4 w-4" />
//         </button>

//         {/* STEP 1: details */}
//         {step === "details" && (
//           <div className="space-y-3">
//             <h2 className="pr-8 text-lg font-semibold text-[#241c16]">Delivery details</h2>
//             <p className="text-sm text-[#6d6259]">
//               Total: <span className="font-semibold text-[#241c16]">{formatINR(subtotal)}</span>
//             </p>

//             <input className={inputCls} placeholder="Full name" value={form.name} onChange={set("name")} autoComplete="name" />
//             <p className="rounded-lg bg-[#faf8f4] px-3 py-2 text-xs text-[#6d6259]">
//               Order updates will be sent to <span className="font-medium text-[#241c16]">+91 {user?.phone}</span> (verified)
//             </p>
//             <input className={inputCls} placeholder="Email (optional)" value={form.email} onChange={set("email")} type="email" autoComplete="email" />
//             <textarea
//               className={`${inputCls} resize-none`}
//               placeholder="Full address (house, street, city, state)"
//               rows={3}
//               value={form.address}
//               onChange={set("address")}
//               autoComplete="street-address"
//             />
//             <input
//               className={inputCls}
//               placeholder="Pincode"
//               value={form.pincode}
//               onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
//               inputMode="numeric"
//               maxLength={6}
//               autoComplete="postal-code"
//             />

//             {error && <p role="alert" className="text-xs text-red-700">{error}</p>}

//             <button
//               type="button"
//               onClick={generateQr}
//               disabled={loading}
//               className="w-full rounded-full bg-[#211b17] py-3 text-sm font-semibold text-white transition hover:bg-[#332822] disabled:opacity-60"
//             >
//               {loading ? "Please wait…" : "Generate payment QR"}
//             </button>
//           </div>
//         )}

//         {/* STEP 2: pay */}
//         {step === "pay" && order && (
//           <div className="space-y-4 text-center">
//             <h2 className="pr-8 text-left text-lg font-semibold text-[#241c16]">Scan & pay</h2>
//             <p className="text-3xl font-semibold text-[#241c16]">{formatINR(order.amount)}</p>

//             {/* ---------- Razorpay: auto-confirm ---------- */}
//             {order.mode === "razorpay" && (
//               <>
//                 <div className="relative mx-auto flex w-fit rounded-2xl border border-[#e7dfd5] bg-white p-3">
//                   {/* eslint-disable-next-line @next/next/no-img-element */}
//                   <img
//                     src={order.qrImageUrl}
//                     alt="UPI payment QR"
//                     width={224}
//                     height={224}
//                     className={`h-56 w-56 object-contain ${expired ? "opacity-20" : ""}`}
//                   />
//                   {expired && (
//                     <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[#a3462f]">
//                       QR expired
//                     </span>
//                   )}
//                 </div>

//                 {expired ? (
//                   <button
//                     type="button"
//                     onClick={newQr}
//                     disabled={loading}
//                     className="rounded-full bg-[#211b17] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
//                   >
//                     {loading ? "Please wait…" : "Get a new QR"}
//                   </button>
//                 ) : (
//                   <>
//                     <p className="text-xs text-[#6d6259]">
//                       Scan with any UPI app (GPay, PhonePe, Paytm…). The amount is filled in. QR valid for{" "}
//                       <span className="font-semibold text-[#241c16]">{mm}:{ss}</span>
//                     </p>
//                     <p className="flex items-center justify-center gap-2 rounded-xl bg-[#faf3e7] px-4 py-2.5 text-xs text-[#8c6327]">
//                       <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#a47735] border-t-transparent" />
//                       Waiting for your payment. This page confirms automatically, please don&apos;t close it.
//                     </p>
//                   </>
//                 )}

//                 <p className="text-xs text-[#6d6259]">
//                   Order <span className="font-semibold tracking-wide text-[#241c16]">{order.reference}</span>
//                 </p>
//                 {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
//               </>
//             )}

//             {/* ---------- Manual: owner verify karega ---------- */}
//             {order.mode === "manual" && order.upiLink && (
//               <>
//                 <div className="mx-auto flex w-fit rounded-2xl border border-[#e7dfd5] bg-white p-4">
//                   <QRCodeSVG value={order.upiLink} size={208} level="M" marginSize={0} />
//                 </div>

//                 <a
//                   href={order.upiLink}
//                   className="inline-block rounded-full border border-[#e7dfd5] px-5 py-2 text-xs font-semibold text-[#241c16] hover:border-[#a47735] sm:hidden"
//                 >
//                   On your phone? Open UPI app
//                 </a>

//                 <p className="text-xs text-[#6d6259]">
//                   UPI ID: <span className="font-medium text-[#241c16]">{order.vpa}</span> · Order{" "}
//                   <span className="font-semibold tracking-wide text-[#241c16]">{order.reference}</span>
//                 </p>

//                 <div className="border-t border-[#efe8dc] pt-4 text-left">
//                   <label htmlFor="utr" className="block text-sm font-medium text-[#241c16]">
//                     After paying, enter the UTR / transaction ID
//                   </label>
//                   <input
//                     id="utr"
//                     className={`${inputCls} mt-2`}
//                     placeholder="12-digit UTR"
//                     value={utr}
//                     onChange={(e) => setUtr(e.target.value.replace(/\D/g, "").slice(0, 12))}
//                     inputMode="numeric"
//                   />
//                   <p className="mt-2 text-[11px] text-[#a89d8f]">
//                     Your order is confirmed only after we see the payment in our bank account.
//                   </p>
//                   {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
//                   <button
//                     type="button"
//                     onClick={submitUtr}
//                     disabled={loading}
//                     className="mt-3 w-full rounded-full bg-[#211b17] py-3 text-sm font-semibold text-white transition hover:bg-[#332822] disabled:opacity-60"
//                   >
//                     {loading ? "Submitting…" : "I have paid"}
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {/* STEP 3: done */}
//         {step === "done" && order && (
//           <div className="py-4 text-center">
//             <p className="text-lg font-semibold text-[#241c16]">{confirmed ? "Payment received!" : "Thank you!"}</p>
//             <p className="mt-2 text-sm text-[#6d6259]">
//               {confirmed
//                 ? "Your order is confirmed. We have sent the details to your WhatsApp / SMS."
//                 : "We received your payment details. Your order will be confirmed once we verify the payment. You will get a WhatsApp / SMS."}
//             </p>
//             <p className="mx-auto mt-4 w-fit rounded-xl border border-[#e7dfd5] px-4 py-2.5 text-sm text-[#241c16]">
//               Order ID: <span className="font-semibold tracking-wide">{order.reference}</span>
//             </p>
//             <Link
//               href={`/order-tracking?id=${order.reference}`}
//               onClick={close}
//               className="mt-4 inline-block text-sm font-semibold text-[#8c6327] underline underline-offset-2"
//             >
//               Track this order
//             </Link>
//             <div>
//               <button
//                 type="button"
//                 onClick={close}
//                 className="mt-5 rounded-full bg-[#211b17] px-8 py-2.5 text-sm font-semibold text-white"
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }