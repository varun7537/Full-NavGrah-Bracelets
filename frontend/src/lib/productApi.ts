import type {
  BraceletProduct,
  RashiBracelet,
} from "../data/Rashibracelets";

import type {
  DeliveryResult,
  ProductDetail,
} from "../data/ProductDetail";

// const API =
//   process.env.NEXT_PUBLIC_API_URL ||
//   "http://localhost:5000/api";
const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://navgrah-bracelets-api.vercel.app";

export interface ProductFilterOptions {
  types: string[];
  stones: string[];
  materials: string[];
  colors: string[];
  priceBounds: [number, number];
}

export interface ProductsResponse {
  products: BraceletProduct[];
  filters: ProductFilterOptions;
}

const EMPTY_FILTERS: ProductFilterOptions = {
  types: [],
  stones: [],
  materials: [],
  colors: [],
  priceBounds: [0, 5000],
};

export async function fetchProducts(): Promise<ProductsResponse> {
  const response = await fetch(`${API}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Products API failed: ${response.status}`);
  }

  const data = await response.json();

  return {
    products: Array.isArray(data.products) ? data.products : [],
    filters: data.filters ?? EMPTY_FILTERS,
  };
}

export async function fetchProductDetail(
  slug: string
): Promise<ProductDetail | null> {
  const response = await fetch(
    `${API}/products/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Product API failed: ${response.status}`);
  }

  return response.json();
}

export async function requestStockNotification(
  productId: string,
  email: string
): Promise<void> {
  const response = await fetch(
    `${API}/products/${encodeURIComponent(productId)}/notify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.message || "Something went wrong"
    );
  }
}

export async function checkDelivery(
  pincode: string
): Promise<DeliveryResult> {
  const response = await fetch(
    `${API}/delivery/check?pincode=${encodeURIComponent(pincode)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok && response.status !== 400) {
    throw new Error("Delivery check failed");
  }

  return response.json();
}

export async function submitReview(
  productId: string,
  review: {
    name: string;
    rating: number;
    text: string;
  }
): Promise<string> {
  const response = await fetch(
    `${API}/products/${encodeURIComponent(productId)}/reviews`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Could not submit review"
    );
  }

  return data.message as string;
}

export async function fetchFeaturedRashiBracelets(
  limit = 8
): Promise<RashiBracelet[]> {
  const response = await fetch(
    `${API}/products/featured?limit=${limit}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Featured products API failed: ${response.status}`
    );
  }

  const data = await response.json();

  return Array.isArray(data.products)
    ? data.products
    : [];
}
