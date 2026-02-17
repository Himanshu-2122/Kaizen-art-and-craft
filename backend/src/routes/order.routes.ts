import { Router } from "express";
import { addToCart } from "../controllers/cart.controller";
import { checkout, getMyOrders, getAllOrders } from "../controllers/order.controller";
import { protect, isAdmin } from "../middleware/auth.middleware";

const router = Router();

// cart
router.post("/cart", protect, addToCart);

// checkout
router.post("/checkout", protect, checkout);

// my orders
router.get("/my", protect, getMyOrders);

// get all orders (admin)
router.get("/", protect, isAdmin, getAllOrders);

export default router;
