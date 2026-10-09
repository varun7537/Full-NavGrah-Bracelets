// src/components/Customized/PaymentButton.tsx
"use client";

import React, { useCallback, useRef, useState } from "react";
import { formatINR } from "../../lib/Currency";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface PaymentButtonProps {
  /** Rupees, not paise. */
  amount: number;
  /** Product handle / id, passed through to your order API. */
  handle: string;
  purpose: "final" | "token";
  label?: string;
  variant?: "light" | "dark";
  disabled?: boolean;
  className?: string;
  customer?: { name?: string; email?: string; phone?: string };
  onSuccess: (paymentId: string) => void;
  onFailure: (message: string) => void;
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckout(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentButton({
  amount,
  handle,
  purpose,
  label,
  variant = "light",
  disabled = false,
  className = "",
  customer,
  onSuccess,
  onFailure,
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const inFlight = useRef(false);

  const handleClick = useCallback(async () => {
    if (inFlight.current || disabled || amount <= 0) return;
    inFlight.current = true;
    setIsProcessing(true);

    try {
      const ready = await loadCheckout();
      if (!ready) throw new Error("Payment window couldn’t load. Check your connection and try again.");

      // TODO: point this at your real order endpoint. It must create the order
      // server-side and return { orderId, amount, currency, keyId }.
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, handle, purpose }),
      });

      if (!orderRes.ok) throw new Error("We couldn’t start the payment. Please try again.");
      const order = (await orderRes.json()) as {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
      };

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.keyId,
          order_id: order.orderId,
          amount: order.amount,
          currency: order.currency || "INR",
          name: "Customized bracelet",
          description: purpose === "final" ? "Bracelet payment" : "Consultation",
          prefill: {
            name: customer?.name || "",
            email: customer?.email || "",
            contact: customer?.phone || "",
          },
          theme: { color: "#a47735" },
          modal: {
            ondismiss: () => reject(new Error("Payment was cancelled before it completed.")),
          },
          handler: async (response: any) => {
            try {
              // TODO: verify the signature server-side before trusting this.
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });
              if (!verifyRes.ok) throw new Error("We couldn’t verify that payment. Nothing has been charged twice — contact us with your payment id.");
              onSuccess(response.razorpay_payment_id as string);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
        });

        rzp.on("payment.failed", (resp: any) => {
          reject(new Error(resp?.error?.description || "The payment didn’t go through."));
        });

        rzp.open();
      });
    } catch (err) {
      onFailure(err instanceof Error ? err.message : "The payment didn’t go through. Please try again.");
    } finally {
      inFlight.current = false;
      setIsProcessing(false);
    }
  }, [amount, handle, purpose, customer, disabled, onSuccess, onFailure]);

  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47735] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8";
  const skin =
    variant === "dark"
      ? "bg-white text-[#241c16] hover:bg-[#f3ece3]"
      : "bg-[#211b17] text-white hover:bg-[#332822]";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isProcessing || amount <= 0}
      aria-busy={isProcessing}
      className={`${base} ${skin} ${className}`}
    >
      {isProcessing ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          Opening payment…
        </>
      ) : (
        label ?? `Pay ${formatINR(amount)}`
      )}
    </button>
  );
}