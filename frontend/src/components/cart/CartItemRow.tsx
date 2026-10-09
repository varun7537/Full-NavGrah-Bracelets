"use client";

import { CartLine } from "./CartContext";
import { formatINR } from "../../lib/Currency";
import { rashiById } from "../../data/Rashibracelets";
import RashiAvatar from "../Collections/RashiAvatar";
import { MinusIcon, PlusIcon, TrashIcon } from "../NavgrahBracelets/Icons";

export interface CartItemRowProps {
  line: CartLine;
  onSetQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItemRow({ line, onSetQuantity, onRemove }: CartItemRowProps) {
  const { product, quantity, lineTotal } = line;
  const rashi = rashiById(product.rashiId);
  const outOfStock = product.availability === "Out of Stock";

  return (
    <div className="flex gap-3 border-b border-[#efe8dc] py-4 last:border-b-0 sm:gap-4 sm:py-5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f5eee5] sm:h-24 sm:w-24">
        <img src={product.imageUrl} alt={product.imageAlt || product.name} className="h-full w-full object-cover" />
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75">
            <span className="rounded-full bg-[#241c16] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {rashi && (
              <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-[#a47735] sm:text-[11px]">
                <RashiAvatar rashi={rashi} size={14} />
                {rashi.name}
              </p>
            )}
            <h4 className="truncate text-sm font-semibold text-[#241c16] sm:text-[15px]">{product.name}</h4>
            <p className="text-[11px] text-[#6d6259] sm:text-xs">
              {product.stone} · {product.material}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(product.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#a89d8f] transition hover:bg-[#f5eee5] hover:text-[#8c6327]"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex items-center rounded-full border border-[#e7dfd5]">
            <button
              type="button"
              onClick={() => onSetQuantity(product.id, quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center text-[#241c16] transition hover:text-[#a47735] disabled:cursor-not-allowed disabled:text-[#e7dfd5] sm:h-9 sm:w-9"
            >
              <MinusIcon className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-medium text-[#241c16] sm:w-7">{quantity}</span>
            <button
              type="button"
              onClick={() => onSetQuantity(product.id, quantity + 1)}
              disabled={quantity >= 10}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center text-[#241c16] transition hover:text-[#a47735] disabled:cursor-not-allowed disabled:text-[#e7dfd5] sm:h-9 sm:w-9"
            >
              <PlusIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-[#241c16] sm:text-base">{formatINR(lineTotal)}</p>
            {quantity > 1 && <p className="text-[11px] text-[#a89d8f]">{formatINR(product.price)} each</p>}
          </div>
        </div>
      </div>
    </div>
  );
}