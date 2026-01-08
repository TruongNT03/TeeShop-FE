import type {
  AddItemToCartDto,
  UpdateQuantityCartItemDto,
  UpdateProductVariantCartItemDto,
} from "@/api";
import { apiClient } from "./apiClient";

export const cartApi = {
  addItem: async (data: AddItemToCartDto) =>
    apiClient.api.cartControllerAddItemToCart(data),

  getCartSummary: async () => apiClient.api.cartControllerGetCartSummary(),

  updateItemQuantity: async (id: string, data: UpdateQuantityCartItemDto) =>
    apiClient.api.cartControllerUpdateQuantityCartItem(id, data),

  updateItemVariant: async (
    id: string,
    data: UpdateProductVariantCartItemDto
  ) => apiClient.api.cartControllerUpdateProductVariantCartItem(id, data),

  deleteCartItem: async (id: string) =>
    apiClient.api.cartControllerDeleteCartItem(id),
};
