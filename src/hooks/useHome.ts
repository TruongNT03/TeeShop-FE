import {
  findDiscoverNewArrivalsQuery,
  findTopSellerQuery,
} from "@/queries/productQueries";
import type { apiClient } from "@/services/apiClient";

export const useHome = () => {
  const findDiscoverNewArrivalsQueries: Parameters<
    typeof apiClient.api.productControllerFindAll
  >[0] = {
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder: "DESC",
  };
  const findDiscoverNewArrivalsResponse = findDiscoverNewArrivalsQuery(
    findDiscoverNewArrivalsQueries
  );

  const findTopSellerQueries: Parameters<
    typeof apiClient.api.productControllerFindAll
  >[0] = {
    page: 1,
    pageSize: 10,
    sortBy: "price",
    sortOrder: "DESC",
  };
  const findTopSellerResponse = findTopSellerQuery(findTopSellerQueries);

  return {
    newArrivalProducts: findDiscoverNewArrivalsResponse.isSuccess
      ? findDiscoverNewArrivalsResponse.data.data.data
      : [],
    newArrivalProductsIsLoading: findDiscoverNewArrivalsResponse.isLoading,
    topSellerProducts: findTopSellerResponse.isSuccess
      ? findTopSellerResponse.data.data.data
      : [],
    topSellerProductsIsLoading: findTopSellerResponse.isLoading,
  };
};
