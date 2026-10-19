import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  mrpPrice?: number;
  discountPercentage?: number;
  images?: string[];
  category?: string;
  stock?: number;
  averageRating?: number;
  numReviews?: number;
}

interface ProductGridProps {
  products: Product[];
  className?: string;
  margin?: "8" | "12";
}

function ProductGrid({ products, className, margin = "8" }: ProductGridProps) {
  const cols = margin === "8" ? ["2", "3", "4"] : ["2", "3"];

  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      className
    )}>
      {products.map((product) => (
        <div key={product._id} className="group">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

export { ProductGrid };