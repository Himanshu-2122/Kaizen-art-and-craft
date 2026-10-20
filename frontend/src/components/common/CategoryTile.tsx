import { cn, getImageUrl } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  imageUrl?: string;
  itemCount?: string;
  subtitle?: string;
}

export interface CategoryTileProps {
  category: CategoryItem;
  className?: string;
}

export function CategoryTile({ category, className }: CategoryTileProps) {
  const rawImg = category.imageUrl || category.image;
  const image = rawImg
    ? getImageUrl(rawImg)
    : `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80`;

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className={cn(
        "group relative flex flex-col bg-white border border-[#E0E0E0] rounded-[2px] overflow-hidden hover:border-[#DF6B3B] hover:shadow-sm transition-all duration-300",
        className
      )}
    >
      {/* 1:1 Square Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F5F5F5]">
        <img
          src={image}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
        />

        {/* Subtle Dark Gradient at bottom of image for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Text Overlay on image (Kaizen Livings hallmark) */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-sm sm:text-base font-bold leading-tight drop-shadow-xs group-hover:text-[#FBE4DA] transition-colors">
            {category.name}
          </h3>
          {category.subtitle ? (
            <p className="text-[11px] text-white/80 mt-0.5 line-clamp-1">
              {category.subtitle}
            </p>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 mt-0.5 group-hover:text-white transition-colors">
              Explore Range <ArrowRight size={11} />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default CategoryTile;