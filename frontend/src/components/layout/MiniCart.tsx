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
          "fixed right-0 top-0 bottom-0 w-80 sm:w-96 bg-white shadow-lg z-50 flex flex-col border-l border-[#dedede] transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#dedede] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#ec7744]" />
            <h2 className="text-base font-bold text-[#121212]">Your Cart</h2>
            <span className="text-xs bg-[#f8f1eb] text-[#ec7744] px-2 py-0.5 rounded-[4px] font-bold">
              {items.length}
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-[4px] text-[#7d7d7d] hover:text-[#121212] hover:bg-[#f7f7f7] transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#7d7d7d]">
            <div className="w-16 h-16 bg-[#f8f1eb] rounded-[4px] flex items-center justify-center mb-3">
              <ShoppingCart size={28} className="text-[#ec7744]" />
            </div>
            <p className="font-bold text-sm mb-1 text-[#121212]">Your cart is empty</p>
            <p className="text-xs text-[#7d7d7d] mb-4">Discover our handcrafted collections</p>
            <Link
              to="/shop"
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-[#ec7744] hover:underline"
            >
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2.5 rounded-[4px] border border-[#dedede] hover:border-[#ec7744] transition-colors bg-white"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-contain p-1 rounded-[2px] bg-[#f7f7f7] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#121212] truncate">{item.name}</p>
                  {item.size && (
                    <p className="text-[11px] text-[#7d7d7d]">Size: {item.size}</p>
                  )}
                  <p className="text-xs font-bold text-[#121212] mt-0.5">
                    ₹{item.price.toLocaleString("en-IN")}{" "}
                    <span className="text-[10px] text-[#7d7d7d] font-normal">
                      × {item.quantity}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-[#7d7d7d] hover:text-red-500 p-1.5 transition-colors"
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
          <div className="p-4 border-t border-[#dedede] bg-[#f8f1eb]/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#7d7d7d]">Estimated Total</span>
              <span className="text-base font-bold text-[#121212]">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="text-center py-2.5 px-3 rounded-[4px] text-xs font-bold border border-[#ec7744] bg-white hover:bg-[#ec7744] hover:text-white text-[#ec7744] transition-all"
              >
                View Full Cart
              </Link>
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="text-center py-2.5 px-3 rounded-[4px] text-xs font-bold bg-[#ec7744] hover:bg-[#f09269] active:bg-[#8e4729] text-white shadow-sm transition-all"
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