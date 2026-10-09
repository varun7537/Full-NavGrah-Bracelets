// src/components/HowItWorks/ClosingCta.tsx
"use client";

import { motion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function ClosingCta() {
  return (
    <section className="border-t border-ink/10 bg-white px-6 py-20 text-center sm:py-24">
      <motion.div
        className="mx-auto flex max-w-xl flex-col items-center gap-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: easeOut }}
      >
        <p className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Ready to discover your personalised bracelet?
        </p>

        <motion.a
          href="#find-your-bracelet"
          whileHover={{ y: -3, boxShadow: "0 14px 28px -8px rgba(168,121,63,0.55)" }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className="inline-flex rounded-full bg-gradient-to-b from-[#C79A5B] to-[#A8793F] px-8 py-3.5 text-sm font-medium text-[#FBF7F0] shadow-[0_8px_20px_-6px_rgba(168,121,63,0.4)]"
        >
          Find My Bracelet
        </motion.a>
      </motion.div>
    </section>
  );
}