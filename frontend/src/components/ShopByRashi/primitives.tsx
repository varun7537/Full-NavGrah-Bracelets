// src/components/RashiBracelets/primitives.tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const handleChange = (event: MediaQueryListEvent) => setReduced(event.matches);

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
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
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/* Reveal — scroll-triggered fade/slide wrapper                       */
/* ------------------------------------------------------------------ */

interface RevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  as?: ElementType;
}

/** Fades and slides its children up once they scroll into view. A single,
 *  consistent motion primitive rather than a different animation per section. */
export function Reveal({ children, delayMs = 0, className = "", as = "div" }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reducedMotion = usePrefersReducedMotion();
  const As = as as ElementType;

  if (reducedMotion) {
    return <As className={className}>{children}</As>;
  }

  return (
    <As
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delayMs}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delayMs}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </As>
  );
}

/* ------------------------------------------------------------------ */
/* Typography atoms                                                    */
/* ------------------------------------------------------------------ */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.8rem] font-medium tracking-[0.02em] text-[#B8863E]">
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#B8863E]" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  id?: string;
}) {
  const isCentered = align === "center";

  return (
    <div
      className={`flex max-w-[640px] flex-col gap-3 ${
        isCentered ? "mx-auto items-center text-center" : "items-start text-left"
      }`}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}

      <h2
        id={id}
        className="font-display text-3xl font-semibold leading-[1.15] text-[#221F1A] sm:text-4xl"
      >
        {title}
      </h2>

      {description ? (
        <p className="max-w-[52ch] text-[#221F1A]/60">{description}</p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ComponentPropsWithoutRef<"a"> {
  variant?: ButtonVariant;
  showArrow?: boolean;
}

export function Button({
  variant = "primary",
  showArrow = false,
  className = "",
  children,
  ...anchorProps
}: ButtonProps) {
  const base =
    "group inline-flex items-center justify-center gap-1.5 rounded-full px-8 py-3.5 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-b from-[#C79A5B] to-[#A8793F] text-[#FBF7F0] shadow-[0_8px_20px_-6px_rgba(168,121,63,0.4)] hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-6px_rgba(168,121,63,0.5)] focus-visible:outline-[#A8793F]",
    secondary:
      "border border-[#221F1A]/15 bg-white/70 text-[#221F1A] hover:-translate-y-0.5 hover:border-[#B8863E]/50 hover:bg-white focus-visible:outline-[#221F1A]",
    ghost:
      "text-[#221F1A]/70 underline decoration-[#221F1A]/25 underline-offset-4 hover:text-[#221F1A] hover:decoration-[#221F1A] focus-visible:outline-[#221F1A]",
  };

  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...anchorProps}>
      {children}
      {showArrow ? (
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          &rarr;
        </span>
      ) : null}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Decorative marks                                                    */
/* ------------------------------------------------------------------ */

export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#B8863E]/50" />
      <span className="h-1.5 w-1.5 rotate-45 bg-[#B8863E]/70" />
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#B8863E]/50" />
    </div>
  );
}

/** Soft radial glow used behind hero/CTA visuals — pure decoration. */
export function GlowOrb({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{
        background:
          "radial-gradient(circle, rgba(199,154,91,0.35) 0%, rgba(199,154,91,0) 70%)",
      }}
    />
  );
}

/** A handful of small, fixed-position dots standing in for a starfield. */
export function CelestialDots({ className = "" }: { className?: string }) {
  const dots = [
    { x: 40, y: 60, r: 2.5, o: 0.5 },
    { x: 120, y: 30, r: 1.6, o: 0.35 },
    { x: 520, y: 90, r: 2, o: 0.4 },
    { x: 560, y: 220, r: 1.6, o: 0.3 },
    { x: 90, y: 300, r: 2.2, o: 0.45 },
    { x: 300, y: 20, r: 1.4, o: 0.3 },
    { x: 480, y: 380, r: 2, o: 0.35 },
    { x: 200, y: 420, r: 1.8, o: 0.3 },
  ];

  return (
    <svg aria-hidden="true" viewBox="0 0 600 450" className={className}>
      {dots.map((dot, index) => (
        <circle
          key={index}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill="#B8863E"
          opacity={dot.o}
        />
      ))}
    </svg>
  );
}