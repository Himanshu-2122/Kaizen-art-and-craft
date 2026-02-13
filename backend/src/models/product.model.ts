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

    price: Number,
    discountPrice: Number,

    stock: { type: Number, default: 0 },

    category: { type: String, required: true },

    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection"
    },

    sizes: [String],
    images: [String],

    featured: Boolean,
    bestSeller: Boolean,

    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },

    reviews: [reviewSchema]
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ collectionId: 1 });
productSchema.index({ featured: 1 });

export const Product = mongoose.model("Product", productSchema);
