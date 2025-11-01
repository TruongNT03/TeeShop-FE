import { adminProductApi } from "@/services/adminGetListProduct";
import type { apiClient } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export const getAllProductQuery = (
  query: Parameters<typeof apiClient.api.adminProductControllerFindAll>[0]
) => {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => adminProductApi.findAll(query),
  });
};

export const getAllCategoryQuery = (
  query: Parameters<typeof apiClient.api.adminCategoriesControllerFindAll>[0]
) => {
  return useQuery({
    queryKey: ["category", query],
    queryFn: () => adminProductApi.findAllCategories(query),
  });
};
