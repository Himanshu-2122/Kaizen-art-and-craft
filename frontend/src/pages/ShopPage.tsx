import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  Star,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Check,
} from "lucide-react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────── */

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  mrpPrice?: number;
  discountPercentage?: number;
  images?: string[];
  category?: string;
  stock?: number;
  averageRating?: number;
  numReviews?: number;
  materialType?: string;
  finishType?: string;
  storageType?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  netWeight?: number;
  warrantyMonths?: number;
}

interface FilterState {
  category: string;
  sort: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  minRating: string;
  materials: string[];
  finishes: string[];
}

/* ── Constants ──────────────────────────────────────── */

const FALLBACK_CATEGORIES = [
  { label: "All Products",      value: "" },
  { label: "Sofas",             value: "sofas" },
  { label: "Beds",              value: "beds" },
  { label: "Dining",            value: "dining" },
  { label: "Coffee Tables",     value: "coffee-tables" },
  { label: "Chairs",            value: "chairs" },
  { label: "TV Units",          value: "tv-units" },
  { label: "Bookshelves",       value: "bookshelves" },
  { label: "Chest of Drawers",  value: "chest-of-drawers" },
  { label: "Dressing Tables",   value: "dressing-tables" },
];


const SORT_OPTIONS = [
  { label: "Recommended",        value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest Arrivals",    value: "newest" },
  { label: "Customer Rating",    value: "rating" },
  { label: "Discount",           value: "discount" },
];

const PRICE_PRESETS = [
  { label: "Under ₹2,000",        min: "0",     max: "2000" },
  { label: "₹2,000 – ₹5,000",     min: "2000",  max: "5000" },
  { label: "₹5,000 – ₹10,000",    min: "5000",  max: "10000" },
  { label: "Above ₹10,000",       min: "10000", max: "" },
];

const RATING_OPTIONS = [
  { label: "4★ & above", value: "4" },
  { label: "3★ & above", value: "3" },
  { label: "2★ & above", value: "2" },
];

const DEFAULT_MATERIALS = [
  "Sheesham Wood",
  "Teak Wood",
  "Mango Wood",
  "Pine Wood",
  "Rosewood",
  "Solid Wood",
  "Cotton",
  "Canvas",
  "Ceramic / Clay",
  "Brass & Metal",
];

const DEFAULT_FINISHES = [
  "Walnut",
  "Natural",
  "Honey Polish",
  "Hand-Painted",
  "Matte",
  "Antique",
  "Antique Gold",
  "Brass Inlay",
  "Glossy",
  "Woven",
];

/* ── Helpers ────────────────────────────────────────── */

function readFilters(params: URLSearchParams): FilterState {
  const materialsParam = params.get("materials");
  const finishesParam = params.get("finishes");

  return {
    category:  params.get("category")  ?? "",
    sort:      params.get("sort")      ?? "newest",
    minPrice:  params.get("minPrice")  ?? "",
    maxPrice:  params.get("maxPrice")  ?? "",
    inStock:   params.get("inStock")   === "true",
    minRating: params.get("minRating") ?? "",
    materials: materialsParam ? materialsParam.split(",").filter(Boolean) : [],
    finishes:  finishesParam  ? finishesParam.split(",").filter(Boolean)  : [],
  };
}

function countActiveFilters(f: FilterState): number {
  return [
    f.category,
    f.minPrice,
    f.maxPrice,
    f.inStock ? "1" : "",
    f.minRating,
    f.sort && f.sort !== "newest" ? f.sort : "",
    ...f.materials,
    ...f.finishes,
  ].filter(Boolean).length;
}

/* ── ShopPage ───────────────────────────────────────── */

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rawProducts, setRawProducts]   = useState<Product[]>([]);
  const [loading, setLoading]           = useState(true);
  const [total, setTotal]               = useState(0);
  const [drawerOpen, setDrawerOpen]     = useState(false);

  const filters = readFilters(searchParams);
  const [priceMin, setPriceMin] = useState(filters.minPrice);
  const [priceMax, setPriceMax] = useState(filters.maxPrice);

  const search            = searchParams.get("search") ?? "";
  const activeFilterCount = countActiveFilters(filters);

  /* ── Fetch from Backend ── */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params: Record<string, string> = { limit: "100" };
    const sp = searchParams;
    const _search    = sp.get("search")    ?? "";
    const _category  = sp.get("category")  ?? "";
    const _sort      = sp.get("sort")      ?? "";
    const _minPrice  = sp.get("minPrice")  ?? "";
    const _maxPrice  = sp.get("maxPrice")  ?? "";
    const _inStock   = sp.get("inStock")   ?? "";
    const _minRating = sp.get("minRating") ?? "";

    if (_search)              params.search    = _search;
    if (_category)            params.category  = _category;
    if (_sort && _sort !== "newest") params.sort = _sort;
    if (_minPrice)            params.minPrice  = _minPrice;
    if (_maxPrice)            params.maxPrice  = _maxPrice;
    if (_inStock === "true")  params.inStock   = "true";
    if (_minRating)           params.minRating = _minRating;

    api
      .get("/products", { params })
      .then((res) => {
        if (cancelled) return;
        const data = res.data as { products?: Product[]; total?: number } | Product[];
        const list = Array.isArray(data) ? data : (data?.products ?? []);
        setRawProducts(list);
        setTotal(Array.isArray(data) ? list.length : (data?.total ?? list.length));
      })
      .catch(() => {
        if (!cancelled) setRawProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [searchParams]);

  /* ── Sync min/max inputs with URL state ── */
  const prevMinPrice = useRef(filters.minPrice);
  const prevMaxPrice = useRef(filters.maxPrice);
  useEffect(() => {
    if (prevMinPrice.current !== filters.minPrice) {
      setPriceMin(filters.minPrice);
      prevMinPrice.current = filters.minPrice;
    }
    if (prevMaxPrice.current !== filters.maxPrice) {
      setPriceMax(filters.maxPrice);
      prevMaxPrice.current = filters.maxPrice;
    }
  }, [filters.minPrice, filters.maxPrice]);

  /* ── Client-side Filtering for materialType and finishType ── */
  const products = useMemo(() => {
    return rawProducts.filter((p) => {
      // Material filter
      if (filters.materials.length > 0) {
        if (!p.materialType) return false;
        const mat = p.materialType.toLowerCase();
        const matchesMat = filters.materials.some((m) =>
          mat.includes(m.toLowerCase()) || m.toLowerCase().includes(mat)
        );
        if (!matchesMat) return false;
      }

      // Finish filter
      if (filters.finishes.length > 0) {
        if (!p.finishType) return false;
        const fin = p.finishType.toLowerCase();
        const matchesFin = filters.finishes.some((f) =>
          fin.includes(f.toLowerCase()) || f.toLowerCase().includes(fin)
        );
        if (!matchesFin) return false;
      }

      return true;
    });
  }, [rawProducts, filters.materials, filters.finishes]);

  /* ── Categories List ── */
  const { data: dbCategories = [] } = useCategories();

  const categoriesList = useMemo(() => {
    if (!dbCategories || dbCategories.length === 0) {
      return FALLBACK_CATEGORIES;
    }
    const dynamicItems = dbCategories
      .filter((c) => c.isActive !== false)
      .map((c) => ({
        label: c.name,
        value: c.slug,
      }));
    return [{ label: "All Products", value: "" }, ...dynamicItems];
  }, [dbCategories]);

  /* ── Extract Available Materials & Finishes with counts ── */
  const availableMaterials = useMemo(() => {
    const counts: Record<string, number> = {};
    rawProducts.forEach((p) => {
      if (p.materialType) {
        const m = p.materialType.trim();
        counts[m] = (counts[m] || 0) + 1;
      }
    });

    const combined = Array.from(
      new Set([...Object.keys(counts), ...DEFAULT_MATERIALS])
    );

    return combined.map((name) => ({
      name,
      count: counts[name] || 0,
    })).sort((a, b) => b.count - a.count);
  }, [rawProducts]);

  const availableFinishes = useMemo(() => {
    const counts: Record<string, number> = {};
    rawProducts.forEach((p) => {
      if (p.finishType) {
        const f = p.finishType.trim();
        counts[f] = (counts[f] || 0) + 1;
      }
    });

    const combined = Array.from(
      new Set([...Object.keys(counts), ...DEFAULT_FINISHES])
    );

    return combined.map((name) => ({
      name,
      count: counts[name] || 0,
    })).sort((a, b) => b.count - a.count);
  }, [rawProducts]);

  /* ── URL mutation helpers ── */
  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  function toggleArrayParam(key: "materials" | "finishes", item: string) {
    const next = new URLSearchParams(searchParams);
    const current = (next.get(key) || "").split(",").filter(Boolean);
    const exists = current.includes(item);
    const updated = exists ? current.filter((x) => x !== item) : [...current, item];

    if (updated.length > 0) {
      next.set(key, updated.join(","));
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  }

  function applyPricePreset(min: string, max: string) {
    const next = new URLSearchParams(searchParams);
    if (min) next.set("minPrice", min); else next.delete("minPrice");
    if (max) next.set("maxPrice", max); else next.delete("maxPrice");
    setSearchParams(next, { replace: true });
    setPriceMin(min);
    setPriceMax(max);
  }

  function applyCustomPrice() {
    const next = new URLSearchParams(searchParams);
    if (priceMin) next.set("minPrice", priceMin); else next.delete("minPrice");
    if (priceMax) next.set("maxPrice", priceMax); else next.delete("maxPrice");
    setSearchParams(next, { replace: true });
  }

  function clearAllFilters() {
    const next = new URLSearchParams();
    if (search) next.set("search", search);
    setSearchParams(next, { replace: true });
    setPriceMin("");
    setPriceMax("");
    setDrawerOpen(false);
  }

  const currentCategoryLabel = filters.category
    ? categoriesList.find((c) => c.value === filters.category)?.label ?? filters.category
    : "All Furniture & Decor";

  const pageTitle = search
    ? `Results for "${search}"`
    : currentCategoryLabel;

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans antialiased text-[#323232]">
      {/* ── Top Header / Breadcrumbs Bar (Kaizen Livings Style) ── */}
      <div className="bg-[#FFFFFF] border-b border-[#E0E0E0] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-[11px] text-[#666666] mb-2.5">
            <Link to="/" className="hover:text-[#DF6B3B] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-[#999999]" />
            <Link to="/shop" className="hover:text-[#DF6B3B] transition-colors">
              Furniture
            </Link>
            {filters.category && (
              <>
                <ChevronRight size={12} className="text-[#999999]" />
                <span className="text-[#323232] font-semibold">
                  {currentCategoryLabel}
                </span>
              </>
            )}
            {search && (
              <>
                <ChevronRight size={12} className="text-[#999999]" />
                <span className="text-[#323232] font-semibold">
                  Search: "{search}"
                </span>
              </>
            )}
          </nav>

          {/* Heading + Count + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#323232]">
                {pageTitle}
              </h1>
              {!loading && (
                <p className="text-xs sm:text-sm text-[#666666] mt-1 font-normal">
                  Showing {products.length} {products.length === 1 ? "product" : "products"}
                  {total > products.length && ` (of ${total} total)`}
                </p>
              )}
            </div>

            {/* Mobile Filter & Search Button */}
            <div className="flex items-center gap-3">
              {search && (
                <button
                  onClick={() => setParam("search", null)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#DF6B3B] border border-[#DF6B3B] rounded-[2px] px-3 py-1.5 hover:bg-[#DF6B3B] hover:text-white transition-colors"
                >
                  <X size={13} /> Clear search
                </button>
              )}

              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden relative flex items-center gap-2 bg-[#FFFFFF] border border-[#E0E0E0] rounded-[2px] text-[#323232] px-3.5 py-1.5 text-xs font-bold hover:border-[#DF6B3B] hover:text-[#DF6B3B] transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 bg-[#DF6B3B] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Shop Content Layout ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8 items-start">

          {/* ── Desktop Left Sidebar Filters (260px) ── */}
          <aside className="hidden lg:block w-[260px] min-w-[260px] flex-shrink-0 sticky top-28 self-start">
            <FilterSidebarContent
              filters={filters}
              categories={categoriesList}
              priceMin={priceMin}
              priceMax={priceMax}
              activeFilterCount={activeFilterCount}
              availableMaterials={availableMaterials}
              availableFinishes={availableFinishes}
              onCategoryChange={(val) => setParam("category", val || null)}
              onPricePreset={applyPricePreset}
              onPriceMinChange={setPriceMin}
              onPriceMaxChange={setPriceMax}
              onApplyPrice={applyCustomPrice}
              onMaterialToggle={(m) => toggleArrayParam("materials", m)}
              onFinishToggle={(f) => toggleArrayParam("finishes", f)}
              onMinRatingChange={(r) => setParam("minRating", r || null)}
              onInStockChange={(val) => setParam("inStock", val ? "true" : null)}
              onClearAll={clearAllFilters}
            />
          </aside>

          {/* ── Product Grid & Controls Section ── */}
          <section className="flex-1 min-w-0">

            {/* Sort Bar (Kaizen Livings Style: Right Aligned Dropdown) */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E0E0E0]">
              <span className="text-xs text-[#666666] font-medium hidden sm:inline">
                {loading ? "Loading furniture range…" : `${products.length} Items Found`}
              </span>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs font-semibold text-[#666666]">Sort By:</span>
                <div className="relative">
                  <select
                    value={filters.sort}
                    onChange={(e) => setParam("sort", e.target.value === "newest" ? null : e.target.value)}
                    className="appearance-none bg-[#FFFFFF] border border-[#E0E0E0] rounded-[2px] text-xs font-semibold text-[#323232] pl-3 pr-8 py-1.5 hover:border-[#DF6B3B] focus:outline-none focus:border-[#DF6B3B] cursor-pointer transition-colors"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666666] pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Active Filter Chips / Pills (Kaizen Livings Style) */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5 p-2.5 bg-[#F5F5F5] rounded-[2px] border border-[#E0E0E0]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666] mr-1">
                  Active Filters:
                </span>

                {/* Category Chip */}
                {filters.category && (
                  <FilterChip
                    label={`Category: ${currentCategoryLabel}`}
                    onRemove={() => setParam("category", null)}
                  />
                )}

                {/* Price Chip */}
                {(filters.minPrice || filters.maxPrice) && (
                  <FilterChip
                    label={`Price: ₹${filters.minPrice || "0"} – ₹${filters.maxPrice || "Any"}`}
                    onRemove={() => {
                      const next = new URLSearchParams(searchParams);
                      next.delete("minPrice");
                      next.delete("maxPrice");
                      setSearchParams(next, { replace: true });
                      setPriceMin("");
                      setPriceMax("");
                    }}
                  />
                )}

                {/* Material Chips */}
                {filters.materials.map((m) => (
                  <FilterChip
                    key={m}
                    label={`Material: ${m}`}
                    onRemove={() => toggleArrayParam("materials", m)}
                  />
                ))}

                {/* Finish Chips */}
                {filters.finishes.map((f) => (
                  <FilterChip
                    key={f}
                    label={`Finish: ${f}`}
                    onRemove={() => toggleArrayParam("finishes", f)}
                  />
                ))}

                {/* Rating Chip */}
                {filters.minRating && (
                  <FilterChip
                    label={`Rating: ${filters.minRating}★ & above`}
                    onRemove={() => setParam("minRating", null)}
                  />
                )}

                {/* In Stock Chip */}
                {filters.inStock && (
                  <FilterChip
                    label="In Stock Only"
                    onRemove={() => setParam("inStock", null)}
                  />
                )}

                {/* Clear All CTA */}
                <button
                  onClick={clearAllFilters}
                  className="ml-auto flex items-center gap-1 text-xs font-bold text-[#DF6B3B] hover:text-[#C85A2E] hover:underline cursor-pointer"
                >
                  <RotateCcw size={12} /> Clear All
                </button>
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white p-3 rounded-[2px] border border-[#E0E0E0]"
                  >
                    <div className="aspect-square bg-[#F5F5F5] rounded-[2px] mb-3" />
                    <div className="h-3 bg-[#F5F5F5] rounded w-1/3 mb-2" />
                    <div className="h-4 bg-[#F5F5F5] rounded w-3/4 mb-3" />
                    <div className="h-4 bg-[#F5F5F5] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#E0E0E0] rounded-[2px] p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#FBE4DA] rounded-full flex items-center justify-center text-[#DF6B3B]">
                  <SlidersHorizontal size={28} />
                </div>
                <h3 className="text-lg font-bold text-[#323232] mb-1">
                  No products matched your criteria
                </h3>
                <p className="text-xs sm:text-sm text-[#666666] mb-6 max-w-md mx-auto">
                  {search
                    ? `We couldn't find anything matching "${search}". Try checking your spelling or using fewer filters.`
                    : "Try adjusting your price bracket, material, or finish filters to explore more items."}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#DF6B3B] hover:bg-[#C85A2E] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-[2px] transition-colors shadow-xs"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── Mobile Filter Drawer (Slide up bottom modal) ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-h-[85vh] rounded-t-lg shadow-2xl flex flex-col z-10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E0E0E0] bg-[#F5F5F5]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#DF6B3B]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#323232]">
                  Filters
                </h3>
                {activeFilterCount > 0 && (
                  <span className="text-[10px] font-bold bg-[#DF6B3B] text-white px-1.5 py-0.2 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 hover:bg-[#E0E0E0] rounded transition-colors text-[#666666]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Filter List */}
            <div className="overflow-y-auto p-5 flex-1 space-y-4">
              <FilterSidebarContent
                filters={filters}
                categories={categoriesList}
                priceMin={priceMin}
                priceMax={priceMax}
                activeFilterCount={activeFilterCount}
                availableMaterials={availableMaterials}
                availableFinishes={availableFinishes}
                onCategoryChange={(val) => setParam("category", val || null)}
                onPricePreset={applyPricePreset}
                onPriceMinChange={setPriceMin}
                onPriceMaxChange={setPriceMax}
                onApplyPrice={applyCustomPrice}
                onMaterialToggle={(m) => toggleArrayParam("materials", m)}
                onFinishToggle={(f) => toggleArrayParam("finishes", f)}
                onMinRatingChange={(r) => setParam("minRating", r || null)}
                onInStockChange={(val) => setParam("inStock", val ? "true" : null)}
                onClearAll={clearAllFilters}
              />
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#E0E0E0] bg-white flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-2.5 border border-[#E0E0E0] rounded-[2px] text-xs font-bold uppercase tracking-wider text-[#323232] hover:bg-[#F5F5F5]"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 py-2.5 bg-[#DF6B3B] hover:bg-[#C85A2E] text-white rounded-[2px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Show {products.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Active Filter Chip Component ───────────────────── */

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#FFFFFF] border border-[#DF6B3B]/40 text-[#DF6B3B] text-[11px] font-semibold px-2 py-0.5 rounded-[2px] shadow-2xs">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-[#A8441F] transition-colors cursor-pointer"
        aria-label="Remove filter"
      >
        <X size={11} />
      </button>
    </span>
  );
}

/* ── Filter Sidebar Content (Reusable for Desktop & Mobile) ── */

interface FilterSidebarContentProps {
  filters: FilterState;
  categories: { label: string; value: string }[];
  priceMin: string;
  priceMax: string;
  activeFilterCount: number;
  availableMaterials: { name: string; count: number }[];
  availableFinishes: { name: string; count: number }[];
  onCategoryChange: (val: string) => void;
  onPricePreset: (min: string, max: string) => void;
  onPriceMinChange: (val: string) => void;
  onPriceMaxChange: (val: string) => void;
  onApplyPrice: () => void;
  onMaterialToggle: (mat: string) => void;
  onFinishToggle: (fin: string) => void;
  onMinRatingChange: (rating: string) => void;
  onInStockChange: (inStock: boolean) => void;
  onClearAll: () => void;
}

function FilterSidebarContent({
  filters,
  categories,
  priceMin,
  priceMax,
  activeFilterCount,
  availableMaterials,
  availableFinishes,
  onCategoryChange,
  onPricePreset,
  onPriceMinChange,
  onPriceMaxChange,
  onApplyPrice,
  onMaterialToggle,
  onFinishToggle,
  onMinRatingChange,
  onInStockChange,
  onClearAll,
}: FilterSidebarContentProps) {
  const isCustomPriceChanged =
    priceMin !== filters.minPrice || priceMax !== filters.maxPrice;

  return (
    <div className="space-y-4">
      {/* Sidebar Header */}
      <div className="hidden lg:flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-[#DF6B3B]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#323232]">
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-bold bg-[#DF6B3B] text-white px-1.5 py-0.2 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-[11px] font-bold text-[#DF6B3B] hover:text-[#C85A2E] hover:underline cursor-pointer"
          >
            <RotateCcw size={11} /> Clear All
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <FilterSection title="Categories" defaultOpen={true}>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {categories.map((c) => {
            const isSelected = filters.category === c.value;
            return (
              <label
                key={c.value}
                onClick={() => onCategoryChange(c.value)}
                className={cn(
                  "flex items-center justify-between py-1.5 px-2 rounded-[2px] cursor-pointer text-xs transition-colors group",
                  isSelected
                    ? "bg-[#FBE4DA] text-[#DF6B3B] font-bold"
                    : "text-[#323232] hover:bg-[#F5F5F5] hover:text-[#DF6B3B]"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-[#DF6B3B] border-[#DF6B3B] text-white"
                        : "border-[#E0E0E0] bg-white group-hover:border-[#DF6B3B]"
                    )}
                  >
                    {isSelected && <Check size={10} className="stroke-[3]" />}
                  </div>
                  <span>{c.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* 2. Price Range Filter */}
      <FilterSection title="Price (₹)" defaultOpen={true}>
        <div className="space-y-3">
          {/* Quick Presets */}
          <div className="space-y-1">
            {PRICE_PRESETS.map((p) => {
              const isActive =
                filters.minPrice === p.min && filters.maxPrice === p.max;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onPricePreset(p.min, p.max)}
                  className={cn(
                    "w-full text-left py-1 px-2 text-xs rounded-[2px] transition-colors flex items-center justify-between",
                    isActive
                      ? "bg-[#FBE4DA] text-[#DF6B3B] font-bold"
                      : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#323232]"
                  )}
                >
                  <span>{p.label}</span>
                  {isActive && <Check size={11} className="text-[#DF6B3B]" />}
                </button>
              );
            })}
          </div>

          {/* Min & Max inputs */}
          <div className="pt-2 border-t border-[#E0E0E0]">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  min={0}
                  value={priceMin}
                  onChange={(e) => onPriceMinChange(e.target.value)}
                  placeholder="Min (₹)"
                  className="w-full border border-[#E0E0E0] rounded-[2px] px-2.5 py-1 text-xs text-[#323232] bg-white focus:outline-none focus:border-[#DF6B3B]"
                />
              </div>
              <span className="text-[#999999] text-xs">–</span>
              <div className="flex-1">
                <input
                  type="number"
                  min={0}
                  value={priceMax}
                  onChange={(e) => onPriceMaxChange(e.target.value)}
                  placeholder="Max (₹)"
                  className="w-full border border-[#E0E0E0] rounded-[2px] px-2.5 py-1 text-xs text-[#323232] bg-white focus:outline-none focus:border-[#DF6B3B]"
                />
              </div>
              <button
                type="button"
                onClick={onApplyPrice}
                disabled={!isCustomPriceChanged && !priceMin && !priceMax}
                className={cn(
                  "px-3 py-1 text-xs font-bold uppercase rounded-[2px] transition-colors cursor-pointer",
                  isCustomPriceChanged
                    ? "bg-[#DF6B3B] text-white hover:bg-[#C85A2E]"
                    : "bg-[#F5F5F5] text-[#999999] border border-[#E0E0E0] cursor-not-allowed"
                )}
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* 3. Primary Material Filter (materialType) */}
      <FilterSection title="Primary Material" defaultOpen={true}>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
          {availableMaterials.map((m) => {
            const isChecked = filters.materials.includes(m.name);
            return (
              <label
                key={m.name}
                onClick={() => onMaterialToggle(m.name)}
                className="flex items-center justify-between py-1 px-1.5 rounded-[2px] cursor-pointer text-xs group hover:bg-[#F5F5F5] transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <div
                    className={cn(
                      "w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center transition-colors flex-shrink-0",
                      isChecked
                        ? "bg-[#DF6B3B] border-[#DF6B3B] text-white"
                        : "border-[#E0E0E0] bg-white group-hover:border-[#DF6B3B]"
                    )}
                  >
                    {isChecked && <Check size={10} className="stroke-[3]" />}
                  </div>
                  <span
                    className={cn(
                      "truncate transition-colors",
                      isChecked
                        ? "font-bold text-[#DF6B3B]"
                        : "text-[#323232] group-hover:text-[#DF6B3B]"
                    )}
                  >
                    {m.name}
                  </span>
                </div>
                {m.count > 0 && (
                  <span className="text-[10px] text-[#999999] font-medium ml-1">
                    ({m.count})
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* 4. Finish Filter (finishType) */}
      <FilterSection title="Finish" defaultOpen={true}>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
          {availableFinishes.map((f) => {
            const isChecked = filters.finishes.includes(f.name);
            return (
              <label
                key={f.name}
                onClick={() => onFinishToggle(f.name)}
                className="flex items-center justify-between py-1 px-1.5 rounded-[2px] cursor-pointer text-xs group hover:bg-[#F5F5F5] transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <div
                    className={cn(
                      "w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center transition-colors flex-shrink-0",
                      isChecked
                        ? "bg-[#DF6B3B] border-[#DF6B3B] text-white"
                        : "border-[#E0E0E0] bg-white group-hover:border-[#DF6B3B]"
                    )}
                  >
                    {isChecked && <Check size={10} className="stroke-[3]" />}
                  </div>
                  <span
                    className={cn(
                      "truncate transition-colors",
                      isChecked
                        ? "font-bold text-[#DF6B3B]"
                        : "text-[#323232] group-hover:text-[#DF6B3B]"
                    )}
                  >
                    {f.name}
                  </span>
                </div>
                {f.count > 0 && (
                  <span className="text-[10px] text-[#999999] font-medium ml-1">
                    ({f.count})
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* 5. Customer Rating Filter */}
      <FilterSection title="Customer Rating" defaultOpen={false}>
        <div className="space-y-1.5">
          <label
            onClick={() => onMinRatingChange("")}
            className="flex items-center gap-2 cursor-pointer text-xs group py-0.5"
          >
            <div
              className={cn(
                "w-3.5 h-3.5 rounded-full border flex items-center justify-center",
                filters.minRating === ""
                  ? "border-[#DF6B3B] bg-[#DF6B3B]"
                  : "border-[#E0E0E0] bg-white"
              )}
            >
              {filters.minRating === "" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <span
              className={cn(
                filters.minRating === ""
                  ? "font-bold text-[#DF6B3B]"
                  : "text-[#666666] group-hover:text-[#323232]"
              )}
            >
              All Ratings
            </span>
          </label>

          {RATING_OPTIONS.map((r) => {
            const isSelected = filters.minRating === r.value;
            return (
              <label
                key={r.value}
                onClick={() => onMinRatingChange(r.value)}
                className="flex items-center gap-2 cursor-pointer text-xs group py-0.5"
              >
                <div
                  className={cn(
                    "w-3.5 h-3.5 rounded-full border flex items-center justify-center",
                    isSelected
                      ? "border-[#DF6B3B] bg-[#DF6B3B]"
                      : "border-[#E0E0E0] bg-white"
                  )}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className={cn(
                    "flex items-center gap-1",
                    isSelected
                      ? "font-bold text-[#DF6B3B]"
                      : "text-[#666666] group-hover:text-[#323232]"
                  )}
                >
                  <Star size={11} className="fill-[#DF6B3B] text-[#DF6B3B]" />
                  {r.label}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* 6. Availability */}
      <FilterSection title="Availability" defaultOpen={true}>
        <button
          type="button"
          role="switch"
          aria-checked={filters.inStock}
          onClick={() => onInStockChange(!filters.inStock)}
          className="flex items-center justify-between w-full py-1 text-left cursor-pointer group"
        >
          <span
            className={cn(
              "text-xs transition-colors",
              filters.inStock
                ? "font-bold text-[#DF6B3B]"
                : "text-[#666666] group-hover:text-[#323232]"
            )}
          >
            In Stock Only
          </span>
          <div
            className={cn(
              "relative w-8 h-4 rounded-full transition-colors flex-shrink-0",
              filters.inStock ? "bg-[#DF6B3B]" : "bg-[#E0E0E0]"
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-xs transition-transform",
                filters.inStock ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </div>
        </button>
      </FilterSection>
    </div>
  );
}

/* ── Collapsible Filter Section Component (Kaizen Livings Aesthetic) ── */

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-[2px] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left bg-[#FFFFFF] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
      >
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#323232]">
          {title}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-[#666666]" />
        ) : (
          <ChevronDown size={14} className="text-[#666666]" />
        )}
      </button>
      {open && (
        <div className="px-3.5 pb-3 pt-1 border-t border-[#F5F5F5]">
          {children}
        </div>
      )}
    </div>
  );
}
