import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, ShoppingCart, User, Search, ChevronDown,
  Menu, X, Loader2, TrendingUp, LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "New Arrivals", href: "/shop" },
  {
    label: "Sofa",
    href: "/shop?category=sofa",
    children: [
      { label: "L-Shape Sofas",    href: "/shop?category=sofa&search=l-shape" },
      { label: "3 Seater Sofas",   href: "/shop?category=sofa&search=3-seater" },
      { label: "2 Seater Sofas",   href: "/shop?category=sofa&search=2-seater" },
      { label: "Sofa Cum Beds",    href: "/shop?category=sofa&search=sofa-cum-bed" },
    ],
  },
  {
    label: "Coffee Table",
    href: "/shop?category=coffee-table",
    children: [
      { label: "Wooden Coffee Tables", href: "/shop?category=coffee-table&search=wooden" },
      { label: "Glass Top Tables",     href: "/shop?category=coffee-table&search=glass" },
      { label: "Nesting Tables",       href: "/shop?category=coffee-table&search=nesting" },
      { label: "Round Coffee Tables",  href: "/shop?category=coffee-table&search=round" },
    ],
  },
  {
    label: "TV Unit",
    href: "/shop?category=tv-unit",
    children: [
      { label: "Floor TV Units",        href: "/shop?category=tv-unit&search=floor" },
      { label: "Wall Mounted Units",    href: "/shop?category=tv-unit&search=wall-mounted" },
      { label: "Entertainment Centers", href: "/shop?category=tv-unit&search=entertainment" },
      { label: "Open Shelf Units",      href: "/shop?category=tv-unit&search=open-shelf" },
    ],
  },
  {
    label: "Dining Set",
    href: "/shop?category=dining-set",
    children: [
      { label: "4 Seater Dining",   href: "/shop?category=dining-set&search=4-seater" },
      { label: "6 Seater Dining",   href: "/shop?category=dining-set&search=6-seater" },
      { label: "Extendable Dining", href: "/shop?category=dining-set&search=extendable" },
      { label: "Dining Chairs",     href: "/shop?category=dining-set&search=chairs" },
    ],
  },
  {
    label: "Chest of Drawers",
    href: "/shop?category=chest-of-drawers",
    children: [
      { label: "3 Drawer Chests",  href: "/shop?category=chest-of-drawers&search=3-drawer" },
      { label: "5 Drawer Chests",  href: "/shop?category=chest-of-drawers&search=5-drawer" },
      { label: "Bedside Chests",   href: "/shop?category=chest-of-drawers&search=bedside" },
      { label: "Tall Boy Chests",  href: "/shop?category=chest-of-drawers&search=tallboy" },
    ],
  },
  {
    label: "Study Table",
    href: "/shop?category=study-table",
    children: [
      { label: "L-Shape Desks",      href: "/shop?category=study-table&search=l-shape" },
      { label: "Foldable Desks",     href: "/shop?category=study-table&search=foldable" },
      { label: "Desk with Shelves",  href: "/shop?category=study-table&search=shelves" },
      { label: "Kids Study Tables",  href: "/shop?category=study-table&search=kids" },
    ],
  },
  {
    label: "Wall Temple",
    href: "/shop?category=wall-temple",
    children: [
      { label: "Single Door Mandir",    href: "/shop?category=wall-temple&search=single-door" },
      { label: "Double Door Mandir",    href: "/shop?category=wall-temple&search=double-door" },
      { label: "Wall Mounted Mandir",   href: "/shop?category=wall-temple&search=wall-mounted" },
      { label: "Floor Standing Mandir", href: "/shop?category=wall-temple&search=floor" },
    ],
  },
  { label: "Shop All", href: "/shop" },
  { label: "About",    href: "/about" },
  { label: "Contact",  href: "/contact" },
];

type NavChild = { label: string; href: string };
type NavItem  = { label: string; href: string; children?: NavChild[] };

function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!item.children) {
    return (
      <Link
        to={item.href}
        className="px-3 py-3 text-[13px] font-medium text-[#212121] hover:text-[#FF6E31]
                   relative group transition-colors whitespace-nowrap"
      >
        {item.label}
        <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#FF6E31]
                         scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        to={item.href}
        className="flex items-center gap-0.5 px-3 py-3 text-[13px] font-medium text-[#212121]
                   hover:text-[#FF6E31] transition-colors whitespace-nowrap group relative"
      >
        {item.label}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#FF6E31]
                         scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </Link>

      {open && (
        <div className="absolute top-full left-0 min-w-[210px] bg-white shadow-xl
                        border-t-2 border-[#FF6E31] z-50 py-1">
          {item.children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              className="block px-5 py-2.5 text-[12.5px] text-[#666666]
                         hover:bg-[#F5F5F5] hover:text-[#FF6E31]
                         border-b border-[#E8E8E8] last:border-0 transition-colors"
            >
              {child.label}
            </Link>
          ))}
          <Link
            to={item.href}
            className="block px-5 py-2.5 text-[12px] font-bold text-[#FF6E31]
                       hover:bg-[#F5F5F5] transition-colors"
          >
            View All →
          </Link>
        </div>
      )}
    </div>
  );
}

interface Suggestion {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
}

function SearchBox({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const [search, setSearch]           = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading]         = useState(false);
  const [open, setOpen]               = useState(false);
  const [noResults, setNoResults]     = useState(false);
  const containerRef  = useRef<HTMLDivElement>(null);
  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]); setNoResults(false); setOpen(false); return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get("/products", { params: { search: query.trim(), limit: 6 } });
        const products: Suggestion[] = res.data?.products ?? res.data ?? [];
        setSuggestions(products);
        setNoResults(products.length === 0);
        setOpen(true);
      } catch {
        setSuggestions([]); setNoResults(true); setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearch(val);
    fetchSuggestions(val);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    setSearch(""); setSuggestions([]); setOpen(false); onClose?.();
  }

  function pickSuggestion(slug: string) {
    navigate(`/product/${slug}`);
    setSearch(""); setSuggestions([]); setOpen(false); onClose?.();
  }

  function viewAll() {
    navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    setSearch(""); setSuggestions([]); setOpen(false); onClose?.();
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-[580px]">
      <form
        onSubmit={handleSubmit}
        className="flex border border-[#E8E8E8] rounded-lg overflow-hidden
                   focus-within:border-[#FF6E31] focus-within:ring-1 focus-within:ring-[#FF6E31] transition-all bg-white"
      >
        <div className="flex items-center pl-4 text-[#999999]">
          <Search size={16} />
        </div>
        <input
          value={search}
          onChange={handleChange}
          onFocus={() => search.trim().length >= 2 && setOpen(true)}
          placeholder="Search for handcrafted products..."
          autoComplete="off"
          className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent
                     text-[#212121] placeholder:text-[#999999]"
        />
        <button
          type="submit"
          className="bg-[#FF6E31] hover:bg-[#E55F20] text-white px-5 text-xs font-bold
                     transition-colors flex items-center gap-1.5"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : "SEARCH"}
        </button>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white
                        shadow-2xl border border-[#E8E8E8] z-[200] overflow-hidden">
          {loading && (
            <div className="flex items-center gap-3 px-5 py-4 text-sm text-[#666666]">
              <Loader2 size={15} className="animate-spin text-[#FF6E31]" />
              Searching for "{search}"…
            </div>
          )}
          {!loading && noResults && (
            <div className="px-5 py-6 text-center">
              <Search size={28} className="mx-auto text-[#E8E8E8] mb-2" />
              <p className="text-sm text-[#666666]">No results for <strong>"{search}"</strong></p>
              <button
                onClick={viewAll}
                className="mt-3 text-xs bg-[#FF6E31]/10 text-[#FF6E31] font-semibold
                           px-4 py-1.5 hover:bg-[#FF6E31]/20 transition-colors"
              >
                Browse all products
              </button>
            </div>
          )}
          {!loading && suggestions.length > 0 && (
            <>
              <div className="px-4 py-2 border-b border-[#E8E8E8] flex items-center gap-1.5">
                <TrendingUp size={12} className="text-[#FF6E31]" />
                <span className="text-[11px] font-bold text-[#999999] uppercase tracking-wider">
                  Results for "{search}"
                </span>
              </div>
              <ul>
                {suggestions.map((p) => (
                  <li key={p._id}>
                    <button
                      onClick={() => pickSuggestion(p.slug)}
                      className="w-full flex items-center gap-3 px-4 py-2.5
                                 hover:bg-[#F5F5F5] transition-colors text-left
                                 border-b border-[#E8E8E8] last:border-0"
                    >
                      <div className="w-9 h-9 overflow-hidden bg-[#F5F5F5] shrink-0">
                        {p.images?.length > 0 ? (
                          <img src={getImageUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Search size={12} className="text-[#999999]" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[#212121] truncate">{p.name}</p>
                        <p className="text-xs text-[#999999] capitalize">{p.category}</p>
                      </div>
                      <span className="text-sm font-bold text-[#FF6E31] shrink-0">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={viewAll}
                className="w-full py-3 text-center text-[12px] font-bold text-[#FF6E31]
                           hover:bg-[#F5F5F5] transition-colors border-t border-[#E8E8E8]"
              >
                View all results for "{search}" →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function MainNavbar() {
  const { user, isAdmin }    = useAuth();
  const { items, itemCount } = useCart();
  const { wishlistCount }    = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = itemCount ?? 0;
  const cartTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* ── ROW 2: Logo / Search / Icons ── */}
      <div className="border-b border-[#E8E8E8]">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-6">
          {/* Logo — negative margin compensates for PNG's built-in whitespace */}
          <Link to="/" className="shrink-0 flex items-center -my-3">
            <img
              src="/kaizenlogo.png"
              alt="Kaizen Art & Craft"
              className="h-24 w-auto object-contain"
              draggable={false}
            />
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 justify-center">
            <SearchBox />
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-4 shrink-0 ml-auto">
            {/* Wishlist */}
            <Link to="/wishlist" className="flex flex-col items-center gap-0.5 text-[10px] font-medium
                                            text-[#666666] hover:text-[#FF6E31] transition-colors group">
              <div className="relative">
                <Heart size={20} className="group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF6E31] text-white text-[9px]
                                   w-[15px] h-[15px] rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span>Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex flex-col items-center gap-0.5 text-[10px] font-medium
                                        text-[#666666] hover:text-[#FF6E31] transition-colors group">
              <div className="relative">
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF6E31] text-white text-[9px]
                                   w-[15px] h-[15px] rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>₹{cartTotal.toLocaleString("en-IN")}</span>
            </Link>

            {/* Profile */}
            <Link to={user ? "/profile" : "/auth"}
                  className="hidden sm:flex flex-col items-center gap-0.5 text-[10px] font-medium
                             text-[#666666] hover:text-[#FF6E31] transition-colors group">
              <User size={20} className="group-hover:scale-110 transition-transform" />
              <span>{user ? user.fullName.split(" ")[0] : "Login"}</span>
            </Link>

            {/* Admin */}
            {isAdmin && (
              <Link to="/admin"
                    className="hidden sm:flex flex-col items-center gap-0.5 text-[10px] font-bold
                               text-white bg-[#FF6E31] hover:bg-[#E55F20] px-2.5 py-1 transition-colors group">
                <LayoutDashboard size={16} className="group-hover:scale-110 transition-transform" />
                <span>Admin</span>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button className="md:hidden text-[#212121]" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Category Nav ── */}
      <nav className="border-b border-[#E8E8E8] hidden md:flex max-w-[1400px] mx-auto px-4 overflow-x-auto">
        {(navItems as NavItem[]).map((item) => (
          <NavDropdown key={item.label} item={item} />
        ))}
      </nav>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E8E8E8] bg-white max-h-[70vh] overflow-y-auto">
          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-[#E8E8E8]">
            <SearchBox onClose={() => setMobileOpen(false)} />
          </div>

          {isAdmin && (
            <Link to="/admin" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-5 py-3.5 text-sm font-bold
                             text-white bg-[#FF6E31] hover:bg-[#E55F20] transition-colors">
              <LayoutDashboard size={16} /> Admin Panel
            </Link>
          )}

          {navItems.map((item) => (
            <div key={item.label}>
              <Link to={item.href} onClick={() => setMobileOpen(false)}
                    className="block px-5 py-3 text-sm font-medium text-[#212121]
                               border-b border-[#E8E8E8] hover:text-[#FF6E31] hover:bg-[#F5F5F5]">
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link key={child.href} to={child.href} onClick={() => setMobileOpen(false)}
                      className="block px-10 py-2 text-xs text-[#666666]
                                 border-b border-[#E8E8E8] hover:text-[#FF6E31] hover:bg-[#F5F5F5]">
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
