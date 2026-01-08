import { motion } from "motion/react";
import { useCart } from "@/hooks/useCart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { Badge } from "@/components/ui/badge";
import { LoaderCircle, ShoppingBag, ShoppingCart, Trash } from "lucide-react";
import Counter from "@/components/Counter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { useProductVariantValue } from "@/hooks/useProductVariantValue";
import { Button } from "@/components/ui/button";
import { IoMdArrowDropup } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  updateCartItemQuantityMutation,
  deleteCartItemMutation,
} from "@/queries/cartQueries";
import { useEffect, useState } from "react";
import { useProductDetail } from "@/queries/user/useProductDetail";
import type { CartItemResponseDto, ProductVariantResponseDto } from "@/api";
import { useProductVariantValue } from "@/queries/user/useProductVariantValue";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/queries/user/key";
import { useUpdateVariantValueCartItem } from "@/queries/user/useUpdateVariantValueCartItem";
import { PopoverClose } from "@radix-ui/react-popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CartPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [productId, setProductId] = useState<string>();
  const [productVariant, setProductVariant] =
    useState<ProductVariantResponseDto>();
  const [selectedVariantValue, setSelectedVariantValue] =
    useState<Record<string, string>>();
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  // const {
  //   productVariantValue,
  //   isProductVariantValueSuccess,
  //   setProductWannaSeeVariantId,
  // } = useProductVariantValue();

  const productVariantValueQuery = useProductVariantValue(productId as string);
  const productDetailQuery = useProductDetail(productId as string);
  const updateCartItemQuantity = useUpdateVariantValueCartItem();

  const handleOpenPopover = (cartItem: CartItemResponseDto) => {
    setProductId(cartItem.product.id);
    cartItem.productVariant.variantValues.map((variantValue) =>
      setSelectedVariantValue((prev) => ({
        ...prev,
        [variantValue.variant]: variantValue.value,
      }))
    );
  };

  const handleChangeSelectedVariantValue = (variant: string, value: string) => {
    const nextSelectedVariantValue = {
      ...selectedVariantValue,
      [variant]: value,
    };

    setSelectedVariantValue(nextSelectedVariantValue);

    if (productDetailQuery.data) {
      const productVariants = productDetailQuery.data.productVariants;

      const matchedVariant = productVariants.find((productVariant) =>
        productVariant.variantValues.every(
          (variantValue) =>
            nextSelectedVariantValue[variantValue.variant] ===
            variantValue.value
        )
      );

      if (matchedVariant) {
        setProductVariant(matchedVariant);
      }
    }
  };

  const {
    listCartItems,
    isCartItemSuccess,
    selectedCartItemIds,
    handleCheckedChange,
    checkoutSummaryCalculator,
    handleCheckAll,
    isAllSelected,
  } = useCart();

  const { totalAmount, totalQuantity } = checkoutSummaryCalculator;

  const { mutate: updateQuantity } = updateCartItemQuantityMutation();
  const { mutate: deleteItem } = deleteCartItemMutation();

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    updateQuantity({ id: cartItemId, data: { quantity: newQuantity } });
  };

  const handleDelete = (cartItemId: string) => {
    deleteItem(cartItemId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeIn" }}
      className="max-w-[1440px] px-1 md:px-5 sm:px-8 mx-auto py-8 sm:py-12 bg-stone-100 min-h-screen"
    >
      <div className="flex flex-col items-start text-2xl sm:text-3xl md:text-4xl gap-4 md:my-8 sm:my-12 my-3">
        <div className="uppercase w-fit border-black border-b-[2px]">
          Giỏ hàng của tôi
        </div>
        <div className="text-sm">Các sản phẩm bạn đã thêm vào giỏ hàng</div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-6">
        {/* Products Section */}
        <div className="w-full lg:flex-[3] gap-12">
          {/* Desktop View - Table */}

          <Card className="hidden md:block overflow-x-auto px-5 pb-24">
            <table className="w-full">
              <thead className="">
                <tr className="bg-white rounded-2xl border-border">
                  <th className="py-4 pl-4 sm:pl-5 text-left rounded-l-sm w-12 border-b-1">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleCheckAll}
                    />
                  </th>
                  <th className="py-4 font-normal text-left pl-[20px] border-b-1">
                    Sản phẩm
                  </th>
                  <th className="py-4 font-normal text-center border-b-1">
                    Đơn giá
                  </th>
                  <th className="py-4 font-normal text-center border-b-1">
                    Số lượng
                  </th>
                  <th className="py-4 font-normal text-center border-b-1">
                    Thành tiền
                  </th>
                  <th className="py-4 pr-4 sm:pr-5 font-normal text-center rounded-r-sm border-b-1">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {listCartItems.map((cartItem) => (
                  <tr key={cartItem.id} className="bg-white">
                    <td className="p-4 sm:p-5 max-w-[40px] rounded-l-sm border-b-1">
                      <Checkbox
                        disabled={
                          cartItem.quantity > cartItem.productVariant.stock
                        }
                        checked={selectedCartItemIds.includes(cartItem.id)}
                        onCheckedChange={(value) =>
                          handleCheckedChange(value, cartItem.id)
                        }
                      />
                    </td>
                    <td className="py-4 px-2 sm:px-5 border-b-1">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {cartItem.product?.productImages[0]?.url ? (
                          <img
                            src={cartItem.product?.productImages[0]?.url}
                            alt={cartItem.product.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0"
                          />
                        ) : (
                          <Skeleton className="w-20 h-20" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="uppercase font-medium">
                            {cartItem.product.name}
                          </div>
                          {cartItem.productVariant.variantValues.length > 0 && (
                            <Popover
                              open={openPopoverId === cartItem.id}
                              onOpenChange={(open) =>
                                setOpenPopoverId(open ? cartItem.id : null)
                              }
                            >
                              <PopoverTrigger
                                asChild
                                onClick={() => {
                                  handleOpenPopover(cartItem);
                                  setOpenPopoverId(cartItem.id);
                                }}
                              >
                                <div
                                  className="flex items-center cursor-pointer gap-1 mt-2 text-xs my-2"
                                  onClick={() => {
                                    handleOpenPopover(cartItem);
                                  }}
                                >
                                  Phân loại:
                                  <IoMdArrowDropup className="rotate-180" />
                                </div>
                              </PopoverTrigger>
                              <div className="flex gap-2 flex-wrap">
                                {cartItem.productVariant.variantValues.map(
                                  (variantValue) => (
                                    <Badge
                                      key={variantValue.value}
                                      className="rounded-sm text-xs"
                                    >
                                      {variantValue.value}
                                    </Badge>
                                  )
                                )}
                              </div>
                              <div className="text-xs mt-2 flex gap-1">
                                <div>
                                  Tồn kho: {cartItem.productVariant.stock}
                                </div>
                                {cartItem.quantity >
                                  cartItem.productVariant.stock && (
                                  <div className="text-red-500">{`(Sản phẩm không còn đủ số lượng với yêu cầu của bạn)`}</div>
                                )}
                              </div>
                              <PopoverContent>
                                {productVariantValueQuery.isSuccess ? (
                                  <div className="flex flex-col gap-4">
                                    {productVariantValueQuery.data?.map(
                                      (value) => (
                                        <div
                                          key={value.variant}
                                          className="flex flex-row gap-2 items-center"
                                        >
                                          <div className="text-sm">
                                            {value.variant}:
                                          </div>
                                          {value.value.map((val) => (
                                            <Badge
                                              key={val}
                                              className="rounded-sm cursor-pointer"
                                              onClick={() =>
                                                handleChangeSelectedVariantValue(
                                                  value.variant,
                                                  val
                                                )
                                              }
                                              variant={
                                                selectedVariantValue &&
                                                selectedVariantValue[
                                                  value.variant
                                                ] === val
                                                  ? "default"
                                                  : "outline"
                                              }
                                            >
                                              {val}
                                            </Badge>
                                          ))}
                                        </div>
                                      )
                                    )}
                                    <div className="flex justify-between items-center">
                                      <div className="text-sm">
                                        Còn hàng:{" "}
                                        {productVariant
                                          ? productVariant.stock
                                          : cartItem.productVariant.stock}
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-24 flex justify-center items-center"
                                        disabled={
                                          updateCartItemQuantity.isPending
                                        }
                                        onClick={() =>
                                          updateCartItemQuantity.mutate(
                                            {
                                              id: cartItem.id,
                                              data: {
                                                productVariantId:
                                                  productVariant?.id as string,
                                              },
                                            },
                                            {
                                              onSuccess: () => {
                                                setOpenPopoverId(null);
                                              },
                                            }
                                          )
                                        }
                                      >
                                        {updateCartItemQuantity.isPending ? (
                                          <div>
                                            <LoaderCircle className="animate-spin" />
                                          </div>
                                        ) : (
                                          <div>Thay đổi</div>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center">
                                    <LoaderCircle className="animate-spin" />
                                  </div>
                                )}
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="align-middle text-center text-sm border-b-1">
                      <div>
                        {cartItem.product.discount
                          ? formatPriceVND(
                              cartItem.productVariant.price -
                                cartItem.product.discount
                            )
                          : formatPriceVND(cartItem.productVariant.price)}
                      </div>
                    </td>
                    <td className="align-middle text-center border-b-1">
                      <div className="flex justify-center">
                        <Counter
                          initValue={cartItem.quantity}
                          minValue={1}
                          maxValue={cartItem.productVariant.stock}
                          onChange={(newQuantity) =>
                            handleQuantityChange(cartItem.id, newQuantity)
                          }
                        />
                      </div>
                    </td>
                    <td className="align-middle text-center text-sm border-b-1">
                      {cartItem.product.discount
                        ? formatPriceVND(
                            (cartItem.productVariant.price -
                              cartItem.product.discount) *
                              cartItem.quantity
                          )
                        : formatPriceVND(
                            cartItem.productVariant.price * cartItem.quantity
                          )}
                    </td>
                    <td className="text-center align-middle rounded-r-sm border-b-1">
                      <div className="flex justify-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Trash className="scale-75 cursor-pointer hover:text-red-500" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Xóa sản phẩm khỏi giỏ hàng
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ
                                hàng?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(cartItem.id)}
                              >
                                Xác nhận
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-4">
            <div className="bg-white p-4 rounded-lg mb-4 border border-border">
              <div className="flex items-center gap-3 ">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleCheckAll}
                />

                <span className="text-sm font-medium">Chọn tất cả</span>
              </div>
            </div>
            {listCartItems.map((cartItem) => (
              <Card key={cartItem.id} className="rounded-lg bg-white">
                <CardContent className="">
                  <div className="flex justify-between">
                    <Checkbox
                      className="mb-5"
                      checked={selectedCartItemIds.includes(cartItem.id)}
                      onCheckedChange={(value) =>
                        handleCheckedChange(value, cartItem.id)
                      }
                    />

                    <Trash
                      className="scale-75 cursor-pointer hover:text-red-500"
                      onClick={() => handleDelete(cartItem.id)}
                    />
                  </div>
                  <div className="w-full h-[1px] bg-border mb-2"></div>
                  <div className="flex items-center gap-3 mb-4">
                    {cartItem.product?.productImages[0]?.url ? (
                      <img
                        src={cartItem.product?.productImages[0]?.url}
                        alt={cartItem.product.name}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      />
                    ) : (
                      <Skeleton className="w-20 h-20" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium uppercase line-clamp-2 mb-1 truncate">
                        {cartItem.product.name}
                      </h3>
                      {cartItem.productVariant.variantValues.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <div
                              className="flex items-center cursor-pointer gap-1 text-xs text-blue-600"
                              // onClick={() =>
                              //   setProductWannaSeeVariantId(cartItem.product.id)
                              // }
                            >
                              Phân loại
                              <IoMdArrowDropup className="rotate-180 scale-75" />
                            </div>
                          </PopoverTrigger>
                          <div className="flex gap-2 flex-wrap mt-2">
                            {cartItem.productVariant.variantValues.map(
                              (variantValue) => (
                                <Badge
                                  key={variantValue.value}
                                  className="rounded-sm text-xs"
                                >
                                  {variantValue.value}
                                </Badge>
                              )
                            )}
                          </div>
                          <PopoverContent>
                            {productVariantValueQuery.isSuccess && (
                              <div className="flex flex-col gap-4">
                                {productVariantValueQuery.data?.map((value) => (
                                  <div
                                    key={value.variant}
                                    className="flex flex-row gap-2 items-center"
                                  >
                                    <div className="text-sm">
                                      {value.variant}:
                                    </div>
                                    {value.value.map((val) => (
                                      <Badge
                                        key={val}
                                        className="rounded-sm"
                                        variant={
                                          cartItem.productVariant.variantValues
                                            .map(
                                              (variantValue) =>
                                                variantValue.value
                                            )
                                            .includes(val)
                                            ? "default"
                                            : "outline"
                                        }
                                      >
                                        {val}
                                      </Badge>
                                    ))}
                                  </div>
                                ))}
                                <div className="flex justify-between items-center">
                                  <div className="text-sm">
                                    Còn hàng:{" "}
                                    {productVariant ? productVariant.stock : 0}
                                  </div>
                                  <Button variant="outline" size="sm">
                                    Thay đổi
                                  </Button>
                                </div>
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đơn giá:</span>
                      <span className="font-medium">
                        {cartItem.product.discount
                          ? formatPriceVND(
                              cartItem.productVariant.price -
                                cartItem.product.discount
                            )
                          : formatPriceVND(cartItem.productVariant.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Số lượng:</span>
                      <Counter
                        initValue={cartItem.quantity}
                        onChange={(newQuantity) =>
                          handleQuantityChange(cartItem.id, newQuantity)
                        }
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thành tiền:</span>
                      <span className="font-medium text-base">
                        {formatPriceVND(
                          cartItem.productVariant.price * cartItem.quantity
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="w-full lg:flex-[1] relative">
          <Card className="rounded-lg sticky top-4 md:top-40 bg-white">
            <CardHeader className="font-medium text-lg">
              Tóm tắt đơn hàng:
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-semibold">
                    {formatPriceVND(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng số lượng:</span>
                  <span className="font-semibold">{totalQuantity}</span>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => navigate("/checkout")}
                size="lg"
              >
                <ShoppingCart className="mr-2 w-4 h-4" />
                Thanh toán
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
