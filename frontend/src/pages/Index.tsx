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
    <section className="bg-white py-16 border-t border-[#EEEEEE]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block bg-[#FF6E31] text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 mb-2">
              Flash Sale
            </span>
            <h2 className="text-[28px] font-bold text-[#111111]">Limited-Time Offers</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex text-sm font-medium text-[#FF6E31] hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {flashOffers.map((offer, i) => (
            <Link
              key={i}
              to={offer.href}
              className="group shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 block"
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/7" }}>
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-[#FF6E31] text-white text-[10px] font-bold px-2 py-0.5">
                  {offer.badge}
                </span>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-medium text-[#111111] text-base mb-3">{offer.title}</h3>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="line-through text-[#999999] text-sm">
                    ₹{offer.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xl font-bold text-[#111111]">
                    ₹{offer.offerPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="inline-block bg-[#111111] hover:bg-[#FF6E31] text-white font-bold text-sm
                                 px-8 py-3 transition-colors">
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
    <section className="bg-[#F8F8F8] py-16">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text left */}
          <div>
            <span className="text-[11px] font-bold tracking-[3px] text-[#FF6E31] uppercase block mb-3">Our Story</span>
            <h2 className="text-[28px] font-bold tracking-tight text-[#111111] mb-5 leading-snug">
              Kaizen Art & Craft
            </h2>
            <p className="text-[15px] text-[#555555] leading-[1.9] mb-4">
              Kaizen Art & Craft is a celebration of India's rich handcraft heritage. We bring you
              authentic, hand-made pieces — from Rajasthan's vibrant Mandala wall art and Jaipur's
              iconic Blue Pottery, to Punjab's Phulkari embroidery and Bengal's Kantha stitch throws.
            </p>
            <p className="text-[15px] text-[#555555] leading-[1.9] mb-6">
              Every piece is crafted by skilled artisans using traditional techniques passed down through
              generations. When you buy from Kaizen, you're supporting a living art form.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#EEEEEE]">
              {[
                { value: "100%", label: "Handmade" },
                { value: "3",    label: "Craft Categories" },
                { value: "12+",  label: "Unique Products" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-[#FF6E31]">{value}</div>
                  <div className="text-xs text-[#555555] font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-block mt-8 border border-[#111111] text-[#111111] font-bold
                         text-sm px-8 py-3 hover:bg-[#111111] hover:text-white transition-colors"
            >
              Our Story →
            </Link>
          </div>

          {/* Image right */}
          <div className="overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <img
              src="https://images.unsplash.com/photo-1582585758449-75c99c5c4e2c?w=800&q=80"
              alt="Artisan crafting wall art"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  return (
    <div className="bg-white min-h-screen">
      <HeroBanner />
      <FeaturesSection />
      <CollectionsGrid />
      <NewArrivals />
      <FlashSale />
      <AboutStrip />
    </div>
  );
}
