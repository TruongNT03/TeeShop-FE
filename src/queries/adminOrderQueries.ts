import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrderApi } from "@/services/adminOrderApi";

export const useAdminOrders = (
  pageSize: number,
  page?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  orderStatusFilter?: string
) => {
  return useQuery({
    queryKey: [
      "adminOrders",
      pageSize,
      page,
      search,
      sortBy,
      sortOrder,
      orderStatusFilter,
    ],
    queryFn: () =>
      adminOrderApi.getAllOrders(
        pageSize,
        page,
        search,
        sortBy,
        sortOrder,
        orderStatusFilter
      ),
    placeholderData: (previousData) => previousData,
  });
};

export const useAdminOrder = (id: string) => {
  return useQuery({
    queryKey: ["adminOrder", id],
    queryFn: () => adminOrderApi.getOrder(id),
    enabled: !!id,
  });
};
