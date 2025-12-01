import { apiClient } from "./apiClient";

export const adminUserApi = {
    getAllUsers: async (
        pageSize: number,
        page?: number,
        search?: string,
        sortBy?: "email" | "createdAt",
        sortOrder?: "ASC" | "DESC"
    ) => {
        const params: any = {
            pageSize,
            ...(page && { page }),
            ...(search && { search }),
            ...(sortBy && { sortBy }),
            ...(sortOrder && { sortOrder }),
        };

        return apiClient.api.adminUserControllerFindAll(params);
    },
};
