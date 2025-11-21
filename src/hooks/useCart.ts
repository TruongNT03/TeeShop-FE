import { findAllCartItemsQuery } from "@/queries/cartQueries";
import { useState } from "react";

export const useCart = () => {
  const [selectedCartItemIds, setSelectedCartItemIds] = useState<string[]>(
    localStorage.getItem("selectedCartItemIds")
      ? JSON.parse(localStorage.getItem("selectedCartItemIds")!)
      : []
  );

  const {
    data: listCartItems,
    isSuccess: isCartItemSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = findAllCartItemsQuery({ pageSize: 10 });

  const handleCheckedChange = (
    checkboxValue: string | boolean,
    selectedCartItemId: string
  ) => {
    if (checkboxValue) {
      setSelectedCartItemIds([...selectedCartItemIds, selectedCartItemId]);
      localStorage.setItem(
        "selectedCartItemIds",
        JSON.stringify(selectedCartItemIds)
      );
    } else {
      setSelectedCartItemIds(
        selectedCartItemIds.filter((id) => id !== selectedCartItemId)
      );
      localStorage.setItem(
        "selectedCartItemIds",
        JSON.stringify(selectedCartItemIds)
      );
    }
  };

  const checkoutSummaryCalculator = () => {
    let totalAmount = 0;
    let totalQuantity = 0;

    listCartItems?.pages.forEach((page) => {
      page.data.data.forEach((item) => {
        if (selectedCartItemIds.includes(item.id)) {
          totalAmount += item.productVariant.price * item.quantity;
          totalQuantity += item.quantity;
        }
      });
    });
    return { totalAmount, totalQuantity };
  };

  const handleCheckAll = (checked: string | boolean) => {
    if (checked) {
      const allIds = listCartItems?.pages
        .flatMap((page) => page.data.data)
        .map((item) => item.id);
      setSelectedCartItemIds(allIds || []);
      localStorage.setItem("selectedCartItemIds", JSON.stringify(allIds));
    } else {
      setSelectedCartItemIds([]);
      localStorage.setItem("selectedCartItemIds", JSON.stringify([]));
    }
  };

  return {
    listCartItems: listCartItems?.pages.flatMap((page) => page.data.data) || [],
    isCartItemSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    selectedCartItemIds,
    setSelectedCartItemIds,
    handleCheckedChange,
    checkoutSummaryCalculator,
    handleCheckAll,
  };
};
