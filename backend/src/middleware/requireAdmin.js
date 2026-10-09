import crypto from "node:crypto";

export function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_SYNC_SECRET || "";
  const given = String(req.get("x-admin-secret") || "");

  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  const ok = expected.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!ok) return res.status(401).json({ message: "Unauthorized" });
  next();
}