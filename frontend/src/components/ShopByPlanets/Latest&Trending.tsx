"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { ChevronLeftRightIcon, ImageFallbackIcon, PlusIcon, CheckIcon } from "../Header/icons";

import aries from '../../../public/images/bracelet(12).jpeg';
import pisces from '../../../public/images/bracelet(9).jpeg';
import gemini from '../../../public/images/bracelet(11).jpeg';
import cancer from '../../../public/images/bracelet(3).jpeg';
import leo from '../../../public/images/bracelet(2).jpeg';
import virgo from '../../../public/images/bracelet(1).jpeg';
import libra from '../../../public/images/bracelet(4).jpeg';
import scorpio from '../../../public/images/bracelet(10).jpeg';
import { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
type SectionStatus = "idle" | "loading" | "empty" | "error";
type ImageShape = "square" | "portrait" | "elongated";

type AddState = "idle" | "loading" | "added" | "error";

export interface TrendingBracelet {
  id: string;
  slug: string;
  name: string;
  stone: string;
  image: StaticImageData;
  imageAlt?: string;
  note: string;
  price: number;
  currency?: string;
  isNew?: boolean;
  accent: string;
  shape: ImageShape;
  cordLength: number;
}

interface LatestAndTrendingProps {
  items?: TrendingBracelet[];
  status?: SectionStatus;
  skeletonCount?: number;
  eyebrow?: string;
  headingLead?: string;
  headingTail?: string;
  description?: string;
  viewAllHref?: string;
  onViewAll?: () => void;
  getItemHref?: (item: TrendingBracelet) => string;
  onQuickAdd?: (itemId: string) => Promise<void> | void;
}

const SHAPE_RATIO: Record<ImageShape, string> = {
  square: "1 / 1",
  portrait: "4 / 5",
  elongated: "5 / 7",
};

const SKELETON_CORDS = [18, 46, 10, 34, 58];

function formatPrice(amount: number, currency = "₹") {
  return `${currency}${amount.toLocaleString("en-IN")}`;
}

export const SAMPLE_TRENDING: TrendingBracelet[] = [
  {
    id: "t1",
    slug: "labradorite-drift-bracelet",
    name: "Labradorite Drift",
    stone: "Labradorite",
    image: scorpio,
    imageAlt: "Labradorite bead bracelet catching the light",
    note: "Cut to catch low light, not direct sun.",
    price: 1799,
    isNew: true,
    accent: "#3D4A73",
    shape: "portrait",
    cordLength: 18,
  },
  {
    id: "t2",
    slug: "carnelian-ember-bracelet",
    name: "Carnelian Ember",
    stone: "Carnelian",
    image: aries,
    imageAlt: "Carnelian bead bracelet in warm orange tones",
    note: "Warm stone for the turn of the season.",
    price: 1399,
    isNew: true,
    accent: "#B9552E",
    shape: "square",
    cordLength: 46,
  },
  {
    id: "t3",
    slug: "garnet-root-bracelet",
    name: "Garnet Root",
    stone: "Garnet",
    image: pisces,
    imageAlt: "Deep red garnet bead bracelet",
    note: "Heavier beads, deliberately.",
    price: 1899,
    accent: "#7A2B2E",
    shape: "elongated",
    cordLength: 10,
  },
  {
    id: "t4",
    slug: "jade-canopy-bracelet",
    name: "Jade Canopy",
    stone: "Jade",
    image: gemini,
    imageAlt: "Green jade bead bracelet",
    note: "An old stone, reset for daily wear.",
    price: 1599,
    accent: "#3F6E52",
    shape: "portrait",
    cordLength: 34,
  },
  {
    id: "t5",
    slug: "citrine-field-bracelet",
    name: "Citrine Field",
    stone: "Citrine",
    image: cancer,
    imageAlt: "Golden citrine bead bracelet",
    note: "Faceted just enough to hold the light.",
    price: 1299,
    isNew: true,
    accent: "#C98A2C",
    shape: "square",
    cordLength: 58,
  },
  {
    id: "t6",
    slug: "sodalite-night-bracelet",
    name: "Sodalite Night",
    stone: "Sodalite",
    image: leo,
    imageAlt: "Deep blue sodalite bead bracelet",
    note: "Reads black until the sun finds it.",
    price: 1499,
    accent: "#1F3B5C",
    shape: "elongated",
    cordLength: 22,
  },
  {
    id: "t7",
    slug: "smoky-quartz-bracelet",
    name: "Smoky Quartz",
    stone: "Smoky Quartz",
    image: virgo,
    imageAlt: "Smoky brown quartz bead bracelet",
    note: "Quiet, on purpose.",
    price: 1199,
    accent: "#6B5644",
    shape: "portrait",
    cordLength: 42,
  },
  {
    id: "t8",
    slug: "howlite-cloud-bracelet",
    name: "Howlite Cloud",
    stone: "Howlite",
    image: libra,
    imageAlt: "Pale grey-veined howlite bead bracelet",
    note: "The lightest piece in this drop.",
    price: 999,
    accent: "#8C8172",
    shape: "square",
    cordLength: 14,
  },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setReduced(mq.matches);
    };

    update();

    mq.addEventListener?.("change", update);

    return () => {
      mq.removeEventListener?.("change", update);
    };
  }, []);

  return reduced;
}

function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

function BraceletPiece({
  item,
  index,
  inView,
  reducedMotion,
  href,
  onQuickAdd,
}: {
  item: TrendingBracelet;
  index: number;
  inView: boolean;
  reducedMotion: boolean;
  href: string;
  onQuickAdd?: (id: string) => Promise<void> | void;
}) {
  const [addState, setAddState] = useState<AddState>("idle");
  const [imageFailed, setImageFailed] = useState(false);

  const addTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addRequestRef = useRef(0);

  const variant = index % 3;

  const clearAddTimer = useCallback(() => {
    if (addTimerRef.current) {
      clearTimeout(addTimerRef.current);
      addTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearAddTimer();
      addRequestRef.current += 1;
    };
  }, [clearAddTimer]);

  const handleQuickAdd = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!onQuickAdd || addState === "loading") return;

      clearAddTimer();

      const requestId = ++addRequestRef.current;

      setAddState("loading");

      try {
        await onQuickAdd(item.id);

        if (requestId !== addRequestRef.current) return;

        setAddState("added");

        addTimerRef.current = setTimeout(() => {
          if (requestId === addRequestRef.current) {
            setAddState("idle");
          }
        }, 2000);
      } catch {
        if (requestId !== addRequestRef.current) return;

        setAddState("error");

        addTimerRef.current = setTimeout(() => {
          if (requestId === addRequestRef.current) {
            setAddState("idle");
          }
        }, 2500);
      }
    },
    [addState, clearAddTimer, item.id, onQuickAdd]
  );

  const revealStyle: React.CSSProperties = reducedMotion
    ? {}
    : {
        transitionDelay: inView
          ? `${Math.min(index, 9) * 90 + 120}ms`
          : undefined,
      };

  const buttonIsAdded = addState === "added";
  const buttonIsError = addState === "error";

  return (
    <div
      className={[
        "group/piece relative flex shrink-0 flex-col items-center",
        "w-[58vw] max-w-[218px] sm:max-w-[248px] lg:max-w-[276px]",
        reducedMotion
          ? "translate-y-0 opacity-100"
          : inView
            ? "translate-y-0 opacity-100 transition-[opacity,transform] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            : "translate-y-6 opacity-0",
      ].join(" ")}
      style={{
        ...revealStyle,
        ["--piece-accent" as string]: item.accent,
      }}
    >
      <span
        className="mb-1.5 text-[10px] tabular-nums tracking-[0.06em] text-[color:var(--ink-mute)]"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none h-[9px] w-[9px] rounded-full border-[1.6px] bg-[color:var(--paper)] transition-colors duration-300"
        style={{ borderColor: item.accent }}
      />

      <span
        aria-hidden="true"
        className={[
          "pointer-events-none w-[1.5px] origin-top",
          variant === 2
            ? "transition-[box-shadow] duration-500 ease-out group-hover/piece:shadow-[0_0_0_3px_var(--piece-accent-fade)]"
            : "",
        ].join(" ")}
        style={{
          height: `${Math.max(0, item.cordLength)}px`,
          backgroundColor: item.accent,
          opacity: 0.55,
          ["--piece-accent-fade" as string]: `${item.accent}22`,
        }}
      />

      <Link
        href={href}
        className="group/link mt-3 block w-full rounded-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ink)]"
        draggable={false}
      >
        <div className="relative">
          {variant === 0 && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-700 ease-out group-hover/piece:opacity-25 group-focus-within/piece:opacity-25"
              style={{ backgroundColor: item.accent }}
            />
          )}

          <div
            className={[
              "relative overflow-hidden rounded-[10px] bg-[color:var(--frame)]",
              "transition-transform duration-[650ms] ease-out",
              variant === 1
                ? "group-hover/piece:-rotate-[1.4deg] group-hover/piece:scale-[1.015]"
                : "",
            ].join(" ")}
            style={{
              aspectRatio: SHAPE_RATIO[item.shape],
            }}
          >
            {imageFailed ? (
              <div
                className="flex h-full w-full items-center justify-center"
                role="img"
                aria-label={item.imageAlt || item.name}
              >
                <ImageFallbackIcon />
              </div>
            ) : (
              <Image
                src={item.image}
                alt={item.imageAlt || item.name}
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                onError={() => setImageFailed(true)}
                className="h-full w-full object-cover transition-transform duration-[650ms] ease-out group-hover/piece:scale-[1.05]"
              />
            )}
          </div>

          {item.isNew && (
            <span
              className="absolute -top-2 left-3 inline-flex items-center gap-1 rounded-full bg-[color:var(--paper)] px-2 py-[3px] text-[9.5px] tracking-[0.05em] text-[color:var(--ink-soft)] shadow-[0_1px_6px_rgba(34,28,23,0.12)]"
            >
              <span
                className="navgrah-pulse-dot h-[5px] w-[5px] rounded-full"
                style={{ backgroundColor: item.accent }}
                aria-hidden="true"
              />
              new
            </span>
          )}

          <div
            className="absolute -bottom-3 -right-3 rounded-[8px] border bg-[color:var(--paper)] px-2 py-1 text-[12px] font-medium text-[color:var(--ink)] transition-colors duration-300"
            style={{
              borderColor: `${item.accent}55`,
            }}
          >
            {formatPrice(item.price, item.currency)}
          </div>
        </div>

        <div className="mt-5 pr-2">
          <p className="flex items-center gap-1.5 text-[11.5px] text-[color:var(--ink-mute)]">
            <span
              className="h-[5px] w-[5px] shrink-0 rounded-full"
              style={{ backgroundColor: item.accent }}
              aria-hidden="true"
            />
            {item.stone}
          </p>

          <h3 className="mt-1 text-[18px] leading-snug text-[color:var(--ink)] [font-family:var(--font-display)]">
            {item.name}
          </h3>

          <p className="mt-1 text-[12.5px] italic leading-relaxed text-[color:var(--ink-soft)]">
            {item.note}
          </p>
        </div>
      </Link>

      <div className="mt-3 flex w-full items-center justify-between pr-2">
        <Link
          href={href}
          className="group/cta relative inline-flex items-center gap-1 rounded-sm text-[12.5px] text-[color:var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
        >
          <span className="relative">
            View piece
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-[0.35] bg-[color:var(--terracotta)] transition-transform duration-300 ease-out group-hover/cta:scale-x-100 group-focus-visible/cta:scale-x-100"
            />
          </span>

          <span className="transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5">
            <ChevronLeftRightIcon direction="right" />
          </span>
        </Link>

        {onQuickAdd && (
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={addState === "loading"}
            aria-label={
              buttonIsAdded
                ? `${item.name} added to cart`
                : buttonIsError
                  ? `Could not add ${item.name} to cart`
                  : `Add ${item.name} to cart`
            }
            title={
              buttonIsAdded
                ? "Added"
                : buttonIsError
                  ? "Try again"
                  : "Add to cart"
            }
            className={[
              "inline-flex h-7 w-7 items-center justify-center rounded-full border",
              "text-[color:var(--ink-soft)]",
              "transition-[background-color,border-color,color,transform] duration-250 ease-out",
              "hover:text-[color:var(--paper)]",
              "active:scale-95",
              "disabled:cursor-not-allowed disabled:opacity-60",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]",
              buttonIsAdded
                ? "text-[color:var(--paper)]"
                : buttonIsError
                  ? "text-[color:var(--paper)]"
                  : "",
            ].join(" ")}
            style={{
              borderColor: buttonIsAdded
                ? item.accent
                : buttonIsError
                  ? "var(--terracotta)"
                  : "var(--line)",
              backgroundColor: buttonIsAdded
                ? item.accent
                : buttonIsError
                  ? "var(--terracotta)"
                  : "transparent",
            }}
          >
            {addState === "loading" ? (
              <span
                className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-current border-t-transparent"
                aria-hidden="true"
              />
            ) : addState === "added" ? (
              <CheckIcon />
            ) : addState === "error" ? (
              <span
                className="text-[11px] font-medium leading-none"
                aria-hidden="true"
              >
                !
              </span>
            ) : (
              <PlusIcon />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function SkeletonPiece({ index }: { index: number }) {
  const cordLength = SKELETON_CORDS[index % SKELETON_CORDS.length];

  return (
    <div className="flex w-[58vw] max-w-[218px] shrink-0 flex-col items-center sm:max-w-[248px] lg:max-w-[276px]">
      <div className="mb-1.5 h-2.5 w-4 rounded bg-[color:var(--frame)] motion-safe:animate-pulse" />

      <div className="h-[9px] w-[9px] rounded-full bg-[color:var(--frame)] motion-safe:animate-pulse" />

      <div
        className="w-px bg-[color:var(--frame)] motion-safe:animate-pulse"
        style={{ height: `${cordLength}px` }}
      />

      <div className="mt-3 aspect-[4/5] w-full rounded-[10px] bg-[color:var(--frame)] motion-safe:animate-pulse" />

      <div className="mt-5 h-2.5 w-1/2 self-start rounded bg-[color:var(--frame)] motion-safe:animate-pulse" />

      <div className="mt-2 h-3.5 w-3/4 self-start rounded bg-[color:var(--frame)] motion-safe:animate-pulse" />

      <div className="mt-2 h-2.5 w-5/6 self-start rounded bg-[color:var(--frame)] motion-safe:animate-pulse" />
    </div>
  );
}

export default function LatestAndTrending({
  items = SAMPLE_TRENDING,
  status = "idle",
  skeletonCount = 5,
  eyebrow = "New this week",
  headingLead = "Latest to the rail,",
  headingTail = "trending in hand.",
  description = "Each piece is strung, checked, and hung before it is ever listed. What you see below went up this week.",
  viewAllHref = "/shop",
  onViewAll,
  getItemHref = (item) => `/products/${item.slug}`,
  onQuickAdd,
}: LatestAndTrendingProps) {
  const [sectionRef, sectionInView] = useInView<HTMLElement>({
    threshold: 0.08,
  });

  const reducedMotion = usePrefersReducedMotion();

  const trackRef = useRef<HTMLDivElement | null>(null);

  const dragRef = useRef({
    isDown: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  const [rail, setRail] = useState({
    canLeft: false,
    canRight: false,
    progress: 0,
    beadAccent: items[0]?.accent ?? "#B9552E",
  });

  const [announcement, setAnnouncement] = useState("");

  const componentId = useId();

  const grainFilterId = useMemo(
    () => `navgrah-grain-latest-${componentId.replace(/:/g, "")}`,
    [componentId]
  );

  const effectiveStatus: SectionStatus =
    status === "idle" && items.length === 0 ? "empty" : status;

  const updateRail = useCallback(() => {
    const node = trackRef.current;

    if (!node) return;

    const { scrollLeft, scrollWidth, clientWidth } = node;

    const maxScroll = Math.max(scrollWidth - clientWidth, 0);

    const progress =
      maxScroll > 0
        ? Math.min(1, Math.max(0, scrollLeft / maxScroll))
        : 0;

    const nearestIndex =
      items.length > 0
        ? Math.min(
            items.length - 1,
            Math.max(
              0,
              Math.round(progress * Math.max(items.length - 1, 0))
            )
          )
        : 0;

    setRail({
      canLeft: scrollLeft > 4,
      canRight: scrollLeft < maxScroll - 4,
      progress,
      beadAccent: items[nearestIndex]?.accent ?? "#B9552E",
    });
  }, [items]);

  useEffect(() => {
    updateRail();

    const node = trackRef.current;

    if (!node) return;

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => {
        updateRail();
      });

      resizeObserver.observe(node);

      if (node.firstElementChild instanceof HTMLElement) {
        resizeObserver.observe(node.firstElementChild);
      }

      return () => resizeObserver.disconnect();
    }

    return undefined;
  }, [updateRail]);

  useEffect(() => {
    const node = trackRef.current;

    if (!node || typeof MutationObserver === "undefined") return;

    const observer = new MutationObserver(() => {
      requestAnimationFrame(updateRail);
    });

    observer.observe(node, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [updateRail]);

  useEffect(() => {
    requestAnimationFrame(updateRail);
  }, [items, updateRail]);

  const scrollByDirection = useCallback(
    (direction: 1 | -1) => {
      const node = trackRef.current;

      if (!node) return;

      const firstPiece = node.querySelector<HTMLElement>("[data-piece]");

      const gap =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 640px)").matches
          ? 40
          : 32;

      const step = firstPiece
        ? firstPiece.getBoundingClientRect().width + gap
        : node.clientWidth * 0.8;

      node.scrollBy({
        left: direction * step,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion]
  );

  const onTrackKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByDirection(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByDirection(-1);
      } else if (e.key === "Home") {
        e.preventDefault();

        trackRef.current?.scrollTo({
          left: 0,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      } else if (e.key === "End") {
        e.preventDefault();

        const node = trackRef.current;

        if (!node) return;

        node.scrollTo({
          left: node.scrollWidth,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }
    },
    [reducedMotion, scrollByDirection]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const node = trackRef.current;

      if (!node || e.pointerType === "touch") return;

      const target = e.target as HTMLElement;

      if (
        target.closest(
          "a, button, input, textarea, select, [role='button']"
        )
      ) {
        return;
      }

      dragRef.current = {
        isDown: true,
        pointerId: e.pointerId,
        startX: e.clientX,
        startScrollLeft: node.scrollLeft,
        moved: false,
      };

      node.setPointerCapture(e.pointerId);
    },
    []
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const node = trackRef.current;
      const drag = dragRef.current;

      if (!node || !drag.isDown || drag.pointerId !== e.pointerId) {
        return;
      }

      const dx = e.clientX - drag.startX;

      if (Math.abs(dx) > 4) {
        drag.moved = true;
      }

      node.scrollLeft = drag.startScrollLeft - dx;
    },
    []
  );

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const node = trackRef.current;
      const drag = dragRef.current;

      if (node && drag.pointerId === e.pointerId) {
        if (node.hasPointerCapture(e.pointerId)) {
          node.releasePointerCapture(e.pointerId);
        }
      }

      dragRef.current.isDown = false;
      dragRef.current.pointerId = -1;
    },
    []
  );

  const onTrackClickCapture = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!dragRef.current.moved) return;

      e.preventDefault();
      e.stopPropagation();

      dragRef.current.moved = false;
    },
    []
  );

  const railLineStyle = useMemo<React.CSSProperties>(
    () => ({
      transform:
        reducedMotion || sectionInView ? "scaleX(1)" : "scaleX(0)",
      transitionDuration: reducedMotion ? "0ms" : "1100ms",
    }),
    [reducedMotion, sectionInView]
  );

  const statusMessage =
    effectiveStatus === "loading"
      ? "Loading the latest and trending bracelets."
      : effectiveStatus === "error"
        ? "We couldn't load this week's pieces."
        : effectiveStatus === "empty"
          ? "There are no new pieces on the rail right now."
          : undefined;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="latest-trending-heading"
      aria-busy={effectiveStatus === "loading"}
      className="
        [--ink:#221C17] [--ink-soft:#4A4038] [--ink-mute:#8C8172]
        [--paper:#FBF9F4] [--frame:#F1ECE1] [--line:rgba(34,28,23,0.14)]
        [--terracotta:#B9552E]
        [--font-display:'Fraunces',Georgia,serif]
        [--font-body:'Inter',-apple-system,sans-serif]
        relative overflow-hidden bg-[color:var(--paper)]
        py-20 [font-family:var(--font-body)]
        md:py-28
      "
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');

        .navgrah-track {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          touch-action: pan-x;
        }

        .navgrah-track::-webkit-scrollbar {
          display: none;
        }

        @keyframes navgrahPulseDot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.7);
            opacity: 0.45;
          }
        }

        .navgrah-pulse-dot {
          animation: navgrahPulseDot 2.4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .navgrah-pulse-dot {
            animation: none;
          }
        }
      `}</style>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04] mix-blend-multiply"
      >
        <filter id={grainFilterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />

          <feColorMatrix
            type="matrix"
            values="
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0.5 0
            "
          />
        </filter>

        <rect
          width="100%"
          height="100%"
          filter={`url(#${grainFilterId})`}
        />
      </svg>

      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement || statusMessage || ""}
      </div>

      <div className="relative mx-auto max-w-[1360px] px-[6vw] lg:px-[4vw]">
        <div className="mb-16 flex flex-col gap-10 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[560px]">
            <div className="mb-5 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-9 bg-[color:var(--line)]"
              />

              <span className="text-[12px] tracking-[0.04em] text-[color:var(--ink-mute)]">
                {eyebrow}
              </span>
            </div>

            <h2
              id="latest-trending-heading"
              className="text-[36px] leading-[1.08] text-[color:var(--ink)] sm:text-[46px] lg:text-[56px] [font-family:var(--font-display)]"
            >
              {headingLead}
              <br />
              <span className="italic">{headingTail}</span>
            </h2>

            <p className="mt-6 max-w-[42ch] text-[14.5px] leading-relaxed text-[color:var(--ink-soft)]">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-6 md:flex-col md:items-end md:gap-5">
            {onViewAll ? (
              <button
                type="button"
                onClick={onViewAll}
                className="border-b border-transparent pb-0.5 text-[13px] text-[color:var(--ink)] transition-colors duration-250 ease-out hover:border-[color:var(--terracotta)] hover:text-[color:var(--terracotta)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
              >
                See the full collection
              </button>
            ) : (
              <a
                href={viewAllHref}
                className="border-b border-transparent pb-0.5 text-[13px] text-[color:var(--ink)] transition-colors duration-250 ease-out hover:border-[color:var(--terracotta)] hover:text-[color:var(--terracotta)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
              >
                See the full collection
              </a>
            )}

            {effectiveStatus === "idle" && items.length > 0 && (
              <div
                className="hidden shrink-0 gap-2 sm:flex"
                aria-label="Rail navigation"
              >
                <button
                  type="button"
                  onClick={() => scrollByDirection(-1)}
                  disabled={!rail.canLeft}
                  aria-label="Scroll to earlier pieces"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--line)] text-[color:var(--ink)] transition-colors duration-250 ease-out hover:border-[color:var(--terracotta)] hover:text-[color:var(--terracotta)] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
                >
                  <ChevronLeftRightIcon direction="left" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollByDirection(1)}
                  disabled={!rail.canRight}
                  aria-label="Scroll to more pieces"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--line)] text-[color:var(--ink)] transition-colors duration-250 ease-out hover:border-[color:var(--terracotta)] hover:text-[color:var(--terracotta)] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
                >
                  <ChevronLeftRightIcon direction="right" />
                </button>
              </div>
            )}
          </div>
        </div>

        {effectiveStatus === "loading" && (
          <div
            className="flex gap-8 overflow-hidden pb-2 pt-4 sm:gap-10"
            aria-label="Loading latest and trending bracelets"
            role="status"
          >
            {Array.from(
              {
                length: Math.max(1, skeletonCount),
              },
              (_, i) => (
                <SkeletonPiece key={i} index={i} />
              )
            )}
          </div>
        )}

        {effectiveStatus === "error" && (
          <div
            className="rounded-[14px] border border-[color:var(--line)] px-6 py-10 text-center"
            role="alert"
          >
            <p className="text-[14px] text-[color:var(--ink-soft)]">
              We couldn&rsquo;t load this week&rsquo;s pieces. Please try
              again.
            </p>
          </div>
        )}

        {effectiveStatus === "empty" && (
          <div
            className="rounded-[14px] border border-[color:var(--line)] px-6 py-10 text-center"
            role="status"
          >
            <p className="text-[14px] text-[color:var(--ink-soft)]">
              Nothing new on the rail just yet — check back soon.
            </p>
          </div>
        )}

        {effectiveStatus === "idle" && items.length > 0 && (
          <>
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 right-0 top-[19px] h-px origin-left bg-[color:var(--line)] transition-transform ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={railLineStyle}
              />

              <div
                ref={trackRef}
                role="list"
                tabIndex={0}
                aria-label="Latest and trending bracelets"
                aria-describedby="latest-trending-scroll-help"
                onKeyDown={onTrackKeyDown}
                onScroll={updateRail}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onPointerLeave={(e) => {
                  if (dragRef.current.isDown) {
                    endDrag(e);
                  }
                }}
                onClickCapture={onTrackClickCapture}
                className="navgrah-track flex cursor-grab gap-8 overflow-x-auto pb-3 pl-0 pr-[6vw] pt-4 active:cursor-grabbing sm:gap-10 lg:pr-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ink)]"
              >
                {items.map((item, i) => (
                  <div
                    key={item.id}
                    data-piece
                    role="listitem"
                  >
                    <BraceletPiece
                      item={item}
                      index={i}
                      inView={sectionInView}
                      reducedMotion={reducedMotion}
                      href={getItemHref(item)}
                      onQuickAdd={
                        onQuickAdd
                          ? async (itemId) => {
                              await onQuickAdd(itemId);

                              const addedItem = items.find(
                                (entry) => entry.id === itemId
                              );

                              if (addedItem) {
                                setAnnouncement(
                                  `${addedItem.name} added to cart.`
                                );
                              }
                            }
                          : undefined
                      }
                    />
                  </div>
                ))}
              </div>

              <p
                id="latest-trending-scroll-help"
                className="sr-only"
              >
                Use the left and right arrow keys to move through the
                collection. Home moves to the beginning and End moves to
                the last piece.
              </p>
            </div>

            {items.length > 1 && (
              <div
                className="relative mt-10 h-px w-full max-w-[240px] bg-[color:var(--line)]"
                role="progressbar"
                aria-label="Collection scroll position"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(rail.progress * 100)}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full transition-[left,background-color] duration-200 ease-out"
                  style={{
                    left: `${rail.progress * 100}%`,
                    backgroundColor: rail.beadAccent,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}