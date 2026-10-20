import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { ShoppingCart, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniCartProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function MiniCart({ open, setOpen }: MiniCartProps) {
  const { items, total, removeItem } = useCart();
  const subtotal = total;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 w-80 sm:w-96 bg-white shadow-mega z-50 flex flex-col border-l border-[#E0E0E0] transition-transform duration-300 ease-in-out font-sans",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#DF6B3B]" />
            <h2 className="text-sm font-bold text-[#323232] uppercase tracking-wide">
              Your Cart
            </h2>
            <span className="text-[11px] bg-[#FBE4DA] text-[#DF6B3B] px-2 py-0.5 rounded-[2px] font-bold">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-[2px] text-[#666666] hover:text-[#323232] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#666666]">
            <div className="w-16 h-16 bg-[#F8F1EB] rounded-[2px] flex items-center justify-center mb-3">
              <ShoppingCart size={28} className="text-[#DF6B3B]" />
            </div>
            <p className="font-bold text-sm mb-1 text-[#323232]">Your cart is empty</p>
            <p className="text-xs text-[#666666] mb-4">
              Explore our handcrafted wooden furniture & decor
            </p>
            <Link
              to="/shop"
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-[#DF6B3B] hover:text-[#C85A2E] hover:underline"
            >
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[#E0E0E0]">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 pt-3 first:pt-0 bg-white"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-[2px] bg-[#F5F5F5] border border-[#E0E0E0] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#323232] truncate">{item.name}</p>
                  {item.size && (
                    <p className="text-[11px] text-[#666666]">Size: {item.size}</p>
                  )}
                  <p className="text-xs font-bold text-[#323232] mt-0.5">
                    ₹{item.price.toLocaleString("en-IN")}{" "}
                    <span className="text-[10px] text-[#666666] font-normal">
                      × {item.quantity}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-[#999999] hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                  title="Remove item"
                  aria-label="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-[#E0E0E0] bg-[#F8F1EB]/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#666666]">Estimated Subtotal</span>
              <span className="text-base font-bold text-[#323232]">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[10px] text-[#666666]">Taxes and free shipping calculated at checkout</p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="text-center py-2.5 px-3 rounded-[2px] text-xs font-bold border border-[#DF6B3B] bg-white hover:bg-[#FBE4DA] text-[#DF6B3B] transition-all"
              >
                View Full Cart
              </Link>
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="text-center py-2.5 px-3 rounded-[2px] text-xs font-bold bg-[#DF6B3B] hover:bg-[#C85A2E] active:bg-[#A8441F] text-white shadow-xs transition-all"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MiniCart;