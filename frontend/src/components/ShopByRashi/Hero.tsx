// src/components/RashiBracelets/Hero.tsx
"use client";

import { DEFAULT_RASHIS, ELEMENT_PALETTE } from "./data";
import { Button, CelestialDots, Eyebrow, GlowOrb, Reveal } from "./primitives";
import { wheelPosition } from "./utils";

export default function Hero() {
  return (
    <section
      aria-label="Rashi gemstone bracelets introduction"
      className="relative overflow-hidden bg-[#FBF8F3] px-6 pb-20 pt-28 sm:pb-28 sm:pt-36"
    >
      <GlowOrb className="left-1/2 top-[-10%] h-[560px] w-[560px] -translate-x-1/2" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Copy */}
        <div className="flex flex-col items-start gap-6 text-left">
          <Reveal>
            <Eyebrow>Rashi Gemstone Bracelets</Eyebrow>
          </Reveal>

          <Reveal delayMs={80}>
            <h1 className="font-display max-w-[18ch] text-4xl font-semibold leading-[1.08] text-[#221F1A] sm:text-5xl lg:text-[3.4rem]">
              Wear the energy written into your stars
            </h1>
          </Reveal>

          <Reveal delayMs={160}>
            <p className="max-w-[46ch] text-base leading-relaxed text-[#221F1A]/65 sm:text-lg">
              Vedic astrology pairs each of the twelve rashis with a ruling
              planet and a gemstone. We turn that pairing into jewellery
              worth wearing every day — precise to your sign, not a generic
              birthstone chart.
            </p>
          </Reveal>

          <Reveal delayMs={240} className="flex flex-wrap items-center gap-4">
            <Button href="#find-your-rashi" showArrow>
              Find My Rashi
            </Button>

            <Button href="#gemstone-collection" variant="secondary">
              Explore Bracelets
            </Button>
          </Reveal>
        </div>

        {/* Decorative zodiac ring */}
        <Reveal delayMs={200} className="relative mx-auto aspect-square w-full max-w-[420px]">
          <CelestialDots className="pointer-events-none absolute -inset-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)] opacity-70" />

          <div className="absolute inset-0 rounded-full border border-[#B8863E]/25" />

          <div
            className="absolute inset-[8%] rounded-full border border-dashed border-[#B8863E]/30 motion-safe:[animation:hero-ring-spin_140s_linear_infinite]"
            aria-hidden="true"
          />

          <div className="absolute inset-[22%] rounded-full bg-white/60 shadow-[0_20px_60px_-20px_rgba(168,121,63,0.35)] backdrop-blur-sm" />

          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="flex max-w-[13ch] flex-col items-center gap-1 px-4">
              <span className="font-display text-lg font-semibold text-[#221F1A]">
                12 Rashis
              </span>
              <span className="text-xs text-[#221F1A]/50">
                one gemstone story each
              </span>
            </div>
          </div>

          {DEFAULT_RASHIS.map((rashi, index) => {
            const { x, y } = wheelPosition(index, DEFAULT_RASHIS.length, 44);
            const palette = ELEMENT_PALETTE[rashi.element];

            return (
              <span
                key={rashi.id}
                aria-hidden="true"
                className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white/80 text-sm"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  borderColor: `${palette.base}55`,
                  color: palette.dark,
                }}
              >
                {rashi.symbol}
              </span>
            );
          })}
        </Reveal>
      </div>

      <style>{`
        @keyframes hero-ring-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}