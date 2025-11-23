import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/services/apiClient";
import type { CreateOrderFromCartDto } from "@/api";

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
