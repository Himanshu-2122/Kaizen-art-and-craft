import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Minus, Plus, Heart, ShoppingCart, Star,
  Truck, Shield, Package, ArrowLeft, MapPin,
  Ruler, Weight, Calendar, Layers, PaintBucket,
  Box, CheckCircle2, XCircle, Loader2
} from "lucide-react";
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
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState<"specs" | "dimensions" | "reviews">("specs");

  const [pinCode, setPinCode] = useState("");
  const [pinCheckResult, setPinCheckResult] = useState<{ available: boolean; message: string } | null>(null);
  const [checkingPin, setCheckingPin] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/products/slug/${slug}`);
        setProduct(res.data);
        if (res.data.sizes?.length > 0) {
          setSelectedSize(res.data.sizes[0]);
        }
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
      try {
        const res = await api.get("/wishlist");
        const exists = res.data.some(
          (item: any) => item.productId._id === product._id
        );
        setIsWishlisted(exists);
      } catch {}
    };
    checkWishlist();
  }, [user, product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
        <Link to="/shop"><Button>Back to Shop</Button></Link>
      </div>
    );
  }

  const images = product.images?.length > 0
    ? product.images.map((img: string) => getImageUrl(img))
    : ["https://via.placeholder.com/600x600?text=No+Image"];

  const discountPercent = product.discountPercentage
    || (product.mrpPrice && product.mrpPrice > product.price
      ? Math.round(((product.mrpPrice - product.price) / product.mrpPrice) * 100)
      : 0);

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
        await api.delete("/wishlist", { data: { userId: user.id, productId: product._id } });
        toast.success("Removed from wishlist");
        setIsWishlisted(false);
      } else {
        await api.post("/wishlist", { userId: user.id, productId: product._id });
        toast.success("Added to wishlist ❤️");
        setIsWishlisted(true);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  /* ================= CHECK PIN CODE ================= */
  const handleCheckPin = async () => {
    if (!pinCode || pinCode.length < 5) {
      toast.error("Please enter a valid pin code");
      return;
    }
    setCheckingPin(true);
    try {
      const res = await api.post(`/products/${product._id}/check-availability`, { pinCode });
      setPinCheckResult(res.data);
    } catch {
      toast.error("Failed to check availability");
    } finally {
      setCheckingPin(false);
    }
  };

  /* ================= SUBMIT REVIEW ================= */
  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Please login to add a review");
      return;
    }
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      setProduct(res.data);
      setReviewRating(0);
      setReviewComment("");
      toast.success("Review added successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  /* ================= RENDER STARS ================= */
  const renderStars = (rating: number, size = "h-5 w-5") => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size} ${
            i <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">

        {/* Back Button */}
        <Link
          to="/shop"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        {/* =====================================================
           MAIN PRODUCT SECTION
        ===================================================== */}
        <div className="grid lg:grid-cols-2 gap-10 bg-white rounded-2xl shadow-sm p-6 lg:p-10">

          {/* ---- LEFT: IMAGE GALLERY ---- */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 group">
              <img
                src={images[imageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  {discountPercent}% OFF
                </div>
              )}
              {product.bestSeller && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  BEST SELLER
                </div>
              )}
            </div>

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
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ---- RIGHT: PRODUCT DETAILS ---- */}
          <div className="space-y-6">

            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                {renderStars(product.averageRating || 0)}
                <span className="text-sm text-gray-600 font-medium">
                  {(product.averageRating || 0).toFixed(1)} ({product.numReviews || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price?.toLocaleString("en-IN")}
                </span>
                {product.mrpPrice && product.mrpPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.mrpPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-lg text-green-600 font-semibold">
                      {discountPercent}% Off
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">Size:</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 hover:border-gray-400 text-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Type */}
            {product.storageType && (
              <div className="flex items-center gap-2 text-sm">
                <Box className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">Storage:</span>
                <span className="text-gray-600">{product.storageType}</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900">Quantity:</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <Button variant="ghost" size="icon" onClick={() => setQty(Math.max(1, qty - 1))} className="hover:bg-gray-100 rounded-l-lg">
                    <Minus size={18} />
                  </Button>
                  <span className="px-6 py-2 text-lg font-semibold min-w-[60px] text-center">{qty}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQty(qty + 1)} className="hover:bg-gray-100 rounded-r-lg">
                    <Plus size={18} />
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  Total: <span className="font-semibold text-gray-900">₹{(product.price * qty).toLocaleString("en-IN")}</span>
                </span>
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
                <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
              </Button>
            </div>

            {/* Pin Code Availability */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <MapPin className="h-4 w-4" />
                Check Delivery Availability
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => {
                    setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setPinCheckResult(null);
                  }}
                  placeholder="Enter PIN code"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  maxLength={6}
                />
                <Button
                  onClick={handleCheckPin}
                  disabled={checkingPin}
                  variant="outline"
                  className="px-6 font-semibold"
                >
                  {checkingPin ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
                </Button>
              </div>
              {pinCheckResult && (
                <div className={`flex items-center gap-2 text-sm font-medium ${
                  pinCheckResult.available ? "text-green-600" : "text-red-500"
                }`}>
                  {pinCheckResult.available
                    ? <CheckCircle2 className="h-4 w-4" />
                    : <XCircle className="h-4 w-4" />
                  }
                  {pinCheckResult.message}
                </div>
              )}
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl">
                <Truck className="h-7 w-7 text-green-600 mb-2" />
                <p className="text-xs font-semibold text-gray-900">Free Delivery</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl">
                <Shield className="h-7 w-7 text-blue-600 mb-2" />
                <p className="text-xs font-semibold text-gray-900">{product.warrantyMonths || 12} Month Warranty</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl">
                <Package className="h-7 w-7 text-orange-600 mb-2" />
                <p className="text-xs font-semibold text-gray-900">Safe Packaging</p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
           TABS: SPECIFICATIONS / DIMENSIONS / REVIEWS
        ===================================================== */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Tab Header */}
          <div className="flex border-b border-gray-200">
            {(["specs", "dimensions", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "specs" ? "Specifications" : tab === "dimensions" ? "Dimensions" : `Reviews (${product.numReviews || 0})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">

            {/* ----- SPECIFICATIONS TAB ----- */}
            {activeTab === "specs" && (
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                <SpecRow icon={<Layers className="h-5 w-5 text-gray-400" />} label="Material" value={product.materialType} />
                <SpecRow icon={<PaintBucket className="h-5 w-5 text-gray-400" />} label="Finish" value={product.finishType} />
                <SpecRow icon={<Box className="h-5 w-5 text-gray-400" />} label="Storage Type" value={product.storageType} />
                <SpecRow icon={<Weight className="h-5 w-5 text-gray-400" />} label="Net Weight" value={product.netWeight ? `${product.netWeight} kg` : undefined} />
                <SpecRow icon={<Calendar className="h-5 w-5 text-gray-400" />} label="Warranty" value={product.warrantyMonths ? `${product.warrantyMonths} months` : undefined} />
                <SpecRow icon={<Package className="h-5 w-5 text-gray-400" />} label="Category" value={product.category} />
              </div>
            )}

            {/* ----- DIMENSIONS TAB ----- */}
            {activeTab === "dimensions" && (
              <div className="max-w-md">
                <div className="flex items-center gap-2 mb-6">
                  <Ruler className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Product Dimensions</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-gray-500 font-medium">Dimension</th>
                      <th className="text-right py-3 text-gray-500 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-700">Length</td>
                      <td className="py-3 text-right font-semibold text-gray-900">{product.dimensions?.length || "—"} cm</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-700">Width</td>
                      <td className="py-3 text-right font-semibold text-gray-900">{product.dimensions?.width || "—"} cm</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-700">Height</td>
                      <td className="py-3 text-right font-semibold text-gray-900">{product.dimensions?.height || "—"} cm</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-700">Net Weight</td>
                      <td className="py-3 text-right font-semibold text-gray-900">{product.netWeight || "—"} kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* ----- REVIEWS TAB ----- */}
            {activeTab === "reviews" && (
              <div className="space-y-8">

                {/* Rating Summary */}
                <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900">
                      {(product.averageRating || 0).toFixed(1)}
                    </div>
                    <div className="mt-1">{renderStars(product.averageRating || 0)}</div>
                    <p className="text-sm text-gray-500 mt-1">{product.numReviews || 0} reviews</p>
                  </div>
                </div>

                {/* Add Review Form */}
                {user ? (
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Your Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onMouseEnter={() => setReviewHover(star)}
                            onMouseLeave={() => setReviewHover(0)}
                            onClick={() => setReviewRating(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= (reviewHover || reviewRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Your Review</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={4}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                      />
                    </div>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={submittingReview}
                      className="bg-gray-900 hover:bg-gray-800"
                    >
                      {submittingReview ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                      ) : (
                        "Submit Review"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <p className="text-gray-600">
                      <Link to="/auth" className="text-gray-900 font-semibold hover:underline">Log in</Link>
                      {" "}to write a review
                    </p>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review: any, idx: number) => (
                      <div key={review._id || idx} className="border border-gray-100 rounded-xl p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                              {review.userId?.fullName?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {review.userId?.fullName || "User"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString("en-IN", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric"
                                })}
                              </p>
                            </div>
                          </div>
                          {renderStars(review.rating, "h-4 w-4")}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 py-8">
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   SPEC ROW COMPONENT
====================================================== */
function SpecRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100">
      {icon}
      <span className="text-gray-500 text-sm min-w-[100px]">{label}</span>
      <span className="font-medium text-gray-900 text-sm capitalize">{value}</span>
    </div>
  );
}
