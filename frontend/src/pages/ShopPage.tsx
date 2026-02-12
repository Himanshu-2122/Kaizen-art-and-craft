import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useCollections } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState("latest");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [inStock, setInStock] = useState(false);
  const [search, setSearch] = useState("");
  const collectionSlug = searchParams.get("collection");

  const { data: collections } = useCollections();
  const collectionId = collectionSlug ? collections?.find((c) => c.slug === collectionSlug)?.id : undefined;

  const { data: products, isLoading } = useProducts({
    sort,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    inStock: inStock || undefined,
    collection_id: collectionId,
    search: search || undefined,
  });

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-display font-bold mb-2">Shop</h1>
      <p className="text-muted-foreground mb-8">Browse our full collection of modern furniture.</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">Search</Label>
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Sort By</Label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Price Range: ${priceRange[0]} – ${priceRange[1]}
            </Label>
            <Slider min={0} max={3000} step={50} value={priceRange} onValueChange={setPriceRange} className="mt-3" />
          </div>
          <div className="flex items-center gap-2">
            <Switch id="in-stock" checked={inStock} onCheckedChange={setInStock} />
            <Label htmlFor="in-stock" className="text-sm">In Stock Only</Label>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-md bg-secondary animate-pulse" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug} price={Number(p.price)} image={p.images?.[0] || ""} stock={p.stock} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">No products found matching your criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
}
