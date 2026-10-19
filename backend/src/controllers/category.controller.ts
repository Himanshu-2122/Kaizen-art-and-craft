import { Request, Response } from "express";
import mongoose from "mongoose";
import slugify from "slugify";
import { Collection } from "../models/category.model";
import { Product } from "../models/product.model";

/* ---------------- GET ALL CATEGORIES ---------------- */
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Collection.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ---------------- GET SINGLE CATEGORY ---------------- */
export const getCategoryByIdOrSlug = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.isValidObjectId(id);
    const category = await Collection.findOne(
      isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ---------------- CREATE CATEGORY (Admin) ---------------- */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, imageUrl, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const trimmedName = name.trim();
    let slug = req.body.slug
      ? slugify(req.body.slug, { lower: true, strict: true })
      : slugify(trimmedName, { lower: true, strict: true });

    if (!slug) {
      slug = `category-${Date.now()}`;
    }

    // Check duplicate name or slug
    const existing = await Collection.findOne({
      $or: [
        { slug },
        { name: { $regex: new RegExp(`^${trimmedName}$`, "i") } }
      ]
    });

    if (existing) {
      return res.status(400).json({
        message: existing.slug === slug
          ? "A category with this slug already exists"
          : "A category with this name already exists"
      });
    }

    let finalImageUrl = imageUrl ? String(imageUrl).trim() : "";
    if (req.file) {
      finalImageUrl = `/api/v1/uploads/products/${req.file.filename}`;
    }

    const category = await Collection.create({
      name: trimmedName,
      slug,
      description: description ? description.trim() : "",
      imageUrl: finalImageUrl,
      ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {})
    });

    res.status(201).json(category);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ---------------- UPDATE CATEGORY (Admin) ---------------- */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, slug: customSlug, isActive } = req.body;

    const category = await Collection.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: "Category name cannot be empty" });
      }
      const trimmedName = name.trim();
      const existingName = await Collection.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${trimmedName}$`, "i") }
      });
      if (existingName) {
        return res.status(400).json({ message: "A category with this name already exists" });
      }
      category.name = trimmedName;
    }

    if (customSlug !== undefined && customSlug.trim()) {
      const formattedSlug = slugify(customSlug, { lower: true, strict: true });
      const existingSlug = await Collection.findOne({
        _id: { $ne: id },
        slug: formattedSlug
      });
      if (existingSlug) {
        return res.status(400).json({ message: "A category with this slug already exists" });
      }
      category.slug = formattedSlug;
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    if (req.file) {
      category.imageUrl = `/api/v1/uploads/products/${req.file.filename}`;
    } else if (imageUrl !== undefined) {
      category.imageUrl = imageUrl.trim();
    }

    if (isActive !== undefined) {
      (category as any).isActive = Boolean(isActive);
    }

    await category.save();
    res.json(category);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ---------------- DELETE CATEGORY (Admin) ---------------- */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Collection.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if products are tied to this category or collectionId
    const count = await Product.countDocuments({
      $or: [
        { collectionId: category._id },
        { category: category.slug }
      ]
    });

    if (count > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${count} product(s) are assigned to it.`
      });
    }

    await Collection.findByIdAndDelete(id);
    res.json({ message: "Category deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* -------- GET PRODUCTS BY CATEGORY -------- */
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const isObjectId = mongoose.isValidObjectId(id);

    const filter: any = {
      isActive: true,
      ...(isObjectId
        ? { $or: [{ collectionId: id }, { category: String(id).toLowerCase() }] }
        : { category: String(id).toLowerCase() }),
    };

    const filtered = await Product.find(filter).populate("collectionId");

    res.json(filtered);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
