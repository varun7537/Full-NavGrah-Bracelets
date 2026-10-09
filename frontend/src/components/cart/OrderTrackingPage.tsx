"use client";

import { useEffect, useRef, useState } from "react";
import { trackOrder, OrderError } from "../../lib/orderApi";
import { formatINR } from "../../lib/Currency";
import { STAGE_KEYS, STAGE_LABELS, type TrackedOrder } from "../../data/Orders";

const fmtDate = (iso: string, withTime = false) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });

export default function OrderTrackingPage({ initialId = "" }: { initialId?: string }) {
  const [id, setId] = useState(initialId);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const autoRan = useRef(false);

  const lookup = async (value: string) => {
    const ref = value.trim().toUpperCase();
    if (!/^NG-[A-Z0-9]{6}$/.test(ref)) {
      setOrder(null);
      return setError("Enter a valid order ID, like NG-ABC123.");
    }
    setError("");
    setLoading(true);
    try {
      setOrder(await trackOrder(ref));
    } catch (e) {
      setOrder(null);
      setError(e instanceof OrderError ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ?id=NG-XXXXXX se aaye to apne aap dhundo
  useEffect(() => {
    if (initialId && !autoRan.current) {
      autoRan.current = true;
      lookup(initialId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  const stageIndex = order ? STAGE_KEYS.indexOf(order.stage) : -1;
  const cancelled = order?.status === "cancelled";
  const paymentDone = order?.status === "paid";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold text-[#241c16] sm:text-3xl">Track your order</h1>
      <p className="mt-2 text-sm text-[#6d6259]">Enter the order ID we sent you on WhatsApp / SMS.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(id);
        }}
        className="mt-6 flex gap-2"
      >
        <input
          value={id}
          onChange={(e) => setId(e.target.value.toUpperCase())}
          placeholder="NG-ABC123"
          maxLength={9}
          aria-label="Order ID"
          className="min-w-0 flex-1 rounded-full border border-[#e7dfd5] bg-white px-5 py-3 text-sm tracking-wide text-[#241c16] outline-none focus:border-[#a47735]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#211b17] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#332822] disabled:opacity-60"
        >
          {loading ? "Checking…" : "Track"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      {order && (
        <div className="mt-8 space-y-5">
          <div className="rounded-2xl border border-[#e7dfd5] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-base font-semibold tracking-wide text-[#241c16]">{order.reference}</p>
              <span className="text-xs text-[#a89d8f]">Placed on {fmtDate(order.placedAt)}</span>
            </div>
            <p className="mt-1 text-sm text-[#6d6259]">Hi {order.customerName}, here is your order status.</p>
          </div>

          {cancelled && (
            <p className="rounded-xl bg-[#fdf2f0] px-4 py-3 text-sm text-[#a3462f]">
              This order was cancelled. If you paid, please contact us.
            </p>
          )}
          {order.status === "payment_submitted" && (
            <p className="rounded-xl bg-[#faf3e7] px-4 py-3 text-sm text-[#8c6327]">
              We received your payment details and are verifying them. Your order is confirmed only after the payment is verified.
            </p>
          )}
          {order.status === "pending_payment" && (
            <p className="rounded-xl bg-[#faf3e7] px-4 py-3 text-sm text-[#8c6327]">
              Awaiting payment. Your order will be placed as soon as the payment is received.
            </p>
          )}

          {!cancelled && (
            <ol className="rounded-2xl border border-[#e7dfd5] bg-white p-5" aria-label="Order progress">
              {STAGE_KEYS.map((key, i) => {
                const reached = paymentDone || i === 0 ? i <= stageIndex : false;
                const current = reached && i === stageIndex;
                const event = order.events.find((e) => e.stage === key);
                const last = i === STAGE_KEYS.length - 1;

                return (
                  <li key={key} className="relative flex gap-4 pb-6 last:pb-0">
                    {!last && (
                      <span
                        aria-hidden="true"
                        className={`absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-0.5 ${
                          reached && i < stageIndex ? "bg-[#a47735]" : "bg-[#e7dfd5]"
                        }`}
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        reached ? "bg-[#a47735] text-white" : "bg-[#f3ece3] text-[#8c6327]"
                      } ${current ? "ring-4 ring-[#a47735]/20" : ""}`}
                    >
                      {reached ? "✓" : i + 1}
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className={`text-sm font-semibold ${reached ? "text-[#241c16]" : "text-[#a89d8f]"}`}>
                        {STAGE_LABELS[key]}
                        {current && order.stage !== "delivered" && (
                          <span className="ml-2 rounded-full bg-[#faf3e7] px-2 py-0.5 text-[10px] font-semibold text-[#8c6327]">
                            Current
                          </span>
                        )}
                      </p>
                      {reached && event && (
                        <p className="mt-0.5 text-xs text-[#6d6259]">
                          {fmtDate(event.at, true)}
                          {event.note && event.note !== STAGE_LABELS[key] ? ` · ${event.note}` : ""}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {(order.courier || order.trackingNumber || order.expectedDelivery) && order.stage !== "delivered" && !cancelled && (
            <div className="rounded-2xl border border-[#e7dfd5] bg-white p-5 text-sm text-[#403a34]">
              {order.expectedDelivery && (
                <p>
                  Expected delivery: <span className="font-semibold text-[#241c16]">{fmtDate(order.expectedDelivery)}</span>
                </p>
              )}
              {order.courier && (
                <p className="mt-1">
                  Courier: <span className="font-semibold text-[#241c16]">{order.courier}</span>
                </p>
              )}
              {order.trackingNumber && (
                <p className="mt-1">
                  Tracking number: <span className="font-semibold text-[#241c16]">{order.trackingNumber}</span>
                </p>
              )}
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-full border border-[#e7dfd5] px-5 py-2 text-xs font-semibold text-[#241c16] transition hover:border-[#a47735]"
                >
                  Track with courier
                </a>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-[#e7dfd5] bg-white p-5">
            <p className="text-sm font-semibold text-[#241c16]">Items</p>
            <ul className="mt-2 space-y-1 text-sm text-[#403a34]">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate">{i.name}</span>
                  <span className="shrink-0 text-[#a89d8f]">× {i.quantity}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex justify-between border-t border-[#efe8dc] pt-3 text-sm font-semibold text-[#241c16]">
              <span>Total</span>
              <span>{formatINR(order.amount)}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}