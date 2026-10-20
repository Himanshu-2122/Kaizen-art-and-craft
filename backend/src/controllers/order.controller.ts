import mongoose from "mongoose";
import { User } from "../models/user.model";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { Request, Response } from "express";

const VALID_STATUSES = ["pending", "completed", "cancelled"] as const;
type OrderStatus = typeof VALID_STATUSES[number];

/* ─── CHECKOUT ───────────────────────────────────────── */
export const checkout = async (req: any, res: Response) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (
      !shippingAddress?.street ||
      !shippingAddress?.city   ||
      !shippingAddress?.state  ||
      !shippingAddress?.zip
    ) {
      return res.status(400).json({ message: "Complete shipping address is required" });
    }

    // Look up authoritative prices and stock from MongoDB for valid ObjectIds
    const rawIds = items
      .map((i: any) => String(i.product_id ?? i.productId ?? ""))
      .filter((id: string) => mongoose.Types.ObjectId.isValid(id));

    const dbProducts = rawIds.length > 0
      ? await Product.find({ _id: { $in: rawIds }, isActive: true })
      : [];
    const productMap = new Map(dbProducts.map((p) => [String(p._id), p]));

    let total = 0;
    const verifiedItems: Array<{
      productId?: mongoose.Types.ObjectId;
      name: string;
      price: number;
      quantity: number;
      size: string;
    }> = [];

    for (const item of items) {
      const pid = String(item.product_id ?? item.productId ?? "");
      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const dbProd = productMap.get(pid);

      if (dbProd) {
        if (dbProd.stock !== undefined && dbProd.stock < qty) {
          return res.status(400).json({
            message: `Insufficient stock for ${dbProd.name} (available: ${dbProd.stock})`,
          });
        }
        const unitPrice = Number(dbProd.price);
        total += unitPrice * qty;
        verifiedItems.push({
          productId: dbProd._id as mongoose.Types.ObjectId,
          name: dbProd.name,
          price: unitPrice,
          quantity: qty,
          size: item.size ?? "",
        });
      } else if (process.env.NODE_ENV === "production") {
        return res.status(400).json({
          message: `Product "${item.name || pid}" is unavailable or invalid`,
        });
      } else {
        // Non-production fallback for local mock/placeholder catalog items
        const fallbackPrice = Math.max(0, Number(item.price) || 0);
        total += fallbackPrice * qty;
        verifiedItems.push({
          ...(mongoose.Types.ObjectId.isValid(pid)
            ? { productId: new mongoose.Types.ObjectId(pid) }
            : {}),
          name: item.name,
          price: fallbackPrice,
          quantity: qty,
          size: item.size ?? "",
        });
      }
    }

    // Decrement stock for database-backed products
    for (const vItem of verifiedItems) {
      if (vItem.productId && productMap.has(String(vItem.productId))) {
        await Product.updateOne(
          { _id: vItem.productId, stock: { $gte: vItem.quantity } },
          { $inc: { stock: -vItem.quantity } }
        );
      }
    }

    const order = await Order.create({
      userId: req.user.id,
      items: verifiedItems,
      total,
      status: "pending",
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Checkout failed" });
  }
};

/* ─── UPDATE ORDER STATUS (Admin) ────────────────────── */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status as OrderStatus)) {
      return res.status(400).json({
        message: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("userId", "fullName email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update order";
    res.status(500).json({ message });
  }
};

/* ─── GET MY ORDERS ──────────────────────────────────── */
export const getMyOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ─── GET ALL ORDERS (Admin) ─────────────────────────── */
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
