import { useQuery } from "@tanstack/react-query";
import { adminOrderApi } from "@/services/adminOrderApi";

export const useAdminOrders = (
    pageSize: number,
    page?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: "ASC" | "DESC",
    status?: string
) => {
    return useQuery({
        queryKey: ["adminOrders", pageSize, page, search, sortBy, sortOrder, status],
        queryFn: () => adminOrderApi.getAllOrders(pageSize, page, search, sortBy, sortOrder, status),
    });
};
