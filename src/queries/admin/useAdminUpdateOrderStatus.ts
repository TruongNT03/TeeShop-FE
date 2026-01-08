import type { AdminUpdateOrderStatusDto } from "@/api";
import { apiClient } from "@/services/apiClient";
import { useMutation } from "@tanstack/react-query";
import { ADMIN_MUTATION_KEY } from "./key";

export const useAdminOrderStatus = () => {
  return useMutation({
    mutationKey: [ADMIN_MUTATION_KEY.ORDER.UPDATE_STATUS],
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: AdminUpdateOrderStatusDto;
    }) => await apiClient.api.adminOrderControllerUpdateOrderStatus(id, data),
  });
};
