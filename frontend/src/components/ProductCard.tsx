import { Link } from "react-router-dom";

export default function ProductCard({ product }: any) {
  return (
    <Link to={`/product/${product.slug}`}>
      <div className="border rounded-lg p-4 hover:shadow-md transition bg-white">

        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="w-full h-48 object-cover rounded"
        />

        <h3 className="mt-3 font-semibold text-sm">
          {product.name}
        </h3>

        <p className="text-accent font-bold mt-1">
          ₹{product.price}
        </p>

      </div>
    </Link>
  );
}
