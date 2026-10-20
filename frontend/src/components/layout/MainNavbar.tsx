import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  Menu,
  X,
  Loader2,
  TrendingUp,
  LayoutDashboard,
  MapPin,
  Phone,
  Truck,
  HelpCircle,
  Gift,
  LogOut,
  Package,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { MegaMenu, MegaMenuItem } from "@/components/layout/MegaMenu";
import { MiniCart } from "@/components/layout/MiniCart";
import { useCategories } from "@/hooks/useCategories";

// ── Default Curated Kaizen Livings Category Mega Menus ──
const UL_CATEGORY_DETAILS: Record<
  string,
  {
    columns: { title: string; items: { label: string; href: string; isNew?: boolean }[] }[];
    featured: { title: string; subtitle?: string; image: string; href: string; badge?: string };
  }
> = {
  "sofas": {
    columns: [
      {
        title: "By Seating",
        items: [
          { label: "3 Seater Sofas", href: "/shop?category=sofas&search=3+seater", isNew: true },
          { label: "2 Seater Sofas", href: "/shop?category=sofas&search=2+seater" },
          { label: "Chesterfield Lounges", href: "/shop?category=sofas&search=chesterfield" },
          { label: "Wooden Accent Sofas", href: "/shop?category=sofas&search=wood" },
        ],
      },
      {
        title: "By Material",
        items: [
          { label: "Velvet Upholstery", href: "/shop?category=sofas&materials=Velvet" },
          { label: "Solid Sheesham Wood", href: "/shop?category=sofas&materials=Sheesham+Wood" },
          { label: "Textured Fabric", href: "/shop?category=sofas&materials=Fabric" },
        ],
      },
      {
        title: "By Finish",
        items: [
          { label: "Walnut Polish", href: "/shop?category=sofas&finishes=Walnut" },
          { label: "Honey Finish", href: "/shop?category=sofas&finishes=Honey+Polish" },
          { label: "Natural Teak", href: "/shop?category=sofas&finishes=Natural" },
        ],
      },
    ],
    featured: {
      title: "Royale Velvet Lounges",
      subtitle: "Sumptuous 3-Seater Comfort",
      image: "/images/categories/sofas.jpg",
      href: "/shop?category=sofas",
      badge: "BESTSELLER",
    },
  },
  "beds": {
    columns: [
      {
        title: "By Size",
        items: [
          { label: "King Size Beds", href: "/shop?category=beds&search=king", isNew: true },
          { label: "Queen Size Beds", href: "/shop?category=beds&search=queen" },
          { label: "Platform Beds", href: "/shop?category=beds&search=platform" },
          { label: "Solid Wood Slatted Beds", href: "/shop?category=beds&search=slat" },
        ],
      },
      {
        title: "By Material",
        items: [
          { label: "Solid Teak Wood", href: "/shop?category=beds&materials=Teak+Wood" },
          { label: "Sheesham Timber", href: "/shop?category=beds&materials=Sheesham+Wood" },
          { label: "Mango Wood", href: "/shop?category=beds&materials=Mango+Wood" },
        ],
      },
      {
        title: "By Style",
        items: [
          { label: "Japanese Low Profile", href: "/shop?category=beds" },
          { label: "Heritage Carved Headboard", href: "/shop?category=beds" },
          { label: "Modern Upholstered Headboard", href: "/shop?category=beds" },
        ],
      },
    ],
    featured: {
      title: "Master Bedroom Teak Beds",
      subtitle: "Kiln-Dried Seasoned Timber",
      image: "/images/categories/beds.jpg",
      href: "/shop?category=beds",
      badge: "FEATURED",
    },
  },
  "dining": {
    columns: [
      {
        title: "Dining Sets",
        items: [
          { label: "6 Seater Dining Sets", href: "/shop?category=dining&search=6", isNew: true },
          { label: "4 Seater Dining Sets", href: "/shop?category=dining&search=4" },
          { label: "Composite Marble Tables", href: "/shop?category=dining&search=marble" },
          { label: "Solid Wood Slab Tables", href: "/shop?category=dining&search=slab" },
        ],
      },
      {
        title: "Tables & Benches",
        items: [
          { label: "Extendable Dining Tables", href: "/shop?category=dining&search=extendable" },
          { label: "Solid Dining Benches", href: "/shop?category=dining&search=bench" },
          { label: "Round Breakfast Tables", href: "/shop?category=dining&search=round" },
        ],
      },
      {
        title: "Finishes",
        items: [
          { label: "Natural Live-Edge", href: "/shop?category=dining" },
          { label: "Warm Walnut Satin", href: "/shop?category=dining" },
          { label: "Honey Teak Gloss", href: "/shop?category=dining" },
        ],
      },
    ],
    featured: {
      title: "Walnut Live-Edge Slab",
      subtitle: "Natural Organic Grain Table",
      image: "/images/categories/dining.jpg",
      href: "/shop?category=dining",
      badge: "NEW ARRIVAL",
    },
  },
  "coffee-tables": {
    columns: [
      {
        title: "Center Tables",
        items: [
          { label: "Round Coffee Tables", href: "/shop?category=coffee-tables&search=round", isNew: true },
          { label: "Nesting Tables (Set of 2)", href: "/shop?category=coffee-tables&search=nesting" },
          { label: "Mid-Century Modern Tables", href: "/shop?category=coffee-tables&search=century" },
          { label: "Foldable Scandi Tables", href: "/shop?category=coffee-tables&search=foldable" },
        ],
      },
      {
        title: "By Material",
        items: [
          { label: "Solid Oak & Teak", href: "/shop?category=coffee-tables" },
          { label: "Ceramic Fluted Pedestal", href: "/shop?category=coffee-tables" },
          { label: "Sheesham with Storage", href: "/shop?category=coffee-tables" },
        ],
      },
      {
        title: "Living Room Accents",
        items: [
          { label: "Side & End Tables", href: "/shop?category=coffee-tables" },
          { label: "Magazine Shelf Tables", href: "/shop?category=coffee-tables" },
          { label: "Minimalist Pedestals", href: "/shop?category=coffee-tables" },
        ],
      },
    ],
    featured: {
      title: "Asher Round Oak Table",
      subtitle: "Tapered Mid-Century Legs",
      image: "/images/categories/coffee-tables.jpg",
      href: "/shop?category=coffee-tables",
      badge: "POPULAR",
    },
  },
  "chairs": {
    columns: [
      {
        title: "Chairs & Seating",
        items: [
          { label: "Dining Chairs (Pairs)", href: "/shop?category=chairs&search=dining", isNew: true },
          { label: "Ergonomic Wood Chairs", href: "/shop?category=chairs&search=ergonomic" },
          { label: "Accent Lounge Armchairs", href: "/shop?category=chairs&search=lounge" },
          { label: "Windsor Farmhouse Chairs", href: "/shop?category=chairs&search=windsor" },
        ],
      },
      {
        title: "By Material",
        items: [
          { label: "Solid Teak Wood", href: "/shop?category=chairs&materials=Teak+Wood" },
          { label: "Upholstered Linen", href: "/shop?category=chairs&materials=Fabric" },
          { label: "Brass Accents", href: "/shop?category=chairs&materials=Brass" },
        ],
      },
      {
        title: "Comfort Features",
        items: [
          { label: "Sculpted Lumbar Back", href: "/shop?category=chairs" },
          { label: "High Density Foam Seats", href: "/shop?category=chairs" },
          { label: "Stain Resistant Fabric", href: "/shop?category=chairs" },
        ],
      },
    ],
    featured: {
      title: "Bishop Fabric Dining Chairs",
      subtitle: "Comfort Meets Craftsmanship",
      image: "/images/categories/chairs.jpg",
      href: "/shop?category=chairs",
      badge: "TOP PICK",
    },
  },
  "tv-units": {
    columns: [
      {
        title: "Entertainment Consoles",
        items: [
          { label: "Up to 75\" TV Stands", href: "/shop?category=tv-units&search=75", isNew: true },
          { label: "Wall Mounted Floating Units", href: "/shop?category=tv-units&search=mounted" },
          { label: "Fluted Wood Facade Consoles", href: "/shop?category=tv-units&search=fluted" },
          { label: "Sliding Door Media Centers", href: "/shop?category=tv-units&search=sliding" },
        ],
      },
      {
        title: "Features",
        items: [
          { label: "Concealed Cable Ports", href: "/shop?category=tv-units" },
          { label: "Soundbar Open Shelf", href: "/shop?category=tv-units" },
          { label: "Soft Close Hardware", href: "/shop?category=tv-units" },
        ],
      },
      {
        title: "Finishes",
        items: [
          { label: "Dark Walnut Teak", href: "/shop?category=tv-units" },
          { label: "Warm Honey Gloss", href: "/shop?category=tv-units" },
          { label: "Matte Black & Wood", href: "/shop?category=tv-units" },
        ],
      },
    ],
    featured: {
      title: "Bme Jasper Media Unit",
      subtitle: "Sliding Slatted Doors",
      image: "/images/categories/tv-units.jpg",
      href: "/shop?category=tv-units",
      badge: "MUST HAVE",
    },
  },
  "bookshelves": {
    columns: [
      {
        title: "Display & Storage",
        items: [
          { label: "Glass Door Curio Cabinets", href: "/shop?category=bookshelves&search=glass", isNew: true },
          { label: "Arched Sculptural Shelves", href: "/shop?category=bookshelves&search=arched" },
          { label: "5-Tier Open Book Racks", href: "/shop?category=bookshelves&search=tier" },
          { label: "Asymmetrical Room Dividers", href: "/shop?category=bookshelves&search=divider" },
        ],
      },
      {
        title: "By Material",
        items: [
          { label: "Solid Sheesham Wood", href: "/shop?category=bookshelves" },
          { label: "Brazilian Pau Ferro", href: "/shop?category=bookshelves" },
          { label: "Tempered Safety Glass", href: "/shop?category=bookshelves" },
        ],
      },
      {
        title: "By Space",
        items: [
          { label: "Home Study & Library", href: "/shop?category=bookshelves" },
          { label: "Living Room Showpiece", href: "/shop?category=bookshelves" },
          { label: "Corner Display Storage", href: "/shop?category=bookshelves" },
        ],
      },
    ],
    featured: {
      title: "Mason Curio Glass Cabinet",
      subtitle: "Brass Hardware Accents",
      image: "/images/categories/bookshelves.jpg",
      href: "/shop?category=bookshelves",
      badge: "FEATURED",
    },
  },
  "chest-of-drawers": {
    columns: [
      {
        title: "Chest of Drawers",
        items: [
          { label: "6 Drawer Wide Dressers", href: "/shop?category=chest-of-drawers&search=6", isNew: true },
          { label: "5 Drawer Tall Towers", href: "/shop?category=chest-of-drawers&search=5" },
          { label: "Vintage Sideboard Cabinets", href: "/shop?category=chest-of-drawers&search=vintage" },
          { label: "Fluted Facade Credenzas", href: "/shop?category=chest-of-drawers&search=fluted" },
        ],
      },
      {
        title: "Features",
        items: [
          { label: "Dovetail Wood Joinery", href: "/shop?category=chest-of-drawers" },
          { label: "Smooth Telescopic Runners", href: "/shop?category=chest-of-drawers" },
          { label: "Antique Brass Cup Handles", href: "/shop?category=chest-of-drawers" },
        ],
      },
      {
        title: "Finishes",
        items: [
          { label: "Cherry Wood Polish", href: "/shop?category=chest-of-drawers" },
          { label: "Teak Antique Relief", href: "/shop?category=chest-of-drawers" },
          { label: "Warm Honey Wax", href: "/shop?category=chest-of-drawers" },
        ],
      },
    ],
    featured: {
      title: "Cherry Wood 6-Drawer Chest",
      subtitle: "Deep Storage with Dovetail Joints",
      image: "/images/categories/chest-of-drawers.jpg",
      href: "/shop?category=chest-of-drawers",
      badge: "BEST VALUE",
    },
  },
  "dressing-tables": {
    columns: [
      {
        title: "Vanities & Mirrors",
        items: [
          { label: "Modern Vanity with Mirror", href: "/shop?category=dressing-tables&search=mirror", isNew: true },
          { label: "Full Length Almari Vanities", href: "/shop?category=dressing-tables&search=wardrobe" },
          { label: "Compact Vanity with Stool", href: "/shop?category=dressing-tables&search=stool" },
          { label: "Royal Carved Arch Dressing", href: "/shop?category=dressing-tables&search=carved" },
        ],
      },
      {
        title: "Features",
        items: [
          { label: "High-Definition Mirrors", href: "/shop?category=dressing-tables" },
          { label: "Hidden Jewelry Trays", href: "/shop?category=dressing-tables" },
          { label: "Cosmetic Glide Drawers", href: "/shop?category=dressing-tables" },
        ],
      },
      {
        title: "Finishes",
        items: [
          { label: "Natural Golden Teak", href: "/shop?category=dressing-tables" },
          { label: "Rich Dark Walnut", href: "/shop?category=dressing-tables" },
          { label: "Antique Heritage Brass", href: "/shop?category=dressing-tables" },
        ],
      },
    ],
    featured: {
      title: "Modern Wooden Vanity",
      subtitle: "Includes Beveled Mirror & Stool",
      image: "/images/categories/dressing-tables.jpg",
      href: "/shop?category=dressing-tables",
      badge: "ELEGANT",
    },
  },
};


// ── Search Suggestion Interface ──
interface Suggestion {
  _id: string;
  name: string;
  slug: string;
  price: number;
  mrpPrice?: number;
  images: string[];
  category: string;
}

// ── SearchBox Component (1:1 with Kaizen Livings search bar) ──
function SearchBox({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      setNoResults(false);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get("/products", {
          params: { search: query.trim(), limit: 6 },
        });
        const products: Suggestion[] = res.data?.products ?? res.data ?? [];
        setSuggestions(products);
        setNoResults(products.length === 0);
        setOpen(true);
      } catch {
        setSuggestions([]);
        setNoResults(true);
        setOpen(true);
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
    setSearch("");
    setSuggestions([]);
    setOpen(false);
    onClose?.();
  }

  function pickSuggestion(slug: string) {
    navigate(`/product/${slug}`);
    setSearch("");
    setSuggestions([]);
    setOpen(false);
    onClose?.();
  }

  function viewAll() {
    navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
    setSuggestions([]);
    setOpen(false);
    onClose?.();
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-[560px] w-full">
      <form
        onSubmit={handleSubmit}
        className="flex items-center border border-[#E0E0E0] rounded-[2px] bg-[#FFFFFF] focus-within:border-[#DF6B3B] focus-within:ring-1 focus-within:ring-[#DF6B3B] transition-all overflow-hidden"
      >
        <div className="pl-3.5 pr-1 text-[#666666] flex items-center justify-center">
          <Search size={16} className="stroke-[2.2]" />
        </div>
        <input
          value={search}
          onChange={handleChange}
          onFocus={() => search.trim().length >= 2 && setOpen(true)}
          placeholder="Search for sofas, beds, dining sets, coffee tables, chairs..."
          autoComplete="off"
          className="flex-1 px-3 py-2 text-[13px] outline-none bg-transparent text-[#323232] placeholder:text-[#999999]"
        />
        <button
          type="submit"
          className="bg-[#DF6B3B] hover:bg-[#C85A2E] active:bg-[#A8441F] text-white px-5 py-2 text-[12px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 shrink-0"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : "SEARCH"}
        </button>
      </form>

      {/* Auto-suggest dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white shadow-mega border border-[#E0E0E0] rounded-[2px] z-[200] overflow-hidden">
          {loading && (
            <div className="flex items-center gap-3 px-5 py-4 text-xs text-[#666666]">
              <Loader2 size={15} className="animate-spin text-[#DF6B3B]" />
              Searching products for "{search}"…
            </div>
          )}

          {!loading && noResults && (
            <div className="px-5 py-6 text-center">
              <Search size={24} className="mx-auto text-[#E0E0E0] mb-2" />
              <p className="text-xs text-[#666666]">
                No exact matches found for <strong>"{search}"</strong>
              </p>
              <button
                onClick={viewAll}
                className="mt-3 text-xs bg-[#FBE4DA] text-[#DF6B3B] font-bold px-4 py-1.5 rounded-[2px] hover:bg-[#DF6B3B] hover:text-white transition-colors"
              >
                Browse all products
              </button>
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <>
              <div className="px-4 py-2 border-b border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp size={12} className="text-[#DF6B3B]" />
                  Matching Furniture & Decor
                </span>
                <span className="text-[10px] text-[#999999]">{suggestions.length} items</span>
              </div>
              <ul className="divide-y divide-[#E0E0E0] max-h-[360px] overflow-y-auto">
                {suggestions.map((p) => (
                  <li key={p._id}>
                    <button
                      onClick={() => pickSuggestion(p.slug)}
                      className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-[#F8F1EB]/50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 overflow-hidden rounded-[2px] bg-[#F5F5F5] shrink-0 border border-[#E0E0E0]">
                        {p.images && p.images.length > 0 ? (
                          <img
                            src={getImageUrl(p.images[0])}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Search size={14} className="text-[#999999]" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[#323232] truncate">{p.name}</p>
                        <p className="text-[11px] text-[#999999] capitalize">{p.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[13px] font-bold text-[#323232]">
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                        {p.mrpPrice && p.mrpPrice > p.price && (
                          <p className="text-[10px] text-[#999999] line-through">
                            ₹{p.mrpPrice.toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={viewAll}
                className="w-full py-2.5 text-center text-xs font-bold text-[#DF6B3B] hover:bg-[#F8F1EB] transition-colors border-t border-[#E0E0E0]"
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

// ── MainNavbar Component (1:1 Visual Clone of Kaizen Livings) ──
export default function MainNavbar() {
  const { user, isAdmin, logout } = useAuth();
  const { items, itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useCategories();

  // Close profile dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Build Kaizen Livings Mega Menu Items
  const navItems = useMemo<MegaMenuItem[]>(() => {
    const defaultNavs: MegaMenuItem[] = [
      {
        label: "Sofas",
        href: "/shop?category=sofas",
        columns: UL_CATEGORY_DETAILS["sofas"].columns,
        featured: UL_CATEGORY_DETAILS["sofas"].featured,
      },
      {
        label: "Beds",
        href: "/shop?category=beds",
        columns: UL_CATEGORY_DETAILS["beds"].columns,
        featured: UL_CATEGORY_DETAILS["beds"].featured,
      },
      {
        label: "Dining",
        href: "/shop?category=dining",
        columns: UL_CATEGORY_DETAILS["dining"].columns,
        featured: UL_CATEGORY_DETAILS["dining"].featured,
      },
      {
        label: "Coffee Tables",
        href: "/shop?category=coffee-tables",
        columns: UL_CATEGORY_DETAILS["coffee-tables"].columns,
        featured: UL_CATEGORY_DETAILS["coffee-tables"].featured,
      },
      {
        label: "Chairs",
        href: "/shop?category=chairs",
        columns: UL_CATEGORY_DETAILS["chairs"].columns,
        featured: UL_CATEGORY_DETAILS["chairs"].featured,
      },
      {
        label: "TV Units",
        href: "/shop?category=tv-units",
        columns: UL_CATEGORY_DETAILS["tv-units"].columns,
        featured: UL_CATEGORY_DETAILS["tv-units"].featured,
      },
      {
        label: "Bookshelves",
        href: "/shop?category=bookshelves",
        columns: UL_CATEGORY_DETAILS["bookshelves"].columns,
        featured: UL_CATEGORY_DETAILS["bookshelves"].featured,
      },
      {
        label: "Chest of Drawers",
        href: "/shop?category=chest-of-drawers",
        columns: UL_CATEGORY_DETAILS["chest-of-drawers"].columns,
        featured: UL_CATEGORY_DETAILS["chest-of-drawers"].featured,
      },
      {
        label: "Dressing Tables",
        href: "/shop?category=dressing-tables",
        columns: UL_CATEGORY_DETAILS["dressing-tables"].columns,
        featured: UL_CATEGORY_DETAILS["dressing-tables"].featured,
      },

      {
        label: "Living Furniture",
        href: "/shop",
        columns: [
          {
            title: "Seating",
            items: [
              { label: "Wooden Accent Chairs", href: "/shop?search=chair" },
              { label: "Low Seating & Benches", href: "/shop?search=bench" },
              { label: "Lounge Chairs", href: "/shop?search=lounge" },
            ],
          },
          {
            title: "Tables",
            items: [
              { label: "Coffee Tables", href: "/shop?search=table" },
              { label: "Side & End Tables", href: "/shop?search=table" },
              { label: "Console Tables", href: "/shop?search=console" },
            ],
          },
          {
            title: "Storage Units",
            items: [
              { label: "TV Entertainment Units", href: "/shop?search=tv" },
              { label: "Bookshelves & Cases", href: "/shop?search=shelf" },
              { label: "Shoe Racks", href: "/shop?search=rack" },
            ],
          },
        ],
        featured: {
          title: "Solid Wood Living",
          subtitle: "Artisan Living Room Range",
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
          href: "/shop",
          badge: "POPULAR",
        },
      },
      {
        label: "Collections",
        href: "/collections",
        columns: [
          {
            title: "Featured Collections",
            items: [
              { label: "Heritage Sheesham Wood", href: "/collections" },
              { label: "Royal Rajasthani Handpainted", href: "/collections" },
              { label: "Jaipur Traditional Blue Pottery", href: "/collections" },
              { label: "Handloom Weaves of India", href: "/collections" },
            ],
          },
        ],
      },
      {
        label: "Deal Zone",
        href: "/shop",
        isHighlight: true,
        columns: [
          {
            title: "Top Offers",
            items: [
              { label: "Under ₹1,999 Best Buys", href: "/shop" },
              { label: "Festive Season Specials", href: "/shop", isNew: true },
              { label: "Clearance Wooden Racks", href: "/shop" },
              { label: "Artisan Handicrafts on Sale", href: "/shop" },
            ],
          },
        ],
      },
    ];

    // If backend returns dynamic categories, merge them cleanly
    if (categories && categories.length > 0) {
      const activeCats = categories.filter((c) => c.isActive !== false);
      const mappedCats: MegaMenuItem[] = activeCats.map((c) => {
        const curated = UL_CATEGORY_DETAILS[c.slug];
        if (curated) {
          return {
            label: c.name,
            href: `/shop?category=${c.slug}`,
            columns: curated.columns,
            featured: curated.featured,
          };
        }
        return {
          label: c.name,
          href: `/shop?category=${c.slug}`,
          children: [
            { label: `All ${c.name}`, href: `/shop?category=${c.slug}` },
            { label: `New in ${c.name}`, href: `/shop?category=${c.slug}` },
          ],
        };
      });

      // Append Collections and Deal Zone
      return [
        ...mappedCats,
        { label: "Collections", href: "/collections" },
        { label: "Deal Zone", href: "/shop", isHighlight: true },
      ];
    }

    return defaultNavs;
  }, [categories]);

  const cartCount = itemCount ?? 0;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs">
      {/* ── ROW 1: Kaizen Livings Top Utility Strip (.q_DH0) ── */}
      <div className="bg-[#DF6B3B] text-white text-[11px] font-medium border-b border-[#C85A2E]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-8 flex items-center justify-between">
          {/* Left: Store locator & Helpline */}
          <div className="hidden md:flex items-center gap-4 text-white/95">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <MapPin size={12} className="stroke-[2.2]" />
              <span>Nearest Store: Jodhpur Crafts Flagship</span>
            </span>
            <span className="text-white/40">|</span>
            <a
              href="tel:+918090926023"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone size={12} className="stroke-[2.2]" />
              <span>Help: +91 80909 26023</span>
            </a>
          </div>

          {/* Center Announcement Ticker */}
          <div className="flex-1 text-center truncate mx-4">
            <span className="text-white font-semibold">
              ✦ Free Delivery on Orders Above ₹499
            </span>
            <span className="hidden sm:inline text-white/90 ml-3">
              | 100% Handcrafted Solid Sheesham Wood
            </span>
          </div>

          {/* Right Quick Links */}
          <div className="hidden sm:flex items-center gap-4 text-white/95">
            <Link to="/contact" className="hover:text-white transition-colors">
              Help
            </Link>
            <span className="text-white/40">|</span>
            <Link to="/profile" className="hover:text-white transition-colors">
              Track Order
            </Link>
            <span className="text-white/40">|</span>
            <Link to="/contact" className="hover:text-white transition-colors">
              Bulk Orders
            </Link>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Main Kaizen Livings Header (Logo, Search, Actions) ── */}
      <div className="border-b border-[#E0E0E0] bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-3.5 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center gap-3 group">
            <img
              src="/kaizenlogo.png"
              alt="Kaizen Livings"
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-102"
              draggable={false}
            />
            <div className="flex flex-col">
              <span className="font-heading text-lg md:text-xl font-black tracking-[0.18em] text-[#323232] leading-none uppercase">
                Kaizen
              </span>
              <span className="text-[9px] tracking-[0.25em] font-bold text-[#DF6B3B] uppercase leading-tight mt-0.5">
                Livings
              </span>
            </div>
          </Link>

          {/* Centered Search Bar */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <SearchBox />
          </div>

          {/* Action Icons List (.wa6H6) */}
          <div className="flex items-center gap-5 sm:gap-6 shrink-0">
            {/* Track Order */}
            <Link
              to="/profile"
              className="hidden lg:flex flex-col items-center gap-0.5 text-[11px] font-semibold text-[#666666] hover:text-[#DF6B3B] transition-colors group"
            >
              <Truck size={20} className="stroke-[1.8] group-hover:scale-105 transition-transform" />
              <span>Track Order</span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="flex flex-col items-center gap-0.5 text-[11px] font-semibold text-[#666666] hover:text-[#DF6B3B] transition-colors group relative"
            >
              <div className="relative">
                <Heart size={20} className="stroke-[1.8] group-hover:scale-105 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#DF6B3B] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Wishlist</span>
            </Link>

            {/* Cart Button */}
            <div className="relative">
              <button
                onClick={() => setMiniCartOpen(!miniCartOpen)}
                className="flex flex-col items-center gap-0.5 text-[11px] font-semibold text-[#666666] hover:text-[#DF6B3B] transition-colors group relative cursor-pointer"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingCart
                    size={20}
                    className="stroke-[1.8] group-hover:scale-105 transition-transform"
                  />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#DF6B3B] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
              </button>

              <MiniCart open={miniCartOpen} setOpen={setMiniCartOpen} />
            </div>

            {/* User Profile / Login */}
            <div ref={profileRef} className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex flex-col items-center gap-0.5 text-[11px] font-semibold text-[#666666] hover:text-[#DF6B3B] transition-colors group cursor-pointer"
                  >
                    <User size={20} className="stroke-[1.8] group-hover:scale-105 transition-transform" />
                    <span className="truncate max-w-[70px]">{user.fullName.split(" ")[0]}</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E0E0E0] shadow-mega rounded-[2px] z-50 py-1.5 animate-in fade-in duration-150">
                      <div className="px-4 py-2 border-b border-[#E0E0E0] bg-[#F5F5F5]">
                        <p className="text-xs font-bold text-[#323232] truncate">{user.fullName}</p>
                        <p className="text-[11px] text-[#666666] truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#323232] hover:bg-[#F8F1EB] hover:text-[#DF6B3B] transition-colors"
                      >
                        <Package size={14} /> My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#323232] hover:bg-[#F8F1EB] hover:text-[#DF6B3B] transition-colors"
                      >
                        <Heart size={14} /> My Wishlist
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#DF6B3B] hover:bg-[#F8F1EB] transition-colors"
                        >
                          <LayoutDashboard size={14} /> Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-[#E0E0E0] my-1" />
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex flex-col items-center gap-0.5 text-[11px] font-semibold text-[#666666] hover:text-[#DF6B3B] transition-colors group"
                >
                  <User size={20} className="stroke-[1.8] group-hover:scale-105 transition-transform" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-[#323232] p-1 rounded-[2px] hover:bg-[#F5F5F5] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Kaizen Livings Category Navigation Strip with Mega-Menu (.OseV0) ── */}
      <nav className="border-b border-[#E0E0E0] hidden md:block bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {navItems.map((item) => (
              <MegaMenu key={item.label} item={item} />
            ))}
          </div>

          {/* Right link: Handcrafted Promise / Experience Stores */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-[#666666] shrink-0 font-medium pl-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0FB67E]" />
            <span>100% Solid Wood Guarantee</span>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER NAVIGATION ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E0E0E0] bg-white max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Search */}
          <div className="p-4 border-b border-[#E0E0E0] bg-[#F5F5F5]">
            <SearchBox onClose={() => setMobileOpen(false)} />
          </div>

          {/* Admin link if admin */}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-5 py-3 text-xs font-bold text-white bg-[#323232] hover:bg-[#DF6B3B] transition-colors"
            >
              <LayoutDashboard size={16} /> Admin Dashboard
            </Link>
          )}

          {/* Mobile Category List */}
          <div className="divide-y divide-[#E0E0E0]">
            {navItems.map((item) => (
              <div key={item.label} className="py-1">
                <Link
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-5 py-3 text-[13px] font-semibold transition-colors",
                    item.isHighlight
                      ? "text-[#DF6B3B] bg-[#FBE4DA]/40"
                      : "text-[#323232] hover:text-[#DF6B3B] hover:bg-[#F5F5F5]"
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronDown size={14} className="text-[#999999]" />
                </Link>

                {item.columns && item.columns.length > 0 && (
                  <div className="bg-[#F8F1EB]/40 px-6 py-2 space-y-3">
                    {item.columns.map((col, cIdx) => (
                      <div key={cIdx} className="space-y-1">
                        <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
                          {col.title}
                        </p>
                        <div className="pl-2 space-y-1">
                          {col.items.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              to={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-1 text-xs text-[#323232] hover:text-[#DF6B3B]"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Mobile Links */}
          <div className="p-4 bg-[#F5F5F5] border-t border-[#E0E0E0] text-xs text-[#666666] space-y-2">
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="block font-medium hover:text-[#DF6B3B]"
            >
              📞 Customer Support & FAQs
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="block font-medium hover:text-[#DF6B3B]"
            >
              📦 Track Your Order
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
