import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import api from "@/lib/api";
import { toast } from "sonner";

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

export default function ProductCard({ product }: { product: Product }) {
  const { addItem }         = useCart();
  const { user }            = useAuth();
  const { refreshWishlist } = useWishlist();

  const image = product.images?.length
    ? (product.images[0].startsWith("http") ? product.images[0] : getImageUrl(product.images[0]))
    : "https://placehold.co/400x400?text=No+Image";

  const discount = product.discountPercentage
    ?? (product.mrpPrice && product.mrpPrice > product.price
      ? Math.round(((product.mrpPrice - product.price) / product.mrpPrice) * 100)
      : 0);

  const avgRating = product.averageRating ?? 0;
  const reviewCount = product.numReviews ?? 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (product.stock === 0) { toast.error("Out of stock"); return; }
    addItem({ product_id: product._id, name: product.name, price: product.price, image });
    toast.success("Added to cart");
  }

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) { toast.error("Please login to add to wishlist"); return; }
    try {
      await api.post("/wishlist", { productId: product._id });
      await refreshWishlist();
      toast.success("Added to wishlist");
    } catch {
      toast.error("Could not update wishlist");
    }
  }

  return (
    <Link to={`/product/${product.slug}`} className="block group">
      <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">

        {/* Image container */}
        <div className="relative aspect-square bg-[#F8F8F8] overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Discount badge top-left */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-[#FF6E31] text-white text-[10px] font-bold px-2 py-0.5">
              {discount}% OFF
            </span>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-[#111111] text-white text-xs font-bold px-3 py-1">
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist button top-right — appears on hover */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 shadow opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FF6E31] group/wish"
            title="Add to wishlist"
          >
            <Heart size={16} className="text-[#FF6E31] group-hover/wish:text-white transition-colors" />
          </button>

          {/* Add to cart bar slides up from bottom on hover */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="absolute bottom-0 left-0 right-0 bg-[#111111] text-white text-[12px] font-bold
                       text-center py-2.5 translate-y-full group-hover:translate-y-0 transition-transform
                       duration-300 flex items-center justify-center gap-2
                       hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={14} />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>

        {/* Card info */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mb-1">
              {product.category.replace(/-/g, " ")}
            </p>
          )}

          {/* Name */}
          <h3 className="text-[13.5px] text-[#111111] font-medium line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={11}
                  className={s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-[#EEEEEE] fill-[#EEEEEE]"}
                />
              ))}
            </div>
            {reviewCount > 0 && (
              <span className="text-[11px] text-[#999999]">({reviewCount})</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold text-[#111111]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.mrpPrice && product.mrpPrice > product.price && (
              <span className="text-[12px] text-[#999999] line-through">
                ₹{product.mrpPrice.toLocaleString("en-IN")}
              </span>
            )}
            {discount > 0 && (
              <span className="text-[11px] text-[#FF6E31] font-bold">{discount}% off</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
