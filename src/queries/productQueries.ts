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
