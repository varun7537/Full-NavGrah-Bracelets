"use client";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";
import { useCart } from "./CartContext";
import CartItemRow from "./CartItemRow";
import OrderSummary from "./OrderSummary";
import { useAuth } from "../Auth/AuthContext";
import { ArrowLeftIcon, BagIcon } from "../NavgrahBracelets/Icons";

export interface CartPageProps {
  onCheckout?: () => void;
  onContinueShopping?: () => void;
}

export default function CartPage({ onCheckout, onContinueShopping }: CartPageProps) {
  const { lines, missingCount, itemCount, subtotal, savings, isReady, setQuantity, removeItem } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const inStockCount = lines.filter((l) => l.product.availability !== "Out of Stock").length;
  const hasOutOfStock = lines.some((l) => l.product.availability === "Out of Stock");
  const canCheckout = inStockCount > 0;

  const { requireLogin } = useAuth();

  const handleCheckout = () =>
    requireLogin("Please login first to continue with your purchase.", () => setCheckoutOpen(true));
  if (!isReady) {
    return <div className="mx-auto max-w-5xl px-3 py-10 sm:px-6" aria-hidden="true" />;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5eee5] text-[#a47735]">
          <BagIcon className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-lg font-semibold text-[#241c16]">Your cart is empty</h1>
        <p className="mt-2 text-sm text-[#6d6259]">
          Find a bracelet aligned with your rashi and add it here.
        </p>
        <button
          type="button"
          onClick={onContinueShopping}
          className="mt-6 min-h-[44px] rounded-full bg-[#211b17] px-8 text-sm font-semibold text-white transition hover:bg-[#332822]"
        >
          Browse Bracelets
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-3 pb-28 pt-4 sm:px-6 sm:py-10 lg:pb-10">
      <button
        type="button"
        onClick={onContinueShopping}
        className="mb-3 flex items-center gap-1.5 text-sm font-medium text-[#6d6259] transition hover:text-[#241c16] sm:mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Continue Shopping
      </button>

      <h1 className="text-xl font-semibold text-[#241c16] sm:text-2xl">
        Shopping Cart <span className="font-normal text-[#a89d8f]">({itemCount})</span>
      </h1>

      {missingCount > 0 && (
        <p className="mt-3 rounded-xl bg-[#faf3e7] px-4 py-2.5 text-xs text-[#8c6327]">
          {missingCount} {missingCount === 1 ? "item" : "items"} in your cart {missingCount === 1 ? "is" : "are"} no
          longer available and {missingCount === 1 ? "has" : "have"} been hidden.
        </p>
      )}
      {hasOutOfStock && (
        <p className="mt-3 rounded-xl bg-[#fdf2f0] px-4 py-2.5 text-xs text-[#a3462f]">
          Some items in your cart are out of stock. Remove them or move on with the rest.
        </p>
      )}

      <div className="mt-4 grid gap-6 sm:mt-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-[#e7dfd5] bg-white px-4 sm:px-5">
          {lines.map((line) => (
            <CartItemRow key={line.product.id} line={line} onSetQuantity={setQuantity} onRemove={removeItem} />
          ))}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6">
            <OrderSummary
              itemCount={itemCount}
              subtotal={subtotal}
              savings={savings}
              onCheckout={handleCheckout}
              checkoutDisabled={!canCheckout}
            />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <OrderSummary
          variant="bar"
          itemCount={itemCount}
          subtotal={subtotal}
          savings={savings}
          onCheckout={handleCheckout}
          checkoutDisabled={!canCheckout}
        />
      </div>
      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </div>
  );
}