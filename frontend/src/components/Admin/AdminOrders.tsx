"use client";

import { useCallback, useEffect, useState } from "react";
import { formatINR } from "../../lib/Currency";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const KEY = "ng_admin_secret";

type View = "verify" | "unpaid" | "active" | "delivered" | "cancelled" | "all";

const TABS: { key: View; label: string }[] = [
  { key: "verify", label: "Verify payment" },
  { key: "active", label: "In progress" },
  { key: "unpaid", label: "Unpaid" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
  { key: "all", label: "All" },
];

interface AdminOrder {
  reference: string;
  status: "pending_payment" | "payment_submitted" | "paid" | "cancelled";
  stage: string;
  amount: number;
  itemCount: number;
  items: { name: string; quantity: number }[];
  customer: { name: string; phone: string; email: string; address: string; pincode: string };
  utr?: string;
  payment?: { paymentId?: string };
  adminNote?: string;
  courier?: string;
  trackingNumber?: string;
  createdAt: string;
}

const NEXT: Record<string, { stage: string; label: string; confirm?: string }> = {
  placed: { stage: "confirmed", label: "Mark confirmed" },
  confirmed: { stage: "shipped", label: "Mark shipped" },
  shipped: { stage: "out_for_delivery", label: "Out for delivery" },
  out_for_delivery: {
    stage: "delivered",
    label: "Mark delivered",
    confirm: "Mark as DELIVERED? The customer will get a delivery message.",
  },
};

const STAGE_TEXT: Record<string, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

async function api<T>(secret: string, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", "x-admin-secret": secret, ...(init.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || "Request failed"), { status: res.status });
  return data as T;
}

const inputCls = "w-full rounded-lg border border-[#e7dfd5] bg-white px-3 py-2 text-sm outline-none focus:border-[#a47735]";

export default function AdminOrders() {
  const [secret, setSecret] = useState("");
  const [input, setInput] = useState("");
  const [view, setView] = useState<View>("verify");
  const [q, setQ] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [ship, setShip] = useState<{
    reference: string;
    courier: string;
    trackingNumber: string;
    trackingUrl: string;
    expectedDelivery: string;
  } | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY);
    if (saved) setSecret(saved);
  }, []);

  const load = useCallback(async () => {
    if (!secret) return;
    setLoading(true);
    try {
      const data = await api<{ orders: AdminOrder[]; counts: Record<string, number> }>(
        secret,
        `/orders?view=${view}&limit=50${q.trim() ? `&q=${encodeURIComponent(q.trim())}` : ""}`
      );
      setOrders(data.orders);
      setCounts(data.counts);
      setError("");
    } catch (e) {
      const err = e as Error & { status?: number };
      if (err.status === 401) {
        sessionStorage.removeItem(KEY);
        setSecret("");
        setError("Wrong admin secret.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [secret, view, q]);

  useEffect(() => {
    load();
    if (!secret) return;
    const id = window.setInterval(load, 30000); // har 30 sec me naye orders
    return () => window.clearInterval(id);
  }, [load, secret]);

  const act = async (reference: string, body: Record<string, unknown>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(reference);
    setError("");
    try {
      await api(secret, `/orders/${encodeURIComponent(reference)}`, { method: "PATCH", body: JSON.stringify(body) });
      setShip(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  };

  /* ---------------- login ---------------- */
  if (!secret) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <h1 className="text-xl font-semibold text-[#241c16]">Admin login</h1>
        <input
          type="password"
          className={`${inputCls} mt-4`}
          placeholder="Admin secret"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input) {
              sessionStorage.setItem(KEY, input);
              setSecret(input);
            }
          }}
        />
        {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
        <button
          type="button"
          onClick={() => {
            if (!input) return;
            sessionStorage.setItem(KEY, input);
            setSecret(input);
          }}
          className="mt-3 w-full rounded-full bg-[#211b17] py-2.5 text-sm font-semibold text-white"
        >
          Open
        </button>
      </div>
    );
  }

  /* ---------------- panel ---------------- */
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-[#241c16]">Orders</h1>
        <div className="flex gap-2">
          <button type="button" onClick={load} className="rounded-full border border-[#e7dfd5] px-4 py-1.5 text-xs font-medium">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(KEY);
              setSecret("");
              setOrders([]);
            }}
            className="rounded-full border border-[#e7dfd5] px-4 py-1.5 text-xs font-medium"
          >
            Lock
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setView(t.key)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
              view === t.key ? "border-[#211b17] bg-[#211b17] text-white" : "border-[#e7dfd5] text-[#6d6259]"
            }`}
          >
            {t.label} {counts[t.key] !== undefined && <span className="opacity-70">({counts[t.key]})</span>}
          </button>
        ))}
      </div>

      <input
        className={`${inputCls} mt-3`}
        placeholder="Search order ID (NG-…) or phone"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && load()}
      />

      {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {!loading && orders.length === 0 && <p className="mt-6 text-sm text-[#6d6259]">No orders here.</p>}

      <ul className="mt-4 space-y-4">
        {orders.map((o) => {
          const next = NEXT[o.stage];
          const waving = `https://wa.me/91${o.customer.phone}`;
          const isBusy = busy === o.reference;

          return (
            <li key={o.reference} className="rounded-2xl border border-[#e7dfd5] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold tracking-wide text-[#241c16]">{o.reference}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#a89d8f]">{new Date(o.createdAt).toLocaleString("en-IN")}</span>
                  <span className="rounded-full bg-[#f5eee5] px-2.5 py-1 font-semibold text-[#6d6259]">
                    {o.status === "paid" ? STAGE_TEXT[o.stage] ?? o.stage : o.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-sm text-[#403a34] sm:grid-cols-2">
                <div>
                  <p className="font-medium text-[#241c16]">{o.customer.name}</p>
                  <a href={`tel:+91${o.customer.phone}`} className="text-[#8c6327] underline">+91 {o.customer.phone}</a>
                  {" · "}
                  <a href={waving} target="_blank" rel="noopener noreferrer" className="text-[#8c6327] underline">WhatsApp</a>
                  <p className="mt-1 text-xs text-[#6d6259]">{o.customer.address}, {o.customer.pincode}</p>
                </div>
                <div>
                  <ul className="text-xs">
                    {o.items.map((i, idx) => (
                      <li key={idx}>{i.name} × {i.quantity}</li>
                    ))}
                  </ul>
                  <p className="mt-1 font-semibold text-[#241c16]">{formatINR(o.amount)}</p>
                  {(o.utr || o.payment?.paymentId) && (
                    <p className="text-xs text-[#6d6259]">
                      {o.payment?.paymentId ? "Razorpay" : "UTR"}: {o.payment?.paymentId || o.utr}
                    </p>
                  )}
                </div>
              </div>

              {o.adminNote && <p className="mt-2 rounded-lg bg-[#fdf2f0] px-3 py-1.5 text-xs text-[#a3462f]">{o.adminNote}</p>}

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {(o.status === "payment_submitted" || o.status === "pending_payment") && (
                  <>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        act(o.reference, { status: "paid" }, `Mark ${o.reference} as PAID? Do this only after you see ${formatINR(o.amount)} in your bank account.`)
                      }
                      className="rounded-full bg-[#2f7a4d] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      Payment received → Mark paid
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => act(o.reference, { status: "cancelled" }, `Cancel ${o.reference}?`)}
                      className="rounded-full border border-[#e7dfd5] px-4 py-2 text-xs font-semibold text-[#a3462f] disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {o.status === "paid" && next && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() =>
                      next.stage === "shipped"
                        ? setShip({ reference: o.reference, courier: "", trackingNumber: "", trackingUrl: "", expectedDelivery: "" })
                        : act(o.reference, { stage: next.stage }, next.confirm)
                    }
                    className="rounded-full bg-[#211b17] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    {next.label}
                  </button>
                )}

                {o.status === "paid" && o.stage !== "delivered" && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => act(o.reference, { status: "cancelled" }, `Cancel ${o.reference}? Refund the customer separately.`)}
                    className="rounded-full border border-[#e7dfd5] px-4 py-2 text-xs font-semibold text-[#a3462f] disabled:opacity-60"
                  >
                    Cancel
                  </button>
                )}

                <a
                  href={`/order-tracking?id=${o.reference}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#e7dfd5] px-4 py-2 text-xs font-medium text-[#6d6259]"
                >
                  Customer view
                </a>
              </div>

              {/* Shipping form */}
              {ship?.reference === o.reference && (
                <div className="mt-4 space-y-2 rounded-xl bg-[#faf8f4] p-3">
                  <p className="text-xs font-semibold text-[#241c16]">Shipping details (optional)</p>
                  <input className={inputCls} placeholder="Courier (e.g. Delhivery)" value={ship.courier} onChange={(e) => setShip({ ...ship, courier: e.target.value })} />
                  <input className={inputCls} placeholder="Tracking number" value={ship.trackingNumber} onChange={(e) => setShip({ ...ship, trackingNumber: e.target.value })} />
                  <input className={inputCls} placeholder="Tracking link (https://…)" value={ship.trackingUrl} onChange={(e) => setShip({ ...ship, trackingUrl: e.target.value })} />
                  <label className="block text-xs text-[#6d6259]">
                    Expected delivery
                    <input type="date" className={`${inputCls} mt-1`} value={ship.expectedDelivery} onChange={(e) => setShip({ ...ship, expectedDelivery: e.target.value })} />
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        act(o.reference, {
                          stage: "shipped",
                          ...(ship.courier && { courier: ship.courier }),
                          ...(ship.trackingNumber && { trackingNumber: ship.trackingNumber }),
                          ...(ship.trackingUrl && { trackingUrl: ship.trackingUrl }),
                          ...(ship.expectedDelivery && { expectedDelivery: ship.expectedDelivery }),
                        })
                      }
                      className="rounded-full bg-[#211b17] px-5 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      Save & mark shipped
                    </button>
                    <button type="button" onClick={() => setShip(null)} className="rounded-full border border-[#e7dfd5] px-5 py-2 text-xs">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}