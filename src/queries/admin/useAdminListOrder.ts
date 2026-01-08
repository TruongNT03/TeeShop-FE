import { useQuery } from "@tanstack/react-query";
import { ADMIN_QUERY_KEY } from "./key";
import { apiClient } from "@/services/apiClient";
import { type AdminListOrderResponseDto } from "@/api";

export type AdminListOrderQuery = Parameters<
  typeof apiClient.api.adminOrderControllerFindAll
>[0];

export const useAdminListOrder = (query: AdminListOrderQuery) => {
  return useQuery<AdminListOrderResponseDto>({
    queryKey: [ADMIN_QUERY_KEY.ORDER.FIND_ALL, query],
    queryFn: async () =>
      (await apiClient.api.adminOrderControllerFindAll(query)).data,
    placeholderData: (previousData) => previousData,
  });
};
