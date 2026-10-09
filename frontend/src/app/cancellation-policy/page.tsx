// src/app/cancellation-policy/page.tsx  →  route: /cancellation-policy

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { PolicyPage, Section, Bullets, Callout, DataTable } from "../../components/Legal/PolicyPage";
import { POLICY, STORE } from "../../data/Storeinfo";

export const metadata: Metadata = {
  title: "Cancellation policy",
  description: "When you can cancel a made-to-order bracelet, what it costs, and how the money comes back.",
};

const sections = [
  { id: "window", title: "Your cancellation window" },
  { id: "charges", title: "What it costs" },
  { id: "how", title: "How to cancel" },
  { id: "ours", title: "When we cancel an order" },
  { id: "consultation", title: "Cancelling the reading" },
];

export default function CancellationPolicyPage() {
  return (
    <PolicyPage
      title="Cancellation policy"
      intro={`A customized bracelet is made only for you, so cancellation depends on how far along it is. Within ${POLICY.cancellationWindowHours} hours, before work starts, it's straightforward.`}
      sections={sections}
      currentHref="/cancellation-policy"
    >
      <Section id="window" title="Your cancellation window">
        <DataTable
          headers={["When you cancel", "What you get back"]}
          rows={[
            [
              `Within ${POLICY.cancellationWindowHours} hours of payment, before making starts`,
              "Full refund, no deduction",
            ],
            [
              "After making has started, before dispatch",
              "Refund minus the cost of stones already sourced and work done, shown to you before we process it",
            ],
            ["After dispatch", "Cannot be cancelled — refuse the delivery or raise a return claim instead"],
            ["Order never confirmed by the astrologer", "Full refund, automatically"],
          ]}
        />
        <p>
          We tell you the moment making begins, so you always know which row applies. If you’re unsure,
          check the status on <Link href="/order-tracking">order tracking</Link> — anything before “Being
          made” is still in the free window.
        </p>
      </Section>

      <Section id="charges" title="What it costs">
        <Bullets
          items={[
            <>Cancelling inside {POLICY.cancellationWindowHours} hours costs nothing.</>,
            "Once stones are cut, drilled or set for your piece, those costs can’t be recovered and are deducted.",
            "Payment gateway charges are not deducted from your refund — we absorb them.",
            <>
              Refunds land in {POLICY.refundWorkingDays} working days on the original payment method, per{" "}
              <Link href="/returns-refunds">returns & refunds</Link>.
            </>,
          ]}
        />
      </Section>

      <Section id="how" title="How to cancel">
        <ol className="space-y-3">
          {[
            <>
              Message {STORE.supportEmail} or WhatsApp {STORE.phoneDisplay} with your order id and the word
              “cancel”.
            </>,
            "We confirm the stage your order is at and, if anything is deductible, the exact amount.",
            "You approve the amount, and we process the refund the same working day.",
            "You get a refund reference you can quote to your bank.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f3ece3] text-xs font-semibold text-[#8c6327]">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <Callout title="Would a change work better than a cancellation?">
          <p className="text-sm leading-6 text-[#6d6259]">
            Wrong size, second thoughts about the stones, or a new address — all of these can usually be
            changed before dispatch without cancelling. Ask us first.
          </p>
        </Callout>
      </Section>

      <Section id="ours" title="When we cancel an order">
        <p>We may cancel an order, with a full refund and an explanation, if:</p>
        <Bullets
          items={[
            "a recommended stone of the required quality isn’t available and you don’t want an alternative;",
            "the birth details given are incomplete or contradictory and we can’t reach you to fix them;",
            "the delivery address is outside our serviceable area;",
            "payment is flagged as fraudulent, or the order looks like a bulk resale;",
            "a price or description was listed in error.",
          ]}
        />
        <p>
          A refund in these cases is issued in full, including shipping, and we don’t charge anything for
          the astrologer’s time already spent.
        </p>
      </Section>

      <Section id="consultation" title="Cancelling the reading">
        <p>
          Sharing your kundli and getting the recommendation is free, so there’s nothing to cancel and
          nothing to refund. If you decide not to go ahead after reading it, simply don’t pay — the
          recommendation stays on your page for seven days and then expires.
        </p>
        <p>
          Want your birth details deleted at that point? Ask at{" "}
          <a href={`mailto:${STORE.privacyEmail}`}>{STORE.privacyEmail}</a> and we’ll erase them, as set out
          in the <Link href="/privacy-policy">privacy policy</Link>.
        </p>
      </Section>
    </PolicyPage>
  );
}