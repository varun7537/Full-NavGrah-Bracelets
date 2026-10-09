// src/app/returns-refunds/page.tsx  →  route: /returns-refunds

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { PolicyPage, Section, Bullets, Callout, DataTable } from "../../components/Legal/PolicyPage";
import { POLICY, STORE } from "../../data/Storeinfo";

export const metadata: Metadata = {
  title: "Returns & refunds",
  description: "What can be returned on a made-to-order bracelet, how to raise a claim, and when money comes back.",
};

const sections = [
  { id: "summary", title: "The short version" },
  { id: "eligible", title: "What we take back" },
  { id: "not-eligible", title: "What we can’t take back" },
  { id: "how", title: "How to raise a claim" },
  { id: "refunds", title: "Refund timelines" },
  { id: "replacements", title: "Replacements and repairs" },
];

export default function ReturnsAndRefundsPage() {
  return (
    <PolicyPage
      title="Returns & refunds"
      intro="Each bracelet is made for one person’s chart, so it can’t go back on the shelf. What we do cover is anything that arrives damaged, faulty or not what the astrologer approved."
      sections={sections}
      currentHref="/returns-refunds"
    >
      <Section id="summary" title="The short version">
        <Bullets
          items={[
            <>
              Damaged, faulty or wrong item: tell us within {POLICY.returnWindowDays} days of delivery and
              we replace it or refund you in full.
            </>,
            <>Damage in transit: report within {POLICY.damageClaimHours} hours with an unboxing video.</>,
            "Changed your mind about a custom piece: not covered, because it was made to your chart.",
            <>
              Refunds reach your original payment method in {POLICY.refundWorkingDays} working days after
              approval.
            </>,
          ]}
        />
      </Section>

      <Section id="eligible" title="What we take back">
        <DataTable
          headers={["Situation", "Window", "Outcome"]}
          rows={[
            ["Arrived broken or damaged", `${POLICY.damageClaimHours} hours from delivery`, "Free replacement, or full refund"],
            ["Wrong stones or wrong item sent", `${POLICY.returnWindowDays} days`, "Correct piece sent, return pickup arranged by us"],
            ["Manufacturing fault — thread, clasp, setting", `${POLICY.returnWindowDays} days`, "Repair or replacement, free"],
            ["Wrong size delivered against your confirmed size", `${POLICY.returnWindowDays} days`, "Resized or remade, free"],
            ["Stone certificate missing", `${POLICY.returnWindowDays} days`, "Certificate sent, or full refund"],
            ["Order never arrived", "Anytime while tracking shows it undelivered", "Replacement or full refund"],
          ]}
        />
        <p>
          Send the item back unworn, with its pouch, box and certificate. We arrange the pickup where a
          reverse courier serves your PIN code; otherwise we reimburse what you spend on postage.
        </p>
      </Section>

      <Section id="not-eligible" title="What we can’t take back">
        <Bullets
          items={[
            "A change of mind about a bracelet made to your kundli, once making has begun.",
            "Stones you asked for against the astrologer’s advice, if you later prefer different ones.",
            "Normal variation in natural stones — colour, veining and inclusions differ from piece to piece and from photographs.",
            "Damage from wear, water, chemicals, perfume, sport, or attempts to repair or restring it yourself.",
            "Claims raised after the windows above, or without the packaging and certificate.",
            "Results. A bracelet is an astrological and ornamental item, not a medical, financial or legal remedy, and we make no promise about outcomes.",
          ]}
        />
        <Callout title="Sizing">
          <p className="text-sm leading-6 text-[#6d6259]">
            If the bracelet matches the wrist size you confirmed but doesn’t fit comfortably, we’ll resize
            it once. You pay the postage to us and we cover the return leg.
          </p>
        </Callout>
      </Section>

      <Section id="how" title="How to raise a claim">
        <ol className="space-y-3">
          {[
            <>
              Message {STORE.supportEmail} or WhatsApp {STORE.phoneDisplay} with your order id, what’s
              wrong, and photos or the unboxing video.
            </>,
            <>We reply within {STORE.grievanceOfficer.responseWindow} with whether the claim is approved and what happens next.</>,
            "If a return is needed, we share a pickup slot or a return address. Pack the item as it arrived.",
            "Once it reaches us and passes a quick check, we issue the replacement or refund.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f3ece3] text-xs font-semibold text-[#8c6327]">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="refunds" title="Refund timelines">
        <DataTable
          headers={["Paid by", "Money reaches you in"]}
          rows={[
            ["UPI", "1 to 3 working days"],
            ["Credit or debit card", `${POLICY.refundWorkingDays} working days`],
            ["Net banking", `${POLICY.refundWorkingDays} working days`],
            ["Wallet", "1 to 3 working days"],
            ["Cash on delivery", "5 to 7 working days to a bank account you share with us"],
          ]}
        />
        <p>
          The clock starts when we approve the refund, not when you post the item. Refunds go back to the
          original payment method — we can’t redirect them elsewhere except for cash on delivery orders.
          Shipping charges are refunded too when the fault is ours.
        </p>
        <p>
          Haven’t seen it after the window above? Send us the order id and we’ll share the payment
          gateway’s reference number so your bank can trace it.
        </p>
      </Section>

      <Section id="replacements" title="Replacements and repairs">
        <Bullets
          items={[
            "Replacements are made to the same recommendation and dispatched on the same timeline as a fresh order.",
            "Restringing is free for six months from delivery.",
            "Out-of-warranty repairs are quoted before any work starts. Nothing is charged without your approval.",
            <>
              Cancelling before your bracelet is made is covered by the{" "}
              <Link href="/cancellation-policy">cancellation policy</Link>.
            </>,
          ]}
        />
      </Section>
    </PolicyPage>
  );
}