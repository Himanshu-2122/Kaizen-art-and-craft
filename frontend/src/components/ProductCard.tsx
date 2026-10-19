import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn, getImageUrl } from "@/lib/utils";
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
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product._id);

  const image = product.images?.length
    ? (product.images[0].startsWith("http") ? product.images[0] : getImageUrl(product.images[0]))
    : "https://placehold.co/400x400?text=No+Image";

  const discount = product.discountPercentage
    ?? (product.mrpPrice && product.mrpPrice > product.price
      ? Math.round(((product.mrpPrice - product.price) / product.mrpPrice) * 100)
      : 0);

  const avgRating = product.averageRating ?? 0;
  const reviewCount = product.numReviews ?? 0;
  const lowStock = typeof product.stock === "number" && product.stock > 0 && product.stock <= 5;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) { toast.error("Out of stock"); return; }
    addItem({ product_id: product._id, name: product.name, price: product.price, image });
    toast.success("Added to cart");
  }

  async function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product._id);
  }

return (
    <div
      className={cn(
        "group relative bg-white border border-[#dedede] rounded-[4px] overflow-hidden flex flex-col h-full",
        "hover:border-[#ec7744] hover:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)]",
        "transition-all duration-200"
      )}
    >
      {/* 1:1 Aspect Ratio Image Container */}
      <div className="relative aspect-square w-full bg-[#f7f7f7] overflow-hidden">
        <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Top-left badge: reference .S9E3r green badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="bg-[#0fb67e] text-white text-[11px] font-bold px-2 py-0.5 rounded-[4px] shadow-sm tracking-wide">
              {discount}% OFF
            </span>
          )}
          {lowStock && product.stock !== 0 && (
            <span className="bg-[#ec7744] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="text-[#121212] font-bold text-xs bg-[#f1f1f1] px-3 py-1.5 rounded-[4px] border border-[#dedede]">
              Out of Stock
            </span>
          </div>
        )}

        {/* Floating Wishlist Button: reference .iwbaN */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 w-8 h-8 rounded-[4px] bg-white border border-black/10 shadow-sm flex items-center justify-center text-[#121212] hover:border-[#ec7744] hover:text-[#ec7744] transition-all z-10"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          <Heart
            size={16}
            className={isWishlisted ? "fill-[#ec7744] text-[#ec7744]" : "text-[#7d7d7d] hover:text-[#ec7744]"}
          />
        </button>
      </div>

      {/* Card Info Section: reference .NOy5c */}
      <div className="p-3.5 flex flex-col flex-grow justify-between text-left">
        <div>
          {/* Category */}
          {product.category && (
            <p className="text-[11px] font-medium text-[#7d7d7d] uppercase tracking-wider mb-1 truncate">
              {product.category.replace(/-/g, " ")}
            </p>
          )}

          {/* Name */}
          <Link to={`/product/${product.slug || product._id}`} className="block">
            <h3 className="text-[13px] md:text-[14px] font-semibold text-[#121212] line-clamp-2 leading-tight mb-2 hover:text-[#ec7744] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={12}
                  className={s <= Math.round(avgRating) ? "fill-[#ec7744] text-[#ec7744]" : "fill-gray-200 text-gray-200"}
                />
              ))}
            </div>
            {reviewCount > 0 ? (
              <span className="text-[11px] text-[#7d7d7d]">({reviewCount})</span>
            ) : (
              <span className="text-[11px] text-[#999999]">No reviews</span>
            )}
          </div>
        </div>

        <div>
          {/* Pricing Row: reference .iQye5 */}
          <div className="flex items-baseline gap-2 pt-2 border-t border-[#f1f1f1]">
            <span className="text-[16px] font-bold text-[#121212]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.mrpPrice && product.mrpPrice > product.price && (
              <span className="text-[13px] text-[#7d7d7d] line-through font-normal">
                ₹{product.mrpPrice.toLocaleString("en-IN")}
              </span>
            )}
            {discount > 0 && (
              <span className="ml-auto text-[11px] font-bold text-[#0fb67e]">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Add to Cart button: reference .tc9QL */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={cn(
              "w-full mt-3 py-2 px-3 text-center text-[13px] font-bold rounded-[4px] transition-all flex items-center justify-center gap-1.5",
              product.stock === 0
                ? "bg-[#f1f1f1] text-[#7d7d7d] border border-[#dedede] cursor-not-allowed opacity-60"
                : "border border-[#ec7744] text-[#ec7744] bg-white hover:bg-[#ec7744] hover:text-white active:scale-[0.98]"
            )}
          >
            <ShoppingCart size={14} />
            <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}