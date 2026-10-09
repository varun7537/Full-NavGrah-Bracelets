"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { BraceletProduct } from "../../data/Rashibracelets";
import { resolveCartProducts } from "../../lib/cartApi";
import { lineTotalFor } from "../../lib/pricing";

const CART_STORAGE_KEY = "navgrah:cart:v2";
const MAX_QTY_PER_LINE = 10;

export interface CartLine {
  product: BraceletProduct;
  quantity: number;
  lineTotal: number;
}

interface StoredCartLine {
  productId: string;
  quantity: number;
}

export interface CartContextValue {
  lines: CartLine[];
  missingCount: number;
  itemCount: number;
  subtotal: number;
  savings: number;
  isReady: boolean;
  loadError: boolean;
  refresh: () => void;

  addItem: (product: BraceletProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function isValidStoredLine(value: unknown): value is StoredCartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Partial<StoredCartLine>;
  return (
    typeof line.productId === "string" &&
    line.productId.trim().length > 0 &&
    typeof line.quantity === "number" &&
    Number.isFinite(line.quantity) &&
    line.quantity > 0
  );
}

function readCartFromStorage(): StoredCartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidStoredLine).map((line) => ({
      productId: line.productId,
      quantity: Math.min(MAX_QTY_PER_LINE, Math.max(1, Math.round(line.quantity))),
    }));
  } catch {
    return [];
  }
}

function saveCartToStorage(lines: StoredCartLine[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  } catch {
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [storedLines, setStoredLines] = useState<StoredCartLine[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [products, setProducts] = useState<Record<string, BraceletProduct>>({});
  const [missingIds, setMissingIds] = useState<string[]>([]);
  const [resolved, setResolved] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);

  // 1) localStorage sirf client par padho (hydration-safe)
  useEffect(() => {
    setStoredLines(readCartFromStorage());
    setStorageLoaded(true);
  }, []);

  // 2) Padhne ke baad hi save karo
  useEffect(() => {
    if (!storageLoaded) return;
    saveCartToStorage(storedLines);
  }, [storedLines, storageLoaded]);

  // 3) Dusre browser tabs ke saath sync
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return;
      setStoredLines(readCartFromStorage());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // 4) Cart me jo product ids hain unhe backend se resolve karo.
  //    Key sirf ids par based hai, quantity badalne par dobara fetch nahi hota.
  const idsKey = useMemo(
    () => Array.from(new Set(storedLines.map((l) => l.productId))).sort().join(","),
    [storedLines]
  );

  useEffect(() => {
    if (!storageLoaded) return;

    if (!idsKey) {
      setMissingIds([]);
      setLoadError(false);
      setResolved(true);
      return;
    }

    let cancelled = false;

    resolveCartProducts(idsKey.split(","))
      .then(({ products: found, missing }) => {
        if (cancelled) return;
        setProducts((prev) => {
          const next = { ...prev };
          for (const p of found) next[p.id] = p;
          for (const id of missing) delete next[id];
          return next;
        });
        setMissingIds(missing);
        setLoadError(false);
        setResolved(true);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError(true);
        setResolved(true);
      });

    return () => {
      cancelled = true;
    };
  }, [idsKey, storageLoaded, reloadTick]);

  const refresh = useCallback(() => setReloadTick((t) => t + 1), []);

  const addItem = useCallback((product: BraceletProduct, quantity = 1) => {
    const safeQuantity = Math.min(MAX_QTY_PER_LINE, Math.max(1, Math.round(quantity)));

    // Product turant cache me daalo taaki cart me instantly dikhe (backend baad me confirm karega)
    setProducts((prev) => ({ ...prev, [product.id]: product }));

    setStoredLines((previous) => {
      const existing = previous.find((line) => line.productId === product.id);
      if (!existing) {
        return [...previous, { productId: product.id, quantity: safeQuantity }];
      }
      return previous.map((line) =>
        line.productId !== product.id
          ? line
          : { ...line, quantity: Math.min(MAX_QTY_PER_LINE, line.quantity + safeQuantity) }
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setStoredLines((previous) => previous.filter((line) => line.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const safeQuantity = Math.round(quantity);

    if (safeQuantity <= 0) {
      setStoredLines((previous) => previous.filter((line) => line.productId !== productId));
      return;
    }

    setStoredLines((previous) =>
      previous.map((line) =>
        line.productId !== productId
          ? line
          : { ...line, quantity: Math.min(MAX_QTY_PER_LINE, safeQuantity) }
      )
    );
  }, []);

  const clear = useCallback(() => {
    setStoredLines([]);
  }, []);

  const { lines, missingCount } = useMemo(() => {
    const validLines: CartLine[] = [];
    let missing = 0;

    for (const storedLine of storedLines) {
      if (missingIds.includes(storedLine.productId)) {
        missing += 1;
        continue;
      }
      const product = products[storedLine.productId];
      if (!product) continue; // abhi load ho raha hai

      validLines.push({
        product,
        quantity: storedLine.quantity,
        lineTotal: lineTotalFor(product.price, product.packs, storedLine.quantity),
      });
    }

    return { lines: validLines, missingCount: missing };
  }, [storedLines, products, missingIds]);

  const itemCount = useMemo(() => lines.reduce((t, l) => t + l.quantity, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((t, l) => t + l.lineTotal, 0), [lines]);

    const savings = useMemo(
    () =>
      lines.reduce((total, line) => {
        const mrp = line.product.mrp ?? line.product.price;
        return total + Math.max(0, mrp * line.quantity - line.lineTotal);
      }, 0),
    [lines]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      missingCount,
      itemCount,
      subtotal,
      savings,
      isReady: storageLoaded && resolved,
      loadError,
      refresh,
      addItem,
      removeItem,
      setQuantity,
      clear,
    }),
    [
      lines,
      missingCount,
      itemCount,
      subtotal,
      savings,
      storageLoaded,
      resolved,
      loadError,
      refresh,
      addItem,
      removeItem,
      setQuantity,
      clear,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(
      "useCart() must be used inside the global <CartProvider>. " +
        "Wrap your application once in src/app/layout.tsx."
    );
  }
  return context;
}