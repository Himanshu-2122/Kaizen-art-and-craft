import { Request, Response } from "express";
import { Collection } from "../models/category.model";
import { Product } from "../models/product.model";

/* ---------------- GET ALL CATEGORIES ---------------- */
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Collection.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* -------- GET PRODUCTS BY CATEGORY -------- */
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const filtered = await Product.find({ categoryId: id });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
