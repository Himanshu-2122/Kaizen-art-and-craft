import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useMemo } from "react";
import { getImageUrl } from "@/lib/utils";

const FALLBACK_CATEGORIES = [
  {
    name: "New Arrivals",
    href: "/shop",
    image: null,
    isNew: true,
  },
  {
    name: "Sofas & Recliners",
    href: "/shop?category=sofas",
    image: "/images/categories/sofas.jpg",
  },
  {
    name: "Beds & Mattresses",
    href: "/shop?category=beds",
    image: "/images/categories/beds.jpg",
  },
  {
    name: "Dining Sets",
    href: "/shop?category=dining",
    image: "/images/categories/dining.jpg",
  },
  {
    name: "Coffee Tables",
    href: "/shop?category=coffee-tables",
    image: "/images/categories/coffee-tables.jpg",
  },
  {
    name: "TV Units & Media",
    href: "/shop?category=tv-units",
    image: "/images/categories/tv-units.jpg",
  },
  {
    name: "All Furniture",
    href: "/collections",
    image: "/images/categories/bookshelves.jpg",
  },
];


export default function CollectionsGrid() {
  const { data: dbCategories = [] } = useCategories();

  const categories = useMemo(() => {
    if (dbCategories && dbCategories.length > 0) {
      const active = dbCategories.filter((c) => c.isActive !== false);
      const items = active.slice(0, 6).map((c) => ({
        name: c.name,
        href: `/shop?category=${c.slug}`,
        image: c.imageUrl || c.image || "https://picsum.photos/seed/" + c.slug + "/400/400",
        isNew: false,
      }));
      return [
        { name: "New Arrivals", href: "/shop", image: null, isNew: true },
        ...items,
      ];
    }
    return FALLBACK_CATEGORIES;
  }, [dbCategories]);
  return (
    <section className="py-14 bg-white border-b border-[#dedede]">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Heading */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#ec7744] mb-2">
              Curated Collections
            </span>

            <h2 className="text-[26px] md:text-[30px] font-bold text-[#121212] leading-tight">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/collections"
            className="hidden md:inline-block text-[13px] font-semibold text-[#121212] border-b border-[#121212]/30 hover:border-[#ec7744] hover:text-[#ec7744] transition-colors pb-0.5"
          >
            View All →
          </Link>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className="group flex flex-col items-center gap-3 p-3 bg-white border border-[#dedede] rounded-[4px] hover:border-[#ec7744] hover:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] transition-all text-center"
            >
              <div
                className="
                  relative
                  w-full
                  aspect-square
                  rounded-[4px]
                  overflow-hidden
                  bg-[#f7f7f7]
                  flex
                  items-center
                  justify-center
                "
              >
                {cat.isNew ? (
                  <div className="w-full h-full bg-[#f8f1eb] flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-[12px] font-bold text-[#ec7744] uppercase tracking-wider">
                      ✨ NEW
                    </span>
                    <span className="text-[11px] text-[#7d7d7d] mt-1 font-medium">Arrivals</span>
                  </div>
                ) : (
                  <img
                    src={getImageUrl(cat.image || "")}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                )}
              </div>
              <span className="text-[13px] font-semibold text-[#121212] group-hover:text-[#ec7744] transition-colors line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}