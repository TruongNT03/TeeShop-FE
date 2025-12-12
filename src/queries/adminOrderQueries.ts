import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrderApi } from "@/services/adminOrderApi";

export const useAdminOrders = (
  pageSize: number,
  page?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: "ASC" | "DESC",
  status?: string
) => {
  return useQuery({
    queryKey: [
      "adminOrders",
      pageSize,
      page,
      search,
      sortBy,
      sortOrder,
      status,
    ],
    queryFn: () =>
      adminOrderApi.getAllOrders(
        pageSize,
        page,
        search,
        sortBy,
        sortOrder,
        status
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

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "pending" | "confirmed" | "shipping" | "completed";
    }) => adminOrderApi.updateOrderStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["adminOrder", id] });
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
  });
};
