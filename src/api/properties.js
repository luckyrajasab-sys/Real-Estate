import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./client.js";
import { properties as fallbackProperties } from "../data/properties.js";

// Fetch filtered properties list
export function useProperties(params = {}) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== "" && val !== "All") {
            queryParams.append(key, val);
          }
        });
        const url = `/api/properties${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        const data = await api.get(url);
        return data.properties || [];
      } catch (err) {
        console.warn("API request failed, falling back to local dataset:", err.message);
        // Fallback filtering to ensure zero UI disruption
        return fallbackProperties.filter((p) => {
          if (params.type && p.type.toLowerCase() !== params.type.toLowerCase()) return false;
          if (params.q && !(p.title + p.location).toLowerCase().includes(params.q.toLowerCase())) return false;
          return true;
        });
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Fetch featured properties for homepage
export function useFeaturedProperties() {
  return useQuery({
    queryKey: ["properties", "featured"],
    queryFn: async () => {
      try {
        const data = await api.get("/api/properties/featured");
        return data.properties || [];
      } catch (err) {
        console.warn("Featured API failed, using fallback:", err.message);
        return fallbackProperties.slice(0, 3);
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch single property by id
export function useProperty(id) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const data = await api.get(`/api/properties/${id}`);
        return data.property;
      } catch (err) {
        console.warn(`Property ${id} API failed, checking fallback:`, err.message);
        const fallback = fallbackProperties.find((p) => p.id === id);
        if (fallback) return fallback;
        throw err;
      }
    },
    enabled: Boolean(id),
  });
}

// Create new property listing
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProperty) => {
      return await api.post("/api/properties", newProperty);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

// Update property listing
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      return await api.put(`/api/properties/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
    },
  });
}

// Delete property listing
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/api/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}
