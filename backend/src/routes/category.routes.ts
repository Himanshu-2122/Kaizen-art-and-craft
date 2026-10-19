import { Router } from "express";
import {
  getAllCategories,
  getCategoryByIdOrSlug,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { protect, isAdmin } from "../middleware/auth.middleware";
import { uploadImages } from "../middleware/upload";

const router = Router();

/* ---------- PUBLIC ---------- */
router.get("/", getAllCategories);
router.get("/:id", getCategoryByIdOrSlug);
router.get("/:id/products", getProductsByCategory);

/* ---------- ADMIN ---------- */
router.post("/", protect, isAdmin, uploadImages.single("image"), createCategory);
router.put("/:id", protect, isAdmin, uploadImages.single("image"), updateCategory);
router.delete("/:id", protect, isAdmin, deleteCategory);

export default router;
