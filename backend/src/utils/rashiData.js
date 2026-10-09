// id, name, english: frontend ke data/Rashibracelets.ts ke RASHIS se same
export const RASHIS = [
  { id: "mesh", name: "Mesh", english: "Aries", element: "Fire", planet: "Mars" },
  { id: "vrishabh", name: "Vrishabh", english: "Taurus", element: "Earth", planet: "Venus" },
  { id: "mithun", name: "Mithun", english: "Gemini", element: "Air", planet: "Mercury" },
  { id: "kark", name: "Kark", english: "Cancer", element: "Water", planet: "Moon" },
  { id: "singh", name: "Singh", english: "Leo", element: "Fire", planet: "Sun" },
  { id: "kanya", name: "Kanya", english: "Virgo", element: "Earth", planet: "Mercury" },
  { id: "tula", name: "Tula", english: "Libra", element: "Air", planet: "Venus" },
  { id: "vrishchik", name: "Vrishchik", english: "Scorpio", element: "Water", planet: "Mars" },
  { id: "dhanu", name: "Dhanu", english: "Sagittarius", element: "Fire", planet: "Jupiter" },
  { id: "makar", name: "Makar", english: "Capricorn", element: "Earth", planet: "Saturn" },
  { id: "kumbh", name: "Kumbh", english: "Aquarius", element: "Air", planet: "Saturn" },
  { id: "meen", name: "Meen", english: "Pisces", element: "Water", planet: "Jupiter" },
];

export const RASHI_BY_ID = new Map(RASHIS.map((r) => [r.id, r]));