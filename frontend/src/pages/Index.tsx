import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Shield, Hammer, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts, useCollections } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { data: products } = useProducts();
  const { data: collections } = useCollections();

  const featured = products?.filter((p) => p.featured).slice(0, 4) ?? [];
  const bestSellers = products?.filter((p) => p.best_seller).slice(0, 4) ?? [];

  const heroImages = [
    "/images/hero1.jpg",
    "/images/hero3.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-primary">
        {/* Background Slider */}
        {heroImages.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Hero"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
              i === index ? "opacity-100 scale-105" : "opacity-0"
            }`}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-4">
          <motion.h1
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight"
          >
            {SITE_TAGLINE}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl mb-8 text-white/80"
          >
            Discover furniture that brings elegance and comfort to every room.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8"
            >
              <Link to="/shop">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              desc: "On orders over $500",
            },
            {
              icon: Shield,
              title: "Secure Payment",
              desc: "256-bit SSL encryption",
            },
            { icon: Hammer, title: "Handcrafted", desc: "Premium materials" },
            {
              icon: Headphones,
              title: "24/7 Support",
              desc: "Always here to help",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center p-6"
            >
              <f.icon className="h-8 w-8 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Collections */}
      {collections && collections.length > 0 && (
        <section className="container pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold">Collections</h2>
            <Link
              to="/collections"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {collections.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to={`/collections/${c.slug}`}
                className="group relative aspect-[3/4] rounded-md overflow-hidden"
              >
                <img
                  src={c.image_url || ""}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-semibold text-sm">{c.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container pb-16">
          <h2 className="text-3xl font-display font-bold mb-8">Featured</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                price={Number(p.price)}
                image={p.images?.[0] || ""}
                stock={p.stock}
              />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="container pb-16">
          <h2 className="text-3xl font-display font-bold mb-8">Best Sellers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                price={Number(p.price)}
                image={p.images?.[0] || ""}
                stock={p.stock}
              />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-secondary py-20">
        <div className="container text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-4">
            Stay Inspired
          </h2>
          <p className="text-muted-foreground mb-6">
            Get the latest collections and exclusive offers straight to your
            inbox.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex gap-2"
          >
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-sm"
            />
            <Button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
