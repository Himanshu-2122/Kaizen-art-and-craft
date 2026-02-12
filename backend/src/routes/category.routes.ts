import { Router } from "express";
import {
  getAllCategories,
  getProductsByCategory
} from "../controllers/category.controller";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id/products", getProductsByCategory);

export default router;
