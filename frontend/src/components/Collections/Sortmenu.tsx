"use client";

import { ChevronDownIcon } from "./icons";

export type SortKey = "recommended" | "new" | "bestselling" | "price-asc" | "price-desc";

const OPTIONS: ReadonlyArray<{ value: SortKey; label: string }> = [
  { value: "recommended", label: "Recommended" },
  { value: "new", label: "New Arrivals" },
  { value: "bestselling", label: "Best Selling" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function SortMenu({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#241c16]">
      <span className="hidden text-[#6d6259] sm:inline">Sort by</span>
      <span className="relative inline-flex">
        {/* aria-label: the visible "Sort by" text is display:none on mobile, which would leave the select unnamed. */}
        <select
          aria-label="Sort bracelets"
          value={value}
          onChange={(e) => onChange(e.target.value as SortKey)}
          className="appearance-none rounded-full border border-[#e7dfd5] bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-[#241c16] outline-none transition focus:border-[#a47735]"
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d6259]" />
      </span>
    </label>
  );
}