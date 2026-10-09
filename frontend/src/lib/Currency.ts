// src/lib/Currency.ts

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** 2149 -> "₹2,149" */
export function formatINR(amount: number): string {
  if (!Number.isFinite(amount)) return "₹0";
  return inr.format(Math.round(amount));
}

/** Razorpay and most Indian gateways expect paise. */
export function toPaise(amount: number): number {
  return Math.round(amount * 100);
}