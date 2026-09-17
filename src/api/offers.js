import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./client.js";

// Create buyer offer
export function useCreateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerData) => {
      return await api.post("/api/offers", offerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
}

// List offers (buyer or owner)
export function useOffers(params = {}) {
  return useQuery({
    queryKey: ["offers", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val) searchParams.append(key, val);
      });
      const url = `/api/offers${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const data = await api.get(url);
      return data.offers || [];
    },
  });
}

// Respond to offer (ACCEPT, COUNTER, REJECT)
export function useRespondOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action, counterAmount, counterNote }) => {
      return await api.patch(`/api/offers/${id}/respond`, {
        action,
        counterAmount,
        counterNote,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
