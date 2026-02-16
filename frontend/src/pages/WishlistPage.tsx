import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function WishlistPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    if (!user) return;

    const res = await api.get("/wishlist");
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, [user]);

  const remove = async (productId: string) => {
    await api.delete("/wishlist", {
      data: {
        userId: user.id,
        productId,
      },
    });

    toast.success("Removed");
    load();
  };

  return (
    <div className="container py-10">

      <h1 className="text-3xl font-bold mb-6">Wishlist</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => {
          const p = item.productId;

          return (
            <div key={item._id} className="relative">

              <ProductCard product={p} />

              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 left-2"
                onClick={() => remove(p._id)}
              >
                Remove
              </Button>

            </div>
          );
        })}
      </div>
    </div>
  );
}
