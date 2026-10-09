export const STAGE_KEYS = ["placed", "confirmed", "shipped", "out_for_delivery", "delivered"] as const;
export type StageKey = (typeof STAGE_KEYS)[number];

export const STAGE_LABELS: Record<StageKey, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

export type PaymentStatus = "pending_payment" | "payment_submitted" | "paid" | "cancelled";

export interface TrackedItem {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string;
}

export interface TrackedOrder {
  reference: string;
  customerName: string;
  status: PaymentStatus;
  stage: StageKey;
  placedAt: string;
  amount: number;
  itemCount: number;
  items: TrackedItem[];
  events: { stage: StageKey; at: string; note: string }[];
  courier: string;
  trackingNumber: string;
  trackingUrl: string;
  expectedDelivery: string | null;
  deliveredAt: string | null;
}

export type DisplayStatus = StageKey | "payment_pending" | "payment_verifying" | "cancelled";

export const DISPLAY_LABELS: Record<DisplayStatus, string> = {
  ...STAGE_LABELS,
  payment_pending: "Payment Pending",
  payment_verifying: "Verifying Payment",
  cancelled: "Cancelled",
};

export function displayStatus(order: Pick<TrackedOrder, "status" | "stage">): DisplayStatus {
  if (order.status === "cancelled") return "cancelled";
  if (order.status === "pending_payment") return "payment_pending";
  if (order.status === "payment_submitted") return "payment_verifying";
  return order.stage;
}

export function reachedIndex(order: Pick<TrackedOrder, "status" | "stage">): number {
  if (order.status === "cancelled") return -1;
  if (order.status !== "paid") return -1;
  return STAGE_KEYS.indexOf(order.stage);
}

export function orderSubtotal(order: Pick<TrackedOrder, "items">): number {
  return order.items.reduce((sum, i) => sum + i.lineTotal, 0);
}

// export const STAGE_KEYS = ["placed", "confirmed", "shipped", "out_for_delivery", "delivered"] as const;
// export type StageKey = (typeof STAGE_KEYS)[number];

// export const STAGE_LABELS: Record<StageKey, string> = {
//   placed: "Placed",
//   confirmed: "Confirmed",
//   shipped: "Shipped",
//   out_for_delivery: "Out for Delivery",
//   delivered: "Delivered",
// };

// export type PaymentStatus = "pending_payment" | "payment_submitted" | "paid" | "cancelled";

// export const ORDER_STAGES = ["Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered"] as const;
// export type OrderStage = (typeof ORDER_STAGES)[number];
// export type OrderStatus = OrderStage | "Cancelled";

// export interface TrackedOrder {
//   reference: string;
//   customerName: string;
//   status: PaymentStatus;
//   stage: StageKey;
//   placedAt: string;
//   amount: number;
//   itemCount: number;
//   items: { name: string; quantity: number }[];
//   events: { stage: StageKey; at: string; note: string }[];
//   courier: string;
//   trackingNumber: string;
//   trackingUrl: string;
//   expectedDelivery: string | null;
//   deliveredAt: string | null;
// }

// export interface OrderItemLine {
//   productId: string;
//   quantity: number;
//   priceAtPurchase: number;
// }

// export interface OrderStatusEvent {
//   status: OrderStatus;
//   /** ISO 8601 timestamp. */
//   timestamp: string;
//   note?: string;
//   location?: string;
// }

// export interface ShippingAddress {
//   name: string;
//   line1: string;
//   line2?: string;
//   city: string;
//   state: string;
//   pincode: string;
//   phone: string;
// }

// export interface Order {
//   id: string;
//   placedAt: string;
//   status: OrderStatus;
//   items: OrderItemLine[];
//   history: OrderStatusEvent[];
//   shippingAddress: ShippingAddress;
//   estimatedDelivery?: string;
//   deliveredAt?: string;
//   carrier?: string;
//   trackingNumber?: string;
//   paymentMethod: string;
//   shippingFee: number;
// }

// export function resolveOrderItems(order: Order) {
//   return order.items.map((line) => ({
//     ...line,
//     product: braceletById[line.productId],
//     lineTotal: line.priceAtPurchase * line.quantity,
//   }));
// }

// export function orderSubtotal(order: Order): number {
//   return order.items.reduce((sum, l) => sum + l.priceAtPurchase * l.quantity, 0);
// }

// export function orderTotal(order: Order): number {
//   return orderSubtotal(order) + order.shippingFee;
// }

// export function stageIndex(status: OrderStatus): number {
//   return status === "Cancelled" ? -1 : ORDER_STAGES.indexOf(status);
// }
