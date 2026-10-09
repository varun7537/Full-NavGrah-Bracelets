// src/app/layout.tsx

import type { Metadata, Viewport } from "next";
import "../globals.css"; // keep whatever your global stylesheet path is
import PromoBar from "../../components/Header/PromoBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Astrology bracelets",
    template: "%s · Astrology bracelets",
  },
  description: "Gemstone bracelets chosen for your kundli.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf8f4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex min-h-screen flex-col bg-[#faf8f4] text-[#241c16] antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#211b17] focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>

        <PromoBar />
        <Navbar />

        <div id="main" className="flex-1">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}