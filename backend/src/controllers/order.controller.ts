import { User } from "../models/user.model";
import { Order } from "../models/order.model";
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

    const total = items.reduce(
      (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const order = await Order.create({
      userId: req.user.id,
      items: items.map((i: any) => ({
        productId: i.product_id ?? i.productId,
        name:      i.name,
        price:     Number(i.price),
        quantity:  Number(i.quantity),
        size:      i.size ?? "",
      })),
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
