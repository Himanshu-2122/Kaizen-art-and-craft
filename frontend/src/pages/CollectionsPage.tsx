import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Collection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

const FALLBACK_IMAGES: Record<string, string> = {
  "wall-art":       "https://images.unsplash.com/photo-1582585758449-75c99c5c4e2c?w=800&q=80",
  "pottery":        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
  "textile-crafts": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
};

export default function CollectionsPage() {
  const { slug } = useParams();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadProducts(slug);
    } else {
      loadCollections();
    }
  }, [slug]);

  async function loadCollections() {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      const raw = res.data;
      const list = Array.isArray(raw) ? raw
        : Array.isArray(raw?.categories) ? raw.categories
        : Array.isArray(raw?.collections) ? raw.collections
        : [];
      setCollections(list);
    } catch {
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts(categorySlug: string) {
    setLoading(true);
    try {
      const res = await api.get("/products", { params: { category: categorySlug } });
      const data = res.data;
      const list = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
      setProducts(list);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  const imageBase = import.meta.env.VITE_API_URL?.replace("/api/v1", "") ?? "http://localhost:5000";

  /* ── COLLECTION LIST ── */
  if (!slug) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white border-b border-[#E8E8E8] py-5 px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-2 text-xs text-[#666666] mb-2">
              <Link to="/" className="hover:text-[#FF6E31]">Home</Link>
              <span>/</span>
              <span className="text-[#212121] font-medium">Collections</span>
            </div>
            <h1 className="text-2xl font-bold text-[#212121]">Our Collections</h1>
            <p className="text-sm text-[#666666] mt-1">Handcrafted art across three beautiful categories</p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[#F5F5F5]" />
                  <div className="p-5 bg-white border border-[#E8E8E8]">
                    <div className="h-5 bg-[#F5F5F5] rounded w-1/2 mb-2" />
                    <div className="h-4 bg-[#F5F5F5] rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🎨</p>
              <p className="text-[#666666]">No collections yet. Check back soon!</p>
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
                    className="group border border-[#E8E8E8] overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white"
                  >
                    <div className="aspect-[4/3] bg-[#F5F5F5] overflow-hidden relative">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={col.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-8xl">🎨</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h2 className="font-bold text-lg text-[#212121] group-hover:text-[#FF6E31] transition-colors">
                        {col.name}
                      </h2>
                      {col.description && (
                        <p className="text-sm text-[#666666] mt-1 line-clamp-2">{col.description}</p>
                      )}
                      <span className="inline-block mt-3 text-xs font-bold text-[#FF6E31] uppercase tracking-wider">
                        EXPLORE →
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
      <div className="bg-white border-b border-[#E8E8E8] py-5 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#666666] mb-2">
            <Link to="/" className="hover:text-[#FF6E31]">Home</Link>
            <span>/</span>
            <Link to="/collections" className="hover:text-[#FF6E31]">Collections</Link>
            <span>/</span>
            <span className="text-[#212121] font-medium capitalize">{collectionName}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/collections" className="text-[#FF6E31] hover:text-[#E55F20] transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-[#212121] capitalize">{collectionName}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[#F5F5F5] mb-3" />
                <div className="h-3 bg-[#F5F5F5] rounded w-1/2 mb-2" />
                <div className="h-4 bg-[#F5F5F5] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🎨</p>
            <p className="text-lg font-bold text-[#212121] mb-2">No products in this collection yet</p>
            <Link
              to="/shop"
              className="inline-block bg-[#FF6E31] text-white font-bold px-6 py-2.5
                         text-sm hover:bg-[#E55F20] transition-colors mt-4"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
