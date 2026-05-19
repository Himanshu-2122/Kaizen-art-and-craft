import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import {
  Minus, Plus, Heart, ShoppingCart, Star,
  Truck, Shield, Package, ArrowLeft,
  MapPin, CheckCircle2, XCircle, ChevronRight,
  User as UserIcon,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";

type InfoTab = "description" | "specs" | "reviews";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { refreshWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [infoTab, setInfoTab] = useState<InfoTab>("description");

  const [related, setRelated] = useState<any[]>([]);
  const [relatedIsSameCategory, setRelatedIsSameCategory] = useState(false);

  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<{ available: boolean; message: string } | null>(null);
  const [checkingPin, setCheckingPin] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  /* ── Load product ── */
  useEffect(() => {
    setRelated([]);
    setRelatedIsSameCategory(false);
    setImageIndex(0);
    setQty(1);
    setPincode("");
    setPincodeResult(null);
    setInfoTab("description");
    setLoading(true);
    (async () => {
      try {
        const res = await api.get(`/products/slug/${slug}`);
        setProduct(res.data);
        if (res.data.sizes?.length) setSelectedSize(res.data.sizes[0]);
      } catch {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  /* ── Load related products ── */
  useEffect(() => {
    if (!product) return;
    (async () => {
      try {
        const res = await api.get("/products", {
          params: { category: product.category, limit: 8 },
        });
        const list: any[] = res.data?.products ?? res.data ?? [];
        const sameCategory = list.filter((p) => p._id !== product._id).slice(0, 6);

        if (sameCategory.length >= 2) {
          setRelated(sameCategory);
          setRelatedIsSameCategory(true);
          return;
        }

        const fallbackRes = await api.get("/products", { params: { limit: 8 } });
        const fallbackList: any[] = fallbackRes.data?.products ?? fallbackRes.data ?? [];
        setRelated(fallbackList.filter((p) => p._id !== product._id).slice(0, 6));
        setRelatedIsSameCategory(false);
      } catch { /* silent */ }
    })();
  }, [product?._id, product?.category]);

  /* ── Check wishlist ── */
  useEffect(() => {
    if (!user || !product) return;
    (async () => {
      try {
        const res = await api.get("/wishlist");
        setIsWishlisted(res.data.some((item: any) => item.productId?._id === product._id));
      } catch { /* silent */ }
    })();
  }, [user, product]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-[#FF6E31]/20 border-t-[#FF6E31] rounded-full animate-spin" />
        <p className="text-sm text-[#555555]">Loading product…</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <div className="w-20 h-20 bg-[#F8F8F8] flex items-center justify-center">
        <Package size={36} className="text-[#FF6E31]" />
      </div>
      <h2 className="text-2xl font-bold text-[#111111]">Product not found</h2>
      <Link to="/shop" className="px-6 py-3 bg-[#FF6E31] text-white font-bold text-sm hover:bg-[#E55F20] transition-colors">
        Back to Shop
      </Link>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : ["https://via.placeholder.com/600x600?text=No+Image"];
  const discountPercent = product.mrpPrice && product.mrpPrice > product.price
    ? Math.round(((product.mrpPrice - product.price) / product.mrpPrice) * 100)
    : 0;

  /* ── Add to cart ── */
  const handleAddToCart = () => {
    addItem({ product_id: product._id, name: product.name, price: product.price, image: images[0], quantity: qty });
    toast.success("Added to cart!");
  };

  /* ── Toggle wishlist ── */
  const toggleWishlist = async () => {
    if (!user) { toast.error("Please login to add to wishlist"); return; }
    try {
      if (isWishlisted) {
        await api.delete("/wishlist", { data: { productId: product._id } });
        toast.success("Removed from wishlist");
      } else {
        await api.post("/wishlist", { productId: product._id });
        toast.success("Added to wishlist!");
      }
      setIsWishlisted(!isWishlisted);
      refreshWishlist();
    } catch { toast.error("Something went wrong"); }
  };

  /* ── Pincode check ── */
  const handleCheckPin = async () => {
    if (!pincode.trim()) { toast.error("Enter a pincode"); return; }
    setCheckingPin(true);
    try {
      const res = await api.post(`/products/${product._id}/check-availability`, { pinCode: pincode });
      setPincodeResult(res.data);
    } catch { setPincodeResult({ available: false, message: "Error checking availability" }); }
    finally { setCheckingPin(false); }
  };

  /* ── Submit review ── */
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to review"); return; }
    if (!reviewRating) { toast.error("Please select a rating"); return; }
    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${product._id}/reviews`, { rating: reviewRating, comment: reviewComment });
      setProduct(res.data);
      setReviewRating(0);
      setReviewComment("");
      setInfoTab("reviews");
      toast.success("Review submitted!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally { setSubmittingReview(false); }
  };

  const avgRating = product.averageRating || 0;
  const reviewCount = product.numReviews || 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1300px] mx-auto px-4 py-8">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-xs text-[#555555] mb-6">
          <Link to="/" className="hover:text-[#FF6E31] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-[#FF6E31] transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-[#111111] font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* ── Main section ── */}
        <div className="grid lg:grid-cols-2 gap-12 mb-8">

          {/* LEFT: Image Gallery */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-square bg-[#F8F8F8] overflow-hidden border border-[#EEEEEE]">
              <img
                key={imageIndex}
                src={getImageUrl(images[imageIndex])}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-[#FF6E31] text-white text-xs font-bold px-2 py-1">
                  {discountPercent}% OFF
                </div>
              )}
              <button
                onClick={toggleWishlist}
                className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center
                             border border-[#EEEEEE] bg-white transition-all duration-200 ${
                  isWishlisted ? "bg-[#FF6E31] border-[#FF6E31]" : "hover:border-[#FF6E31]"
                }`}
              >
                <Heart size={16} className={isWishlisted ? "text-white fill-white" : "text-[#FF6E31]"} />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`shrink-0 w-[72px] h-[72px] overflow-hidden border-2 transition-all ${
                      i === imageIndex
                        ? "border-[#FF6E31]"
                        : "border-[#EEEEEE] hover:border-[#FF6E31]/50"
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col gap-5">

            {/* Category tag */}
            {product.category && (
              <span className="inline-flex self-start px-2.5 py-0.5 bg-[#FFF4EE] text-[#FF6E31]
                               text-[11px] font-bold uppercase tracking-wide">
                {product.category.replace(/-/g, " ")}
              </span>
            )}

            {/* Name */}
            <h1 className="text-2xl lg:text-[26px] font-bold text-[#111111] leading-tight">
              {product.name}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={15}
                    className={s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-[#EEEEEE] fill-[#EEEEEE]"}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-[#111111]">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-[#555555]">({reviewCount} reviews)</span>
            </div>

            {/* Price block */}
            <div className="bg-[#F8F8F8] p-5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-[#111111]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-lg text-[#999999] line-through">
                      ₹{product.mrpPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm font-bold text-[#2E7D32]">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#999999] mt-1">Inclusive of all taxes</p>
            </div>

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-[#111111] mb-2">
                  Size: <span className="text-[#FF6E31] font-bold">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "border-[#FF6E31] bg-[#FF6E31] text-white"
                          : "border-[#EEEEEE] text-[#111111] hover:border-[#FF6E31]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity stepper */}
            <div>
              <p className="text-sm font-medium text-[#111111] mb-2">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#EEEEEE]">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#555555]
                               hover:bg-[#F8F8F8] transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center font-bold text-[#111111]">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#555555]
                               hover:bg-[#F8F8F8] transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-sm text-[#555555]">
                  Total: <span className="font-bold text-[#111111]">₹{(product.price * qty).toLocaleString("en-IN")}</span>
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-[#FF6E31] hover:bg-[#E55F20]
                           text-white font-bold py-4 text-sm tracking-wide transition-colors"
              >
                <ShoppingCart size={18} />
                ADD TO CART
              </button>
              <button
                onClick={toggleWishlist}
                className={`w-14 h-14 flex items-center justify-center border-2 transition-all ${
                  isWishlisted
                    ? "bg-[#FF6E31]/10 border-[#FF6E31] text-[#FF6E31]"
                    : "border-[#EEEEEE] text-[#555555] hover:border-[#FF6E31] hover:text-[#FF6E31]"
                }`}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="flex items-center gap-3 border border-[#EEEEEE] p-3">
              <Truck size={16} className="text-[#2E7D32] shrink-0" />
              <span className="text-sm text-[#555555]">
                <span className="font-medium text-[#111111]">Free delivery</span> on this order
              </span>
            </div>

            {/* Feature badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Package, label: "Handcrafted",  sub: "Artisan made" },
                { icon: Shield,  label: "Warranty",      sub: `${product.warrantyMonths || "—"} months` },
                { icon: Truck,   label: "Free Returns",  sub: "Within 7 days" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center p-3 bg-[#F8F8F8]">
                  <Icon size={18} className="text-[#FF6E31] mb-1.5" />
                  <p className="text-[11px] font-bold text-[#111111]">{label}</p>
                  <p className="text-[10px] text-[#999999]">{sub}</p>
                </div>
              ))}
            </div>

            {/* Pincode checker */}
            <div className="border border-[#EEEEEE] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#FF6E31]" />
                <p className="text-sm font-medium text-[#111111]">Check Delivery Availability</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value); setPincodeResult(null); }}
                  onKeyDown={(e) => e.key === "Enter" && handleCheckPin()}
                  className="flex-1 border border-[#EEEEEE] px-3 py-2.5 text-sm text-[#111111]
                             placeholder:text-[#999999] focus:outline-none focus:border-[#FF6E31] transition-colors"
                />
                <button
                  onClick={handleCheckPin}
                  disabled={checkingPin}
                  className="px-4 py-2.5 bg-[#FF6E31] text-white text-sm font-bold hover:bg-[#E55F20]
                             transition-colors disabled:opacity-60 shrink-0"
                >
                  {checkingPin ? "…" : "Check"}
                </button>
              </div>
              {pincodeResult && (
                <div className={`flex items-center gap-2 text-sm font-medium ${pincodeResult.available ? "text-[#2E7D32]" : "text-red-500"}`}>
                  {pincodeResult.available ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {pincodeResult.message}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── Tabs: Description | Specs | Reviews ── */}
        <div className="bg-white border border-[#EEEEEE] overflow-hidden mb-10">

          {/* Tab bar */}
          <div className="flex border-b border-[#EEEEEE]">
            {([
              { id: "description", label: "Description" },
              { id: "specs",       label: "Specifications" },
              { id: "reviews",     label: `Reviews (${reviewCount})` },
            ] as { id: InfoTab; label: string }[]).map((t) => (
              <button
                key={t.id}
                onClick={() => setInfoTab(t.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-all -mb-px ${
                  infoTab === t.id
                    ? "border-[#FF6E31] text-[#FF6E31]"
                    : "border-transparent text-[#555555] hover:text-[#111111]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6 lg:p-8">

            {/* ── Description ── */}
            {infoTab === "description" && (
              <div>
                <p className="text-[#555555] leading-relaxed text-sm lg:text-base">
                  {product.description || "Premium quality product crafted with care and attention to detail."}
                </p>
                {product.materialType && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {[
                      { label: "Material", value: product.materialType },
                      { label: "Finish", value: product.finishType },
                      { label: "Storage", value: product.storageType },
                    ].filter(x => x.value).map(({ label, value }) => (
                      <div key={label} className="px-4 py-2 bg-[#F8F8F8] border border-[#EEEEEE]">
                        <span className="text-xs text-[#999999]">{label}: </span>
                        <span className="text-sm font-medium text-[#111111]">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Specifications ── */}
            {infoTab === "specs" && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "Material Type",  value: product.materialType },
                    { label: "Finish Type",    value: product.finishType },
                    { label: "Storage Type",   value: product.storageType },
                    { label: "Net Weight",     value: product.netWeight ? `${product.netWeight} kg` : null },
                    { label: "Warranty",       value: product.warrantyMonths ? `${product.warrantyMonths} months` : null },
                    { label: "Category",       value: product.category },
                  ].filter(x => x.value).map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between p-3.5 bg-[#F8F8F8] border border-[#EEEEEE]">
                      <span className="text-sm text-[#555555]">{label}</span>
                      <span className="text-sm font-medium text-[#111111]">{value}</span>
                    </div>
                  ))}
                </div>

                {product.dimensions && (
                  <div>
                    <h4 className="font-bold text-[#111111] text-sm mb-3">Dimensions</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Length", value: product.dimensions.length },
                        { label: "Width",  value: product.dimensions.width },
                        { label: "Height", value: product.dimensions.height },
                      ].map(({ label, value }) => (
                        <div key={label} className="text-center p-4 border border-[#FF6E31]/20 bg-[#FFF4EE]">
                          <p className="text-2xl font-bold text-[#FF6E31]">{value}</p>
                          <p className="text-xs text-[#555555] mt-1">{label} (cm)</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Reviews ── */}
            {infoTab === "reviews" && (
              <div className="space-y-8">

                {reviewCount > 0 && (
                  <div className="flex items-center gap-6 p-5 bg-[#F8F8F8] border border-[#EEEEEE]">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-[#111111]">{avgRating.toFixed(1)}</p>
                      <div className="flex gap-0.5 justify-center mt-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={14} className={s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-[#EEEEEE] fill-[#EEEEEE]"} />
                        ))}
                      </div>
                      <p className="text-xs text-[#999999] mt-1">{reviewCount} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5,4,3,2,1].map(star => {
                        const count = product.reviews?.filter((r: any) => r.rating === star).length || 0;
                        const pct = reviewCount ? Math.round((count / reviewCount) * 100) : 0;
                        return (
                          <div key={star} className="flex items-center gap-2 text-xs">
                            <span className="w-4 text-right text-[#555555]">{star}</span>
                            <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
                            <div className="flex-1 h-1.5 bg-[#EEEEEE] overflow-hidden">
                              <div className="h-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-7 text-[#999999]">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Review form */}
                {user ? (
                  <div className="border border-[#EEEEEE] p-5">
                    <h4 className="font-bold text-[#111111] mb-4">Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-[#555555] uppercase tracking-wider mb-2">Your Rating</p>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setReviewRating(s)}
                              onMouseEnter={() => setReviewHover(s)}
                              onMouseLeave={() => setReviewHover(0)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star size={28} className={
                                s <= (reviewHover || reviewRating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-[#EEEEEE] fill-[#EEEEEE]"
                              } />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#555555] uppercase tracking-wider mb-2">Your Comment</p>
                        <textarea
                          rows={4}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience with this product…"
                          required
                          className="w-full bg-[#F8F8F8] border border-[#EEEEEE] px-4 py-3 text-sm text-[#111111]
                                     placeholder:text-[#999999] focus:outline-none focus:border-[#FF6E31] transition-colors resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submittingReview || !reviewRating}
                        className="px-6 py-3 bg-[#FF6E31] text-white text-sm font-bold hover:bg-[#E55F20]
                                   transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {submittingReview ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                        ) : "Submit Review"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-[#FFF4EE] border border-[#FF6E31]/20">
                    <UserIcon size={18} className="text-[#FF6E31]" />
                    <p className="text-sm text-[#111111]">
                      <Link to="/auth" className="text-[#FF6E31] font-bold hover:underline">Login</Link>{" "}
                      to share your review
                    </p>
                  </div>
                )}

                {/* Existing reviews */}
                {product.reviews?.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review: any) => {
                      const name = review.userId?.fullName || "Anonymous";
                      const initials = name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                      return (
                        <div key={review._id} className="p-5 bg-[#F8F8F8] border border-[#EEEEEE]">
                          <div className="flex items-center gap-3 mb-3">
                            {review.userId?.avatarUrl ? (
                              <img src={review.userId.avatarUrl} alt={name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 bg-[#FF6E31] flex items-center justify-center text-white text-sm font-bold shrink-0">
                                {initials}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-[#111111] text-sm">{name}</p>
                              <div className="flex gap-0.5 mt-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} size={12} className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-[#EEEEEE] fill-[#EEEEEE]"} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-[#555555] leading-relaxed">{review.comment}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star size={36} className="text-[#EEEEEE] fill-[#EEEEEE] mx-auto mb-3" />
                    <p className="text-[#555555] font-medium">No reviews yet</p>
                    <p className="text-xs text-[#999999] mt-1">Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-10">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-[22px] font-bold text-[#111111]">
                  {relatedIsSameCategory
                    ? `More ${product.category?.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}`
                    : "You Might Also Like"}
                </h2>
              </div>
              <Link
                to={relatedIsSameCategory ? `/shop?category=${product.category}` : "/shop"}
                className="text-sm font-medium text-[#FF6E31] hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* ── Back link ── */}
        <div className="mt-8">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-[#555555]
                                     hover:text-[#FF6E31] transition-colors">
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
        </div>

      </div>
    </div>
  );
}
