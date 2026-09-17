import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./client.js";

// Submit enquiry for a listing
export function useCreateEnquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enquiryData) => {
      return await api.post("/api/enquiries", enquiryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
  });
}

// Fetch enquiries (for user or owner)
export function useEnquiries(params = {}) {
  return useQuery({
    queryKey: ["enquiries", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val) searchParams.append(key, val);
      });
      const url = `/api/enquiries${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const data = await api.get(url);
      return data.enquiries || [];
    },
    enabled: Boolean(params.userId || params.ownerId || params.propertyId),
  });
}

// Update enquiry status (NEW, REPLIED, CLOSED)
export function useUpdateEnquiryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      return await api.patch(`/api/enquiries/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
  });
}

// Reply to an enquiry with a message
export function useReplyToEnquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, replyMessage }) => {
      return await api.post(`/api/enquiries/${id}/reply`, { replyMessage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
  });
}
