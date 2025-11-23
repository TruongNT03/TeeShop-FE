import { findAllCartItemsQuery } from "@/queries/cartQueries";
import { useState, useMemo, useCallback, useEffect } from "react";

export const useCart = () => {
  const [selectedCartItemIds, setSelectedCartItemIds] = useState<string[]>(
    () => {
      const saved = localStorage.getItem("selectedCartItemIds");
      return saved ? JSON.parse(saved) : [];
    }
  );

  const {
    data: listCartItems,
    isSuccess: isCartItemSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = findAllCartItemsQuery({ pageSize: 10 });

  // Sync to localStorage whenever selection changes
  useEffect(() => {
    localStorage.setItem(
      "selectedCartItemIds",
      JSON.stringify(selectedCartItemIds)
    );
  }, [selectedCartItemIds]);

  // Memoize flattened cart items
  const flatCartItems = useMemo(
    () => listCartItems?.pages.flatMap((page) => page.data.data) || [],
    [listCartItems]
  );

  const handleCheckedChange = useCallback(
    (checkboxValue: string | boolean, selectedCartItemId: string) => {
      setSelectedCartItemIds((prev) => {
        if (checkboxValue) {
          return [...prev, selectedCartItemId];
        } else {
          return prev.filter((id) => id !== selectedCartItemId);
        }
      });
    },
    []
  );

  // Memoize checkout summary calculation
  const checkoutSummaryCalculator = useMemo(() => {
    let totalAmount = 0;
    let totalQuantity = 0;

    flatCartItems.forEach((item) => {
      if (selectedCartItemIds.includes(item.id)) {
        totalAmount += item.productVariant.price * item.quantity;
        totalQuantity += item.quantity;
      }
    });

    return { totalAmount, totalQuantity };
  }, [flatCartItems, selectedCartItemIds]);

  const handleCheckAll = useCallback(
    (checked: string | boolean) => {
      if (checked) {
        const allIds = flatCartItems.map((item) => item.id);
        setSelectedCartItemIds(allIds);
      } else {
        setSelectedCartItemIds([]);
      }
    },
    [flatCartItems]
  );

  // Check if all items are selected
  const isAllSelected = useMemo(
    () =>
      flatCartItems.length > 0 &&
      selectedCartItemIds.length === flatCartItems.length,
    [flatCartItems, selectedCartItemIds]
  );

  return {
    listCartItems: flatCartItems,
    isCartItemSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    selectedCartItemIds,
    setSelectedCartItemIds,
    handleCheckedChange,
    checkoutSummaryCalculator,
    handleCheckAll,
    isAllSelected,
  };
};
