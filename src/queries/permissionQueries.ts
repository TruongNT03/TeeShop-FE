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
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
