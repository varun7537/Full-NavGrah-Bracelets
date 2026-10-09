"use client";

import { useState } from "react";
import type { BraceletProduct } from "../../data/Rashibracelets";
import { requestStockNotification } from "../../lib/productApi";
import { CloseIcon } from "./icons";

export default function NotifyMeModal({
  product,
  onClose,
}: {
  product: BraceletProduct;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      await requestStockNotification(product.id, email.trim());
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[#6d6259] transition hover:bg-[#f5eee5]"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        {status === "done" ? (
          <div className="py-4 text-center">
            <p className="text-base font-semibold text-[#241c16]">You're on the list!</p>
            <p className="mt-2 text-sm text-[#6d6259]">
              We'll email you when {product.name} is back in stock.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-full bg-[#211b17] px-6 py-2.5 text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="pr-8 text-base font-semibold text-[#241c16]">Notify me when available</h3>
            <p className="mt-1 text-sm text-[#6d6259]">{product.name}</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="you@example.com"
              autoFocus
              className="mt-4 w-full rounded-full border border-[#e7dfd5] px-4 py-2.5 text-sm outline-none focus:border-[#a47735]"
            />
            {status === "error" && <p className="mt-2 text-xs text-[#a3462f]">{error}</p>}
            <button
              type="button"
              onClick={submit}
              disabled={status === "loading"}
              className="mt-4 w-full rounded-full bg-[#211b17] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332822] disabled:opacity-60"
            >
              {status === "loading" ? "Saving…" : "Notify Me"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}