import type { ListProductResponseDto } from "@/api";
import { apiClient } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { ADMIN_QUERY_KEY } from "./key";

export type AdminListProductQuery = Parameters<
  typeof apiClient.api.adminProductControllerFindAll
>[0];

export const useAdminListProduct = (query: AdminListProductQuery) => {
  return useQuery<ListProductResponseDto>({
    queryKey: [ADMIN_QUERY_KEY.PRODUCT.LIST_PRODUCT, query],
    queryFn: async () =>
      (await apiClient.api.adminProductControllerFindAll(query)).data,
    placeholderData: (previousData) => previousData,
  });
};
