import { apiClient } from "./apiClient";

export const adminOrderApi = {
    getAllOrders: async (
        pageSize: number,
        page?: number,
        search?: string,
        sortBy?: string,
        sortOrder?: "ASC" | "DESC",
        status?: string
    ) => {
        const params: any = {
            pageSize,
            ...(page && { page }),
            ...(search && { search }),
            ...(sortBy && { sortBy }),
            ...(sortOrder && { sortOrder }),
            ...(status && { status }),
        };

        return apiClient.api.adminOrderControllerFindAll(params);
    },
    getOrder: async (id: string) => {
        return apiClient.api.adminOrderControllerFindOne(id);
    },
    updateOrderStatus: async (id: string, status: "pending" | "confirmed" | "shipping" | "completed") => {
        return apiClient.api.adminOrderControllerUpdateOrderStatus(id, { status });
    },
};
