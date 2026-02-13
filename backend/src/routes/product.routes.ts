import express from "express";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller";

const router = express.Router();

/* ⭐ IMPORTANT ORDER */

router.get("/slug/:slug", getProductBySlug);  // first
router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
