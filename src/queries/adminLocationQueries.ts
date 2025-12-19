import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminLocationApi } from "@/services/adminLocationApi";
import { toast } from "sonner";

export const useAdminLocations = (
  pageSize: number,
  page?: number,
  search?: string
) => {
  return useQuery({
    queryKey: ["adminLocations", pageSize, page, search],
    queryFn: () => adminLocationApi.getAllLocations(pageSize, page, search),
    placeholderData: (previousData) => previousData,
  });
};

export const useAdminLocation = (id: string) => {
  return useQuery({
    queryKey: ["adminLocation", id],
    queryFn: async () => {
      const response = await adminLocationApi.getAllLocations(100, 1, "");
      const location = response.data.data.find((item) => item.id === id);
      if (!location) throw new Error("Location not found");
      return location;
    },
    enabled: !!id,
  });
};

export const useCreateLocation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminLocationApi.createLocation,
    onSuccess: () => {
      toast.success("Tạo địa điểm thành công");
      queryClient.invalidateQueries({ queryKey: ["adminLocations"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

export const useUpdateLocation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminLocationApi.updateLocation(id, data),
    onSuccess: () => {
      toast.success("Cập nhật địa điểm thành công");
      queryClient.invalidateQueries({ queryKey: ["adminLocations"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};
