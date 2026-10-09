// src/components/RashiBracelets/RashiGemstoneGrid.tsx
"use client";

import { DEFAULT_RASHIS, ELEMENT_PALETTE, Rashi } from "./data";
import { Reveal, SectionHeading } from "./primitives";
import { hexToRgba } from "./utils";

interface RashiGemstoneGridProps {
  rashis?: Rashi[];
  collectionsBasePath?: string;
}

export default function RashiGemstoneGrid({
  rashis = DEFAULT_RASHIS,
  collectionsBasePath = "/collections/",
}: RashiGemstoneGridProps) {
  return (
    <section
      id="gemstone-collection"
      aria-labelledby="gemstone-grid-heading"
      className="relative bg-[#FDFCFA] px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="gemstone-grid-heading"
            eyebrow="Every sign, every gemstone"
            title="Browse the full collection by rashi"
            description="Each sign is paired with the gemstone traditionally linked to its ruling planet."
          />
        </Reveal>

        <ul
          role="list"
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
        >
          {rashis.map((rashi, index) => (
            <Reveal key={rashi.id} as="li" delayMs={Math.min(index * 40, 320)}>
              <RashiGemstoneCard rashi={rashi} href={`${collectionsBasePath}${rashi.slug}`} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RashiGemstoneCard({ rashi, href }: { rashi: Rashi; href: string }) {
  const palette = ELEMENT_PALETTE[rashi.element];

  return (
    <div className="group relative flex h-full flex-col gap-3 rounded-2xl border border-[#221F1A]/8 bg-white p-5 text-left shadow-[0_14px_36px_-24px_rgba(34,31,26,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-20px_rgba(34,31,26,0.4)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-5 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-[#B8863E]/60 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />

      <div className="flex items-center justify-between">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-full text-lg"
          style={{
            backgroundColor: hexToRgba(palette.base, 0.12),
            color: palette.dark,
          }}
        >
          {rashi.symbol}
        </span>

        <span
          className="rounded-full px-2.5 py-1 text-[0.62rem] font-medium tracking-[0.02em]"
          style={{ backgroundColor: hexToRgba(palette.base, 0.1), color: palette.dark }}
        >
          {palette.label}
        </span>
      </div>

      <div>
        <p className="font-display text-lg font-semibold text-[#221F1A]">{rashi.sanskritName}</p>
        <p className="text-xs tracking-[0.02em] text-[#221F1A]/45">{rashi.englishName}</p>
      </div>

      <p className="text-sm leading-snug text-[#221F1A]/65">{rashi.benefit}</p>

      <div className="mt-auto flex flex-col gap-0.5 border-t border-[#221F1A]/8 pt-3 text-xs text-[#221F1A]/50">
        <span>{rashi.gemstone}</span>
        <span>Ruled by {rashi.rulingPlanet}</span>
      </div>

      <a
        href={href}
        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#A8793F] underline decoration-[#A8793F]/30 underline-offset-4 transition-colors hover:decoration-[#A8793F] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#221F1A]"
      >
        Explore Bracelet
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </a>
    </div>
  );
}