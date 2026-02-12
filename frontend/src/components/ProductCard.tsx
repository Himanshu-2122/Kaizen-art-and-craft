import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
}

export default function ProductCard({ id, name, slug, price, image, stock }: ProductCardProps) {
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ product_id: id, name, price, image });
    toast.success(`${name} added to cart`);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to save items");
      return;
    }
    const { error } = await supabase.from("wishlist").upsert({ user_id: user.id, product_id: id }, { onConflict: "user_id,product_id" });
    if (error) toast.error("Could not add to wishlist");
    else toast.success("Added to wishlist");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
      <Link to={`/product/${slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-secondary mb-3">
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <button onClick={handleWishlist} className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors">
            <Heart className="h-4 w-4" />
          </button>
          {stock === 0 && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-sm font-medium">Out of Stock</span>
            </div>
          )}
        </div>
        <h3 className="font-medium text-sm mb-1 group-hover:text-accent transition-colors">{name}</h3>
        <p className="text-muted-foreground text-sm mb-2">${price.toLocaleString()}</p>
        {stock > 0 && (
          <Button onClick={handleAddToCart} variant="outline" size="sm" className="w-full">
            Add to Cart
          </Button>
        )}
      </Link>
    </motion.div>
  );
}
