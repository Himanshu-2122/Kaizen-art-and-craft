import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function useAdminStats(refreshKey: number) {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [p, c, o, u] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
          api.get("/orders"),
          api.get("/user/users"),
        ]);

        const products   = Array.isArray(p.data) ? p.data : p.data?.products ?? [];
        const categories = Array.isArray(c.data) ? c.data : c.data?.categories ?? [];
        const orders     = Array.isArray(o.data) ? o.data : [];
        const users      = Array.isArray(u.data) ? u.data : [];
        const revenue    = orders.reduce((s: number, x: { total?: number }) => s + (x.total || 0), 0);

        setStats({
          products: products.length,
          categories: categories.length,
          orders: orders.length,
          users: users.length,
          revenue,
        });
      } catch {
        // silently keep previous stats if request fails (e.g. network error)
      }
    };

    load();
  }, [refreshKey]);

  return stats;
}
