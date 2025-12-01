import { useQuery } from "@tanstack/react-query";
import { adminUserApi } from "@/services/adminUserApi";

export const useAdminUsers = (
    pageSize: number,
    page?: number,
    search?: string,
    sortBy?: "email" | "createdAt",
    sortOrder?: "ASC" | "DESC"
) => {
    return useQuery({
        queryKey: ["adminUsers", pageSize, page, search, sortBy, sortOrder],
        queryFn: () => adminUserApi.getAllUsers(pageSize, page, search, sortBy, sortOrder),
    });
};
