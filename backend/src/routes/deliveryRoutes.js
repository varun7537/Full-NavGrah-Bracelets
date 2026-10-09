import { Router } from "express";
import { checkDelivery } from "../controllers/deliveryController.js";

const router = Router();
router.get("/check", checkDelivery);

export default router;