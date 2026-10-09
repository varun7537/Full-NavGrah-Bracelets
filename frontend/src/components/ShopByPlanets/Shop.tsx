"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

import NextImage, { type StaticImageData } from "next/image";

import {
  ELEMENT_ACCENT,
  type Element,
  type RashiBracelet,
} from "../../data/Rashibracelets";
import { formatINR } from "../../lib/Currency";

type LinkType = ElementType<{
  href: string;
  className?: string;
  "aria-label"?: string;
  children?: ReactNode;
}>;

export interface RashiBraceletsSectionProps {
  /** Backend se aaye products (ab koi default hardcoded data nahi). */
  products: RashiBracelet[];

  /** Product page base path. Final href is `${productBasePath}${slug}`. */
  productBasePath?: string;

  viewAllHref?: string;

  /** Show only the first N products. Leave unset to show all. */
  limit?: number;

  onAddToBag?: (product: RashiBracelet) => void;

  /** Pass Next.js's `Link` here; falls back to a plain anchor. */
  linkComponent?: LinkType;

  className?: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");

  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;

  const int = parseInt(full, 16);

  if (Number.isNaN(int)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

function discountPercent(
  price: number,
  compareAt?: number
): number | null {
  if (!compareAt || compareAt <= price) return null;

  return Math.round(((compareAt - price) / compareAt) * 100);
}

/**
 * next/image throws if `src` is undefined, null, {}, or "".
 *
 * Backend data can contain any of those, so normalise the value first.
 *
 * Returns:
 * - a valid string URL
 * - a StaticImageData object
 * - null when there is no usable image
 */
function resolveImageSrc(
  image: unknown
): string | StaticImageData | null {
  if (typeof image === "string") {
    const trimmed = image.trim();

    return trimmed.length > 0 ? trimmed : null;
  }

  // Statically imported image:
  // { src, width, height, ... }
  if (
    image &&
    typeof image === "object" &&
    "src" in image &&
    typeof (image as { src: unknown }).src === "string" &&
    (image as { src: string }).src.trim().length > 0
  ) {
    return image as StaticImageData;
  }

  return null;
}

/**
 * Reveals children once the section scrolls into view.
 *
 * Skipped entirely when the visitor has asked for reduced motion.
 */
function useInView<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const prefersReducedMotion = window
      .matchMedia?.("(prefers-reduced-motion: reduce)")
      .matches;

    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold]);

  return {
    ref,
    inView,
  };
}

export default function RashiBraceletsSection({
  products,
  productBasePath = "/products/",
  viewAllHref = "/collections",
  limit,
  onAddToBag,
  linkComponent,
  className = "",
}: RashiBraceletsSectionProps) {
  const Link = (linkComponent ?? "a") as LinkType;

  const {
    ref: gridRef,
    inView,
  } = useInView<HTMLUListElement>(0.12);

  // Hooks ke baad hi return, taaki hooks ka order na bigde.
  if (!products || products.length === 0) {
    return null;
  }

  const visible =
    typeof limit === "number"
      ? products.slice(0, limit)
      : products;

  return (
    <section
      aria-labelledby="rashi-bracelets-heading"
      id="rashi-bracelets"
      className={`relative overflow-hidden bg-[#FDFCFA] px-6 py-24 sm:py-28 ${className}`}
    >
      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto flex max-w-[600px] flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.08em] text-[#B8863E]">
            <SparkleIcon className="h-3.5 w-3.5" />
            RASHI GEMSTONE BRACELETS
          </span>

          <h2
            id="rashi-bracelets-heading"
            className="font-display text-3xl font-semibold leading-[1.1] text-[#221F1A] sm:text-4xl"
          >
            Rashi Based Bracelets
          </h2>

          <p className="max-w-[48ch] text-[#221F1A]/60">
            Each bracelet is strung with the gemstone traditionally
            prescribed for its rashi.
          </p>
        </div>

        {/* Product rail */}
        <ul
          ref={gridRef}
          role="list"
          className="rashi-rail mt-14 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-11 sm:overflow-visible sm:px-0 sm:pb-0 sm:[scroll-snap-type:none] lg:grid-cols-3 xl:grid-cols-4"
        >
          {visible.map((product, index) => (
            <li
              key={product.id}
              className="rashi-card-reveal w-[72vw] max-w-[280px] flex-shrink-0 snap-start sm:w-auto sm:max-w-none sm:flex-shrink sm:[scroll-snap-align:none]"
              style={{
                animationDelay: `${Math.min(index, 8) * 60}ms`,
                animationPlayState: inView
                  ? "running"
                  : "paused",
                opacity: inView ? undefined : 0,
              }}
            >
              <ProductCard
                product={product}
                href={`${productBasePath}${product.slug}`}
                linkComponent={Link}
                onAddToBag={onAddToBag}
              />
            </li>
          ))}
        </ul>

        {/* Mobile-only swipe hint dots */}
        <div
          className="mt-3 flex justify-center gap-1.5 sm:hidden"
          aria-hidden="true"
        >
          {visible
            .slice(0, Math.min(visible.length, 6))
            .map((product) => (
              <span
                key={product.id}
                className="h-1.5 w-1.5 rounded-full bg-[#221F1A]/15"
              />
            ))}
        </div>

        {/* View all */}
        <div className="mt-10 flex justify-center sm:mt-20">
          <Link
            href={viewAllHref}
            className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-[#C79A5B] to-[#A8793F] px-8 py-3.5 text-sm font-medium text-[#FBF7F0] shadow-[0_8px_20px_-6px_rgba(168,121,63,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-6px_rgba(168,121,63,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8793F] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            View all rashi bracelets

            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes rashi-card-in {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .rashi-card-reveal {
          animation: rashi-card-in 0.62s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .rashi-card {
          position: relative;
        }

        .rashi-rail {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .rashi-rail::-webkit-scrollbar {
          display: none;
        }

        /* Light sweep across the photo on hover / keyboard focus. */
        .rashi-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 30%,
            rgba(255, 255, 255, 0.45) 48%,
            transparent 68%
          );
          transform: translateX(-130%);
          transition: transform 0.75s ease;
          pointer-events: none;
        }

        .rashi-card:hover .rashi-shine,
        .rashi-card:focus-within .rashi-shine {
          transform: translateX(130%);
        }

        .rashi-photo {
          transition: transform 0.7s
            cubic-bezier(0.16, 1, 0.3, 1);
        }

        .rashi-card:hover .rashi-photo,
        .rashi-card:focus-within .rashi-photo {
          transform: scale(1.06);
        }

        /*
         * Quick-add slides up over the photo on pointer devices.
         * On touch it remains available in the card body.
         */
        .rashi-quick-add {
          opacity: 0;
          transform: translateY(10px);
          transition:
            opacity 0.3s ease,
            transform 0.3s ease;
        }

        .rashi-card:hover .rashi-quick-add,
        .rashi-card:focus-within .rashi-quick-add {
          opacity: 1;
          transform: translateY(0);
        }

        @media (hover: none) {
          .rashi-quick-add {
            opacity: 1;
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rashi-card-reveal {
            animation: none;
            opacity: 1 !important;
          }

          .rashi-rail {
            scroll-behavior: auto;
          }

          .rashi-shine {
            transition: none;
            transform: none !important;
            opacity: 0;
          }

          .rashi-photo,
          .rashi-quick-add {
            transition: none;
          }

          .rashi-card:hover .rashi-photo,
          .rashi-card:focus-within .rashi-photo {
            transform: none;
          }

          .rashi-quick-add {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}

function ProductCard({
  product,
  href,
  linkComponent: Link,
  onAddToBag,
}: {
  product: RashiBracelet;
  href: string;
  linkComponent: LinkType;
  onAddToBag?: (product: RashiBracelet) => void;
}) {
  // const accent = ELEMENT_ACCENT[product.element];
    const accent =
    ELEMENT_ACCENT[product.element] ??
    ELEMENT_ACCENT["Air"];


  const off = discountPercent(
    product.price,
    product.compareAtPrice
  );

  /*
   * IMPORTANT:
   *
   * This protects next/image from null, undefined, "",
   * malformed backend image objects, etc.
   *
   * It does NOT bypass Next.js hostname validation.
   * `cdn.sanity.io` must still be configured in next.config.js.
   */
  const imageSrc = resolveImageSrc(product.image);

  const imageAlt =
    product.imageAlt?.trim() || product.name;

  return (
    <article
      className="rashi-card group flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-shadow duration-300 ease-out hover:shadow-[0_18px_34px_-22px_rgba(34,31,26,0.45)]"
      style={{
        borderColor: hexToRgba(
          accent.base,
          0.18
        ),
        boxShadow: `0 2px 10px -6px ${hexToRgba(
          accent.base,
          0.2
        )}`,
      }}
    >
      {/* Photo */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F6F2EC]">
        {imageSrc ? (
          <NextImage
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 72vw, (max-width: 1024px) 30vw, 22vw"
            className="rashi-photo object-cover"
          />
        ) : (
          /*
           * Placeholder shown when backend sends no image.
           */
          <div
            role="img"
            aria-label={imageAlt}
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(160deg, ${hexToRgba(
                accent.base,
                0.14
              )}, ${hexToRgba(
                accent.base,
                0.04
              )})`,
              color: accent.base,
            }}
          >
            <SparkleIcon className="h-10 w-10 opacity-60" />
          </div>
        )}

        <span
          aria-hidden="true"
          className="rashi-shine"
        />

        {/* Rashi tag */}
        <span
          className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.62rem] font-medium backdrop-blur-sm"
          style={{
            backgroundColor: hexToRgba(
              "#FFFFFF",
              0.88
            ),
            color: accent.dark,
          }}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: accent.base,
            }}
          />

          {product.rashi} &middot;{" "}
          {product.rashiEnglish}
        </span>

        {/* Product badge */}
        {product.badge && (
          <span
            className="absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.04em] text-[#FBF7F0]"
            style={{
              background:
                product.badge === "limited"
                  ? "linear-gradient(180deg,#8C7B3E,#584C22)"
                  : "linear-gradient(180deg,#C79A5B,#A8793F)",
            }}
          >
            {product.badge === "bestseller"
              ? "Bestseller"
              : product.badge === "new"
              ? "New"
              : "Limited"}
          </span>
        )}

        {/* Out of stock */}
        {!product.inStock && (
          <span className="absolute inset-x-0 bottom-0 bg-[#221F1A]/70 py-1.5 text-center text-[0.65rem] font-medium tracking-[0.04em] text-white backdrop-blur-sm">
            Back in stock soon
          </span>
        )}

        {/* Desktop quick add */}
        {product.inStock && onAddToBag && (
          <div className="rashi-quick-add absolute inset-x-2.5 bottom-2.5 hidden sm:block">
            <button
              type="button"
              onClick={() => onAddToBag(product)}
              className="w-full rounded-full bg-[#221F1A]/92 py-2 text-[0.72rem] font-medium text-[#FBF7F0] backdrop-blur-sm transition-colors duration-200 hover:bg-[#221F1A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8793F]"
            >
              Add to bag
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 px-3.5 pb-4 pt-3.5">
        <h3 className="font-display text-sm font-semibold leading-snug text-[#221F1A]">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:underline"
            aria-label={`${product.name} — ${product.gemstone}, ${formatINR(
              product.price
            )}`}
          >
            {product.name}
          </Link>
        </h3>

        <p className="text-[0.68rem] leading-snug text-[#221F1A]/55">
          {product.gemstone} &middot; ruled by{" "}
          {product.rulingPlanet}
        </p>

        {product.benefit && (
          <p
            className="text-[0.7rem] leading-snug text-[#221F1A]/70"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.benefit}
          </p>
        )}

        {product.spec && (
          <p className="text-[0.63rem] leading-snug text-[#221F1A]/45">
            {product.spec}
          </p>
        )}

        {typeof product.rating === "number" &&
          product.rating > 0 && (
            <p className="flex items-center gap-1 text-[0.65rem] text-[#221F1A]/55">
              <StarIcon className="h-3 w-3 text-[#B8863E]" />

              <span className="font-medium text-[#221F1A]/75">
                {product.rating.toFixed(1)}
              </span>

              {product.reviewCount ? (
                <span>
                  ({product.reviewCount})
                </span>
              ) : null}
            </p>
          )}

        {/* Price */}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-2">
          <span className="font-display text-base font-semibold text-[#221F1A]">
            {formatINR(product.price)}
          </span>

          {product.compareAtPrice && (
            <span className="text-[0.7rem] text-[#221F1A]/40 line-through">
              {formatINR(product.compareAtPrice)}
            </span>
          )}

          {off !== null && (
            <span className="text-[0.68rem] font-medium text-[#7A3A18]">
              {off}% off
            </span>
          )}
        </div>

        {/* Touch-friendly add to bag */}
        {product.inStock && onAddToBag && (
          <button
            type="button"
            onClick={() => onAddToBag(product)}
            className="relative z-10 mt-2.5 w-full rounded-full border border-[#221F1A]/12 py-2 text-[0.72rem] font-medium text-[#221F1A] transition-colors duration-200 hover:border-[#A8793F] hover:text-[#7A3A18] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8793F] sm:hidden"
          >
            Add to bag
          </button>
        )}
      </div>
    </article>
  );
}

function SparkleIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 2c.6 3.6 1.9 4.9 5.5 5.5-3.6.6-4.9 1.9-5.5 5.5-.6-3.6-1.9-4.9-5.5-5.5C10.1 6.9 11.4 5.6 12 2Z" />

      <path d="M19 14c.3 1.8.9 2.4 2.7 2.7-1.8.3-2.4.9-2.7 2.7-.3-1.8-.9-2.4-2.7-2.7 1.8-.3 2.4-.9 2.7-2.7Z" />
    </svg>
  );
}

function StarIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z" />
    </svg>
  );
}

export type {
  RashiBracelet,
  Element,
};
