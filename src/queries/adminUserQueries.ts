import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "@/services/adminUserApi";
import { toast } from "sonner";

export const useAdminUsers = (
  pageSize: number,
  page?: number,
  search?: string,
  sortBy?: "email" | "createdAt",
  sortOrder?: "ASC" | "DESC",
  roleType?: "user" | "admin"
) => {
  return useQuery({
    queryKey: [
      "adminUsers",
      pageSize,
      page,
      search,
      sortBy,
      sortOrder,
      roleType,
    ],
    queryFn: () =>
      adminUserApi.getAllUsers(
        pageSize,
        page,
        search,
        sortBy,
        sortOrder,
        roleType
      ),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateAdminUser = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUserApi.createAdminUser,
    onSuccess: () => {
      toast.success("Tạo tài khoản admin thành công");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};
