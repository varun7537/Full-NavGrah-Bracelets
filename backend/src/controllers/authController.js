import User from "../models/User.js";
import { sendOtp, verifyOtp } from "../services/otp.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/authToken.js";

function normPhone(v) {
  let d = String(v ?? "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

const cleanName = (v) => String(v ?? "").trim().replace(/\s+/g, " ").slice(0, 100);

export const publicUser = (u) => ({
  id: String(u._id),
  name: u.name,
  phone: u.phone,
  email: u.email || "",
  address: u.address || "",
  pincode: u.pincode || "",
  createdAt: u.createdAt,
});

// POST /api/auth/send-otp   body: { name, phone }
export async function sendOtpHandler(req, res) {
  try {
    const phone = normPhone(req.body?.phone);
    const name = cleanName(req.body?.name);

    if (name.length < 2) return res.status(400).json({ message: "Please enter your name." });
    if (!phone) return res.status(400).json({ message: "Enter a valid 10-digit mobile number." });

    const result = await sendOtp(phone);
    if (!result.ok) return res.status(result.status).json({ message: result.message });

    res.json({ ok: true, resendIn: 30 });
  } catch (err) {
    console.error("send-otp error:", err.message);
    res.status(502).json({ message: "Could not send OTP right now. Please try again." });
  }
}

// POST /api/auth/verify-otp   body: { name, phone, otp }
export async function verifyOtpHandler(req, res) {
  try {
    const phone = normPhone(req.body?.phone);
    const otp = String(req.body?.otp ?? "").trim();
    const name = cleanName(req.body?.name);

    if (!phone) return res.status(400).json({ message: "Enter a valid 10-digit mobile number." });
    if (!/^\d{6}$/.test(otp)) return res.status(400).json({ message: "Enter the 6-digit OTP." });
    if (name.length < 2) return res.status(400).json({ message: "Please enter your name." });

    const result = await verifyOtp(phone, otp);
    if (!result.ok) return res.status(result.status).json({ message: result.message });

    // Naya user ban jata hai (naam sirf pehli baar save hota hai), purane ka naam nahi badalta
    const user = await User.findOneAndUpdate(
      { phone },
      { $set: { phoneVerifiedAt: new Date(), lastLoginAt: new Date() }, $setOnInsert: { name } },
      { upsert: true, new: true }
    ).lean();

    setAuthCookie(res, signToken(user._id));
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
}

// GET /api/auth/me
export function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

// POST /api/auth/logout
export function logout(_req, res) {
  clearAuthCookie(res);
  res.json({ ok: true });
}

// PATCH /api/auth/me   body: { name?, email?, address?, pincode? }  (phone badal nahi sakta)
export async function updateMe(req, res) {
  try {
    const b = req.body || {};
    const update = {};

    if (b.name !== undefined) {
      const name = cleanName(b.name);
      if (name.length < 2) return res.status(400).json({ message: "Please enter your name." });
      update.name = name;
    }
    if (b.email !== undefined) {
      const email = String(b.email).trim().toLowerCase().slice(0, 254);
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        return res.status(400).json({ message: "Enter a valid email." });
      }
      update.email = email;
    }
    if (b.address !== undefined) update.address = String(b.address).trim().slice(0, 300);
    if (b.pincode !== undefined) {
      const pin = String(b.pincode).trim();
      if (pin && !/^[1-8]\d{5}$/.test(pin)) return res.status(400).json({ message: "Enter a valid 6-digit pincode." });
      update.pincode = pin;
    }
    if (Object.keys(update).length === 0) return res.status(400).json({ message: "Nothing to update." });

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).lean();
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update profile." });
  }
}