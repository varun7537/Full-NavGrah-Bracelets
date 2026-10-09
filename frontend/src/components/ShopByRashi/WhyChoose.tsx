// src/components/RashiBracelets/WhyChoose.tsx
"use client";

import { type ReactElement, type SVGProps } from "react";
import { WHY_CHOOSE } from "./data";
import { Reveal, SectionHeading } from "./primitives";

const ICONS: Array<(props: SVGProps<SVGSVGElement>) => ReactElement> = [
  CompassIcon,
  GemIcon,
  WristIcon,
  SparkIcon,
  LeafIcon,
];

export default function WhyChoose() {
  return (
    <section
      aria-labelledby="why-choose-heading"
      className="relative bg-[#FBF8F3] px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="why-choose-heading"
            eyebrow="Why a rashi bracelet"
            title="Made to mean something, made to be worn"
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {WHY_CHOOSE.map((benefit, index) => {
            const Icon = ICONS[index % ICONS.length];

            return (
              <Reveal key={benefit.title} delayMs={index * 80}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-[#221F1A]/8 bg-white/70 p-6">
                  <Icon aria-hidden="true" className="h-7 w-7 text-[#B8863E]" />
                  <p className="font-display text-base font-semibold text-[#221F1A]">
                    {benefit.title}
                  </p>
                  <p className="text-sm leading-relaxed text-[#221F1A]/60">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CompassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.4" />
      <path d="M20 12 L14 14 L12 20 L18 18 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function GemIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M9 12 L16 6 L23 12 L16 26 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 12 L23 12 M13 12 L16 26 M19 12 L16 26" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

function WristIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="6" r="1.6" fill="currentColor" />
      <circle cx="16" cy="26" r="1.6" fill="currentColor" />
      <circle cx="6" cy="16" r="1.6" fill="currentColor" />
      <circle cx="26" cy="16" r="1.6" fill="currentColor" />
    </svg>
  );
}

function SparkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M16 5 L18 14 L27 16 L18 18 L16 27 L14 18 L5 16 L14 14 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M8 24 C8 12 18 6 26 6 C26 16 18 24 8 24 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M8 24 C13 19 18 14 24 8" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}