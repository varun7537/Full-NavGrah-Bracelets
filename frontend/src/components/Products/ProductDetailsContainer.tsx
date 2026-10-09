"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ProductDetail } from "../../data/ProductDetail";
import { useCart } from "../cart/CartContext";
import ProductDetails from "./ProductDetails";

export default function ProductDetailsContainer({ detail }: { detail: ProductDetail }) {
  const router = useRouter();
  const { addItem } = useCart();

  // Cart page pehle se load, taaki "Buy now" par turant khule
  useEffect(() => {
    router.prefetch("/cart");
  }, [router]);

  return (
    <ProductDetails
      detail={detail}
      onAddToCart={(quantity) => addItem(detail.product, quantity)}
      onBuyNow={(quantity) => {
        addItem(detail.product, quantity);
        router.push("/cart"); // login checkout par maanga jata hai
      }}
      onOpenProduct={(id) => router.push(`/bracelets/${id}`)}
    />
  );
}