import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MUTATION_KEY, QUERY_KEY } from "./key";
import { apiClient } from "@/services/apiClient";
import type { UpdateProductVariantCartItemDto } from "@/api";

export type UpdateVariantValueCartItemDto = {
  id: string;
  data: UpdateProductVariantCartItemDto;
};

export function useUpdateVariantValueCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_KEY.CART.UPDATE_VARIANT_VALUE],
    mutationFn: async (dto: UpdateVariantValueCartItemDto) => {
      const { id, data } = dto;
      const response =
        await apiClient.api.cartControllerUpdateProductVariantCartItem(
          id,
          data
        );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cartItems"] }),
  });
}
