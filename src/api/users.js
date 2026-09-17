import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./client.js";

// Fetch user profile and summary statistics
export function useUserProfile(emailOrId) {
  return useQuery({
    queryKey: ["userProfile", emailOrId],
    queryFn: async () => {
      if (!emailOrId) return null;
      const param = emailOrId.includes("@") ? `email=${encodeURIComponent(emailOrId)}` : `userId=${emailOrId}`;
      const data = await api.get(`/api/users/profile?${param}`);
      return data;
    },
    enabled: Boolean(emailOrId),
  });
}

// Update user profile (name, phone)
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ emailOrId, data }) => {
      const param = emailOrId.includes("@") ? `email=${encodeURIComponent(emailOrId)}` : `userId=${emailOrId}`;
      return await api.put(`/api/users/profile?${param}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", variables.emailOrId] });
    },
  });
}

// Fetch user's saved properties
export function useSavedListings(userId) {
  return useQuery({
    queryKey: ["savedListings", userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await api.get(`/api/saved?userId=${userId}`);
      return data.savedListings || [];
    },
    enabled: Boolean(userId),
  });
}

// Toggle save property
export function useToggleSaved() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, userId }) => {
      return await api.post(`/api/saved/${propertyId}`, { userId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["savedListings", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["propertySavedCheck", variables.propertyId] });
    },
  });
}
