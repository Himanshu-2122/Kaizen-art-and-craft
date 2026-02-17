import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

export default function ProductCard({ product }: any) {

  const image =
    product.images?.length > 0
      ? getImageUrl(product.images[0])
      : "https://via.placeholder.com/400x400?text=No+Image";

  const discountPercent = product.discountPercentage
    || (product.mrpPrice && product.mrpPrice > product.price
      ? Math.round(((product.mrpPrice - product.price) / product.mrpPrice) * 100)
      : 0);

  return (
    <Link to={`/product/${product.slug}`}>

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group">

        {/* ================= IMAGE ================= */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
              {discountPercent}% OFF
            </div>
          )}
          {product.bestSeller && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
              Best Seller
            </div>
          )}
        </div>

        {/* ================= DETAILS ================= */}
        <div className="p-3 space-y-1.5">

          <h3 className="font-medium line-clamp-2 text-gray-900">
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600 font-medium">
                {product.averageRating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-baseline gap-2">
            <p className="text-accent font-semibold">
              ₹{product.price?.toLocaleString("en-IN")}
            </p>
            {product.mrpPrice && product.mrpPrice > product.price && (
              <p className="text-xs text-gray-400 line-through">
                ₹{product.mrpPrice.toLocaleString("en-IN")}
              </p>
            )}
          </div>

        </div>

      </div>

    </Link>
  );
}
