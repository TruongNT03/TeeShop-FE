import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/services/login";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    const response = await login(data);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  });

  return {
    isRememberMe,
    setIsRememberMe,
    form,
    onSubmit,
    isShowPassword,
    setIsShowPassword,
    isLoading,
    setIsLoading,
  };
};
