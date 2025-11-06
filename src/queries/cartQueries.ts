import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "@/services/cartApi";
import type { AddItemToCartDto, UpdateQuantityCartItemDto } from "@/api";

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

export const getCartSummaryQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["cartSummary"],
    queryFn: () => cartApi.getCartSummary(),
    enabled: enabled,
  });
};

export const updateCartItemQuantityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateCartItemQuantity"],
    mutationFn: ({ id, data }: { id: string; data: UpdateQuantityCartItemDto }) =>
      cartApi.updateItemQuantity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartSummary"] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật số lượng thất bại.");
    },
  });
};

export const deleteCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteCartItem"],
    mutationFn: (id: string) => cartApi.deleteCartItem(id),
    onSuccess: () => {
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
      queryClient.invalidateQueries({ queryKey: ["cartSummary"] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa sản phẩm thất bại.");
    },
  });
};