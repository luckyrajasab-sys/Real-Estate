import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./client.js";

export function useNotifications(userId) {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const url = userId ? `/api/notifications?userId=${userId}` : "/api/notifications";
      const data = await api.get(url);
      return data.notifications || [];
    },
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return await api.patch(`/api/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
