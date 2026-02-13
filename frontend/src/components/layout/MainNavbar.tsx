import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, User, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function MainNavbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, isAdmin } = useAuth();

  /* =============================
     SEARCH HANDLER (shared logic)
  ============================= */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/shop?search=${encodeURIComponent(search)}`);

    setSearch("");
    setOpen(false); // mobile drawer close
  };

  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between gap-6 h-20 px-4">
        {/* ================= LOGO ================= */}
        <div className="flex-1">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo2.png"
              alt="Kaizen Art and Craft Logo"
              className="h-20 w-auto object-contain"
            />
          </Link>
        </div>

        {/* ================= DESKTOP LINKS ================= */}
        <nav className="hidden lg:flex flex-1 justify-center gap-8 text-sm font-medium">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-gray-600 hover:text-[#E67235] transition"
            >
              {l.label}
            </Link>
          ))}

          {isAdmin && (
            <Link to="/admin" className="text-[#E67235] font-semibold">
              Admin
            </Link>
          )}
        </nav>

        {/* ================= DESKTOP SEARCH ================= */}
        <div className="hidden md:block flex-1 max-w-xl relative">
          <form onSubmit={handleSearch}>
            <Search
              size={18}
              onClick={handleSearch}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search furniture, decor, sofa..."
              className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2.5 outline-none focus:bg-gray-200 transition"
            />
          </form>
        </div>

        {/* ================= ICONS ================= */}
        <div className="flex items-center gap-6 text-gray-700">
          <Link to={user ? "/profile" : "/auth"} className="hover:text-[#E67235]">
            <User size={20} />
          </Link>

          <Link to="/wishlist" className="hover:text-[#E67235]">
            <Heart size={20} />
          </Link>

          <Link to="/cart" className="relative hover:text-[#E67235]">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E67235] text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* drawer */}
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-6 flex flex-col animate-slideIn">
            {/* header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <X
                size={22}
                className="cursor-pointer text-gray-600"
                onClick={() => setOpen(false)}
              />
            </div>

            {/* mobile search */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <Search
                size={16}
                onClick={handleSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-100 rounded-lg pl-9 pr-3 py-2 outline-none focus:bg-gray-200 transition"
              />
            </form>

            {/* links */}
            <nav className="flex flex-col gap-2 text-sm">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  {l.label}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg bg-[#E67235]/10 text-[#E67235] font-semibold"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
