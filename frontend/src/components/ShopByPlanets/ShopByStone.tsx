"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type StoneMaterial = {
  id: string;
  index: string;
  name: string; 
  color: string;
  statement: [string, string];
  image: {
    src: string;
    alt: string;
  };
  bracelet: {
    name: string; 
    count: number; 
    href: string; 
  };
};

const STONE_MATERIALS: StoneMaterial[] = [
  {
    id: "ruby",
    index: "01",
    name: "Ruby",
    color: "#E2672A",
    statement: ["Warm crimson depth.", "Bold, saturated character."],
    image: { src: "/images/gem(6).png", alt: "NavGrah Ruby bead bracelet, close detail" },
    bracelet: { name: "Ruby Bead Bracelet", count: 3, href: "#" },
  },
  {
    id: "pearl",
    index: "02",
    name: "Pearl",
    color: "#8C97A6",
    statement: ["Soft luminous sheen.", "Understated and smooth."],
    image: { src: "/images/gem(7).png", alt: "NavGrah Pearl bead bracelet, close detail" },
    bracelet: { name: "Pearl Bead Bracelet", count: 2, href: "#" },
  },
  {
    id: "red-coral",
    index: "03",
    name: "Red Coral",
    color: "#B23A2E",
    statement: ["Earthy, saturated red.", "Organic natural texture."],
    image: { src: "/images/gem(8).png", alt: "NavGrah Red Coral bead bracelet, close detail" },
    bracelet: { name: "Red Coral Bead Bracelet", count: 2, href: "#" },
  },
  {
    id: "emerald",
    index: "04",
    name: "Emerald",
    color: "#4C7C59",
    statement: ["Cool green clarity.", "Rich, composed tone."],
    image: { src: "/images/gem(4).png", alt: "NavGrah Emerald bead bracelet, close detail" },
    bracelet: { name: "Emerald Bead Bracelet", count: 3, href: "#" },
  },
  {
    id: "yellow-sapphire",
    index: "05",
    name: "Yellow Sapphire",
    color: "#C89B3C",
    statement: ["Golden natural warmth.", "Clean, quiet brilliance."],
    image: { src: "/images/gem(2).png", alt: "NavGrah Yellow Sapphire bead bracelet, close detail" },
    bracelet: { name: "Yellow Sapphire Bead Bracelet", count: 4, href: "#" },
  },
  {
    id: "diamond",
    index: "06",
    name: "Diamond",
    color: "#B98CB0",
    statement: ["Clear faceted light.", "Precise and refined."],
    image: { src: "/images/gem(5).png", alt: "NavGrah Diamond bead bracelet, close detail" },
    bracelet: { name: "Diamond Bead Bracelet", count: 2, href: "#" },
  },
  {
    id: "blue-sapphire",
    index: "07",
    name: "Blue Sapphire",
    color: "#33526E",
    statement: ["Deep, cool blue.", "A quiet, composed tone."],
    image: { src: "/images/gem(1).png", alt: "NavGrah Blue Sapphire bead bracelet, close detail" },
    bracelet: { name: "Blue Sapphire Bead Bracelet", count: 3, href: "#" },
  },
  {
    id: "hessonite",
    index: "08",
    name: "Hessonite",
    color: "#7A6248",
    statement: ["Amber-brown warmth.", "Layered natural hue."],
    image: { src: "/images/gem(9).png", alt: "NavGrah Hessonite bead bracelet, close detail" },
    bracelet: { name: "Hessonite Bead Bracelet", count: 2, href: "#" },
  },
  {
    id: "cats-eye",
    index: "09",
    name: "Cat's Eye",
    color: "#5B6B4F",
    statement: ["Muted olive sheen.", "A subtle, natural line."],
    image: { src: "/images/gem(3).png", alt: "NavGrah Cat's Eye bead bracelet, close detail" },
    bracelet: { name: "Cat's Eye Bead Bracelet", count: 2, href: "#" },
  },
];

function StoneVisual({ stone, priority }: { stone: StoneMaterial; priority?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={stone.image.alt}
        className="ng-clip-lg flex h-full w-full flex-col items-center justify-center gap-1.5 border border-[#1C1024]/8 text-center transition-colors duration-500"
        style={{ backgroundColor: `color-mix(in srgb, ${stone.color} 12%, #FCFBF8)` }}
      >
        <span className="ng-display text-[16px] italic text-[#1C1024]/55">{stone.name}</span>
        <span className="ng-ui text-[9.5px] uppercase tracking-[0.08em] text-[#1C1024]/35">
          Image pending — {stone.image.src}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={stone.image.src}
      alt={stone.image.alt}
      fill
      priority={priority}
      sizes="(min-width: 1024px) 440px, (min-width: 640px) 320px, 80vw"
      className="ng-clip-lg object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function StoneStatement({ stone }: { stone: StoneMaterial }) {
  return (
    <p className="ng-display text-[22px] italic leading-snug text-[#1C1024] sm:text-[26px]">
      {stone.statement[0]}
      <br />
      <span className="text-[#1C1024]/60">{stone.statement[1]}</span>
    </p>
  );
}

function MetaRow({ stone }: { stone: StoneMaterial }) {
  return (
    <dl className="ng-ui grid grid-cols-3 gap-4 border-t border-[#1C1024]/10 pt-4 text-[11px] uppercase tracking-[0.08em]">
      <div>
        <dt className="text-[#1C1024]/45">Material</dt>
        <dd className="mt-1 normal-case text-[13px] tracking-normal text-[#1C1024]">{stone.name}</dd>
      </div>
      <div>
        <dt className="text-[#1C1024]/45">Collection</dt>
        <dd className="mt-1 normal-case text-[13px] tracking-normal text-[#1C1024]">{stone.bracelet.name}</dd>
      </div>
      <div>
        <dt className="text-[#1C1024]/45">Bracelets</dt>
        <dd className="mt-1 normal-case text-[13px] tracking-normal text-[#1C1024]">{stone.bracelet.count}</dd>
      </div>
    </dl>
  );
}

export default function ShopByStone() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [threadTop, setThreadTop] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const headingId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileTabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = STONE_MATERIALS[activeIndex];

  useEffect(() => {
    function measure() {
      const btn = desktopTabRefs.current[activeIndex];
      const container = containerRef.current;
      if (btn && container) {
        const btnRect = btn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setThreadTop(btnRect.top - containerRect.top + btnRect.height / 2);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  function selectStone(i: number) {
    setActiveIndex(((i % STONE_MATERIALS.length) + STONE_MATERIALS.length) % STONE_MATERIALS.length);
  }

  function handleTabKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    i: number,
    orientation: "vertical" | "horizontal",
    refs: React.MutableRefObject<(HTMLButtonElement | null)[]>
  ) {
    const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
    const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
    let target: number | null = null;

    if (e.key === nextKey) target = i + 1;
    else if (e.key === prevKey) target = i - 1;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = STONE_MATERIALS.length - 1;
    else return;

    e.preventDefault();
    const resolved = ((target % STONE_MATERIALS.length) + STONE_MATERIALS.length) % STONE_MATERIALS.length;
    selectStone(resolved);
    refs.current[resolved]?.focus();
  }

  const heroTransition = {
    duration: prefersReducedMotion ? 0.15 : 0.5,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  return (
    <section
      id="shop-by-stone-heading"
      aria-labelledby={`${headingId}-title`}
      className="relative overflow-hidden bg-[#FCFBF8] py-16 sm:py-20 lg:py-28"
    >
      {/* ambient, decorative only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full opacity-40 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: `color-mix(in srgb, ${active.color} 18%, transparent)` }}
      />

      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-10">
        {/* Editorial section intro */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <p className="ng-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B8232F]">
            Material / {active.index}
          </p>
          <h2 id={`${headingId}-title`} className="ng-display mt-3 text-[32px] italic leading-tight text-[#1C1024] sm:text-[40px]">
            Explore the Material
          </h2>
          <p className="ng-ui mt-3 text-[14px] leading-relaxed text-[#1C1024]/60">
            Discover NavGrah bracelets through the stones that define them — their colour, depth
            and natural character.
          </p>
        </div>

        {/* ============ DESKTOP / TABLET LAYOUT ============ */}
        <div ref={containerRef} className="relative hidden lg:grid lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-12 xl:gap-20">
          {/* Stone thread — fine editorial line from active stone toward the hero */}
          {threadTop !== null && (
            <motion.div
              key={active.id}
              aria-hidden="true"
              className="pointer-events-none absolute left-[300px] top-0 hidden h-px lg:block xl:left-[300px]"
              style={{ top: threadTop, width: "72px", transformOrigin: "left center" }}
              initial={prefersReducedMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1, backgroundColor: active.color }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
          )}

          {/* Stone list — vertical editorial navigation */}
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Choose a stone"
            className="flex flex-col"
          >
            {STONE_MATERIALS.map((stone, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={stone.id}
                  ref={(el) => {
                    desktopTabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`stone-tab-d-${stone.id}`}
                  aria-selected={isActive}
                  aria-controls="stone-panel-desktop"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectStone(i)}
                  onMouseEnter={() => selectStone(i)}
                  onFocus={() => selectStone(i)}
                  onKeyDown={(e) => handleTabKeyDown(e, i, "vertical", desktopTabRefs)}
                  className="group flex items-baseline gap-3 border-b border-[#1C1024]/8 py-4 text-left transition-opacity duration-300 first:pt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/50"
                  style={{ opacity: isActive ? 1 : 0.45 }}
                >
                  <span
                    className="ng-ui shrink-0 text-[11px] font-semibold tabular-nums transition-colors duration-300"
                    style={{ color: isActive ? stone.color : "#1C1024" }}
                  >
                    {stone.index}
                  </span>
                  <span
                    className={`ng-display text-[20px] italic leading-tight transition-all duration-300 xl:text-[24px] ${
                      isActive ? "translate-x-1" : "translate-x-0"
                    }`}
                  >
                    {stone.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Hero panel — the bracelet is the visual hero, stone is its material story */}
          <div
            id="stone-panel-desktop"
            role="tabpanel"
            aria-labelledby={`stone-tab-d-${active.id}`}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                transition={heroTransition}
                className="grid grid-cols-[1fr_minmax(0,320px)] items-center gap-10"
              >
                <div className="relative aspect-square max-w-[440px]">
                  <div
                    aria-hidden="true"
                    className="ng-clip-lg absolute inset-0 -z-10 transition-colors duration-500"
                    style={{ backgroundColor: `color-mix(in srgb, ${active.color} 5%, #FCFBF8)` }}
                  />
                  <StoneVisual stone={active} priority={activeIndex === 0} />
                </div>

                <div className="flex flex-col gap-6">
                  <StoneStatement stone={active} />
                  <MetaRow stone={active} />
                  <Link
                    href={active.bracelet.href}
                    className="group ng-ui relative inline-flex w-fit items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-[#B8232F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8232F]/40"
                  >
                    Explore Collection
                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#B8232F] transition-transform duration-200 group-hover:scale-x-100 motion-reduce:transition-none" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ============ MOBILE / SMALL TABLET LAYOUT ============ */}
        <div className="lg:hidden">
          <div
            role="tablist"
            aria-orientation="horizontal"
            aria-label="Choose a stone"
            className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-4 pb-3 sm:-mx-6 sm:px-6"
          >
            {STONE_MATERIALS.map((stone, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={stone.id}
                  ref={(el) => {
                    mobileTabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`stone-tab-m-${stone.id}`}
                  aria-selected={isActive}
                  aria-controls="stone-panel-mobile"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectStone(i)}
                  onKeyDown={(e) => handleTabKeyDown(e, i, "horizontal", mobileTabRefs)}
                  className="ng-clip-sm flex shrink-0 snap-start flex-col items-start gap-1 border px-4 py-3 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/50"
                  style={{
                    borderColor: isActive ? stone.color : "rgba(28,16,36,0.1)",
                    backgroundColor: isActive ? `color-mix(in srgb, ${stone.color} 8%, #FCFBF8)` : "#FCFBF8",
                  }}
                >
                  <span className="ng-ui text-[10px] font-semibold tabular-nums text-[#1C1024]/45">{stone.index}</span>
                  <span className="ng-display text-[15px] italic leading-tight text-[#1C1024]">{stone.name}</span>
                </button>
              );
            })}
          </div>

          <div
            id="stone-panel-mobile"
            role="tabpanel"
            aria-labelledby={`stone-tab-m-${active.id}`}
            className="mt-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={heroTransition}
                className="flex flex-col gap-6"
              >
                <div className="relative mx-auto aspect-square w-full max-w-[320px]">
                  <div
                    aria-hidden="true"
                    className="ng-clip-lg absolute inset-0 -z-10 transition-colors duration-500"
                    style={{ backgroundColor: `color-mix(in srgb, ${active.color} 5%, #FCFBF8)` }}
                  />
                  <StoneVisual stone={active} />
                </div>

                <StoneStatement stone={active} />
                <MetaRow stone={active} />

                <Link
                  href={active.bracelet.href}
                  className="ng-clip-sm ng-ui flex w-full items-center justify-center gap-2 bg-[#1C1024] py-3.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/50"
                  style={{ backgroundColor: active.color }}
                >
                  Explore Collection
                  <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}