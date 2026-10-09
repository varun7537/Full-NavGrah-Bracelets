// src/components/Legal/OrderTrackingForm.tsx
"use client";

import React, { useCallback, useRef, useState } from "react";

type TrackingStage =
  | "placed"
  | "consultation"
  | "crafting"
  | "quality-check"
  | "dispatched"
  | "out-for-delivery"
  | "delivered";

const STAGES: { id: TrackingStage; label: string; blurb: string }[] = [
  { id: "placed", label: "Order placed", blurb: "Payment received and order created." },
  { id: "consultation", label: "Astrologer finalising", blurb: "Stones and metal confirmed against your chart." },
  { id: "crafting", label: "Being made", blurb: "Beads strung and set by hand." },
  { id: "quality-check", label: "Quality check", blurb: "Checked, cleansed and packed." },
  { id: "dispatched", label: "Dispatched", blurb: "Handed to the courier." },
  { id: "out-for-delivery", label: "Out for delivery", blurb: "With the delivery agent today." },
  { id: "delivered", label: "Delivered", blurb: "Signed for at your address." },
];

export interface TrackingResult {
  orderId: string;
  stage: TrackingStage;
  updatedAt: string;
  courier?: string;
  awb?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  note?: string;
}

function isValidOrderId(value: string) {
  return /^ORD-[A-Z0-9-]{4,}$/i.test(value.trim());
}

function isValidContact(value: string) {
  const v = value.trim();
  const phone = /^[6-9]\d{9}$/.test(v.replace(/\D/g, ""));
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  return phone || email;
}

export default function OrderTrackingForm() {
  const [orderId, setOrderId] = useState("");
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState<{ orderId?: string; contact?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackingResult | null>(null);

  const orderRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const next: { orderId?: string; contact?: string } = {};
      if (!orderId.trim()) next.orderId = "Enter the order id from your confirmation message.";
      else if (!isValidOrderId(orderId)) next.orderId = "Order ids look like ORD-1737.";

      if (!contact.trim()) next.contact = "Enter the mobile number or email used on the order.";
      else if (!isValidContact(contact)) next.contact = "Enter a 10-digit mobile number or a valid email.";

      setErrors(next);
      if (next.orderId) return orderRef.current?.focus();
      if (next.contact) return contactRef.current?.focus();

      setIsLoading(true);
      setRequestError(null);
      setResult(null);

      try {
        // TODO: point this at your real endpoint. It should check the order id
        // against the contact before returning anything.
        const res = await fetch("/api/orders/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderId.trim(), contact: contact.trim() }),
        });

        if (res.status === 404) {
          throw new Error("No order matches that id and contact. Check both and try again.");
        }
        if (!res.ok) throw new Error("Tracking is unavailable right now. Try again in a few minutes.");

        setResult((await res.json()) as TrackingResult);
      } catch (err) {
        setRequestError(err instanceof Error ? err.message : "Tracking is unavailable right now.");
      } finally {
        setIsLoading(false);
      }
    },
    [orderId, contact]
  );

  const currentIndex = result ? STAGES.findIndex((s) => s.id === result.stage) : -1;

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-[#e7dfd5] bg-white p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="track-order-id" className="block text-sm font-medium text-[#241c16]">
              Order id
            </label>
            <input
              id="track-order-id"
              ref={orderRef}
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="ORD-1737"
              aria-invalid={!!errors.orderId}
              aria-describedby={errors.orderId ? "track-order-id-error" : undefined}
              className={inputClass(!!errors.orderId)}
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value.toUpperCase());
                setErrors((p) => ({ ...p, orderId: undefined }));
              }}
            />
            {errors.orderId && (
              <p id="track-order-id-error" className={errorClass}>
                {errors.orderId}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="track-contact" className="block text-sm font-medium text-[#241c16]">
              Mobile number or email
            </label>
            <input
              id="track-contact"
              ref={contactRef}
              type="text"
              inputMode="email"
              autoComplete="email"
              aria-invalid={!!errors.contact}
              aria-describedby={errors.contact ? "track-contact-error" : undefined}
              className={inputClass(!!errors.contact)}
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                setErrors((p) => ({ ...p, contact: undefined }));
              }}
            />
            {errors.contact && (
              <p id="track-contact-error" className={errorClass}>
                {errors.contact}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#211b17] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#332822] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47735] focus-visible:ring-offset-2 disabled:opacity-60 sm:w-auto"
        >
          {isLoading && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          )}
          {isLoading ? "Checking" : "Track order"}
        </button>
      </form>

      <div aria-live="polite" className="mt-6">
        {requestError && (
          <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {requestError}
          </p>
        )}

        {result && (
          <div className="rounded-2xl border border-[#e7dfd5] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-base font-semibold text-[#241c16]">Order {result.orderId}</h3>
              <span className="text-xs text-[#6d6259]">Updated {result.updatedAt}</span>
            </div>

            {result.estimatedDelivery && (
              <p className="mt-1 text-sm text-[#6d6259]">
                Expected delivery <strong className="font-medium text-[#241c16]">{result.estimatedDelivery}</strong>
              </p>
            )}

            <ol className="mt-6 space-y-0">
              {STAGES.map((stage, i) => {
                const done = i < currentIndex;
                const active = i === currentIndex;
                const isLast = i === STAGES.length - 1;
                return (
                  <li key={stage.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        aria-hidden="true"
                        className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                          done || active ? "border-[#a47735] bg-[#a47735]" : "border-[#e7dfd5] bg-white"
                        }`}
                      />
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className={`w-0.5 flex-1 ${done ? "bg-[#a47735]" : "bg-[#e7dfd5]"}`}
                        />
                      )}
                    </div>
                    <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                      <p
                        className={`text-sm ${
                          active ? "font-semibold text-[#241c16]" : done ? "text-[#241c16]" : "text-[#9a8f84]"
                        }`}
                      >
                        {stage.label}
                        {active && <span className="sr-only"> — current status</span>}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-[#6d6259]">{stage.blurb}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {result.note && <p className="mt-4 rounded-xl bg-[#faf8f4] px-4 py-3 text-sm text-[#6d6259]">{result.note}</p>}

            {result.awb && (
              <p className="mt-4 text-sm text-[#6d6259]">
                {result.courier ?? "Courier"} · AWB {result.awb}
                {result.trackingUrl && (
                  <>
                    {" · "}
                    <a
                      href={result.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8c6327] underline underline-offset-2"
                    >
                      Track on the courier site
                    </a>
                  </>
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-[#241c16] outline-none transition focus:ring-2 focus:ring-[#a47735]/20 ${
    hasError ? "border-red-400 focus:border-red-500" : "border-[#e7dfd5] focus:border-[#a47735]"
  }`;

const errorClass = "mt-1.5 text-xs text-red-700";