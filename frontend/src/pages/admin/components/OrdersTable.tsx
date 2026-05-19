import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Order {
  _id: string;
  userId?: { fullName?: string; email?: string };
  items?: unknown[];
  total?: number;
  status: string;
}

const STATUS_OPTIONS = ["pending", "completed", "cancelled"] as const;
type OrderStatus = typeof STATUS_OPTIONS[number];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:   "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function OrdersTable() {
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    api.get("/orders")
      .then((r) => setOrders(Array.isArray(r.data) ? r.data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  async function changeStatus(orderId: string, status: OrderStatus) {
    setUpdating(orderId);
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: res.data.status } : o))
      );
      toast.success(`Order marked as ${status}`);
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E8E8E8]">
        <div className="w-8 h-8 bg-[#FFF4EE] flex items-center justify-center">
          <ShoppingCart size={16} className="text-[#FF6E31]" />
        </div>
        <h2 className="font-black text-[#212121] text-base">Orders</h2>
        <span className="ml-auto text-xs text-[#666666]">{orders.length} total</span>
      </div>

      {loading ? (
        <div className="p-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-[#F5F5F5] animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center">
          <ShoppingCart size={36} className="text-[#E8E8E8] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#666666]">No orders yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F5F5] text-left">
              <tr>
                <th className="px-5 py-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Order ID</th>
                <th className="px-5 py-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Customer</th>
                <th className="px-5 py-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Items</th>
                <th className="px-5 py-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Total</th>
                <th className="px-5 py-3 text-[#666666] font-bold text-xs uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const status = (o.status ?? "pending") as OrderStatus;
                const isUpdating = updating === o._id;

                return (
                  <tr key={o._id} className="border-t border-[#E8E8E8] hover:bg-[#F5F5F5] transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-[#666666]">
                      #{o._id?.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3 text-[#212121] font-semibold">
                      {o.userId?.fullName || o.userId?.email || "—"}
                    </td>
                    <td className="px-5 py-3 text-[#666666]">{o.items?.length ?? 0} item(s)</td>
                    <td className="px-5 py-3 font-black text-[#212121]">
                      ₹{(o.total || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {isUpdating ? (
                          <Loader2 size={14} className="animate-spin text-[#FF6E31]" />
                        ) : (
                          <select
                            value={status}
                            onChange={(e) => changeStatus(o._id, e.target.value as OrderStatus)}
                            className={`text-xs font-bold px-2.5 py-1 border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF6E31] ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
