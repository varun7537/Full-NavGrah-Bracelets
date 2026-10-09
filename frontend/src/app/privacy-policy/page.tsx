// src/app/privacy-policy/page.tsx  →  route: /privacy-policy

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { PolicyPage, Section, Bullets, Callout, DataTable } from "../../components/Legal/PolicyPage";
import { POLICY, STORE, formatAddress } from "../../data/Storeinfo";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What we collect, why we need it, who sees it, and how to have it deleted.",
};

const sections = [
  { id: "who", title: "Who we are" },
  { id: "collect", title: "What we collect" },
  { id: "why", title: "Why we use it" },
  { id: "birth-data", title: "Your kundli and birth details" },
  { id: "sharing", title: "Who else sees it" },
  { id: "retention", title: "How long we keep it" },
  { id: "rights", title: "Your rights" },
  { id: "security", title: "How we protect it" },
  { id: "cookies", title: "Cookies" },
  { id: "children", title: "Children" },
  { id: "changes", title: "Changes and contact" },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy policy"
      intro="Birth details are personal in a way a shipping address isn’t. This page sets out exactly what we hold, who touches it, and how to get it removed."
      sections={sections}
      currentHref="/privacy-policy"
    >
      <Section id="who" title="Who we are">
        <p>
          {STORE.legalName} (“we”, “us”) operates {STORE.website} and is the data fiduciary for the personal
          data described here, under the Digital Personal Data Protection Act, 2023 and the Information
          Technology Act, 2000 with its rules.
        </p>
        <Callout title="Registered address">
          <p className="text-sm leading-6 text-[#6d6259]">
            {formatAddress()}
            <br />
            CIN {STORE.cin} · GSTIN {STORE.gstin}
          </p>
        </Callout>
      </Section>

      <Section id="collect" title="What we collect">
        <DataTable
          headers={["Category", "Examples", "When"]}
          rows={[
            ["Identity and contact", "Name, gender, mobile number, email, delivery address", "When you fill the bracelet form or check out"],
            ["Birth and astrological", "Date, time and place of birth, an uploaded kundli file, stone preferences, the concern you want read", "When you request a reading"],
            ["Order", "Items, wrist size, order id, notes to the astrologer, delivery status", "Throughout your order"],
            ["Payment", "Payment id, method, status, last four digits of a card", "At payment — card and UPI credentials stay with the gateway, never with us"],
            ["Technical", "IP address, browser and device type, pages visited, approximate city", "Automatically as you browse"],
            ["Correspondence", "Messages, emails and call notes", "When you contact support"],
          ]}
        />
        <p>
          We don’t buy personal data from third parties, and we don’t ask for caste, religion, health
          records or biometrics.
        </p>
      </Section>

      <Section id="why" title="Why we use it">
        <Bullets
          items={[
            "To let the astrologer prepare your recommendation — this is the whole purpose of the birth details.",
            "To make, pack, ship and deliver your bracelet.",
            "To take payment and issue refunds.",
            "To answer your messages and handle complaints.",
            "To meet tax, accounting and consumer-law obligations.",
            "To keep the site secure and detect fraudulent orders.",
            "To send offers and astrological content — only if you opt in, and you can stop at any time.",
          ]}
        />
        <p>
          We rely on your consent for the reading and for marketing, and on the necessity of performing
          our contract with you for everything involved in fulfilling an order.
        </p>
      </Section>

      <Section id="birth-data" title="Your kundli and birth details">
        <Bullets
          items={[
            "They are used only to prepare your reading and the bracelet that follows.",
            "Only the astrologer assigned to you and the staff fulfilling the order can open them.",
            "Uploaded kundli files are stored encrypted and are not indexed or searchable by name.",
            "They are never sold, rented, or shared with advertisers, matchmaking services or data brokers.",
            "You can ask us to delete them at any time, even while keeping your order record.",
          ]}
        />
        <Callout title="Astrologers who work with us">
          <p className="text-sm leading-6 text-[#6d6259]">
            Some astrologers are independent consultants rather than employees. Each one is bound by a
            written confidentiality agreement, sees only the details needed for your reading, and may not
            keep a copy after the reading is delivered.
          </p>
        </Callout>
      </Section>

      <Section id="sharing" title="Who else sees it">
        <DataTable
          headers={["Who", "What they get", "Why"]}
          rows={[
            ["Astrologer assigned to you", "Birth details, stone preferences, your notes", "To prepare the recommendation"],
            ["Payment gateway", "Amount, order id, your name and contact", "To process payment securely"],
            ["Courier partner", "Name, address, phone number", "To deliver the parcel"],
            ["Communication tools", "Phone number or email", "To send order updates on WhatsApp, SMS and email"],
            ["Analytics and hosting providers", "Technical data, usage events", "To run and improve the site"],
            ["Government authorities", "Only what is legally demanded", "When required by law or a valid court order"],
          ]}
        />
        <p>
          Each provider is contractually restricted to using the data only for the service they provide to
          us. Where data is processed outside India, we require equivalent safeguards.
        </p>
      </Section>

      <Section id="retention" title="How long we keep it">
        <Bullets
          items={[
            "Order and invoice records: eight years, as tax law requires.",
            "Birth details and kundli files: until your order is complete plus twelve months, so repeat or replacement pieces can be matched — or sooner if you ask us to delete them.",
            "Unpaid recommendations: seven days, then deleted automatically.",
            "Support messages: three years.",
            "Marketing consent records: until you withdraw consent, plus a short record that you did.",
          ]}
        />
      </Section>

      <Section id="rights" title="Your rights">
        <p>Under the DPDP Act, 2023 you can ask us to:</p>
        <Bullets
          items={[
            "confirm what data we hold about you and give you a copy;",
            "correct anything inaccurate or incomplete;",
            "erase data we no longer need for the purpose you gave it for;",
            "withdraw consent, including for marketing messages;",
            "nominate someone to exercise these rights if you die or become incapacitated.",
          ]}
        />
        <p>
          Write to <a href={`mailto:${STORE.privacyEmail}`}>{STORE.privacyEmail}</a> from the email or phone
          number on your order. We respond within 30 days. We may keep what tax or legal obligations
          require even after an erasure request, and we’ll tell you what that is.
        </p>
        <Callout title={`${STORE.dataProtectionOfficer.name} — data protection contact`}>
          <p className="text-sm leading-6 text-[#6d6259]">
            {STORE.dataProtectionOfficer.email}
            <br />
            Unhappy with our answer? You can complain to the Data Protection Board of India.
          </p>
        </Callout>
      </Section>

      <Section id="security" title="How we protect it">
        <Bullets
          items={[
            "Traffic to the site is encrypted with HTTPS and uploaded files are encrypted at rest.",
            "Access is restricted by role — support staff can’t browse birth details they aren’t working on.",
            "We never store full card numbers, CVVs or UPI PINs. Those stay with the payment gateway.",
            "Access is logged and reviewed, and our team is trained on handling personal data.",
            "If a breach affects your data, we notify you and the Data Protection Board as the law requires.",
          ]}
        />
        <p>
          No system is perfectly secure. Please don’t share your order id publicly, and be wary of anyone
          asking for a payment or an OTP on our behalf — we never ask for an OTP.
        </p>
      </Section>

      <Section id="cookies" title="Cookies">
        <p>
          Essential cookies keep your cart and form draft working and can’t be switched off. Analytics
          cookies tell us which pages people struggle with. Marketing cookies, if enabled, measure ad
          performance. You choose your preferences in the cookie banner and can change them at any time in
          your browser settings.
        </p>
      </Section>

      <Section id="children" title="Children">
        <p>
          Our site is for people aged {POLICY.minimumAgeYears} and over. We don’t knowingly process a
          child’s data without verifiable parental consent, and we don’t track or advertise to children. A
          reading for a child must be requested by a parent or guardian using their own account. If you
          believe a child’s data reached us, write to {STORE.privacyEmail} and we’ll delete it.
        </p>
      </Section>

      <Section id="changes" title="Changes and contact">
        <p>
          We update this policy when our practices change, and the date at the top always reflects the
          current version. Material changes are notified by email or a notice on the site. Continuing to
          use the site afterwards means you accept the updated policy.
        </p>
        <p>
          Questions: <a href={`mailto:${STORE.privacyEmail}`}>{STORE.privacyEmail}</a>. Our{" "}
          <Link href="/terms-conditions">terms & conditions</Link> govern everything else about buying from
          us.
        </p>
      </Section>
    </PolicyPage>
  );
}