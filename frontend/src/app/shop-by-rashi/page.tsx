// src/app/shop-by-rashi/page.tsx
import type { Metadata } from "next";

import Hero from "../../components/ShopByRashi/Hero";
import RashiIntro from "../../components/ShopByRashi/RashiIntro";
import ZodiacWheelSection from "../../components/ShopByRashi/ZodiacWheelSection";
// import ElementPhilosophy from "../../components/ShopByRashi/ElementPhilosophy";
import RashiGemstoneGrid from "../../components/ShopByRashi/RashiGemstoneGrid";
import FeaturedBracelets from "../../components/ShopByRashi/FeaturedBracelets";
import WhyChoose from "../../components/ShopByRashi/WhyChoose";
import HowItWorks from "../../components/ShopByRashi/HowItWorks";
import CTASection from "../../components/ShopByRashi/CTASection";
import FAQSection from "../../components/ShopByRashi/FAQSection";

export const metadata: Metadata = {
  title: "Rashi Gemstone Bracelets | Find Your Sign, Wear Your Stone",
  description:
    "Discover your Vedic rashi and the gemstone tied to its ruling planet, then shop bracelets crafted around that pairing.",
};

export default function RashiBraceletsPage() {
  return (
    <main className="bg-[#FBF8F3]">
      <Hero />
      <RashiIntro />
      <ZodiacWheelSection />
      {/* <ElementPhilosophy /> */}
      <RashiGemstoneGrid />
      <FeaturedBracelets />
      <WhyChoose />
      <HowItWorks />

      <CTASection
        id="find-your-bracelet"
        eyebrow="Not sure where to start"
        title="Find the bracelet made for your rashi"
        description="Tell us your birth date and we'll match you to your rashi, its gemstone, and the pieces we'd recommend."
        primaryLabel="Find My Bracelet"
        primaryHref="#find-your-rashi"
        secondaryLabel="Browse all bracelets"
        secondaryHref="#gemstone-collection"
      />

      <FAQSection />

      <CTASection
        id="final-cta"
        tone="charcoal"
        eyebrow="Rashi Gemstone Bracelets"
        title="Twelve signs. One gemstone story for each."
        description="However you found your way here, your rashi and its gemstone are waiting on the wheel above."
        primaryLabel="Find My Bracelet"
        primaryHref="#find-your-rashi"
      />

      <footer className="border-t border-[#221F1A]/10 bg-[#FBF8F3] px-6 py-10 text-center text-xs text-[#221F1A]/45">
        <p>&copy; {new Date().getFullYear()} Rashi Gemstone Bracelets. All rights reserved.</p>
      </footer>
    </main>
  );
}