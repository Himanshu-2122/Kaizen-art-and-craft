import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlistCount: number;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: any) => {
  const { user } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshWishlist = async () => {
    if (!user) {
      setWishlistCount(0);
      return;
    }

    try {
      const res = await api.get("/wishlist");
      setWishlistCount(res.data.length);
    } catch (err) {
      console.error("Wishlist fetch failed");
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  return (
    <WishlistContext.Provider value={{ wishlistCount, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};
