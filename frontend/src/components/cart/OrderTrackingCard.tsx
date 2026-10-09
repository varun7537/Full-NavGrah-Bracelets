"use client";

import { useState } from "react";
import { displayStatus, orderSubtotal, type TrackedOrder } from "../../data/Orders";
import { formatINR } from "../../lib/Currency";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderTimeline from "./OrderTimeLine";
import { ArrowLeftIcon, CopyIcon } from "../NavgrahBracelets/Icons";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export interface OrderTrackingCardProps {
  order: TrackedOrder;
  onBackToTracking?: () => void;
  /** "Continue Shopping" button */
  onCheckout?: () => void;
}

export default function OrderTrackingCard({ order, onBackToTracking, onCheckout }: OrderTrackingCardProps) {
  const [copied, setCopied] = useState(false);

  const subtotal = orderSubtotal(order);
  const shipping = Math.max(0, order.amount - subtotal); // abhi shipping free hai, to 0
  const cancelled = order.status === "cancelled";
  const delivered = order.stage === "delivered" && order.status === "paid";

  const copyTracking = async () => {
    if (!order.trackingNumber) return;
    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable.
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e7dfd5] bg-white shadow-sm">
      {onBackToTracking && (
        <div className="border-b border-[#efe8dc] px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={onBackToTracking}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6d6259] transition hover:text-[#241c16]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Order Tracking
          </button>
        </div>
      )}

      {/* Order header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#efe8dc] p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs text-[#6d6259]">Order ID</p>
          <p className="mt-0.5 break-all text-base font-semibold tracking-wide text-[#241c16] sm:text-lg">
            {order.reference}
          </p>
          <p className="mt-1 text-xs text-[#a89d8f] sm:text-sm">Placed on {formatDate(order.placedAt)}</p>
        </div>

        <OrderStatusBadge status={displayStatus(order)} />
      </div>

      {/* Order status */}
      <div className="p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-[#241c16]">Order Status</h2>
          <p className="mt-1 text-xs text-[#6d6259]">Follow your order from confirmation to delivery.</p>
        </div>

        <OrderTimeline order={order} />

        {/* Estimated delivery */}
        {!cancelled && !delivered && order.expectedDelivery && (
          <div className="mt-5 rounded-xl bg-[#faf3e7] px-4 py-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#a47735]">Estimated Delivery</p>
            <p className="mt-1 text-sm font-semibold text-[#8c6327]">{formatDate(order.expectedDelivery)}</p>
          </div>
        )}

        {/* Delivered */}
        {delivered && order.deliveredAt && (
          <div className="mt-5 rounded-xl bg-[#eaf6ee] px-4 py-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#2f7a4d]">Delivered</p>
            <p className="mt-1 text-sm font-semibold text-[#2f7a4d]">Delivered on {formatDate(order.deliveredAt)}</p>
          </div>
        )}

        {/* Tracking number */}
        {order.trackingNumber && !cancelled && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e7dfd5] bg-[#fcfaf7] px-4 py-3">
            <div className="min-w-0">
              <p className="text-[11px] text-[#6d6259]">
                {order.courier ? `${order.courier} tracking number` : "Tracking number"}
              </p>
              <p className="mt-0.5 break-all font-mono text-sm font-medium text-[#241c16]">{order.trackingNumber}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#e7dfd5] bg-white px-3 py-1.5 text-xs font-medium text-[#241c16] transition hover:border-[#a47735] hover:text-[#8c6327]"
                >
                  Track with courier
                </a>
              )}
              <button
                type="button"
                onClick={copyTracking}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#e7dfd5] bg-white px-3 py-1.5 text-xs font-medium text-[#241c16] transition hover:border-[#a47735] hover:text-[#8c6327]"
              >
                <CopyIcon className="h-3.5 w-3.5" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="border-t border-[#efe8dc] p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[#a47735]">Order Items</h3>
          <span className="text-xs text-[#6d6259]">
            {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {order.items.map((line, index) => (
            <div key={`${line.name}-${index}`} className="flex items-center gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5eee5] sm:h-20 sm:w-20">
                {line.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={line.imageUrl} alt={line.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center px-2 text-center text-[10px] text-[#a89d8f]">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#241c16]">{line.name}</p>
                <p className="mt-1 text-xs text-[#6d6259]">
                  Qty {line.quantity}
                  {line.quantity > 1 ? ` · ${formatINR(Math.round(line.lineTotal / line.quantity))} each` : ""}
                </p>
              </div>

              <p className="shrink-0 text-sm font-semibold text-[#241c16]">{formatINR(line.lineTotal)}</p>
            </div>
          ))}
        </div>

        {/* Price summary */}
        <dl className="mt-5 space-y-2 border-t border-[#efe8dc] pt-4 text-sm">
          <div className="flex justify-between text-[#6d6259]">
            <dt>Subtotal</dt>
            <dd className="text-[#241c16]">{formatINR(subtotal)}</dd>
          </div>

          <div className="flex justify-between text-[#6d6259]">
            <dt>Shipping</dt>
            <dd className={shipping === 0 ? "font-medium text-[#2f7a4d]" : "text-[#241c16]"}>
              {shipping === 0 ? "Free" : formatINR(shipping)}
            </dd>
          </div>

          <div className="flex justify-between border-t border-[#efe8dc] pt-3 text-base font-semibold text-[#241c16]">
            <dt>Total</dt>
            <dd>{formatINR(order.amount)}</dd>
          </div>
        </dl>

        {onCheckout && !cancelled && (
          <button
            type="button"
            onClick={onCheckout}
            className="mt-5 min-h-[48px] w-full rounded-full bg-[#211b17] px-6 text-sm font-semibold text-white transition hover:bg-[#332822]"
          >
            Continue Shopping
          </button>
        )}
      </div>
    </div>
  );
}