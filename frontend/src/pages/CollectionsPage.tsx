import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useParams, Link } from "react-router-dom";

const COLLECTIONS = [
  { name: "Sofa", slug: "sofa" },
  { name: "Chair", slug: "chair" },
  { name: "Table", slug: "table" },
  { name: "Bed", slug: "bed" },
];

export default function CollectionsPage() {
  const { slug } = useParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slug) loadProducts();
  }, [slug]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      // ⭐ fetch only that category
      const res = await api.get(`/products?category=${slug}`);

      const data = res.data.products || res.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // SHOW COLLECTION LIST
  // =======================
  if (!slug) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Collections</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.slug}
              to={`/collections/${c.slug}`}
              className="border p-6 rounded-lg text-center hover:bg-gray-100 transition"
            >
              <h2 className="text-lg font-semibold">{c.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // =======================
  // SHOW PRODUCTS OF ONE COLLECTION
  // =======================
  return (
    <div className="container py-10">

      <Link to="/collections" className="text-accent mb-6 inline-block">
        ← Back to Collections
      </Link>

      <h1 className="text-3xl font-bold mb-8 capitalize">
        {slug} Collection
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found in this collection.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
