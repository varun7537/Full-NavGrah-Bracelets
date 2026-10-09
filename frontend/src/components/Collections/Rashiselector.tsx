"use client";

import { useRef } from "react";
import styles from "../../styles/Braceletscollection.module.css";
import { Rashi } from "../../data/Rashibracelets";
import RashiAvatar from "./RashiAvatar";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export interface RashiSelectorProps {
  rashis: readonly Rashi[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

export default function RashiSelector({ rashis, selectedIds, onToggle, onClear }: RashiSelectorProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#241c16] sm:text-2xl">Shop by Rashi</h2>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-medium text-[#8c6327] underline underline-offset-2"
            >
              Clear selection
            </button>
          )}
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e7dfd5] text-[#241c16] transition hover:border-[#a47735] hover:text-[#a47735]"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e7dfd5] text-[#241c16] transition hover:border-[#a47735] hover:text-[#a47735]"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* pt-1 pb-3: overflow-x-auto also clips vertically, so the active card's shadow needs breathing room */}
      <div
        ref={trackRef}
        className={`${styles.scrollbarHide} -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 pb-3 pt-1`}
      >
        {rashis.map((rashi) => {
          const active = selectedIds.includes(rashi.id);
          return (
            <button
              key={rashi.id}
              type="button"
              onClick={() => onToggle(rashi.id)}
              aria-pressed={active}
              aria-label={`${rashi.nameHi} (${rashi.english})`}
              className={`flex w-[112px] shrink-0 snap-start flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center transition ${
                active
                  ? "border-[#a47735] bg-[#faf3e7] shadow-md"
                  : "border-[#e7dfd5] bg-white hover:border-[#d9c8a5] hover:shadow-sm"
              }`}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full transition"
                style={{
                  boxShadow: active
                    ? "0 0 0 3px #a47735, 0 6px 14px -6px rgba(164,119,53,0.5)"
                    : "0 0 0 1px #e7dfd5",
                }}
              >
                <RashiAvatar rashi={rashi} size={44} ring={false} />
              </span>
              <span className="text-sm font-semibold leading-tight text-[#241c16]">{rashi.nameHi}</span>
              <span className="text-[11px] text-[#6d6259]">{rashi.english}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}