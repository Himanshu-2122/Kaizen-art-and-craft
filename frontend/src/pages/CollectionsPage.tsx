import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

import { Product } from "@/types";

interface Collection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

const FALLBACK_IMAGES: Record<string, string> = {
  "3-daraz":        "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&q=80",
  "6-daraz":        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80",
  "living-room":    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  "dining":         "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
  "bedroom":        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
  "wall-art":       "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80",
  "pottery":        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
  "textile-crafts": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
};

export default function CollectionsPage() {
  const { slug } = useParams();
  const { data: dbCategories = [], isLoading: categoriesLoading } = useCategories();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const collections = dbCategories.filter((c) => c.isActive !== false);
  const loading = slug ? productsLoading : categoriesLoading;

  useEffect(() => {
    if (slug) {
      loadProducts(slug);
    }
  }, [slug]);

  async function loadProducts(categorySlug: string) {
    setProductsLoading(true);
    try {
      const res = await api.get("/products", { params: { category: categorySlug } });
      const data = res.data;
      const list = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
      setProducts(list);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }

  const imageBase = import.meta.env.VITE_API_URL?.replace("/api/v1", "") ?? "http://localhost:5000";

  /* ── COLLECTION LIST ── */
  if (!slug) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white border-b border-[#dedede] py-6 px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-2 text-xs text-[#7d7d7d] mb-2.5">
              <Link to="/" className="hover:text-[#ec7744] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#121212] font-semibold">Collections</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#121212]">Our Collections</h1>
            <p className="text-sm text-[#7d7d7d] mt-1">Handcrafted Indian art across traditional artisan categories</p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white border border-[#dedede] rounded-[4px] p-3">
                  <div className="aspect-[4/3] bg-[#f7f7f7] rounded-[2px]" />
                  <div className="p-4">
                    <div className="h-5 bg-[#f7f7f7] rounded w-1/2 mb-2" />
                    <div className="h-4 bg-[#f7f7f7] rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#dedede] rounded-[4px]">
              <p className="text-4xl mb-3">🎨</p>
              <p className="text-[#7d7d7d]">No collections yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.map((col) => {
                const imgSrc = col.imageUrl
                  ? (col.imageUrl.startsWith("http") ? col.imageUrl : `${imageBase}${col.imageUrl}`)
                  : FALLBACK_IMAGES[col.slug];

                return (
                  <Link
                    key={col._id}
                    to={`/collections/${col.slug}`}
                    className="group border border-[#dedede] rounded-[4px] overflow-hidden hover:border-[#ec7744] hover:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)] transition-all bg-white flex flex-col"
                  >
                    <div className="aspect-[4/3] bg-[#f7f7f7] overflow-hidden relative">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={col.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-7xl">🎨</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div>
                        <h2 className="font-bold text-lg text-[#121212] group-hover:text-[#ec7744] transition-colors">
                          {col.name}
                        </h2>
                        {col.description && (
                          <p className="text-xs text-[#7d7d7d] mt-1 line-clamp-2 leading-relaxed">{col.description}</p>
                        )}
                      </div>
                      <span className="inline-block mt-4 text-xs font-bold text-[#ec7744] uppercase tracking-wider group-hover:underline">
                        EXPLORE COLLECTION →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── CATEGORY PRODUCTS ── */
  const collectionName = collections.find((c) => c.slug === slug)?.name
    ?? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-[#dedede] py-6 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#7d7d7d] mb-2.5">
            <Link to="/" className="hover:text-[#ec7744] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/collections" className="hover:text-[#ec7744] transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-[#121212] font-semibold capitalize">{collectionName}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/collections" className="text-[#ec7744] hover:text-[#f09269] transition-colors" aria-label="Back to collections">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#121212] capitalize">{collectionName}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white p-3 rounded-[4px] border border-[#dedede]">
                <div className="aspect-square bg-[#f7f7f7] rounded-[2px] mb-3" />
                <div className="h-3 bg-[#f7f7f7] rounded w-1/2 mb-2" />
                <div className="h-4 bg-[#f7f7f7] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#dedede] rounded-[4px]">
            <p className="text-4xl mb-3">🎨</p>
            <p className="text-lg font-bold text-[#121212] mb-1">No products in this collection yet</p>
            <Link
              to="/shop"
              className="inline-block bg-[#ec7744] hover:bg-[#f09269] text-white font-bold px-7 py-2.5
                         text-xs uppercase tracking-wider rounded-[4px] shadow-sm transition-colors mt-4"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
