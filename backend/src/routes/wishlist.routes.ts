import express from "express";
import Wishlist from "../models/wishlist.model";
import { AuthRequest } from "../type/request";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

/* ================= GET USER WISHLIST ================= */
router.get("/", protect, async (req: AuthRequest, res) => {
  try {

    const items = await Wishlist.find({ userId: req.user!.id })
      .populate("productId")
      .lean();

    res.status(200).json(items);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load wishlist" });
  }
});

/* ================= ADD TO WISHLIST ================= */
router.post("/", protect, async (req: AuthRequest, res) => {
  try {

    const { productId } = req.body;

    if (!productId)
      return res.status(400).json({ message: "productId is required" });

    const exists = await Wishlist.findOne({
      userId: req.user!.id,
      productId,
    });

    if (exists)
      return res.status(200).json(exists);

    const item = await Wishlist.create({
      userId: req.user!.id,
      productId,
    });

    res.status(201).json(item);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add wishlist" });
  }
});

/* ================= REMOVE FROM WISHLIST ================= */
router.delete("/:productId", protect, async (req: AuthRequest, res) => {
  try {

    const { productId } = req.params;

    await Wishlist.deleteOne({
      userId: req.user!.id,
      productId,
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove wishlist" });
  }
});

export default router;
