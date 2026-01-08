import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "./key";
import { apiClient } from "@/services/apiClient";
import { type ProductDetailResponseDto } from "@/api";

export function useProductDetail(productId: string) {
  return useQuery<ProductDetailResponseDto>({
    queryKey: [QUERY_KEY.PRODUCT.DETAIL, productId],
    queryFn: async () => {
      const response = await apiClient.api.productControllerFindOne(productId);
      return response.data;
    },
    enabled: !!productId,
  });
}
