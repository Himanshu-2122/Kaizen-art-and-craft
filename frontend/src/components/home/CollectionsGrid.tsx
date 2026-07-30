import { Link } from "react-router-dom";

const categories = [
  {
    name: "New Arrivals",
    href: "/shop",
    image: null,
    isNew: true,
  },
  {
    name: "Wall Art",
    href: "/shop?category=wall-art",
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Pottery",
    href: "/shop?category=pottery",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Textile Crafts",
    href: "/shop?category=textile-crafts",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "3 Daraz Racks",
    href: "/shop?category=3-daraz",
    image:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "6 Daraz Racks",
    href: "/shop?category=6-daraz",
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "All Collections",
    href: "/collections",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=80",
  },
];

export default function CollectionsGrid() {
  return (
    <section className="py-14 bg-white border-t border-[#EFEFEF]">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Heading */}
        <div className="flex items-end justify-between mb-9">
          <div>
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#FF6E31] mb-2">
              Curated Collections
            </span>

            <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-[#212121] leading-tight">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/collections"
            className="hidden md:inline-block text-[13px] font-semibold text-[#111111] border-b border-[#111111]/30 hover:border-[#FF6E31] hover:text-[#FF6E31] transition-colors duration-200 pb-0.5"
          >
            View All →
          </Link>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-x-2 md:gap-x-3 gap-y-8">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className="group flex flex-col items-center gap-3.5"
            >
              <div
                className="
                  relative
                  w-full
                  aspect-square
                  rounded-full
                  overflow-hidden
                  bg-[#F3F2F0]
                  ring-1 ring-black/5
                  shadow-[0_4px_14px_rgba(0,0,0,0.06)]
                  group-hover:ring-2
                  group-hover:ring-[#FF6E31]/50
                  group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)]
                  transition-all
                  duration-300
                  flex
                  items-center
                  justify-center
                "
              >
                {cat.isNew ? (
                  <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                    <div
                      className="w-[64%] aspect-square flex items-center justify-center"
                      style={{
                        background: "#FF6E31",
                        clipPath:
                          "polygon(50% 0%,54% 18%,65% 6%,61% 24%,74% 15%,66% 31%,82% 28%,70% 40%,88% 42%,73% 50%,88% 58%,70% 60%,82% 72%,66% 69%,74% 85%,61% 76%,65% 94%,54% 82%,50% 100%,46% 82%,35% 94%,39% 76%,26% 85%,34% 69%,18% 72%,30% 60%,12% 58%,27% 50%,12% 42%,30% 40%,18% 28%,34% 31%,26% 15%,39% 24%,35% 6%,46% 18%)",
                      }}
                    >
                      <span className="text-white font-black text-[14px]">
                        NEW
                      </span>
                    </div>
                  </div>
                ) : (
                  <img
                    src={cat.image!}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://picsum.photos/seed/home-decor/500/500";
                    }}
                  />
                )}
              </div>

              <p className="text-[13px] font-semibold text-[#333333] text-center leading-snug group-hover:text-[#FF6E31] transition-colors duration-200">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}