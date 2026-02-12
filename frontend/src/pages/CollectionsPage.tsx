import { Link, useParams } from "react-router-dom";
import { useCollections, useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

export default function CollectionsPage() {
  const { slug } = useParams();
  const { data: collections, isLoading } = useCollections();

  if (slug) return <CollectionDetail slug={slug} />;

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-display font-bold mb-2">Collections</h1>
      <p className="text-muted-foreground mb-8">Explore our curated furniture collections.</p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/2] rounded-md bg-secondary animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections?.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link to={`/collections/${c.slug}`} className="group block relative aspect-[3/2] rounded-md overflow-hidden">
                <img src={c.image_url || ""} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white text-xl font-display font-bold">{c.name}</h3>
                  <p className="text-white/70 text-sm mt-1">{c.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function CollectionDetail({ slug }: { slug: string }) {
  const { data: collections } = useCollections();
  const collection = collections?.find((c) => c.slug === slug);
  const { data: products, isLoading } = useProducts({ collection_id: collection?.id });

  return (
    <div className="container py-10">
      <Link to="/collections" className="text-sm text-accent hover:underline mb-4 inline-block">← All Collections</Link>
      <h1 className="text-4xl font-display font-bold mb-2">{collection?.name || "Collection"}</h1>
      <p className="text-muted-foreground mb-8">{collection?.description}</p>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-md bg-secondary animate-pulse" />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug} price={Number(p.price)} image={p.images?.[0] || ""} stock={p.stock} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">No products in this collection yet.</div>
      )}
    </div>
  );
}
