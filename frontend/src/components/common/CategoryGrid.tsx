import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { CategoryTile } from "@/components/common/CategoryTile";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

interface CategoryGridProps {
  categories: Category[];
  className?: string;
}

function CategoryGrid({ categories, className }: CategoryGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
      className
    )}>
      {categories.map((category) => (
        <CategoryTile key={category._id} category={category} />
      ))}
    </div>
  );
}

export { CategoryGrid };