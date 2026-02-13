import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get("/orders").then(r => {
      setOrders(Array.isArray(r.data) ? r.data : []);
    });
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="font-semibold mb-4">Orders</h2>

      {orders.map((o) => (
        <div key={o._id} className="border-b py-2">
          ₹{o.total} — {o.status}
        </div>
      ))}
    </div>
  );
}
