import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/services/notificationApi";
import { isAuthenticated } from "@/utils/auth";

export const useNotifications = (pageSize: number, page?: number) => {
  return useQuery({
    queryKey: ["notifications", pageSize, page],
    queryFn: () => notificationApi.getAllNotifications(pageSize, page),
    enabled: isAuthenticated(),
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ["notificationUnreadCount"],
    queryFn: () => notificationApi.getUnreadCount(),
    enabled: isAuthenticated(),
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationUnreadCount"] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationUnreadCount"] });
    },
  });
};
