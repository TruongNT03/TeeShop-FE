import type {
  CreateProductDto,
  SaveCategoryDto,
  UpdateProductDto,
  UpdateProductStatusDto,
  UploadDto,
} from "@/api";
import { adminProductApi } from "@/services/adminGetListProduct";
import type { apiClient } from "@/services/apiClient";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const getAllProductQuery = (
  query: Parameters<typeof apiClient.api.adminProductControllerFindAll>[0]
) => {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => adminProductApi.findAll(query),
    placeholderData: keepPreviousData, 
  });
};

export const getAllCategoryQuery = (
  query: Parameters<typeof apiClient.api.adminCategoriesControllerFindAll>[0]
) => {
  return useQuery({
    queryKey: ["category", query],
    queryFn: () => adminProductApi.findAllCategories(query),
    placeholderData: keepPreviousData, 
  });
};

export const getAllVariantsQuery = (
  query: Parameters<typeof apiClient.api.adminProductControllerFindAllVariant>[0]
) => {
  return useQuery({
    queryKey: ["variants", query],
    queryFn: () => adminProductApi.findAllVariants(query),
  });
};

export const getAllVariantValuesQuery = (
  query: Parameters<
    typeof apiClient.api.adminProductControllerFindAllVariantValue
  >[0],
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["variantValues", query],
    queryFn: () => adminProductApi.findAllVariantValues(query),
    enabled: enabled,
  });
};

export const getAdminProductByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["adminProduct", id],
    queryFn: () => adminProductApi.findById(id),
    enabled: !!id,
  });
};

export const createCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createCategory"],
    mutationFn: (data: SaveCategoryDto) => adminProductApi.createCategory(data),
    onSuccess: () => {
      toast.success("Tạo danh mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError: (error) => {
      toast.error(error.message || "Tạo danh mục thất bại.");
    },
  });
};

export const createProductMutation = () => {
  return useMutation({
    mutationKey: ["createProduct"],
    mutationFn: (data: CreateProductDto) => adminProductApi.create(data),
    onSuccess: (response) => {
      toast.success(
        `Tạo sản phẩm thành công! (ID: ${response.data.id.substring(0, 6)}...)`
      );
    },
    onError: (error) => {
      toast.error(error.message || "Tạo sản phẩm thất bại.");
    },
  });
};

export const updateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      adminProductApi.update(id, data),
    onSuccess: (_response, variables) => {
      toast.success("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["adminProduct", variables.id],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật sản phẩm thất bại.");
    },
  });
};

export const uploadProductImageMutation = () => {
  return useMutation({
    mutationKey: ["uploadProductImage"],
    mutationFn: (data: UploadDto) => adminProductApi.uploadProductImage(data),
    onError: (error) => {
      toast.error(error.message || "Tải ảnh lên thất bại.");
    },
  });
};

export const updateProductStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateProductStatus"],
    mutationFn: ({ id, data }: { id: string; data: UpdateProductStatusDto }) =>
      adminProductApi.updateStatus(id, data),
    onSuccess: (_response, variables) => {
      const newStatus = variables.data.status;
      toast.success(
        `Cập nhật trạng thái thành ${
          newStatus === "published" ? "published" : "unpublished"
        }`
      );      
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật trạng thái thất bại.");
    },
  });
};