// src/services/adminGetListProduct.ts
import type { CreateProductDto } from "@/api";
import { apiClient } from "./apiClient";

export const adminProductApi = {
  findAll: async (
    query: Parameters<typeof apiClient.api.adminProductControllerFindAll>[0]
  ) => apiClient.api.adminProductControllerFindAll(query),

  findAllCategories: async (
    query: Parameters<typeof apiClient.api.adminCategoriesControllerFindAll>[0]
  ) => apiClient.api.adminCategoriesControllerFindAll(query),

  create: async (data: CreateProductDto) =>
    apiClient.api.adminProductControllerCreate(data),

  findAllVariants: async (
    query: Parameters<typeof apiClient.api.adminProductControllerFindAllVariant>[0]
  ) => apiClient.api.adminProductControllerFindAllVariant(query),

  findAllVariantValues: async (
    query: Parameters<
      typeof apiClient.api.adminProductControllerFindAllVariantValue
    >[0]
  ) => apiClient.api.adminProductControllerFindAllVariantValue(query),
};