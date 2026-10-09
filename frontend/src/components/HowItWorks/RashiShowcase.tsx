// src/components/HowItWorks/RashiShowcase.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

import { ELEMENT_COLORS, RASHIS, type RashiElement } from "../../data/rashis";
import { ZodiacIcon } from "./ZodiacIcons";

const FILTERS: Array<RashiElement | "All"> = ["All", "Fire", "Earth", "Air", "Water"];

const easeOut = [0.22, 1, 0.36, 1] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: easeOut } },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.2, ease: "easeIn" } },
};

export default function RashiShowcase({ className = "" }: { className?: string }) {
  const [filter, setFilter] = useState<RashiElement | "All">("All");
  const visibleRashis =
    filter === "All" ? RASHIS : RASHIS.filter((rashi) => rashi.element === filter);

  return (
    <section
      aria-labelledby="rashi-showcase-heading"
      className={`bg-[#FBF7F0] px-6 py-24 sm:py-28 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mx-auto flex max-w-[560px] flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <span className="rounded-full border border-[#B4791E]/25 bg-white px-3 py-1 text-xs font-medium tracking-wide text-[#B4791E]">
            Zodiac Guide
          </span>
          <h2
            id="rashi-showcase-heading"
            className="font-display text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl"
          >
            The Twelve Rashis
          </h2>
          <p className="max-w-[46ch] text-ink/70">
            Each rashi carries its own temperament, element, and signature gemstone — the
            starting point for your bracelet.
          </p>
        </motion.div>

        {/* Element filter — the active pill slides between choices instead of snapping */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-ink/10 bg-white p-1 shadow-sm">
            {FILTERS.map((option) => {
              const active = filter === option;
              const activeColor = option === "All" ? "#201A2E" : ELEMENT_COLORS[option];
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  aria-pressed={active}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                    active ? "text-[#FBF7F0]" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="rashi-filter-pill"
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{ backgroundColor: activeColor }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visibleRashis.map((rashi) => {
              const color = ELEMENT_COLORS[rashi.element];
              return (
                <motion.div
                  key={rashi.id}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -5, boxShadow: "0 16px 30px -12px rgba(32,26,46,0.18)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="group flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-5 shadow-[0_1px_2px_rgba(32,26,46,0.04)]"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105"
                      style={{ color, backgroundColor: `${color}14`, border: `1px solid ${color}40` }}
                    >
                      <ZodiacIcon id={rashi.id} className="h-5 w-5" />
                    </span>
                    <span
                      className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                      style={{ color, backgroundColor: `${color}14` }}
                    >
                      {rashi.element}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-base font-semibold text-ink">
                      {rashi.sanskrit}
                    </h3>
                    <p className="text-xs text-ink/50">
                      {rashi.english} · {rashi.dateRange}
                    </p>
                  </div>

                  <p className="mt-auto border-t border-ink/10 pt-3 text-xs text-ink/70">
                    Signature stone: <span className="font-medium text-ink">{rashi.gemstone}</span>
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}