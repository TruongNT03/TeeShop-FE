import { getAllProductQuery } from "@/queries/adminProductQueries";
import { apiClient } from "@/services/apiClient";
import { useState } from "react";

export const useAdminProduct = (
  query: Parameters<typeof apiClient.api.adminProductControllerFindAll>[0]
) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSelectedAllProduct, setIsSelectedAllProduct] =
    useState<boolean>(false);

  const { data } = getAllProductQuery(query);
  return {
    selectedProducts,
    setSelectedProducts,
    isSelectedAllProduct,
    setIsSelectedAllProduct,
    products: data?.data.data,
  };
};
