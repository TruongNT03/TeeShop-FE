import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import { useAuth } from "@/hooks/useAuth";

export const useGetUserPermissions = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["userPermissions"],
    queryFn: async () => {
      const response =
        await apiClient.api.rolePermissionControllerGetSelfRolePermission();
      return response.data;
    },
    enabled: !!accessToken,
  });
};
