import type {
  CreateProductDto,
  UpdateProductDto, // Giữ lại để tham chiếu
  UpdateProductStatusDto,
  UploadDto,
} from "@/api";
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

  uploadProductImage: async (data: UploadDto) =>
    apiClient.api.adminProductControllerUploadProductImage(data),

  updateStatus: async (id: string, data: UpdateProductStatusDto) =>
    apiClient.api.adminProductControllerUpdateStatus(id, data),

  findById: async (id: string) =>
    apiClient.api.adminProductControllerFindOne(id),

  update: async (id: string, data: CreateProductDto) =>
    apiClient.api.adminProductControllerUpdate(id, data as any),
};