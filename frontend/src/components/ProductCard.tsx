import { Link } from "react-router-dom";

export default function ProductCard({ product }: any) {

  const image =
    product.images?.length > 0
      ? `${import.meta.env.VITE_API_URL}${product.images[0]}`
      : "https://via.placeholder.com/400x400?text=No+Image";

  return (
    <Link to={`/product/${product.slug}`}>

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">

        {/* ================= IMAGE ================= */}
        <div className="aspect-square bg-gray-100">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* ================= DETAILS ================= */}
        <div className="p-3 space-y-1">

          <h3 className="font-medium line-clamp-2">
            {product.name}
          </h3>

          <p className="text-accent font-semibold">
            ₹{product.price}
          </p>

        </div>

      </div>

    </Link>
  );
}