// src/data/Storeinfo.ts
//
// Every support and policy page reads from here. Change a phone number or a
// return window once and all seven pages stay in sync.

export const STORE = {
  /** Trading name shown to customers. */
  name: "NavGrah Gems",
  /** Registered legal entity — must match your GST / incorporation papers. */
  legalName: "NavGrah Gems Private Limited",
  website: "https://navgrahgems.example",

  supportEmail: "support@navgrahgems.example",
  ordersEmail: "orders@navgrahgems.example",
  privacyEmail: "privacy@navgrahgems.example",

  /** E.164 for links, pretty version for display. */
  phoneE164: "+919876543210",
  phoneDisplay: "+91 98765 43210",
  whatsappE164: "+919876543210",

  supportHours: "Monday to Saturday, 10am to 7pm IST",

  address: {
    line1: "Unit 14, Pearl Business Centre",
    line2: "Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400069",
    country: "India",
  },

  gstin: "27AAAAA0000A1Z5",
  cin: "U36910MH2024PTC000000",

  /** Required by the Consumer Protection (E-Commerce) Rules, 2020. */
  grievanceOfficer: {
    name: "Ms. Ananya Rao",
    designation: "Grievance Officer",
    email: "grievance@navgrahgems.example",
    phone: "+91 98765 43211",
    responseWindow: "48 hours",
    resolutionWindow: "30 days",
  },

  /** Also the Data Protection Officer contact under the DPDP Act, 2023. */
  dataProtectionOfficer: {
    name: "Mr. Vikram Shetty",
    email: "privacy@navgrahgems.example",
  },

  jurisdiction: "Mumbai, Maharashtra",
  governingLaw: "the laws of India",
} as const;

export const POLICY = {
  /** How long a customer can cancel a made-to-order bracelet. */
  cancellationWindowHours: 24,
  /** Days from delivery to raise a damage or wrong-item claim. */
  returnWindowDays: 7,
  /** Hours from delivery within which an unboxing video is accepted. */
  damageClaimHours: 48,
  /** Working days for a refund to land after approval. */
  refundWorkingDays: "5 to 7",
  /** Dispatch time after the astrologer's design is approved. */
  dispatchWorkingDays: "3 to 5",
  /** Delivery time after dispatch, metro vs rest of India. */
  deliveryMetroDays: "2 to 4",
  deliveryRestOfIndiaDays: "4 to 8",
  freeShippingAbove: 999,
  standardShippingFee: 79,
  codFee: 49,
  minimumAgeYears: 18,
} as const;

export const LAST_UPDATED = "18 September 2026";

export interface PolicyLink {
  href: string;
  title: string;
  blurb: string;
}

/** Used for cross-links at the bottom of every page and in the footer. */
export const POLICY_LINKS: PolicyLink[] = [
  { href: "/help", title: "Help & support", blurb: "Common questions and how to reach a human." },
  { href: "/order-tracking", title: "Order tracking", blurb: "See where your bracelet has got to." },
  { href: "/shipping-delivery", title: "Shipping & delivery", blurb: "Timelines, charges and areas we cover." },
  { href: "/returns-refunds", title: "Returns & refunds", blurb: "What can be returned, and how money comes back." },
  { href: "/cancellation-policy", title: "Cancellation policy", blurb: "Changing your mind before the bracelet is made." },
  { href: "/privacy-policy", title: "Privacy policy", blurb: "What we collect, why, and your rights over it." },
  { href: "/terms-conditions", title: "Terms & conditions", blurb: "The rules for buying from us." },
];

export function formatAddress(): string {
  const a = STORE.address;
  return [a.line1, a.line2, `${a.city} ${a.postalCode}`, a.state, a.country].join(", ");
}