"use client";

import { useEffect, useState } from "react";
import { AuthError, sendOtp, verifyOtp, type AuthUser } from "../../lib/authApi";
import { CloseIcon } from "../Collections/icons";

const inputCls =
  "w-full rounded-lg border border-[#e7dfd5] bg-white px-3 py-2.5 text-sm text-[#241c16] outline-none focus:border-[#a47735]";

export default function LoginModal({
  message,
  onClose,
  onVerified,
}: {
  message?: string;
  onClose: () => void;
  onVerified: (user: AuthUser) => void;
}) {
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const requestOtp = async () => {
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Enter a valid 10-digit mobile number.");

    setError("");
    setLoading(true);
    try {
      const r = await sendOtp(name.trim(), phone);
      setOtp("");
      setCooldown(r.resendIn || 30);
      setStep("otp");
    } catch (e) {
      setError(e instanceof AuthError ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    if (!/^\d{6}$/.test(otp)) return setError("Enter the 6-digit OTP.");
    setError("");
    setLoading(true);
    try {
      onVerified(await verifyOtp({ name: name.trim(), phone, otp }));
    } catch (e) {
      setError(e instanceof AuthError ? e.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:px-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="relative max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[#6d6259] hover:bg-[#f5eee5]"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <h2 className="pr-8 text-lg font-semibold text-[#241c16]">Login</h2>

        {message && (
          <p role="alert" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
            {message}
          </p>
        )}

        {step === "details" ? (
          <div className="mt-4 space-y-3">
            <input
              className={inputCls}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={100}
            />
            <div className="flex overflow-hidden rounded-lg border border-[#e7dfd5] focus-within:border-[#a47735]">
              <span className="flex items-center border-r border-[#e7dfd5] bg-[#faf8f4] px-3 text-sm text-[#6d6259]">+91</span>
              <input
                className="w-full bg-transparent px-3 py-2.5 text-sm text-[#241c16] outline-none"
                placeholder="Mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                onKeyDown={(e) => e.key === "Enter" && requestOtp()}
                inputMode="numeric"
                autoComplete="tel-national"
              />
            </div>

            {error && <p role="alert" className="text-xs text-red-700">{error}</p>}

            <button
              type="button"
              onClick={requestOtp}
              disabled={loading}
              className="w-full rounded-full bg-[#211b17] py-3 text-sm font-semibold text-white transition hover:bg-[#332822] disabled:opacity-60"
            >
              {loading ? "Sending OTP…" : "Send OTP"}
            </button>
            <p className="text-center text-xs text-[#6d6259]">We will send a 6-digit OTP by SMS to verify your number.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-[#6d6259]">
              OTP sent to <span className="font-medium text-[#241c16]">+91 {phone}</span>{" "}
              <button
                type="button"
                onClick={() => {
                  setStep("details");
                  setError("");
                }}
                className="text-[#8c6327] underline underline-offset-2"
              >
                Change
              </button>
            </p>

            <input
              className={`${inputCls} text-center text-lg tracking-[0.4em]`}
              placeholder="······"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && verify()}
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
            />

            {error && <p role="alert" className="text-xs text-red-700">{error}</p>}

            <button
              type="button"
              onClick={verify}
              disabled={loading}
              className="w-full rounded-full bg-[#211b17] py-3 text-sm font-semibold text-white transition hover:bg-[#332822] disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify & continue"}
            </button>

            <button
              type="button"
              onClick={requestOtp}
              disabled={cooldown > 0 || loading}
              className="w-full text-center text-xs text-[#8c6327] underline underline-offset-2 disabled:text-[#a89d8f] disabled:no-underline"
            >
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}