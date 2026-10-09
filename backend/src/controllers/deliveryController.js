// ⚠️ Ye rule-based estimate hai. Real courier (Shiprocket / Delhivery) API lagne tak kaam chalata hai.
// Metro pincode prefixes: Delhi 11, Mumbai 40, Bengaluru 56, Chennai 60, Kolkata 70, Hyderabad 50, Ahmedabad 38
const METRO_PREFIXES = new Set(["11", "40", "56", "60", "70", "50", "38"]);

// GET /api/delivery/check?pincode=400001
export function checkDelivery(req, res) {
  const pincode = String(req.query.pincode ?? "").trim();

  // Indian pincode: 6 digit, pehla digit 1-8
  if (!/^[1-8]\d{5}$/.test(pincode)) {
    return res.status(400).json({ serviceable: false, message: "Please enter a valid 6-digit pincode." });
  }

  const days = METRO_PREFIXES.has(pincode.slice(0, 2)) ? 3 : 5;
  const eta = new Date();
  eta.setDate(eta.getDate() + days);

  res.json({ serviceable: true, days, etaDate: eta.toISOString() });
}