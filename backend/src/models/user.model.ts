import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" },
  street: String,
  city: String,
  state: String,
  zip: String,
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false }
});
const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});


const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    avatarUrl: String,

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    cart: [cartSchema], // ✅ ADD THIS

    addresses: [addressSchema],
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
