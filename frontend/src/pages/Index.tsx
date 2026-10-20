import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Award, Sparkles, ChevronRight } from "lucide-react";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/common/CategoryGrid";
import ProductCarousel from "@/components/common/ProductCarousel";
import ProductCard from "@/components/ProductCard";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

export default function Index() {
  const { data: dbCategories = [] } = useCategories();
  const { data: bestSellers = [], isLoading: loadingBestSellers } = useProducts({
    bestSeller: true,
    limit: 10,
  });
  const { data: newArrivals = [], isLoading: loadingNewArrivals } = useProducts({
    limit: 8,
  });

  // Curated 8 square categories for "Explore Our Furniture Range" (Kaizen Livings signature grid)
  const showcaseCategories = useMemo(() => {
    const defaultCategories = [
      {
        _id: "sofas",
        name: "Sofas & Recliners",
        slug: "sofas",
        subtitle: "Fabric & Wooden Lounges",
        image: "/images/categories/sofas.jpg",
      },
      {
        _id: "beds",
        name: "Beds & Mattresses",
        slug: "beds",
        subtitle: "Solid Teak & Sheesham Beds",
        image: "/images/categories/beds.jpg",
      },
      {
        _id: "dining",
        name: "Dining Tables & Sets",
        slug: "dining",
        subtitle: "Solid Wood 4 & 6 Seaters",
        image: "/images/categories/dining.jpg",
      },
      {
        _id: "coffee-tables",
        name: "Coffee Tables",
        slug: "coffee-tables",
        subtitle: "Center & Nesting Tables",
        image: "/images/categories/coffee-tables.jpg",
      },
      {
        _id: "chairs",
        name: "Chairs & Benches",
        slug: "chairs",
        subtitle: "Accent, Dining & Lounges",
        image: "/images/categories/chairs.jpg",
      },
      {
        _id: "tv-units",
        name: "TV Units & Media",
        slug: "tv-units",
        subtitle: "Modern Wall & Lowline Stands",
        image: "/images/categories/tv-units.jpg",
      },
      {
        _id: "bookshelves",
        name: "Bookshelves & Display",
        slug: "bookshelves",
        subtitle: "Multi-Tier Open & Glass Units",
        image: "/images/categories/bookshelves.jpg",
      },
      {
        _id: "chest-of-drawers",
        name: "Chest of Drawers",
        slug: "chest-of-drawers",
        subtitle: "Multi-Drawer Storage Dressers",
        image: "/images/categories/chest-of-drawers.jpg",
      },
      {
        _id: "dressing-tables",
        name: "Dressing Tables",
        slug: "dressing-tables",
        subtitle: "Vanity Consoles with Mirrors",
        image: "/images/categories/dressing-tables.jpg",
      },
    ];

    if (dbCategories && dbCategories.length > 0) {
      const active = dbCategories.filter((c) => c.isActive !== false);
      const mapped = active.map((c) => {
        const found = defaultCategories.find((d) => d.slug === c.slug);
        return {
          _id: c._id,
          name: c.name,
          slug: c.slug,
          subtitle: found?.subtitle || "Handcrafted Furniture",
          image: c.imageUrl || c.image || found?.image,
        };
      });

      // Fill remaining default categories if needed
      for (const d of defaultCategories) {
        if (!mapped.some((m) => m.slug === d.slug)) {
          mapped.push(d);
        }
      }
      return mapped;
    }

    return defaultCategories;
  }, [dbCategories]);


  return (
    <div className="bg-white min-h-screen font-sans text-[#323232]">
      {/* ── 1. Full-Width Hero Promotional Banner Carousel ── */}
      <HeroBanner />

      {/* ── 2. Bank & Festive Offers Strip (Kaizen Livings Signature) ── */}
      <section className="bg-[#F8F1EB] border-b border-[#E0E0E0] py-3.5 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="bg-[#DF6B3B] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] uppercase tracking-wider">
              Special Offer
            </span>
            <span className="font-semibold text-[#323232]">
              Instant 10% Discount on Orders Above ₹3,999 with UPI & Cards
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-[#666666]">
            <span>✦ Use Coupon: <strong className="text-[#DF6B3B]">KAIZEN10</strong></span>
            <span>✦ Free Pan-India White Glove Delivery</span>
            <Link to="/shop" className="text-[#DF6B3B] font-bold hover:underline flex items-center gap-1">
              View All Offers <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. Explore Our Furniture Range (Category Grid) ── */}
      <section className="py-12 sm:py-16 bg-white border-b border-[#E0E0E0]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#DF6B3B] block mb-1.5">
                Handcrafted Categories
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#323232] tracking-tight">
                Explore Our Furniture Range
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">
                Explore solid wood furniture and authentic Indian artisan handicrafts designed for modern living
              </p>
            </div>
            <Link
              to="/collections"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#DF6B3B] hover:text-[#C85A2E] hover:underline"
            >
              <span>View All Categories</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <CategoryGrid categories={showcaseCategories} />
        </div>
      </section>

      {/* ── 4. Best Sellers Horizontal Carousel (Kaizen Livings Bestsellers) ── */}
      <section className="py-12 sm:py-16 bg-[#F5F5F5] border-b border-[#E0E0E0]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-[#DF6B3B] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] uppercase tracking-wider">
                  Top Rated
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#666666]">
                  Customer Favorites
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#323232] tracking-tight">
                Kaizen Livings Bestsellers
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">
                Our most coveted and highest-rated solid wood furniture pieces
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#DF6B3B] hover:text-[#C85A2E] hover:underline"
            >
              <span>See All Bestsellers</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loadingBestSellers ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-3 border border-[#E0E0E0] rounded-[2px] animate-pulse"
                >
                  <div className="aspect-[4/3] bg-gray-200 rounded-[2px] mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <ProductCarousel products={bestSellers} />
          )}
        </div>
      </section>

      {/* ── 5. New Arrivals Showcase Grid ── */}
      <section className="py-12 sm:py-16 bg-white border-b border-[#E0E0E0]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#DF6B3B] block mb-1.5">
                Fresh From The Workshop
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#323232] tracking-tight">
                Newly Added Artisan Designs
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">
                Explore the latest additions crafted by our master woodworkers and ceramic artists
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#DF6B3B] hover:text-[#C85A2E] hover:underline"
            >
              <span>Explore All Products</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loadingNewArrivals ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-3 border border-[#E0E0E0] rounded-[2px] animate-pulse"
                >
                  <div className="aspect-[4/3] bg-gray-200 rounded-[2px] mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#DF6B3B] hover:bg-[#C85A2E] active:bg-[#A8441F] text-white text-xs font-bold uppercase tracking-wider px-8 py-3 rounded-[2px] shadow-xs transition-colors"
            >
              <span>Browse Entire Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. Limited Time Deal Spotlight Banner ── */}
      <section className="py-12 sm:py-16 bg-[#F8F1EB] border-b border-[#E0E0E0]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white border border-[#E0E0E0] rounded-[2px] overflow-hidden p-6 sm:p-10 shadow-xs">
            <div className="space-y-4">
              <span className="bg-[#0FB67E] text-white text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-[2px]">
                Limited-Time Deal
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#323232] leading-snug">
                Handcrafted Solid Wood Living Room Sofas
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                Transform your living space with our handcrafted 3-seater sofas and lounge recliners.
                Kiln-dried seasoned Sheesham and Teak wood with high-density acoustic foam cushions.
              </p>
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-2xl font-bold text-[#323232]">Starting at ₹24,999</span>
                <span className="text-sm text-[#999999] line-through">₹34,999</span>
                <span className="text-xs font-bold text-[#0FB67E]">Up to 30% Off</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/shop?category=sofas"
                  className="inline-flex items-center gap-2 bg-[#DF6B3B] hover:bg-[#C85A2E] text-white text-xs font-bold uppercase tracking-wider px-7 py-3 rounded-[2px] transition-colors shadow-xs"
                >
                  <span>Shop Sofas Now</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-[2px] overflow-hidden bg-[#F5F5F5] border border-[#E0E0E0]">
              <img
                src="/images/products/sofas/sofa-1.jpg"
                alt="Handcrafted Solid Wood Sofa"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>


      {/* ── 7. Artisan Craftsmanship Heritage (Kaizen Livings Story) ── */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#E0E0E0]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Imagery */}
            <div className="relative aspect-[4/3] rounded-[2px] overflow-hidden border border-[#E0E0E0] shadow-sm bg-[#F5F5F5]">
              <img
                src="https://thebusinessrule.com/wp-content/uploads/2023/02/Handicraft-2-1.jpg?w=800&q=80&auto=format&fit=crop"
                alt="Master Artisan Crafting Wooden Furniture"
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3.5 rounded-[2px] border border-[#E0E0E0]">
                <p className="text-xs font-bold text-[#323232]">
                  Authentic Rajasthani Woodwork
                </p>
                <p className="text-[11px] text-[#666666]">
                  Over 50+ master artisans working with sustainable Sheesham & Teak
                </p>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#DF6B3B] block mb-2">
                Our Craft Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#323232] leading-tight mb-4">
                The Heritage of Indian Woodworking & Handcraft
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mb-4">
                Kaizen Livings was founded to bridge the timeless legacy of Indian artisan guilds with
                contemporary interior aesthetics. Every piece is built by skilled craftsmen in Jodhpur,
                using seasoned hardwoods that age with grace and character.
              </p>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mb-6">
                From hand-chiseled Jali fretwork to vibrant blue pottery glazing, each item embodies human touch,
                cultural authenticity, and enduring durability.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E0E0E0] mb-6">
                <div className="p-3 bg-[#F8F1EB] rounded-[2px] border border-[#E0E0E0] text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#DF6B3B]">100%</div>
                  <div className="text-[11px] text-[#666666] font-medium mt-0.5">Solid Wood</div>
                </div>
                <div className="p-3 bg-[#F8F1EB] rounded-[2px] border border-[#E0E0E0] text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#DF6B3B]">50+</div>
                  <div className="text-[11px] text-[#666666] font-medium mt-0.5">Artisans</div>
                </div>
                <div className="p-3 bg-[#F8F1EB] rounded-[2px] border border-[#E0E0E0] text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#DF6B3B]">1 Year</div>
                  <div className="text-[11px] text-[#666666] font-medium mt-0.5">Warranty</div>
                </div>
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 border border-[#323232] text-[#323232] hover:bg-[#323232] hover:text-white text-xs font-bold uppercase tracking-wider px-7 py-3 rounded-[2px] transition-colors"
              >
                <span>Read Our Full Story</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Customer Love & Reviews Strip ── */}
      <section className="py-12 sm:py-16 bg-[#F5F5F5] border-b border-[#E0E0E0]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#DF6B3B] block mb-1">
              Customer Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#323232]">
              Loved by Homeowners Across India
            </h2>
            <div className="flex items-center justify-center gap-1 mt-2 text-[#DF6B3B]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={15} className="fill-[#DF6B3B]" />
              ))}
              <span className="text-xs font-bold text-[#323232] ml-2">4.8 / 5 Rating (850+ Reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Ananya Sharma",
                city: "Bengaluru",
                title: "Exquisite Wood Carving",
                review:
                  "The Sheesham 3-Daraz rack exceeded all my expectations. The wood grain is gorgeous, and the packaging was sturdy. It adds so much warmth to our living room.",
                rating: 5,
              },
              {
                name: "Rohit Verma",
                city: "Delhi NCR",
                title: "Authentic Handcrafted Quality",
                review:
                  "Ordered both the Blue Pottery vases and a wall panel. You can tell real artisans made these. Free delivery was prompt and unboxing was a joy.",
                rating: 5,
              },
              {
                name: "Priya Nair",
                city: "Mumbai",
                title: "Sturdy & Beautiful Finish",
                review:
                  "The 6-Daraz unit is built like a tank. Real solid wood, no engineered particle board. Highly recommend Kaizen for anyone wanting genuine Indian craftsmanship.",
                rating: 5,
              },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-white border border-[#E0E0E0] p-6 rounded-[2px] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#DF6B3B] mb-2.5">
                    {Array.from({ length: review.rating }).map((_, rIdx) => (
                      <Star key={rIdx} size={13} className="fill-[#DF6B3B]" />
                    ))}
                  </div>
                  <h4 className="font-bold text-sm text-[#323232] mb-1.5">{review.title}</h4>
                  <p className="text-xs text-[#666666] leading-relaxed mb-4">"{review.review}"</p>
                </div>
                <div className="pt-3 border-t border-[#E0E0E0] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#323232]">{review.name}</span>
                  <span className="text-[#999999]">{review.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}