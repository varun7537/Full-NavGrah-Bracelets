import jwt from "jsonwebtoken";

export const AUTH_COOKIE = "ng_token";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error("JWT_SECRET missing or too short (min 32 chars)");
  return s;
}

export const signToken = (userId) => jwt.sign({ sub: String(userId) }, secret(), { expiresIn: "30d" });

export function verifyToken(token) {
  try {
    return jwt.verify(token, secret());
  } catch {
    return null;
  }
}

function cookieOptions() {
  const prod = process.env.NODE_ENV === "production";
  return {
    httpOnly: true, // JavaScript se padha nahi ja sakta (XSS safe)
    secure: prod,
    sameSite: prod ? process.env.COOKIE_SAMESITE || "none" : "lax",
    path: "/",
  };
}

export const setAuthCookie = (res, token) =>
  res.cookie(AUTH_COOKIE, token, { ...cookieOptions(), maxAge: MAX_AGE_MS });

export const clearAuthCookie = (res) => res.clearCookie(AUTH_COOKIE, cookieOptions());