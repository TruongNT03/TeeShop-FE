import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../services/apiClient";
import { useAuth } from "../hooks/useAuth";

export const useGetRolePermissions = (query: {
  page: number;
  pageSize: number;
  role?: "Admin" | "User" | "Product Manager" | "Order Manager" | "Technician";
  module?:
    | "Product"
    | "User"
    | "Category"
    | "Order"
    | "Voucher"
    | "Chatbot"
    | "Location";
}) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["adminRolePermissions", query],
    queryFn: async () => {
      const response = await apiClient.api.adminRolePermissionControllerFindAll(
        query
      );
      return response.data;
    },
    enabled: !!accessToken,
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      permissions: {
        id: string;
        isCreate: boolean;
        isRead: boolean;
        isUpdate: boolean;
        isDelete: boolean;
      }[]
    ) => {
      const response =
        await apiClient.api.adminRolePermissionControllerUpdateList(
          permissions
        );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminRolePermissions"] });
    },
  });
};
