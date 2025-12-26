import { useQuery } from "@tanstack/react-query";
import { ADMIN_QUERY_KEY } from "./key";
import { apiClient } from "@/services/apiClient";
import type { AdminListLocationResponseDto } from "@/api";

export type AdminListLocationQuery = Parameters<
  typeof apiClient.api.adminLocationControllerFindAll
>[0];

export const useAdminListLocation = (query: AdminListLocationQuery) => {
  return useQuery<AdminListLocationResponseDto>({
    queryKey: [ADMIN_QUERY_KEY.LOCATION.LIST_LOCATION],
    queryFn: async () =>
      (await apiClient.api.adminLocationControllerFindAll(query)).data,
  });
};
