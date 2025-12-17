import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import type { AdminCreateVoucherDto } from "@/api";
import { toast } from "sonner";

// List vouchers query
export const useAdminVouchersQuery = (params: {
  page?: number;
  pageSize: number;
  search?: string;
  typeFilter?: "fixed" | "percent";
}) => {
  return useQuery({
    queryKey: ["admin-vouchers", params],
    queryFn: async () => {
      const response = await apiClient.api.adminVoucherControllerFindAll(
        params
      );
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

// Create voucher mutation
export const useCreateVoucherMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AdminCreateVoucherDto) => {
      const response = await apiClient.api.adminVoucherControllerCreate(data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Tạo voucher thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-vouchers"] });
    },
    onError: (error: any) => {
      const message =
        error?.error?.message || error?.message || "Tạo voucher thất bại";
      toast.error(message);
    },
  });
};
