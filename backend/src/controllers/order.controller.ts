import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";
import { Request, Response } from "express";


// ========================
// CHECKOUT (create order)
// ========================
export const checkout = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");

    // ✅ null check
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // ✅ empty cart check
    if (user.cart.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    let total = 0;

    const items = user.cart.map((item: any) => {
      const product = item.productId;

      total += product.price * item.quantity;

      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const order = await Order.create({
      userId: user._id,
      items,
      total,
      status: "pending",
    });

    // ✅ BEST WAY TO CLEAR CART (NO TS ERROR)
    user.cart.splice(0, user.cart.length);

    await user.save();

    res.json(order);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Checkout failed" });
  }
};


// ========================
// GET MY ORDERS
// ========================
export const getMyOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
