// src/components/RashiBracelets/HowItWorks.tsx
"use client";

import { HOW_IT_WORKS } from "./data";
import { Reveal, SectionHeading } from "./primitives";

export default function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="relative bg-[#FDFCFA] px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="how-it-works-heading"
            eyebrow="How it works"
            title="From your rashi to your wrist, in four steps"
          />
        </Reveal>

        {/* Desktop: horizontal timeline */}
        <ol className="relative mt-16 hidden grid-cols-4 gap-8 md:grid">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-[#B8863E]/40 to-transparent md:block"
          />

          {HOW_IT_WORKS.map((item, index) => (
            <Reveal
              key={item.step}
              as="li"
              delayMs={index * 110}
              className="relative flex flex-col gap-3"
            >
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B8863E]/40 bg-[#FBF8F3] font-display text-sm font-semibold text-[#A8793F]"
              >
                {item.step}
              </span>
              <p className="font-display text-base font-semibold text-[#221F1A]">{item.title}</p>
              <p className="text-sm leading-relaxed text-[#221F1A]/60">{item.description}</p>
            </Reveal>
          ))}
        </ol>

        {/* Mobile: vertical timeline */}
        <ol className="relative mt-12 flex flex-col gap-8 md:hidden">
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-6 top-2 w-px bg-gradient-to-b from-transparent via-[#B8863E]/40 to-transparent"
          />

          {HOW_IT_WORKS.map((item, index) => (
            <Reveal
              key={item.step}
              as="li"
              delayMs={index * 90}
              className="relative flex gap-4 pl-0"
            >
              <span
                aria-hidden="true"
                className="relative z-10 flex h-12 w-12 flex-none items-center justify-center rounded-full border border-[#B8863E]/40 bg-[#FBF8F3] font-display text-sm font-semibold text-[#A8793F]"
              >
                {item.step}
              </span>
              <div className="flex flex-col gap-1 pt-1.5">
                <p className="font-display text-base font-semibold text-[#221F1A]">{item.title}</p>
                <p className="text-sm leading-relaxed text-[#221F1A]/60">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}