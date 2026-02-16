import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart, ShoppingCart, Star, ChevronLeft, Truck, Shield, Package, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  /* ================= LOAD PRODUCT ================= */

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/products/slug/${slug}`);
        setProduct(res.data);
      } catch {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  /* ================= CHECK WISHLIST ================= */

  useEffect(() => {
    if (!user || !product) return;

    const checkWishlist = async () => {
      const res = await api.get("/wishlist");

      const exists = res.data.some(
        (item: any) => item.productId._id === product._id
      );

      setIsWishlisted(exists);
    };

    checkWishlist();
  }, [user, product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : ["https://via.placeholder.com/600x600?text=No+Image"];

  /* ================= ADD TO CART ================= */

  const addToCart = () => {
    addItem({
      product_id: product._id,
      name: product.name,
      price: product.price,
      image: images[0],
      quantity: qty,
    });

    toast.success("Added to cart successfully!");
  };

  /* ================= TOGGLE WISHLIST ================= */

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      if (isWishlisted) {
        await api.delete("/wishlist", {
          data: {
            userId: user.id,
            productId: product._id,
          },
        });

        toast.success("Removed from wishlist");
        setIsWishlisted(false);
      } else {
        await api.post("/wishlist", {
          userId: user.id,
          productId: product._id,
        });

        toast.success("Added to wishlist ❤️");
        setIsWishlisted(true);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Calculate discount percentage if MRP is available
  const discountPercent = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  /* ================= UI ================= */

  return (<div className="min-h-screen bg-gray-100 py-0.5f  
  ">

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/shop" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm p-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 group">
              <img
                src={images[imageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      i === imageIndex
                        ? "border-gray-900 shadow-md scale-105"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-lg text-green-600 font-semibold">
                      {discountPercent}% Off
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div className="border-t border-b border-gray-200 py-4">
              <p className="text-gray-700 leading-relaxed">
                {product.description || "High quality product crafted with care and attention to detail."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900">
                Quantity:
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="hover:bg-gray-100 rounded-l-lg"
                  >
                    <Minus size={18} />
                  </Button>

                  <span className="px-6 py-2 text-lg font-semibold min-w-[60px] text-center">
                    {qty}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQty(qty + 1)}
                    className="hover:bg-gray-100 rounded-r-lg"
                  >
                    <Plus size={18} />
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  Total: <span className="font-semibold text-gray-900">₹{(product.price * qty).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={addToCart}
                size="lg"
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add To Cart
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={toggleWishlist}
                className={`h-14 px-6 border-2 transition-all ${
                  isWishlisted
                    ? "bg-red-50 text-red-500 border-red-500 hover:bg-red-100"
                    : "hover:bg-gray-50 border-gray-300"
                }`}
              >
                <Heart
                  className="h-5 w-5"
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Truck className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-xs font-semibold text-gray-900">Free Delivery</p>
                <p className="text-xs text-gray-600 mt-1">On all orders</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-xs font-semibold text-gray-900">Warranty</p>
                <p className="text-xs text-gray-600 mt-1">36 months</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Package className="h-8 w-8 text-orange-600 mb-2" />
                <p className="text-xs font-semibold text-gray-900">Safe Delivery</p>
                <p className="text-xs text-gray-600 mt-1">Secure packaging</p>
              </div>
            </div>

            {/* Product Specifications */}
            {product.specifications && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                  Product Specifications
                </h3>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="font-medium text-gray-900">{value as string}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}