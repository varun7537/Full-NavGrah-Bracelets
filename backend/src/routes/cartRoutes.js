import { Router } from "express";
import { resolveCart, quoteCart } from "../controllers/cartController.js";

const router = Router();

router.post("/resolve", resolveCart);
router.post("/quote", quoteCart);

export default router;