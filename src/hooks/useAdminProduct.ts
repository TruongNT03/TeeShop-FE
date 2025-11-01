import { getAllProductQuery } from "@/queries/adminProductQueries";
import type { apiClient } from "@/services/apiClient";
import { useState } from "react";

export const useAdminProduct = (
  query: Parameters<typeof apiClient.api.adminProductControllerFindAll>[0]
) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSelectedAllProduct, setIsSelectedAllProduct] =
    useState<boolean>(false);

  const getAllProductResponse = getAllProductQuery(query);

  const paginate = getAllProductResponse.data?.data.paginate;

  return {
    selectedProducts,
    setSelectedProducts,
    isSelectedAllProduct,
    setIsSelectedAllProduct,
    products: getAllProductResponse.isSuccess
      ? getAllProductResponse.data.data.data
      : [],
      
    pagination: {
      currentPage: paginate?.page ?? 1,
      totalPage: paginate?.totalPage ?? 1,
      totalItem: paginate?.totalItem ?? 0,
    },
    isLoading: getAllProductResponse.isLoading,
  };
};