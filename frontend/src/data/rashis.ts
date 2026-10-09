// src/data/rashis.ts

export type RashiElement = "Fire" | "Earth" | "Air" | "Water";

export interface Rashi {
  id: string;
  sanskrit: string;
  english: string;
  glyph: string;
  element: RashiElement;
  /** The gemstone most associated with this rashi's bracelets. */
  gemstone: string;
  dateRange: string;
}

export const ELEMENT_COLORS: Record<RashiElement, string> = {
  Fire: "#A63333",
  Earth: "#256B4A",
  Air: "#B4791E",
  Water: "#34507D",
};

/** The 12 rashis, in wheel order starting from Mesha. */
export const RASHIS: Rashi[] = [
  {
    id: "mesha",
    sanskrit: "Mesha",
    english: "Aries",
    glyph: "\u2648",
    element: "Fire",
    gemstone: "Red Jasper",
    dateRange: "Mar 21 – Apr 19",
  },
  {
    id: "vrishabha",
    sanskrit: "Vrishabha",
    english: "Taurus",
    glyph: "\u2649",
    element: "Earth",
    gemstone: "Rose Quartz",
    dateRange: "Apr 20 – May 20",
  },
  {
    id: "mithuna",
    sanskrit: "Mithuna",
    english: "Gemini",
    glyph: "\u264A",
    element: "Air",
    gemstone: "Citrine",
    dateRange: "May 21 – Jun 20",
  },
  {
    id: "karka",
    sanskrit: "Karka",
    english: "Cancer",
    glyph: "\u264B",
    element: "Water",
    gemstone: "Moonstone",
    dateRange: "Jun 21 – Jul 22",
  },
  {
    id: "simha",
    sanskrit: "Simha",
    english: "Leo",
    glyph: "\u264C",
    element: "Fire",
    gemstone: "Tiger's Eye",
    dateRange: "Jul 23 – Aug 22",
  },
  {
    id: "kanya",
    sanskrit: "Kanya",
    english: "Virgo",
    glyph: "\u264D",
    element: "Earth",
    gemstone: "Amazonite",
    dateRange: "Aug 23 – Sep 22",
  },
  {
    id: "tula",
    sanskrit: "Tula",
    english: "Libra",
    glyph: "\u264E",
    element: "Air",
    gemstone: "Lapis Lazuli",
    dateRange: "Sep 23 – Oct 22",
  },
  {
    id: "vrishchika",
    sanskrit: "Vrishchika",
    english: "Scorpio",
    glyph: "\u264F",
    element: "Water",
    gemstone: "Garnet",
    dateRange: "Oct 23 – Nov 21",
  },
  {
    id: "dhanu",
    sanskrit: "Dhanu",
    english: "Sagittarius",
    glyph: "\u2650",
    element: "Fire",
    gemstone: "Turquoise",
    dateRange: "Nov 22 – Dec 21",
  },
  {
    id: "makara",
    sanskrit: "Makara",
    english: "Capricorn",
    glyph: "\u2651",
    element: "Earth",
    gemstone: "Black Onyx",
    dateRange: "Dec 22 – Jan 19",
  },
  {
    id: "kumbha",
    sanskrit: "Kumbha",
    english: "Aquarius",
    glyph: "\u2652",
    element: "Air",
    gemstone: "Amethyst",
    dateRange: "Jan 20 – Feb 18",
  },
  {
    id: "meena",
    sanskrit: "Meena",
    english: "Pisces",
    glyph: "\u2653",
    element: "Water",
    gemstone: "Aquamarine",
    dateRange: "Feb 19 – Mar 20",
  },
];