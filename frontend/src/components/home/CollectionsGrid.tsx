import { Link } from "react-router-dom";

const categories = [
  {
    name: "New Arrivals",
    href: "/shop",
    image: null,
    isNew: true,
  },
  {
    name: "Sofas",
    href: "/shop?category=sofa",
    // modern light-coloured 3-seater sofa — matches UL screenshot
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=85",
  },
  {
    name: "Coffee Tables",
    href: "/shop?category=coffee-table",
    // round dark-wood coffee table — matches UL screenshot
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=85",
  },
  {
    name: "TV Units",
    href: "/shop?category=tv-unit",
    // white/light TV console — matches UL screenshot
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=85",
  },
  {
    name: "Dining Sets",
    href: "/shop?category=dining-set",
    // dark dining table with chairs — matches UL screenshot
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=500&q=85",
  },
  {
    name: "Chest of Drawers",
    href: "/shop?category=chest-of-drawers",
    // light-oak chest with lamp on top — matches UL screenshot
    image: "https://images.unsplash.com/photo-1595514535215-9a0a0b5e0b34?w=500&q=85",
  },
  {
    name: "Study Tables",
    href: "/shop?category=study-table",
    // minimal white/wood study desk — matches UL screenshot
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=85",
  },
  {
    name: "Wall Temple",
    href: "/shop?category=wall-temple",
    // wooden pooja mandir / wall-mounted mandir
    image: "https://images.unsplash.com/photo-1609946860441-a51ffcf22208?w=500&q=85",
  },
];

export default function CollectionsGrid() {
  return (
    <section className="py-10 bg-white border-t border-[#E8E8E8]">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Heading — left-aligned exactly like UL */}
        <h2 className="text-[22px] font-bold text-[#212121] mb-8">Shop by Category</h2>

        {/* 8 circles — 4 per row on mobile, all 8 in one row on desktop */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-x-3 gap-y-7 md:gap-x-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className="group flex flex-col items-center gap-3"
            >
              {/* ── Circle ── */}
              <div className="w-full aspect-square">
                {cat.isNew ? (
                  /* Dark brown "NEW" badge — exactly like UL's Latest Arrivals tile */
                  <div className="w-full h-full rounded-full bg-[#3B1F0A] flex items-center justify-center">
                    <div
                      className="w-[62%] aspect-square flex items-center justify-center"
                      style={{
                        background: "rgba(255,255,255,0.93)",
                        clipPath:
                          "polygon(50% 0%,54% 18%,65% 6%,61% 24%,74% 15%,66% 31%,82% 28%,70% 40%,88% 42%,73% 50%,88% 58%,70% 60%,82% 72%,66% 69%,74% 85%,61% 76%,65% 94%,54% 82%,50% 100%,46% 82%,35% 94%,39% 76%,26% 85%,34% 69%,18% 72%,30% 60%,12% 58%,27% 50%,12% 42%,30% 40%,18% 28%,34% 31%,26% 15%,39% 24%,35% 6%,46% 18%)",
                      }}
                    >
                      <span className="font-black text-[#3B1F0A] text-[15px] tracking-tight">
                        NEW
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Light gray circle with floating product image — exactly like UL */
                  <div
                    className="w-full h-full rounded-full bg-[#F0EFED] flex items-center justify-center
                                group-hover:bg-[#E6E5E3] transition-colors duration-300"
                  >
                    <img
                      src={cat.image!}
                      alt={cat.name}
                      loading="lazy"
                      className="w-[80%] h-[80%] object-contain
                                 group-hover:scale-[1.08] transition-transform duration-300"
                    />
                  </div>
                )}
              </div>

              {/* ── Category name — dark text, centered, same weight as UL ── */}
              <p className="text-[13px] font-medium text-[#333333] text-center leading-snug">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
