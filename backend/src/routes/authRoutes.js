import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireUser } from "../middleware/auth.js";
import { sendOtpHandler, verifyOtpHandler, me, logout, updateMe } from "../controllers/authController.js";

const router = Router();

const limiter = (limit) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts. Please try again in a few minutes." },
  });

router.post("/send-otp", limiter(10), sendOtpHandler);
router.post("/verify-otp", limiter(30), verifyOtpHandler);
router.get("/me", requireUser, me);
router.patch("/me", requireUser, updateMe);
router.post("/logout", logout);

export default router;