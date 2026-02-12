import { User } from "../models/user.model";

export const addToCart = async (req: any, res: any) => {
  const { productId, quantity = 1 } = req.body;

  const user = await User.findById(req.user.id);

  // ✅ IMPORTANT NULL CHECK
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const existingItem = user.cart.find(
    (item: any) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    user.cart.push({ productId, quantity });
  }

  await user.save();

  res.json(user.cart);
};
