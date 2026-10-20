import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { getImageUrl, cn } from "@/lib/utils";
import {
  Minus,
  Plus,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  Package,
  ArrowLeft,
  MapPin,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Tag,
  Clock,
  Sparkles,
  Info,
  Check,
  Share2,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import { Product, ProductReview } from "@/types";

type InfoTab = "description" | "specifications" | "warranty" | "delivery" | "reviews";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist: toggleWishlistContext } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<InfoTab>("description");
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Accordion toggle states for mobile / secondary view
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    specifications: true,
    warranty: false,
    delivery: false,
  });

  const [related, setRelated] = useState<Product[]>([]);
  const [relatedIsSameCategory, setRelatedIsSameCategory] = useState(false);

  // Delivery checker
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<{ available: boolean; message: string } | null>(null);
  const [checkingPin, setCheckingPin] = useState(false);

  // Reviews
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  /* ── Load Product by Slug ── */
  useEffect(() => {
    setRelated([]);
    setRelatedIsSameCategory(false);
    setImageIndex(0);
    setQty(1);
    setPincode("");
    setPincodeResult(null);
    setActiveTab("description");
    setLoading(true);

    (async () => {
      try {
        const res = await api.get(`/products/slug/${slug}`);
        setProduct(res.data);
        if (res.data.sizes?.length) {
          setSelectedSize(res.data.sizes[0]);
        }
      } catch {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  /* ── Load Related Products ── */
  useEffect(() => {
    if (!product) return;
    (async () => {
      try {
        const res = await api.get("/products", {
          params: { category: product.category, limit: 8 },
        });
        const list: Product[] = res.data?.products ?? res.data ?? [];
        const sameCategory = list.filter((p) => p._id !== product._id).slice(0, 4);

        if (sameCategory.length >= 2) {
          setRelated(sameCategory);
          setRelatedIsSameCategory(true);
          return;
        }

        const fallbackRes = await api.get("/products", { params: { limit: 8 } });
        const fallbackList: Product[] = fallbackRes.data?.products ?? fallbackRes.data ?? [];
        setRelated(fallbackList.filter((p) => p._id !== product._id).slice(0, 4));
        setRelatedIsSameCategory(false);
      } catch {
        /* silent */
      }
    })();
  }, [product]);

  const isWishlisted = product ? isInWishlist(product._id) : false;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-[#DF6B3B]/20 border-t-[#DF6B3B] rounded-full animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
            Loading furniture details…
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-white px-4">
        <div className="w-16 h-16 bg-[#FBE4DA] rounded-full flex items-center justify-center text-[#DF6B3B]">
          <Package size={32} />
        </div>
        <h2 className="text-xl font-bold text-[#323232]">Product Not Found</h2>
        <p className="text-xs text-[#666666]">
          The item you are looking for is either discontinued or out of catalog.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-[#DF6B3B] text-white font-bold text-xs uppercase tracking-wider rounded-[2px] hover:bg-[#C85A2E] transition-colors"
        >
          Explore All Furniture
        </Link>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"];

  const discountPercent =
    product.discountPercentage ??
    (product.mrpPrice && product.mrpPrice > product.price
      ? Math.round(((product.mrpPrice - product.price) / product.mrpPrice) * 100)
      : 0);

  const inStock = product.stock === undefined || product.stock > 0;
  const avgRating = product.averageRating || 4.5;
  const reviewCount = product.numReviews || 0;

  /* ── Add to cart ── */
  const handleAddToCart = () => {
    if (!inStock) {
      toast.error("This item is currently out of stock");
      return;
    }
    addItem({
      product_id: product._id,
      name: product.name,
      price: product.price,
      image: images[0].startsWith("http") ? images[0] : getImageUrl(images[0]),
      quantity: qty,
    });
    setIsAddedToCart(true);
    toast.success(`Added ${qty} × "${product.name}" to cart`);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  /* ── Wishlist toggle ── */
  const handleToggleWishlist = async () => {
    await toggleWishlistContext(product._id);
  };

  /* ── Pincode check ── */
  const handleCheckPin = async () => {
    if (!pincode.trim() || pincode.length < 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }
    setCheckingPin(true);
    try {
      const res = await api.post(`/products/${product._id}/check-availability`, {
        pinCode: pincode,
      });
      setPincodeResult(res.data);
    } catch {
      setPincodeResult({
        available: false,
        message: "Unable to verify pincode at this time",
      });
    } finally {
      setCheckingPin(false);
    }
  };

  /* ── Submit review ── */
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!reviewRating) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setProduct(res.data);
      setReviewRating(5);
      setReviewComment("");
      setActiveTab("reviews");
      toast.success("Review submitted successfully!");
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to submit review"
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans antialiased text-[#323232]">
      {/* ── Top Breadcrumbs Strip (Kaizen Livings 1:1) ── */}
      <div className="bg-[#FFFFFF] border-b border-[#E0E0E0] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <nav className="flex items-center gap-1.5 text-[11px] text-[#666666]">
            <Link to="/" className="hover:text-[#DF6B3B] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-[#999999]" />
            <Link to="/shop" className="hover:text-[#DF6B3B] transition-colors">
              Furniture
            </Link>
            {product.category && (
              <>
                <ChevronRight size={12} className="text-[#999999]" />
                <Link
                  to={`/shop?category=${product.category}`}
                  className="hover:text-[#DF6B3B] transition-colors capitalize"
                >
                  {product.category.replace(/-/g, " ")}
                </Link>
              </>
            )}
            <ChevronRight size={12} className="text-[#999999]" />
            <span className="text-[#323232] font-semibold truncate max-w-[280px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ── Main Product Section ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">

          {/* ════ LEFT COLUMN: Kaizen Livings Vertical Thumbnail Gallery (7 cols) ════ */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex flex-col-reverse sm:flex-row gap-4 items-start">

              {/* Vertical Thumbnail Strip (Desktop) */}
              {images.length > 1 && (
                <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:w-20 w-full sm:max-h-[520px] pr-1 no-scrollbar shrink-0">
                  {images.map((img: string, i: number) => {
                    const src = img.startsWith("http") ? img : getImageUrl(img);
                    const isActive = i === imageIndex;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImageIndex(i)}
                        className={cn(
                          "w-16 h-16 sm:w-20 sm:h-20 rounded-[2px] border overflow-hidden bg-[#F5F5F5] transition-all flex-shrink-0 cursor-pointer relative",
                          isActive
                            ? "border-[#DF6B3B] ring-1 ring-[#DF6B3B]"
                            : "border-[#E0E0E0] hover:border-[#DF6B3B]/60"
                        )}
                        aria-label={`View image thumbnail ${i + 1}`}
                      >
                        <img
                          src={src}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Main Enlarged Image */}
              <div className="flex-1 relative aspect-square w-full bg-white rounded-[2px] border border-[#E0E0E0] overflow-hidden group">
                <img
                  key={imageIndex}
                  src={
                    images[imageIndex].startsWith("http")
                      ? images[imageIndex]
                      : getImageUrl(images[imageIndex])
                  }
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />

                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-[#0FB67E] text-white text-[11px] font-bold px-2.5 py-1 rounded-[2px] shadow-xs tracking-wider uppercase">
                    {discountPercent}% OFF
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={cn(
                    "absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 border border-[#E0E0E0] shadow-xs flex items-center justify-center transition-all cursor-pointer z-10",
                    isWishlisted
                      ? "text-[#DF6B3B] border-[#DF6B3B]"
                      : "text-[#666666] hover:text-[#DF6B3B] hover:border-[#DF6B3B]"
                  )}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    size={18}
                    className={isWishlisted ? "fill-[#DF6B3B] text-[#DF6B3B]" : "stroke-[2]"}
                  />
                </button>

                {/* Carousel Chevrons if multi-image */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                      }
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-[#E0E0E0] shadow-xs flex items-center justify-center text-[#323232] hover:text-[#DF6B3B] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-[#E0E0E0] shadow-xs flex items-center justify-center text-[#323232] hover:text-[#DF6B3B] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Micro thumbnail counter */}
            {images.length > 1 && (
              <p className="text-[11px] text-[#666666] text-center sm:text-left sm:ml-24">
                Showing image {imageIndex + 1} of {images.length}
              </p>
            )}
          </div>

          {/* ════ RIGHT COLUMN: Product Details & Purchase Actions (5 cols) ════ */}
          <div className="lg:col-span-5 flex flex-col gap-4 text-left">

            {/* Brand / Category Tag */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#DF6B3B]">
                {product.category ? product.category.replace(/-/g, " ") : "Kaizen Livings Collection"}
              </span>
              <span className="text-[11px] text-[#999999] font-mono">
                SKU: {product.slug?.slice(0, 16) || product._id?.slice(0, 12)}
              </span>
            </div>

            {/* Product Title (H1 for SEO & testing) */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#323232] leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Ratings & Reviews bar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-[#F5F5F5] px-2 py-0.5 rounded-[2px] border border-[#E0E0E0]">
                <span className="text-xs font-bold text-[#323232]">{avgRating.toFixed(1)}</span>
                <Star size={11} className="fill-[#DF6B3B] text-[#DF6B3B]" />
              </div>
              <span className="text-xs text-[#666666]">
                {reviewCount} Verified Ratings & Reviews
              </span>
            </div>

            {/* Pricing Section (Kaizen Livings Style) */}
            <div className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-[2px] p-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-[#323232]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.mrpPrice && product.mrpPrice > product.price && (
                  <span className="text-base text-[#999999] line-through font-normal">
                    ₹{product.mrpPrice.toLocaleString("en-IN")}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-[#0FB67E] bg-[#E8F8F2] px-2 py-0.5 rounded-[2px]">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#666666] mt-1 font-medium">
                Inclusive of all taxes
              </p>
            </div>

            {/* Bank Discounts & Offers Box */}
            <div className="border border-[#E0E0E0] rounded-[2px] p-3.5 bg-[#F5F5F5]/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#323232]">
                <Tag size={13} className="text-[#DF6B3B]" />
                <span>Applicable Offers & Promotions</span>
              </div>
              <ul className="text-xs text-[#666666] space-y-1.5 pl-4 list-disc">
                <li>
                  <strong className="text-[#323232]">Instant ₹1,000 Off</strong> on orders above ₹15,000. Use code <span className="text-[#DF6B3B] font-mono font-bold">FESTIVE1000</span>
                </li>
                <li>
                  <strong className="text-[#323232]">10% Instant Discount</strong> on major bank credit card EMI transactions.
                </li>
                <li>
                  <strong className="text-[#323232]">Free Standard Delivery & Assembly</strong> included with every order.
                </li>
              </ul>
            </div>

            {/* Size Selector (if available) */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#323232] mb-2">
                  Select Size: <span className="text-[#DF6B3B] font-bold">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-3.5 py-1.5 border rounded-[2px] text-xs font-semibold transition-all cursor-pointer",
                        selectedSize === size
                          ? "border-[#DF6B3B] bg-[#DF6B3B] text-white"
                          : "border-[#E0E0E0] text-[#323232] bg-white hover:border-[#DF6B3B]"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Stock Indicator */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#323232] mb-1.5">
                  Quantity
                </p>
                <div className="flex items-center border border-[#E0E0E0] rounded-[2px] bg-white overflow-hidden w-28">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={!inStock}
                    className="w-9 h-9 flex items-center justify-center text-[#323232] hover:bg-[#F5F5F5] transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="flex-1 text-center font-bold text-xs text-[#323232]">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    disabled={!inStock}
                    className="w-9 h-9 flex items-center justify-center text-[#323232] hover:bg-[#F5F5F5] transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#666666] block">Item Total</span>
                <span className="text-base font-bold text-[#323232]">
                  ₹{(product.price * qty).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className={cn(
                  "flex-1 h-12 flex items-center justify-center gap-2 rounded-[2px] font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer",
                  isAddedToCart
                    ? "bg-[#0FB67E] text-white"
                    : inStock
                    ? "bg-[#DF6B3B] hover:bg-[#C85A2E] text-white active:scale-[0.99]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                )}
              >
                {isAddedToCart ? (
                  <>
                    <Check size={16} /> Added To Cart
                  </>
                ) : inStock ? (
                  <>
                    <ShoppingCart size={16} /> Add To Cart
                  </>
                ) : (
                  "Out of Stock"
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-[2px] border transition-all cursor-pointer",
                  isWishlisted
                    ? "border-[#DF6B3B] bg-[#FBE4DA] text-[#DF6B3B]"
                    : "border-[#E0E0E0] text-[#666666] hover:border-[#DF6B3B] hover:text-[#DF6B3B] bg-white"
                )}
                aria-label="Wishlist action"
                title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart size={18} className={isWishlisted ? "fill-[#DF6B3B]" : ""} />
              </button>
            </div>

            {/* Pincode & Delivery Checker (Kaizen Livings Style) */}
            <div className="border border-[#E0E0E0] rounded-[2px] p-3.5 bg-white space-y-2 mt-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#323232]">
                <MapPin size={14} className="text-[#DF6B3B]" />
                <span>Check Delivery & Assembly</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit delivery pincode"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, ""));
                    setPincodeResult(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCheckPin()}
                  className="flex-1 border border-[#E0E0E0] rounded-[2px] px-3 py-1.5 text-xs text-[#323232] placeholder:text-[#999999] focus:outline-none focus:border-[#DF6B3B]"
                />
                <button
                  type="button"
                  onClick={handleCheckPin}
                  disabled={checkingPin || !pincode}
                  className="px-4 py-1.5 bg-[#323232] hover:bg-[#121212] text-white text-xs font-bold uppercase rounded-[2px] transition-colors disabled:opacity-40 cursor-pointer"
                >
                  {checkingPin ? "Checking…" : "Check"}
                </button>
              </div>

              {pincodeResult && (
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold pt-1",
                    pincodeResult.available ? "text-[#0FB67E]" : "text-red-500"
                  )}
                >
                  {pincodeResult.available ? (
                    <CheckCircle2 size={14} className="shrink-0" />
                  ) : (
                    <XCircle size={14} className="shrink-0" />
                  )}
                  <span>{pincodeResult.message}</span>
                </div>
              )}
            </div>

            {/* 4 Trust Highlights (Kaizen Livings Pillars) */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="flex items-center gap-2.5 p-2.5 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                <ShieldCheck size={18} className="text-[#DF6B3B] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#323232]">
                    {product.warrantyMonths ? `${product.warrantyMonths} Months Warranty` : "12 Months Warranty"}
                  </p>
                  <p className="text-[10px] text-[#666666]">Covers manufacturing joints</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                <Truck size={18} className="text-[#0FB67E] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#323232]">Free Safe Delivery</p>
                  <p className="text-[10px] text-[#666666]">Direct from master artisans</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                <Sparkles size={18} className="text-[#DF6B3B] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#323232]">100% Solid Craft</p>
                  <p className="text-[10px] text-[#666666]">Authentic Indian materials</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                <Clock size={18} className="text-[#0FB67E] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#323232]">7-Day Easy Returns</p>
                  <p className="text-[10px] text-[#666666]">Hassle-free replacement</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ════ DETAILS ACCORDIONS & SPECIFICATION TABS (Kaizen Livings Schema Mapping) ════ */}
        <div className="mt-12 bg-white border border-[#E0E0E0] rounded-[2px] overflow-hidden">
          {/* Desktop Tab Bar */}
          <div className="hidden sm:flex border-b border-[#E0E0E0] bg-[#F5F5F5]/60">
            {([
              { id: "description",    label: "Overview & Details" },
              { id: "specifications", label: "Properties & Specifications" },
              { id: "warranty",       label: "Warranty & Care" },
              { id: "delivery",       label: "Delivery & Installation" },
              { id: "reviews",        label: `Customer Reviews (${reviewCount})` },
            ] as { id: InfoTab; label: string }[]).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer -mb-px",
                  activeTab === tab.id
                    ? "border-[#DF6B3B] text-[#DF6B3B] bg-white font-bold"
                    : "border-transparent text-[#666666] hover:text-[#323232]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content / Body */}
          <div className="p-6 lg:p-8">

            {/* 1. Details & Description */}
            {(activeTab === "description" || openAccordions.description) && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#323232] mb-3">
                    About This Furniture Piece
                  </h3>
                  <p className="text-sm text-[#323232]/85 leading-relaxed">
                    {product.description ||
                      "Handcrafted with precision and traditional woodworking heritage. Every piece is thoroughly checked for quality, finish, and structural endurance to ensure an enduring addition to your home decor."}
                  </p>
                </div>

                {/* Key Highlight Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E0E0E0]">
                  {product.materialType && (
                    <div className="p-3 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                      <span className="text-[11px] text-[#666666] uppercase block">Material</span>
                      <span className="text-xs font-bold text-[#323232]">{product.materialType}</span>
                    </div>
                  )}
                  {product.finishType && (
                    <div className="p-3 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                      <span className="text-[11px] text-[#666666] uppercase block">Finish</span>
                      <span className="text-xs font-bold text-[#323232]">{product.finishType}</span>
                    </div>
                  )}
                  {product.storageType && (
                    <div className="p-3 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                      <span className="text-[11px] text-[#666666] uppercase block">Storage</span>
                      <span className="text-xs font-bold text-[#323232]">{product.storageType}</span>
                    </div>
                  )}
                  {product.warrantyMonths && (
                    <div className="p-3 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                      <span className="text-[11px] text-[#666666] uppercase block">Warranty</span>
                      <span className="text-xs font-bold text-[#323232]">{product.warrantyMonths} Months</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. Specifications & Properties */}
            {activeTab === "specifications" && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#323232] mb-3">
                  Technical Specifications
                </h3>

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "Primary Material", value: product.materialType },
                    { label: "Finish Type", value: product.finishType },
                    { label: "Storage Capacity", value: product.storageType },
                    { label: "Net Weight", value: product.netWeight ? `${product.netWeight} kg` : null },
                    { label: "Warranty Period", value: product.warrantyMonths ? `${product.warrantyMonths} Months` : "12 Months" },
                    { label: "Category", value: product.category?.replace(/-/g, " ") },
                    { label: "Assembly", value: "Delivered Pre-Assembled / Expert Setup" },
                    { label: "Country of Origin", value: "India (Crafted in Rajasthan & UP)" },
                  ]
                    .filter((item) => item.value)
                    .map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between p-3 bg-white border border-[#E0E0E0] rounded-[2px]"
                      >
                        <span className="text-xs text-[#666666] font-medium">{label}</span>
                        <span className="text-xs font-bold text-[#323232] capitalize">{value}</span>
                      </div>
                    ))}
                </div>

                {/* Dimensions breakdown */}
                {product.dimensions && (
                  <div className="pt-4 border-t border-[#E0E0E0]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#323232] mb-3">
                      Dimensions (Length × Width × Height)
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3.5 border border-[#DF6B3B]/30 bg-[#FBE4DA]/40 rounded-[2px]">
                        <p className="text-xl font-bold text-[#DF6B3B]">{product.dimensions.length}</p>
                        <p className="text-[11px] text-[#666666] mt-0.5">Length (cm)</p>
                      </div>
                      <div className="text-center p-3.5 border border-[#DF6B3B]/30 bg-[#FBE4DA]/40 rounded-[2px]">
                        <p className="text-xl font-bold text-[#DF6B3B]">{product.dimensions.width}</p>
                        <p className="text-[11px] text-[#666666] mt-0.5">Width (cm)</p>
                      </div>
                      <div className="text-center p-3.5 border border-[#DF6B3B]/30 bg-[#FBE4DA]/40 rounded-[2px]">
                        <p className="text-xl font-bold text-[#DF6B3B]">{product.dimensions.height}</p>
                        <p className="text-[11px] text-[#666666] mt-0.5">Height (cm)</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Warranty & Care */}
            {activeTab === "warranty" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#323232] mb-2">
                    {product.warrantyMonths || 12} Months Comprehensive Warranty
                  </h3>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    This item includes a {product.warrantyMonths || 12}-month limited manufacturer warranty covering structural integrity, joint stability, and hardware durability against normal indoor usage.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                    <p className="text-xs font-bold text-[#323232] uppercase mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-[#0FB67E]" /> What is Covered
                    </p>
                    <ul className="text-xs text-[#666666] space-y-1 list-disc pl-4">
                      <li>Termite and borer resistance on seasoned woods.</li>
                      <li>Joint separation and structural defects.</li>
                      <li>Hardware and runner mechanism alignment.</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                    <p className="text-xs font-bold text-[#323232] uppercase mb-1.5 flex items-center gap-1.5">
                      <Info size={13} className="text-[#DF6B3B]" /> Care & Maintenance
                    </p>
                    <ul className="text-xs text-[#666666] space-y-1 list-disc pl-4">
                      <li>Wipe surfaces with a clean, dry microfiber cloth.</li>
                      <li>Keep away from direct heat sources and outdoor moisture.</li>
                      <li>Do not use acidic or corrosive surface cleaners.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Delivery & Installation */}
            {activeTab === "delivery" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#323232]">
                  Shipping & Installation Policy
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                    <Truck size={20} className="text-[#DF6B3B] mb-2" />
                    <p className="text-xs font-bold text-[#323232]">Zero-Cost Shipping</p>
                    <p className="text-[11px] text-[#666666] mt-1">
                      Free pan-India delivery on all catalog items with insured packaging.
                    </p>
                  </div>
                  <div className="p-4 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                    <Package size={20} className="text-[#DF6B3B] mb-2" />
                    <p className="text-xs font-bold text-[#323232]">Professional Installation</p>
                    <p className="text-[11px] text-[#666666] mt-1">
                      Our trained technicians unpack, assemble, and position the item at no extra charge.
                    </p>
                  </div>
                  <div className="p-4 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                    <Clock size={20} className="text-[#DF6B3B] mb-2" />
                    <p className="text-xs font-bold text-[#323232]">7-Day Hassle-Free Returns</p>
                    <p className="text-[11px] text-[#666666] mt-1">
                      If the item arrives damaged or mismatched, we offer doorstep replacement or full refund.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Customer Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-8">
                {/* Rating score banner */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-[#F5F5F5] border border-[#E0E0E0] rounded-[2px]">
                  <div className="text-center sm:border-r sm:border-[#E0E0E0] sm:pr-8">
                    <p className="text-5xl font-bold text-[#323232]">{avgRating.toFixed(1)}</p>
                    <div className="flex gap-0.5 justify-center mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={
                            s <= Math.round(avgRating)
                              ? "fill-[#DF6B3B] text-[#DF6B3B]"
                              : "text-[#E0E0E0] fill-[#E0E0E0]"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[#666666] mt-1">{reviewCount} Verified Ratings</p>
                  </div>

                  <div className="flex-1 w-full space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count =
                        product.reviews?.filter((r: ProductReview) => r.rating === star).length || 0;
                      const pct = reviewCount ? Math.round((count / reviewCount) * 100) : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-5 text-right font-medium text-[#666666]">{star}★</span>
                          <div className="flex-1 h-2 bg-[#E0E0E0] rounded-[2px] overflow-hidden">
                            <div
                              className="h-full bg-[#DF6B3B] transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-[11px] text-[#999999]">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review Form for logged in users */}
                {user ? (
                  <div className="border border-[#E0E0E0] p-5 rounded-[2px] bg-white">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#323232] mb-3">
                      Share Your Feedback
                    </h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <p className="text-xs text-[#666666] mb-1.5 font-medium">Your Rating</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setReviewRating(s)}
                              onMouseEnter={() => setReviewHover(s)}
                              onMouseLeave={() => setReviewHover(0)}
                              className="cursor-pointer transition-transform hover:scale-110"
                            >
                              <Star
                                size={24}
                                className={
                                  s <= (reviewHover || reviewRating)
                                    ? "fill-[#DF6B3B] text-[#DF6B3B]"
                                    : "text-[#E0E0E0] fill-[#E0E0E0]"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-[#666666] mb-1.5 font-medium">Your Review</p>
                        <textarea
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Tell us what you liked about this item, craftsmanship, and packaging…"
                          required
                          className="w-full bg-[#F5F5F5] border border-[#E0E0E0] p-3 text-xs text-[#323232] focus:outline-none focus:border-[#DF6B3B] rounded-[2px] resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-6 py-2.5 bg-[#DF6B3B] hover:bg-[#C85A2E] text-white text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {submittingReview ? "Submitting…" : "Post Review"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="p-4 bg-[#FBE4DA]/40 border border-[#DF6B3B]/30 rounded-[2px] flex items-center justify-between">
                    <p className="text-xs text-[#323232]">
                      Purchased this item? <Link to="/auth" className="text-[#DF6B3B] font-bold hover:underline">Log in</Link> to post a verified review.
                    </p>
                  </div>
                )}

                {/* Existing Reviews List */}
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {product.reviews.map((rev: ProductReview) => {
                      const name = rev.userId?.fullName || "Verified Buyer";
                      return (
                        <div
                          key={rev._id}
                          className="p-4 bg-white border border-[#E0E0E0] rounded-[2px] space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-[#DF6B3B] text-white rounded-full flex items-center justify-center font-bold text-[11px]">
                                {name[0]}
                              </div>
                              <span className="text-xs font-bold text-[#323232]">{name}</span>
                              <span className="text-[10px] text-[#0FB67E] bg-[#E8F8F2] px-1.5 py-0.2 rounded font-medium">
                                Verified Purchase
                              </span>
                            </div>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={11}
                                  className={
                                    s <= rev.rating
                                      ? "fill-[#DF6B3B] text-[#DF6B3B]"
                                      : "text-[#E0E0E0] fill-[#E0E0E0]"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-[#666666] leading-relaxed pt-1">
                            {rev.comment}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-[#666666] text-center py-4">
                    No customer reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ════ RELATED PRODUCTS / "CUSTOMERS ALSO VIEWED" ════ */}
        {related.length > 0 && (
          <div className="mt-14 pt-8 border-t border-[#E0E0E0]">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-[#DF6B3B] uppercase block">
                  Handpicked For You
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#323232] mt-0.5">
                  {relatedIsSameCategory
                    ? `More in ${product.category?.replace(/-/g, " ")}`
                    : "Customers Also Viewed"}
                </h2>
              </div>
              <Link
                to={relatedIsSameCategory ? `/shop?category=${product.category}` : "/shop"}
                className="text-xs font-bold text-[#DF6B3B] hover:text-[#C85A2E] hover:underline"
              >
                View Collection →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#666666] hover:text-[#DF6B3B] transition-colors"
          >
            <ArrowLeft size={13} />
            Back to All Furniture
          </Link>
        </div>

      </div>
    </div>
  );
}
