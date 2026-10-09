import { Router } from "express";
import rateLimit from "express-rate-limit";
import { optionalUser } from "../middleware/auth.js";
import { chat } from "../controllers/chatController.js";

const router = Router();

// API ka kharcha aur spam rokne ke liye: ek IP se 10 minute me 30 messages
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages. Please wait a few minutes." },
});

router.post("/", limiter, optionalUser, chat);

export default router;