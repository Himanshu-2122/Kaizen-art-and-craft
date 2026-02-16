import mongoose from "mongoose";

/* ======================================================
   REVIEW SCHEMA
====================================================== */
const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    rating: {
      type: Number,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);


/* ======================================================
   PRODUCT SCHEMA
====================================================== */
const productSchema = new mongoose.Schema(
  {
    /* ---------- BASIC ---------- */

    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    description: {
      type: String,
      trim: true,
      required: true
    },


    /* ---------- PRICING ---------- */

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discountPrice: {
      type: Number,
      min: 0
    },


    /* ---------- STOCK ---------- */

    stock: {
      type: Number,
      default: 0,
      min: 0,
      required: true
    },


    /* ---------- CATEGORY ---------- */

    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      index: true
    },


    /* ======================================================
       ⭐ MAIN CHANGE — REQUIRED
    ====================================================== */

    sizes: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one size is required"
      }
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one image is required"
      }
    },


    /* ---------- FLAGS ---------- */

    featured: {
      type: Boolean,
      default: false,
      index: true
    },

    bestSeller: {
      type: Boolean,
      default: false,
      index: true
    },


    /* ---------- RATINGS ---------- */

    averageRating: {
      type: Number,
      default: 0
    },

    numReviews: {
      type: Number,
      default: 0
    },


    /* ---------- SOFT DELETE ---------- */

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },


    /* ---------- REVIEWS ---------- */

    reviews: [reviewSchema]
  },
  { timestamps: true }
);


/* ======================================================
   INDEXES (Performance boost)
====================================================== */

productSchema.index({ category: 1 });
productSchema.index({ collectionId: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ bestSeller: 1 });
productSchema.index({ isActive: 1 });


/* ======================================================
   EXPORT
====================================================== */

export const Product = mongoose.model("Product", productSchema);
