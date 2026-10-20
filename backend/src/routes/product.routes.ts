import express from "express";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  checkAvailability
} from "../controllers/product.controller";
import { protect, isAdmin } from "../middleware/auth.middleware";
import { uploadImages } from "../middleware/upload";
import { imageOptimizer } from "../middleware/imageOptimizer";

const router = express.Router();

/* ---------- PUBLIC ---------- */
router.get("/slug/:slug", getProductBySlug);
router.get("/", getProducts);
router.get("/:id", getProductById);

/* ---------- AVAILABILITY CHECK (public) ---------- */
router.post("/:id/check-availability", checkAvailability);

/* ---------- REVIEWS (authenticated) ---------- */
router.post("/:id/reviews", protect, addReview);

/* ---------- ADMIN ---------- */
router.post(
  "/",
  protect,
  isAdmin,
  uploadImages.array("images"),
  imageOptimizer,
  createProduct
);
router.put(
  "/:id",
  protect,
  isAdmin,
  uploadImages.array("images"),
  imageOptimizer,
  updateProduct
);
router.delete("/:id", protect, isAdmin, deleteProduct);

export default router;
