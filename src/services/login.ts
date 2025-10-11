import type { LoginFormData } from "@/hooks/useLogin";
import { apiClient } from "./apiClient";

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export const login = async (
  loginFormData: LoginFormData
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      loginFormData
    );
    if (response.status === 201) {
      console.log(response.data);
    }
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
