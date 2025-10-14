import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { LoginDto } from "@/api";
import { loginMutation } from "@/queries/authQueries";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navitage = useNavigate();

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
      onSuccess: () => {
        navitage("/");
      },
      onError: (error) => {
        toast(error.message);
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
