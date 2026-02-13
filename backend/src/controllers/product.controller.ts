import { Request, Response } from "express";
import mongoose from "mongoose";
import slugify from "slugify";
import { Product } from "../models/product.model";

/* ======================================================
   Helpers
====================================================== */

const getParam = (value: string | string[]) =>
  Array.isArray(value) ? value[0] : value;


/* ======================================================
   CREATE PRODUCT (Admin)
====================================================== */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      stock = 0,
      sizes = [],
      images = [],
      category,
      collectionId,
      featured = false,
      bestSeller = false
    } = req.body;

    /* ---------- validation ---------- */
    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required"
      });
    }

    /* ---------- slug ---------- */
    const slug = slugify(`${name}-${Date.now()}`, {
      lower: true,
      strict: true
    });

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      discountPrice,
      stock,
      sizes,
      images,
      category: category.toLowerCase(),
      collectionId,
      featured,
      bestSeller,
      isActive: true
    });

    res.status(201).json(product);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



/* ======================================================
   UPDATE PRODUCT
====================================================== */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    if (req.body.name) {
      req.body.slug = slugify(req.body.name, {
        lower: true,
        strict: true
      });
    }

    if (req.body.category) {
      req.body.category = req.body.category.toLowerCase();
    }

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



/* ======================================================
   DELETE PRODUCT (Soft Delete)
====================================================== */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);

    await Product.findByIdAndUpdate(id, { isActive: false });

    res.json({ message: "Product removed successfully" });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



/* ======================================================
   GET PRODUCTS (Filters + Pagination)
====================================================== */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      collectionId,
      featured,
      bestSeller,
      search,
      page = 1,
      limit = 50
    } = req.query;

    const filter: any = { isActive: true };

    /* ---------- filters ---------- */

    if (category) {
      filter.category = String(category).toLowerCase();
    }

    if (collectionId) {
      filter.collectionId = collectionId;
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (bestSeller !== undefined) {
      filter.bestSeller = bestSeller === "true";
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    /* ---------- pagination ---------- */

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .populate("collectionId", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();   // ⭐ faster

    const total = await Product.countDocuments(filter);

    res.json({
      products,  // always array
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



/* ======================================================
   GET PRODUCT BY ID
====================================================== */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findOne({
      _id: id,
      isActive: true
    })
      .populate("collectionId", "name slug")
      .lean();

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



/* ======================================================
   GET PRODUCT BY SLUG (SEO Friendly)
====================================================== */
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const slug = getParam(req.params.slug);

    const product = await Product.findOne({
      slug,
      isActive: true
    })
      .populate("collectionId", "name slug")
      .lean();

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
