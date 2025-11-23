import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProfileDto } from "@/api";
import { apiClient } from "@/services/apiClient";
import { getProfileQuery } from "@/queries/authQueries";

export const useProfile = () => {
  const queryClient = useQueryClient();

  const profileQuery = getProfileQuery();

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateProfileDto) => {
      const res = await apiClient.api.authControllerUpdateProfile(payload);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      console.error(
        "Failed to update profile:",
        error?.response?.data || error.message
      );
    },
  });

  return {
    profile: profileQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error as Error | null,
    refetch: profileQuery.refetch,
    updateProfile: async (payload: UpdateProfileDto) => {
      await updateMutation.mutateAsync(payload);
    },
    isUpdating: updateMutation.isPending,
  };
};
