import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/services/apiClient";
import type { CreateOrderFromCartDto } from "@/api";
import { orderApi } from "@/services/orderApi";
import { isAuthenticated } from "@/utils/auth";

export const getOrdersQuery = (pageSize: number, page?: number) => {
  return useQuery({
    queryKey: ["orders", pageSize, page],
    queryFn: () => orderApi.getAllOrders(pageSize, page),
    enabled: isAuthenticated(),
  });
};

export const createOrderFromCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createOrder"],
    mutationFn: (data: CreateOrderFromCartDto) =>
      apiClient.api.orderControllerCreateOrderFromCart(data),
    onSuccess: (response) => {
      toast.success("Đặt hàng thành công!");
      // Invalidate cart queries to refresh cart data
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      queryClient.invalidateQueries({ queryKey: ["cartSummary"] });
      // Invalidate orders to show new order
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Clear selected cart items from localStorage
      localStorage.removeItem("selectedCartItemIds");
      return response;
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Đặt hàng thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    },
  });
};
