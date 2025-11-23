import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/services/apiClient";
import type { CreateAddressDto, UpdateAddressDto } from "@/api";

export const getAddressesQuery = (pageSize: number = 100) => {
  return useQuery({
    queryKey: ["addresses", pageSize],
    queryFn: () =>
      apiClient.api
        .addressControllerFindAll({ pageSize })
        .then((res) => res.data),
  });
};

export const createAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createAddress"],
    mutationFn: (data: CreateAddressDto) =>
      apiClient.api.addressControllerCreate(data),
    onSuccess: () => {
      toast.success("Đã thêm địa chỉ mới!");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Thêm địa chỉ thất bại.";
      toast.error(errorMessage);
    },
  });
};

export const updateAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateAddress"],
    mutationFn: ({ id, data }: { id: string; data: UpdateAddressDto }) =>
      apiClient.api.addressControllerUpdate(id, data),
    onSuccess: () => {
      toast.success("Đã cập nhật địa chỉ!");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Cập nhật địa chỉ thất bại.";
      toast.error(errorMessage);
    },
  });
};
