import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserResponseDto, UpdateProfileDto } from "@/api";
import { apiClient } from "@/services/apiClient";

export const useProfile = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery<UserResponseDto>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await apiClient.api.authControllerGetProfile();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateProfileDto) =>
      apiClient.api.authControllerUpdateProfile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      // Step 1: Get presigned URL
      const fileName = encodeURI(file.name);
      const contentType = "image/jpeg";

      console.log("Starting avatar upload:", {
        fileName,
        contentType,
        fileSize: file.size,
      });

      const uploadRes = await apiClient.api.authControllerUploadAvatar({
        fileName,
        contentType,
      });

      console.log("Got presigned URL:", uploadRes.data);

      // Step 2: Upload file to presigned URL
      const presignUrl = uploadRes.data.presignUrl;
      console.log("Uploading to presigned URL...");

      const uploadResult = await fetch(presignUrl, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: file,
      });

      if (!uploadResult.ok) {
        throw new Error(`Upload failed: ${uploadResult.statusText}`);
      }

      console.log("File uploaded successfully");

      // Step 3: Return the file URL
      const fileUrl = uploadRes.data.fileUrl;
      console.log("Avatar upload complete, fileUrl:", fileUrl);

      return fileUrl;
    },
    onError: (error) => {
      console.error("Avatar upload error:", error);
    },
  });

  return {
    profile: profileQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error as Error | null,
    refetch: profileQuery.refetch,
    updateProfile: (payload: UpdateProfileDto) =>
      updateMutation.mutateAsync(payload),
    isUpdating: updateMutation.isPending,
    uploadAvatar: (file: File) => uploadAvatarMutation.mutateAsync(file),
    isUploadingAvatar: uploadAvatarMutation.isPending,
  };
};
