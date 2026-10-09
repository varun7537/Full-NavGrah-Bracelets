import type { PaymentStatus, StageKey, TrackedOrder } from "../data/Orders";

// const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const API = process.env.NEXT_PUBLIC_API_URL ?? "https://navgrah-bracelets-api.vercel.app";

export interface CheckoutDetails {
  name: string;
  email: string;
  address: string;
  pincode: string;
}

export interface OrderResult {
  reference: string;
  amount: number;
  status: PaymentStatus;
  itemCount: number;
  mode: "razorpay" | "manual";
  // razorpay
  qrImageUrl?: string;
  qrExpiresAt?: string | null;
  // manual
  upiLink?: string;
  vpa?: string;
  payeeName?: string;
}

export interface MyOrder {
  reference: string;
  status: PaymentStatus;
  stage: StageKey;
  amount: number;
  itemCount: number;
  items: { name: string; quantity: number; lineTotal: number }[];
  createdAt: string;
}

export class OrderError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    });
  } catch {
    throw new OrderError("Network error. Please check your connection.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new OrderError(data.message || "Something went wrong.", res.status);
  return data as T;
}

export const createOrder = (input: {
  submissionId: string;
  details: CheckoutDetails;
  items: { productId: string; quantity: number }[];
}) => request<OrderResult>("/orders", { method: "POST", body: JSON.stringify(input) });

/** Payment ka status (Razorpay confirm hote hi "paid") */
export const getOrderStatus = (reference: string) =>
  request<{ status: PaymentStatus; stage: StageKey }>(`/orders/${encodeURIComponent(reference)}/status`);

/** QR expire ho gaya to naya */
export const refreshQr = (reference: string) =>
  request<OrderResult>(`/orders/${encodeURIComponent(reference)}/qr`, { method: "POST" });

/** Sirf manual mode */
export const submitPayment = (reference: string, utr: string) =>
  request<{ ok: true }>(`/orders/${encodeURIComponent(reference)}/payment`, {
    method: "POST",
    body: JSON.stringify({ utr }),
  });

export async function fetchMyOrders(): Promise<MyOrder[]> {
  return (await request<{ orders: MyOrder[] }>("/orders/mine")).orders;
}

/** Public: login ke bina, sirf order ID se. */
export const trackOrder = (reference: string) =>
  request<TrackedOrder>(`/orders/track/${encodeURIComponent(reference.trim().toUpperCase())}`);
