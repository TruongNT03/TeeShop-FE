import { useQuery } from "@tanstack/react-query";
import { ADMIN_QUERY_KEY } from "./key";
import { apiClient } from "@/services/apiClient";
import { type AdminOrderDetailResponseDto } from "@/api";

export const useAdminOrderDetail = (id: string) => {
  return useQuery<AdminOrderDetailResponseDto>({
    queryKey: [ADMIN_QUERY_KEY.ORDER.FIND_ONE],
    queryFn: async () =>
      (await apiClient.api.adminOrderControllerFindOne(id)).data,
  });
};
