import User from "../models/User.js";
import { AUTH_COOKIE, verifyToken } from "../utils/authToken.js";

async function loadUser(req) {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload?.sub) return null;
  return User.findById(payload.sub).lean();
}

/** Login zaroori. Nahi hai to 401. */
export async function requireUser(req, res, next) {
  try {
    const user = await loadUser(req);
    if (!user) return res.status(401).json({ message: "Please login first to continue." });
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
}

/** Login ho to req.user milta hai, nahi to null. Error kabhi nahi deta. */
export async function optionalUser(req, _res, next) {
  try {
    req.user = await loadUser(req);
  } catch {
    req.user = null;
  }
  next();
}