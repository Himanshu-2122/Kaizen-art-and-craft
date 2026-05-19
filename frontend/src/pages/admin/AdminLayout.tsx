import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft } from "lucide-react";

const navItems = [
  { to: "/admin",          label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products",  icon: Package },
  { to: "/admin/orders",   label: "Orders",    icon: ShoppingCart },
  { to: "/admin/users",    label: "Users",     icon: Users },
];

export default function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#212121] flex flex-col shrink-0">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-white font-black text-lg leading-tight">
            Kaizen <span className="text-[#FF6E31]">Admin</span>
          </p>
          <p className="text-white/40 text-xs mt-0.5">Management Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[#FF6E31] text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
