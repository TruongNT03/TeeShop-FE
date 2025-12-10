import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";
import type { CreateReviewForOrderItemDto } from "@/api";

export const getProductReviewsQuery = (
  productId: string,
  page: number,
  pageSize: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["productReviews", productId, page, pageSize],
    queryFn: async () => {
      const response =
        await apiClient.api.reviewControllerFindAllReviewOfProduct(productId, {
          page,
          pageSize,
        });
      return response.data;
    },
    enabled,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      orderItemId,
      data,
    }: {
      orderId: string;
      orderItemId: string;
      data: CreateReviewForOrderItemDto;
    }) => {
      const response =
        await apiClient.api.reviewControllerCreateReviewForOrderItem(
          orderId,
          orderItemId,
          data
        );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productReviews"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Đánh giá sản phẩm thành công");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Có lỗi xảy ra khi đánh giá sản phẩm";
      toast.error(message);
    },
  });
};
