import type { AddItemToCartDto } from "@/api";
import { apiClient } from "./apiClient";

export const cartApi = {
  addItem: async (data: AddItemToCartDto) =>
    apiClient.api.cartControllerAddItemToCart(data),
};