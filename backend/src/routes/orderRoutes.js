import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireUser } from "../middleware/auth.js";
import {
  createOrder,
  submitPayment,
  orderStatus,
  refreshQr,
  listMyOrders,
  listOrders,
  updateOrder,
  trackOrder,
} from "../controllers/orderController.js";

const router = Router();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

// Public
router.get("/track/:reference", trackLimiter, trackOrder);

// Customer (login zaroori)
router.get("/mine", requireUser, listMyOrders);
router.post("/", limiter, requireUser, createOrder);
router.get("/:reference/status", requireUser, orderStatus); // polling, isliye limiter nahi
router.post("/:reference/qr", limiter, requireUser, refreshQr);
router.post("/:reference/payment", limiter, requireUser, submitPayment);

// Admin
router.get("/", requireAdmin, listOrders);
router.patch("/:reference", requireAdmin, updateOrder);

export default router;