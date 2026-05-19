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
        err instanceof Error
          ? err.message
          : (err as any)?.response?.data?.message ?? "Order failed. Please try again.";
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  }

  /* ── Success screen ── */
  if (step === "success") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-20 h-20 bg-[#E8F5E9] flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-[#2E7D32]" />
        </div>
        <h1 className="text-3xl font-bold text-[#111111] mb-2">Order Placed!</h1>
        <p className="text-[#555555] mb-1">
          Your order <span className="font-mono font-bold text-[#111111]">#{orderId.slice(-8).toUpperCase()}</span> has been confirmed.
        </p>
        <p className="text-sm text-[#555555] mb-8">We'll prepare it and ship it to your address.</p>
        <div className="flex gap-4">
          <Link
            to="/profile"
            className="bg-[#FF6E31] text-white font-bold px-6 py-3 hover:bg-[#E55F20] transition-colors text-sm"
          >
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="border border-[#EEEEEE] text-[#111111] font-bold px-6 py-3
                       hover:bg-[#111111] hover:text-white transition-colors text-sm"
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-24 px-6">
        <ShoppingBag size={56} className="text-[#EEEEEE] mb-4" />
        <h1 className="text-3xl font-bold text-[#111111] mb-2">Your Cart is Empty</h1>
        <p className="text-[#555555] mb-8 text-center max-w-sm">
          Looks like you haven't added any handcrafted items yet.
        </p>
        <Link
          to="/shop"
          className="bg-[#FF6E31] text-white font-bold px-8 py-3 hover:bg-[#E55F20] transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-[#EEEEEE] py-5 px-6">
        <div className="max-w-[1100px] mx-auto">
          <nav className="flex items-center gap-2 text-xs text-[#555555] mb-2">
            <Link to="/" className="hover:text-[#FF6E31]">Home</Link>
            <span>/</span>
            <span className="text-[#111111] font-medium">
              {step === "cart" ? "Cart" : "Checkout"}
            </span>
          </nav>
          <div className="flex items-center gap-3">
            {step === "address" ? (
              <button onClick={() => setStep("cart")} className="text-[#FF6E31] hover:text-[#E55F20]">
                <ArrowLeft size={20} />
              </button>
            ) : (
              <Link to="/shop" className="text-[#FF6E31] hover:text-[#E55F20]">
                <ArrowLeft size={20} />
              </Link>
            )}
            <h1 className="text-2xl font-bold text-[#111111]">
              {step === "cart" ? "Shopping Cart" : "Delivery Address"}
            </h1>
            {step === "cart" && (
              <span className="bg-[#FF6E31] text-white text-xs font-bold px-2.5 py-1">
                {items.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8 text-sm">
          {[
            { label: "Cart",    key: "cart" },
            { label: "Address", key: "address" },
            { label: "Confirm", key: "confirm" },
          ].map((s, i) => (
            <span key={s.key} className="flex items-center gap-3">
              {i > 0 && <ChevronRight size={14} className="text-[#EEEEEE]" />}
              <span className={`font-medium ${step === s.key ? "text-[#FF6E31]" : "text-[#EEEEEE]"}`}>
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
              <div key={item.id} className="flex gap-4 p-4 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <div className="w-20 h-20 overflow-hidden bg-[#F8F8F8] shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[#111111] text-sm line-clamp-2">{item.name}</h3>
                  {item.size && (
                    <p className="text-xs text-[#555555] mt-0.5">Size: {item.size}</p>
                  )}
                  <p className="text-sm font-bold text-[#FF6E31] mt-1">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="w-7 h-7 border border-[#EEEEEE] flex items-center justify-center
                                 hover:border-[#FF6E31] hover:text-[#FF6E31] transition-colors"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold text-[#111111] w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      className="w-7 h-7 border border-[#EEEEEE] flex items-center justify-center
                                 hover:border-[#FF6E31] hover:text-[#FF6E31] transition-colors"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      className="ml-auto p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => { removeItem(item.id); toast.success("Item removed"); }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[#111111] text-sm">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}

            {/* STEP 2: Address form */}
            {step === "address" && (
              <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-[#FF6E31]" />
                  <h2 className="font-bold text-[#111111] text-base">Delivery Address</h2>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#555555] uppercase tracking-wide mb-1 block">
                    Street / Area *
                  </label>
                  <input
                    value={address.street}
                    onChange={(e) => setField("street", e.target.value)}
                    placeholder="e.g. 12, MG Road, Near Bus Stand"
                    className="w-full border border-[#EEEEEE] px-4 py-2.5 text-sm text-[#111111]
                               focus:outline-none focus:border-[#FF6E31] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#555555] uppercase tracking-wide mb-1 block">City *</label>
                    <input
                      value={address.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="e.g. Jaipur"
                      className="w-full border border-[#EEEEEE] px-4 py-2.5 text-sm text-[#111111]
                                 focus:outline-none focus:border-[#FF6E31] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#555555] uppercase tracking-wide mb-1 block">State *</label>
                    <input
                      value={address.state}
                      onChange={(e) => setField("state", e.target.value)}
                      placeholder="e.g. Rajasthan"
                      className="w-full border border-[#EEEEEE] px-4 py-2.5 text-sm text-[#111111]
                                 focus:outline-none focus:border-[#FF6E31] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#555555] uppercase tracking-wide mb-1 block">PIN Code *</label>
                    <input
                      value={address.zip}
                      onChange={(e) => setField("zip", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="e.g. 302001"
                      maxLength={6}
                      className="w-full border border-[#EEEEEE] px-4 py-2.5 text-sm text-[#111111]
                                 focus:outline-none focus:border-[#FF6E31] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#555555] uppercase tracking-wide mb-1 block">Country</label>
                    <input
                      value="India"
                      readOnly
                      className="w-full border border-[#EEEEEE] px-4 py-2.5 text-sm text-[#999999] bg-[#F8F8F8] cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Order summary on mobile */}
                <div className="lg:hidden border-t border-[#EEEEEE] pt-4 space-y-2 text-sm">
                  {items.slice(0, 2).map((i) => (
                    <div key={i.id} className="flex justify-between text-[#555555]">
                      <span className="truncate max-w-[180px]">{i.name} × {i.quantity}</span>
                      <span className="font-bold text-[#111111]">₹{(i.price * i.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  {items.length > 2 && (
                    <p className="text-xs text-[#999999]">+{items.length - 2} more items</p>
                  )}
                </div>

                <button
                  onClick={placeOrder}
                  disabled={placing || !addressComplete()}
                  className="w-full bg-[#FF6E31] text-white font-bold py-3.5 hover:bg-[#E55F20]
                             transition-colors flex items-center justify-center gap-2
                             disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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
          <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6 h-fit sticky top-4">
            <h2 className="font-bold text-[#111111] text-lg mb-5">Order Summary</h2>

            <div className="space-y-2 text-sm mb-4 max-h-40 overflow-y-auto">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between gap-2">
                  <span className="text-[#555555] truncate">{i.name} × {i.quantity}</span>
                  <span className="font-medium text-[#111111] shrink-0">
                    ₹{(i.price * i.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#EEEEEE] pt-4 space-y-3 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-[#555555]">Subtotal</span>
                <span className="font-medium text-[#111111]">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555555]">Shipping</span>
                <span className={shipping === 0 ? "text-[#2E7D32] font-bold" : "font-medium text-[#111111]"}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[11px] text-[#555555] bg-[#F8F8F8] px-3 py-2">
                  Add ₹{(500 - total).toLocaleString("en-IN")} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-[#EEEEEE] pt-4 flex justify-between font-bold text-[#111111] text-lg mb-6">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>

            {step === "cart" && (
              <>
                {!user ? (
                  <Link
                    to="/auth"
                    className="block w-full bg-[#FF6E31] text-white font-bold py-3
                               hover:bg-[#E55F20] transition-colors text-center text-sm"
                  >
                    Login to Checkout
                  </Link>
                ) : (
                  <button
                    onClick={() => setStep("address")}
                    className="w-full bg-[#FF6E31] text-white font-bold py-3
                               hover:bg-[#E55F20] transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    Proceed to Checkout
                    <ChevronRight size={16} />
                  </button>
                )}
              </>
            )}

            <Link
              to="/shop"
              className="block text-center text-sm text-[#FF6E31] font-medium mt-4 hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
