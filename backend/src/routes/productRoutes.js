import { Router } from "express";
import {
  listProducts,
  listFeatured,
  getProduct,
  createReview,
  moderateReview,
  listPendingReviews,
  requestNotify,
  manualSyncProducts,
} from "../controllers/productController.js";
import { verifyAdminSecret } from "../middleware/verifyAdminSecret.js";
import { syncAllProducts } from "../services/productSync.js";

const router = Router();

router.get("/", listProducts);
router.get("/featured", listFeatured);
router.post("/sync", verifyAdminSecret, async (req, res) => {
  try {
    const result = await syncAllProducts();
    res.json({ ok: true, ...result });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// "reviews/..." wale fixed paths pehle, "/:productId" baad me
router.get("/reviews/pending", listPendingReviews);
router.patch("/reviews/:reviewId", moderateReview);

router.get("/:productId", getProduct);
router.post("/:productId/reviews", createReview);
router.post("/:productId/notify", requestNotify);

export default router;