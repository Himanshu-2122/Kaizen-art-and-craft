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

// ─── Data: 9 Clean Categories from all_images ────────────────────────────────
const CATEGORIES = [
  {
    name: "Sofas",
    slug: "sofas",
    description: "Luxurious fabric & wooden sofas and recliners designed for contemporary living",
    imageUrl: "/images/categories/sofas.jpg",
  },
  {
    name: "Beds",
    slug: "beds",
    description: "Solid wood master beds, king and queen beds engineered for comfort",
    imageUrl: "/images/categories/beds.jpg",
  },
  {
    name: "Dining",
    slug: "dining",
    description: "Solid wood dining tables, 6-seater dining sets and dining chairs",
    imageUrl: "/images/categories/dining.jpg",
  },
  {
    name: "Coffee Tables",
    slug: "coffee-tables",
    description: "Living room centerpieces, round coffee tables and nested wooden tables",
    imageUrl: "/images/categories/coffee-tables.jpg",
  },
  {
    name: "Chairs",
    slug: "chairs",
    description: "Ergonomic wooden dining chairs, accent armchairs and lounge seating",
    imageUrl: "/images/categories/chairs.jpg",
  },
  {
    name: "TV Units",
    slug: "tv-units",
    description: "Sleek entertainment consoles, media centers and wall-mount TV storage",
    imageUrl: "/images/categories/tv-units.jpg",
  },
  {
    name: "Bookshelves",
    slug: "bookshelves",
    description: "Multi-tier display shelves, curio cabinets and bookcases in solid wood",
    imageUrl: "/images/categories/bookshelves.jpg",
  },
  {
    name: "Chest of Drawers",
    slug: "chest-of-drawers",
    description: "Spacious multi-drawer dressers, sideboards and organizers with brass accents",
    imageUrl: "/images/categories/chest-of-drawers.jpg",
  },
  {
    name: "Dressing Tables",
    slug: "dressing-tables",
    description: "Handcrafted vanities with mirrors, storage drawers and matching stools",
    imageUrl: "/images/categories/dressing-tables.jpg",
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
  const sofasCat       = categories.find((c) => c.slug === "sofas")!;
  const bedsCat        = categories.find((c) => c.slug === "beds")!;
  const diningCat      = categories.find((c) => c.slug === "dining")!;
  const coffeeCat      = categories.find((c) => c.slug === "coffee-tables")!;
  const chairsCat      = categories.find((c) => c.slug === "chairs")!;
  const tvUnitsCat     = categories.find((c) => c.slug === "tv-units")!;
  const bookCat        = categories.find((c) => c.slug === "bookshelves")!;
  const chestCat       = categories.find((c) => c.slug === "chest-of-drawers")!;
  const dressingCat    = categories.find((c) => c.slug === "dressing-tables")!;

  const base = (
    name: string,
    cat: { _id: mongoose.Types.ObjectId; slug: string },
    price: number,
    mrp: number,
    desc: string,
    images: string[],
    extra: {
      materialType: string;
      finishType: string;
      dimensions: { length: number; width: number; height: number };
      netWeight: number;
      bestSeller?: boolean;
      featured?: boolean;
      warrantyMonths?: number;
    }
  ) => ({
    name,
    slug: makeSlug(`${name}-${Date.now()}-${Math.floor(Math.random() * 1000)}`),
    description: desc,
    category: cat.slug,
    collectionId: cat._id,
    price,
    mrpPrice: mrp,
    discountPercentage: Math.round(((mrp - price) / mrp) * 100),
    stock: Math.floor(Math.random() * 40) + 12,
    sizes: ["Standard", "Large"],
    storageType: "Freestanding" as const,
    images,
    featured: extra.featured ?? Math.random() > 0.5,
    bestSeller: extra.bestSeller ?? Math.random() > 0.6,
    isActive: true,
    averageRating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
    numReviews: Math.floor(Math.random() * 65) + 14,
    checkAvailability: true,
    serviceablePinCodes: ["302001", "302002", "302017", "110001", "400001", "560001"],
    warrantyMonths: extra.warrantyMonths ?? 12,
    materialType: extra.materialType,
    finishType: extra.finishType,
    dimensions: extra.dimensions,
    netWeight: extra.netWeight,
  });

  return [
    // ── 1. SOFAS ─────────────────────────────────────────────────────────────
    base(
      "Classic Royale 3-Seater Velvet Sofa",
      sofasCat,
      34999,
      49999,
      "Sumptuous Chesterfield velvet 3-seater sofa with tufted backrest and solid Sheesham wooden base. Designed for luxurious living rooms.",
      ["/images/products/sofas/sofa-1.jpg", "/images/products/sofas/sofa-2.jpg"],
      { materialType: "Sheesham Wood & Velvet", finishType: "Walnut", dimensions: { length: 215, width: 90, height: 85 }, netWeight: 48, bestSeller: true, featured: true }
    ),
    base(
      "Vetra 2-Seater Fabric Sofa Set",
      sofasCat,
      27499,
      38999,
      "Ergonomic compact 2-seater lounge sofa with high density foam cushions and matching footrest in deep warm tone.",
      ["/images/products/sofas/sofa-2.jpg", "/images/products/sofas/sofa-3.jpg"],
      { materialType: "Solid Wood & Fabric", finishType: "Natural", dimensions: { length: 165, width: 85, height: 82 }, netWeight: 36, bestSeller: true }
    ),
    base(
      "Acanva Luxury Modern Chesterfield Lounge",
      sofasCat,
      42999,
      59999,
      "Contemporary statement sofa with plush deep-seated upholstery and hand-carved solid wooden frame. Kaizen Livings signature design.",
      ["/images/products/sofas/sofa-3.jpg", "/images/products/sofas/sofa-4.jpg"],
      { materialType: "Teak Wood & Fabric", finishType: "Polished", dimensions: { length: 228, width: 96, height: 88 }, netWeight: 52, featured: true }
    ),
    base(
      "Moreno Solid Wood 3-Seater Sofa",
      sofasCat,
      31999,
      44999,
      "Warm walnut finish solid wooden sofa frame with breathable linen-blend cushions and timeless slatted side arms.",
      ["/images/products/sofas/sofa-4.jpg", "/images/products/sofas/sofa-5.jpg"],
      { materialType: "Sheesham Wood", finishType: "Honey Polish", dimensions: { length: 200, width: 88, height: 84 }, netWeight: 44 }
    ),
    base(
      "Waverly Scandinavian Accent 3-Seater",
      sofasCat,
      28999,
      39999,
      "Nordic inspired clean lines with tapered solid oak legs and stain-resistant woven upholstery.",
      ["/images/products/sofas/sofa-5.jpg", "/images/products/sofas/sofa-6.jpg"],
      { materialType: "Oak & Linen", finishType: "Matte", dimensions: { length: 195, width: 84, height: 80 }, netWeight: 38 }
    ),
    base(
      "Apollo Compact Living Room Sofa & Footrest",
      sofasCat,
      24999,
      34999,
      "Space-efficient modern living couch featuring modular footstool and removable cushion covers.",
      ["/images/products/sofas/sofa-6.jpg", "/images/products/sofas/sofa-7.jpg"],
      { materialType: "Solid Wood", finishType: "Matte", dimensions: { length: 180, width: 85, height: 82 }, netWeight: 35 }
    ),

    // ── 2. BEDS ──────────────────────────────────────────────────────────────
    base(
      "Luxury Teak Wood King Size Bed",
      bedsCat,
      38999,
      54999,
      "Grand master bedroom bed crafted from 100% seasoned teak wood with upholstered headboard and reinforced platform base.",
      ["/images/products/beds/bed-1.jpg", "/images/products/beds/bed-2.jpg"],
      { materialType: "Teak Wood", finishType: "Honey Polish", dimensions: { length: 210, width: 195, height: 110 }, netWeight: 65, bestSeller: true, featured: true }
    ),
    base(
      "Amber Walnut Queen Platform Bed",
      bedsCat,
      29999,
      42999,
      "Low profile Japanese minimalist wooden bed frame with rich amber walnut woodgrain and silent acoustic slats.",
      ["/images/products/beds/bed-2.jpg", "/images/products/beds/bed-3.jpg"],
      { materialType: "Sheesham Wood", finishType: "Walnut", dimensions: { length: 205, width: 165, height: 95 }, netWeight: 54, bestSeller: true }
    ),
    base(
      "Royal Carved Master Bedroom Bed",
      bedsCat,
      45999,
      64999,
      "Artisanal heritage carved headboard bed handcrafted by Saharanpur master woodworkers with antique brass hardware.",
      ["/images/products/beds/bed-3.jpg", "/images/products/beds/bed-4.jpg"],
      { materialType: "Solid Rosewood", finishType: "Antique", dimensions: { length: 215, width: 198, height: 125 }, netWeight: 72, featured: true }
    ),
    base(
      "Nordic Clean Line Solid Wood Bed",
      bedsCat,
      27499,
      37999,
      "Contemporary slatted wooden bed with rounded corners, tapered feet, and non-creak mortise-tenon joinery.",
      ["/images/products/beds/bed-4.jpg", "/images/products/beds/bed-5.jpg"],
      { materialType: "Pine Wood", finishType: "Natural", dimensions: { length: 202, width: 162, height: 90 }, netWeight: 46 }
    ),
    base(
      "Modern Minimalist Timber Platform Bed",
      bedsCat,
      32999,
      45999,
      "Seamless solid timber bed with integrated bedside ledges and warm honey wood texture.",
      ["/images/products/beds/bed-5.jpg", "/images/products/beds/bed-6.jpg"],
      { materialType: "Mango Wood", finishType: "Matte", dimensions: { length: 208, width: 170, height: 98 }, netWeight: 50 }
    ),

    // ── 3. DINING ────────────────────────────────────────────────────────────
    base(
      "Walnut Solid Wood Large Slab Dining Table",
      diningCat,
      36999,
      52999,
      "Exquisite live-edge natural slab dining table with black powder-coated steel legs. Seats 6 adults comfortably.",
      ["/images/products/dining/dining-1.jpg", "/images/products/dining/dining-2.jpg"],
      { materialType: "Walnut Wood & Steel", finishType: "Natural", dimensions: { length: 180, width: 90, height: 76 }, netWeight: 58, bestSeller: true, featured: true }
    ),
    base(
      "Giza Composite Marble 6-Seater Dining Set",
      diningCat,
      44999,
      62999,
      "High-gloss composite marble tabletop dining set with 4 upholstered dining chairs and solid wood dining bench.",
      ["/images/products/dining/dining-2.jpg", "/images/products/dining/dining-3.jpg"],
      { materialType: "Marble & Solid Wood", finishType: "Glossy", dimensions: { length: 165, width: 95, height: 75 }, netWeight: 68, bestSeller: true }
    ),
    base(
      "Classic Sheesham 4-Seater Dining Set",
      diningCat,
      25999,
      36999,
      "Traditional handcrafted Sheesham wood dining table with 4 high-back slatted wooden chairs.",
      ["/images/products/dining/dining-3.jpg", "/images/products/dining/dining-4.jpg"],
      { materialType: "Sheesham Wood", finishType: "Honey Polish", dimensions: { length: 120, width: 80, height: 75 }, netWeight: 42 }
    ),
    base(
      "Modern Rustic Extendable Dining Table",
      diningCat,
      32999,
      46999,
      "Flexible extendable solid wood table extending from 4 to 8 seating capacity with hidden center leaf mechanism.",
      ["/images/products/dining/dining-4.jpg", "/images/products/dining/dining-5.jpg"],
      { materialType: "Solid Teak", finishType: "Walnut", dimensions: { length: 200, width: 90, height: 76 }, netWeight: 52 }
    ),
    base(
      "Scandinavian Round Dining Table & 4 Chairs",
      diningCat,
      28999,
      39999,
      "Chic circular dining table with beveled edge and 4 curved fabric dining chairs in warm beige.",
      ["/images/products/dining/dining-5.jpg", "/images/products/dining/dining-6.jpg"],
      { materialType: "Oak & Fabric", finishType: "Natural", dimensions: { length: 110, width: 110, height: 75 }, netWeight: 38 }
    ),

    // ── 4. COFFEE TABLES ─────────────────────────────────────────────────────
    base(
      "Asher Solid Oak Round Coffee Table",
      coffeeCat,
      11999,
      16999,
      "Mid-century modern round coffee table with tapered tripod legs and eco-friendly polyurethane protective coat.",
      ["/images/products/coffee-tables/coffee-table-1.jpg", "/images/products/coffee-tables/coffee-table-2.jpg"],
      { materialType: "Solid Oak", finishType: "Natural", dimensions: { length: 80, width: 80, height: 45 }, netWeight: 14, bestSeller: true, featured: true }
    ),
    base(
      "Scandinavian Foldable Walnut Coffee Table",
      coffeeCat,
      13499,
      18999,
      "Clever dual-level wooden coffee table with lower slatted magazine shelf and space-saving foldability.",
      ["/images/products/coffee-tables/coffee-table-2.jpg", "/images/products/coffee-tables/coffee-table-3.jpg"],
      { materialType: "Walnut Wood", finishType: "Walnut", dimensions: { length: 110, width: 55, height: 44 }, netWeight: 16, bestSeller: true }
    ),
    base(
      "George Oliver Mid-Century Modern Center Table",
      coffeeCat,
      14999,
      21999,
      "Elegant curved oval coffee table in solid Sheesham with soft organic contours and satin lacquer finish.",
      ["/images/products/coffee-tables/coffee-table-3.jpg", "/images/products/coffee-tables/coffee-table-4.jpg"],
      { materialType: "Sheesham Wood", finishType: "Matte", dimensions: { length: 115, width: 60, height: 42 }, netWeight: 18 }
    ),
    base(
      "Minimalist Fluted Ceramic & Wood Coffee Table",
      coffeeCat,
      16499,
      23999,
      "Blends layered beige clay tones and fluted timber pedestal base for an ultra-modern aesthetic.",
      ["/images/products/coffee-tables/coffee-table-4.jpg", "/images/products/coffee-tables/coffee-table-5.jpg"],
      { materialType: "Ceramic & Mango Wood", finishType: "Matte", dimensions: { length: 85, width: 85, height: 40 }, netWeight: 22 }
    ),
    base(
      "Rustic Solid Wood Nested Coffee Table Set",
      coffeeCat,
      9999,
      14999,
      "Set of 2 nesting tables that slide together for compact living or separate for hosting guests.",
      ["/images/products/coffee-tables/coffee-table-5.jpg", "/images/products/coffee-tables/coffee-table-6.jpg"],
      { materialType: "Mango Wood", finishType: "Honey Polish", dimensions: { length: 70, width: 70, height: 48 }, netWeight: 15 }
    ),

    // ── 5. CHAIRS ────────────────────────────────────────────────────────────
    base(
      "Bishop Fabric Dining Accent Chair",
      chairsCat,
      8999,
      12999,
      "High-end dining side chair with curved barrel back, dense cushioning and solid Sheesham legs.",
      ["/images/products/chairs/chair-1.jpg", "/images/products/chairs/chair-2.jpg"],
      { materialType: "Sheesham & Linen", finishType: "Walnut", dimensions: { length: 55, width: 58, height: 84 }, netWeight: 9, bestSeller: true, featured: true }
    ),
    base(
      "Khadi Solid Wood Ergonomic Chair",
      chairsCat,
      7499,
      10999,
      "Handcrafted curved wooden chair contoured to lumbar anatomy with smooth satin surface touch.",
      ["/images/products/chairs/chair-2.jpg", "/images/products/chairs/chair-3.jpg"],
      { materialType: "Solid Teak", finishType: "Natural", dimensions: { length: 52, width: 54, height: 82 }, netWeight: 8, bestSeller: true }
    ),
    base(
      "Petiribi Comfort Wood & Fabric Lounge Chair",
      chairsCat,
      11499,
      16999,
      "Deep seated accent reading chair crafted with authentic petiribi wood character and textured woven seat.",
      ["/images/products/chairs/chair-3.jpg", "/images/products/chairs/chair-4.jpg"],
      { materialType: "Solid Wood & Fabric", finishType: "Matte", dimensions: { length: 65, width: 68, height: 78 }, netWeight: 12 }
    ),
    base(
      "Mid-Century Modern Dining Chairs (Set of 2)",
      chairsCat,
      13999,
      19999,
      "Pair of iconic curved dining chairs with tapered brass capped feet and easy-clean woven seat fabric.",
      ["/images/products/chairs/chair-4.jpg", "/images/products/chairs/chair-5.jpg"],
      { materialType: "Teak & Brass", finishType: "Walnut", dimensions: { length: 54, width: 56, height: 83 }, netWeight: 15 }
    ),
    base(
      "Curved Spindle Back Farmhouse Chair",
      chairsCat,
      6499,
      9499,
      "Timeless Windsor-inspired wooden spindle chair with sculpted saddle seat for lasting posture comfort.",
      ["/images/products/chairs/chair-5.jpg", "/images/products/chairs/chair-6.jpg"],
      { materialType: "Mango Wood", finishType: "Honey Polish", dimensions: { length: 50, width: 52, height: 86 }, netWeight: 7 }
    ),

    // ── 6. TV UNITS ──────────────────────────────────────────────────────────
    base(
      "Bme Jasper Solid Wood Media TV Unit",
      tvUnitsCat,
      21999,
      31999,
      "Clean low-profile TV console with slatted sliding doors, cable management grommets and wide surface for up to 75\" screens.",
      ["/images/products/tv-units/tv-unit-1.jpg", "/images/products/tv-units/tv-unit-2.jpg"],
      { materialType: "Solid Teak", finishType: "Walnut", dimensions: { length: 160, width: 42, height: 50 }, netWeight: 32, bestSeller: true, featured: true }
    ),
    base(
      "Modern Luxury Fluted Entertainment Console",
      tvUnitsCat,
      24999,
      35999,
      "Dual tone entertainment unit with fluted drawer fronts, soft-close hardware and open soundbar compartment.",
      ["/images/products/tv-units/tv-unit-2.jpg", "/images/products/tv-units/tv-unit-3.jpg"],
      { materialType: "Sheesham Wood", finishType: "Matte", dimensions: { length: 175, width: 45, height: 52 }, netWeight: 36, bestSeller: true }
    ),
    base(
      "Amber Walnut Wall-Mounted TV Unit",
      tvUnitsCat,
      17499,
      24999,
      "Floating TV console that mounts cleanly on the wall with concealed wiring channels and tempered glass shelves.",
      ["/images/products/tv-units/tv-unit-3.jpg", "/images/products/tv-units/tv-unit-4.jpg"],
      { materialType: "Sheesham Wood", finishType: "Honey Polish", dimensions: { length: 145, width: 35, height: 32 }, netWeight: 24 }
    ),
    base(
      "Nordic Minimalist Two-Tier TV Stand",
      tvUnitsCat,
      19999,
      28999,
      "Sleek Scandinavian TV credenza featuring solid oak legs, asymmetrical display cubbies and dual drawers.",
      ["/images/products/tv-units/tv-unit-4.jpg", "/images/products/tv-units/tv-unit-5.jpg"],
      { materialType: "Oak Wood", finishType: "Natural", dimensions: { length: 150, width: 40, height: 48 }, netWeight: 28 }
    ),

    // ── 7. BOOKSHELVES ───────────────────────────────────────────────────────
    base(
      "Mason Curio Glass Display Bookshelf",
      bookCat,
      26999,
      38999,
      "Tall elegant curio bookshelf with clear glass doors, solid brass handles and 4 adjustable wooden display tiers.",
      ["/images/products/bookshelves/bookshelf-1.jpg", "/images/products/bookshelves/bookshelf-2.jpg"],
      { materialType: "Sheesham Wood & Glass", finishType: "Walnut", dimensions: { length: 90, width: 40, height: 185 }, netWeight: 45, bestSeller: true, featured: true }
    ),
    base(
      "Modern Arched Pau Ferro Bookshelf",
      bookCat,
      22999,
      32999,
      "Sculptural arched top bookshelf with softly rounded corners and distinctive Brazilian grain character.",
      ["/images/products/bookshelves/bookshelf-2.jpg", "/images/products/bookshelves/bookshelf-3.jpg"],
      { materialType: "Solid Teak", finishType: "Natural", dimensions: { length: 85, width: 36, height: 175 }, netWeight: 38, bestSeller: true }
    ),
    base(
      "Cozy Multitier Wooden Book Rack",
      bookCat,
      15499,
      22999,
      "5-tier freestanding open bookcase designed for home libraries, decor displays and indoor planters.",
      ["/images/products/bookshelves/bookshelf-3.jpg", "/images/products/bookshelves/bookshelf-4.jpg"],
      { materialType: "Mango Wood", finishType: "Honey Polish", dimensions: { length: 80, width: 32, height: 160 }, netWeight: 26 }
    ),
    base(
      "Geometric Asymmetrical Open Bookshelf",
      bookCat,
      18999,
      26999,
      "Contemporary staggered cube shelf unit functioning beautifully as a space divider or wall unit.",
      ["/images/products/bookshelves/bookshelf-4.jpg", "/images/products/bookshelves/bookshelf-5.jpg"],
      { materialType: "Sheesham Wood", finishType: "Matte", dimensions: { length: 100, width: 35, height: 170 }, netWeight: 34 }
    ),

    // ── 8. CHEST OF DRAWERS ──────────────────────────────────────────────────
    base(
      "Cherry Wood 6-Drawer Bedroom Dresser",
      chestCat,
      28999,
      41999,
      "Wide bedroom chest with 6 deep glide drawers, dovetailed joinery and warm cherry wood satin finish.",
      ["/images/products/chest-of-drawers/chest-of-drawers-1.jpg", "/images/products/chest-of-drawers/chest-of-drawers-2.jpg"],
      { materialType: "Sheesham Wood", finishType: "Walnut", dimensions: { length: 130, width: 48, height: 86 }, netWeight: 54, bestSeller: true, featured: true }
    ),
    base(
      "Bufet Enam Sorok Vintage Cabinet",
      chestCat,
      31499,
      44999,
      "Mid-century credenza chest featuring 6 carved relief drawers and antique brass cup pulls.",
      ["/images/products/chest-of-drawers/chest-of-drawers-2.jpg", "/images/products/chest-of-drawers/chest-of-drawers-3.jpg"],
      { materialType: "Solid Teak", finishType: "Antique", dimensions: { length: 140, width: 45, height: 82 }, netWeight: 56, bestSeller: true }
    ),
    base(
      "Tall 5-Drawer Vertical Chest",
      chestCat,
      22499,
      31999,
      "Space-saving vertical tower dresser with felt-lined top jewelry drawer and smooth soft-close runners.",
      ["/images/products/chest-of-drawers/chest-of-drawers-3.jpg", "/images/products/chest-of-drawers/chest-of-drawers-4.jpg"],
      { materialType: "Mango Wood", finishType: "Honey Polish", dimensions: { length: 75, width: 45, height: 120 }, netWeight: 42 }
    ),
    base(
      "Fluted Solid Sheesham Sideboard Dresser",
      chestCat,
      26999,
      37999,
      "Statement storage console with fluted facade, brass legs and generous interior compartments.",
      ["/images/products/chest-of-drawers/chest-of-drawers-4.jpg", "/images/products/chest-of-drawers/chest-of-drawers-5.jpg"],
      { materialType: "Sheesham Wood & Brass", finishType: "Matte", dimensions: { length: 120, width: 44, height: 85 }, netWeight: 48 }
    ),

    // ── 9. DRESSING TABLES ───────────────────────────────────────────────────
    base(
      "Modern Wooden Vanity Table with Mirror & Storage",
      dressingCat,
      23999,
      34999,
      "Minimalist bedroom vanity console with large round mirror, dual cosmetic drawers and hidden jewelry compartment.",
      ["/images/products/dressing-tables/dressing-table-1.jpg", "/images/products/dressing-tables/dressing-table-2.jpg"],
      { materialType: "Teak Wood & Glass", finishType: "Natural", dimensions: { length: 105, width: 45, height: 140 }, netWeight: 36, bestSeller: true, featured: true }
    ),
    base(
      "Elegant Wooden Almari Wardrobe Unit",
      dressingCat,
      39999,
      56999,
      "Full-height master bedroom wardrobe vanity with full length dressing mirror and internal organizing shelves.",
      ["/images/products/dressing-tables/dressing-table-2.jpg", "/images/products/dressing-tables/dressing-table-3.jpg"],
      { materialType: "Sheesham Wood & Mirror", finishType: "Walnut", dimensions: { length: 110, width: 55, height: 195 }, netWeight: 68, bestSeller: true }
    ),
    base(
      "Compact Solid Wood Vanity & Cushioned Stool",
      dressingCat,
      19999,
      28999,
      "Space-conscious bedroom makeup vanity with flip-top mirror, organizing trays and tuck-in upholstered stool.",
      ["/images/products/dressing-tables/dressing-table-3.jpg", "/images/products/dressing-tables/dressing-table-4.jpg"],
      { materialType: "Mango Wood", finishType: "Honey Polish", dimensions: { length: 85, width: 42, height: 125 }, netWeight: 30 }
    ),
    base(
      "Heritage Carved Dressing Console",
      dressingCat,
      27999,
      39999,
      "Royal carved frame dressing table with arch mirror and curved cabriole legs in antique polish.",
      ["/images/products/dressing-tables/dressing-table-4.jpg", "/images/products/dressing-tables/dressing-table-5.jpg"],
      { materialType: "Rosewood", finishType: "Antique", dimensions: { length: 115, width: 48, height: 155 }, netWeight: 44 }
    ),
  ];
};

// ─── Seed Function ─────────────────────────────────────────────────────────────
export async function seedData() {
  try {
    console.log("🗑️  Cleaning old data...");
    await Promise.all([
      Product.deleteMany({}),
      Collection.deleteMany({}),
      User.deleteMany({ email: { $in: USERS.map((u) => u.email) } }),
    ]);
    console.log("   Old products and categories cleared.\n");

    console.log("📂 Inserting 9 furniture categories...");
    const createdCategories = await Collection.insertMany(CATEGORIES);
    createdCategories.forEach((c) => console.log(`   ✔ ${c.name} (${c.slug})`));
    console.log();

    console.log("👤 Creating test users...");
    for (const u of USERS) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed });
      console.log(`   ✔ ${u.role === "admin" ? "Admin" : "User "} — ${u.email}`);
    }
    console.log();

    console.log("🛍️  Creating products with migrated assets...");
    const catRefs = createdCategories.map((c) => ({
      _id: c._id as mongoose.Types.ObjectId,
      slug: c.slug,
    }));
    const productsData = makeProducts(catRefs);
    const createdProducts = await Product.insertMany(productsData);
    console.log(`   ✔ ${createdProducts.length} products created across all 9 categories.\n`);

    console.log("─".repeat(50));
    console.log("🎉 Seed complete!");
    console.log(`   Categories : ${createdCategories.length}`);
    console.log(`   Products   : ${createdProducts.length}`);
    console.log("─".repeat(50));
  } catch (err) {
    console.error("❌ Seed failed:", err);
  }
}

async function runStandaloneSeed() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log("✅ Connected!\n");
    await seedData();
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected.");
  }
}

if (require.main === module) {
  runStandaloneSeed();
}
