import type { ListUserProductResponseDto } from "@/api";
import { apiClient } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";

export type ListProductQuery = Parameters<
  typeof apiClient.api.productControllerFindAll
>[0];

export const useListProduct = (query: ListProductQuery) => {
  return useQuery<ListUserProductResponseDto>({
    queryKey: ["listProduct"],
    queryFn: async () =>
      (await apiClient.api.productControllerFindAll(query)).data,
  });
};
