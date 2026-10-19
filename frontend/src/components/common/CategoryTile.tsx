import { cn, getImageUrl } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  imageUrl?: string;
}

interface CategoryTileProps {
  category: Category;
  className?: string;
}

function CategoryTile({ category, className }: CategoryTileProps) {
  const rawImg = category.imageUrl || category.image;
  const image = rawImg
    ? getImageUrl(rawImg)
    : `https://picsum.photos/seed/${category.slug}/400/400`;

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className={cn(
        "group flex flex-col items-center p-3 bg-white border border-[#dedede] rounded-[4px] hover:border-[#ec7744] hover:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] transition-all text-center",
        className
      )}
    >
      <div className="w-full aspect-[4/3] rounded-[2px] overflow-hidden bg-[#f7f7f7] mb-2.5">
        <img
          src={image}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <span className="text-[13.5px] font-semibold text-[#121212] group-hover:text-[#ec7744] transition-colors line-clamp-1">
        {category.name}
      </span>
    </Link>
  );
}

export { CategoryTile };