import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function useAdminStats(refreshKey: number) {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    const load = async () => {
      const [p, o, u] = await Promise.all([
        api.get("/products"),
        api.get("/orders"),
        api.get("/user/users"),
      ]);

      const products =
        Array.isArray(p.data) ? p.data : p.data.products || [];

      const orders =
        Array.isArray(o.data) ? o.data : [];

      const users =
        Array.isArray(u.data) ? u.data : [];

      const revenue = orders.reduce((s: number, x: any) => s + (x.total || 0), 0);

      setStats({
        products: products.length,
        orders: orders.length,
        users: users.length,
        revenue,
      });
    };

    load();
  }, [refreshKey]);

  return stats;
}
