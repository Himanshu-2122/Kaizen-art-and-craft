import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft, FolderTree } from "lucide-react";

const navItems = [
  { to: "/admin",            label: "Dashboard",  icon: LayoutDashboard, exact: true },
  { to: "/admin/products",   label: "Products",   icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/orders",     label: "Orders",     icon: ShoppingCart },
  { to: "/admin/users",      label: "Users",      icon: Users },
];

export default function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#121212] border-r border-[#dedede]/10 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
          <img
            src="/kaizenlogo.png"
            alt="Kaizen"
            className="w-9 h-9 object-contain rounded-[4px] bg-white/10 p-1"
          />
          <div>
            <p className="text-white font-bold text-base leading-tight">
              Kaizen <span className="text-[#ec7744]">Admin</span>
            </p>
            <p className="text-white/50 text-[11px] mt-0.5">Management Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, exact }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-[4px] transition-colors ${
                  active
                    ? "bg-[#ec7744] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white transition-colors"
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
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-[4px] transition-colors"
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