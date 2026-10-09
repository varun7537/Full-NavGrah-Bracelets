// src/components/RashiBracelets/ElementPhilosophy.tsx
"use client";

import { DEFAULT_RASHIS, ELEMENT_INFO, ELEMENT_PALETTE, Element } from "./data";
import { Reveal, SectionHeading } from "./primitives";
import { hexToRgba } from "./utils";

const ELEMENT_KEYS = Object.keys(ELEMENT_PALETTE) as Element[];

export default function ElementPhilosophy() {
  return (
    <section
      aria-labelledby="element-philosophy-heading"
      className="relative bg-[#FBF8F3] px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="element-philosophy-heading"
            eyebrow="Elemental energy"
            title="Four elements, four ways of moving through the world"
            description="Every rashi belongs to one of four elements. It shapes the temperament each sign is known for."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ELEMENT_KEYS.map((key, index) => {
            const palette = ELEMENT_PALETTE[key];
            const info = ELEMENT_INFO[key];
            const signs = DEFAULT_RASHIS.filter((rashi) => rashi.element === key)
              .map((rashi) => rashi.sanskritName)
              .join(" \u00B7 ");

            return (
              <Reveal key={key} delayMs={index * 90}>
                <div
                  className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderColor: hexToRgba(palette.base, 0.25),
                    background: `linear-gradient(160deg, ${hexToRgba(
                      palette.light,
                      0.28
                    )} 0%, rgba(255,255,255,0.9) 60%)`,
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-70"
                    style={{ backgroundColor: palette.base }}
                  />

                  <div className="relative flex items-center justify-between">
                    <p className="font-display text-2xl font-semibold" style={{ color: palette.dark }}>
                      {palette.sanskrit}
                    </p>
                    <span className="text-xs font-medium tracking-[0.03em] text-[#221F1A]/45">
                      {palette.label}
                    </span>
                  </div>

                  <p className="relative text-sm font-medium text-[#221F1A]/70">{info.tagline}</p>

                  <p className="relative text-sm leading-relaxed text-[#221F1A]/60">
                    {info.description}
                  </p>

                  <p className="relative mt-auto text-xs text-[#221F1A]/40">{signs}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}