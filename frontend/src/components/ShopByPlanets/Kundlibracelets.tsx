"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import NextImage, { type StaticImageData } from "next/image";

import Aries from "../../../public/images/aries_image.jpg";
import Aquarius from "../../../public/images/aquarius_image.jpg";
import Cancer from "../../../public/images/cancer_image.jpg";
import Capricorn from "../../../public/images/capricorn_image.jpg";
import Leo from "../../../public/images/leo_image.jpg";
import Pisces from "../../../public/images/pisces_image.jpg";
import Libra from "../../../public/images/libra_image.jpg";
import Sagittarius from "../../../public/images/sagitarius_image.jpg";
import Taurus from "../../../public/images/taurus_image.jpg";
import Scorpio from "../../../public/images/scorpio_image.jpg";
import Virgo from "../../../public/images/virgo_image.jpg";
import Gemini from "../../../public/images/gemini_image.jpg";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Rashi = {
  name: string;
  sanskrit: string;
  gemstone: string;
  planet: string;
  glyph: string;
  color: string;
  image: StaticImageData;
};

// Ordered Aries → Pisces so index math lines up with getRashiIndex() below.
const RASHIS: Rashi[] = [
  { name: "Aries", sanskrit: "Mesha", gemstone: "Red Coral", planet: "Mars", glyph: "♈", color: "#B23A2E", image: Aries },
  { name: "Taurus", sanskrit: "Vrishabha", gemstone: "Diamond", planet: "Venus", glyph: "♉", color: "#9C6FA3", image: Taurus },
  { name: "Gemini", sanskrit: "Mithuna", gemstone: "Emerald", planet: "Mercury", glyph: "♊", color: "#4C7C59", image: Gemini },
  { name: "Cancer", sanskrit: "Karka", gemstone: "Pearl", planet: "Moon", glyph: "♋", color: "#6E7887", image: Cancer },
  { name: "Leo", sanskrit: "Simha", gemstone: "Ruby", planet: "Sun", glyph: "♌", color: "#C2531F", image: Leo },
  { name: "Virgo", sanskrit: "Kanya", gemstone: "Emerald", planet: "Mercury", glyph: "♍", color: "#4C7C59", image: Virgo },
  { name: "Libra", sanskrit: "Tula", gemstone: "Diamond", planet: "Venus", glyph: "♎", color: "#9C6FA3", image: Libra },
  { name: "Scorpio", sanskrit: "Vrishchika", gemstone: "Red Coral", planet: "Mars", glyph: "♏", color: "#7A2E3A", image: Scorpio },
  { name: "Sagittarius", sanskrit: "Dhanu", gemstone: "Yellow Sapphire", planet: "Jupiter", glyph: "♐", color: "#B8862F", image: Sagittarius },
  { name: "Capricorn", sanskrit: "Makara", gemstone: "Blue Sapphire", planet: "Saturn", glyph: "♑", color: "#33526E", image: Capricorn },
  { name: "Aquarius", sanskrit: "Kumbha", gemstone: "Blue Sapphire", planet: "Saturn", glyph: "♒", color: "#3E7089", image: Aquarius },
  { name: "Pisces", sanskrit: "Meena", gemstone: "Yellow Sapphire", planet: "Jupiter", glyph: "♓", color: "#B8742F", image: Pisces },
];

const RASHI_THREAD = `linear-gradient(90deg, ${RASHIS.map((r) => r.color).join(", ")})`;

/** Sun-sign lookup from a birth date. Approximate (tropical, calendar-based) —
 *  a full Vedic Kundli additionally needs birth time and place, which the
 *  copy below is upfront about. */
function getRashiIndex(dateStr: string): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(d.getTime())) return null;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const ranges: [number, number, number, number, number][] = [
    [0, 3, 21, 4, 19],
    [1, 4, 20, 5, 20],
    [2, 5, 21, 6, 20],
    [3, 6, 21, 7, 22],
    [4, 7, 23, 8, 22],
    [5, 8, 23, 9, 22],
    [6, 9, 23, 10, 22],
    [7, 10, 23, 11, 21],
    [8, 11, 22, 12, 21],
  ];
  for (const [idx, sm, sd, em, ed] of ranges) {
    if ((m === sm && day >= sd) || (m === em && day <= ed)) return idx;
  }
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return 9;
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return 10;
  if ((m === 2 && day >= 19) || (m === 3 && day <= 20)) return 11;
  return null;
}

const ORBIT_RADIUS = 96;

function orbitPosition(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: Math.cos(angle) * ORBIT_RADIUS,
    y: Math.sin(angle) * ORBIT_RADIUS,
  };
}

/* ------------------------------------------------------------------ */
/*  Small inline icons (kept local so this file has no dependencies)   */
/* ------------------------------------------------------------------ */

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.87.51 3.61 1.4 5.11L2 22l5.06-1.33A9.96 9.96 0 0 0 12.02 22C17.54 22 22 17.52 22 12S17.54 2 12.02 2Zm0 18.13c-1.7 0-3.29-.47-4.64-1.29l-.33-.2-3 .79.8-2.92-.22-.3a8.14 8.14 0 0 1-1.28-4.4c0-4.5 3.66-8.16 8.17-8.16a8.1 8.1 0 0 1 5.77 2.4 8.1 8.1 0 0 1 2.39 5.77c0 4.51-3.66 8.31-8.16 8.31Z" />
    </svg>
  );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type Source = "date" | "manual" | null;

export default function KundliBracelets() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const reduceMotionRef = useRef(false);

  const [isVisible, setIsVisible] = useState(false);
  const [dob, setDob] = useState("");
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const [source, setSource] = useState<Source>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });
  const [pressed, setPressed] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const dobIndex = useMemo(() => getRashiIndex(dob), [dob]);
  const matchIndex = source === "manual" ? manualIndex : dobIndex;
  const match = matchIndex !== null ? RASHIS[matchIndex] : null;
  const preview = hoverIndex !== null ? RASHIS[hoverIndex] : match;

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Reveal the section once, the moment it enters view — one orchestrated
  // entrance rather than per-element scroll effects.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleCtaMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = ctaRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    setMagnet({ x: relX * 0.16, y: relY * 0.3 });
  }, []);

  const resetMagnet = useCallback(() => setMagnet({ x: 0, y: 0 }), []);

  const handleChartTilt = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotionRef.current) return;
    const el = chartRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -7, ry: px * 9 });
  }, []);

  const resetTilt = useCallback(() => setTilt({ rx: 0, ry: 0 }), []);

  function handleDobChange(value: string) {
    setDob(value);
    setSource("date");
  }

  function handlePickRashi(index: number) {
    setManualIndex(index);
    setSource("manual");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    document.getElementById("kb-result")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <section
      ref={sectionRef}
      id="kundli-bracelets"
      className="kb-section relative overflow-hidden bg-[#FCFBF8] py-20 sm:py-28"
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,500;0,600;1,500;1,600&family=Manrope:wght@400;500;600;700&display=swap");
        .ng-display {
          font-family: "Newsreader", serif;
        }
        .ng-ui {
          font-family: "Manrope", sans-serif;
        }
      `}</style>

      <style jsx>{`
        .kb-section {
          background-image:
            radial-gradient(circle at 90% 0%, rgba(226, 113, 29, 0.08), transparent 38%),
            radial-gradient(circle at 4% 100%, rgba(184, 35, 47, 0.07), transparent 40%);
        }

        @keyframes kb-fade-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes kb-orbit-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes kb-counter-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes kb-glow-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--glow-color, #e2711d) 45%, transparent);
          }
          50% {
            box-shadow: 0 0 0 8px color-mix(in srgb, var(--glow-color, #e2711d) 0%, transparent);
          }
        }
        @keyframes kb-result-in {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes kb-portrait-in {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .kb-reveal {
          opacity: 0;
          transform: translateY(16px);
        }
        .kb-reveal.kb-visible {
          animation: kb-fade-up 650ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .kb-orbit-ring {
          animation: kb-orbit-spin 90s linear infinite;
        }
        .kb-orbit-chip {
          animation: kb-counter-spin 90s linear infinite;
        }
        .kb-panel:hover .kb-orbit-ring,
        .kb-panel:hover .kb-orbit-chip {
          animation-play-state: paused;
        }
        .kb-chip-match {
          animation: kb-glow-pulse 1.8s ease-out infinite;
        }
        .kb-result {
          animation: kb-result-in 380ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .kb-portrait {
          animation: kb-portrait-in 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .kb-clip {
          clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
        }
        .kb-clip-lg {
          clip-path: polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%);
        }
        .kb-cta {
          transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), background-color 200ms ease, box-shadow 200ms ease;
        }
        .kb-cta:active {
          transform: scale(0.96) !important;
        }
        .kb-tilt {
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
          transform-style: preserve-3d;
        }
        .kb-pick {
          transition: transform 160ms ease, background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
        }
        .kb-pick:hover {
          transform: translateY(-2px);
        }

        @media (prefers-reduced-motion: reduce) {
          .kb-reveal {
            opacity: 1;
            transform: none;
            animation: none !important;
          }
          .kb-orbit-ring,
          .kb-orbit-chip,
          .kb-chip-match,
          .kb-result,
          .kb-portrait {
            animation: none !important;
          }
          .kb-cta,
          .kb-tilt,
          .kb-pick {
            transition: none !important;
          }
        }
      `}</style>

      <div className="relative mx-auto max-w-container px-6 sm:px-8 lg:px-10">
        {/* ------------------------------------------------------------ */}
        {/* Centered intro                                                */}
        {/* ------------------------------------------------------------ */}
        <div className={`kb-reveal mx-auto max-w-[62ch] text-center ${isVisible ? "kb-visible" : ""}`}>
          <p className="ng-display text-[15px] italic text-[#B8232F]">A remedy chosen for you, not off a shelf</p>
          <h2 className="ng-display mt-3 text-[34px] italic leading-[1.15] text-[#1C1024] sm:text-[42px] lg:text-[48px]">
            Find Your Rashi
          </h2>
          <p className="ng-ui mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-[#1C1024]/60">
            Enter your date of birth, or tap a sign below, and we&apos;ll match your rashi to the gemstone
            that strengthens it. For a complete Kundli reading we&apos;ll also ask for your birth time and
            place on a call.
          </p>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Console panel: chart on one side, form + result on the other  */}
        {/* ------------------------------------------------------------ */}
        <div
          className={`kb-panel kb-reveal kb-clip-lg relative mx-auto mt-12 max-w-4xl overflow-hidden border border-[#1C1024]/10 bg-white shadow-[0_24px_60px_-32px_rgba(28,16,36,0.22)] sm:mt-16 ${
            isVisible ? "kb-visible" : ""
          }`}
          style={{ transitionDelay: "80ms" }}
        >
          <div className="h-[3px] w-full" style={{ backgroundImage: RASHI_THREAD }} aria-hidden="true" />

          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">
            {/* ---------------------------------------------------- */}
            {/* Chart column                                         */}
            {/* ---------------------------------------------------- */}
            <div className="flex items-center justify-center border-b border-[#1C1024]/8 p-8 md:border-b-0 md:border-r">
              <div
                ref={chartRef}
                onMouseMove={handleChartTilt}
                onMouseLeave={resetTilt}
                className="kb-tilt relative mx-auto flex aspect-square w-[min(240px,62vw)] items-center justify-center [perspective:900px]"
                style={{ transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
              >
                <div
                  className="pointer-events-none absolute h-[85%] w-[85%] rounded-full opacity-70 blur-2xl"
                  style={{ background: "radial-gradient(circle, rgba(226,113,29,0.14), transparent 70%)" }}
                  aria-hidden="true"
                />

                <svg
                  viewBox="0 0 300 300"
                  className="relative h-[64%] w-[64%] drop-shadow-[0_8px_18px_rgba(28,16,36,0.1)]"
                  role="img"
                  aria-label="Vedic Kundli chart"
                >
                  <defs>
                    <linearGradient id="kb-grid-stroke" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#B8862F" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#B8232F" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  <g stroke="url(#kb-grid-stroke)" strokeWidth="1.1" fill="none">
                    <rect x="10" y="10" width="280" height="280" />
                    <path d="M10,10 L290,290 M290,10 L10,290" />
                    <path d="M150,10 L290,150 L150,290 L10,150 Z" />
                  </g>
                </svg>

                {/* Portrait medallion — shows the sign currently being previewed */}
                <div className="pointer-events-none absolute flex flex-col items-center gap-1.5">
                  {preview ? (
                    <div
                      key={preview.name}
                      className="kb-portrait relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-white shadow-[0_4px_14px_rgba(28,16,36,0.22)]"
                      style={{ boxShadow: `0 0 0 2px ${preview.color}` }}
                    >
                      <NextImage src={preview.image} alt="" fill sizes="44px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-[#1C1024]/20 text-[15px] text-[#1C1024]/30">
                      ✦
                    </div>
                  )}
                  <span className="ng-display text-[11px] italic leading-tight text-[#1C1024]/65">
                    {preview ? `${preview.gemstone} for ${preview.name}` : "Your sky, your stone"}
                  </span>
                </div>

                <div className="kb-orbit-ring absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                  {RASHIS.map((rashi, i) => {
                    const pos = orbitPosition(i, RASHIS.length);
                    const isMatch = matchIndex === i;
                    return (
                      <div
                        key={rashi.name}
                        className="absolute left-1/2 top-1/2"
                        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                      >
                        <button
                          type="button"
                          onClick={() => handlePickRashi(i)}
                          onMouseEnter={() => setHoverIndex(i)}
                          onMouseLeave={() => setHoverIndex(null)}
                          onFocus={() => setHoverIndex(i)}
                          onBlur={() => setHoverIndex(null)}
                          aria-label={`${rashi.name}, ${rashi.gemstone}`}
                          aria-pressed={isMatch}
                          className={`kb-orbit-chip relative flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border transition-[transform,box-shadow] duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/60 ${
                            isMatch ? "kb-chip-match scale-125 border-transparent" : "border-white bg-white"
                          }`}
                          style={
                            {
                              boxShadow: isMatch ? `0 0 0 1.5px ${rashi.color}` : "0 1px 3px rgba(28,16,36,0.14)",
                              "--glow-color": rashi.color,
                            } as React.CSSProperties
                          }
                        >
                          <NextImage src={rashi.image} alt="" fill sizes="28px" className="object-cover" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* Form + result column                                 */}
            {/* ---------------------------------------------------- */}
            <div className="flex flex-col justify-center gap-6 p-8 sm:p-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex flex-1 flex-col gap-1.5">
                  <label htmlFor="kb-dob" className="ng-ui text-[12.5px] font-medium text-[#1C1024]/55">
                    Your date of birth
                  </label>
                  <input
                    id="kb-dob"
                    type="date"
                    value={dob}
                    onChange={(e) => handleDobChange(e.target.value)}
                    className="kb-clip ng-ui w-full border border-[#1C1024]/15 bg-[#FCFBF8] px-4 py-3 text-[14px] text-[#1C1024] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#E2711D]/60 focus:shadow-[0_0_0_3px_rgba(226,113,29,0.14)]"
                  />
                </div>

                <button
                  ref={ctaRef}
                  type="submit"
                  onMouseMove={handleCtaMove}
                  onMouseLeave={resetMagnet}
                  onMouseDown={() => setPressed(true)}
                  onMouseUp={() => setPressed(false)}
                  style={{ transform: `translate(${magnet.x}px, ${magnet.y}px)` }}
                  className="kb-clip kb-cta ng-ui group flex items-center justify-center gap-2 whitespace-nowrap bg-[#B8232F] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#93121C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Know Your Rashi
                  <ArrowIcon
                    className={`h-4 w-4 transition-transform duration-200 ${pressed ? "" : "group-hover:translate-x-1"}`}
                  />
                </button>
              </form>

              <div className="flex items-center gap-3 text-[#1C1024]/30" aria-hidden="true">
                <span className="h-px flex-1 bg-current" />
                <span className="ng-ui text-[11.5px] text-[#1C1024]/45">or tap your sign</span>
                <span className="h-px flex-1 bg-current" />
              </div>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {RASHIS.map((rashi, i) => {
                  const isMatch = matchIndex === i;
                  return (
                    <button
                      key={rashi.name}
                      type="button"
                      onClick={() => handlePickRashi(i)}
                      onMouseEnter={() => setHoverIndex(i)}
                      onMouseLeave={() => setHoverIndex(null)}
                      aria-pressed={isMatch}
                      className={`kb-pick kb-clip flex flex-col items-center gap-1.5 border px-1.5 py-2.5 text-center ${
                        isMatch ? "border-transparent" : "border-[#1C1024]/10 bg-[#FCFBF8]"
                      }`}
                      style={{
                        backgroundColor: isMatch ? `color-mix(in srgb, ${rashi.color} 14%, white)` : undefined,
                        boxShadow: isMatch ? `0 0 0 1.5px ${rashi.color}` : undefined,
                      }}
                    >
                      <span
                        className="relative block h-6 w-6 overflow-hidden rounded-full ring-1 ring-white"
                        style={{ boxShadow: `0 0 0 1px ${rashi.color}55` }}
                      >
                        <NextImage src={rashi.image} alt="" fill sizes="24px" className="object-cover" />
                      </span>
                      <span className="ng-ui text-[9.5px] leading-tight text-[#1C1024]/55">{rashi.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Result — appears once a rashi is known, from either input */}
              <div id="kb-result" className="min-h-[1px] scroll-mt-24">
                {match && (
                  <div
                    key={match.name}
                    className="kb-result kb-clip flex flex-col gap-4 border border-[#1C1024]/10 bg-[#FCFBF8] px-5 py-4 sm:flex-row sm:items-center"
                  >
                    <span
                      className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-white"
                      style={{ boxShadow: `0 0 0 2px ${match.color}` }}
                    >
                      <NextImage src={match.image} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="ng-display text-[16px] italic text-[#1C1024]">
                        {match.name} <span className="text-[#1C1024]/40">· {match.sanskrit}</span>
                      </p>
                      <p className="ng-ui text-[12.5px] text-[#1C1024]/55">
                        Ruled by {match.planet} — your stone is {match.gemstone}
                      </p>
                    </div>
                    {/* <a
                      href="https://wa.me/918598573812?text=Hello%2C%20I%27d%20like%20a%20Kundli%20based%20bracelet%20consultation."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ng-ui flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-[#B8232F] hover:text-[#93121C]"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      Talk to an astrologer
                    </a> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}