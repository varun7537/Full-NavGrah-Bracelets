"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ChevronRight, Instagram, Mail, X, Moon } from "./icons";
import "../../styles/PromoBar.css";

type PromoMessage = {
  id: string;
  text: string;
};

const PROMO_MESSAGES: PromoMessage[] = [
  { id: "crystal-remedies", text: "Kundli Based Crystal Remedies" },
  { id: "certified-gemstones", text: "Certified Navratna & Rare Gemstones" },
  { id: "free-consultation", text: "Free Vedic Consultation on Orders Above ₹4,999" },
];

const AUTO_ROTATE_MS = 5000;
const DISMISS_STORAGE_KEY = "navgrah-promo-dismissed";

export default function PromoBar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Respect a previous dismissal for this browser session
  useEffect(() => {
    try {
      const dismissed = window.sessionStorage.getItem(DISMISS_STORAGE_KEY);
      if (dismissed === "true") setIsVisible(false);
    } catch {
      // sessionStorage unavailable (private mode etc.) — fail silently
    }
  }, []);

  // Auto-rotate messages, pausing on hover/focus
  useEffect(() => {
    if (!isVisible || isPaused || PROMO_MESSAGES.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PROMO_MESSAGES.length);
    }, AUTO_ROTATE_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isVisible, isPaused]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + PROMO_MESSAGES.length) % PROMO_MESSAGES.length);
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % PROMO_MESSAGES.length);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsVisible(false);
      try {
        window.sessionStorage.setItem(DISMISS_STORAGE_KEY, "true");
      } catch {
        // ignore
      }
    }, 320);
  }, []);

  if (!isVisible) return null;

  const activeMessage = PROMO_MESSAGES[activeIndex];

  return (
    <div
      role="region"
      aria-label="Promotional announcement"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={`navgrah-promo-bar relative isolate flex h-11 items-center justify-center overflow-hidden border-b border-[#caa14d]/30 px-3 text-[#f5e6c8] sm:h-[46px] sm:px-4 ${
        isClosing ? "navgrah-exit" : "navgrah-enter"
      }`}
    >
      {/* Animated gradient background */}
      <div className="navgrah-bg-gradient absolute inset-0 -z-10" aria-hidden="true" />

      {/* Cosmic particles / decorative glyphs */}
      <div className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden" aria-hidden="true">
        <span className="navgrah-twinkle absolute left-[6%] top-1/2 -translate-y-1/2 text-[10px] text-[#f3d9a4]/60 sm:left-[10%]">
          ✦
        </span>
        <span
          className="navgrah-twinkle absolute left-[20%] top-[30%] text-[8px] text-[#f3d9a4]/40 sm:left-[22%]"
          style={{ animationDelay: "0.8s" }}
        >
          ✧
        </span>
        <span
          className="navgrah-twinkle absolute right-[22%] top-[35%] hidden text-[9px] text-[#f3d9a4]/50 sm:block"
          style={{ animationDelay: "1.4s" }}
        >
          ✦
        </span>
        <span
          className="navgrah-twinkle absolute right-[6%] top-1/2 -translate-y-1/2 text-[10px] text-[#f3d9a4]/50 sm:right-[10%]"
          style={{ animationDelay: "0.4s" }}
        >
          ✧
        </span>
      </div>

      {/* Center content */}
      <div className="flex max-w-[78%] items-center justify-center gap-2 sm:max-w-[60%] sm:gap-3">
        <Moon
          className="navgrah-moon-glow hidden h-3.5 w-3.5 shrink-0 text-[#f3d9a4]/80 sm:block"
          aria-hidden={true}
        />

        <p
          key={activeMessage.id}
          className="navgrah-message-fade navgrah-shimmer-text truncate text-center text-[12px] font-medium tracking-[0.02em] sm:text-[13.5px]"
        >
          {activeMessage.text}
        </p>

        <a
          href="/collections"
          className="group hidden shrink-0 items-center gap-1 rounded-full border border-[#f3d9a4]/40 bg-white/[0.06] px-2.5 py-[3px] text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#f8e7bd] backdrop-blur-sm transition-all duration-300 hover:border-[#f3d9a4]/80 hover:bg-white/[0.12] hover:shadow-[0_0_12px_rgba(243,217,164,0.35)] active:scale-95 sm:flex"
        >
          Explore Collection
          <ChevronRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>

      <div className="absolute right-2 flex items-center gap-2 sm:right-3 sm:gap-3">
        {PROMO_MESSAGES.length > 1 && (
          <div className="flex items-center gap-1 sm:hidden" role="tablist" aria-label="Announcement selector">
            {PROMO_MESSAGES.map((msg, i) => (
              <button
                key={msg.id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Show announcement ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-3.5 bg-[#f3d9a4]" : "w-1.5 bg-[#f3d9a4]/35"
                }`}
              />
            ))}
          </div>
        )}

        <div className="hidden items-center gap-2.5 sm:flex">
          <a
            href="https://www.instagram.com/navgrahbracelets/"
            aria-label="Navgrah on Instagram"
            className="text-[#f3d9a4]/85 transition-all duration-300 hover:scale-110 hover:text-[#f3d9a4] hover:drop-shadow-[0_0_6px_rgba(243,217,164,0.6)]"
          >
            <Instagram className="h-[20px] w-[20px]" />
          </a>
          <a
            href="mailto:info@navgrahbracelets.com"
            aria-label="Email Navgrah"
            className="text-[#f3d9a4]/85 transition-all duration-300 hover:scale-110 hover:text-[#f3d9a4] hover:drop-shadow-[0_0_6px_rgba(243,217,164,0.6)]"
          >
            <Mail className="h-[20px] w-[20px]" />
          </a>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement bar"
          className="group flex h-6 w-6 items-center justify-center rounded-full text-[#f3d9a4]/70 transition-all duration-300 hover:rotate-90 hover:bg-white/10 hover:text-[#f3d9a4] active:scale-90"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}