import type { Metadata } from "next";

import Hero from "../../components/HowItWorks/Hero";
import NavgrahIntro from "../../components/HowItWorks/NavgrahIntro";
import RashiShowcase from "../../components/HowItWorks/RashiShowcase";
import ClosingCta from "../../components/HowItWorks/ClosingCta";

export const metadata: Metadata = {
  title: "How It Works | Navgrah Bracelets",
  description:
    "See how your birth details become a personalised gemstone bracelet — from your rashi to the stones chosen for you.",
};

export default function HowItWorksPage() {
  return (
    <main className="bg-white">
      <Hero />
      <NavgrahIntro />
      <RashiShowcase />
      <ClosingCta />
    </main>
  );
}
