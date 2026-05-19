import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import dns from "dns";
import bcrypt from "bcryptjs";
import slugify from "slugify";

import { Collection } from "../models/category.model";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";

dns.setDefaultResultOrder("ipv4first");

// ─── Helpers ──────────────────────────────────────────────────────────────────
const makeSlug = (name: string) => slugify(name, { lower: true, strict: true });

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    name: "Wall Art",
    slug: "wall-art",
    description: "Handcrafted wall hangings aur decorative panels",
    imageUrl: "https://placehold.co/600x400?text=Wall+Art",
  },
  {
    name: "Pottery",
    slug: "pottery",
    description: "Handmade clay pottery aur ceramic pieces",
    imageUrl: "https://placehold.co/600x400?text=Pottery",
  },
  {
    name: "Textile Crafts",
    slug: "textile-crafts",
    description: "Hand-woven aur embroidered textile products",
    imageUrl: "https://placehold.co/600x400?text=Textile+Crafts",
  },
  {
    name: "3 Daraz",
    slug: "3-daraz",
    description: "Decorative 3-shelf wall racks — Indian handcrafted home decor",
    imageUrl: "https://placehold.co/600x400?text=3+Daraz",
  },
  {
    name: "6 Daraz",
    slug: "6-daraz",
    description: "Decorative 6-shelf wall racks — Indian handcrafted home decor",
    imageUrl: "https://placehold.co/600x400?text=6+Daraz",
  },
];

const USERS = [
  {
    fullName: "Kaizen Admin",
    username: "kaizen_admin",
    email: "admin@kaizen.com",
    phone: "9000000000",
    password: "Admin@1234",
    role: "admin" as const,
  },
  {
    fullName: "Test User",
    username: "test_user",
    email: "user@kaizen.com",
    phone: "9111111111",
    password: "User@1234",
    role: "user" as const,
  },
];

// ─── Products Factory ──────────────────────────────────────────────────────────
const makeProducts = (
  categories: { _id: mongoose.Types.ObjectId; slug: string }[]
) => {
  const wallArt  = categories.find((c) => c.slug === "wall-art")!;
  const pottery  = categories.find((c) => c.slug === "pottery")!;
  const textile  = categories.find((c) => c.slug === "textile-crafts")!;
  const daraz3   = categories.find((c) => c.slug === "3-daraz")!;
  const daraz6   = categories.find((c) => c.slug === "6-daraz")!;

  const base = (
    name: string,
    cat: typeof wallArt,
    price: number,
    mrp: number,
    desc: string,
    extra: {
      materialType: string;
      finishType: string;
      dimensions: { length: number; width: number; height: number };
      netWeight: number;
    }
  ) => ({
    name,
    slug: makeSlug(name),
    description: desc,
    category: cat.slug,
    collectionId: cat._id,
    price,
    mrpPrice: mrp,
    discountPercentage: Math.round(((mrp - price) / mrp) * 100),
    stock: Math.floor(Math.random() * 50) + 10,
    sizes: ["Small", "Medium", "Large"],
    storageType: "Without Storage" as const,
    images: [`https://placehold.co/600x600?text=${encodeURIComponent(name)}`],
    featured: Math.random() > 0.6,
    bestSeller: Math.random() > 0.7,
    isActive: true,
    averageRating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    numReviews: Math.floor(Math.random() * 80) + 5,
    checkAvailability: true,
    serviceablePinCodes: ["302001", "302002", "302017", "110001", "400001"],
    warrantyMonths: 6,
    ...extra,
  });

  return [
    // ── Wall Art ──────────────────────────────────────────────────────────────
    base("Mandala Wall Hanging", wallArt, 1299, 1899,
      "Beautiful hand-painted mandala design on canvas. Traditional Rajasthani style mein bana hua wall decor piece.",
      { materialType: "Canvas", finishType: "Matte", dimensions: { length: 60, width: 60, height: 2 }, netWeight: 0.5 }
    ),
    base("Wooden Carved Panel", wallArt, 2499, 3499,
      "Sheesham wood se handcrafted intricate jali panel. Ghar ki kisi bhi diwar pe lagao aur look upgrade karo.",
      { materialType: "Wood", finishType: "Polished", dimensions: { length: 90, width: 45, height: 3 }, netWeight: 2.1 }
    ),
    base("Warli Art Frame", wallArt, 899, 1299,
      "Maharashtra ki traditional Warli painting — tribal art style mein hand-painted. Ready-to-hang frame ke saath.",
      { materialType: "Canvas", finishType: "Glossy", dimensions: { length: 40, width: 50, height: 4 }, netWeight: 0.8 }
    ),
    base("Macrame Wall Decor", wallArt, 1599, 2199,
      "Cotton rope se haath se buni macrame wall hanging. Bohemian vibes ke liye perfect home decor item.",
      { materialType: "Cotton Rope", finishType: "Natural", dimensions: { length: 50, width: 80, height: 1 }, netWeight: 0.4 }
    ),

    // ── Pottery ───────────────────────────────────────────────────────────────
    base("Blue Pottery Vase Set", pottery, 1799, 2499,
      "Jaipur ki famous blue pottery — 3 vaases ka set. Authentic handmade piece jo Rajasthan ki yaad dilaye.",
      { materialType: "Ceramic", finishType: "Glazed", dimensions: { length: 15, width: 15, height: 30 }, netWeight: 1.2 }
    ),
    base("Terracotta Planter Pot", pottery, 549, 799,
      "Eco-friendly terracotta mitti ka handmade planter. Indoor plants ke liye bilkul sahi — breathable material.",
      { materialType: "Terracotta", finishType: "Unglazed", dimensions: { length: 20, width: 20, height: 22 }, netWeight: 0.9 }
    ),
    base("Handpainted Dinner Set", pottery, 3299, 4499,
      "6-piece handpainted ceramic dinner set — floral motifs ke saath. Microwave aur dishwasher safe.",
      { materialType: "Ceramic", finishType: "Glazed", dimensions: { length: 28, width: 28, height: 5 }, netWeight: 3.5 }
    ),
    base("Clay Diya Set (12 pcs)", pottery, 399, 599,
      "Festive season ke liye 12 handmade painted diyas ka set. Diwali aur puja ke liye perfect.",
      { materialType: "Clay", finishType: "Painted", dimensions: { length: 8, width: 8, height: 4 }, netWeight: 0.6 }
    ),

    // ── Textile Crafts ────────────────────────────────────────────────────────
    base("Block Print Table Runner", textile, 699, 999,
      "Rajasthani hand block print cotton table runner — 6-seater table ke liye. Washable aur vibrant colors.",
      { materialType: "Cotton", finishType: "Printed", dimensions: { length: 180, width: 40, height: 1 }, netWeight: 0.3 }
    ),
    base("Phulkari Embroidered Cushion", textile, 1199, 1699,
      "Punjab ki traditional Phulkari embroidery wala cushion cover — 16x16 inch. With filler.",
      { materialType: "Cotton", finishType: "Embroidered", dimensions: { length: 40, width: 40, height: 10 }, netWeight: 0.5 }
    ),
    base("Kantha Stitch Throw", textile, 2199, 2999,
      "Bengal ki Kantha stitch technique se bana hand-stitched throw blanket. Double-layered cotton.",
      { materialType: "Cotton", finishType: "Hand-stitched", dimensions: { length: 150, width: 200, height: 1 }, netWeight: 1.1 }
    ),
    base("Ikat Weave Tote Bag", textile, 849, 1199,
      "Odisha ikat handloom se bana eco-friendly tote bag. Office aur daily use dono ke liye stylish.",
      { materialType: "Cotton", finishType: "Woven", dimensions: { length: 35, width: 12, height: 40 }, netWeight: 0.25 }
    ),

    // ── 3 Daraz (3-shelf wall rack) ───────────────────────────────────────────
    base("Sheesham Wood 3 Daraz", daraz3, 1899, 2699,
      "Sheesham ki lakdi se handcrafted 3-shelf wall rack. Ghar aur office dono mein stylish aur useful.",
      { materialType: "Sheesham Wood", finishType: "Honey Polish", dimensions: { length: 60, width: 15, height: 55 }, netWeight: 3.2 }
    ),
    base("Rajasthani Painted 3 Daraz", daraz3, 1599, 2299,
      "Hand-painted Rajasthani motifs ke saath 3-daraz wall shelf. Multicolour floral design, mango wood.",
      { materialType: "Mango Wood", finishType: "Hand-Painted", dimensions: { length: 55, width: 12, height: 50 }, netWeight: 2.8 }
    ),
    base("Carved Jali 3 Daraz", daraz3, 2299, 3199,
      "Intricate jali carving wala 3-shelf decorative rack. Living room ya bedroom ke liye perfect.",
      { materialType: "Teak Wood", finishType: "Antique", dimensions: { length: 65, width: 14, height: 60 }, netWeight: 3.8 }
    ),
    base("Minimal 3 Daraz Shelf", daraz3, 1299, 1799,
      "Clean minimal design mein 3-daraz wall rack. Small spaces ke liye best — kitchen ya bedroom.",
      { materialType: "Pine Wood", finishType: "Natural", dimensions: { length: 50, width: 12, height: 48 }, netWeight: 2.4 }
    ),

    // ── 6 Daraz (6-shelf wall rack) ───────────────────────────────────────────
    base("Sheesham Wood 6 Daraz", daraz6, 3499, 4799,
      "6-shelf Sheesham wood wall rack — zyada storage aur elegant look. Puja room ya living room ke liye.",
      { materialType: "Sheesham Wood", finishType: "Walnut Polish", dimensions: { length: 65, width: 15, height: 110 }, netWeight: 6.5 }
    ),
    base("Rajasthani Painted 6 Daraz", daraz6, 2999, 4299,
      "Vibrant Rajasthani hand-painted 6-daraz wall rack. Traditional colours aur motifs ke saath stunning piece.",
      { materialType: "Mango Wood", finishType: "Hand-Painted", dimensions: { length: 60, width: 12, height: 105 }, netWeight: 5.8 }
    ),
    base("Royal Carved 6 Daraz", daraz6, 4299, 5999,
      "Premium teak wood carved 6-shelf rack with brass fittings. Royal decor ke liye ek showstopper piece.",
      { materialType: "Teak Wood", finishType: "Antique Gold", dimensions: { length: 70, width: 16, height: 120 }, netWeight: 8.2 }
    ),
    base("Modern 6 Daraz Display Rack", daraz6, 2699, 3699,
      "Contemporary design 6-daraz rack — books, plants aur showpieces ke liye. Easy wall mounting ke saath.",
      { materialType: "MDF + Wood", finishType: "Matte White", dimensions: { length: 60, width: 14, height: 108 }, netWeight: 5.2 }
    ),
  ];
};

// ─── Seed Function ─────────────────────────────────────────────────────────────
async function seed() {
  try {
    console.log("🔌 MongoDB se connect ho raha hoon...");
    await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log("✅ Connected!\n");

    console.log("🗑️  Purana data delete kar raha hoon...");
    await Promise.all([
      Product.deleteMany({}),
      Collection.deleteMany({}),
      User.deleteMany({ email: { $in: USERS.map((u) => u.email) } }),
    ]);
    console.log("   Products, Categories, Test Users — sab delete ho gaye.\n");

    console.log("📂 Categories bana raha hoon...");
    const createdCategories = await Collection.insertMany(CATEGORIES);
    createdCategories.forEach((c) => console.log(`   ✔ ${c.name}`));
    console.log();

    console.log("👤 Users bana raha hoon...");
    for (const u of USERS) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed });
      console.log(`   ✔ ${u.role === "admin" ? "Admin" : "User "} — ${u.email}  (password: ${u.password})`);
    }
    console.log();

    console.log("🛍️  Products bana raha hoon...");
    const catRefs = createdCategories.map((c) => ({
      _id: c._id as mongoose.Types.ObjectId,
      slug: c.slug,
    }));
    const createdProducts = await Product.insertMany(makeProducts(catRefs));
    createdProducts.forEach((p) => console.log(`   ✔ ${p.name}`));
    console.log();

    console.log("─".repeat(50));
    console.log("🎉 Seed complete!");
    console.log(`   Categories : ${createdCategories.length}`);
    console.log(`   Users      : ${USERS.length}`);
    console.log(`   Products   : ${createdProducts.length}`);
    console.log("─".repeat(50));
    console.log("\n🔑 Login Credentials:");
    console.log("   Admin → admin@kaizen.com  / Admin@1234");
    console.log("   User  → user@kaizen.com   / User@1234\n");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 DB disconnect ho gaya.");
  }
}

seed();
