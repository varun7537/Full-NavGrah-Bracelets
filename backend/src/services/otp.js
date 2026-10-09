import crypto from "node:crypto";
import OtpCode from "../models/OtpCode.js";
import { sendSms } from "./notify.js";

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_MS = 30 * 1000;
const MAX_PER_HOUR = 5;
const MAX_ATTEMPTS = 5;

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error("JWT_SECRET missing or too short");
  return s;
}

const hash = (phone, otp) =>
  crypto.createHmac("sha256", secret()).update(`${phone}:${otp}`).digest("hex");

/** phone: 10 digit. Dev me (SMS keys ke bina) OTP backend terminal me print hota hai. */
export async function sendOtp(phone) {
  const now = Date.now();
  const rec = await OtpCode.findOne({ phone }).lean();

  if (rec) {
    const sinceLast = now - new Date(rec.lastSentAt).getTime();
    if (sinceLast < RESEND_MS) {
      const wait = Math.ceil((RESEND_MS - sinceLast) / 1000);
      return { ok: false, status: 429, message: `Please wait ${wait}s before requesting another OTP.` };
    }
  }

  const windowFresh = rec && now - new Date(rec.hourStart).getTime() < 60 * 60 * 1000;
  const sentInHour = windowFresh ? rec.sentInHour : 0;
  if (sentInHour >= MAX_PER_HOUR) {
    return { ok: false, status: 429, message: "Too many OTP requests. Please try again after some time." };
  }

  // Production me SMS provider na ho to OTP logs me leak na ho
  if (process.env.NODE_ENV === "production" && !process.env.MSG91_AUTHKEY) {
    throw new Error("SMS provider not configured");
  }

  const otp = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");

  // Pehle bhejo. SMS fail ho to cooldown na lage.
  await sendSms(`91${phone}`, process.env.MSG91_TEMPLATE_OTP, { otp });

  await OtpCode.updateOne(
    { phone },
    {
      $set: {
        codeHash: hash(phone, otp),
        expiresAt: new Date(now + OTP_TTL_MS),
        attempts: 0,
        lastSentAt: new Date(now),
        hourStart: windowFresh ? rec.hourStart : new Date(now),
        sentInHour: sentInHour + 1,
        purgeAt: new Date(now + 24 * 60 * 60 * 1000),
      },
    },
    { upsert: true }
  );

  return { ok: true };
}

export async function verifyOtp(phone, otp) {
  // Pehle attempt count badhao (atomic), phir compare. Parallel guessing se bachata hai.
  const rec = await OtpCode.findOneAndUpdate(
    { phone, codeHash: { $ne: "" }, expiresAt: { $gt: new Date() }, attempts: { $lt: MAX_ATTEMPTS } },
    { $inc: { attempts: 1 } },
    { new: true }
  ).lean();

  if (!rec) {
    return { ok: false, status: 400, message: "OTP expired or too many wrong attempts. Please request a new OTP." };
  }

  const a = Buffer.from(rec.codeHash);
  const b = Buffer.from(hash(phone, otp));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    const left = MAX_ATTEMPTS - rec.attempts;
    return { ok: false, status: 400, message: `Wrong OTP. ${left} attempt${left === 1 ? "" : "s"} left.` };
  }

  // Ek OTP sirf ek baar chalta hai
  await OtpCode.updateOne({ phone }, { $set: { codeHash: "", expiresAt: new Date(0) } });
  return { ok: true };
}