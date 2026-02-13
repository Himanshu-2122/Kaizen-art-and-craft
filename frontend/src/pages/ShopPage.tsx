import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/products");
    setProducts(res.data.products || res.data || [])
  };

  return (
    <div className="container py-10">

      <h1 className="text-4xl font-bold mb-8">
        Shop
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

    </div>
  );
}
