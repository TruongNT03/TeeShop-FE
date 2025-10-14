import type { LoginDto } from "@/api";
import { apiClient } from "./apiClient";

export const authApi = {
  login: async (data: LoginDto) => apiClient.api.authControllerLogin(data),
};
