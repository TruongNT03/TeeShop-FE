import { apiClient } from "./apiClient";

export const adminProductApi = {
  findAll: async (
    query: Parameters<typeof apiClient.api.adminProductControllerFindAll>[0]
  ) => apiClient.api.adminProductControllerFindAll(query),

  findAllCategories: async (
    query: Parameters<typeof apiClient.api.adminCategoriesControllerFindAll>[0]
  ) => apiClient.api.adminCategoriesControllerFindAll(query),
};
