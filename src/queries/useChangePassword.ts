import type { ChangePasswordDto } from "@/api";
import { apiClient } from "@/services/apiClient";
import { useMutation } from "@tanstack/react-query";
import { COMMON_QUERY_KEY } from "./key";

export const useChangePassword = () => {
  return useMutation({
    mutationKey: [COMMON_QUERY_KEY.AUTH.CHANGE_PASSWORD],
    mutationFn: async (data: ChangePasswordDto) =>
      (await apiClient.api.authControllerChangePassword(data)).data,
  });
};
