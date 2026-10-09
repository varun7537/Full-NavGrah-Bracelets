"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BraceletProduct } from "../../data/Rashibracelets";
import type { ProductFilterOptions } from "../../lib/productApi";
import { useCart } from "../cart/CartContext";
import BraceletsCollectionClient from "./Braceletscollectionclient";
import NotifyMeModal from "./NotifyMeModal";

export interface BraceletsCollectionContainerProps {
  products: BraceletProduct[];
  filterOptions: ProductFilterOptions;
  initialRashiIds?: string[];
}

export default function BraceletsCollectionContainer({
  products,
  filterOptions,
  initialRashiIds = [],
}: BraceletsCollectionContainerProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [notifyTarget, setNotifyTarget] = useState<BraceletProduct | null>(null);

  return (
    <>
      <BraceletsCollectionClient
        products={products}
        filterOptions={filterOptions}
        initialRashiIds={initialRashiIds}
        onAddToCart={(product) => addItem(product, 1)}
        onViewDetails={(product) => router.push(`/products/${product.id}`)}
        onNotifyMe={setNotifyTarget}
      />
      {notifyTarget && <NotifyMeModal product={notifyTarget} onClose={() => setNotifyTarget(null)} />}
    </>
  );
}