// src/data/braceletJourney.ts

export type JourneyStageId =
  | "token"
  | "consultation"
  | "details"
  | "stones"
  | "report"
  | "final-payment";

export type JourneyStageKind =
  | "payment"
  | "standard"
  | "stones"
  | "report";

export type JourneyStage = {
  id: JourneyStageId;
  number: number;
  title: string;
  description: string;
  statusLabel: string;
  kind: JourneyStageKind;
  checklist?: string[];
};

export type ProgressLegendItem = string;

export type SampleStone = {
  id: string;
  stone: string;
  planet: string;
  benefit: string;
  note: string;
};

/**
 * Labels shown in the progress indicator.
 */
export const PROGRESS_LEGEND: ProgressLegendItem[] = [
  "₹150 Token",
  "Astrologer Consultation",
  "Kundli & Details",
  "Stone Recommendation",
  "Astrology Report",
  "Final Payment",
];

/**
 * Main customized bracelet journey.
 *
 * Customer flow:
 *
 * 1. Customer pays ₹150 token
 * 2. Customer reaches astrology consultation
 * 3. Astrologer collects Kundli + personal details
 * 4. Astrologer analyses planets and recommends stones
 * 5. Personalized astrology report is prepared
 * 6. Customer makes the remaining bracelet payment
 */
export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "token",
    number: 1,
    title: "Pay ₹150 Token",
    description:
      "Begin your customized bracelet journey with a ₹150 token payment. This confirms your consultation request and starts the process.",
    statusLabel: "Start Here",
    kind: "payment",
  },

  {
    id: "consultation",
    number: 2,
    title: "Astrologer Consultation",
    description:
      "After the token payment, you are connected with our astrology team. An astrologer understands your concerns, goals, and requirements.",
    statusLabel: "Expert Guidance",
    kind: "standard",
    checklist: [
      "Discuss your requirements",
      "Understand your concerns",
      "Astrologer-guided consultation",
      "Personalized approach",
    ],
  },

  {
    id: "details",
    number: 3,
    title: "Share Your Kundli & Details",
    description:
      "Your astrologer collects the information needed for your personalized analysis, including your Kundli, birth details, and other relevant requirements.",
    statusLabel: "Personalized Analysis",
    kind: "standard",
    checklist: [
      "Kundli / birth chart",
      "Date of birth",
      "Time of birth",
      "Place of birth",
      "Personal requirements",
      "Current concerns",
    ],
  },

  {
    id: "stones",
    number: 4,
    title: "Gemstone & Bracelet Recommendation",
    description:
      "Your astrologer studies your Kundli and planetary influences to identify suitable gemstones and create a bracelet recommendation specifically for you.",
    statusLabel: "Customized for You",
    kind: "stones",
  },

  {
    id: "report",
    number: 5,
    title: "Receive Your Astrology Report",
    description:
      "Once the analysis is complete, your personalized astrology report explains the recommendations and the gemstones selected for your customized bracelet.",
    statusLabel: "Report Ready",
    kind: "report",
  },

  {
    id: "final-payment",
    number: 6,
    title: "Make the Final Payment",
    description:
      "After your personalized recommendation and report are finalized, you pay the remaining bracelet amount. Your customized bracelet can then move forward for preparation.",
    statusLabel: "Complete Your Order",
    kind: "payment",
  },
];

/**
 * Illustrative gemstone recommendations used only for
 * demonstrating the UI.
 *
 * These are examples and should NOT be treated as actual
 * recommendations for a customer.
 */
export const SAMPLE_STONES: SampleStone[] = [
  {
    id: "ruby",
    stone: "Ruby",
    planet: "Sun",
    benefit: "Traditionally associated with confidence, vitality, and leadership.",
    note: "Illustrative example",
  },
  {
    id: "yellow-sapphire",
    stone: "Yellow Sapphire",
    planet: "Jupiter",
    benefit: "Traditionally associated with wisdom, growth, and prosperity.",
    note: "Illustrative example",
  },
  {
    id: "emerald",
    stone: "Emerald",
    planet: "Mercury",
    benefit: "Traditionally associated with communication, learning, and clarity.",
    note: "Illustrative example",
  },
  {
    id: "blue-sapphire",
    stone: "Blue Sapphire",
    planet: "Saturn",
    benefit: "Traditionally associated with discipline, focus, and responsibility.",
    note: "Illustrative example",
  },
];