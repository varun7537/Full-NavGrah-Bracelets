// src/components/Customized/BraceletCustomizer.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type BraceletCustomizerProps = {
  /** Where the button sends the visitor. Defaults to the Customized Bracelets page. */
  ctaHref?: string;
  onCtaClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2c.6 3.6 1.9 4.9 5.5 5.5-3.6.6-4.9 1.9-5.5 5.5-.6-3.6-1.9-4.9-5.5-5.5C10.1 6.9 11.4 5.6 12 2Z" />
      <path d="M19 14c.3 1.8.9 2.4 2.7 2.7-1.8.3-2.4.9-2.7 2.7-.3-1.8-.9-2.4-2.7-2.7 1.8-.3 2.4-.9 2.7-2.7Z" />
    </svg>
  );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function BraceletCustomizer({
  ctaHref = "/customized",
  onCtaClick,
}: BraceletCustomizerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="customized-bracelet-journey"
      className="cbj-section relative overflow-hidden bg-[#FCFBF8] py-20 sm:py-24"
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,500;0,600;1,500;1,600&family=Manrope:wght@400;500;600;700&display=swap");
        .ng-display {
          font-family: "Newsreader", serif;
        }
        .ng-ui {
          font-family: "Manrope", sans-serif;
        }
      `}</style>

      <style jsx>{`
        .cbj-section {
          background-image: radial-gradient(circle at 10% 12%, rgba(184, 35, 47, 0.06), transparent 42%),
            radial-gradient(circle at 92% 88%, rgba(226, 113, 29, 0.08), transparent 45%);
        }

        @keyframes cbj-fade-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cbj-shimmer {
          from {
            transform: translateX(-120%);
          }
          to {
            transform: translateX(120%);
          }
        }

        .cbj-reveal {
          opacity: 0;
          transform: translateY(16px);
        }
        .cbj-reveal.cbj-visible {
          animation: cbj-fade-up 650ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .cbj-frame {
          position: relative;
          border: 1px solid rgba(28, 16, 36, 0.08);
          box-shadow: 0 30px 70px -40px rgba(28, 16, 36, 0.28);
        }

        .cbj-badge {
          border: 1px solid rgba(184, 35, 47, 0.22);
          background: rgba(184, 35, 47, 0.06);
        }

        .cbj-cta {
          position: relative;
          overflow: hidden;
          background-image: linear-gradient(135deg, #e2711d, #b8232f);
          transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 220ms ease, background-position 220ms ease;
          background-size: 140% 140%;
          background-position: 0% 50%;
        }
        .cbj-cta:hover {
          background-position: 100% 50%;
          box-shadow: 0 18px 34px -16px rgba(184, 35, 47, 0.55);
          transform: translateY(-2px);
        }
        .cbj-cta:active {
          transform: translateY(0) scale(0.97);
          box-shadow: 0 8px 18px -10px rgba(184, 35, 47, 0.5);
        }
        .cbj-cta .cbj-arrow {
          transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cbj-cta:hover .cbj-arrow {
          transform: translateX(4px);
        }
        .cbj-cta::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 30%,
            rgba(255, 255, 255, 0.35) 48%,
            transparent 68%
          );
          transform: translateX(-120%);
          pointer-events: none;
        }
        .cbj-cta:hover::after {
          animation: cbj-shimmer 900ms ease forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .cbj-reveal {
            opacity: 1;
            transform: none;
            animation: none !important;
          }
          .cbj-cta {
            transition: background-color 150ms ease;
          }
          .cbj-cta:hover,
          .cbj-cta:active {
            transform: none;
          }
          .cbj-cta:hover::after {
            animation: none !important;
          }
        }
      `}</style>

      <div className="relative mx-auto max-w-container px-6 sm:px-8 lg:px-10">
        <div
          className={`cbj-reveal cbj-frame mx-auto max-w-2xl rounded-[28px] bg-white px-8 py-12 text-center sm:px-14 sm:py-16 ${
            isVisible ? "cbj-visible" : ""
          }`}
        >
          <span className="cbj-badge ng-ui inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#B8232F]">
            <SparkleIcon className="h-3 w-3" />
            Made just for you
          </span>

          <h2 className="ng-display mt-4 text-[30px] italic leading-[1.15] text-[#1C1024] sm:text-[38px]">
            Get your customized kundli-based bracelet
          </h2>

          <p className="ng-ui mx-auto mt-4 max-w-[44ch] text-[15px] leading-relaxed text-[#1C1024]/60">
            Share your birth details and let our astrology experts recommend a bracelet made
            for your kundli.
          </p>

          <a
            href={ctaHref}
            onClick={onCtaClick}
            className="cbj-cta ng-ui mt-9 inline-flex items-center justify-center gap-2 rounded-full px-9 py-3.5 text-[14.5px] font-semibold text-[#FCFBF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Click Here
            <ArrowIcon className="cbj-arrow h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}