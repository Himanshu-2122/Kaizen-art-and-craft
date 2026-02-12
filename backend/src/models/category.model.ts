import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: String,
    imageUrl: String
  },
  { timestamps: true }
);

export const Collection = mongoose.model("Collection", collectionSchema);
