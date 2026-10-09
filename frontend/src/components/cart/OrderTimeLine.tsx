"use client";

import type { ReactElement } from "react";
import { STAGE_KEYS, STAGE_LABELS, reachedIndex, type StageKey, type TrackedOrder } from "../../data/Orders";
import {
  BoxIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
} from "../NavgrahBracelets/Icons";

const STAGE_ICON: Record<StageKey, (className: string) => ReactElement> = {
  placed: (c) => <ClockIcon className={c} />,
  confirmed: (c) => <CheckCircleIcon className={c} />,
  shipped: (c) => <BoxIcon className={c} />,
  out_for_delivery: (c) => <TruckIcon className={c} />,
  delivered: (c) => <CheckCircleIcon className={c} />,
};

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export interface OrderTimelineProps {
  order: TrackedOrder;
}

export default function OrderTimeline({ order }: OrderTimelineProps) {
  if (order.status === "cancelled") {
    return (
      <div className="rounded-xl bg-[#fdf2f0] p-4">
        <div className="flex items-start gap-3">
          <XCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#a3462f]" />
          <div>
            <p className="text-sm font-semibold text-[#a3462f]">Order Cancelled</p>
            <p className="mt-1 text-xs leading-5 text-[#8c5548]">
              This order is no longer active. If you paid, please contact us.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = reachedIndex(order);
  const eventByStage = new Map(order.events.map((event) => [event.stage, event]));

  return (
    <div>
      {/* Desktop: horizontal */}
      <ol className="hidden items-start sm:flex">
        {STAGE_KEYS.map((stage, index) => {
          const done = index <= currentIndex;
          const isLast = index === STAGE_KEYS.length - 1;
          const event = done ? eventByStage.get(stage) : undefined;

          return (
            <li key={stage} className="flex flex-1 flex-col items-center text-center last:flex-none">
              <div className="flex w-full items-center">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                    done
                      ? "border-[#a47735] bg-[#a47735] text-white"
                      : "border-[#e7dfd5] bg-white text-[#c9bba3]"
                  }`}
                >
                  {STAGE_ICON[stage]("h-4 w-4")}
                </span>

                {!isLast && (
                  <span
                    className={`mx-1 h-0.5 flex-1 rounded-full ${
                      index < currentIndex ? "bg-[#a47735]" : "bg-[#e7dfd5]"
                    }`}
                  />
                )}
              </div>

              <p className={`mt-2 text-xs font-medium ${done ? "text-[#241c16]" : "text-[#a89d8f]"}`}>
                {STAGE_LABELS[stage]}
              </p>

              {event && <p className="mt-0.5 text-[10px] text-[#a89d8f]">{formatTimestamp(event.at)}</p>}
            </li>
          );
        })}
      </ol>

      {/* Mobile: vertical */}
      <ol className="space-y-0 sm:hidden">
        {STAGE_KEYS.map((stage, index) => {
          const done = index <= currentIndex;
          const isLast = index === STAGE_KEYS.length - 1;
          const event = done ? eventByStage.get(stage) : undefined;

          return (
            <li key={stage} className="relative flex gap-3 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className={`absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-0.5 ${
                    index < currentIndex ? "bg-[#a47735]" : "bg-[#e7dfd5]"
                  }`}
                  aria-hidden="true"
                />
              )}

              <span
                className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                  done
                    ? "border-[#a47735] bg-[#a47735] text-white"
                    : "border-[#e7dfd5] bg-white text-[#c9bba3]"
                }`}
              >
                {STAGE_ICON[stage]("h-4 w-4")}
              </span>

              <div className="pt-1">
                <p className={`text-sm font-medium ${done ? "text-[#241c16]" : "text-[#a89d8f]"}`}>
                  {STAGE_LABELS[stage]}
                </p>

                {event ? (
                  <>
                    <p className="text-xs text-[#6d6259]">{formatTimestamp(event.at)}</p>
                    {event.note && event.note !== STAGE_LABELS[stage] && (
                      <p className="mt-0.5 text-xs text-[#a89d8f]">{event.note}</p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-[#a89d8f]">Pending</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}