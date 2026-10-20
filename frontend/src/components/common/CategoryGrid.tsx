import { cn } from "@/lib/utils";
import { CategoryTile, CategoryItem } from "@/components/common/CategoryTile";

export interface CategoryGridProps {
  categories: CategoryItem[];
  className?: string;
}

export function CategoryGrid({ categories, className }: CategoryGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6",
        className
      )}
    >
      {categories.map((category) => (
        <CategoryTile key={category._id || category.slug} category={category} />
      ))}
    </div>
  );
}

export default CategoryGrid;