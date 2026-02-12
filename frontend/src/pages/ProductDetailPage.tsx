import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const { addItem } = useCart();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square rounded-md bg-secondary animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-secondary animate-pulse rounded" />
            <div className="h-6 w-1/3 bg-secondary animate-pulse rounded" />
            <div className="h-20 bg-secondary animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-display font-bold mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-accent hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"];
  const sizes = product.sizes?.length ? product.sizes : [];

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addItem({ product_id: product.id, name: product.name, price: Number(product.price), image: images[0], size: selectedSize || undefined, quantity });
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = async () => {
    if (!user) { toast.error("Please sign in"); return; }
    const { error } = await supabase.from("wishlist").upsert({ user_id: user.id, product_id: product.id }, { onConflict: "user_id,product_id" });
    if (error) toast.error("Error adding to wishlist");
    else toast.success("Added to wishlist");
  };

  return (
    <div className="container py-10">
      <Link to="/shop" className="text-sm text-accent hover:underline mb-6 inline-block">← Back to Shop</Link>
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="aspect-square rounded-md overflow-hidden bg-secondary mb-3">
            <img src={images[mainImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setMainImage(i)} className={`w-16 h-16 rounded-md overflow-hidden border-2 ${i === mainImage ? "border-accent" : "border-transparent"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          {product.collections && (
            <p className="text-sm text-accent mb-2">{(product.collections as any).name}</p>
          )}
          <h1 className="text-3xl font-display font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">${Number(product.price).toLocaleString()}</p>
          <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

          {/* Stock */}
          <div className="mb-4">
            {product.stock > 0 ? (
              <span className="text-sm font-medium" style={{ color: "hsl(142, 71%, 45%)" }}>✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-sm text-destructive font-medium">Out of Stock</span>
            )}
          </div>

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Size</Label>
              <div className="flex gap-2">
                {sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`px-4 py-2 rounded-md border text-sm transition-colors ${selectedSize === s ? "border-accent bg-accent/10 text-accent" : "border-input hover:border-foreground"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Quantity</Label>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button variant="outline" onClick={handleWishlist}>
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={className} {...props}>{children}</label>;
}
