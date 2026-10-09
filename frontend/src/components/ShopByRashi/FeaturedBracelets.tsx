// src/components/RashiBracelets/FeaturedBracelets.tsx
"use client";

import { ELEMENT_PALETTE, FEATURED_PRODUCTS, FeaturedProduct } from "./data";
import { Reveal, SectionHeading } from "./primitives";
import { hexToRgba } from "./utils";

interface FeaturedBraceletsProps {
  /** Optional map of product id -> real photo URL. Falls back to a
   *  gemstone-toned placeholder panel when no image is supplied. */
  productImages?: Partial<Record<string, string>>;
  shopBasePath?: string;
}

export default function FeaturedBracelets({
  productImages = {},
  shopBasePath = "/products/",
}: FeaturedBraceletsProps) {
  return (
    <section
      id="featured-bracelets"
      aria-labelledby="featured-bracelets-heading"
      className="relative bg-[#FDFCFA] px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            id="featured-bracelets-heading"
            eyebrow="This season's edit"
            title="Featured bracelets"
            description="A starting point across the four elements — every piece is also available in your specific rashi's gemstone."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PRODUCTS.map((product, index) => (
            <Reveal key={product.id} delayMs={index * 90}>
              <ProductCard
                product={product}
                imageUrl={productImages[product.id]}
                href={`${shopBasePath}${product.id}`}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  imageUrl,
  href,
}: {
  product: FeaturedProduct;
  imageUrl?: string;
  href: string;
}) {
  const palette = ELEMENT_PALETTE[product.element];

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#221F1A]/8 bg-white shadow-[0_14px_36px_-24px_rgba(34,31,26,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-20px_rgba(34,31,26,0.4)]">
      <a
        href={href}
        aria-label={`View the ${product.name}`}
        className="relative block aspect-square overflow-hidden focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#221F1A]"
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- host apps can swap in next/image
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full flex-col items-center justify-center gap-2 transition-transform duration-500 group-hover:scale-105"
            style={{
              background: `linear-gradient(155deg, ${hexToRgba(palette.light, 0.55)} 0%, ${hexToRgba(
                palette.base,
                0.25
              )} 100%)`,
            }}
          >
            <span
              className="h-16 w-16 rounded-full border"
              style={{
                borderColor: hexToRgba(palette.dark, 0.3),
                background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85), ${hexToRgba(
                  palette.base,
                  0.5
                )} 70%)`,
              }}
            />
            <span
              className="text-[0.68rem] font-medium tracking-[0.03em]"
              style={{ color: palette.dark }}
            >
              {product.gemstone}
            </span>
          </div>
        )}
      </a>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-display text-base font-semibold leading-snug text-[#221F1A]">
          {product.name}
        </p>

        <p className="text-sm leading-relaxed text-[#221F1A]/60">{product.description}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm font-medium text-[#221F1A]">{product.price}</span>

          <a
            href={href}
            className="text-sm font-medium text-[#221F1A]/70 underline decoration-[#221F1A]/25 underline-offset-4 transition-colors hover:text-[#221F1A] hover:decoration-[#221F1A] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#221F1A]"
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
}