import { getProductVariantValue } from "@/queries/cartQueries";
import { useState } from "react";

export const useProductVariantValue = () => {
  const [productWannaSeeVariantId, setProductWannaSeeVariantId] =
    useState<string>("");
  const { data: productVariantValue, isSuccess: isProductVariantValueSuccess } =
    getProductVariantValue(productWannaSeeVariantId);

  return {
    productVariantValue,
    isProductVariantValueSuccess,
    setProductWannaSeeVariantId,
  };
};
