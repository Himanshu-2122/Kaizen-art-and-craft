import { Link } from "react-router-dom";
import HeroBanner from "@/components/home/HeroBanner";
import CollectionsGrid from "@/components/home/CollectionsGrid";
import NewArrivals from "@/components/home/NewArrivals";
import FeaturesSection from "@/components/home/FeaturesSection";

/* ── Flash Sale inline component ── */
const flashOffers = [
  {
    title: "Phulkari Embroidered Cushion Set",
    originalPrice: 1699,
    offerPrice: 1199,
    badge: "30% OFF",
    href: "/shop?category=textile-crafts&search=phulkari",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=80",
  },
  {
    title: "Blue Pottery Vase Collection",
    originalPrice: 2499,
    offerPrice: 1799,
    badge: "28% OFF",
    href: "/shop?category=pottery&search=blue+pottery",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&q=80",
  },
];

function FlashSale() {
  return (
    <section className="bg-white py-10 sm:py-14 md:py-16 border-t border-[#EEEEEE]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6 sm:mb-8 md:mb-10">
          <div>
            <span className="inline-block bg-[#FF6E31] text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 mb-2">
              Flash Sale
            </span>
            <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold text-[#111111]">
              Limited-Time Offers
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex text-sm font-medium text-[#FF6E31] hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {flashOffers.map((offer, i) => (
            <Link
              key={i}
              to={offer.href}
              className="group rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 block"
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-[#FF6E31] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {offer.badge}
                </span>
              </div>
              <div className="p-4 sm:p-5 text-center">
                <h3 className="font-medium text-[#111111] text-sm sm:text-base mb-2 sm:mb-3">
                  {offer.title}
                </h3>
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="line-through text-[#999999] text-xs sm:text-sm">
                    ₹{offer.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-[#111111]">
                    ₹{offer.offerPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="inline-block w-full sm:w-auto bg-[#111111] hover:bg-[#FF6E31] text-white font-bold text-sm px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors">
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
    <section className="bg-[#F8F8F8] py-10 sm:py-14 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image — shows first on mobile for visual hook, second on desktop */}
          <div
            className="order-1 md:order-2 overflow-hidden rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)]"
            style={{ aspectRatio: "4/3" }}
          >
            <img
              src="https://thebusinessrule.com/wp-content/uploads/2023/02/Handicraft-2-1.jpg?w=800&q=80&auto=format&fit=crop"
              alt="Artisan shaping handmade pottery"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <div className="order-2 md:order-1">
            <span className="text-[11px] font-bold tracking-[3px] text-[#FF6E31] uppercase block mb-3">
              Our Story
            </span>
            <h2 className="text-[24px] sm:text-[26px] md:text-[28px] font-bold tracking-tight text-[#111111] mb-4 sm:mb-5 leading-snug">
              Kaizen Art & Craft
            </h2>
            <p className="text-sm sm:text-[15px] text-[#555555] leading-[1.8] sm:leading-[1.9] mb-4">
              Kaizen Art & Craft is a celebration of India's rich handcraft heritage. We bring you
              authentic, hand-made pieces — from Rajasthan's vibrant Mandala wall art and Jaipur's
              iconic Blue Pottery, to Punjab's Phulkari embroidery and Bengal's Kantha stitch throws.
            </p>
            <p className="text-sm sm:text-[15px] text-[#555555] leading-[1.8] sm:leading-[1.9] mb-6">
              Every piece is crafted by skilled artisans using traditional techniques passed down through
              generations. When you buy from Kaizen, you're supporting a living art form.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-5 sm:pt-6 border-t border-[#EEEEEE]">
              {[
                { value: "100%", label: "Handmade" },
                { value: "3", label: "Craft Categories" },
                { value: "12+", label: "Unique Products" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#FF6E31]">{value}</div>
                  <div className="text-[11px] sm:text-xs text-[#555555] font-medium mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-block mt-6 sm:mt-8 border border-[#111111] text-[#111111] font-bold text-sm px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-[#111111] hover:text-white transition-colors"
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
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <HeroBanner />
      <FeaturesSection />
      <CollectionsGrid />
      <NewArrivals />
      <FlashSale />
      <AboutStrip />
    </div>
  );
}