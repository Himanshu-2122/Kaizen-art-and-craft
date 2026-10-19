import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, X, Star, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useCategories } from "@/hooks/useCategories";

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
}

interface FilterState {
  category: string;
  sort: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  minRating: string;
}

/* ── Constants ──────────────────────────────────────── */

const FALLBACK_CATEGORIES = [
  { label: "All",               value: "" },
  { label: "Wall Art",          value: "wall-art" },
  { label: "Pottery",           value: "pottery" },
  { label: "Textile Crafts",    value: "textile-crafts" },
  { label: "3 Daraz Racks",     value: "3-daraz" },
  { label: "6 Daraz Racks",     value: "6-daraz" },
];


const SORT_OPTIONS = [
  { label: "Newest First",       value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated",          value: "rating" },
  { label: "Most Discounted",    value: "discount" },
];

const RATING_OPTIONS = [
  { label: "4★ & above", value: "4" },
  { label: "3★ & above", value: "3" },
  { label: "2★ & above", value: "2" },
];

/* ── Helpers ────────────────────────────────────────── */

function readFilters(params: URLSearchParams): FilterState {
  return {
    category:  params.get("category")  ?? "",
    sort:      params.get("sort")      ?? "newest",
    minPrice:  params.get("minPrice")  ?? "",
    maxPrice:  params.get("maxPrice")  ?? "",
    inStock:   params.get("inStock")   === "true",
    minRating: params.get("minRating") ?? "",
  };
}

function countActiveFilters(f: FilterState): number {
  return [
    f.category,
    f.minPrice,
    f.maxPrice,
    f.inStock ? "1" : "",
    f.minRating,
    f.sort !== "newest" ? f.sort : "",
  ].filter(Boolean).length;
}

/* ── ShopPage ───────────────────────────────────────── */

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]         = useState<Product[]>([]);
  const [loading, setLoading]           = useState(true);
  const [total, setTotal]               = useState(0);
  const [drawerOpen, setDrawerOpen]     = useState(false);

  const filters = readFilters(searchParams);
  const [priceMin, setPriceMin] = useState(filters.minPrice);
  const [priceMax, setPriceMax] = useState(filters.maxPrice);

  const search            = searchParams.get("search") ?? "";
  const activeFilterCount = countActiveFilters(filters);

  /* ── Fetch ── */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params: Record<string, string> = { limit: "50" };
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
        setProducts(list);
        setTotal(Array.isArray(data) ? list.length : (data?.total ?? list.length));
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [searchParams]);

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

  /* ── URL helpers ── */
  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  function applyPriceRange() {
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
    return [{ label: "All", value: "" }, ...dynamicItems];
  }, [dbCategories]);

  const pageTitle = search
    ? `Results for "${search}"`
    : filters.category
    ? (categoriesList.find((c) => c.value === filters.category)?.label ?? filters.category)
    : "All Products";

  return (
    <div className="min-h-screen bg-white">
      {/* Header strip: reference clean border and typography */}
      <div className="bg-white border-b border-[#dedede] py-5 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto">
          <nav className="flex items-center gap-2 text-xs text-[#7d7d7d] mb-2">
            <Link to="/" className="hover:text-[#ec7744] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#121212] font-semibold">{pageTitle}</span>
          </nav>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121212]">{pageTitle}</h1>
              {!loading && (
                <p className="text-sm text-[#7d7d7d] mt-1">
                  {total} product{total !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {search && (
                <button
                  onClick={() => setParam("search", null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#ec7744] border border-[#ec7744] rounded-[4px]
                             px-3 py-1.5 hover:bg-[#ec7744] hover:text-white transition-colors"
                >
                  <X size={13} /> Clear search
                </button>
              )}
              <button
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden relative flex items-center gap-2 bg-white border border-[#dedede] rounded-[4px]
                           text-[#121212] px-4 py-2 text-xs font-bold hover:border-[#ec7744]
                           hover:text-[#ec7744] transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ec7744] text-white
                                   text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6 xl:gap-8 items-start">

          {/* ── Filter sidebar ─────────────────────────── */}
          <aside
            className={[
              "fixed bottom-0 left-0 right-0 z-50 max-h-[92dvh] overflow-y-auto",
              "bg-white shadow-2xl",
              "transition-transform duration-300 ease-in-out",
              drawerOpen ? "translate-y-0" : "translate-y-full",
              "lg:static lg:translate-y-0 lg:z-auto lg:w-64 lg:min-w-[256px] lg:flex-shrink-0",
              "lg:bg-transparent lg:shadow-none lg:max-h-none lg:overflow-visible",
            ].join(" ")}
          >
            <FilterPanel
              filters={filters}
              categories={categoriesList}
              priceMin={priceMin}
              priceMax={priceMax}
              activeFilterCount={activeFilterCount}
              onSortChange={(v) => setParam("sort", v === "newest" ? null : v)}
              onCategoryChange={(v) => setParam("category", v || null)}
              onInStockChange={(v) => setParam("inStock", v ? "true" : null)}
              onMinRatingChange={(v) => setParam("minRating", v || null)}
              onPriceMinChange={setPriceMin}
              onPriceMaxChange={setPriceMax}
              onApplyPrice={applyPriceRange}
              onClearAll={clearAllFilters}
              onClose={() => setDrawerOpen(false)}
            />
          </aside>

          {/* ── Product grid ───────────────────────────── */}
          <section className="flex-1 min-w-0">
            {/* Sort bar — desktop only */}
            <div className="hidden lg:flex items-center justify-between mb-6 pb-3 border-b border-[#dedede]">
              <p className="text-sm text-[#7d7d7d]">
                {loading ? "Loading…" : `${total} product${total !== 1 ? "s" : ""} found`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#7d7d7d] font-medium">Sort by:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => setParam("sort", e.target.value === "newest" ? null : e.target.value)}
                  className="text-xs font-semibold border border-[#dedede] rounded-[4px] px-3 py-1.5 text-[#121212] bg-white
                             focus:outline-none focus:border-[#ec7744] cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {filters.category && (
                  <FilterChip
                    label={categoriesList.find((c) => c.value === filters.category)?.label ?? filters.category}
                    onRemove={() => setParam("category", null)}
                  />
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <FilterChip
                    label={`₹${filters.minPrice || "0"} – ₹${filters.maxPrice || "∞"}`}
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
                {filters.inStock && (
                  <FilterChip label="In Stock" onRemove={() => setParam("inStock", null)} />
                )}
                {filters.minRating && (
                  <FilterChip
                    label={`${filters.minRating}★ & above`}
                    onRemove={() => setParam("minRating", null)}
                  />
                )}
                {filters.sort !== "newest" && (
                  <FilterChip
                    label={SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? filters.sort}
                    onRemove={() => setParam("sort", null)}
                  />
                )}
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#ec7744] hover:underline"
                >
                  <RotateCcw size={11} /> Clear all
                </button>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white p-3 rounded-[4px] border border-[#dedede]">
                    <div className="aspect-square bg-[#f7f7f7] rounded-[2px] mb-3" />
                    <div className="h-3 bg-[#f7f7f7] rounded w-1/2 mb-2" />
                    <div className="h-4 bg-[#f7f7f7] rounded w-3/4 mb-2" />
                    <div className="h-4 bg-[#f7f7f7] rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#dedede] rounded-[4px]">
                <p className="text-4xl mb-3">🎨</p>
                <p className="text-lg font-bold text-[#121212] mb-1">No products found</p>
                <p className="text-sm text-[#7d7d7d] mb-6">
                  {search ? `No results for "${search}"` : "Try adjusting your filters"}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#ec7744] hover:bg-[#f09269] text-white font-bold px-7 py-2.5 text-xs uppercase tracking-wider rounded-[4px] transition-colors shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

/* ── Filter Chip ────────────────────────────────────── */

/* ── Filter Chip ────────────────────────────────────── */

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#fbe4da] border border-[#ec7744]/30
                     text-[#ec7744] text-xs font-semibold px-2.5 py-1 rounded-[2px]">
      {label}
      <button onClick={onRemove} className="hover:text-[#8e4729] transition-colors" aria-label="Remove filter">
        <X size={11} />
      </button>
    </span>
  );
}

/* ── Filter Panel ───────────────────────────────────── */

interface FilterPanelProps {
  filters: FilterState;
  categories: { label: string; value: string }[];
  priceMin: string;
  priceMax: string;
  activeFilterCount: number;
  onSortChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onInStockChange: (v: boolean) => void;
  onMinRatingChange: (v: string) => void;
  onPriceMinChange: (v: string) => void;
  onPriceMaxChange: (v: string) => void;
  onApplyPrice: () => void;
  onClearAll: () => void;
  onClose: () => void;
}

function FilterPanel({
  filters, categories, priceMin, priceMax, activeFilterCount,
  onSortChange, onCategoryChange, onInStockChange, onMinRatingChange,
  onPriceMinChange, onPriceMaxChange, onApplyPrice, onClearAll, onClose,
}: FilterPanelProps) {
  const priceChanged = priceMin !== filters.minPrice || priceMax !== filters.maxPrice;

  return (
    <div className="p-5 lg:p-0 space-y-4">
      {/* Panel header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#dedede]">
        <h2 className="text-sm font-bold text-[#121212] flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-[#ec7744]" />
          Filters
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-bold bg-[#ec7744] text-white px-1.5 py-0.5 rounded-[2px]">
              {activeFilterCount}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              className="hidden lg:flex items-center gap-1 text-xs font-bold text-[#ec7744] hover:underline"
            >
              <RotateCcw size={11} /> Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-[#f7f7f7] rounded-[4px] transition-colors"
            aria-label="Close filters"
          >
            <X size={17} className="text-[#7d7d7d]" />
          </button>
        </div>
      </div>

      {/* Sort */}
      <FilterSection title="Sort By">
        <div className="space-y-2">
          {SORT_OPTIONS.map((o) => (
            <label key={o.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="sort"
                value={o.value}
                checked={filters.sort === o.value}
                onChange={() => onSortChange(o.value)}
                className="accent-[#ec7744] w-3.5 h-3.5 flex-shrink-0"
              />
              <span className={`text-[13px] transition-colors group-hover:text-[#ec7744] ${
                filters.sort === o.value ? "font-bold text-[#ec7744]" : "text-[#7d7d7d]"
              }`}>
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => onCategoryChange(c.value)}
              className={`px-3 py-1.5 text-xs font-medium border rounded-[4px] transition-colors ${
                filters.category === c.value
                  ? "bg-[#ec7744] text-white border-[#ec7744] font-bold"
                  : "border-[#dedede] text-[#121212] bg-white hover:border-[#ec7744] hover:text-[#ec7744]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range (₹)">
        <div className="space-y-3">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-[11px] font-medium text-[#7d7d7d] mb-1 block">Min</label>
              <input
                type="number"
                min={0}
                value={priceMin}
                onChange={(e) => onPriceMinChange(e.target.value)}
                placeholder="0"
                className="w-full border border-[#dedede] rounded-[4px] px-2.5 py-1.5 text-[13px] text-[#121212]
                           bg-white focus:outline-none focus:border-[#ec7744]"
              />
            </div>
            <span className="text-[#7d7d7d] mb-2 text-sm">–</span>
            <div className="flex-1">
              <label className="text-[11px] font-medium text-[#7d7d7d] mb-1 block">Max</label>
              <input
                type="number"
                min={0}
                value={priceMax}
                onChange={(e) => onPriceMaxChange(e.target.value)}
                placeholder="Any"
                className="w-full border border-[#dedede] rounded-[4px] px-2.5 py-1.5 text-[13px] text-[#121212]
                           bg-white focus:outline-none focus:border-[#ec7744]"
              />
            </div>
          </div>
          <button
            onClick={onApplyPrice}
            disabled={!priceChanged && !priceMin && !priceMax}
            className={`w-full text-xs font-bold py-2 rounded-[4px] transition-colors ${
              priceChanged
                ? "bg-[#ec7744] text-white hover:bg-[#f09269]"
                : "bg-[#f7f7f7] text-[#999999] cursor-not-allowed border border-[#dedede]"
            }`}
          >
            Apply Price
          </button>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating">
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="minRating"
              value=""
              checked={filters.minRating === ""}
              onChange={() => onMinRatingChange("")}
              className="accent-[#ec7744] w-3.5 h-3.5 flex-shrink-0"
            />
            <span className={`text-[13px] transition-colors group-hover:text-[#ec7744] ${
              filters.minRating === "" ? "font-bold text-[#ec7744]" : "text-[#7d7d7d]"
            }`}>
              All ratings
            </span>
          </label>
          {RATING_OPTIONS.map((o) => (
            <label key={o.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="minRating"
                value={o.value}
                checked={filters.minRating === o.value}
                onChange={() => onMinRatingChange(o.value)}
                className="accent-[#ec7744] w-3.5 h-3.5 flex-shrink-0"
              />
              <span className={`text-[13px] transition-colors group-hover:text-[#ec7744] flex items-center gap-1 ${
                filters.minRating === o.value ? "font-bold text-[#ec7744]" : "text-[#7d7d7d]"
              }`}>
                <Star size={12} className="fill-[#ec7744] text-[#ec7744] flex-shrink-0" />
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <button
          role="switch"
          aria-checked={filters.inStock}
          onClick={() => onInStockChange(!filters.inStock)}
          className="flex items-center gap-3 w-full text-left"
        >
          <div className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
            filters.inStock ? "bg-[#ec7744]" : "bg-[#dedede]"
          }`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
              filters.inStock ? "translate-x-5" : "translate-x-0.5"
            }`} />
          </div>
          <span className={`text-[13px] font-medium transition-colors ${
            filters.inStock ? "font-bold text-[#ec7744]" : "text-[#7d7d7d]"
          }`}>
            In Stock Only
          </span>
        </button>
      </FilterSection>

      {/* Mobile action buttons */}
      <div className="flex gap-3 pt-2 lg:hidden pb-2">
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="flex-1 border border-[#dedede] text-[#121212] text-xs font-bold py-2.5 rounded-[4px]
                       hover:border-[#ec7744] hover:text-[#ec7744] transition-colors"
          >
            Clear All
          </button>
        )}
        <button
          onClick={onClose}
          className="flex-1 bg-[#ec7744] text-white text-xs font-bold py-2.5 rounded-[4px] hover:bg-[#f09269] transition-colors shadow-sm"
        >
          Show Results
        </button>
      </div>
    </div>
  );
}

/* ── Filter Section ─────────────────────────────────── */

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white border border-[#dedede] rounded-[4px] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left bg-white hover:bg-[#f7f7f7] transition-colors"
      >
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#121212]">
          {title}
        </span>
        {open
          ? <ChevronUp size={14} className="text-[#7d7d7d]" />
          : <ChevronDown size={14} className="text-[#7d7d7d]" />}
      </button>
      {open && <div className="px-3.5 pb-3.5 pt-1">{children}</div>}
    </div>
  );
}
