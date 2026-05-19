import { Router } from "express";
import {
  signup,
  login,
  refresh,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
} from "../controllers/auth.controller";
import { protect, isAdmin } from "../middleware/auth.middleware";

const router = Router();

/* ── PUBLIC ── */
router.post("/signup",  signup);
router.post("/login",   login);
router.post("/logout",  logout);
router.post("/refresh", refresh);

/* ── PRIVATE ── */
router.get("/profile",         protect, getProfile);
router.put("/profile",         protect, updateProfile);
router.put("/change-password", protect, changePassword);

/* ── ADMIN ── */
router.get("/admin", protect, isAdmin, (_req, res) => {
  res.json({ message: "Welcome Admin" });
});
router.get("/users", protect, isAdmin, getAllUsers);

export default router;
