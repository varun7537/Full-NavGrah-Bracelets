"use client";

import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { motion, useInView, type Variants } from "framer-motion";

import {
  CalendarIcon,
  ChartIcon,
  GemIcon,
  StarIcon,
} from "../Header/icons";
import { ELEMENT_COLORS } from "../../data/rashis";
import RashiWheel from "./RashiWheel";

type IconComponent = (props: {
  className?: string;
  style?: CSSProperties;
}) => ReactNode;

interface Step {
  icon: IconComponent;
  color: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: CalendarIcon,
    color: ELEMENT_COLORS.Fire,
    title: "Share Your Birth Details",
    description:
      "Enter your date of birth, exact time, and place of birth so your birth chart can be analysed.",
  },
  {
    icon: ChartIcon,
    color: ELEMENT_COLORS.Air,
    title: "Your Rashi Is Identified",
    description:
      "Our astrology-based process reads your birth chart to determine your rashi and the areas that need attention.",
  },
  {
    icon: GemIcon,
    color: ELEMENT_COLORS.Earth,
    title: "Your Bracelet Is Crafted",
    description:
      "Based on your rashi, the appropriate gemstones are selected and arranged into your personalised bracelet.",
  },
  {
    icon: StarIcon,
    color: ELEMENT_COLORS.Water,
    title: "Wear It With Intention",
    description:
      "Receive your bracelet and wear it as part of your personal spiritual and astrological practice.",
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.05,
    },
  },
};

const rowVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

interface NavgrahIntroProps {
  className?: string;
  showCta?: boolean;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export default function NavgrahIntro({
  className = "",
  showCta = false,
  ctaHref = "#find-your-bracelet",
  onCtaClick,
}: NavgrahIntroProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);

  const inView = useInView(gridRef, {
    once: true,
    amount: 0.2,
  });

  return (
    <section
      aria-labelledby="how-it-works"
      className={`relative overflow-hidden bg-white px-6 py-24 sm:py-28 ${className}`}
    >
      {/* Soft corner accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(180,121,30,0.08),transparent_70%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(180,121,30,0.06),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          className="mx-auto flex max-w-[560px] flex-col items-center gap-3 text-center"
          initial={{
            opacity: 0,
            y: 12,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.6,
          }}
          transition={{
            duration: 0.5,
            ease: easeOut,
          }}
        >
          <span className="rounded-full border border-[#B4791E]/25 bg-[#B4791E]/[0.06] px-3 py-1 text-xs font-medium tracking-wide text-[#B4791E]">
            The Process
          </span>

          <h2
            id="how-it-works"
            className="font-display text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl"
          >
            How It Works
          </h2>

          <p className="max-w-[42ch] text-ink/70">
            Your personalised bracelet, guided by your rashi.
          </p>
        </motion.div>

        <div
          ref={gridRef}
          className="mt-16 grid gap-14 sm:mt-20 lg:grid-cols-[340px_1fr] lg:items-center lg:gap-20"
        >
          <motion.div
            className="mx-auto w-full max-w-[280px] lg:mx-0 lg:max-w-none"
            initial={{
              opacity: 0,
              scale: 0.92,
            }}
            animate={
              inView
                ? {
                    opacity: 1,
                    scale: 1,
                  }
                : {}
            }
            transition={{
              duration: 0.6,
              ease: easeOut,
            }}
          >
            <RashiWheel inView={inView} />

            <motion.p
              className="mt-4 text-center text-xs text-ink/50 lg:text-left"
              initial={{
                opacity: 0,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                    }
                  : {}
              }
              transition={{
                duration: 0.5,
                delay: 0.4,
              }}
            >
              The rashi wheel — hover or tab through it to meet each sign.
            </motion.p>
          </motion.div>

          <motion.ol
            className="relative flex flex-col"
            variants={listVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {/* Connecting spine */}
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-[21px] top-6 hidden w-px bg-gradient-to-b from-ink/15 via-ink/10 to-transparent sm:block"
            />

            {STEPS.map((step, index) => (
              <StepRow
                key={step.title}
                step={step}
                index={index}
                isLast={index === STEPS.length - 1}
              />
            ))}
          </motion.ol>
        </div>

        {showCta && (
          <motion.div
            className="mt-20 flex flex-col items-center gap-6 text-center sm:mt-24"
            initial={{
              opacity: 0,
              y: 12,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.6,
            }}
            transition={{
              duration: 0.5,
              ease: easeOut,
            }}
          >
            <p className="text-lg text-ink">
              Ready to discover your personalised bracelet?
            </p>

            <motion.a
              href={ctaHref}
              onClick={onCtaClick}
              whileHover={{
                y: -3,
              }}
              whileTap={{
                scale: 0.96,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-[#C79A5B] to-[#A8793F] px-8 py-3.5 text-sm font-medium text-[#FBF7F0] shadow-[0_8px_20px_-6px_rgba(168,121,63,0.4)]"
            >
              Find My Bracelet
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function StepRow({
  step,
  index,
  isLast,
}: {
  step: Step;
  index: number;
  isLast: boolean;
}) {
  const Icon = step.icon;

  return (
    <motion.li
      className={`relative flex gap-5 py-6 first:pt-0 ${
        isLast
          ? "pb-0"
          : "border-b border-ink/10 sm:border-none"
      }`}
      variants={rowVariants}
    >
      <motion.span
        className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] bg-white"
        style={{
          borderColor: step.color,
          backgroundColor: `${step.color}0d`,
        }}
        whileHover={{
          scale: 1.08,
          rotate: 3,
        }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 16,
        }}
      >
        <Icon
          className="h-5 w-5"
          style={{
            color: step.color,
          }}
        />

        <span
          aria-hidden="true"
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-medium shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
          style={{
            color: step.color,
            border: `1px solid ${step.color}55`,
          }}
        >
          {index + 1}
        </span>
      </motion.span>

      <div>
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          {step.title}
        </h3>

        <p className="mt-1 max-w-[38ch] text-sm leading-relaxed text-ink/70">
          {step.description}
        </p>
      </div>
    </motion.li>
  );
}
