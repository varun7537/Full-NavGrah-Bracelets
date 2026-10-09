"use client";

import type { BlogPost } from "../../data/Blog";
import type { RashiBracelet } from "../../data/Rashibracelets";

import Hero from "../Hero/Hero";
import Marquee from "../Marquee/Marquee";
import RashiBraceletsContainer from "../ShopByPlanets/RashiBraceletsContainer";
import KundliBracelets from "../ShopByPlanets/Kundlibracelets";
// import BestSelling from "../ShopByPlanets/BestSelling";
// import Lab from "../Lab/Lab";
// import AboutNavgrah from "../AboutUs/AboutNavGrah";
import Customers from "../CustomerReviews/Customers";
// import ContactUs from "../ContactUs/ContactUs";
import ShopByPurpose from "../ShopByPlanets/ShopByPurpose";
import BraceletCustomizer from "../ShopByPlanets/Braceletcustomizer";
import BlogSectionContainer from "../Blog/BlogSectionContainer";

export interface NavgrahBraceletsProps {
  /** Server (app/page.tsx) se aaye rashi bracelets */
  rashiBracelets: RashiBracelet[];
  /** Server (app/page.tsx) se aaye blog posts */
  posts: BlogPost[];
}

export default function NavgrahBracelets({
  rashiBracelets,
  posts,
}: NavgrahBraceletsProps) {
  return (
    <section aria-labelledby="navgrah-heading" className="bg-[#FBF7F1]">
      <div className="mx-auto flex max-w-container flex-col">
        <div className="flex flex-col">
          <Hero />

          <Marquee />

          <RashiBraceletsContainer products={rashiBracelets} />

          <KundliBracelets />

          <ShopByPurpose />

          {/* <BestSelling /> */}
          {/* <Lab /> */}
          {/* <AboutNavgrah /> */}

          <BraceletCustomizer />

          <BlogSectionContainer posts={posts} limit={3} />

          <Customers />

          {/* <ContactUs /> */}
        </div>
      </div>
    </section>
  );
}