// src/app/help/page.tsx  →  route: /help  ("Help & Support")

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { PolicyPage, Section, Faq, Callout, Bullets } from "../../components/Legal/PolicyPage";
import { POLICY, STORE, formatAddress } from "../../data/Storeinfo";

export const metadata: Metadata = {
  title: "Help & support",
  description: `Reach the ${STORE.name} team, or find answers about kundli readings, custom bracelets, delivery and refunds.`,
};

const sections = [
  { id: "contact", title: "Talk to us" },
  { id: "orders", title: "Orders and payment" },
  { id: "consultation", title: "Kundli and consultation" },
  { id: "product", title: "Bracelet and care" },
  { id: "delivery", title: "Delivery and returns" },
  { id: "grievance", title: "If we get it wrong" },
];

const channels = [
  {
    title: "WhatsApp",
    detail: STORE.phoneDisplay,
    blurb: "Quickest for order updates and photos.",
    href: `https://wa.me/${STORE.whatsappE164.replace("+", "")}`,
    cta: "Open WhatsApp",
    external: true,
  },
  {
    title: "Email",
    detail: STORE.supportEmail,
    blurb: `We reply within ${STORE.grievanceOfficer.responseWindow}.`,
    href: `mailto:${STORE.supportEmail}`,
    cta: "Send an email",
  },
  {
    title: "Phone",
    detail: STORE.phoneDisplay,
    blurb: STORE.supportHours,
    href: `tel:${STORE.phoneE164}`,
    cta: "Call us",
  },
];

export default function HelpAndSupportPage() {
  return (
    <PolicyPage
      title="Help & support"
      intro="Most answers are on this page. If yours isn’t, a person on our team will pick it up."
      sections={sections}
      currentHref="/help"
    >
      <Section id="contact" title="Talk to us">
        <ul className="grid gap-3 sm:grid-cols-2">
          {channels.map((c) => (
            <li key={c.title} className="rounded-2xl border border-[#e7dfd5] bg-white p-5">
              <p className="text-sm font-medium text-[#241c16]">{c.title}</p>
              <p className="mt-1 text-sm text-[#241c16]">{c.detail}</p>
              <p className="mt-1 text-xs leading-5 text-[#6d6259]">{c.blurb}</p>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="mt-3 inline-block text-sm font-medium text-[#8c6327] underline underline-offset-2"
              >
                {c.cta}
              </a>
            </li>
          ))}
        </ul>

        <p>
          Have your order id ready — it starts with ORD and is in your confirmation message. To see
          where a parcel is, use <Link href="/order-tracking">order tracking</Link>.
        </p>

        <Callout title="Our address">
          <p className="text-sm leading-6 text-[#6d6259]">{formatAddress()}</p>
        </Callout>
      </Section>

      <Section id="orders" title="Orders and payment">
        <Faq
          items={[
            {
              q: "When do I pay for a customized bracelet?",
              a: (
                <p>
                  Only after you’ve read the astrologer’s recommendation. Sharing your details and
                  getting the reading costs nothing.
                </p>
              ),
            },
            {
              q: "Money left my account but I got no confirmation.",
              a: (
                <p>
                  Failed payments are released by your bank, usually within {POLICY.refundWorkingDays} working
                  days. Send us the payment id or a screenshot at {STORE.ordersEmail} and we’ll chase it
                  for you.
                </p>
              ),
            },
            {
              q: "Which payment methods work?",
              a: <p>UPI, all major credit and debit cards, net banking and popular wallets.</p>,
            },
            {
              q: "Can I change my address after ordering?",
              a: (
                <p>
                  Yes, as long as the parcel hasn’t been dispatched. Message us with your order id and
                  the new address.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section id="consultation" title="Kundli and consultation">
        <Faq
          items={[
            {
              q: "I don’t know my exact birth time.",
              a: (
                <p>
                  Tick “I don’t know my exact time” on the form. The astrologer will work from your date
                  and place, and may ask you a few questions to narrow it down.
                </p>
              ),
            },
            {
              q: "How long does the reading take?",
              a: (
                <p>
                  Usually a few minutes, and on busy days up to 24 hours. It appears on the same page,
                  and we message you when it’s ready.
                </p>
              ),
            },
            {
              q: "Can I ask for different stones than the ones suggested?",
              a: (
                <p>
                  Yes. Use “Ask for changes” on the recommendation and tell the astrologer what you’d
                  prefer. They’ll revise it before you pay.
                </p>
              ),
            },
            {
              q: "Who sees my birth details?",
              a: (
                <p>
                  Only the astrologer working on your reading and the team fulfilling your order. See the{" "}
                  <Link href="/privacy-policy">privacy policy</Link>.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section id="product" title="Bracelet and care">
        <Faq
          items={[
            {
              q: "How do I pick the right wrist size?",
              a: (
                <p>
                  Wrap a strip of paper around your wrist, mark where it meets and measure it against a
                  ruler. Pick the size band that covers that number, or choose “not sure” and we’ll send
                  a sizing guide before making it.
                </p>
              ),
            },
            {
              q: "Are the stones certified?",
              a: (
                <p>
                  Natural stones come with a lab certificate in the box. Ask us before ordering if you
                  need a specific lab.
                </p>
              ),
            },
            {
              q: "How should I look after it?",
              a: (
                <Bullets
                  items={[
                    "Take it off before bathing, swimming or sleeping.",
                    "Keep it away from perfume, sanitiser and cleaning products.",
                    "Wipe it with a dry, soft cloth. No chemical cleaners.",
                    "Store it in the pouch it came in, away from other jewellery.",
                  ]}
                />
              ),
            },
            {
              q: "The thread has loosened. Can you repair it?",
              a: (
                <p>
                  Yes. Restringing is free in the first six months, and charged at cost after that. You
                  pay the postage to us; we pay it back.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section id="delivery" title="Delivery and returns">
        <Faq
          items={[
            {
              q: "When will my bracelet arrive?",
              a: (
                <p>
                  Made-to-order bracelets are dispatched in {POLICY.dispatchWorkingDays} working days and
                  delivered in {POLICY.deliveryMetroDays} days in metros, {POLICY.deliveryRestOfIndiaDays}{" "}
                  elsewhere. Full details on the{" "}
                  <Link href="/shipping-delivery">shipping page</Link>.
                </p>
              ),
            },
            {
              q: "Can I return a customized bracelet?",
              a: (
                <p>
                  Custom pieces can’t be returned for a change of mind, but damaged, faulty or wrong
                  items are replaced or refunded. See{" "}
                  <Link href="/returns-refunds">returns & refunds</Link>.
                </p>
              ),
            },
            {
              q: "Can I cancel after paying?",
              a: (
                <p>
                  Within {POLICY.cancellationWindowHours} hours, as long as work hasn’t started. See the{" "}
                  <Link href="/cancellation-policy">cancellation policy</Link>.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section id="grievance" title="If we get it wrong">
        <p>
          Tell us first — most things are sorted in a message or two. If you’re not happy with how it
          was handled, write to our grievance officer.
        </p>
        <Callout title={`${STORE.grievanceOfficer.name}, ${STORE.grievanceOfficer.designation}`}>
          <p className="text-sm leading-6 text-[#6d6259]">
            {STORE.grievanceOfficer.email} · {STORE.grievanceOfficer.phone}
            <br />
            Acknowledged within {STORE.grievanceOfficer.responseWindow}, resolved within{" "}
            {STORE.grievanceOfficer.resolutionWindow}.
          </p>
        </Callout>
        <p>
          You can also raise a complaint with the National Consumer Helpline on 1915, or at{" "}
          <a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer">
            consumerhelpline.gov.in
          </a>
          .
        </p>
      </Section>
    </PolicyPage>
  );
}