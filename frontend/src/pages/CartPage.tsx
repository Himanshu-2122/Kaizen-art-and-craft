import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowLeft,
  MapPin, ChevronRight, Loader2, CheckCircle,
} from "lucide-react";

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

const EMPTY_ADDRESS: Address = { street: "", city: "", state: "", zip: "" };

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"cart" | "address" | "success">("cart");
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState("");

  const shipping   = total >= 500 ? 0 : 49;
  const grandTotal = total + shipping;

  function setField(key: keyof Address, val: string) {
    setAddress((a) => ({ ...a, [key]: val }));
  }

  function addressComplete() {
    return address.street.trim() && address.city.trim() &&
           address.state.trim() && address.zip.trim();
  }

  async function placeOrder() {
    if (!user) { toast.error("Please login to place an order"); navigate("/auth"); return; }
    if (!addressComplete()) { toast.error("Please fill in all address fields"); return; }

    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({
          product_id: i.product_id,
          name:       i.name,
          price:      i.price,
          quantity:   i.quantity,
          size:       i.size ?? "",
          image:      i.image,
        })),
        shippingAddress: {
          street:  address.street.trim(),
          city:    address.city.trim(),
          state:   address.state.trim(),
          zip:     address.zip.trim(),
          country: "India",
        },
      };

      const res = await api.post("/orders/checkout", payload);
      setOrderId(res.data._id);
      clearCart();
      setStep("success");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err instanceof Error ? err.message : "Order failed. Please try again.");
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  }

  /* ── Success screen ── */
  if (step === "success") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 bg-[#f0fff4] rounded-[4px] border border-[#0fb67e]/30 flex items-center justify-center mb-5">
          <CheckCircle size={36} className="text-[#0fb67e]" />
        </div>
        <h1 className="text-3xl font-bold text-[#121212] mb-2">Order Confirmed!</h1>
        <p className="text-[#7d7d7d] mb-1">
          Your order <span className="font-mono font-bold text-[#121212]">#{orderId.slice(-8).toUpperCase()}</span> has been placed successfully.
        </p>
        <p className="text-sm text-[#7d7d7d] mb-8">We are preparing your handcrafted treasures for dispatch.</p>
        <div className="flex gap-4">
          <Link
            to="/profile"
            className="bg-[#ec7744] hover:bg-[#f09269] text-white font-bold px-6 py-2.5 rounded-[4px] shadow-sm transition-colors text-xs uppercase tracking-wider"
          >
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="border border-[#dedede] text-[#121212] font-bold px-6 py-2.5 rounded-[4px] hover:bg-[#f7f7f7] transition-colors text-xs uppercase tracking-wider"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ── Empty cart ── */
  if (items.length === 0 && step === "cart") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-20 h-20 bg-[#f8f1eb] rounded-[4px] flex items-center justify-center mb-4">
          <ShoppingBag size={40} className="text-[#ec7744]" />
        </div>
        <h1 className="text-2xl font-bold text-[#121212] mb-2">Your Cart is Empty</h1>
        <p className="text-[#7d7d7d] mb-8 text-center max-w-sm text-sm">
          Looks like you haven't added any handcrafted items yet. Discover our collections!
        </p>
        <Link
          to="/shop"
          className="bg-[#ec7744] hover:bg-[#f09269] text-white font-bold px-8 py-3 rounded-[4px] shadow-sm transition-colors text-xs uppercase tracking-wider"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-[#dedede] py-6 px-6">
        <div className="max-w-[1100px] mx-auto">
          <nav className="flex items-center gap-2 text-xs text-[#7d7d7d] mb-2.5">
            <Link to="/" className="hover:text-[#ec7744] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#121212] font-semibold">
              {step === "cart" ? "Cart" : "Checkout"}
            </span>
          </nav>
          <div className="flex items-center gap-3">
            {step === "address" ? (
              <button onClick={() => setStep("cart")} className="text-[#ec7744] hover:text-[#f09269]" aria-label="Back to cart">
                <ArrowLeft size={20} />
              </button>
            ) : (
              <Link to="/shop" className="text-[#ec7744] hover:text-[#f09269]" aria-label="Back to shop">
                <ArrowLeft size={20} />
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#121212]">
              {step === "cart" ? "Shopping Cart" : "Delivery Address"}
            </h1>
            {step === "cart" && (
              <span className="bg-[#ec7744] text-white text-xs font-bold px-2.5 py-0.5 rounded-[4px]">
                {items.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8 text-xs font-bold uppercase tracking-wider">
          {[
            { label: "1. Cart",    key: "cart" },
            { label: "2. Address", key: "address" },
            { label: "3. Confirmation", key: "confirm" },
          ].map((s, i) => (
            <span key={s.key} className="flex items-center gap-3">
              {i > 0 && <ChevronRight size={14} className="text-[#dedede]" />}
              <span className={`${step === s.key ? "text-[#ec7744] underline underline-offset-4" : "text-[#7d7d7d]"}`}>
                {s.label}
              </span>
            </span>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── LEFT PANEL ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* STEP 1: Cart items */}
            {step === "cart" && items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-white border border-[#dedede] rounded-[4px] hover:border-[#ec7744] transition-colors">
                <div className="w-20 h-20 overflow-hidden bg-[#f7f7f7] rounded-[2px] shrink-0 border border-[#dedede]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#121212] text-sm line-clamp-2 leading-tight">{item.name}</h3>
                  {item.size && (
                    <p className="text-xs text-[#7d7d7d] mt-0.5">Size: {item.size}</p>
                  )}
                  <p className="text-sm font-bold text-[#ec7744] mt-1">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="w-7 h-7 border border-[#dedede] rounded-[2px] flex items-center justify-center
                                 hover:border-[#ec7744] hover:text-[#ec7744] transition-colors text-[#121212]"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold text-[#121212] w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      className="w-7 h-7 border border-[#dedede] rounded-[2px] flex items-center justify-center
                                 hover:border-[#ec7744] hover:text-[#ec7744] transition-colors text-[#121212]"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      className="ml-auto p-1.5 text-[#7d7d7d] hover:text-red-500 transition-colors"
                      onClick={() => { removeItem(item.id); toast.success("Item removed"); }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[#121212] text-sm">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}

            {/* STEP 2: Address form */}
            {step === "address" && (
              <div className="bg-white border border-[#dedede] rounded-[4px] p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#dedede]">
                  <MapPin size={16} className="text-[#ec7744]" />
                  <h2 className="font-bold text-[#121212] text-sm uppercase tracking-wide">Delivery Address</h2>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#7d7d7d] uppercase tracking-wide mb-1 block">
                    Street / Area *
                  </label>
                  <input
                    value={address.street}
                    onChange={(e) => setField("street", e.target.value)}
                    placeholder="e.g. 12, MG Road, Near Bus Stand"
                    className="w-full border border-[#dedede] rounded-[4px] px-3.5 py-2 text-sm text-[#121212]
                               focus:outline-none focus:border-[#ec7744] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#7d7d7d] uppercase tracking-wide mb-1 block">City *</label>
                    <input
                      value={address.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="e.g. Jaipur"
                      className="w-full border border-[#dedede] rounded-[4px] px-3.5 py-2 text-sm text-[#121212]
                                 focus:outline-none focus:border-[#ec7744] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#7d7d7d] uppercase tracking-wide mb-1 block">State *</label>
                    <input
                      value={address.state}
                      onChange={(e) => setField("state", e.target.value)}
                      placeholder="e.g. Rajasthan"
                      className="w-full border border-[#dedede] rounded-[4px] px-3.5 py-2 text-sm text-[#121212]
                                 focus:outline-none focus:border-[#ec7744] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#7d7d7d] uppercase tracking-wide mb-1 block">PIN Code *</label>
                    <input
                      value={address.zip}
                      onChange={(e) => setField("zip", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="e.g. 302001"
                      maxLength={6}
                      className="w-full border border-[#dedede] rounded-[4px] px-3.5 py-2 text-sm text-[#121212]
                                 focus:outline-none focus:border-[#ec7744] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#7d7d7d] uppercase tracking-wide mb-1 block">Country</label>
                    <input
                      value="India"
                      readOnly
                      className="w-full border border-[#dedede] rounded-[4px] px-3.5 py-2 text-sm text-[#7d7d7d] bg-[#f7f7f7] cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Order summary on mobile */}
                <div className="lg:hidden border-t border-[#dedede] pt-4 space-y-2 text-sm">
                  {items.slice(0, 2).map((i) => (
                    <div key={i.id} className="flex justify-between text-[#7d7d7d]">
                      <span className="truncate max-w-[180px]">{i.name} × {i.quantity}</span>
                      <span className="font-bold text-[#121212]">₹{(i.price * i.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  {items.length > 2 && (
                    <p className="text-xs text-[#7d7d7d]">+{items.length - 2} more items</p>
                  )}
                </div>

                <button
                  onClick={placeOrder}
                  disabled={placing || !addressComplete()}
                  className="w-full bg-[#ec7744] hover:bg-[#f09269] text-white font-bold py-3 px-6 rounded-[4px] shadow-sm
                             transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider
                             disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {placing ? (
                    <><Loader2 size={16} className="animate-spin" /> Placing Order…</>
                  ) : (
                    <>Confirm Order — ₹{grandTotal.toLocaleString("en-IN")}</>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ── Order Summary sidebar ── */}
          <div className="bg-[#f8f1eb]/50 border border-[#dedede] rounded-[4px] p-6 h-fit sticky top-4">
            <h2 className="font-bold text-[#121212] text-base uppercase tracking-wide mb-4 pb-2 border-b border-[#dedede]">Order Summary</h2>

            <div className="space-y-2 text-xs mb-4 max-h-40 overflow-y-auto">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between gap-2">
                  <span className="text-[#7d7d7d] truncate">{i.name} × {i.quantity}</span>
                  <span className="font-bold text-[#121212] shrink-0">
                    ₹{(i.price * i.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#dedede] pt-4 space-y-2.5 text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-[#7d7d7d]">Subtotal</span>
                <span className="font-bold text-[#121212]">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7d7d7d]">Shipping</span>
                <span className={shipping === 0 ? "text-[#0fb67e] font-bold" : "font-bold text-[#121212]"}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[11px] text-[#ec7744] bg-[#fbe4da] p-2 rounded-[2px]">
                  Add ₹{(500 - total).toLocaleString("en-IN")} more for free delivery
                </p>
              )}
            </div>

            <div className="border-t border-[#dedede] pt-4 flex justify-between font-bold text-[#121212] text-base mb-6">
              <span>Total Amount</span>
              <span>₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>

            {step === "cart" && (
              <>
                {!user ? (
                  <Link
                    to="/auth"
                    className="block w-full bg-[#ec7744] hover:bg-[#f09269] text-white font-bold py-3 rounded-[4px]
                               shadow-sm transition-colors text-center text-xs uppercase tracking-wider"
                  >
                    Login to Checkout
                  </Link>
                ) : (
                  <button
                    onClick={() => setStep("address")}
                    className="w-full bg-[#ec7744] hover:bg-[#f09269] text-white font-bold py-3 rounded-[4px]
                               shadow-sm transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                  >
                    Proceed to Checkout
                    <ChevronRight size={16} />
                  </button>
                )}
              </>
            )}

            <Link
              to="/shop"
              className="block text-center text-xs text-[#ec7744] font-bold mt-4 hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
