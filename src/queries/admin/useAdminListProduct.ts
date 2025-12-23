import type { ListProductResponseDto } from "@/api";
import { apiClient } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export interface AdminListProductQuery {
  page?: number;
  pageSize: number;
  categoriesIds?: number[];
  search?: string;
  sortBy?: "name" | "description" | "status" | "createdAt" | "updatedAt";
  sortOrder?: "DESC" | "ASC";
}

export const useAdminListProduct = (query: AdminListProductQuery) => {
  return useQuery<ListProductResponseDto>({
    queryKey: ["adminListProduct", query],
    queryFn: async () =>
      (await apiClient.api.adminProductControllerFindAll(query)).data,
    placeholderData: (previousData) => previousData,
  });
};
