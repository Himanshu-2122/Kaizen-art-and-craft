import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { CollectionItem } from "@/types";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

export function useCategories() {
  return useQuery<CollectionItem[]>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get("/categories");
      const data = res.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.categories)) return data.categories;
      if (Array.isArray(data?.collections)) return data.collections;
      return [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes stale time
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: FormData | { name: string; description?: string; imageUrl?: string; isActive?: boolean }) => {
      const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
      const res = await api.post("/categories", payload, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData | Record<string, any> }) => {
      const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
      const res = await api.put(`/categories/${id}`, data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}
