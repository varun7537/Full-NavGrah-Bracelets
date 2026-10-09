import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { uploadKundli } from "../middleware/upload.js";
import {
  getProduct,
  createRequest,
  listRequests,
  downloadKundli,
  updateRequest,
  deleteRequest,
  manualSyncCustomProduct,
} from "../controllers/customBraceletController.js";

const router = Router();

// Public form hai (naam, phone, file leta hai), isliye spam se bachao: ek IP se 1 ghante me 10 requests.
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again after some time." },
});

router.get("/product", getProduct);
router.post("/requests", submitLimiter, uploadKundli, createRequest);

// Admin
router.post("/sync", requireAdmin, manualSyncCustomProduct);
router.get("/requests", requireAdmin, listRequests);
router.get("/requests/:id/kundli", requireAdmin, downloadKundli);
router.patch("/requests/:id", requireAdmin, updateRequest);
router.delete("/requests/:id", requireAdmin, deleteRequest);

export default router;