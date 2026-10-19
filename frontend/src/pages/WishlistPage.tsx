import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { Heart, Trash2 } from "lucide-react";

import { WishlistItem } from "@/types";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { refreshWishlist } = useWishlist();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/wishlist");
      const data = Array.isArray(res.data) ? res.data : [];
      setItems(data);
    } catch {
      toast.error("Failed to load wishlist");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      load();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  const remove = async (productId: string) => {
    try {
      await api.delete("/wishlist", { data: { productId } });
      toast.success("Removed from wishlist");
      await Promise.all([load(), refreshWishlist()]);
    } catch {
      toast.error("Could not remove item");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#f8f1eb]/50 border-b border-[#dedede] py-6 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#7d7d7d] mb-2">
            <Link to="/" className="hover:text-[#ec7744] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#121212] font-semibold">Wishlist</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[4px] bg-[#fbe4da] flex items-center justify-center text-[#ec7744]">
              <Heart size={20} className="fill-[#ec7744]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#121212]">My Wishlist</h1>
            {!loading && items.length > 0 && (
              <span className="bg-[#ec7744] text-white text-xs font-bold px-2.5 py-0.5 rounded-[4px]">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-[#dedede] rounded-[4px] p-4">
                <div className="aspect-square bg-[#f7f7f7] rounded-[4px] mb-3" />
                <div className="h-3 bg-[#f7f7f7] rounded w-1/2 mb-2" />
                <div className="h-4 bg-[#f7f7f7] rounded w-3/4 mb-4" />
                <div className="h-9 bg-[#f7f7f7] rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-[#f8f1eb]/30 border border-[#dedede] rounded-[4px] max-w-2xl mx-auto px-6">
            <div className="w-16 h-16 rounded-full bg-[#fbe4da] flex items-center justify-center mx-auto mb-4 text-[#ec7744]">
              <Heart size={32} />
            </div>
            <p className="text-xl font-bold text-[#121212] mb-2">Your wishlist is empty</p>
            <p className="text-sm text-[#7d7d7d] mb-6 max-w-sm mx-auto">
              Save your favorite furniture, artisan crafts, and decor pieces to review them anytime.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-[#ec7744] hover:bg-[#bd5f37] text-white font-medium px-8 py-3 rounded-[4px] text-sm transition-colors shadow-sm"
            >
              Explore Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => {
              const product = item.productId;
              if (!product) return null;
              return (
                <div key={item._id} className="relative group">
                  <ProductCard product={product} />
                  <button
                    onClick={() => remove(product._id)}
                    title="Remove from wishlist"
                    className="absolute top-3 left-3 bg-white/95 hover:bg-red-50 text-[#7d7d7d] hover:text-red-500
                               p-1.5 rounded-[4px] shadow-sm opacity-0 group-hover:opacity-100
                               transition-all border border-[#dedede] hover:border-red-200 z-20"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
