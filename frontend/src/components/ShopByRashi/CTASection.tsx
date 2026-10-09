// src/components/RashiBracelets/CTASection.tsx
"use client";

import { Button, CelestialDots, GlowOrb, Reveal } from "./primitives";

interface CTASectionProps {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  tone?: "champagne" | "charcoal";
}

export default function CTASection({
  id,
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  tone = "champagne",
}: CTASectionProps) {
  const isCharcoal = tone === "charcoal";

  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className={`relative overflow-hidden px-6 py-20 sm:py-24 ${
        isCharcoal ? "bg-[#221F1A]" : "bg-gradient-to-b from-[#F6E9D3] via-[#F1DEB8] to-[#EAD3A3]"
      }`}
    >
      <GlowOrb
        className={`left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 ${
          isCharcoal ? "opacity-40" : "opacity-70"
        }`}
      />

      <CelestialDots
        className={`pointer-events-none absolute inset-0 h-full w-full ${
          isCharcoal ? "opacity-60" : "opacity-40"
        }`}
      />

      <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <span
          className={`text-[0.8rem] font-medium tracking-[0.02em] ${
            isCharcoal ? "text-[#D9B77E]" : "text-[#8C6A32]"
          }`}
        >
          {eyebrow}
        </span>

        <h2
          id={id ? `${id}-heading` : undefined}
          className={`font-display max-w-[20ch] text-3xl font-semibold leading-[1.15] sm:text-4xl ${
            isCharcoal ? "text-[#FBF7F0]" : "text-[#221F1A]"
          }`}
        >
          {title}
        </h2>

        <p
          className={`max-w-[46ch] text-base leading-relaxed ${
            isCharcoal ? "text-[#FBF7F0]/70" : "text-[#221F1A]/65"
          }`}
        >
          {description}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <Button href={primaryHref} showArrow>
            {primaryLabel}
          </Button>

          {secondaryLabel && secondaryHref ? (
            <Button
              href={secondaryHref}
              variant="secondary"
              className={isCharcoal ? "border-white/20 bg-white/5 text-white hover:bg-white/10" : ""}
            >
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}