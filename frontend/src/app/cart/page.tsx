// src/app/cart/page.tsx

"use client";

import { useRouter } from "next/navigation";
import CartPage from "../../components/cart/CartPage";
import PromoBar from "@/src/components/Header/PromoBar";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

export default function CartRoute() {
  const router = useRouter();

  return (
    <>
    <PromoBar />
    <Navbar />
    <CartPage
      onCheckout={() => {
        router.push("/checkout");
      }}
      onContinueShopping={() => {
        router.push("/collections");
      }}
    />
    <Footer />
    </>
  );
}
