"use client";

import { DISPLAY_LABELS, type DisplayStatus } from "../../data/Orders";

const STYLES: Record<DisplayStatus, string> = {
  payment_pending: "bg-[#fdf2f0] text-[#a3462f]",
  payment_verifying: "bg-[#faf3e7] text-[#8c6327]",
  placed: "bg-[#f5eee5] text-[#6d6259]",
  confirmed: "bg-[#eef1fb] text-[#4a5a9c]",
  shipped: "bg-[#faf3e7] text-[#8c6327]",
  out_for_delivery: "bg-[#fff4de] text-[#a5720c]",
  delivered: "bg-[#eaf6ee] text-[#2f7a4d]",
  cancelled: "bg-[#fdf2f0] text-[#a3462f]",
};

export default function OrderStatusBadge({ status }: { status: DisplayStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${STYLES[status]}`}
    >
      {DISPLAY_LABELS[status]}
    </span>
  );
}