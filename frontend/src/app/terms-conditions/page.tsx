// src/app/terms-conditions/page.tsx  →  route: /terms-conditions

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { PolicyPage, Section, Bullets, Callout } from "../../components/Legal/PolicyPage";
import { POLICY, STORE, formatAddress } from "../../data/Storeinfo";

export const metadata: Metadata = {
  title: "Terms & conditions",
  description: "The rules that apply when you order a customized bracelet from us.",
};

const sections = [
  { id: "agreement", title: "Agreement" },
  { id: "eligibility", title: "Who can order" },
  { id: "consultation", title: "Astrological readings" },
  { id: "products", title: "Products and natural stones" },
  { id: "orders", title: "Orders and pricing" },
  { id: "payment", title: "Payment" },
  { id: "delivery", title: "Delivery, cancellation and returns" },
  { id: "conduct", title: "How you may use the site" },
  { id: "ip", title: "Intellectual property" },
  { id: "liability", title: "Liability" },
  { id: "law", title: "Law and disputes" },
  { id: "contact", title: "Contact" },
];

export default function TermsAndConditionsPage() {
  return (
    <PolicyPage
      title="Terms & conditions"
      intro={`These terms apply every time you use ${STORE.website} or place an order with us. Please read them before you pay.`}
      sections={sections}
      currentHref="/terms-conditions"
    >
      <Section id="agreement" title="Agreement">
        <p>
          This site is operated by {STORE.legalName}, registered at {formatAddress()}. By browsing the site
          or placing an order you accept these terms, along with our{" "}
          <Link href="/privacy-policy">privacy policy</Link>,{" "}
          <Link href="/shipping-delivery">shipping policy</Link>,{" "}
          <Link href="/returns-refunds">returns policy</Link> and{" "}
          <Link href="/cancellation-policy">cancellation policy</Link>, which form part of this agreement.
        </p>
        <p>
          We may update these terms. The version published when you place an order is the one that governs
          it.
        </p>
      </Section>

      <Section id="eligibility" title="Who can order">
        <Bullets
          items={[
            <>You must be at least {POLICY.minimumAgeYears} years old and able to enter a contract under Indian law.</>,
            "A reading or bracelet for a minor must be ordered by a parent or guardian in their own name.",
            "The details you give — name, birth details, address, phone number — must be accurate and your own, or given with that person’s permission.",
            "You’re responsible for anything done through your account. Tell us at once if you think someone else is using it.",
          ]}
        />
      </Section>

      <Section id="consultation" title="Astrological readings">
        <Callout title="Please read this part carefully">
          <p className="text-sm leading-6 text-[#6d6259]">
            Astrological recommendations are a matter of belief and tradition, not scientific or
            professional advice. Nothing we or our astrologers say is medical, psychological, legal,
            financial or investment advice, and it must not replace a qualified professional. We make no
            promise about health, money, marriage, career, exams, court cases or any other outcome.
          </p>
        </Callout>
        <Bullets
          items={[
            "The reading is free and given in good faith based on the details you provide. Wrong or incomplete birth details will produce a reading that doesn’t fit.",
            "The astrologer decides which stones and metal to recommend. You may ask for changes, and you may decline the recommendation entirely without paying.",
            "Recommendations are personal to you and are not transferable or resellable.",
            "An unpaid recommendation stays available for seven days and then expires.",
            "You remain responsible for your own decisions and actions.",
          ]}
        />
      </Section>

      <Section id="products" title="Products and natural stones">
        <Bullets
          items={[
            "Natural stones vary in colour, clarity, veining and inclusions. Photographs on the site are indicative, and screen colours differ from the real thing.",
            "Where a lab certificate is supplied, it covers the stone described in it and nothing else.",
            "Weights and dimensions are approximate and within normal trade tolerance.",
            "Stones are sold as ornamental and astrological items, not as investments or as items of guaranteed resale value.",
            "We may substitute a stone of equal or better quality if a recommended one isn’t available, after telling you.",
          ]}
        />
      </Section>

      <Section id="orders" title="Orders and pricing">
        <Bullets
          items={[
            "Your payment is an offer. A contract forms only when we confirm the order in writing.",
            "Prices are in Indian rupees and include GST unless stated otherwise. Shipping is shown separately before you pay.",
            "Prices can change at any time, but never after we’ve confirmed your order.",
            "If a price or description is listed wrongly, we may cancel and refund in full rather than fulfil it.",
            "We may refuse or limit orders that look like bulk buying for resale, or that we reasonably believe to be fraudulent.",
          ]}
        />
      </Section>

      <Section id="payment" title="Payment">
        <p>
          Payments are handled by a third-party gateway. We never see or store your full card number, CVV
          or UPI PIN. By paying you also accept the gateway’s own terms.
        </p>
        <Bullets
          items={[
            "Failed payments where money has left your account are released by your bank, usually within a week.",
            "A chargeback raised without contacting us first may delay resolution — please talk to us first.",
            "Cash on delivery, where offered, carries the handling fee shown at checkout.",
          ]}
        />
      </Section>

      <Section id="delivery" title="Delivery, cancellation and returns">
        <p>
          Timelines, charges and serviceable areas are set out in the{" "}
          <Link href="/shipping-delivery">shipping & delivery policy</Link>. Cancellation windows are in the{" "}
          <Link href="/cancellation-policy">cancellation policy</Link>. What can be returned, and how
          refunds work, is in <Link href="/returns-refunds">returns & refunds</Link>. Because each bracelet
          is made to your chart, it is a customized good and cannot be returned for a change of mind once
          making has started.
        </p>
        <p>
          Risk passes to you on delivery. Title passes once we have received payment in full.
        </p>
      </Section>

      <Section id="conduct" title="How you may use the site">
        <p>You agree not to:</p>
        <Bullets
          items={[
            "copy, scrape or republish our content, photographs or product descriptions;",
            "resell our products as your own, or use our name or logo without written permission;",
            "attempt to breach, probe or overload the site, or upload malicious files;",
            "submit somebody else’s birth details without their consent;",
            "post abusive, obscene or unlawful content in reviews or messages.",
          ]}
        />
      </Section>

      <Section id="ip" title="Intellectual property">
        <p>
          The site’s design, text, photography, logos and product descriptions belong to {STORE.legalName} or
          our licensors. You may not use them commercially without written permission. Reviews and photos
          you post may be used by us to promote the product they relate to; tell us if you’d rather we
          didn’t and we’ll take them down.
        </p>
      </Section>

      <Section id="liability" title="Liability">
        <p>
          To the fullest extent the law allows, our total liability for any order is limited to the amount
          you paid for it. We are not liable for indirect or consequential loss, or for outcomes you
          attribute to wearing or not wearing a bracelet.
        </p>
        <p>
          Nothing here limits your rights under the Consumer Protection Act, 2019, or our liability for
          fraud, or for death or personal injury caused by our negligence.
        </p>
        <p>
          We are not responsible for delays or failures caused by events beyond our control, including
          strikes, natural disasters, courier disruption, pandemics, government action or network failure.
        </p>
      </Section>

      <Section id="law" title="Law and disputes">
        <p>
          These terms are governed by {STORE.governingLaw}. Courts at {STORE.jurisdiction} have exclusive
          jurisdiction.
        </p>
        <p>
          Please raise any complaint with our grievance officer first — details are on the{" "}
          <Link href="/help">help page</Link>. Most issues are resolved there, and you also retain your
          rights to approach a consumer forum.
        </p>
      </Section>

      <Section id="contact" title="Contact">
        <Callout>
          <p className="text-sm leading-6 text-[#6d6259]">
            {STORE.legalName}
            <br />
            {formatAddress()}
            <br />
            <a href={`mailto:${STORE.supportEmail}`}>{STORE.supportEmail}</a> · {STORE.phoneDisplay}
            <br />
            {STORE.supportHours}
          </p>
        </Callout>
      </Section>
    </PolicyPage>
  );
}