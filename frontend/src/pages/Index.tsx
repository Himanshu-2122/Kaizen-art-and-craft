// // import { Link } from "react-router-dom";
// // import { motion } from "framer-motion";
// // import { ArrowRight, Truck, Shield, Hammer, Headphones } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { useProducts, useCollections } from "@/hooks/useProducts";
// // import ProductCard from "@/components/ProductCard";
// // import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
// // import { useEffect, useState } from "react";
// // import { useEffect, useState } from "react";
// // import api from "@/lib/api";

// // export default function HomePage() {
// //   // const { data: products } = useProducts();
// //   // // const { data: collections } = useCollections();

// //   // const featured = products?.filter((p) => p.featured).slice(0, 4) ?? [];
// //   // const bestSellers = products?.filter((p) => p.best_seller).slice(0, 4) ?? [];

// //   const heroImages = [
// //     "/images/hero1.jpg",
// //     "/images/hero3.jpg",
// //   ];

// //   const [index, setIndex] = useState(0);

// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       setIndex((prev) => (prev + 1) % heroImages.length);
// //     }, 4000);

// //     return () => clearInterval(timer);
// //   }, []);

// //   return (
// //     <div>
// //       {/* ================= HERO ================= */}
// //       <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-primary">
// //         {/* Background Slider */}
// //         {heroImages.map((img, i) => (
// //           <img
// //             key={i}
// //             src={img}
// //             alt="Hero"
// //             className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
// //               i === index ? "opacity-100 scale-105" : "opacity-0"
// //             }`}
// //           />
// //         ))}

// //         {/* Overlay */}
// //         <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

// //         {/* Content */}
// //         <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-4">
// //           <motion.h1
// //             key={index}
// //             initial={{ opacity: 0, y: 40 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.8 }}
// //             className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight"
// //           >
// //             {SITE_TAGLINE}
// //           </motion.h1>

// //           <motion.p
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             transition={{ delay: 0.3, duration: 0.8 }}
// //             className="text-lg md:text-xl mb-8 text-white/80"
// //           >
// //             Discover furniture that brings elegance and comfort to every room.
// //           </motion.p>

// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             transition={{ delay: 0.6 }}
// //           >
// //             <Button
// //               asChild
// //               size="lg"
// //               className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8"
// //             >
// //               <Link to="/shop">
// //                 Shop Now <ArrowRight className="ml-2 h-4 w-4" />
// //               </Link>
// //             </Button>
// //           </motion.div>
// //         </div>
// //       </section>

// //       {/* Features */}
// //       <section className="container py-16">
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
// //           {[
// //             {
// //               icon: Truck,
// //               title: "Free Shipping",
// //               desc: "On orders over $500",
// //             },
// //             {
// //               icon: Shield,
// //               title: "Secure Payment",
// //               desc: "256-bit SSL encryption",
// //             },
// //             { icon: Hammer, title: "Handcrafted", desc: "Premium materials" },
// //             {
// //               icon: Headphones,
// //               title: "24/7 Support",
// //               desc: "Always here to help",
// //             },
// //           ].map((f, i) => (
// //             <motion.div
// //               key={f.title}
// //               initial={{ opacity: 0, y: 20 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               viewport={{ once: true }}
// //               transition={{ delay: i * 0.1, duration: 0.4 }}
// //               className="text-center p-6"
// //             >
// //               <f.icon className="h-8 w-8 mx-auto mb-3 text-accent" />
// //               <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
// //               <p className="text-xs text-muted-foreground">{f.desc}</p>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* Collections */}
// //       {collections && collections.length > 0 && (
// //         <section className="container pb-16">
// //           <div className="flex items-center justify-between mb-8">
// //             <h2 className="text-3xl font-display font-bold">Collections</h2>
// //             <Link
// //               to="/collections"
// //               className="text-sm text-accent hover:underline flex items-center gap-1"
// //             >
// //               View All <ArrowRight className="h-3 w-3" />
// //             </Link>
// //           </div>
// //           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
// //             {collections.slice(0, 5).map((c) => (
// //               <Link
// //                 key={c.id}
// //                 to={`/collections/${c.slug}`}
// //                 className="group relative aspect-[3/4] rounded-md overflow-hidden"
// //               >
// //                 <img
// //                   src={c.image_url || ""}
// //                   alt={c.name}
// //                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
// //                 />
// //                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
// //                 <div className="absolute bottom-4 left-4">
// //                   <h3 className="text-white font-semibold text-sm">{c.name}</h3>
// //                 </div>
// //               </Link>
// //             ))}
// //           </div>
// //         </section>
// //       )}

// //       {/* Featured */}
// //       {featured.length > 0 && (
// //         <section className="container pb-16">
// //           <h2 className="text-3xl font-display font-bold mb-8">Featured</h2>
// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
// //             {featured.map((p) => (
// //               <ProductCard
// //                 key={p.id}
// //                 id={p.id}
// //                 name={p.name}
// //                 slug={p.slug}
// //                 price={Number(p.price)}
// //                 image={p.images?.[0] || ""}
// //                 stock={p.stock}
// //               />
// //             ))}
// //           </div>
// //         </section>
// //       )}

// //       {/* Best Sellers */}
// //       {bestSellers.length > 0 && (
// //         <section className="container pb-16">
// //           <h2 className="text-3xl font-display font-bold mb-8">Best Sellers</h2>
// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
// //             {bestSellers.map((p) => (
// //               <ProductCard
// //                 key={p.id}
// //                 id={p.id}
// //                 name={p.name}
// //                 slug={p.slug}
// //                 price={Number(p.price)}
// //                 image={p.images?.[0] || ""}
// //                 stock={p.stock}
// //               />
// //             ))}
// //           </div>
// //         </section>
// //       )}

// //       {/* Newsletter */}
// //       <section className="bg-secondary py-20">
// //         <div className="container text-center max-w-xl mx-auto">
// //           <h2 className="text-3xl font-display font-bold mb-4">
// //             Stay Inspired
// //           </h2>
// //           <p className="text-muted-foreground mb-6">
// //             Get the latest collections and exclusive offers straight to your
// //             inbox.
// //           </p>
// //           <form
// //             onSubmit={(e) => {
// //               e.preventDefault();
// //             }}
// //             className="flex gap-2"
// //           >
// //             <input
// //               type="email"
// //               placeholder="Your email"
// //               className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-sm"
// //             />
// //             <Button
// //               type="submit"
// //               className="bg-accent text-accent-foreground hover:bg-accent/90"
// //             >
// //               Subscribe
// //             </Button>
// //           </form>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }
// import { useEffect, useState } from "react";
// import api from "@/lib/api";
// import ProductCard from "@/components/ProductCard";
// import { Link } from "react-router-dom";

// export default function Index() {
//   const [products, setProducts] = useState<any[]>([]);

//   useEffect(() => {
//     load();
//   }, []);

//   const load = async () => {
//     const res = await api.get("/products");
//     setProducts(res.data.products || res.data || [])
//   };

//   const featured = products.slice(0, 4);

//   return (
//     <div className="container py-10">

//       <h1 className="text-4xl font-bold mb-8">
//         Featured Products
//       </h1>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//         {featured.map((p) => (
//           <ProductCard key={p._id} product={p} />
//         ))}
//       </div>

//       <Link to="/shop" className="text-accent mt-6 inline-block">
//         View All →
//       </Link>

//     </div>
//   );
// }
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  Shield,
  Headphones,
  CreditCard,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.products || res.data || []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const featured = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-amber-700 border border-amber-200">
                <Sparkles className="h-4 w-4" />
                <span>Limited Time Offer - Up to 40% Off</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your
                <span className="block text-amber-600">Living Space</span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Discover premium furniture crafted with care. Create the home
                you've always dreamed of with our exclusive collection.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/shop">
                  <Button
                    size="lg"
                    className="bg-gray-900 hover:bg-gray-800 text-white h-14 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all group"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link to="/collections">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base font-semibold border-2 hover:bg-gray-50"
                  >
                    View Collections
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop"
                  alt="Beautiful living room"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-[200px] animate-float">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">36 Months</div>
                    <div className="text-sm text-gray-600">Warranty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our curated collections designed to fit every room and
              style
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Living Room",
                image:
                  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
                count: "120+ Items",
              },
              {
                name: "Bedroom",
                image:
                  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
                count: "85+ Items",
              },
              {
                name: "Dining",
                image:
                  "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop",
                count: "95+ Items",
              },
              {
                name: "Office",
                image:
                  "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop",
                count: "60+ Items",
              },
            ].map((category, idx) => (
              <Link
                key={idx}
                to={`/shop?category=${category.name.toLowerCase()}`}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-200">{category.count}</p>
                  <ChevronRight className="absolute top-6 right-6 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Handpicked collection of our best sellers
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold group"
            >
              View All Products
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featured.map((product, idx) => (
                <div
                  key={product._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Link to="/shop">
              <Button size="lg" variant="outline" className="w-full max-w-sm">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-4 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full group-hover:bg-amber-600 transition-colors duration-300">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Free Delivery</h3>
              <p className="text-gray-400">
                Free shipping on all orders across India
              </p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full group-hover:bg-amber-600 transition-colors duration-300">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">36 Month Warranty</h3>
              <p className="text-gray-400">
                Extended warranty on all furniture
              </p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full group-hover:bg-amber-600 transition-colors duration-300">
                <Headphones className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">24/7 Support</h3>
              <p className="text-gray-400">Dedicated customer service team</p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full group-hover:bg-amber-600 transition-colors duration-300">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Secure Payment</h3>
              <p className="text-gray-400">100% secure payment methods</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">
              Get 40% Off on Your First Order
            </h2>
            <p className="text-lg text-white/90">
              Subscribe to our newsletter and get exclusive deals and discounts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <Button className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold whitespace-nowrap">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
