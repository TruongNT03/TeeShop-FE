import type {
  LoginDto,
  ForgotPasswordDto,
  VerifyForgotPasswordDto,
  RegisterDto,
  VerifyRegisterDto,
} from "@/api";
import { apiClient } from "./apiClient";

export const authApi = {
  login: async (data: LoginDto) => apiClient.api.authControllerLogin(data),

  forgotPassword: async (data: ForgotPasswordDto) =>
    apiClient.api.authControllerForgotPassword(data),

  verifyForgotPassword: async (token: string, data: VerifyForgotPasswordDto) =>
    apiClient.api.authControllerVerifyForgotPassword(token, data),

  register: async (data: RegisterDto) =>
    apiClient.api.authControllerRegister(data),

  verifyRegister: async (token: string, data: VerifyRegisterDto) =>
    apiClient.api.authControllerVerifyRegister(token, data),
};
