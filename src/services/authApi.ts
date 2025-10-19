import type { LoginDto, ForgotPasswordDto, VerifyForgotPasswordDto } from "@/api";
import { apiClient } from "./apiClient";

export const authApi = {
  login: async (data: LoginDto) => apiClient.api.authControllerLogin(data),
  forgotPassword: async (data: ForgotPasswordDto) =>
    apiClient.api.authControllerForgotPassword(data),

  verifyForgotPassword: async (token: string, data: VerifyForgotPasswordDto) =>
    apiClient.api.authControllerVerifyForgotPassword(token, data),
};
