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
    setSelectedCartItemIds,
    handleCheckedChange,
    checkoutSummaryCalculator,
    handleCheckAll,
  } = useCart();

  const {
    productVariantValue,
    isProductVariantValueSuccess,
    setProductWannaSeeVariantId,
  } = useProductVariantValue();

  const { totalAmount, totalQuantity } = checkoutSummaryCalculator();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeIn" }}
      className="px-[65px] mx-auto py-12 bg-stone-100"
    >
      <div className="flex text-4xl items-center gap-4 my-12">
        <div className="uppercase">My Cart:</div>
      </div>
      <div className="flex gap-12">
        <div className="flex-[3] gap-12">
          <table className="w-full border-separate border-spacing-y-4">
            <thead className="">
              <tr className="bg-white rounded-2xl">
                <th className="py-5 pl-5 text-left rounded-l-sm">
                  <Checkbox
                    onCheckedChange={(value) => {
                      handleCheckAll(value);
                    }}
                  />
                </th>
                <th className="py-5 font-normal text-left">Products</th>
                <th className="py-5 font-normal text-center">Unit Price</th>
                <th className="py-5 font-normal text-center">Quantity</th>
                <th className="py-5 font-normal text-center">Amount</th>
                <th className="py-5 pr-5 font-normal text-center rounded-r-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {listCartItems.map((cartItem) => (
                <tr className="bg-white">
                  <td className="p-5 max-w-[40px] rounded-l-sm">
                    <Checkbox
                      checked={selectedCartItemIds.includes(cartItem.id)}
                      onCheckedChange={(value) =>
                        handleCheckedChange(value, cartItem.id)
                      }
                    />
                  </td>
                  <td className="py-5 flex items-center">
                    <img
                      src={cartItem.product.productImages[0].url}
                      alt={cartItem.product.name}
                      className="w-[80px] h-[80px] object-cover rounded-md"
                      onError={(e) =>
                        e.currentTarget.setAttribute(
                          "src",
                          "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                        )
                      }
                    />
                    <div className="ml-4 uppercase mr-5 text-wrap w-[300px] truncate">
                      {cartItem.product.name}
                    </div>
                    <div className="flex flex-col justify-between">
                      <div className="flex flex-col gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            {cartItem.productVariant.variantValues.length && (
                              <div
                                className="flex items-center cursor-pointer gap-1"
                                onClick={() =>
                                  setProductWannaSeeVariantId(
                                    cartItem.product.id
                                  )
                                }
                              >
                                Product Classification:
                                <IoMdArrowDropup className="rotate-180" />
                              </div>
                            )}
                          </PopoverTrigger>
                          <div className="flex gap-2">
                            {cartItem.productVariant.variantValues.map(
                              (variantValue) => (
                                <Badge className=" rounded-sm">
                                  {variantValue.value}
                                </Badge>
                              )
                            )}
                          </div>
                          <PopoverContent>
                            {isProductVariantValueSuccess && (
                              <div className="flex flex-col gap-4">
                                {productVariantValue?.map((value) => (
                                  <div className="flex flex-row gap-2 items-center">
                                    <div>{value.variant}:</div>
                                    {value.value.map((value) => (
                                      <Badge
                                        className="rounded-sm"
                                        variant={
                                          cartItem.productVariant.variantValues
                                            .map(
                                              (variantValue) =>
                                                variantValue.value
                                            )
                                            .includes(value)
                                            ? "default"
                                            : "outline"
                                        }
                                      >
                                        {value}
                                      </Badge>
                                    ))}
                                  </div>
                                ))}
                                <div className="flex justify-between items-center">
                                  <div className="text-sm">Stock: {"12"}</div>
                                  <Button variant="outline" size="sm">
                                    Change
                                  </Button>
                                </div>
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </td>

                  <td className="align-middle text-center">
                    <div>{formatPriceVND(cartItem.productVariant.price)}</div>
                  </td>
                  <td className="align-middle text-center">
                    <div className="flex justify-center">
                      <Counter initValue={cartItem.quantity} />
                    </div>
                  </td>
                  <td className="align-middle text-center">
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
        <div className="flex-[1] relative mt-4">
          <Card className="rounded-sm top-34 sticky shadow-none border-none">
            <CardHeader className="font-medium">Checkout summary:</CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 mb-4">
                <div>Total Amount: {formatPriceVND(totalAmount)}</div>
                <div>Total Quantity: {totalQuantity}</div>
              </div>
              <div className="w-full">
                <Button
                  className="ml-auto"
                  onClick={() => navigate("/checkout")}
                >
                  Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
