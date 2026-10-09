"use client";

import Link from "next/link";
import type { BraceletProduct, RashiBracelet } from "../../data/Rashibracelets";
import { useCart } from "../cart/CartContext";
import RashiBraceletsSection from "./Shop";

/**
 * Cart ko BraceletProduct chahiye. Yaha minimal object banta hai; cart khud backend se
 * asli price, stock aur pack pricing resolve kar leta hai (CartContext me /api/cart/resolve).
 */
function toCartProduct(p: RashiBracelet): BraceletProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.benefit,
    price: p.price,
    mrp: p.compareAtPrice,
    imageUrl: p.image,
    imageAlt: p.imageAlt,
    stone: p.gemstone,
    material: "",
    color: "",
    type: "",
    rashiId: p.rashiId,
    availability: p.inStock ? "In Stock" : "Out of Stock",
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    salesRank: 9999,
    createdOrder: 0,
  };
}

export default function RashiBraceletsContainer({
  products,
  limit,
  className,
}: {
  products: RashiBracelet[];
  limit?: number;
  className?: string;
}) {
  const { addItem } = useCart();

  return (
    <RashiBraceletsSection
      products={products}
      limit={limit}
      className={className}
      linkComponent={Link}
      productBasePath="/products/"
      viewAllHref="/collections"
      onAddToBag={(product) => addItem(toCartProduct(product), 1)}
    />
  );
}