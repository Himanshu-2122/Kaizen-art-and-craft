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
   CREATE PRODUCT (Admin) — multipart/form-data
====================================================== */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      mrpPrice,
      stock = 0,
      sizes,
      category,
      collectionId,
      storageType,
      materialType,
      finishType,
      netWeight,
      warrantyMonths,
      checkAvailability,
      serviceablePinCodes,
      featured = false,
      bestSeller = false
    } = req.body;

    /* ---------- validation ---------- */
    if (
      !name || !description || !price || !mrpPrice ||
      !category || !storageType || !materialType ||
      !finishType || !netWeight || !warrantyMonths
    ) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    if (!req.body.dimensions) {
      return res.status(400).json({ message: "Dimensions are required" });
    }

    const dimensions = typeof req.body.dimensions === "string"
      ? JSON.parse(req.body.dimensions)
      : req.body.dimensions;

    if (!dimensions.length || !dimensions.width || !dimensions.height) {
      return res.status(400).json({
        message: "Dimensions (length, width, height) are required"
      });
    }

    /* ---------- parse arrays ---------- */
    const sizesArr = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    if (!sizesArr || !sizesArr.length) {
      return res.status(400).json({ message: "At least one size is required" });
    }

    const pinCodesArr = serviceablePinCodes
      ? (typeof serviceablePinCodes === "string" ? JSON.parse(serviceablePinCodes) : serviceablePinCodes)
      : [];

    /* ---------- images from multer ---------- */
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }
    if (files.length > 10) {
      return res.status(400).json({ message: "Maximum 10 images allowed" });
    }

    const images = files.map(f => `/api/v1/uploads/products/${f.filename}`);

    /* ---------- slug ---------- */
    const slug = slugify(`${name}-${Date.now()}`, {
      lower: true,
      strict: true
    });

    const discountPercentage = mrpPrice > 0 && price < mrpPrice
      ? Math.round(((mrpPrice - price) / mrpPrice) * 100)
      : 0;

    const product = await Product.create({
      name,
      slug,
      description,
      price: Number(price),
      mrpPrice: Number(mrpPrice),
      discountPercentage,
      stock: Number(stock),
      sizes: sizesArr,
      images,
      category: category.toLowerCase(),
      collectionId: collectionId || undefined,
      storageType,
      materialType,
      finishType,
      dimensions: {
        length: Number(dimensions.length),
        width: Number(dimensions.width),
        height: Number(dimensions.height)
      },
      netWeight: Number(netWeight),
      warrantyMonths: Number(warrantyMonths),
      checkAvailability: checkAvailability === "true" || checkAvailability === true,
      serviceablePinCodes: pinCodesArr,
      featured: featured === "true" || featured === true,
      bestSeller: bestSeller === "true" || bestSeller === true,
      isActive: true
    });

    res.status(201).json(product);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



/* ======================================================
   UPDATE PRODUCT (Admin) — multipart/form-data
====================================================== */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const existing = await Product.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updates: Record<string, any> = {};

    /* ---------- text fields ---------- */
    if (req.body.name) {
      updates.name = req.body.name;
      updates.slug = slugify(`${req.body.name}-${Date.now()}`, {
        lower: true,
        strict: true
      });
    }
    if (req.body.description) updates.description = req.body.description;
    if (req.body.category) updates.category = req.body.category.toLowerCase();
    if (req.body.collectionId) updates.collectionId = req.body.collectionId;
    if (req.body.storageType) updates.storageType = req.body.storageType;
    if (req.body.materialType) updates.materialType = req.body.materialType;
    if (req.body.finishType) updates.finishType = req.body.finishType;

    if (req.body.price) updates.price = Number(req.body.price);
    if (req.body.mrpPrice) updates.mrpPrice = Number(req.body.mrpPrice);
    if (req.body.stock !== undefined) updates.stock = Number(req.body.stock);
    if (req.body.netWeight) updates.netWeight = Number(req.body.netWeight);
    if (req.body.warrantyMonths) updates.warrantyMonths = Number(req.body.warrantyMonths);

    if (req.body.sizes) {
      updates.sizes = typeof req.body.sizes === "string"
        ? JSON.parse(req.body.sizes)
        : req.body.sizes;
    }

    if (req.body.dimensions) {
      const dims = typeof req.body.dimensions === "string"
        ? JSON.parse(req.body.dimensions)
        : req.body.dimensions;
      updates.dimensions = {
        length: Number(dims.length),
        width: Number(dims.width),
        height: Number(dims.height)
      };
    }

    if (req.body.serviceablePinCodes) {
      updates.serviceablePinCodes = typeof req.body.serviceablePinCodes === "string"
        ? JSON.parse(req.body.serviceablePinCodes)
        : req.body.serviceablePinCodes;
    }

    if (req.body.checkAvailability !== undefined) {
      updates.checkAvailability = req.body.checkAvailability === "true" || req.body.checkAvailability === true;
    }
    if (req.body.featured !== undefined) {
      updates.featured = req.body.featured === "true" || req.body.featured === true;
    }
    if (req.body.bestSeller !== undefined) {
      updates.bestSeller = req.body.bestSeller === "true" || req.body.bestSeller === true;
    }
    if (req.body.isActive !== undefined) {
      updates.isActive = req.body.isActive === "true" || req.body.isActive === true;
    }

    /* ---------- images ---------- */
    const files = req.files as Express.Multer.File[] | undefined;
    const existingImages = req.body.existingImages
      ? (typeof req.body.existingImages === "string"
        ? JSON.parse(req.body.existingImages)
        : req.body.existingImages)
      : [];

    const newImages = files ? files.map(f => `/api/v1/uploads/products/${f.filename}`) : [];
    const allImages = [...existingImages, ...newImages];

    if (allImages.length > 0) {
      if (allImages.length > 10) {
        return res.status(400).json({ message: "Maximum 10 images allowed" });
      }
      updates.images = allImages;
    }

    /* ---------- recalculate discount ---------- */
    const finalPrice = updates.price ?? existing.price;
    const finalMrp = updates.mrpPrice ?? existing.mrpPrice;
    if (finalMrp > 0 && finalPrice < finalMrp) {
      updates.discountPercentage = Math.round(
        ((finalMrp - finalPrice) / finalMrp) * 100
      );
    } else {
      updates.discountPercentage = 0;
    }

    const product = await Product.findByIdAndUpdate(id, { ...updates, discountPercentage: updates.discountPercentage }, { new: true, runValidators: true });

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

    const filter: Record<string, any> = { isActive: true };

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

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .populate("collectionId", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({
      products,
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

    const product = await Product.findOne({ _id: id, isActive: true })
      .populate("collectionId", "name slug")
      .populate("reviews.userId", "fullName avatarUrl")
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

    const product = await Product.findOne({ slug, isActive: true })
      .populate("collectionId", "name slug")
      .populate("reviews.userId", "fullName avatarUrl")
      .lean();

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



/* ======================================================
   ADD REVIEW (Authenticated User)
====================================================== */
export const addReview = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { rating, comment } = req.body;
    const userId = (req as any).user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === userId
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    product.reviews.push({ userId, rating: Number(rating), comment });

    /* ---------- auto-calculate rating ---------- */
    product.calculateRatings();

    await product.save();

    const updated = await Product.findById(id)
      .populate("reviews.userId", "fullName avatarUrl")
      .lean();

    res.status(201).json(updated);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



/* ======================================================
   CHECK AVAILABILITY (Pin Code)
====================================================== */
export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { pinCode } = req.body;

    if (!pinCode) {
      return res.status(400).json({ message: "Pin code is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.checkAvailability) {
      return res.json({ available: false, message: "Product is currently unavailable" });
    }

    if (product.serviceablePinCodes.length === 0) {
      return res.json({ available: true, message: "Available for delivery" });
    }

    const isServiceable = product.serviceablePinCodes.includes(String(pinCode));

    res.json({
      available: isServiceable,
      message: isServiceable
        ? "Available for delivery to this pin code"
        : "Sorry, delivery is not available to this pin code"
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
