import dotenv from "dotenv";
dotenv.config(); // ALWAYS FIRST

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { Collection } from "../models/category.model";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";

/* =========================================
   DATA
========================================= */

const collectionsData = [
  { name: "Living Room", slug: "living-room", description: "Stylish sofas and living essentials" },
  { name: "Bedroom", slug: "bedroom", description: "Beds and cozy furniture" },
  { name: "Office", slug: "office", description: "Work desks and chairs" },
  { name: "Dining", slug: "dining", description: "Dining tables and chairs" },
  { name: "Outdoor", slug: "outdoor", description: "Garden furniture" },
];

const productsData = [
  { name: "Nordic Lounge Chair", slug: "nordic-lounge-chair", price: 599, collection: "living-room", stock: 12, featured: true, bestSeller: true },
  { name: "Elm Wood Coffee Table", slug: "elm-wood-coffee-table", price: 349, collection: "living-room", stock: 8 },
  { name: "Zen Platform Bed", slug: "zen-platform-bed", price: 1249, collection: "bedroom", stock: 7 },
  { name: "Arc Standing Desk", slug: "arc-standing-desk", price: 749, collection: "office", stock: 15 },
  { name: "Oak Dining Table", slug: "oak-dining-table", price: 999, collection: "dining", stock: 4 },
  { name: "Teak Garden Set", slug: "teak-garden-set", price: 1599, collection: "outdoor", stock: 3 },
];

/* =========================================
   SEED FUNCTION
========================================= */

const seed = async () => {
  try {
    console.log("Connecting:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI!);

    console.log("✅ Mongo connected");

    /* clean old */
    await Promise.all([
      Collection.deleteMany(),
      Product.deleteMany(),
      User.deleteMany({ email: "admin@mail.com" }),
    ]);

    console.log("Old data removed");

    /* collections */
    const insertedCollections = await Collection.insertMany(collectionsData);

    console.log("Collections seeded");

    /* products */
    for (const product of productsData) {
      const collection = insertedCollections.find(
        (c) => c.slug === product.collection
      );

      if (!collection) continue;

      await Product.create({
        name: product.name,
        slug: product.slug,
        price: product.price,
        stock: product.stock,
        featured: product.featured || false,
        bestSeller: product.bestSeller || false,
        collectionId: collection._id,
      });
    }

    console.log("Products seeded");

    /* admin user */
    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      fullName: "Admin",
      username: "admin",
      email: "admin@mail.com",
      password: hashed,
      role: "admin",
    });

    console.log("Admin user created");

    console.log("🎉 Seeding completed");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
