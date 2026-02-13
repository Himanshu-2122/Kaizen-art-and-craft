import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { slug } = useParams();

  const { addItem } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);

  /* ---------------- LOAD PRODUCT ---------------- */

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/products/slug/${slug}`);
        setProduct(res.data);
      } catch (error) {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!product) return <div className="p-10">Product not found</div>;

  const images =
    product.images?.length > 0
      ? product.images
      : ["https://via.placeholder.com/600x600?text=No+Image"];

  /* ---------------- ADD TO CART ---------------- */

  const addToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: images[0],
      quantity: qty,
    });

    toast.success("Added to cart");
  };

  /* =====================================================
      UI
  ===================================================== */

  return (
    <div className="container py-10">

      <Link to="/shop" className="text-accent text-sm mb-6 inline-block">
        ← Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12">

        {/* ================= IMAGES ================= */}
        <div>

          {/* Main image */}
          <div className="aspect-square rounded-xl overflow-hidden border bg-gray-50">
            <img
              src={images[imageIndex]}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4">
            {images.map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setImageIndex(i)}
                className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                  i === imageIndex ? "border-black" : "border-gray-200"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div className="space-y-6">

          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            4.5 (106 reviews)
          </div>

          {/* Price */}
          <div className="text-2xl font-bold text-accent">
            ₹{product.price}
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {product.description || "Premium handcrafted furniture piece."}
          </p>

          {/* Stock */}
          <p className="text-sm">
            {product.stock > 0
              ? `In Stock (${product.stock})`
              : "Out of Stock"}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQty(Math.max(1, qty - 1))}
            >
              <Minus size={14} />
            </Button>

            <span className="w-8 text-center">{qty}</span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setQty(qty + 1)}
            >
              <Plus size={14} />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-3">

            <Button
              onClick={addToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-black text-white"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add To Cart
            </Button>

            <Button variant="outline">
              <Heart />
            </Button>

          </div>
        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <div className="mt-20">

        <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>

        <div className="space-y-4">

          <Review name="Aman" text="Excellent quality. Loved it!" />
          <Review name="Riya" text="Very premium finish. Worth price." />

        </div>
      </div>
    </div>
  );
}

/* ---------------- Review Card ---------------- */

function Review({ name, text }: any) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-muted-foreground mt-1">{text}</p>
    </div>
  );
}
