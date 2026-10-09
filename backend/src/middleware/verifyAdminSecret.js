import crypto from "crypto";
import { env } from "../config/env.js";

function safeEqual(a, b) {
  const A = Buffer.from(a || "");
  const B = Buffer.from(b || "");
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}

export function verifyAdminSecret(req, res, next) {
  // Dono formats support: x-admin-secret: XXX  ya  Authorization: Bearer XXX
  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const provided = (req.headers["x-admin-secret"] || bearer || "").trim();

  if (!safeEqual(provided, env.adminSyncSecret)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}