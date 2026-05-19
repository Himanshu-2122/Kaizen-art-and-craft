import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { Heart, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { refreshWishlist } = useWishlist();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

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
    if (user) load();
  }, [user]);

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
      <div className="bg-white border-b border-[#E8E8E8] py-5 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#666666] mb-2">
            <Link to="/" className="hover:text-[#FF6E31]">Home</Link>
            <span>/</span>
            <span className="text-[#212121] font-medium">Wishlist</span>
          </div>
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-[#FF6E31]" />
            <h1 className="text-2xl font-bold text-[#212121]">My Wishlist</h1>
            {!loading && items.length > 0 && (
              <span className="bg-[#FF6E31] text-white text-xs font-bold px-2.5 py-1">
                {items.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[#F5F5F5] mb-3" />
                <div className="h-3 bg-[#F5F5F5] rounded w-1/2 mb-2" />
                <div className="h-4 bg-[#F5F5F5] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={48} className="mx-auto text-[#E8E8E8] mb-4" />
            <p className="text-lg font-bold text-[#212121] mb-2">Your wishlist is empty</p>
            <p className="text-sm text-[#666666] mb-6">Save items you love and come back to them later</p>
            <Link
              to="/shop"
              className="inline-block bg-[#FF6E31] text-white font-bold px-6 py-2.5
                         text-sm hover:bg-[#E55F20] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => {
              const product = item.productId;
              if (!product) return null;
              return (
                <div key={item._id} className="relative group">
                  <ProductCard product={product} />
                  <button
                    onClick={() => remove(product._id)}
                    title="Remove from wishlist"
                    className="absolute top-2 right-2 bg-white hover:bg-red-50 text-red-500
                               p-1.5 shadow opacity-0 group-hover:opacity-100
                               transition-opacity border border-red-100"
                  >
                    <Trash2 size={14} />
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
