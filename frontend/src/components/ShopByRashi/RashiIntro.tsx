// src/components/RashiBracelets/RashiIntro.tsx
"use client";

import { Eyebrow, OrnamentDivider, Reveal } from "./primitives";

export default function RashiIntro() {
  return (
    <section
      aria-labelledby="rashi-intro-heading"
      className="relative bg-[#FDFCFA] px-6 py-20 sm:py-24"
    >
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <Reveal className="relative mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center">
          <RashiIntroMark className="h-full w-full text-[#B8863E]/70" />
        </Reveal>

        <Reveal delayMs={100} className="flex flex-col items-start gap-4 text-left">
          <Eyebrow>What is a rashi</Eyebrow>

          <h2
            id="rashi-intro-heading"
            className="font-display max-w-[22ch] text-3xl font-semibold leading-[1.15] text-[#221F1A] sm:text-4xl"
          >
            Twelve signs, one for each way of moving through life
          </h2>

          <p className="max-w-[58ch] text-[#221F1A]/65">
            In Vedic astrology, your rashi is the zodiac sign the moon
            occupied at the moment you were born. It's calculated slightly
            differently from a Western sun sign, but it plays the same
            role: a lens for understanding temperament, timing, and the
            planetary energy believed to run through a life.
          </p>

          <p className="max-w-[58ch] text-[#221F1A]/65">
            Each rashi belongs to one of four elements — fire, earth, air,
            or water — and is ruled by a specific planet. That planet is
            traditionally paired with a gemstone thought to strengthen its
            influence, which is the pairing this collection is built
            around.
          </p>

          <OrnamentDivider className="mt-2 self-start" />
        </Reveal>
      </div>
    </section>
  );
}

function RashiIntroMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 280 280" className={className} fill="none">
      <circle cx="140" cy="140" r="120" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="140" cy="140" r="86" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
      <circle cx="140" cy="140" r="4" fill="currentColor" opacity="0.7" />

      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * 2 * Math.PI;
        const x1 = 140 + 120 * Math.sin(angle);
        const y1 = 140 - 120 * Math.cos(angle);
        const x2 = 140 + 130 * Math.sin(angle);
        const y2 = 140 - 130 * Math.cos(angle);

        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}
    </svg>
  );
}