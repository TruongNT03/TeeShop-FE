import { motion } from "motion/react";
import { useCart } from "@/hooks/useCart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ShoppingCart, Trash } from "lucide-react";
import Counter from "@/components/Counter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProductVariantValue } from "@/hooks/useProductVariantValue";
import { Button } from "@/components/ui/button";
import { IoMdArrowDropup } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    listCartItems,
    isCartItemSuccess,
    selectedCartItemIds,
    handleCheckedChange,
    checkoutSummaryCalculator,
    handleCheckAll,
    isAllSelected,
  } = useCart();

  const {
    productVariantValue,
    isProductVariantValueSuccess,
    setProductWannaSeeVariantId,
  } = useProductVariantValue();

  const { totalAmount, totalQuantity } = checkoutSummaryCalculator;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeIn" }}
      className="px-4 sm:px-8 md:px-[65px] mx-auto py-8 sm:py-12 bg-stone-100 min-h-screen"
    >
      <div className="flex text-2xl sm:text-3xl md:text-4xl items-center gap-4 my-8 sm:my-12">
        <div className="uppercase">Giỏ hàng của tôi:</div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
        {/* Products Section */}
        <div className="w-full lg:flex-[3] gap-12">
          {/* Desktop View - Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="bg-white rounded-2xl">
                  <th className="py-4 pl-4 sm:pl-5 text-left rounded-l-sm w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleCheckAll}
                    />
                  </th>
                  <th className="py-4 font-normal text-left">Sản phẩm</th>
                  <th className="py-4 font-normal text-center">Đơn giá</th>
                  <th className="py-4 font-normal text-center">Số lượng</th>
                  <th className="py-4 font-normal text-center">Thành tiền</th>
                  <th className="py-4 pr-4 sm:pr-5 font-normal text-center rounded-r-sm">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {listCartItems.map((cartItem) => (
                  <tr key={cartItem.id} className="bg-white">
                    <td className="p-4 sm:p-5 max-w-[40px] rounded-l-sm">
                      <Checkbox
                        checked={selectedCartItemIds.includes(cartItem.id)}
                        onCheckedChange={(value) =>
                          handleCheckedChange(value, cartItem.id)
                        }
                      />
                    </td>
                    <td className="py-4 px-2 sm:px-5">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <img
                          src={cartItem.product?.productImages[0]?.url}
                          alt={cartItem.product.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0"
                          onError={(e) =>
                            e.currentTarget.setAttribute(
                              "src",
                              "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                            )
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <div className="uppercase text-xs sm:text-sm font-medium line-clamp-2">
                            {cartItem.product.name}
                          </div>
                          {cartItem.productVariant.variantValues.length > 0 && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <div
                                  className="flex items-center cursor-pointer gap-1 mt-2 text-xs"
                                  onClick={() =>
                                    setProductWannaSeeVariantId(
                                      cartItem.product.id
                                    )
                                  }
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
                              <PopoverContent>
                                {isProductVariantValueSuccess && (
                                  <div className="flex flex-col gap-4">
                                    {productVariantValue?.map((value) => (
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
                                        Còn hàng: {"12"}
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
                    </td>
                    <td className="align-middle text-center text-sm">
                      <div>{formatPriceVND(cartItem.productVariant.price)}</div>
                    </td>
                    <td className="align-middle text-center">
                      <div className="flex justify-center">
                        <Counter initValue={cartItem.quantity} />
                      </div>
                    </td>
                    <td className="align-middle text-center text-sm">
                      {formatPriceVND(
                        cartItem.productVariant.price * cartItem.quantity
                      )}
                    </td>
                    <td className="text-center align-middle rounded-r-sm">
                      <div className="flex justify-center">
                        <Trash className="scale-75 cursor-pointer hover:text-red-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                <CardContent className="p-4">
                  <div className="flex gap-3 mb-4">
                    <Checkbox
                      checked={selectedCartItemIds.includes(cartItem.id)}
                      onCheckedChange={(value) =>
                        handleCheckedChange(value, cartItem.id)
                      }
                    />
                    <img
                      src={cartItem.product?.productImages[0]?.url}
                      alt={cartItem.product.name}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      onError={(e) =>
                        e.currentTarget.setAttribute(
                          "src",
                          "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                        )
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-xs line-clamp-2 mb-1">
                        {cartItem.product.name}
                      </h3>
                      {cartItem.productVariant.variantValues.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <div
                              className="flex items-center cursor-pointer gap-1 text-xs text-blue-600"
                              onClick={() =>
                                setProductWannaSeeVariantId(cartItem.product.id)
                              }
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
                            {isProductVariantValueSuccess && (
                              <div className="flex flex-col gap-4">
                                {productVariantValue?.map((value) => (
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
                                    Còn hàng: {"12"}
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
                        {formatPriceVND(cartItem.productVariant.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Số lượng:</span>
                      <Counter initValue={cartItem.quantity} />
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

                  <div className="flex justify-end mt-4 pt-3 border-t">
                    <Trash className="scale-75 cursor-pointer hover:text-red-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="w-full lg:flex-[1] relative">
          <Card className="rounded-lg sticky top-4 md:top-20 bg-white">
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
