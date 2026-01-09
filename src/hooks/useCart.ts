import { findAllCartItemsQuery } from "@/queries/cartQueries";
import { useState, useMemo, useCallback, useEffect } from "react";

export const useCart = (initialPage: number = 1, pageSize: number = 10) => {
  const [selectedCartItemIds, setSelectedCartItemIds] = useState<string[]>(
    () => {
      const saved = localStorage.getItem("selectedCartItemIds");
      return saved ? JSON.parse(saved) : [];
    }
  );
  const [currentPage, setCurrentPage] = useState(initialPage);

  const {
    data: cartData,
    isSuccess: isCartItemSuccess,
    isLoading: isCartLoading,
  } = findAllCartItemsQuery({ page: currentPage, pageSize });

  // Sync to localStorage whenever selection changes
  useEffect(() => {
    localStorage.setItem(
      "selectedCartItemIds",
      JSON.stringify(selectedCartItemIds)
    );
  }, [selectedCartItemIds]);

  // Cart items from current page
  const flatCartItems = useMemo(() => cartData?.data.data || [], [cartData]);

  // Pagination info
  const pagination = useMemo(
    () => ({
      page: cartData?.data.paginate?.page || 1,
      totalPage: cartData?.data.paginate?.totalPage || 1,
    }),
    [cartData]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
        if (item.product.discount) {
          totalAmount +=
            ((item.productVariant.price * (100 - item.product.discount)) /
              100) *
            item.quantity;
        } else {
          totalAmount += item.productVariant.price * item.quantity;
        }
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
    isCartLoading,
    pagination,
    currentPage,
    handlePageChange,
    selectedCartItemIds,
    setSelectedCartItemIds,
    handleCheckedChange,
    checkoutSummaryCalculator,
    handleCheckAll,
    isAllSelected,
  };
};
