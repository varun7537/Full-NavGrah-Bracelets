"use client";

import { formatINR } from "../../lib/Currency";
import { ArrowLeftIcon, TruckIcon } from "../NavgrahBracelets/Icons";

export interface OrderSummaryProps {
  itemCount: number;
  subtotal: number;
  savings?: number;
  freeShippingThreshold?: number;
  shippingFee?: number;
  onCheckout: () => void;
  checkoutDisabled?: boolean;
  onBackToTracking?: () => void;
  variant?: "card" | "bar";
}

export default function OrderSummary({
  itemCount,
  subtotal,
  savings = 0,
  freeShippingThreshold = 1999,
  shippingFee = 99,
  onCheckout,
  checkoutDisabled = false,
  onBackToTracking,
  variant = "card",
}: OrderSummaryProps) {
  const qualifiesForFreeShipping =
    freeShippingThreshold > 0 &&
    subtotal >= freeShippingThreshold;

  const shipping =
    subtotal <= 0
      ? 0
      : qualifiesForFreeShipping
        ? 0
        : shippingFee;

  const total = subtotal + shipping;

  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );

  const progressPct =
    freeShippingThreshold > 0
      ? Math.min(
          100,
          (subtotal / freeShippingThreshold) * 100
        )
      : 100;

  if (variant === "bar") {
    return (
      <div className="border-t border-[#e7dfd5] bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-[#6d6259]">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>

            <p className="text-lg font-semibold text-[#241c16]">
              {formatINR(total)}
            </p>
          </div>

          <button
            type="button"
            onClick={onCheckout}
            disabled={checkoutDisabled}
            className="min-h-[48px] max-w-[220px] flex-1 rounded-full bg-[#211b17] px-6 text-sm font-semibold text-white transition hover:bg-[#332822] disabled:cursor-not-allowed disabled:bg-[#c9bba3]"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#e7dfd5] bg-white p-5 shadow-sm sm:p-6">
      {onBackToTracking && (
        <button
          type="button"
          onClick={onBackToTracking}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#6d6259] transition hover:text-[#241c16]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Order Tracking
        </button>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a47735]">
            Order total
          </p>

          <h3 className="mt-1 text-lg font-semibold text-[#241c16]">
            Order Summary
          </h3>
        </div>

        <span className="rounded-full bg-[#f5eee5] px-3 py-1 text-xs font-medium text-[#6d6259]">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      {freeShippingThreshold > 0 && (
        <div className="mt-5 rounded-xl bg-[#faf3e7] p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-medium text-[#8c6327]">
            <TruckIcon className="h-4 w-4 shrink-0" />

            {qualifiesForFreeShipping
              ? "You've unlocked free shipping!"
              : `Add ${formatINR(
                  remainingForFreeShipping
                )} more for free shipping`}
          </p>

          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#a47735] transition-all duration-500"
              style={{
                width: `${progressPct}%`,
              }}
            />
          </div>
        </div>
      )}

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between text-[#6d6259]">
          <dt>
            Subtotal ({itemCount}{" "}
            {itemCount === 1 ? "item" : "items"})
          </dt>

          <dd className="font-medium text-[#241c16]">
            {formatINR(subtotal)}
          </dd>
        </div>

        {savings > 0 && (
          <div className="flex items-center justify-between text-[#2f7a4d]">
            <dt>You save</dt>

            <dd className="font-medium">
              −{formatINR(savings)}
            </dd>
          </div>
        )}

        <div className="flex items-center justify-between text-[#6d6259]">
          <dt>Shipping</dt>

          <dd
            className={
              shipping === 0
                ? "font-medium text-[#2f7a4d]"
                : "font-medium text-[#241c16]"
            }
          >
            {shipping === 0 ? "Free" : formatINR(shipping)}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex items-end justify-between border-t border-[#efe8dc] pt-5">
        <div>
          <p className="text-sm font-semibold text-[#241c16]">
            Total
          </p>

          <p className="mt-0.5 text-[11px] text-[#a89d8f]">
            Final amount for this order
          </p>
        </div>

        <span className="text-2xl font-semibold text-[#241c16]">
          {formatINR(total)}
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={checkoutDisabled}
        className="mt-5 min-h-[50px] w-full rounded-full bg-[#211b17] px-6 text-sm font-semibold text-white transition hover:bg-[#332822] disabled:cursor-not-allowed disabled:bg-[#c9bba3]"
      >
        Proceed to Checkout
      </button>

      <p className="mt-3 text-center text-[11px] text-[#a89d8f]">
        Taxes calculated at checkout.
      </p>

      {onBackToTracking && (
        <button
          type="button"
          onClick={onBackToTracking}
          className="mt-4 flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-full border border-[#e7dfd5] bg-white px-5 text-xs font-medium text-[#6d6259] transition hover:border-[#a47735] hover:text-[#8c6327]"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to Order Tracking
        </button>
      )}
    </div>
  );
}
