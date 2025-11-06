import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "@/services/cartApi";
import type { AddItemToCartDto } from "@/api";

export const addItemToCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addToCart"],
    mutationFn: (data: AddItemToCartDto) => cartApi.addItem(data),
    onSuccess: () => {
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      queryClient.invalidateQueries({ queryKey: ["cartSummary"] });
    },
    onError: (error) => {
      toast.error(error.message || "Thêm vào giỏ hàng thất bại.");
    },
  });
};