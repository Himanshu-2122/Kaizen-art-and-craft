import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn, getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

export interface ProductCardProps {
  product: {
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
    materialType?: string;
    finishType?: string;
    storageType?: string;
  };
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = isInWishlist(product._id);

  // Kaizen Livings Dual-Image Hover Effect
  const primaryImage = product.images?.length
    ? product.images[0].startsWith("http")
      ? product.images[0]
      : getImageUrl(product.images[0])
    : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80";

  const secondaryImage =
    product.images && product.images.length > 1
      ? product.images[1].startsWith("http")
        ? product.images[1]
        : getImageUrl(product.images[1])
      : null;

  const discount =
    product.discountPercentage ??
    (product.mrpPrice && product.mrpPrice > product.price
      ? Math.round(((product.mrpPrice - product.price) / product.mrpPrice) * 100)
      : 0);

  const avgRating = product.averageRating ?? 4.5;
  const reviewCount = product.numReviews ?? 18;
  const inStock = product.stock === undefined || product.stock > 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) {
      toast.error("Item currently out of stock");
      return;
    }
    addItem({
      product_id: product._id,
      name: product.name,
      price: product.price,
      image: primaryImage,
    });
    setIsAdded(true);
    toast.success(`Added "${product.name}" to cart`);
    setTimeout(() => setIsAdded(false), 1500);
  }

  async function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product._id);
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative bg-white border border-[#E0E0E0] rounded-[2px] overflow-hidden flex flex-col h-full",
        "hover:border-[#DF6B3B] hover:shadow-sm transition-all duration-200",
        className
      )}
    >
      {/* ── Image Container (Aspect 1:1) with dual-image hover ── */}
      <div className="relative aspect-square w-full bg-[#F5F5F5] overflow-hidden">
        <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-103"
            loading="lazy"
          />
        </Link>

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-[#0FB67E] text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px] shadow-xs tracking-wider uppercase">
            {discount}% OFF
          </span>
        )}

        {/* Out of Stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="text-[#323232] font-bold text-xs bg-[#F5F5F5] px-3 py-1.5 rounded-[2px] border border-[#E0E0E0]">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          className={cn(
            "absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 border border-[#E0E0E0] shadow-xs flex items-center justify-center transition-all z-10 cursor-pointer",
            isWishlisted
              ? "text-[#DF6B3B] border-[#DF6B3B]"
              : "text-[#666666] hover:text-[#DF6B3B] hover:border-[#DF6B3B]"
          )}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist button"
        >
          <Heart
            size={16}
            className={isWishlisted ? "fill-[#DF6B3B] text-[#DF6B3B]" : "stroke-[2]"}
          />
        </button>

        {/* Quick Add Button overlay on hover (desktop) */}
        <div className="absolute bottom-2 left-2 right-2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={cn(
              "w-full py-2 px-3 text-center text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer",
              isAdded
                ? "bg-[#0FB67E] text-white"
                : inStock
                ? "bg-[#DF6B3B] hover:bg-[#C85A2E] text-white active:scale-[0.98]"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            )}
          >
            {isAdded ? (
              <>
                <Check size={14} /> Added
              </>
            ) : inStock ? (
              <>
                <ShoppingCart size={14} /> Quick Add
              </>
            ) : (
              "Out of Stock"
            )}
          </button>
        </div>
      </div>

      {/* ── Product Info Section ── */}
      <div className="p-3.5 flex flex-col flex-grow justify-between text-left">
        <div>
          {/* Category */}
          {product.category && (
            <p className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider mb-1 truncate">
              {product.category.replace(/-/g, " ")}
            </p>
          )}

          {/* Product Name */}
          <Link to={`/product/${product.slug || product._id}`} className="block">
            <h3 className="text-[13px] sm:text-[14px] font-semibold text-[#323232] line-clamp-2 leading-tight mb-2 group-hover:text-[#DF6B3B] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating Stars */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={12}
                  className={
                    s <= Math.round(avgRating)
                      ? "fill-[#DF6B3B] text-[#DF6B3B]"
                      : "fill-[#E0E0E0] text-[#E0E0E0]"
                  }
                />
              ))}
            </div>
            <span className="text-[11px] text-[#666666] font-medium">
              {avgRating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        </div>

        <div>
          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 pt-2 border-t border-[#E0E0E0]">
            <span className="text-[15px] sm:text-[16px] font-bold text-[#323232]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.mrpPrice && product.mrpPrice > product.price && (
              <span className="text-xs text-[#6B6B6B] line-through font-normal">
                ₹{product.mrpPrice.toLocaleString("en-IN")}
              </span>
            )}
            {discount > 0 && (
              <span className="ml-auto text-[11px] font-bold text-[#0FB67E]">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Mobile Add to Cart button */}
          <div className="mt-2.5 md:hidden">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={cn(
                "w-full py-2 px-3 text-center text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all flex items-center justify-center gap-1.5",
                isAdded
                  ? "bg-[#0FB67E] text-white"
                  : inStock
                  ? "border border-[#DF6B3B] text-[#DF6B3B] hover:bg-[#DF6B3B] hover:text-white"
                  : "bg-gray-100 text-gray-400 border border-gray-200"
              )}
            >
              <ShoppingCart size={13} />
              <span>{isAdded ? "Added" : inStock ? "Add to Cart" : "Out of Stock"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}