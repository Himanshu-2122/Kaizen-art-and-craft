import { Router } from "express";
import {
  signup,
  login,
  // refresh,
  logout,
  getProfile,
  updateProfile,
  getAllUsers
} from "../controllers/auth.controller";

import {
  protect,
  isAdmin
} from "../middleware/auth.middleware";

import { AuthRequest } from "../type/request";
import { User } from "../models/user.model";

const router = Router();


// ========================
// PUBLIC ROUTES
// ========================

router.post("/signup", signup);
router.post("/login", login);

router.post("/logout", logout);
// router.post("/refresh", refresh);
// router.post("/logout", logout);


// ========================
// PRIVATE ROUTES
// ========================

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);



// ========================
// ADMIN ROUTES
// ========================

router.get("/admin", protect, isAdmin, (_req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/users", protect, isAdmin, getAllUsers);


export default router;
