import React from "react";
import BraceletsCollectionContainer from "../../components/Collections/BraceletsCollectionContainer";
import { RASHIS } from "../../data/Rashibracelets";
import { fetchProducts } from "../../lib/productApi";

export const revalidate = 60;

export const metadata = {
  title: "Bracelets Collections — Shop by Rashi",
  description:
    "Discover bracelets curated for your Rashi (zodiac sign) — handpicked gemstones, premium finishes, and pieces for every sign.",
};

export default async function BraceletsCollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ rashi?: string | string[] }>;
}) {
  // /bracelets?rashi=mesh (blog ka "Shop rashi" button yahi bhejta hai)
  const { rashi } = await searchParams;
  const initialRashiIds = Array.isArray(rashi) ? rashi : rashi ? [rashi] : [];

  // Backend (MongoDB) se products + filter options
  const { products, filters } = await fetchProducts();

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#241c16]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#e7dfd5] bg-white">
        {/* Subtle zodiac-wheel motif — decorative only */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.06]"
        >
          <div className="absolute left-1/2 top-1/2 grid h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 grid-cols-4 place-items-center gap-6 text-6xl text-[#a47735] sm:h-[760px] sm:w-[760px]">
            {RASHIS.map((r) => (
              <span key={r.id}>{r.symbol ?? ""}</span>
            ))}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[#f5eee5] to-transparent"
        />

        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#a47735]">
            Curated by the Stars
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Bracelets Collections
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#6d6259] sm:text-lg">
            Discover bracelets handpicked for your Rashi — each one designed with the gemstone,
            metal, and craftsmanship traditionally associated with your sign.
          </p>

          <div className="mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-[#6d6259]">
            {products.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Dot /> {products.length}+ handcrafted designs
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Dot /> All 12 Rashis covered
            </span>
            <span className="flex items-center gap-1.5">
              <Dot /> Certified gemstones
            </span>
          </div>
        </div>
      </section>

      <BraceletsCollectionContainer
        products={products}
        filterOptions={filters}
        initialRashiIds={initialRashiIds}
      />
    </main>
  );
}

function Dot() {
  return <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#a47735]" />;
}