import { Router } from "express";
import { addToCart } from "../controllers/cart.controller";
import { checkout, getMyOrders } from "../controllers/order.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// cart
router.post("/cart", protect, addToCart);

// checkout
router.post("/checkout", protect, checkout);

// my orders
router.get("/my", protect, getMyOrders);

export default router;
