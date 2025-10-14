import { authApi } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const loginMutation = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
    },
    onError: (error) => {
      toast(error.message);
    },
  });
};
