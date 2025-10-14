import type {
  VerifyForgotPasswordDto,
  RegisterDto,
  VerifyRegisterDto,
} from "@/api";
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

export const forgotPasswordMutation = () => {
  return useMutation({
    mutationKey: ["forgotPassword"],
    mutationFn: authApi.forgotPassword,
    onError: (error) => {
      toast.error(error.message || "Gửi email thất bại. Vui lòng thử lại.");
    },
  });
};

export const verifyForgotPasswordMutation = () => {
  return useMutation({
    mutationKey: ["verifyForgotPassword"],
    mutationFn: ({
      token,
      data,
    }: {
      token: string;
      data: VerifyForgotPasswordDto;
    }) => authApi.verifyForgotPassword(token, data),
    onError: (error) => {
      toast.error(error.message || "Mã OTP không hợp lệ hoặc đã hết hạn.");
    },
  });
};

export const registerMutation = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onError: (error) => {
      toast.error(
        error.message || "Đăng ký thất bại. Email có thể đã tồn tại."
      );
    },
  });
};

export const verifyRegisterMutation = () => {
  return useMutation({
    mutationKey: ["verifyRegister"],
    mutationFn: ({ token, data }: { token: string; data: VerifyRegisterDto }) =>
      authApi.verifyRegister(token, data),
    onError: (error) => {
      toast.error(error.message || "Mã OTP không hợp lệ hoặc đã hết hạn.");
    },
  });
};
