import { Request, Response } from "express";
import { Product } from "../models/product.model";
import slugify from "slugify";

/*
|--------------------------------------------------------------------------
| CREATE PRODUCT (Admin)
|--------------------------------------------------------------------------
*/
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      sizes,
      images,
      collectionId,
      featured,
      bestSeller
    } = req.body;

    const slug = slugify(name, { lower: true });

    const exists = await Product.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      stock,
      sizes,
      images,
      collectionId,
      featured,
      bestSeller
    });

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT (Admin)
|--------------------------------------------------------------------------
*/
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.body.name) {
      product.slug = slugify(req.body.name, { lower: true });
    }

    Object.assign(product, req.body);

    await product.save();

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE PRODUCT (Admin)
|--------------------------------------------------------------------------
*/
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


/*
|--------------------------------------------------------------------------
| GET ALL PRODUCTS (Public)
|--------------------------------------------------------------------------
*/
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate("collectionId", "name slug")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


/*
|--------------------------------------------------------------------------
| GET SINGLE PRODUCT (Public)
|--------------------------------------------------------------------------
*/
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("collectionId", "name slug")
      .populate("reviews.userId", "fullName avatarUrl");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
