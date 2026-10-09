"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";
import type { StaticImageData } from "next/image";

import { HeartIcon, ChevronLeftIcon } from "../Header/icons";

import libra from "../../../public/images/bracelet(4).jpeg";
import gemini from "../../../public/images/bracelet(11).jpeg";
import aquarrius from "../../../public/images/bracelet(8).jpeg";
import cancer from "../../../public/images/bracelet(3).jpeg";
import leo from "../../../public/images/bracelet(2).jpeg";
import taurus from "../../../public/images/bracelet(5).jpeg";
import capricorn from "../../../public/images/bracelet(7).jpeg";
import scorpio from "../../../public/images/bracelet(10).jpeg";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ProductBadge =
  | "BEST_SELLER"
  | "NEW"
  | "LIMITED"
  | "POPULAR";

export interface Product {
  id: string;
  slug: string;
  name: string;
  planet: string;
  planetEnglish: string;
  image: StaticImageData | string;
  hoverImage?: StaticImageData | string;
  imageAlt?: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  badge?: ProductBadge;
  inStock?: boolean;
}

type SectionStatus = "idle" | "loading" | "empty" | "error";
type CtaMode = "view" | "cart";

interface BestSellersProps {
  products?: Product[];
  status?: SectionStatus;
  skeletonCount?: number;
  viewAllHref?: string;
  onViewAll?: () => void;
  onWishlistToggle?: (
    productId: string,
    isWishlisted: boolean
  ) => void;
  onQuickAdd?: (productId: string) => Promise<void> | void;
  onAddToCart?: (productId: string) => Promise<void> | void;
  ctaMode?: CtaMode;
  getProductHref?: (product: Product) => string;
  wishlistedIds?: string[];
  trustLine?: string;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const BADGE_LABEL: Record<ProductBadge, string> = {
  BEST_SELLER: "Best seller",
  NEW: "New",
  LIMITED: "Limited",
  POPULAR: "Popular",
};

const STONE_ACCENTS: {
  keywords: string[];
  hex: string;
}[] = [
  {
    keywords: ["amethyst"],
    hex: "#7C6A8E",
  },
  {
    keywords: ["citrine"],
    hex: "#C98A2C",
  },
  {
    keywords: ["rose quartz"],
    hex: "#B98072",
  },
  {
    keywords: ["tourmaline"],
    hex: "#584B3F",
  },
  {
    keywords: ["tiger eye", "tiger's eye"],
    hex: "#A8672B",
  },
  {
    keywords: ["moonstone"],
    hex: "#8B93A0",
  },
  {
    keywords: ["lapis"],
    hex: "#3B5770",
  },
  {
    keywords: ["aventurine"],
    hex: "#5C6B4C",
  },
];

const SLIDE_WIDTH_CLASS =
  "w-[74vw] max-w-[290px] sm:max-w-[320px] lg:max-w-[360px]";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getAccent(product: Product): string {
  const name = product.name.toLowerCase();

  const match = STONE_ACCENTS.find((accent) =>
    accent.keywords.some((keyword) => name.includes(keyword))
  );

  return match?.hex ?? "#A9834A";
}

function materialLabel(product: Product): string {
  return product.name
    .replace(/\s*bracelet\s*$/i, "")
    .trim();
}

function formatPrice(
  amount: number,
  currency = "₹"
): string {
  return `${currency}${amount.toLocaleString("en-IN")}`;
}

/* -------------------------------------------------------------------------- */
/* Sample Products                                                            */
/* -------------------------------------------------------------------------- */

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "amethyst-clarity-bracelet",
    name: "Amethyst Clarity Bracelet",
    planet: "शुक्र",
    planetEnglish: "Venus",
    image: libra,
    imageAlt:
      "Amethyst gemstone bracelet on a neutral background",
    description:
      "Calming purple amethyst beads for focus and clarity.",
    price: 1499,
    originalPrice: 1999,
    currency: "₹",
    rating: 4.6,
    reviewCount: 128,
    badge: "BEST_SELLER",
    inStock: true,
  },
  {
    id: "p2",
    slug: "citrine-abundance-bracelet",
    name: "Citrine Abundance Bracelet",
    planet: "बृहस्पति",
    planetEnglish: "Jupiter",
    image: gemini,
    imageAlt:
      "Citrine gemstone bracelet on a neutral background",
    description:
      "Warm golden citrine beads believed to attract abundance.",
    price: 1299,
    currency: "₹",
    rating: 4.8,
    reviewCount: 94,
    badge: "NEW",
    inStock: true,
  },
  {
    id: "p3",
    slug: "rose-quartz-love-bracelet",
    name: "Rose Quartz Love Bracelet",
    planet: "शुक्र",
    planetEnglish: "Venus",
    image: aquarrius,
    imageAlt:
      "Rose quartz gemstone bracelet on a neutral background",
    description:
      "Soft pink rose quartz, the stone of unconditional love.",
    price: 1199,
    originalPrice: 1499,
    currency: "₹",
    rating: 4.5,
    reviewCount: 76,
    badge: "POPULAR",
    inStock: true,
  },
  {
    id: "p4",
    slug: "black-tourmaline-shield-bracelet",
    name: "Black Tourmaline Shield Bracelet",
    planet: "शनि",
    planetEnglish: "Saturn",
    image: cancer,
    imageAlt:
      "Black tourmaline gemstone bracelet on a neutral background",
    description:
      "Grounding black tourmaline for protection and stability.",
    price: 1599,
    currency: "₹",
    rating: 4.7,
    reviewCount: 51,
    badge: "LIMITED",
    inStock: true,
  },
  {
    id: "p5",
    slug: "tiger-eye-courage-bracelet",
    name: "Tiger Eye Courage Bracelet",
    planet: "सूर्य",
    planetEnglish: "Sun",
    image: leo,
    imageAlt:
      "Tiger eye gemstone bracelet on a neutral background",
    description:
      "Golden-brown tiger eye for confidence and courage.",
    price: 1099,
    currency: "₹",
    rating: 4.4,
    reviewCount: 63,
    inStock: true,
  },
  {
    id: "p6",
    slug: "moonstone-intuition-bracelet",
    name: "Moonstone Intuition Bracelet",
    planet: "चंद्र",
    planetEnglish: "Moon",
    image: taurus,
    imageAlt:
      "Moonstone gemstone bracelet on a neutral background",
    description:
      "Milky white moonstone linked to intuition and balance.",
    price: 1399,
    currency: "₹",
    rating: 4.9,
    reviewCount: 210,
    badge: "BEST_SELLER",
    inStock: true,
  },
  {
    id: "p7",
    slug: "lapis-lazuli-wisdom-bracelet",
    name: "Lapis Lazuli Wisdom Bracelet",
    planet: "बृहस्पति",
    planetEnglish: "Jupiter",
    image: capricorn,
    imageAlt:
      "Lapis lazuli gemstone bracelet on a neutral background",
    description:
      "Deep blue lapis lazuli, prized for wisdom and truth.",
    price: 1699,
    originalPrice: 1999,
    currency: "₹",
    rating: 4.3,
    reviewCount: 39,
    inStock: false,
  },
  {
    id: "p8",
    slug: "green-aventurine-luck-bracelet",
    name: "Green Aventurine Luck Bracelet",
    planet: "बुध",
    planetEnglish: "Mercury",
    image: scorpio,
    imageAlt:
      "Green aventurine gemstone bracelet on a neutral background",
    description:
      "Fresh green aventurine, known as the stone of luck.",
    price: 999,
    currency: "₹",
    rating: 4.5,
    reviewCount: 88,
    inStock: true,
  },
];

/* -------------------------------------------------------------------------- */
/* Star Rating                                                                */
/* -------------------------------------------------------------------------- */

function StarRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount?: number;
}) {
  const rounded = Math.max(
    0,
    Math.min(5, Math.round(rating))
  );

  return (
    <div
      className="flex items-center gap-1.5 text-[12px]"
      role="img"
      aria-label={`Rated ${rating} out of 5${
        reviewCount
          ? ` from ${reviewCount} reviews`
          : ""
      }`}
    >
      <span
        aria-hidden="true"
        className="tracking-[1px] text-[color:var(--gold)]"
      >
        {"★".repeat(rounded)}

        <span className="text-[color:var(--stone-line)]">
          {"★".repeat(5 - rounded)}
        </span>
      </span>

      <span className="text-[color:var(--ink-mute)]">
        {rating.toFixed(1)}

        {typeof reviewCount === "number"
          ? ` · ${reviewCount}`
          : ""}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Intersection Observer                                                      */
/* -------------------------------------------------------------------------- */

function useInView<T extends HTMLElement>(
  threshold = 0.08
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || inView) return;

    if (
      typeof IntersectionObserver ===
      "undefined"
    ) {
      setInView(true);
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        {
          threshold,
        }
      );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold, inView]);

  return [ref, inView] as const;
}

/* -------------------------------------------------------------------------- */
/* Product Card                                                               */
/* -------------------------------------------------------------------------- */

export function ProductCard({
  product,
  index = 0,
  inView = true,
  ctaMode = "view",
  href,
  isWishlisted,
  onWishlistToggle,
  onQuickAdd,
  onAddToCart,
}: {
  product: Product;
  index?: number;
  inView?: boolean;
  ctaMode?: CtaMode;
  href: string;
  isWishlisted: boolean;
  onWishlistToggle?: (
    productId: string,
    next: boolean
  ) => void;
  onQuickAdd?: (
    productId: string
  ) => Promise<void> | void;
  onAddToCart?: (
    productId: string
  ) => Promise<void> | void;
}) {
  const [wishlisted, setWishlisted] =
    useState(isWishlisted);

  const [quickAddState, setQuickAddState] =
    useState<"idle" | "loading" | "added">(
      "idle"
    );

  const [cartState, setCartState] =
    useState<"idle" | "loading" | "added">(
      "idle"
    );

  const quickAddTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const cartTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  useEffect(() => {
    setWishlisted(isWishlisted);
  }, [isWishlisted]);

  useEffect(() => {
    return () => {
      if (quickAddTimerRef.current) {
        clearTimeout(quickAddTimerRef.current);
      }

      if (cartTimerRef.current) {
        clearTimeout(cartTimerRef.current);
      }
    };
  }, []);

  const accent = getAccent(product);

  const discountPct =
    product.originalPrice &&
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice -
            product.price) /
            product.originalPrice) *
            100
        )
      : null;

  /* ------------------------------ Wishlist ------------------------------ */

  const toggleWishlist = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const next = !wishlisted;

      setWishlisted(next);

      try {
        onWishlistToggle?.(product.id, next);
      } catch (error) {
        console.error(
          "Wishlist update failed:",
          error
        );

        setWishlisted(!next);
      }
    },
    [
      wishlisted,
      onWishlistToggle,
      product.id,
    ]
  );

  /* ------------------------------- Quick Add ----------------------------- */

  const handleQuickAdd = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement>
    ) => {
      e.preventDefault();
      e.stopPropagation();

      if (
        !onQuickAdd ||
        product.inStock === false ||
        quickAddState === "loading"
      ) {
        return;
      }

      setQuickAddState("loading");

      try {
        await onQuickAdd(product.id);

        setQuickAddState("added");

        quickAddTimerRef.current =
          setTimeout(() => {
            setQuickAddState("idle");
          }, 2200);
      } catch (error) {
        console.error(
          "Quick add failed:",
          error
        );

        setQuickAddState("idle");
      }
    },
    [
      onQuickAdd,
      product.id,
      product.inStock,
      quickAddState,
    ]
  );

  /* ------------------------------ Add To Cart ---------------------------- */

  const handleAddToCart = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement>
    ) => {
      e.preventDefault();
      e.stopPropagation();

      if (
        !onAddToCart ||
        product.inStock === false ||
        cartState === "loading"
      ) {
        return;
      }

      setCartState("loading");

      try {
        await onAddToCart(product.id);

        setCartState("added");

        cartTimerRef.current = setTimeout(() => {
          setCartState("idle");
        }, 2200);
      } catch (error) {
        console.error(
          "Add to cart failed:",
          error
        );

        setCartState("idle");
      }
    },
    [
      onAddToCart,
      product.id,
      product.inStock,
      cartState,
    ]
  );

  /* ------------------------------ Animation ------------------------------ */

  const revealClass = inView
    ? "opacity-100 translate-y-0 transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
    : "opacity-0 translate-y-5 motion-reduce:opacity-100 motion-reduce:translate-y-0";

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-[color:var(--card-border)] bg-[color:var(--card-bg)] transition-[box-shadow,border-color] duration-300 ease-out hover:border-[color:var(--accent)]/40 hover:shadow-[0_20px_44px_-28px_rgba(34,28,23,0.4)] ${revealClass}`}
      style={{
        transitionDelay: inView
          ? `${Math.min(index, 9) * 70}ms`
          : undefined,
        ["--accent" as string]: accent,
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Image                                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-[color:var(--image-bg)]">
        <Link
          href={href}
          aria-label={product.name}
          className="absolute inset-0 z-0"
        >
          <Image
            src={product.image}
            alt={
              product.imageAlt ||
              product.name
            }
            fill
            sizes="(max-width: 640px) 74vw, (max-width: 1024px) 320px, 360px"
            priority={index < 2}
            draggable={false}
            className={`object-cover transition-[transform,opacity] duration-[600ms] ease-out group-hover:scale-[1.045] ${
              product.hoverImage
                ? "group-hover:opacity-0"
                : ""
            }`}
          />

          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 640px) 74vw, (max-width: 1024px) 320px, 360px"
              draggable={false}
              className="scale-[1.045] object-cover opacity-0 transition-opacity duration-[600ms] ease-out group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Hover border */}

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 z-[1] rounded-[10px] border opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-60"
          style={{
            borderColor:
              "var(--accent)",
          }}
        />

        {/* Badge */}

        {product.badge && (
          <span className="absolute left-3 top-3 z-[3] inline-flex items-center gap-1.5 rounded-full bg-[rgba(246,241,230,0.92)] px-2.5 py-1 text-[10.5px] text-[color:var(--ink-soft)] backdrop-blur-sm">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor:
                  "var(--accent)",
              }}
            />

            {BADGE_LABEL[product.badge]}
          </span>
        )}

        {/* Wishlist */}

        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 z-[4] inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,253,248,0.7)] text-[color:var(--ink)] backdrop-blur-sm transition-colors duration-250 ease-out hover:bg-[rgba(255,253,248,0.95)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
        >
          <span
            style={
              wishlisted
                ? {
                    color: "var(--accent)",
                  }
                : undefined
            }
          >
            <HeartIcon
              filled={wishlisted}
            />
          </span>
        </button>

        {/* Price */}

        <div className="absolute bottom-3 left-3 z-[3] inline-flex items-baseline gap-1.5 rounded-[10px] bg-[rgba(255,253,248,0.92)] px-2.5 py-1.5 backdrop-blur-sm">
          <span className="text-[13.5px] font-medium text-[color:var(--ink)]">
            {formatPrice(
              product.price,
              product.currency
            )}
          </span>

          {product.originalPrice &&
            product.originalPrice >
              product.price && (
              <span className="text-[11px] text-[color:var(--ink-mute)] line-through">
                {formatPrice(
                  product.originalPrice,
                  product.currency
                )}
              </span>
            )}

          {discountPct !== null && (
            <span className="text-[11px] text-[color:var(--terracotta)]">
              {discountPct}% off
            </span>
          )}
        </div>

        {/* Quick Add */}

        {onQuickAdd && (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={
              quickAddState ===
                "loading" ||
              product.inStock === false
            }
            className="absolute bottom-3 right-3 z-[4] hidden translate-y-2 items-center justify-center rounded-full bg-[color:var(--ink)]/90 px-3.5 py-2 text-[12px] text-[color:var(--ivory)] opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 hover:bg-[color:var(--terracotta)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ivory)] lg:flex"
          >
            {quickAddState === "added"
              ? "Added"
              : quickAddState ===
                "loading"
              ? "Adding…"
              : "Quick add"}
          </button>
        )}

        {/* Out of Stock */}

        {product.inStock === false && (
          <span className="absolute inset-x-3 bottom-3 z-[3] flex items-center justify-center rounded-[10px] bg-[rgba(34,28,23,0.82)] py-2 text-[12px] text-[color:var(--ivory)]">
            Currently out of stock
          </span>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Content                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-[12px] text-[color:var(--ink-mute)]">
          {materialLabel(product)}
        </p>

        <h3 className="text-[17px] leading-snug text-[color:var(--ink)] [font-family:var(--font-display)]">
          <Link
            href={href}
            className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[color:var(--ink-soft)]">
          {product.description}
        </p>

        {typeof product.rating ===
          "number" && (
          <div className="mt-2">
            <StarRating
              rating={product.rating}
              reviewCount={
                product.reviewCount
              }
            />
          </div>
        )}

        <div className="relative z-[3] mt-auto pt-3">
          {ctaMode === "cart" &&
          onAddToCart ? (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={
                cartState === "loading" ||
                product.inStock === false
              }
              className="group/cta inline-flex items-center gap-1.5 border-b border-transparent pb-0.5 text-[13px] text-[color:var(--ink)] transition-colors duration-250 ease-out hover:border-[color:var(--accent)] hover:text-[color:var(--terracotta)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
            >
              {cartState === "added"
                ? "Added to cart"
                : cartState ===
                  "loading"
                ? "Adding…"
                : product.inStock ===
                  false
                ? "Out of stock"
                : "Add to cart"}

              <ChevronLeftIcon
                direction="right"
              />
            </button>
          ) : (
            <Link
              href={href}
              className="group/cta inline-flex items-center gap-1.5 border-b border-transparent pb-0.5 text-[13px] text-[color:var(--ink)] transition-colors duration-250 ease-out hover:border-[color:var(--accent)] hover:text-[color:var(--terracotta)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
            >
              View this piece

              <ChevronLeftIcon
                direction="right"
              />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

function SkeletonCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[color:var(--card-border)]">
      <div className="aspect-[4/5] w-full bg-[color:var(--image-bg)] motion-safe:animate-pulse" />

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 h-2.5 w-1/3 rounded bg-[color:var(--image-bg)] motion-safe:animate-pulse" />

        <div className="mb-3 h-3.5 w-3/4 rounded bg-[color:var(--image-bg)] motion-safe:animate-pulse" />

        <div className="h-3 w-1/2 rounded bg-[color:var(--image-bg)] motion-safe:animate-pulse" />

        <div className="mt-auto h-3 w-1/4 rounded bg-[color:var(--image-bg)] motion-safe:animate-pulse" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function BestSellers({
  products = SAMPLE_PRODUCTS,
  status = "idle",
  skeletonCount = 5,
  viewAllHref = "/shop",
  onViewAll,
  onWishlistToggle,
  onQuickAdd,
  onAddToCart,
  ctaMode = "view",
  getProductHref = (product) =>
    `/products/${product.slug}`,
  wishlistedIds = [],
  trustLine =
    "Personalized selections · Premium gemstone craftsmanship · Secure checkout",
}: BestSellersProps) {
  const [sectionRef, inView] =
    useInView<HTMLElement>(0.08);

  const trackRef =
    useRef<HTMLUListElement | null>(null);

  const dragRef = useRef({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
    pointerId: null as number | null,
  });

  const [
    scrollInfo,
    setScrollInfo,
  ] = useState({
    canLeft: false,
    canRight: false,
    thumbWidth: 100,
    thumbLeft: 0,
  });

  const effectiveStatus: SectionStatus =
    status === "idle" &&
    products.length === 0
      ? "empty"
      : status;

  /* ------------------------------------------------------------------------ */
  /* Scroll information                                                       */
  /* ------------------------------------------------------------------------ */

  const updateScrollInfo =
    useCallback(() => {
      const node = trackRef.current;

      if (!node) return;

      const {
        scrollLeft,
        scrollWidth,
        clientWidth,
      } = node;

      const maxScroll = Math.max(
        scrollWidth - clientWidth,
        0
      );

      const hasOverflow = maxScroll > 1;

      const thumbWidth = hasOverflow
        ? Math.max(
            (clientWidth / scrollWidth) *
              100,
            12
          )
        : 100;

      const progress = hasOverflow
        ? Math.min(
            Math.max(
              scrollLeft / maxScroll,
              0
            ),
            1
          )
        : 0;

      const thumbLeft =
        progress * (100 - thumbWidth);

      setScrollInfo({
        canLeft: scrollLeft > 4,
        canRight: scrollLeft < maxScroll - 4,
        thumbWidth,
        thumbLeft,
      });
    }, []);

  useEffect(() => {
    updateScrollInfo();

    const node = trackRef.current;

    if (!node) return;

    if (
      typeof ResizeObserver ===
      "undefined"
    ) {
      return;
    }

    const resizeObserver =
      new ResizeObserver(
        updateScrollInfo
      );

    resizeObserver.observe(node);

    Array.from(node.children).forEach(
      (child) => {
        resizeObserver.observe(child);
      }
    );

    return () =>
      resizeObserver.disconnect();
  }, [
    updateScrollInfo,
    products.length,
    effectiveStatus,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Arrow scrolling                                                          */
  /* ------------------------------------------------------------------------ */

  const scrollByDirection =
    useCallback(
      (direction: 1 | -1) => {
        const node = trackRef.current;

        if (!node) return;

        const firstSlide =
          node.querySelector<HTMLElement>(
            "[data-slide]"
          );

        const gap = 20;

        const step = firstSlide
          ? firstSlide.getBoundingClientRect()
              .width + gap
          : node.clientWidth * 0.82;

        node.scrollBy({
          left: direction * step,
          behavior: "smooth",
        });
      },
      []
    );

  /* ------------------------------------------------------------------------ */
  /* Keyboard                                                                  */
  /* ------------------------------------------------------------------------ */

  const onTrackKeyDown =
    useCallback(
      (e: React.KeyboardEvent<HTMLUListElement>) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          scrollByDirection(1);
        }

        if (e.key === "ArrowLeft") {
          e.preventDefault();
          scrollByDirection(-1);
        }
      },
      [scrollByDirection]
    );

  /* ------------------------------------------------------------------------ */
  /* Mouse drag (desktop only — touch is left to native scrolling)            */
  /* ------------------------------------------------------------------------ */

  const onPointerDown =
    useCallback(
      (
        e: React.PointerEvent<HTMLUListElement>
      ) => {
        if (
          e.pointerType === "touch" ||
          e.button !== 0
        ) {
          return;
        }

        const node = trackRef.current;

        if (!node) return;

        dragRef.current = {
          isDown: true,
          startX: e.clientX,
          startScrollLeft:
            node.scrollLeft,
          moved: false,
          pointerId: e.pointerId,
        };

        node.setPointerCapture(e.pointerId);
      },
      []
    );

  const onPointerMove =
    useCallback(
      (
        e: React.PointerEvent<HTMLUListElement>
      ) => {
        const node = trackRef.current;
        const drag = dragRef.current;

        if (
          !node ||
          !drag.isDown ||
          e.pointerType === "touch"
        ) {
          return;
        }

        const dx =
          e.clientX - drag.startX;

        if (Math.abs(dx) > 5) {
          drag.moved = true;
        }

        node.scrollLeft =
          drag.startScrollLeft - dx;
      },
      []
    );

  const endDrag = useCallback(
    (
      e:
        | React.PointerEvent<HTMLUListElement>
        | React.PointerEvent
    ) => {
      const node = trackRef.current;
      const drag = dragRef.current;

      if (
        node &&
        drag.pointerId !== null &&
        node.hasPointerCapture(
          drag.pointerId
        )
      ) {
        node.releasePointerCapture(
          drag.pointerId
        );
      }

      drag.isDown = false;
      drag.pointerId = null;
    },
    []
  );

  /* ------------------------------------------------------------------------ */
  /* Prevent accidental navigation after drag                                */
  /* ------------------------------------------------------------------------ */

  const onTrackClickCapture =
    useCallback(
      (e: React.MouseEvent<HTMLUListElement>) => {
        if (dragRef.current.moved) {
          e.preventDefault();
          e.stopPropagation();

          dragRef.current.moved =
            false;
        }
      },
      []
    );

  /* ------------------------------------------------------------------------ */
  /* Product card props                                                       */
  /* ------------------------------------------------------------------------ */

  const cardProps = useMemo(
    () =>
      (
        product: Product,
        index: number
      ) => ({
        product,
        index,
        inView,
        ctaMode,
        href: getProductHref(product),
        isWishlisted:
          wishlistedIds.includes(
            product.id
          ),
        onWishlistToggle,
        onQuickAdd,
        onAddToCart,
      }),
    [
      inView,
      ctaMode,
      getProductHref,
      wishlistedIds,
      onWishlistToggle,
      onQuickAdd,
      onAddToCart,
    ]
  );

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <section
      ref={sectionRef}
      aria-labelledby="best-sellers-heading"
      className="
        [--ink:#221C17]
        [--ink-soft:#4A4038]
        [--ink-mute:#8C8172]
        [--ivory:#F6F1E6]
        [--sand:#E7DCC6]
        [--terracotta:#B9552E]
        [--saffron:#D9922E]
        [--maroon:#6B2430]
        [--gold:#A9834A]
        [--card-border:rgba(34,28,23,0.12)]
        [--card-bg:rgba(255,253,248,0.5)]
        [--image-bg:#EFE7D6]
        [--stone-line:rgba(34,28,23,0.16)]
        [--font-display:'Fraunces',Georgia,serif]
        [--font-body:'Inter',-apple-system,sans-serif]
        relative
        overflow-hidden
        bg-[color:var(--ivory)]
        py-16
        md:py-24
        [font-family:var(--font-body)]
      "
    >
      {/* Grain texture */}

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-multiply"
      >
        <filter id="navgrah-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />

          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"
          />
        </filter>

        <rect
          width="100%"
          height="100%"
          filter="url(#navgrah-grain)"
        />
      </svg>

      <div className="relative mx-auto max-w-[1320px] px-[5vw] md:px-[6vw]">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-10 flex flex-col gap-8 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[600px]">
            <h2
              id="best-sellers-heading"
              className="[font-family:var(--font-display)] text-[38px] leading-[1.06] text-[color:var(--ink)] sm:text-[48px] lg:text-[60px]"
            >
              The pieces people come back for
            </h2>

            <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
              Each bracelet carries its own
              stone and its own story. This
              selection is chosen by returning
              customers, not by us.
            </p>
          </div>

          <div className="flex items-center justify-between gap-6 md:flex-col md:items-end md:gap-4">
            {onViewAll ? (
              <button
                type="button"
                onClick={onViewAll}
                className="border-b border-transparent pb-0.5 text-[13.5px] text-[color:var(--ink)] transition-colors duration-250 ease-out hover:border-[color:var(--terracotta)] hover:text-[color:var(--terracotta)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
              >
                View all
              </button>
            ) : (
              <Link
                href={viewAllHref}
                className="border-b border-transparent pb-0.5 text-[13.5px] text-[color:var(--ink)] transition-colors duration-250 ease-out hover:border-[color:var(--terracotta)] hover:text-[color:var(--terracotta)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
              >
                View all
              </Link>
            )}

            {effectiveStatus ===
              "idle" &&
              products.length > 0 && (
                <div className="hidden shrink-0 gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() =>
                      scrollByDirection(-1)
                    }
                    disabled={
                      !scrollInfo.canLeft
                    }
                    aria-label="Scroll to previous pieces"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--card-border)] text-[color:var(--ink)] transition-colors duration-250 ease-out hover:border-[color:var(--terracotta)] hover:text-[color:var(--terracotta)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[color:var(--card-border)] disabled:hover:text-[color:var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
                  >
                    <ChevronLeftIcon
                      direction="left"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      scrollByDirection(1)
                    }
                    disabled={
                      !scrollInfo.canRight
                    }
                    aria-label="Scroll to more pieces"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--card-border)] text-[color:var(--ink)] transition-colors duration-250 ease-out hover:border-[color:var(--terracotta)] hover:text-[color:var(--terracotta)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[color:var(--card-border)] disabled:hover:text-[color:var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
                  >
                    <ChevronLeftIcon
                      direction="right"
                    />
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Loading                                                           */}
        {/* ---------------------------------------------------------------- */}

        {effectiveStatus ===
          "loading" && (
          <ul className="m-0 flex list-none gap-5 overflow-hidden p-0">
            {Array.from(
              {
                length: Math.max(
                  skeletonCount,
                  1
                ),
              },
              (_, index) => (
                <li
                  key={index}
                  className={`${SLIDE_WIDTH_CLASS} shrink-0`}
                >
                  <SkeletonCard />
                </li>
              )
            )}
          </ul>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Error                                                             */}
        {/* ---------------------------------------------------------------- */}

        {effectiveStatus ===
          "error" && (
          <p
            className="rounded-[16px] border border-[color:var(--card-border)] px-6 py-10 text-center text-[14px] text-[color:var(--ink-soft)]"
            role="alert"
          >
            We couldn&rsquo;t load the
            products. Please try again.
          </p>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Empty                                                             */}
        {/* ---------------------------------------------------------------- */}

        {effectiveStatus ===
          "empty" && (
          <p className="rounded-[16px] border border-[color:var(--card-border)] px-6 py-10 text-center text-[14px] text-[color:var(--ink-soft)]">
            No products available right
            now.
          </p>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Products                                                          */}
        {/* ---------------------------------------------------------------- */}

        {effectiveStatus ===
          "idle" &&
          products.length > 0 && (
            <>
              <ul
                ref={trackRef}
                role="list"
                tabIndex={0}
                aria-label="Best-selling bracelets, scrollable"
                onKeyDown={
                  onTrackKeyDown
                }
                onScroll={
                  updateScrollInfo
                }
                onPointerDown={
                  onPointerDown
                }
                onPointerMove={
                  onPointerMove
                }
                onPointerUp={endDrag}
                onPointerCancel={
                  endDrag
                }
                onClickCapture={
                  onTrackClickCapture
                }
                className="navgrah-track m-0 flex list-none cursor-grab gap-5 overflow-x-auto overscroll-x-contain scroll-smooth p-0 pb-2 pl-0 pr-[5vw] active:cursor-grabbing sm:pr-0 snap-x snap-mandatory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ink)]"
                style={{
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {products.map(
                  (product, index) => (
                    <li
                      key={product.id}
                      data-slide
                      className={`${SLIDE_WIDTH_CLASS} shrink-0 snap-start`}
                    >
                      <ProductCard
                        {...cardProps(
                          product,
                          index
                        )}
                      />
                    </li>
                  )
                )}
              </ul>

              {/* Scroll progress */}

              {products.length > 1 &&
                scrollInfo.thumbWidth < 100 && (
                  <div className="relative mt-5 h-[3px] w-full max-w-[220px] overflow-hidden rounded-full bg-[color:var(--stone-line)]">
                    <div
                      className="absolute inset-y-0 rounded-full bg-[color:var(--gold)] transition-[left,width] duration-200 ease-out"
                      style={{
                        width: `${scrollInfo.thumbWidth}%`,
                        left: `${scrollInfo.thumbLeft}%`,
                      }}
                    />
                  </div>
                )}

              {/* Trust line */}

              {trustLine && (
                <p className="mt-12 text-center text-[12.5px] tracking-[0.02em] text-[color:var(--ink-mute)] md:mt-16">
                  {trustLine}
                </p>
              )}
            </>
          )}
      </div>
    </section>
  );
}