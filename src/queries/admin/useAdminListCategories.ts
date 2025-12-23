import type { ListCategoryResponseDto } from "@/api";
import { apiClient } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export interface AdminListCategoriesQuery {
  page?: number;
  pageSize: number;
  search?: string;
  sortBy?: "title" | "createdAt";
  orderBy?: "DESC" | "ASC";
}

export const useAdminListCategories = (query: AdminListCategoriesQuery) => {
  return useQuery<ListCategoryResponseDto>({
    queryKey: ["adminListCategories"],
    queryFn: async () =>
      (await apiClient.api.adminCategoriesControllerFindAll(query)).data,
  });
};
