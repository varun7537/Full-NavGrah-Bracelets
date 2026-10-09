"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import RashiSelector from "./Rashiselector";
import FiltersPanel, { FilterState } from "./Filterspanel";
import SortMenu, { SortKey } from "./Sortmenu";
import ProductCard from "./Productcard";
import { BagIcon, CloseIcon } from "./icons";
import { BraceletProduct, RASHIS, rashiById } from "../../data/Rashibracelets";
import type { ProductFilterOptions } from "../../lib/productApi";

const WISHLIST_STORAGE_KEY = "bracelets-collection:wishlist";
const PAGE_SIZE = 12;
const TOAST_DURATION_MS = 2200;

function makeInitialFilters(priceMin: number, priceMax: number, rashiIds: string[] = []): FilterState {
  return {
    rashiIds,
    types: [],
    stones: [],
    materials: [],
    colors: [],
    priceMin,
    priceMax,
    inStockOnly: false,
    minRating: 0,
  };
}

interface ToastState {
  id: number;
  message: string;
}

export interface BraceletsCollectionClientProps {
  products: BraceletProduct[];
  filterOptions: ProductFilterOptions;
  initialRashiIds?: string[];
  onAddToCart?: (product: BraceletProduct) => void;
  onViewDetails?: (product: BraceletProduct) => void;
  onNotifyMe?: (product: BraceletProduct) => void;
}

export default function BraceletsCollectionClient({
  products,
  filterOptions,
  initialRashiIds = [],
  onAddToCart,
  onViewDetails,
  onNotifyMe,
}: BraceletsCollectionClientProps) {
  const { types, stones, materials, colors, priceBounds } = filterOptions;
  const [floor, ceiling] = priceBounds;

  const [filters, setFilters] = useState<FilterState>(() => makeInitialFilters(floor, ceiling, initialRashiIds));
  const [sort, setSort] = useState<SortKey>("recommended");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());
  const [wishlistReady, setWishlistReady] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const toastSeq = useRef(0);

  const showToast = useCallback((message: string) => {
    toastSeq.current += 1;
    setToast({ id: toastSeq.current, message });
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setWishlist(new Set(parsed.filter((v): v is string => typeof v === "string")));
        }
      }
    } catch {
      // ignore
    }
    setWishlistReady(true);
  }, []);

  useEffect(() => {
    if (!wishlistReady) return;
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(Array.from(wishlist)));
    } catch {
      // ignore
    }
  }, [wishlist, wishlistReady]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters, sort]);

  useEffect(() => {
    if (!isFilterDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFilterDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    const mq = window.matchMedia("(min-width: 1024px)");
    const onMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsFilterDrawerOpen(false);
    };
    mq.addEventListener("change", onMediaChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onMediaChange);
    };
  }, [isFilterDrawerOpen]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.rashiIds.length > 0 && !filters.rashiIds.includes(p.rashiId)) return false;
      if (filters.types.length > 0 && !filters.types.includes(p.type)) return false;
      if (filters.stones.length > 0 && !filters.stones.includes(p.stone)) return false;
      if (filters.materials.length > 0 && !filters.materials.includes(p.material)) return false;
      if (filters.colors.length > 0 && !filters.colors.includes(p.color)) return false;
      if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
      if (filters.inStockOnly && p.availability === "Out of Stock") return false;
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;
      return true;
    });
  }, [products, filters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sort) {
      case "new":
        return list.sort((a, b) => a.createdOrder - b.createdOrder);
      case "bestselling":
        return list.sort((a, b) => a.salesRank - b.salesRank);
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      default:
        return list.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.rating - a.rating);
    }
  }, [filtered, sort]);

  const visibleProducts = sorted.slice(0, visibleCount);
  const activeFilterCount =
    filters.rashiIds.length +
    filters.types.length +
    filters.stones.length +
    filters.materials.length +
    filters.colors.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceMin !== floor || filters.priceMax !== ceiling ? 1 : 0);

  const toggleWishlist = (id: string) => {
    const adding = !wishlist.has(id);
    setWishlist((prev) => {
      const next = new Set(prev);
      if (adding) next.add(id);
      else next.delete(id);
      return next;
    });
    showToast(adding ? "Added to wishlist" : "Removed from wishlist");
  };

  const handleAddToCart = (product: BraceletProduct) => {
    setCartCount((c) => c + 1);
    showToast(`${product.name} added to cart`);
    onAddToCart?.(product);
  };

  const handleNotifyMe = (product: BraceletProduct) => {
    if (onNotifyMe) {
      onNotifyMe(product); // parent modal kholta hai
    } else {
      showToast(`We'll notify you when ${product.name} is back in stock`);
    }
  };

  const handleViewDetails = (product: BraceletProduct) => {
    onViewDetails?.(product);
  };

  const toggleRashi = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      rashiIds: prev.rashiIds.includes(id) ? prev.rashiIds.filter((r) => r !== id) : [...prev.rashiIds, id],
    }));
  };

  const resetFilters = () => setFilters(makeInitialFilters(floor, ceiling));

  const filterPanelProps = {
    rashis: RASHIS,
    types,
    stones,
    materials,
    colors,
    priceBounds,
    value: filters,
    onChange: setFilters,
    onReset: resetFilters,
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <RashiSelector
        rashis={RASHIS}
        selectedIds={filters.rashiIds}
        onToggle={toggleRashi}
        onClear={() => setFilters((prev) => ({ ...prev, rashiIds: [] }))}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-6 rounded-2xl border border-[#e7dfd5] bg-white p-5">
            <FiltersPanel {...filterPanelProps} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-1 text-sm text-[#6d6259]">
              <span className="font-semibold text-[#241c16]">{sorted.length}</span>{" "}
              {sorted.length === 1 ? "bracelet" : "bracelets"} found
              {cartCount > 0 && (
                <span className="ml-3 inline-flex items-center gap-1 text-xs font-medium text-[#a47735]">
                  <BagIcon className="h-3.5 w-3.5" /> {cartCount} in cart
                </span>
              )}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex items-center gap-2 rounded-full border border-[#e7dfd5] px-4 py-2.5 text-sm font-medium text-[#241c16] lg:hidden"
              >
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#a47735] text-[11px] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <SortMenu value={sort} onChange={setSort} />
            </div>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  rashi={rashiById(product.rashiId)}
                  isWishlisted={wishlist.has(product.id)}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={handleAddToCart}
                  onNotifyMe={handleNotifyMe}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#e7dfd5] bg-white px-6 py-16 text-center">
              <p className="text-lg font-semibold text-[#241c16]">
                {products.length === 0 ? "No bracelets available right now" : "No bracelets match those filters"}
              </p>
              <p className="mt-2 text-sm text-[#6d6259]">
                {products.length === 0
                  ? "Please check back soon."
                  : "Try widening your price range or clearing a filter."}
              </p>
              {products.length > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-full bg-[#211b17] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332822]"
                >
                  Reset filters
                </button>
              )}
            </div>
          )}

          {visibleCount < sorted.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="rounded-full border border-[#e7dfd5] px-8 py-3 text-sm font-semibold text-[#241c16] transition hover:border-[#a47735] hover:text-[#8c6327]"
              >
                Load more bracelets
              </button>
            </div>
          )}
        </div>
      </div>

      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setIsFilterDrawerOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e7dfd5] p-5">
              <h3 className="text-base font-semibold text-[#241c16]">Filters</h3>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#6d6259] transition hover:bg-[#f5eee5] hover:text-[#241c16]"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FiltersPanel {...filterPanelProps} />
            </div>
            <div className="border-t border-[#e7dfd5] p-5">
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full rounded-full bg-[#211b17] px-6 py-3 text-sm font-semibold text-white"
              >
                Show {sorted.length} results
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
      >
        {toast && (
          <div key={toast.id} className="rounded-full bg-[#211b17] px-5 py-2.5 text-sm font-medium text-white shadow-lg">
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}