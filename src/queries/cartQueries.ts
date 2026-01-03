import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "@/services/cartApi";
import type {
  AddItemToCartDto,
  UpdateQuantityCartItemDto,
  UpdateProductVariantCartItemDto,
} from "@/api";
import { apiClient } from "@/services/apiClient";
import { isAuthenticated } from "@/utils/auth";
import { QUERY_KEY } from "./user/key";

export const addItemToCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addToCart"],
    mutationFn: (data: AddItemToCartDto) => cartApi.addItem(data),
    onSuccess: () => {
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CART.SUMMARY] });
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
    onError: (error) => {
      toast.error(error.message || "Thêm vào giỏ hàng thất bại.");
    },
  });
};

export const getCartSummaryQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.CART.SUMMARY],
    queryFn: () => apiClient.api.cartControllerGetCartSummary(),
    enabled: isAuthenticated(),
  });
};

export const updateCartItemQuantityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateCartItemQuantity"],
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateQuantityCartItemDto;
    }) => cartApi.updateItemQuantity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartSummary"] });
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật số lượng thất bại.");
    },
  });
};

export const updateCartItemVariantMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateCartItemVariant"],
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductVariantCartItemDto;
    }) => cartApi.updateItemVariant(id, data),
    onSuccess: () => {
      toast.success("Đã cập nhật phân loại sản phẩm.");
      queryClient.invalidateQueries({ queryKey: ["cartSummary"] });
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật phân loại thất bại.");
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
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa sản phẩm thất bại.");
    },
  });
};

export const findAllCartItemsQuery = (
  query: Parameters<typeof apiClient.api.cartControllerGetAllCartItem>[0]
) => {
  return useInfiniteQuery({
    queryKey: ["cartItems", query],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      apiClient.api.cartControllerGetAllCartItem({
        ...query,
        page: pageParam,
      }),
    getNextPageParam: (lastPage: any) => {
      const page = lastPage.data.paginate.page;
      const total = lastPage.data.paginate.totalPage;
      return page < total ? page + 1 : undefined;
    },
  });
};

export const getProductVariantValue = (productId: string) => {
  return useQuery({
    queryKey: ["getProductVariantValue"],
    queryFn: () =>
      apiClient.api
        .productControllerGetProductVariantValue(productId)
        .then((res) => res.data),
  });
};
