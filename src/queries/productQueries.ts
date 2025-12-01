import type { apiClient } from "@/services/apiClient";
import { productApi } from "@/services/getListProduct";
import { useQuery } from "@tanstack/react-query";

export const findDiscoverNewArrivalsQuery = (
  query: Parameters<typeof apiClient.api.productControllerFindAll>[0]
) => {
  return useQuery({
    queryKey: ["userProduct", query],
    queryFn: () => productApi.findDiscoverNewArrivals(query),
  });
};

export const findTopSellerQuery = (
  query: Parameters<typeof apiClient.api.productControllerFindAll>[0]
) => {
  return useQuery({
    queryKey: ["userProduct", query],
    queryFn: () => productApi.findTopSeller(query),
  });
};

export const findProductByIdQuery = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["userProductDetail", id],
    queryFn: () => productApi.findById(id),
    enabled: enabled,
  });
};

export const findProductVariantOptionsQuery = (
  id: string,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["userProductVariantOptions", id],
    queryFn: () => productApi.findVariantOptions(id),
    enabled: enabled,
  });
};

export const findProductListQuery = (
  query: Parameters<typeof apiClient.api.productControllerFindAll>[0]
) => {
  return useQuery({
    queryKey: ["userProductList", query],
    queryFn: () => apiClient.api.productControllerFindAll(query),
  });
};

export const getAllCategoriesQuery = (
  query: Parameters<typeof apiClient.api.categoryControllerFindAll>[0]
) => {
  return useQuery({
    queryKey: ["categories", query],
    queryFn: () => apiClient.api.categoryControllerFindAll(query),
  });
};
