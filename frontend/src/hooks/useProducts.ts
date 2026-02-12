import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProducts(filters?: {
  collection_id?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let query = supabase.from("products").select("*, collections(name, slug)");

      if (filters?.collection_id) query = query.eq("collection_id", filters.collection_id);
      if (filters?.inStock) query = query.gt("stock", 0);
      if (filters?.minPrice !== undefined) query = query.gte("price", filters.minPrice);
      if (filters?.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
      if (filters?.search) query = query.ilike("name", `%${filters.search}%`);

      switch (filters?.sort) {
        case "price-asc": query = query.order("price", { ascending: true }); break;
        case "price-desc": query = query.order("price", { ascending: false }); break;
        case "latest": query = query.order("created_at", { ascending: false }); break;
        case "popular": query = query.order("best_seller", { ascending: false }); break;
        default: query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, collections(name, slug)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { data, error } = await supabase.from("collections").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}
