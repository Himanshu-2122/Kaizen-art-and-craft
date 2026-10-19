import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useAdminStats from "./hooks/useAdminStats";
import ProductsTable from "./components/ProductsTable";
import CategoriesTable from "./components/CategoriesTable";
import OrdersTable from "./components/OrdersTable";
import UsersTable from "./components/UsersTable";
import {
  Package, ShoppingCart, Users, TrendingUp,
  IndianRupee, LayoutDashboard, RefreshCw, FolderTree,
} from "lucide-react";

type Tab = "products" | "categories" | "orders" | "users";

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
    <div className="bg-white border border-[#dedede] rounded-[4px] p-5 flex items-start gap-4 hover:border-[#ec7744] transition-colors shadow-sm">
      <div
        className="w-12 h-12 rounded-[4px] flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accent}15` }}
      >
        <Icon size={22} style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-[#7d7d7d] uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-[#121212] mt-1 leading-none">{value}</p>
        {sub && <p className="text-xs text-[#7d7d7d] mt-1.5">{sub}</p>}
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
      <div className="w-8 h-8 border-[3px] border-[#ec7744]/20 border-t-[#ec7744] rounded-full animate-spin" />
    </div>
  );
  if (!user || !isAdmin) return (
    <div className="flex items-center justify-center h-64 text-[#7d7d7d] font-semibold">
      Admin access required.
    </div>
  );

  const tabs: { id: Tab; label: string; icon: React.ElementType; count: number | string }[] = [
    { id: "products",   label: "Products",   icon: Package,      count: stats.products },
    { id: "categories", label: "Categories", icon: FolderTree,   count: stats.categories },
    { id: "orders",     label: "Orders",     icon: ShoppingCart, count: stats.orders },
    { id: "users",      label: "Users",      icon: Users,        count: stats.users },
  ];

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-[#fbe4da] flex items-center justify-center text-[#ec7744]">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="font-bold text-[#121212] text-xl md:text-2xl leading-tight">Admin Overview</h1>
            <p className="text-xs text-[#7d7d7d]">Welcome back, {user.fullName.split(" ")[0]}!</p>
          </div>
        </div>
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          className="flex items-center gap-2 text-xs font-semibold text-[#121212] border border-[#dedede] bg-white rounded-[4px]
                     px-3.5 py-2 hover:bg-[#f8f1eb]/50 hover:text-[#ec7744] hover:border-[#ec7744] transition-colors shadow-sm"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.products}
          sub="Active listings"
          accent="#ec7744"
        />
        <StatCard
          icon={FolderTree}
          label="Categories"
          value={stats.categories}
          sub="Store catalogs"
          accent="#b85d19"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={stats.orders}
          sub="All time"
          accent="#121212"
        />
        <StatCard
          icon={Users}
          label="Registered Users"
          value={stats.users}
          sub="Accounts"
          accent="#7d7d7d"
        />
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${(stats.revenue || 0).toLocaleString("en-IN")}`}
          sub="From completed orders"
          accent="#0fb67e"
        />
      </div>

      {/* ── Tab bar ── */}
      <div className="bg-white border border-[#dedede] rounded-[4px] overflow-hidden shadow-sm">

        {/* Tab header */}
        <div className="flex border-b border-[#dedede] px-3 pt-3 gap-2 bg-[#f8f1eb]/30 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-[4px] transition-colors relative whitespace-nowrap
                ${activeTab === id
                  ? "bg-[#ec7744] text-white shadow-sm"
                  : "text-[#7d7d7d] hover:bg-white hover:text-[#121212]"
                }`}
            >
              <Icon size={15} />
              {label}
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-[2px]
                  ${activeTab === id
                    ? "bg-white/25 text-white"
                    : "bg-[#fbe4da] text-[#ec7744]"
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
          {activeTab === "categories" && (
            <CategoriesTable onChange={() => setRefreshKey(k => k + 1)} />
          )}
          {activeTab === "orders" && <OrdersTable />}
          {activeTab === "users"  && <UsersTable />}
        </div>
      </div>

    </div>
  );
}
