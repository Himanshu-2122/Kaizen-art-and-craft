import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  quantity: Number,
  size: String
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending"
    },

    total: Number,

    items: [orderItemSchema],

    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    },

    stripeSessionId: String
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
