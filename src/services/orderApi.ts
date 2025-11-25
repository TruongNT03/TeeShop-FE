import { apiClient } from "./apiClient";

export const orderApi = {
  getAllOrders: async (pageSize: number, page?: number) =>
    apiClient.api.orderControllerGetAllOrder({ pageSize, page }),
};
