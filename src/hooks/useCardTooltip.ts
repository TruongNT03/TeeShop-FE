import type { CartSummaryResponseDto } from "@/api";
import { getCartSummaryQuery } from "@/queries/cartQueries";

export const useCartTooltip = () => {
  const { data: cartSummaryData, isSuccess: cartIsSummarySuccess } =
    getCartSummaryQuery();

  return {
    cartSummaryData: cartIsSummarySuccess
      ? cartSummaryData.data
      : ({} as CartSummaryResponseDto),
  };
};
