import { Router } from "express";
import { addToCart } from "../controllers/cart.controller";
import { checkout, getMyOrders, getAllOrders, updateOrderStatus } from "../controllers/order.controller";
import { protect, isAdmin } from "../middleware/auth.middleware";

const router = Router();

router.post("/cart",           protect,           addToCart);
router.post("/checkout",       protect,           checkout);
router.get("/my",              protect,           getMyOrders);
router.get("/",                protect, isAdmin,  getAllOrders);
router.patch("/:id/status",   protect, isAdmin,  updateOrderStatus);

export default router;
