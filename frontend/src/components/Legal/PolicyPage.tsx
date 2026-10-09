// src/components/Legal/PolicyPage.tsx
//
// Server component. Gives all seven pages the same shell: hero, sticky
// contents list on desktop, prose sections, and cross-links at the bottom.

import React from "react";
import Link from "next/link";
import { LAST_UPDATED, POLICY_LINKS } from "../../data/Storeinfo";

export interface PolicySection {
  id: string;
  title: string;
}

export function PolicyPage({
  title,
  intro,
  sections,
  lastUpdated = LAST_UPDATED,
  currentHref,
  children,
}: {
  title: string;
  intro: string;
  sections: PolicySection[];
  lastUpdated?: string;
  currentHref: string;
  children: React.ReactNode;
}) {
  const others = POLICY_LINKS.filter((l) => l.href !== currentHref);

  return (
    <main className="bg-[#faf8f4] text-[#241c16]">
      <header className="border-b border-[#e7dfd5] bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-[#6d6259]">
            <Link href="/" className="underline-offset-2 hover:underline">
              Home
            </Link>
            <span aria-hidden="true" className="px-2 text-[#c9bba3]">
              /
            </span>
            <span className="text-[#241c16]">{title}</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#6d6259]">{intro}</p>
          <p className="mt-4 text-xs text-[#6d6259]">Last updated {lastUpdated}</p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        {sections.length > 0 && (
          <nav aria-label="On this page" className="mb-8 lg:mb-0">
            <div className="lg:sticky lg:top-6">
              <p className="text-sm font-semibold text-[#a47735]">On this page</p>
              <ol className="mt-3 space-y-2 text-sm">
                {sections.map((s, i) => (
                  <li key={s.id} className="flex gap-2 text-[#6d6259]">
                    <span aria-hidden="true" className="tabular-nums text-[#c9bba3]">
                      {i + 1}.
                    </span>
                    <a href={`#${s.id}`} className="underline-offset-2 hover:text-[#241c16] hover:underline">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        )}

        <div className="min-w-0 space-y-8">{children}</div>
      </div>

      <section className="border-t border-[#e7dfd5] bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold">Other pages you might need</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex h-full flex-col rounded-2xl border border-[#e7dfd5] bg-[#faf8f4] p-4 transition hover:border-[#c9bba3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47735]"
                >
                  <span className="text-sm font-medium text-[#241c16]">{link.title}</span>
                  <span className="mt-1 text-xs leading-5 text-[#6d6259]">{link.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <h2 id={`${id}-heading`} className="text-xl font-semibold text-[#2b211a]">
        {title}
      </h2>
      <div className="mt-3 space-y-4 text-sm leading-7 text-[#6d6259] [&_a]:text-[#8c6327] [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-medium [&_strong]:text-[#241c16]">
        {children}
      </div>
    </section>
  );
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a47735]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#e7dfd5] bg-white p-5">
      {title && <p className="text-sm font-medium text-[#241c16]">{title}</p>}
      <div className={title ? "mt-2" : undefined}>{children}</div>
    </div>
  );
}

/** Two-column table that collapses into stacked rows on small screens. */
export function DataTable({
  caption,
  headers,
  rows,
}: {
  caption?: string;
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#e7dfd5] bg-white">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        {caption && <caption className="px-4 pt-4 text-left text-xs text-[#6d6259]">{caption}</caption>}
        <thead>
          <tr className="border-b border-[#e7dfd5]">
            {headers.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-medium text-[#241c16]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#f0e9df] last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-[#6d6259]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Native <details> — works with no JavaScript and is keyboard accessible. */
export function Faq({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  return (
    <div className="divide-y divide-[#e7dfd5] overflow-hidden rounded-2xl border border-[#e7dfd5] bg-white">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-[#241c16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a47735]">
            {item.q}
            <span
              aria-hidden="true"
              className="shrink-0 text-lg leading-none text-[#a47735] transition group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="px-5 pb-5 text-sm leading-7 text-[#6d6259] [&_a]:text-[#8c6327] [&_a]:underline">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}