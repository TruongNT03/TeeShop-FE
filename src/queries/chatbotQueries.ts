import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../services/apiClient";
import type {
  AdminListFaqResponseDto,
  AdminFaqSummaryResponseDto,
  CreateFaqDto,
} from "../api";
import { toast } from "sonner";

// Query key factory
export const chatbotKeys = {
  all: ["chatbot"] as const,
  lists: () => [...chatbotKeys.all, "list"] as const,
  list: (filters: {
    page?: number;
    pageSize: number;
    search?: string;
    typeFilter?: string;
    sortBy?: "question" | "answer" | "type";
    sortOrder?: "DESC" | "ASC";
  }) => [...chatbotKeys.lists(), filters] as const,
  summary: () => [...chatbotKeys.all, "summary"] as const,
};

// Get FAQ summary statistics
export const useGetChatbotSummary = () => {
  return useQuery<AdminFaqSummaryResponseDto>({
    queryKey: chatbotKeys.summary(),
    queryFn: async () => {
      const response = await apiClient.api.adminChatbotControllerGetSummary();
      return response.data;
    },
  });
};

// Get all FAQ data with pagination and search
export const useGetChatbotData = (query: {
  page?: number;
  pageSize: number;
  search?: string;
  typeFilter?:
    | "Chính sách đổi trả"
    | "Vận chuyển"
    | "Thanh toán"
    | "Sản phẩm"
    | "Tài khoản"
    | "Khuyến mãi"
    | "Chăm sóc khách hàng"
    | "Đặt hàng"
    | "Bảo mật"
    | "Thành viên"
    | "Nước hoa";
  sortBy?: "question" | "answer" | "type";
  sortOrder?: "DESC" | "ASC";
}) => {
  return useQuery<AdminListFaqResponseDto>({
    queryKey: chatbotKeys.list(query),
    queryFn: async () => {
      const response = await apiClient.api.adminChatbotControllerFindAll(query);
      return response.data;
    },
  });
};

// Create FAQ mutation
export const useCreateChatbot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFaqDto) => {
      const response = await apiClient.api.adminChatbotControllerCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatbotKeys.lists() });
      queryClient.invalidateQueries({ queryKey: chatbotKeys.summary() });
      toast.success("Thêm câu hỏi thành công");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Có lỗi xảy ra khi thêm câu hỏi";
      toast.error(message);
    },
  });
};

// Update FAQ mutation
export const useUpdateChatbot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CreateFaqDto }) => {
      const response = await apiClient.api.adminChatbotControllerUpdate(
        id.toString(),
        { id },
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatbotKeys.lists() });
      toast.success("Cập nhật câu hỏi thành công");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật câu hỏi";
      toast.error(message);
    },
  });
};

// Delete FAQ mutation
export const useDeleteChatbot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.api.adminChatbotControllerDelete(
        id.toString(),
        { id }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatbotKeys.lists() });
      queryClient.invalidateQueries({ queryKey: chatbotKeys.summary() });
      toast.success("Xóa câu hỏi thành công");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Có lỗi xảy ra khi xóa câu hỏi";
      toast.error(message);
    },
  });
};

// Retraining model mutation
export const useRetrainingModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.api.adminChatbotControllerRetraining();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatbotKeys.summary() });
      toast.success("Đã bắt đầu huấn luyện lại mô hình");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi huấn luyện lại mô hình";
      toast.error(message);
    },
  });
};
