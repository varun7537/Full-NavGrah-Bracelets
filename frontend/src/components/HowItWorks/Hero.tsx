// src/components/HowItWorks/Hero.tsx
"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 70]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FBF7F0] px-6 pb-20 pt-28 text-center sm:pb-24 sm:pt-32"
    >
      {/* Ambient glow — drifts gently and fades as the page scrolls past it */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(180,121,30,0.22) 0%, rgba(180,121,30,0) 70%)",
          y: glowY,
          opacity: glowOpacity,
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, 18, -12, 0], scale: [1, 1.05, 0.97, 1] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 14, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <motion.div
        className="relative mx-auto max-w-2xl"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={item} className="text-xs font-medium tracking-wide text-[#B4791E]">
          Navgrah Bracelets
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display mt-3 text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl"
        >
          How your bracelet comes together
        </motion.h1>

        <motion.p variants={item} className="mt-4 text-base leading-relaxed text-ink/70 sm:text-lg">
          From your birth details to your rashi to the gemstones on your wrist — here is
          the process behind every Navgrah bracelet.
        </motion.p>
      </motion.div>
    </section>
  );
}