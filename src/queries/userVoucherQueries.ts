import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import type { ListVoucherResponseDto, TakeVoucherDto } from "@/api/index";

export const useUserVouchersQuery = (page: number, pageSize: number) => {
  return useQuery<ListVoucherResponseDto>({
    queryKey: ["user-vouchers", page, pageSize],
    queryFn: async () => {
      const response = await apiClient.api.voucherControllerFindAll({
        page,
        pageSize,
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const usePersonalVouchersQuery = (page: number, pageSize: number) => {
  return useQuery<ListVoucherResponseDto>({
    queryKey: ["personal-vouchers", page, pageSize],
    queryFn: async () => {
      const response =
        await apiClient.api.voucherControllerFindAllPersonalVoucher({
          page,
          pageSize,
        });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useClaimVoucherMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TakeVoucherDto) => {
      const response = await apiClient.api.voucherControllerTakeVoucher(data);
      return response.data;
    },
    onSuccess: () => {
      // Refetch danh sách vouchers để cập nhật isClaim
      queryClient.invalidateQueries({ queryKey: ["user-vouchers"] });
      queryClient.invalidateQueries({ queryKey: ["personal-vouchers"] });
    },
  });
};
