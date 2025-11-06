import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import {
  deleteCartItemMutation,
  getCartSummaryQuery,
  updateCartItemQuantityMutation,
} from "@/queries/cartQueries";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { motion } from "motion/react";
import type { CartItemResponseDto } from "@/api";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const QuantityControl = ({ item }: { item: CartItemResponseDto }) => {
  const updateMutation = updateCartItemQuantityMutation();

  const handleQuantityChange = (amount: number) => {
    const newQuantity = item.quantity + amount;
    if (newQuantity < 1) return;
    if (newQuantity > item.productVariant.stock) {
      toast.warning(`Chỉ còn ${item.productVariant.stock} sản phẩm trong kho.`);
      return;
    }

    updateMutation.mutate({
      id: item.id,
      data: { quantity: newQuantity },
    });
  };

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-r-none"
        onClick={() => handleQuantityChange(-1)}
        disabled={updateMutation.isPending}
      >
        <Minus className="w-4 h-4" />
      </Button>
      <Input
        type="number"
        value={item.quantity}
        className="w-14 h-8 text-center rounded-none z-10 focus-visible:ring-primary"
        readOnly
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-l-none"
        onClick={() => handleQuantityChange(1)}
        disabled={updateMutation.isPending}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

// Component CartPage chính
const CartPage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { data, isLoading, isError } = getCartSummaryQuery(!!accessToken);
  const deleteMutation = deleteCartItemMutation();

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const cartItems = data?.data.cartItems || [];

  const selectedItems = useMemo(
    () => cartItems.filter((item) => selectedItemIds.includes(item.id)),
    [cartItems, selectedItemIds]
  );

  const subtotal = useMemo(() => {
    return selectedItems.reduce((acc, item) => {
      return acc + item.productVariant.price * item.quantity;
    }, 0);
  }, [selectedItems]);

  const totalItems = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [selectedItems]);

  const handleSelectItem = (itemId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItemIds.length === cartItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cartItems.map((item) => item.id));
    }
  };

  const isAllSelected =
    selectedItemIds.length === cartItems.length && cartItems.length > 0;

  if (!accessToken) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl py-12 px-4 md:px-0 flex justify-center items-center min-h-[50vh]">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto max-w-6xl py-12 px-4 md:px-0 text-center">
        <h2 className="text-2xl font-semibold text-destructive">
          Không thể tải giỏ hàng
        </h2>
        <Link to="/">
          <Button variant="link" className="text-primary">
            Quay về trang chủ
          </Button>
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto max-w-6xl py-20 px-4 md:px-0 flex flex-col items-center gap-6"
      >
        <ShoppingCart className="w-24 h-24 text-muted-foreground" />
        <h2 className="text-3xl font-bold">Giỏ hàng của bạn đang trống</h2>
        <p className="text-muted-foreground">
          Hãy lấp đầy giỏ hàng với các sản phẩm tuyệt vời!
        </p>
        <Link to="/">
          <Button size="lg" className="text-lg py-6">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeIn" }}
      className="container mx-auto max-w-6xl py-12 px-4 md:px-0"
    >
      <h1 className="text-4xl font-bold mb-8">Giỏ hàng của bạn</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-4">
          {/* THANH CHỌN TẤT CẢ (Đảo ngược) */}
          <Card className="flex items-center p-4 shadow-sm flex-row-reverse">
            <div className="flex-1 font-medium text-right">
              <label htmlFor="select-all">
                Chọn tất cả ({cartItems.length} sản phẩm)
              </label>
            </div>
            <Checkbox
              id="select-all"
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              className="ml-4" 
            />
          </Card>

          {/* DANH SÁCH SẢN PHẨM  */}
          {cartItems.map((item) => (
            <Card
              key={item.id}
              className="flex items-center p-4 shadow-sm flex-row-reverse" 
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive h-8 w-8 ml-2"
                onClick={() => deleteMutation.mutate(item.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              {/* 2. Giá */}
              <div className="w-32 text-right font-medium text-primary">
                {formatPriceVND(item.productVariant.price * item.quantity)}
              </div>

              {/* 3. Số lượng */}
              <div className="mx-4 lg:mx-8">
                <QuantityControl item={item} />
              </div>

              {/* 4. Tên/Ảnh  */}
              <div className="flex-1 mr-4 flex items-center flex-row-reverse">
                <Link
                  to={`/product/${item.productVariant.id}`}
                  className="flex-1 ml-4" 
                >
                  <h3 className="text-md font-semibold hover:text-primary transition-colors">
                    SKU: {item.productVariant.sku}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {item.productVariant.variantValues
                      .map((vv) => `${vv.variant}: ${vv.value}`)
                      .join(" / ")}
                  </div>
                </Link>
                <Link to={`/product/${item.productVariant.id}`}>
                  <img
                    src={"/logo.png"}
                    alt={item.productVariant.sku}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                </Link>
              </div>

              {/* 5. Checkbox*/}
              <Checkbox
                checked={selectedItemIds.includes(item.id)}
                onCheckedChange={() => handleSelectItem(item.id)}
                className="ml-4" 
              />
            </Card>
          ))}
        </div>

        {/* THẺ TÓM TẮT ĐƠN HÀNG  */}
        <div className="lg:col-span-1">
          <Card className="sticky top-28 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-md">
                <span>
                  Tạm tính ({totalItems} sản phẩm đã chọn)
                </span>
                <span className="font-medium">
                  {formatPriceVND(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-md">
                <span>Phí vận chuyển</span>
                <span className="font-medium">
                  {formatPriceVND(0)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Tổng cộng</span>
                <span>{formatPriceVND(subtotal)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full text-lg py-6"
                disabled={selectedItems.length === 0}
              >
                Thanh toán
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;