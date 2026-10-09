import { Router } from "express";
import {
  listPosts,
  getPost,
  getRelated,
  incrementView,
  manualSync,
} from "../controllers/blogController.js";

const router = Router();

router.get("/", listPosts);
router.post("/sync", manualSync);
router.get("/:slug/related", getRelated);
router.post("/:slug/view", incrementView);
router.get("/:slug", getPost);

export default router;