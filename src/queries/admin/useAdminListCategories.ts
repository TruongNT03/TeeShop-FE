import type { ListCategoryResponseDto } from "@/api";
import { apiClient } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { ADMIN_QUERY_KEY } from "./key";

export type AdminListCategoriesQuery = Parameters<
  typeof apiClient.api.adminCategoriesControllerFindAll
>[0];

export const useAdminListCategories = (query: AdminListCategoriesQuery) => {
  return useQuery<ListCategoryResponseDto>({
    queryKey: [ADMIN_QUERY_KEY.CATEGORIES.LIST_CATEGORIES],
    queryFn: async () =>
      (await apiClient.api.adminCategoriesControllerFindAll(query)).data,
  });
};
