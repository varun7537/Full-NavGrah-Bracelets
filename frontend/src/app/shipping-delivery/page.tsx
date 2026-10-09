// src/app/shipping-delivery/page.tsx  →  route: /shipping-delivery

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { PolicyPage, Section, Bullets, Callout, DataTable } from "../../components/Legal/PolicyPage";
import { POLICY, STORE } from "../../data/Storeinfo";
import { formatINR } from "../../lib/Currency";

export const metadata: Metadata = {
  title: "Shipping & delivery",
  description: "How long a made-to-order bracelet takes, what shipping costs, and where we deliver.",
};

const sections = [
  { id: "timeline", title: "How long it takes" },
  { id: "charges", title: "Shipping charges" },
  { id: "areas", title: "Where we deliver" },
  { id: "packaging", title: "Packaging" },
  { id: "receiving", title: "Receiving your parcel" },
  { id: "problems", title: "Delays and problems" },
];

export default function ShippingAndDeliveryPage() {
  return (
    <PolicyPage
      title="Shipping & delivery"
      intro="Every bracelet is made after the astrologer confirms your stones, so the clock starts when you approve the recommendation — not when you land on the site."
      sections={sections}
      currentHref="/shipping-delivery"
    >
      <Section id="timeline" title="How long it takes">
        <DataTable
          headers={["Stage", "Time", "What happens"]}
          rows={[
            ["Astrologer reading", "Few minutes to 24 hours", "Your chart is read and stones are picked."],
            ["Making", `${POLICY.dispatchWorkingDays} working days`, "Stones sourced, strung and set by hand."],
            ["Delivery — metros", `${POLICY.deliveryMetroDays} days`, "Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad."],
            ["Delivery — rest of India", `${POLICY.deliveryRestOfIndiaDays} days`, "Other cities and towns."],
            ["Remote and hill areas", "Up to 12 days", "Parts of the North East, Ladakh, Andaman & Nicobar, Lakshadweep."],
          ]}
        />
        <p>
          Working days are Monday to Saturday, excluding public holidays. Festival weeks and heavy rain
          can add a couple of days; we message you if your order is affected.
        </p>
      </Section>

      <Section id="charges" title="Shipping charges">
        <Bullets
          items={[
            <>Free standard shipping on orders above {formatINR(POLICY.freeShippingAbove)}.</>,
            <>Below that, standard shipping is {formatINR(POLICY.standardShippingFee)}.</>,
            <>Cash on delivery, where available, carries a {formatINR(POLICY.codFee)} handling fee.</>,
            "Charges are shown before you pay. Nothing is added afterwards.",
          ]}
        />
      </Section>

      <Section id="areas" title="Where we deliver">
        <p>
          We deliver across India through courier partners such as Blue Dart, Delhivery and India Post.
          Enter your PIN code at checkout to see whether your area is served and whether cash on delivery
          is available there.
        </p>
        <p>
          <strong>International orders</strong> are accepted for selected countries on request. Write to{" "}
          <a href={`mailto:${STORE.ordersEmail}`}>{STORE.ordersEmail}</a> with your address and we’ll quote
          shipping and timelines. Customs duty, import taxes and local clearance charges are paid by you
          and are not included in our price.
        </p>
      </Section>

      <Section id="packaging" title="Packaging">
        <Bullets
          items={[
            "Bracelets travel in a cloth pouch inside a rigid box, wrapped in tamper-evident packaging.",
            "Natural stone certificates and care instructions are packed with the bracelet.",
            "Parcels carry no branding that identifies the contents as jewellery.",
            "All shipments are insured in transit until they are handed to you.",
          ]}
        />
      </Section>

      <Section id="receiving" title="Receiving your parcel">
        <p>
          Please check the outer packaging before you accept the parcel. If the seal is broken or the box
          looks tampered with, refuse the delivery and tell us the same day.
        </p>
        <Callout title="Record an unboxing video">
          <p className="text-sm leading-6 text-[#6d6259]">
            A single unbroken video from sealed parcel to opened box is the fastest way to settle a damage
            or missing-item claim. We ask for it within {POLICY.damageClaimHours} hours of delivery — see{" "}
            <Link href="/returns-refunds" className="text-[#8c6327] underline underline-offset-2">
              returns & refunds
            </Link>
            .
          </p>
        </Callout>
        <p>
          Couriers make up to three attempts. If nobody is available, the parcel returns to us and we’ll
          contact you to arrange a re-dispatch. A second dispatch after three failed attempts is charged
          at actual courier cost.
        </p>
      </Section>

      <Section id="problems" title="Delays and problems">
        <Bullets
          items={[
            <>
              Tracking hasn’t moved for three days? Use{" "}
              <Link href="/order-tracking">order tracking</Link> first, then message us with your order id.
            </>,
            "If a courier marks a parcel delivered and you don’t have it, tell us within 48 hours so we can raise a dispute with them.",
            "Parcels lost in transit are replaced at no cost to you, or refunded in full if you prefer.",
            "We are not responsible for delays caused by incorrect addresses, unreachable phone numbers, strikes, weather or other events outside our control.",
          ]}
        />
      </Section>
    </PolicyPage>
  );
}