// src/components/RashiBracelets/ZodiacWheelSection.tsx
"use client";

import { useState } from "react";
import { DEFAULT_RASHIS, ELEMENT_PALETTE, Rashi, ZODIAC_ORDER, Element } from "./data";
import { Reveal, SectionHeading, useInView } from "./primitives";
import { hexToRgba, wheelPosition } from "./utils";

interface ZodiacWheelSectionProps {
  rashis?: Rashi[];
  collectionsBasePath?: string;
}

export default function ZodiacWheelSection({
  rashis = DEFAULT_RASHIS,
  collectionsBasePath = "/collections/",
}: ZodiacWheelSectionProps) {
  const { ref: revealRef, inView } = useInView<HTMLDivElement>(0.15);
  const [activeId, setActiveId] = useState<string | null>(null);

  const usesZodiacOrder =
    rashis.length === 12 &&
    ZODIAC_ORDER.every((id) => rashis.some((rashi) => rashi.id === id));

  const arranged: Rashi[] = usesZodiacOrder
    ? ZODIAC_ORDER.map((id) => rashis.find((rashi) => rashi.id === id)).filter(
        (rashi): rashi is Rashi => Boolean(rashi)
      )
    : rashis.slice(0, 12);

  const active = arranged.find((rashi) => rashi.id === activeId) ?? null;

  return (
    <section
      id="find-your-rashi"
      aria-labelledby="zodiac-wheel-heading"
      className="relative bg-[#FBF8F3] px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading
            id="zodiac-wheel-heading"
            eyebrow="The zodiac wheel"
            title="Trace your rashi around the wheel"
            description="Hover or tap a sign to see its element, ruling planet, gemstone, and the energy it's known for."
          />
        </Reveal>

        {/* Element legend */}
        <Reveal
          delayMs={80}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {(Object.keys(ELEMENT_PALETTE) as Element[]).map((key) => {
            const element = ELEMENT_PALETTE[key];

            return (
              <div key={key} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: element.base }}
                />
                <span className="flex items-baseline gap-1.5 text-[#221F1A]/55">
                  <span className="font-display text-sm font-medium text-[#221F1A]/75">
                    {element.sanskrit}
                  </span>
                  <span className="text-[0.68rem] tracking-[0.03em]">{element.label}</span>
                </span>
              </div>
            );
          })}
        </Reveal>

        {/* Desktop / tablet: radial zodiac wheel */}
        <div
          ref={revealRef}
          className="relative mx-auto mt-14 hidden aspect-square md:block"
          style={{ width: "min(88vw, 600px)" }}
        >
          <WheelOrnament className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]" />

          <ul role="list" className="absolute inset-0">
            {arranged.map((rashi, index) => {
              const { x, y } = wheelPosition(index, arranged.length, 38);

              return (
                <li
                  key={rashi.id}
                  className="absolute"
                  style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                >
                  <WheelNode
                    rashi={rashi}
                    href={`${collectionsBasePath}${rashi.slug}`}
                    inView={inView}
                    delayMs={index * 45}
                    isActive={activeId === rashi.id}
                    onActivate={() => setActiveId(rashi.id)}
                    onDeactivate={() =>
                      setActiveId((current) => (current === rashi.id ? null : current))
                    }
                  />
                </li>
              );
            })}
          </ul>

          <div
            aria-live="polite"
            className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            style={{ width: "46%", height: "46%" }}
          >
            <CenterReadout
              rashi={active}
              href={active ? `${collectionsBasePath}${active.slug}` : undefined}
            />
          </div>
        </div>

        {/* Mobile: tap-to-expand grid */}
        <ul role="list" className="mt-14 grid grid-cols-3 items-start gap-3 md:hidden">
          {arranged.map((rashi) => (
            <li key={rashi.id} className="contents">
              <GridCard
                rashi={rashi}
                href={`${collectionsBasePath}${rashi.slug}`}
                isExpanded={activeId === rashi.id}
                onToggle={() =>
                  setActiveId((current) => (current === rashi.id ? null : rashi.id))
                }
              />
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes rashi-wheel-in {
          from { opacity: 0; transform: scale(0.6) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes rashi-ring-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes rashi-detail-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rashi-node { position: relative; overflow: hidden; }

        .rashi-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 25%, rgba(255,255,255,0.65) 48%, transparent 72%);
          transform: translateX(-130%);
          transition: transform 0.65s ease;
          pointer-events: none;
        }

        .rashi-node:hover .rashi-shine,
        .rashi-node:focus-visible .rashi-shine {
          transform: translateX(130%);
        }

        .rashi-detail { animation: rashi-detail-in 0.2s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .rashi-shine { transition: none; transform: none !important; opacity: 0; }
          .rashi-detail { animation: none; }
        }
      `}</style>
    </section>
  );
}

function WheelNode({
  rashi,
  href,
  inView,
  delayMs,
  isActive,
  onActivate,
  onDeactivate,
}: {
  rashi: Rashi;
  href: string;
  inView: boolean;
  delayMs: number;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const palette = ELEMENT_PALETTE[rashi.element];

  return (
    <a
      href={href}
      aria-label={`Explore ${rashi.sanskritName} (${rashi.englishName}) bracelets — ${rashi.gemstone}. ${rashi.benefit}`}
      className="rashi-node group flex flex-col items-center justify-center gap-0.5 rounded-full border text-center transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#221F1A]"
    >
      <span
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onMouseLeave={onDeactivate}
        onBlur={onDeactivate}
        className="flex flex-col items-center justify-center gap-0.5"
        style={{
          opacity: inView ? 1 : 0,
          animation: inView
            ? "rashi-wheel-in 0.6s cubic-bezier(0.16,1,0.3,1) both"
            : undefined,
          animationDelay: `${delayMs}ms`,
          width: "clamp(58px, 15vw, 88px)",
          height: "clamp(58px, 15vw, 88px)",
          backgroundColor: hexToRgba(palette.base, isActive ? 0.22 : 0.1),
          borderColor: hexToRgba(palette.base, isActive ? 0.65 : 0.32),
          borderWidth: isActive ? "1.5px" : "1px",
          borderStyle: "solid",
          borderRadius: "9999px",
          transform: isActive ? "scale(1.08)" : "scale(1)",
          boxShadow: isActive
            ? `0 10px 28px -10px ${hexToRgba(palette.base, 0.55)}`
            : "none",
          transition:
            "background-color 0.3s ease-out, border-color 0.3s ease-out, transform 0.3s ease-out, box-shadow 0.3s ease-out",
        }}
      >
        <span aria-hidden="true" className="rashi-shine" />

        <span
          aria-hidden="true"
          className="relative leading-none"
          style={{ color: palette.dark, fontSize: "clamp(1rem, 2.6vw, 1.5rem)" }}
        >
          {rashi.symbol}
        </span>

        <span
          className="font-display relative leading-tight"
          style={{ color: palette.dark, fontWeight: 600, fontSize: "clamp(0.6rem, 1.6vw, 0.72rem)" }}
        >
          {rashi.sanskritName}
        </span>
      </span>
    </a>
  );
}

function CenterReadout({ rashi, href }: { rashi: Rashi | null; href?: string }) {
  if (!rashi || !href) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <MiniChartMark className="h-6 w-6 text-[#B8863E]/70" />
        <p className="max-w-[16ch] text-xs leading-snug text-[#221F1A]/45">
          Hover a sign to see its gemstone
        </p>
      </div>
    );
  }

  const palette = ELEMENT_PALETTE[rashi.element];

  return (
    <div
      className="rashi-detail flex flex-col items-center gap-1.5 rounded-full px-5 py-4 text-center"
      style={{ backgroundColor: hexToRgba(palette.light, 0.35) }}
    >
      <span aria-hidden="true" className="text-2xl leading-none" style={{ color: palette.dark }}>
        {rashi.symbol}
      </span>

      <p className="font-display text-base font-semibold leading-tight text-[#221F1A]">
        {rashi.sanskritName}
      </p>

      <p className="text-[0.68rem] tracking-[0.03em] text-[#221F1A]/45">{rashi.englishName}</p>

      <p className="mt-1 max-w-[20ch] text-xs leading-snug text-[#221F1A]/65">{rashi.benefit}</p>

      <p className="mt-1 text-[0.65rem] text-[#221F1A]/45">
        {rashi.gemstone} &middot; ruled by {rashi.rulingPlanet}
      </p>

      <a
        href={href}
        className="pointer-events-auto mt-1 text-[0.7rem] font-medium underline decoration-[#221F1A]/30 underline-offset-2 hover:decoration-[#221F1A]"
        aria-label={`Shop ${rashi.sanskritName} bracelets`}
      >
        Shop now
      </a>
    </div>
  );
}

function GridCard({
  rashi,
  href,
  isExpanded,
  onToggle,
}: {
  rashi: Rashi;
  href: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const palette = ELEMENT_PALETTE[rashi.element];
  const detailId = `rashi-wheel-detail-${rashi.id}`;

  return (
    <div
      className="rashi-node flex flex-col items-stretch rounded-2xl border bg-white/70 shadow-[0_10px_30px_-18px_rgba(34,31,26,0.25)] transition-colors duration-300 ease-out"
      style={{
        borderColor: hexToRgba(palette.base, isExpanded ? 0.55 : 0.22),
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={detailId}
        aria-label={`${rashi.sanskritName}, ${rashi.englishName}. ${
          isExpanded ? "Hide" : "Show"
        } details`}
        className="flex aspect-square w-full flex-col items-center justify-center gap-1 text-center focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#221F1A]"
        style={{ padding: "clamp(6px, 2vw, 14px)" }}
      >
        <span aria-hidden="true" className="rashi-shine" />

        <span
          aria-hidden="true"
          className="relative leading-none"
          style={{ color: palette.dark, fontSize: "clamp(0.95rem, 3.4vw, 1.35rem)" }}
        >
          {rashi.symbol}
        </span>

        <span
          className="font-display relative leading-tight"
          style={{ color: palette.dark, fontWeight: 600, fontSize: "clamp(0.68rem, 2.3vw, 0.92rem)" }}
        >
          {rashi.sanskritName}
        </span>

        <span
          className="relative leading-none tracking-[0.02em] text-[#221F1A]/45"
          style={{ fontSize: "clamp(0.5rem, 1.6vw, 0.6rem)" }}
        >
          {rashi.englishName}
        </span>
      </button>

      {isExpanded ? (
        <div
          id={detailId}
          className="rashi-detail flex flex-col items-center gap-1 border-t px-2 pb-3 pt-2 text-center"
          style={{ borderColor: hexToRgba(palette.base, 0.22) }}
        >
          <p className="text-[0.68rem] leading-snug text-[#221F1A]/70">{rashi.benefit}</p>
          <p className="text-[0.62rem] text-[#221F1A]/45">
            {rashi.gemstone} &middot; {rashi.rulingPlanet}
          </p>
          <a
            href={href}
            aria-label={`Shop ${rashi.sanskritName} bracelets`}
            className="mt-1 text-[0.68rem] font-medium underline decoration-[#221F1A]/30 underline-offset-2"
          >
            Shop now &rarr;
          </a>
        </div>
      ) : null}
    </div>
  );
}

function WheelOrnament({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 400" className={className}>
      <circle cx="200" cy="200" r="150" fill="none" stroke="#B8863E" strokeWidth="0.75" />

      <g
        className="[animation:rashi-ring-spin_170s_linear_infinite] motion-reduce:!animate-none"
        style={{ transformOrigin: "200px 200px" }}
      >
        <circle
          cx="200"
          cy="200"
          r="188"
          fill="none"
          stroke="#B8863E"
          strokeWidth="0.75"
          strokeDasharray="1 11"
        />
      </g>

      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * 2 * Math.PI;
        const x1 = 200 + 150 * Math.sin(angle);
        const y1 = 200 - 150 * Math.cos(angle);
        const x2 = 200 + 160 * Math.sin(angle);
        const y2 = 200 - 160 * Math.cos(angle);

        return (
          <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#B8863E" strokeWidth="1" />
        );
      })}
    </svg>
  );
}

function MiniChartMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className} fill="none">
      <rect x="1" y="1" width="38" height="38" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 1 L39 39 M39 1 L1 39" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
    </svg>
  );
}