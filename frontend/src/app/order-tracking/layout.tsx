import Footer from "@/src/components/Footer";
import PromoBar from "@/src/components/Header/PromoBar";
import Navbar from "@/src/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Tracking | Navgrah Bracelets",
  description:
    "Track your Navgrah Bracelets order and view delivery progress, shipment details, items, and support information.",
};

export default function OrderTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>
  <PromoBar />
  <Navbar />
  {children}
  <Footer />
  </>;
}
