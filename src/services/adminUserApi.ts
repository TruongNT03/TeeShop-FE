import { apiClient } from "./apiClient";
import type { AdminCreateUserDto } from "@/api";

export const adminUserApi = {
  getAllUsers: async (
    pageSize: number,
    page?: number,
    search?: string,
    sortBy?: "email" | "createdAt",
    sortOrder?: "ASC" | "DESC",
    roleType?: "user" | "admin"
  ) => {
    const params: any = {
      pageSize,
      ...(page && { page }),
      ...(search && { search }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...(roleType && { roleType }),
    };

    return apiClient.api.adminUserControllerFindAll(params);
  },

  createAdminUser: async (data: AdminCreateUserDto) => {
    return apiClient.api.adminUserControllerCreate(data);
  },
};
