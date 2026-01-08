import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { LoginDto } from "@/api";
import { loginMutation } from "@/queries/authQueries";
import { RoleType, type UserRequestPayload } from "@/types/userRequestPayload";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = loginMutation();

  const onSubmit = form.handleSubmit((formData) => {
    mutation.mutate(formData, {
      onSuccess: (response) => {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        const user: UserRequestPayload = jwtDecode<UserRequestPayload>(
          response.data.accessToken
        );
        const adminRoles = [
          RoleType.ADMIN,
          RoleType.PRODUCT_MANAGER,
          RoleType.ORDER_MANAGER,
          RoleType.TECHNICIAN,
        ];
        const isAdmin = user.roles?.some((role) => adminRoles.includes(role));
        if (isAdmin) {
          return (window.location.href = "/admin");
        }
        navigate("/");
      },
      onError: (error) => {
        toast("Tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại.");
      },
    });
  });

  return {
    form,
    onSubmit,
    isRememberMe,
    setIsRememberMe,
    isShowPassword,
    setIsShowPassword,
    isLoading: mutation.isPending,
  };
};
