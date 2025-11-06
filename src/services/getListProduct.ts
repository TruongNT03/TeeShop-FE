import { apiClient } from "./apiClient";

export const productApi = {
  findDiscoverNewArrivals: async (
    query: Parameters<typeof apiClient.api.productControllerFindAll>[0]
  ) => apiClient.api.productControllerFindAll(query),

  findTopSeller: async (
    query: Parameters<typeof apiClient.api.productControllerFindAll>[0]
  ) => apiClient.api.productControllerFindAll(query),

  findById: async (id: string) =>
    apiClient.api.productControllerFindOne(id),

  findVariantOptions: async (id: string) =>
    apiClient.api.productControllerGetProductVariantValue(id),
};
