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
    <section className="py-14 bg-[#f8f1eb]/30 border-b border-[#dedede]">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold tracking-[2px] text-[#ec7744] uppercase block mb-1.5">
              Just In
            </span>
            <h2 className="text-[26px] md:text-[30px] font-bold tracking-tight text-[#121212]">
              New Arrivals
            </h2>
            <p className="text-[#7d7d7d] text-sm mt-1">Fresh handcrafted pieces freshly added</p>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline-flex items-center gap-1 text-[13px] font-bold text-[#ec7744] hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white p-3 rounded-[4px] border border-[#dedede]">
                <div className="aspect-square bg-[#f7f7f7] rounded-[2px] mb-3" />
                <div className="h-3 bg-[#f7f7f7] rounded w-1/2 mb-2" />
                <div className="h-4 bg-[#f7f7f7] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#f7f7f7] rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#dedede] rounded-[4px]">
            <p className="text-[#7d7d7d]">No products available yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#ec7744] hover:bg-[#f09269] active:bg-[#8e4729] text-white font-bold text-sm px-10 py-3 rounded-[4px] shadow-sm transition-all"
          >
            Explore All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
