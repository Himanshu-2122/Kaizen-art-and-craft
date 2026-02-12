import { Link } from "react-router-dom";
import { Search, Heart, User, ShoppingCart, Menu, X } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
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
  const { itemCount } = useCart();
  const { user, isAdmin } = useAuth();

  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between gap-6 h-20 px-4">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo2.png"
              alt="Kaizen Art and Craft Logo"
              className="h-20 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Center Links (Desktop) */}
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

        {/* Search */}
        <div className="hidden md:block flex-1 max-w-xl relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search furniture, decor, sofa..."
            className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2.5 outline-none focus:bg-gray-200 transition"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-gray-700">
          <Link
            to={user ? "/profile" : "/auth"}
            className="hover:text-[#E67235]"
          >
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

          {/* Mobile Menu Button */}
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

      {/* Mobile Nav */}
      {open && (
        <div className="lg:hidden border-t bg-white">
          <nav className="flex flex-col p-4 gap-4 text-sm">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-gray-700 hover:text-[#E67235]"
              >
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="text-[#E67235] font-semibold"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
