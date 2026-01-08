import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "./key";
import { apiClient } from "@/services/apiClient";
import { type ProductVariantValueResponseDto } from "@/api";

export function useProductVariantValue(productId: string) {
  return useQuery<ProductVariantValueResponseDto[]>({
    queryKey: [QUERY_KEY.PRODUCT.VARIANT_VALUE, productId],
    queryFn: async () => {
      const response =
        await apiClient.api.productControllerGetProductVariantValue(productId);
      return response.data;
    },
    enabled: !!productId,
  });
}
