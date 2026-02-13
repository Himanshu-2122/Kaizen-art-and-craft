import { Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-6 space-y-6">

        <h2 className="text-xl font-bold">Admin Panel</h2>

        <nav className="space-y-3 text-sm">

          <Link to="/admin" className="flex gap-2 p-2 rounded hover:bg-gray-100">
            <LayoutDashboard size={18}/> Dashboard
          </Link>

          <Link to="/admin/products" className="flex gap-2 p-2 rounded hover:bg-gray-100">
            <Package size={18}/> Products
          </Link>

          <Link to="/admin/orders" className="flex gap-2 p-2 rounded hover:bg-gray-100">
            <ShoppingCart size={18}/> Orders
          </Link>

          <Link to="/admin/users" className="flex gap-2 p-2 rounded hover:bg-gray-100">
            <Users size={18}/> Users
          </Link>

        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
