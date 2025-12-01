import { apiClient } from "./apiClient";

export const notificationApi = {
    getAllNotifications: async (pageSize: number, page?: number) => {
        const params: any = {
            pageSize,
            ...(page && { page }),
        };

        return apiClient.api.notificationControllerFindAll(params);
    },
    getUnreadCount: async () => {
        return apiClient.api.notificationControllerGetTotalUnreadNotification();
    },
    markAsRead: async (notificationId: string) => {
        return apiClient.api.notificationControllerMarkRead(notificationId);
    },
    markAllAsRead: async () => {
        return apiClient.api.notificationControllerMarkAllRead();
    },
};
