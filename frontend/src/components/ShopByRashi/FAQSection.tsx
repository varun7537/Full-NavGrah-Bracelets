// src/components/RashiBracelets/FAQSection.tsx
"use client";

import { useState } from "react";
import { FAQ_ITEMS, FaqItem } from "./data";
import { Reveal, SectionHeading } from "./primitives";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      aria-labelledby="faq-heading"
      className="relative bg-[#FBF8F3] px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading id="faq-heading" eyebrow="Questions" title="Frequently asked questions" />
        </Reveal>

        <div className="mt-10 flex flex-col divide-y divide-[#221F1A]/10 rounded-2xl border border-[#221F1A]/10 bg-white/70">
          {FAQ_ITEMS.map((item, index) => (
            <FaqRow
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes rashi-faq-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rashi-faq-panel { animation: rashi-faq-in 0.2s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .rashi-faq-panel { animation: none; }
        }
      `}</style>
    </section>
  );
}

function FaqRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${item.question.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="px-5 sm:px-6">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 py-5 text-left focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#221F1A]"
        >
          <span className="font-display text-base font-medium text-[#221F1A] sm:text-lg">
            {item.question}
          </span>

          <span
            aria-hidden="true"
            className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-[#B8863E]/40 text-[#A8793F] transition-transform duration-300 motion-reduce:transition-none"
            style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            +
          </span>
        </button>
      </h3>

      {isOpen ? (
        <div id={panelId} className="rashi-faq-panel pb-5 text-sm leading-relaxed text-[#221F1A]/65">
          {item.answer}
        </div>
      ) : null}
    </div>
  );
}