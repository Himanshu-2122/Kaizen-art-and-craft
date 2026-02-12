import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function WishlistPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from("wishlist")
      .select("*, products(*)")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, [user]);

  const removeFromWishlist = async (wishlistId: string) => {
    await supabase.from("wishlist").delete().eq("id", wishlistId);
    setItems((prev) => prev.filter((i) => i.id !== wishlistId));
    toast.success("Removed from wishlist");
  };

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-display font-bold mb-2">Your Wishlist</h1>
        <p className="text-muted-foreground mb-6">Sign in to save your favorite items.</p>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/auth">Sign In</Link></Button>
      </div>
    );
  }

  if (loading) return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-display font-bold mb-2">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-6">Browse our shop and save items you love.</p>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/shop">Browse Shop</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-display font-bold mb-8">Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => {
          const p = item.products;
          if (!p) return null;
          return (
            <div key={item.id} className="relative">
              <ProductCard id={p.id} name={p.name} slug={p.slug} price={Number(p.price)} image={p.images?.[0] || ""} stock={p.stock} />
              <Button variant="destructive" size="sm" className="absolute top-2 left-2 z-10" onClick={() => removeFromWishlist(item.id)}>
                Remove
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
