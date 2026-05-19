import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  mrpPrice?: number;
  discountPercentage?: number;
  images: string[];
  category?: string;
  stock?: number;
  averageRating?: number;
  numReviews?: number;
}

export default function NewArrivals() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products", "new-arrivals"],
    queryFn: async () => {
      const r = await api.get("/products", { params: { limit: 8 } });
      const raw = r.data;
      if (Array.isArray(raw)) return raw;
      if (Array.isArray(raw?.products)) return raw.products;
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section className="py-16 bg-white border-t border-[#EEEEEE]">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[11px] font-bold tracking-[3px] text-[#FF6E31] uppercase block mb-2">Just In</span>
            <h2 className="text-[26px] font-bold tracking-tight text-[#111111]">New Arrivals</h2>
            <p className="text-[#555555] text-sm mt-1">Fresh handcrafted pieces just added</p>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline-flex items-center gap-1 text-sm font-medium
                       text-[#FF6E31] hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[#F0F0F0] mb-3" />
                <div className="h-3 bg-[#F0F0F0] rounded w-1/2 mb-2" />
                <div className="h-4 bg-[#F0F0F0] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#F0F0F0] rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#555555]">No products available yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#111111] text-white
                       font-bold text-sm px-10 py-3.5 hover:bg-[#333333]
                       transition-colors"
          >
            Explore All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
