import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useAdminStats from "./hooks/useAdminStats";
import DashboardCards from "./components/DashboardCards";
import ProductsTable from "./components/ProductsTable";
import OrdersTable from "./components/OrdersTable";
import UsersTable from "./components/UsersTable";

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();

  const [refreshKey, setRefreshKey] = useState(0);
  const stats = useAdminStats(refreshKey);

  if (loading) return null;
  if (!user) return <div>Login required</div>;
  if (!isAdmin) return <div>Admin only access</div>;

  return (
    <div className="space-y-8">

      <DashboardCards stats={stats} />

      <ProductsTable onChange={() => setRefreshKey(k => k + 1)} />
      <OrdersTable />
      <UsersTable />

    </div>
  );
}
