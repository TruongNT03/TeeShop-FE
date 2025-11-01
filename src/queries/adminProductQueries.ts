// src/queries/adminProductQueries.ts
import type { CreateProductDto } from "@/api";
import { adminProductApi } from "@/services/adminGetListProduct";
import type { apiClient } from "@/services/apiClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const getAllProductQuery = (
  query: Parameters<typeof apiClient.api.adminProductControllerFindAll>[0]
) => {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => adminProductApi.findAll(query),
  });
};

export const getAllCategoryQuery = (
  query: Parameters<typeof apiClient.api.adminCategoriesControllerFindAll>[0]
) => {
  return useQuery({
    queryKey: ["category", query],
    queryFn: () => adminProductApi.findAllCategories(query),
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