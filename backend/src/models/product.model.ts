import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: Number,
  comment: String
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,

    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },

    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection"
    },

    sizes: [String],
    images: [String],

    featured: Boolean,
    bestSeller: Boolean,

    reviews: [reviewSchema]
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
