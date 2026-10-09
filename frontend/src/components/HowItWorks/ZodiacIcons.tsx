// src/components/HowItWorks/ZodiacIcons.tsx
"use client";

import type { CSSProperties, ReactNode } from "react";

type RashiIconId =
  | "mesha"
  | "vrishabha"
  | "mithuna"
  | "karka"
  | "simha"
  | "kanya"
  | "tula"
  | "vrishchika"
  | "dhanu"
  | "makara"
  | "kumbha"
  | "meena";

const PATHS: Record<RashiIconId, ReactNode> = {
  // Aries — ram's horns
  mesha: (
    <>
      <path d="M12 20v-7" />
      <path d="M12 13c-4 0-6-4-4-8 1.5 2 1.5 5 4 6" />
      <path d="M12 13c4 0 6-4 4-8-1.5 2-1.5 5-4 6" />
    </>
  ),
  // Taurus — bull's head and horns
  vrishabha: (
    <>
      <circle cx="12" cy="15" r="5" />
      <path d="M7 10c-1-4 1-7 5-5 4-2 6 1 5 5" />
    </>
  ),
  // Gemini — the twins
  mithuna: (
    <>
      <path d="M8 5h3" />
      <path d="M8 19h3" />
      <path d="M9.5 5v14" />
      <path d="M13 5h3" />
      <path d="M13 19h3" />
      <path d="M14.5 5v14" />
    </>
  ),
  // Cancer — the crab
  karka: (
    <>
      <circle cx="8" cy="9" r="2" />
      <path d="M8 11c0 5 7 5 7-1" />
      <circle cx="16" cy="15" r="2" />
      <path d="M16 13c0-5-7-5-7 1" />
    </>
  ),
  // Leo — the lion
  simha: (
    <>
      <circle cx="9" cy="7" r="3" />
      <path d="M9 10v4c0 3.5 3.5 4.5 5 2.5 1-1.3.2-3-1.2-2.7-1 .2-1.3 1.5-.3 2.2" />
    </>
  ),
  // Virgo — the maiden
  kanya: (
    <>
      <path d="M6 5v13" />
      <path d="M6 5.5c0-1.6 2-1.6 2 0v12.5" />
      <path d="M8 5.5c0-1.6 2-1.6 2 0v10" />
      <path d="M10 5.5c0-1.6 2-1.6 2 0v13c0 2 2.5 2.5 3.5 1" />
    </>
  ),
  // Libra — the scales
  tula: (
    <>
      <path d="M9 16c0-4 6-4 6 0" />
      <path d="M5 16h14" />
      <path d="M7 20h10" />
    </>
  ),
  // Scorpio — like Virgo's M, with a stinger tail
  vrishchika: (
    <>
      <path d="M6 5v13" />
      <path d="M6 5.5c0-1.6 2-1.6 2 0v12.5" />
      <path d="M8 5.5c0-1.6 2-1.6 2 0v10" />
      <path d="M10 5.5c0-1.6 2-1.6 2 0v13h3" />
      <path d="M15 18l2-2" />
      <path d="M15 16l2 2" />
    </>
  ),
  // Sagittarius — the archer's arrow
  dhanu: (
    <>
      <path d="M6 18L18 6" />
      <path d="M13 6h5v5" />
      <path d="M10 15l-2.5-2.5" />
    </>
  ),
  // Capricorn — the sea-goat
  makara: (
    <>
      <path d="M6 5v9c0 2.8 3.5 2.8 3.5 0V9" />
      <path d="M9.5 12c0 4 3.5 4 3.5 0" />
      <circle cx="15.5" cy="15.5" r="2.5" />
      <path d="M13 12c1 0 2.2.8 2.5 2" />
    </>
  ),
  // Aquarius — the water-bearer's waves
  kumbha: (
    <>
      <path d="M4 9l3 2 3-2 3 2 3-2 3 2" />
      <path d="M4 15l3 2 3-2 3 2 3-2 3 2" />
    </>
  ),
  // Pisces — the two fish
  meena: (
    <>
      <path d="M8 4c-3 3-3 13 0 16" />
      <path d="M16 4c3 3 3 13 0 16" />
      <path d="M8 12h8" />
    </>
  ),
};

/** Raw path content only — use when nesting inside an existing <svg> (e.g. RashiWheel). */
export function ZodiacGlyphContent({ id }: { id: string }) {
  return <>{PATHS[id as RashiIconId] ?? null}</>;
}

interface ZodiacIconProps {
  id: string;
  className?: string;
  style?: CSSProperties;
}

/** Standalone icon — use in regular HTML contexts (cards, lists, buttons). */
export function ZodiacIcon({ id, className, style }: ZodiacIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <ZodiacGlyphContent id={id} />
    </svg>
  );
}