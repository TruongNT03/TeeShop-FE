import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";

export const useCheckout = (cartItemIds: string[]) => {
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["checkoutItems", cartItemIds],
    queryFn: async () => {
      if (cartItemIds.length === 0) {
        return [];
      }

      // Fetch all cart items and filter by IDs
      const response = await apiClient.api.cartControllerGetAllCartItem({
        pageSize: 100, // Get enough items
      });

      const allItems = response.data.data;

      // Filter only selected items
      return allItems.filter((item: any) => cartItemIds.includes(item.id));
    },
    enabled: cartItemIds.length > 0,
  });

  return {
    checkoutItems: data || [],
    isCheckoutItemsLoading: isLoading,
    isCheckoutItemsSuccess: isSuccess,
    checkoutItemsError: error,
  };
};
