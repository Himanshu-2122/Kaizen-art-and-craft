import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useAdminStats from "./hooks/useAdminStats";
import ProductsTable from "./components/ProductsTable";
import OrdersTable from "./components/OrdersTable";
import UsersTable from "./components/UsersTable";
import {
  Package, ShoppingCart, Users, TrendingUp,
  IndianRupee, LayoutDashboard, RefreshCw,
} from "lucide-react";

type Tab = "products" | "orders" | "users";

/* ── Stat Card ── */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="bg-white border border-[#E8E8E8] p-5 flex items-start gap-4 hover:border-[#FF6E31] transition-colors">
      <div
        className="w-12 h-12 flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accent}18` }}
      >
        <Icon size={22} style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-[#999999] uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-black text-[#212121] mt-0.5 leading-none">{value}</p>
        {sub && <p className="text-xs text-[#666666] mt-1">{sub}</p>}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [refreshKey, setRefreshKey] = useState(0);
  const stats = useAdminStats(refreshKey);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-[3px] border-[#FF6E31]/20 border-t-[#FF6E31] rounded-full animate-spin" />
    </div>
  );
  if (!user || !isAdmin) return (
    <div className="flex items-center justify-center h-64 text-[#666666] font-semibold">
      Admin access required.
    </div>
  );

  const tabs: { id: Tab; label: string; icon: React.ElementType; count: number | string }[] = [
    { id: "products", label: "Products", icon: Package,      count: stats.products },
    { id: "orders",   label: "Orders",   icon: ShoppingCart, count: stats.orders },
    { id: "users",    label: "Users",    icon: Users,        count: stats.users },
  ];

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFF4EE] flex items-center justify-center">
            <LayoutDashboard size={20} className="text-[#FF6E31]" />
          </div>
          <div>
            <h1 className="font-black text-[#212121] text-xl leading-tight">Dashboard</h1>
            <p className="text-xs text-[#666666]">Welcome back, {user.fullName.split(" ")[0]}!</p>
          </div>
        </div>
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          className="flex items-center gap-2 text-xs font-bold text-[#666666] border border-[#E8E8E8]
                     px-3 py-2 hover:bg-[#F5F5F5] hover:text-[#FF6E31] hover:border-[#FF6E31] transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.products}
          sub="Active listings"
          accent="#FF6E31"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={stats.orders}
          sub="All time"
          accent="#212121"
        />
        <StatCard
          icon={Users}
          label="Registered Users"
          value={stats.users}
          sub="Accounts"
          accent="#666666"
        />
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${(stats.revenue || 0).toLocaleString("en-IN")}`}
          sub="From completed orders"
          accent="#16a34a"
        />
      </div>

      {/* ── Tab bar ── */}
      <div className="bg-white border border-[#E8E8E8] overflow-hidden">

        {/* Tab header */}
        <div className="flex border-b border-[#E8E8E8] px-2 pt-2 gap-1">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-colors relative -mb-px
                ${activeTab === id
                  ? "bg-[#FF6E31] text-white"
                  : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#FF6E31]"
                }`}
            >
              <Icon size={15} />
              {label}
              <span
                className={`px-2 py-0.5 text-[10px] font-black
                  ${activeTab === id
                    ? "bg-white/25 text-white"
                    : "bg-[#FFF4EE] text-[#FF6E31]"
                  }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        <div>
          {activeTab === "products" && (
            <ProductsTable onChange={() => setRefreshKey(k => k + 1)} />
          )}
          {activeTab === "orders" && <OrdersTable />}
          {activeTab === "users"  && <UsersTable />}
        </div>
      </div>

    </div>
  );
}
