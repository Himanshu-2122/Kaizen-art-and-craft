import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PLACEHOLDER_PRODUCTS } from "@/lib/constants";
import { Product } from "@/types";

export interface ProductFilters {
  collection_id?: string;
  category?: string;
  bestSeller?: boolean;
  featured?: boolean;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  limit?: number;
  page?: number;
}

export function useProducts(filters?: ProductFilters) {
  return useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: async () => {
      try {
        const params: Record<string, unknown> = {};
        if (filters?.collection_id) params.collectionId = filters.collection_id;
        if (filters?.category) params.category = filters.category;
        if (filters?.bestSeller !== undefined) params.bestSeller = filters.bestSeller;
        if (filters?.featured !== undefined) params.featured = filters.featured;
        if (filters?.inStock) params.inStock = true;
        if (filters?.minPrice !== undefined) params.minPrice = filters.minPrice;
        if (filters?.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
        if (filters?.search) params.search = filters.search;
        if (filters?.limit) params.limit = filters.limit;
        if (filters?.page) params.page = filters.page;
        if (filters?.sort) params.sort = filters.sort;

        const res = await api.get("/products", { params });
        const raw = res.data;
        const products: Product[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.products)
          ? raw.products
          : [];

        if (products.length > 0) return products;
      } catch (err) {
        console.warn("API /products call failed, falling back to local dataset:", err);
      }

      // Safe local fallback
      let list = PLACEHOLDER_PRODUCTS.map((p, idx) => ({
        _id: String(idx + 1),
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price * 80, // convert mock usd to inr
        mrpPrice: Math.round(p.price * 80 * 1.3),
        discountPercentage: 23,
        images: [p.image],
        category: p.collection,
        stock: p.stock,
        bestSeller: p.best_seller,
        featured: p.featured,
        averageRating: 4.6,
        numReviews: 24,
      }));

      if (filters?.category) {
        list = list.filter((p) => p.category === filters.category);
      }
      if (filters?.bestSeller) {
        list = list.filter((p) => p.bestSeller);
      }
      if (filters?.limit) {
        list = list.slice(0, filters.limit);
      }
      return list as unknown as Product[];
    },
    staleTime: 1000 * 60 * 3,
  });
}

export function useProduct(slug: string) {
  return useQuery<Product | null>({
    queryKey: ["product", slug],
    queryFn: async () => {
      try {
        const res = await api.get(`/products/slug/${slug}`);
        if (res.data) return res.data;
      } catch {
        // fallback
      }
      const match = PLACEHOLDER_PRODUCTS.find((p) => p.slug === slug);
      if (match) {
        return {
          _id: slug,
          name: match.name,
          slug: match.slug,
          description: match.description,
          price: match.price * 80,
          mrpPrice: Math.round(match.price * 80 * 1.3),
          discountPercentage: 23,
          images: [match.image],
          category: match.collection,
          stock: match.stock,
          bestSeller: match.best_seller,
          featured: match.featured,
          averageRating: 4.6,
          numReviews: 24,
        } as unknown as Product;
      }
      return null;
    },
    enabled: !!slug,
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      try {
        const res = await api.get("/categories");
        const data = res.data;
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.categories)) return data.categories;
        if (Array.isArray(data?.collections)) return data.collections;
      } catch {
        // fallback
      }
      return [];
    },
  });
}
