import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface WishlistContextType {
  wishlistCount: number;
  wishlistItems: string[];
  refreshWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<boolean>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  const refreshWishlist = async () => {
    if (!user) {
      setWishlistCount(0);
      setWishlistItems([]);
      return;
    }

    try {
      const res = await api.get("/wishlist");
      const list = res.data ?? [];
      setWishlistCount(list.length);
      setWishlistItems(
        list.map((item: any) =>
          typeof item.productId === "object" ? item.productId._id : item.productId
        )
      );
    } catch (err) {
      console.error("Wishlist fetch failed");
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      return false;
    }

    const currentlyListed = isInWishlist(productId);
    try {
      if (currentlyListed) {
        await api.delete("/wishlist", { data: { productId } });
        setWishlistItems((prev) => prev.filter((id) => id !== productId));
        setWishlistCount((prev) => Math.max(0, prev - 1));
        toast.success("Removed from wishlist");
        return false;
      } else {
        await api.post("/wishlist", { productId });
        setWishlistItems((prev) => [...prev, productId]);
        setWishlistCount((prev) => prev + 1);
        toast.success("Added to wishlist!");
        return true;
      }
    } catch {
      toast.error("Wishlist update failed");
      return currentlyListed;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        wishlistItems,
        refreshWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};