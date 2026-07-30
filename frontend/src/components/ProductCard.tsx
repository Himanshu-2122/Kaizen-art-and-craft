import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
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
    if (product.stock === 0) { toast.error("Out of stock"); return; }
    addItem({ product_id: product._id, name: product.name, price: product.price, image });
    toast.success("Added to cart");
  }

  async function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    await toggleWishlist(product._id);
  }

  return (
    <Link to={`/product/${product.slug}`} className="block group">
      <div
        className="relative bg-white rounded-xl overflow-hidden border border-[#EFEFEF]
                   shadow-[0_1px_3px_rgba(0,0,0,0.05)]
                   hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:border-[#FF6E31]/20
                   hover:-translate-y-1 transition-all duration-350 ease-out"
      >
        {/* Image container */}
        <div className="relative aspect-square bg-[#FAFAF8] overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-[600ms] ease-out"
            loading="lazy"
          />

          {/* Subtle bottom gradient for legibility / polish */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <span className="bg-[#FF6E31] text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-md shadow-sm">
                {discount}% OFF
              </span>
            )}
            {lowStock && product.stock !== 0 && (
              <span className="bg-[#111111] text-white text-[9.5px] font-semibold tracking-wide px-2.5 py-1 rounded-md">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="bg-[#111111] text-white text-xs font-bold px-4 py-1.5 rounded-md tracking-wide">
                Out of Stock
              </span>
            </div>
          )}

          {/* Floating action column (wishlist + quick view) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <button
              onClick={handleWishlistClick}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md backdrop-blur-md
                          transition-all duration-300
                          ${isWishlisted
                            ? "bg-[#FF6E31] text-white scale-100 opacity-100"
                            : "bg-white/95 text-[#111111] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#FF6E31] hover:text-white"}`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={15} className={isWishlisted ? "fill-white" : ""} />
            </button>

            <button
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/95 text-[#111111]
                         shadow-md backdrop-blur-md opacity-0 translate-y-1
                         group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-[60ms]
                         hover:bg-[#111111] hover:text-white"
              title="Quick view"
              onClick={(e) => e.preventDefault()}
            >
              <Eye size={15} />
            </button>
          </div>

          {/* Add to cart bar — slides up, brand orange to match site CTAs */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="absolute bottom-0 left-0 right-0 bg-[#FF6E31] text-white text-[12.5px] font-bold
                       text-center py-3 translate-y-full group-hover:translate-y-0 transition-transform
                       duration-300 ease-out flex items-center justify-center gap-2 z-10
                       hover:bg-[#E55F20] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={14} />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>

        {/* Card info */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <p className="text-[10px] text-[#FF6E31]/90 font-semibold uppercase tracking-wider mb-1.5">
              {product.category.replace(/-/g, " ")}
            </p>
          )}

          {/* Name */}
          <h3 className="font-serif text-[15px] text-[#111111] font-semibold line-clamp-2 leading-snug mb-2 group-hover:text-[#FF6E31] transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={12}
                  className={s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-[#E8E8E8] fill-[#E8E8E8]"}
                />
              ))}
            </div>
            {reviewCount > 0 ? (
              <span className="text-[11px] text-[#999999]">({reviewCount})</span>
            ) : (
              <span className="text-[11px] text-[#CCCCCC]">No reviews yet</span>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-[#F0F0F0] mb-2.5" />

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-[17px] font-bold text-[#111111]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.mrpPrice && product.mrpPrice > product.price && (
              <span className="text-[12px] text-[#AAAAAA] line-through">
                ₹{product.mrpPrice.toLocaleString("en-IN")}
              </span>
            )}
            {discount > 0 && (
              <span className="ml-auto text-[10.5px] text-[#FF6E31] font-bold bg-[#FF6E31]/10 px-1.5 py-0.5 rounded">
                Save {discount}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}