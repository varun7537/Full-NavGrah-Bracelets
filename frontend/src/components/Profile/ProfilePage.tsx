"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "../Auth/AuthContext";
import { updateProfile, AuthError } from "../../lib/authApi";
import { fetchMyOrders, type MyOrder } from "../../lib/orderApi";
import { formatINR } from "../../lib/Currency";

const STATUS: Record<MyOrder["status"], { label: string; cls: string }> = {
  pending_payment: { label: "Payment pending", cls: "bg-[#fdf2f0] text-[#a3462f]" },
  payment_submitted: { label: "Verifying payment", cls: "bg-[#faf3e7] text-[#8c6327]" },
  paid: { label: "Paid", cls: "bg-[#EAF2EC] text-[#3F6B52]" },
  cancelled: { label: "Cancelled", cls: "bg-[#f1ede7] text-[#6d6259]" },
};

const inputCls =
  "w-full rounded-lg border border-[#e7dfd5] bg-white px-3 py-2.5 text-sm text-[#241c16] outline-none focus:border-[#a47735]";

export default function ProfilePage() {
  const { user, isReady, setUser, openLogin, logout } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", address: "", pincode: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [orders, setOrders] = useState<MyOrder[] | null>(null);
  const [ordersError, setOrdersError] = useState(false);
  const askedLogin = useRef(false);

  // Login nahi hai to ek baar popup kholo
  useEffect(() => {
    if (isReady && !user && !askedLogin.current) {
      askedLogin.current = true;
      openLogin({ message: "Please login to view your profile and orders." });
    }
  }, [isReady, user, openLogin]);

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name, email: user.email, address: user.address, pincode: user.pincode });

    let cancelled = false;
    fetchMyOrders()
      .then((o) => !cancelled && setOrders(o))
      .catch(() => !cancelled && setOrdersError(true));
    return () => {
      cancelled = true;
    };
  }, [user]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setMsg(null);
    setSaving(true);
    try {
      setUser(await updateProfile(form));
      setMsg({ type: "ok", text: "Profile updated." });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof AuthError ? e.message : "Could not update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (!isReady) return <div className="mx-auto max-w-3xl px-4 py-16" aria-hidden="true" />;

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <h1 className="text-lg font-semibold text-[#241c16]">Please login</h1>
        <p className="mt-2 text-sm text-[#6d6259]">Login with your mobile number to see your profile and orders.</p>
        <button
          type="button"
          onClick={() => openLogin({ message: "Please login to view your profile and orders." })}
          className="mt-6 min-h-[44px] rounded-full bg-[#211b17] px-8 text-sm font-semibold text-white"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#a47735] text-xl font-semibold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold text-[#241c16] sm:text-2xl">{user.name}</h1>
          <p className="text-sm text-[#6d6259]">
            +91 {user.phone}{" "}
            <span className="ml-1 rounded-full bg-[#EAF2EC] px-2 py-0.5 text-[10px] font-semibold text-[#3F6B52]">Verified</span>
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-[#e7dfd5] px-4 py-2 text-sm font-medium text-[#241c16] transition hover:border-[#a47735]"
        >
          Logout
        </button>
      </div>

      {/* Details */}
      <section className="mt-8 rounded-2xl border border-[#e7dfd5] bg-white p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[#241c16]">My details</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-xs text-[#6d6259]">
            Name
            <input className={`${inputCls} mt-1`} value={form.name} onChange={set("name")} maxLength={100} />
          </label>
          <label className="block text-xs text-[#6d6259]">
            Mobile (verified, can't be changed)
            <input className={`${inputCls} mt-1 bg-[#faf8f4] text-[#6d6259]`} value={`+91 ${user.phone}`} disabled />
          </label>
          <label className="block text-xs text-[#6d6259] sm:col-span-2">
            Email (optional)
            <input className={`${inputCls} mt-1`} type="email" value={form.email} onChange={set("email")} />
          </label>
          <label className="block text-xs text-[#6d6259] sm:col-span-2">
            Delivery address
            <textarea className={`${inputCls} mt-1 resize-none`} rows={3} value={form.address} onChange={set("address")} maxLength={300} />
          </label>
          <label className="block text-xs text-[#6d6259]">
            Pincode
            <input
              className={`${inputCls} mt-1`}
              value={form.pincode}
              onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
              inputMode="numeric"
            />
          </label>
        </div>

        {msg && (
          <p role="status" className={`mt-3 text-xs ${msg.type === "ok" ? "text-[#3F6B52]" : "text-red-700"}`}>
            {msg.text}
          </p>
        )}

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="mt-4 rounded-full bg-[#211b17] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332822] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </section>

      {/* Orders */}
      <section className="mt-8">
        <h2 className="text-base font-semibold text-[#241c16]">My orders</h2>

        {ordersError && <p className="mt-3 text-sm text-red-700">Couldn't load your orders. Please refresh.</p>}
        {!ordersError && orders === null && <p className="mt-3 text-sm text-[#6d6259]">Loading…</p>}

        {orders && orders.length === 0 && (
          <div className="mt-3 rounded-2xl border border-dashed border-[#e7dfd5] bg-white px-6 py-10 text-center">
            <p className="text-sm text-[#6d6259]">You haven't placed any orders yet.</p>
            <Link href="/bracelets" className="mt-4 inline-block rounded-full bg-[#211b17] px-6 py-2.5 text-sm font-semibold text-white">
              Browse bracelets
            </Link>
          </div>
        )}

        {orders && orders.length > 0 && (
          <ul className="mt-3 space-y-3">
            {orders.map((o) => {
              const s = o.stage === "delivered" ? { label: "Delivered", cls: "bg-[#EAF2EC] text-[#3F6B52]" } : STATUS[o.status] ?? STATUS.pending_payment;
              return (
                <li key={o.reference} className="rounded-2xl border border-[#e7dfd5] bg-white p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold tracking-wide text-[#241c16]">{o.reference}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.cls}`}>{s.label}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#a89d8f]">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    <Link
                      href={`/order-tracking?id=${o.reference}`}
                      className="mt-2 inline-block text-xs font-semibold text-[#8c6327] underline underline-offset-2"
                    >
                      Track order →
                    </Link>
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-[#403a34]">
                    {o.items.map((i, idx) => (
                      <li key={idx} className="flex justify-between gap-3">
                        <span className="min-w-0 truncate">
                          {i.name} <span className="text-[#a89d8f]">× {i.quantity}</span>
                        </span>
                        <span className="shrink-0">{formatINR(i.lineTotal)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 flex justify-between border-t border-[#efe8dc] pt-3 text-sm font-semibold text-[#241c16]">
                    <span>Total</span>
                    <span>{formatINR(o.amount)}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}