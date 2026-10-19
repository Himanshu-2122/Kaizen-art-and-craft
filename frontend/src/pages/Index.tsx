import { useMemo } from "react";
import { Link } from "react-router-dom";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewArrivals from "@/components/home/NewArrivals";
import { CategoryGrid } from "@/components/common/CategoryGrid";
import CategoryTile from "@/components/common/CategoryTile";
import { ProductGrid } from "@/components/common/ProductGrid";
import { ProductCarousel } from "@/components/common/ProductCarousel";
import { useCategories } from "@/hooks/useCategories";

/* ── Flash Sale inline component ── */
const flashOffers = [
  {
    title: "Handcrafted Teak Wood 3-Daraz Shelf",
    originalPrice: 2699,
    offerPrice: 1899,
    badge: "30% OFF",
    href: "/shop?category=3-daraz&search=sheesham",
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=700&q=80",
  },
  {
    title: "Artisan Solid Elm Wood Coffee Table",
    originalPrice: 3499,
    offerPrice: 2499,
    badge: "28% OFF",
    href: "/shop?category=3-daraz",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=700&q=80",
  },
];

function FlashSale() {
  return (
    <section className="bg-white py-12 md:py-16 border-t border-[#dedede]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
          <div>
            <span className="inline-block bg-[#0fb67e] text-white text-[11px] font-bold tracking-widest uppercase px-2.5 py-0.5 mb-2 rounded-[2px]">
              Flash Sale
            </span>
            <h2 className="text-[26px] md:text-[30px] font-bold text-[#121212]">
              Limited-Time Offers
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex text-[13px] font-bold text-[#ec7744] hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flashOffers.map((offer, i) => (
            <Link
              key={i}
              to={offer.href}
              className="group bg-white rounded-[4px] border border-[#dedede] overflow-hidden hover:border-[#ec7744] hover:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] transition-all block"
            >
              <div className="relative overflow-hidden aspect-[16/9] bg-[#f7f7f7]">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-[#0fb67e] text-white text-[11px] font-bold px-2.5 py-1 rounded-[2px] shadow-sm">
                  {offer.badge}
                </span>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-bold text-[#121212] text-base mb-2 group-hover:text-[#ec7744] transition-colors">
                  {offer.title}
                </h3>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="line-through text-[#7d7d7d] text-sm">
                    ₹{offer.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xl font-bold text-[#121212]">
                    ₹{offer.offerPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="inline-block w-full sm:w-auto bg-[#ec7744] hover:bg-[#f09269] text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-[4px] transition-colors shadow-sm">
                  Grab This Offer
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── About Strip inline component ── */
function AboutStrip() {
  return (
    <section className="bg-[#f8f1eb] py-14 md:py-16 border-t border-b border-[#dedede]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
          {/* Image */}
          <div
            className="order-1 md:order-2 overflow-hidden rounded-[4px] border border-[#dedede] shadow-sm aspect-[4/3] bg-white"
          >
            <img
              src="https://thebusinessrule.com/wp-content/uploads/2023/02/Handicraft-2-1.jpg?w=800&q=80&auto=format&fit=crop"
              alt="Artisan shaping handmade pottery"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <div className="order-2 md:order-1">
            <span className="text-[11px] font-bold tracking-[2px] text-[#ec7744] uppercase block mb-2">
              Our Story
            </span>
            <h2 className="text-[26px] sm:text-[30px] md:text-[34px] font-bold tracking-tight text-[#121212] mb-4 leading-snug">
              Kaizen Art & Craft
            </h2>
            <p className="text-sm sm:text-[15px] text-[#7d7d7d] leading-[1.8] mb-3">
              Kaizen Art & Craft is a celebration of India's rich handcraft heritage. We bring you
              authentic, hand-made pieces — from Rajasthan's vibrant Mandala wall art and Jaipur's
              iconic Blue Pottery, to Punjab's Phulkari embroidery and Bengal's Kantha stitch throws.
            </p>
            <p className="text-sm sm:text-[15px] text-[#7d7d7d] leading-[1.8] mb-6">
              Every piece is crafted by skilled artisans using traditional techniques passed down through
              generations. When you buy from Kaizen, you're supporting a living art form.
            </p>

            {/* Stats: reference .SeUHN style */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#dedede]">
              {[
                { value: "100%", label: "Handmade" },
                { value: "5+", label: "Craft Categories" },
                { value: "50+", label: "Master Artisans" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center p-2.5 bg-white/70 rounded-[4px] border border-[#dedede]">
                  <div className="text-xl sm:text-2xl font-bold text-[#ec7744]">{value}</div>
                  <div className="text-[11px] sm:text-xs text-[#7d7d7d] font-medium mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-block mt-6 border border-[#121212] text-[#121212] font-bold text-xs uppercase tracking-wider px-7 py-3 rounded-[4px] hover:bg-[#121212] hover:text-white transition-colors"
            >
              Our Story →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  const { data: dbCategories = [] } = useCategories();

  const showcaseCategories = useMemo(() => {
    if (dbCategories && dbCategories.length > 0) {
      return dbCategories
        .filter((c) => c.isActive !== false)
        .slice(0, 8)
        .map((c) => ({
          _id: c._id,
          name: c.name,
          slug: c.slug,
          image: c.imageUrl || c.image,
        }));
    }
    return [
      {
        _id: "living-room",
        name: "Living Room",
        slug: "3-daraz",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80",
      },
      {
        _id: "3-daraz",
        name: "3 Daraz Racks",
        slug: "3-daraz",
        image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=500&q=80",
      },
      {
        _id: "6-daraz",
        name: "6 Daraz Cabinets",
        slug: "6-daraz",
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=500&q=80",
      },
      {
        _id: "tables-chairs",
        name: "Dining & Tables",
        slug: "3-daraz",
        image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=500&q=80",
      },
    ];
  }, [dbCategories]);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Value proposition features strip */}
      <FeaturesSection />

      {/* 3. New Arrivals dynamic storefront */}
      <NewArrivals />

      {/* 4. Curated Category Showcase: reference .atZoP / .Gj5h4 */}
      <section className="py-14 bg-white border-b border-[#dedede]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold tracking-[2px] text-[#ec7744] uppercase block mb-1.5">
                Artisan Collections
              </span>
              <h2 className="text-[26px] md:text-[30px] font-bold tracking-tight text-[#121212]">
                Explore By Craft
              </h2>
              <p className="text-[#7d7d7d] text-sm mt-1">Discover handcrafted masterpieces across categories</p>
            </div>
            <Link
              to="/collections"
              className="hidden md:inline-flex items-center gap-1 text-[13px] font-bold text-[#ec7744] hover:underline"
            >
              All Categories →
            </Link>
          </div>
          <CategoryGrid categories={showcaseCategories} />
        </div>
      </section>

      {/* 5. Featured Masterpieces Grid */}
      <section className="py-14 bg-[#f8f1eb]/30 border-b border-[#dedede]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold tracking-[2px] text-[#ec7744] uppercase block mb-1.5">
                Bestsellers
              </span>
              <h2 className="text-[26px] md:text-[30px] font-bold tracking-tight text-[#121212]">
                Customer Favorites
              </h2>
              <p className="text-[#7d7d7d] text-sm mt-1">Most loved solid wood handcrafted furniture pieces</p>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-1 text-[13px] font-bold text-[#ec7744] hover:underline"
            >
              Browse Shop →
            </Link>
          </div>
          <ProductGrid
            products={[
              {
                _id: "1",
                name: "Handcrafted Sheesham Wood 3 Daraz",
                slug: "sheesham-wood-3-daraz",
                price: 1899,
                mrpPrice: 2699,
                discountPercentage: 30,
                images: [
                  "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=600&q=80",
                ],
                category: "3-daraz",
                stock: 19,
                averageRating: 4.7,
                numReviews: 28,
              },
              {
                _id: "2",
                name: "Royal Carved Teak 6 Daraz Cabinet",
                slug: "royal-carved-6-daraz",
                price: 4299,
                mrpPrice: 5999,
                discountPercentage: 28,
                images: [
                  "https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80",
                ],
                category: "6-daraz",
                stock: 26,
                averageRating: 4.8,
                numReviews: 42,
              },
              {
                _id: "3",
                name: "Handmade Minimal 3 Daraz Shelf",
                slug: "minimal-3-daraz-shelf",
                price: 1299,
                mrpPrice: 1799,
                discountPercentage: 28,
                images: [
                  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
                ],
                category: "3-daraz",
                stock: 39,
                averageRating: 4.5,
                numReviews: 25,
              },
              {
                _id: "4",
                name: "Artisan Solid Elm Wood Coffee Table",
                slug: "elm-wood-coffee-table",
                price: 2499,
                mrpPrice: 3499,
                discountPercentage: 28,
                images: [
                  "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600&q=80",
                ],
                category: "3-daraz",
                stock: 14,
                averageRating: 4.9,
                numReviews: 35,
              },
            ]}
          />
        </div>
      </section>

      {/* 6. Flash Sale */}
      <FlashSale />

      {/* 7. Storytelling & Heritage Section */}
      <AboutStrip />
    </div>
  );
}