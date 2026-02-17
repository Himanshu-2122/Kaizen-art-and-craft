import mongoose, { Document, Schema } from "mongoose";

/* ======================================================
   REVIEW INTERFACE
====================================================== */
interface Review {
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/* ======================================================
   PRODUCT DOCUMENT INTERFACE
====================================================== */
export interface ProductDocument extends Document {
  name: string;
  slug: string;
  description: string;

  category: string;
  collectionId?: mongoose.Types.ObjectId;

  sizes: string[];
  storageType: "Box Storage" | "Hydraulic" | "Without Storage" | "Side Drawer";

  price: number;
  mrpPrice: number;
  discountPercentage: number;

  stock: number;

  checkAvailability: boolean;
  serviceablePinCodes: string[];

  images: string[];

  featured: boolean;
  bestSeller: boolean;
  isActive: boolean;

  materialType: string;
  finishType: string;

  dimensions: {
    length: number;
    width: number;
    height: number;
  };

  netWeight: number;
  warrantyMonths: number;

  averageRating: number;
  numReviews: number;

  reviews: Review[];

  calculateRatings(): void;
}

/* ======================================================
   REVIEW SCHEMA
====================================================== */
const reviewSchema = new Schema<Review>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      trim: true,
      required: true
    }
  },
  { timestamps: true }
);

/* ======================================================
   PRODUCT SCHEMA
====================================================== */
const productSchema = new Schema<ProductDocument>(
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
      required: true,
      trim: true
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
      ref: "Collection"
    },

    /* ---------- SIZING ---------- */
    sizes: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one size is required"
      }
    },

    /* ---------- STORAGE TYPE ---------- */
    storageType: {
      type: String,
      enum: ["Box Storage", "Hydraulic", "Without Storage", "Side Drawer"],
      required: true
    },

    /* ---------- PRICING ---------- */
    price: {
      type: Number,
      required: true,
      min: 0
    },

    mrpPrice: {
      type: Number,
      required: true,
      min: 0
    },

    discountPercentage: {
      type: Number,
      default: 0
    },

    /* ---------- STOCK ---------- */
    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    /* ---------- AVAILABILITY ---------- */
    checkAvailability: {
      type: Boolean,
      default: true
    },

    serviceablePinCodes: {
      type: [String],
      default: []
    },

    /* ---------- IMAGES ---------- */
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0 && v.length <= 10,
        message: "Between 1 and 10 images are required"
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

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    /* ---------- MORE PRODUCT INFO ---------- */
    materialType: {
      type: String,
      required: true,
      trim: true
    },

    finishType: {
      type: String,
      required: true,
      trim: true
    },

    /* ---------- DIMENSIONS ---------- */
    dimensions: {
      length: { type: Number, required: true, min: 0 },
      width: { type: Number, required: true, min: 0 },
      height: { type: Number, required: true, min: 0 }
    },

    /* ---------- PHYSICAL ---------- */
    netWeight: {
      type: Number,
      required: true,
      min: 0
    },

    /* ---------- WARRANTY ---------- */
    warrantyMonths: {
      type: Number,
      required: true,
      min: 0
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

    /* ---------- REVIEWS ---------- */
    reviews: [reviewSchema]
  },
  { timestamps: true }
);



/* ======================================================
   METHOD: CALCULATE RATINGS
====================================================== */
productSchema.methods.calculateRatings = function (this: ProductDocument) {
  if (this.reviews.length > 0) {
    this.numReviews = this.reviews.length;

    this.averageRating =
      this.reviews.reduce((acc: number, item: Review) => acc + item.rating, 0) /
      this.reviews.length;
  } else {
    this.numReviews = 0;
    this.averageRating = 0;
  }
};

/* ======================================================
   INDEXES
====================================================== */
productSchema.index({ category: 1 });
productSchema.index({ collectionId: 1 });
productSchema.index({ slug: 1, isActive: 1 });

/* ======================================================
   EXPORT
====================================================== */
export const Product = mongoose.model<ProductDocument>(
  "Product",
  productSchema
);
