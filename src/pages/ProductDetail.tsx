import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  findProductByIdQuery,
  findProductVariantOptionsQuery,
} from "@/queries/productQueries";
import { addItemToCartMutation } from "@/queries/cartQueries";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, Truck } from "lucide-react";
import type {
  ProductVariantResponseDto,
  UserProductDetailResponseDto,
} from "@/api";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const LoadingSkeleton = () => (
  <div className="container mx-auto max-w-6xl py-12 px-4 md:px-0">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <Skeleton className="w-full h-[400px] md:h-[550px] rounded-lg" />
        <div className="flex gap-4 mt-4 overflow-x-auto">
          <Skeleton className="w-24 h-24 rounded-md shrink-0" />
          <Skeleton className="w-24 h-24 rounded-md shrink-0" />
          <Skeleton className="w-24 h-24 rounded-md shrink-0" />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-8 w-1/3" />
        <Separator />
        <Skeleton className="h-6 w-1/4" />
        <div className="flex gap-2">
          <Skeleton className="w-16 h-10 rounded-md" />
          <Skeleton className="w-16 h-10 rounded-md" />
        </div>
        <Separator />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  </div>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    {}
  );
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantResponseDto | null>(null);
  const [quantity, setQuantity] = useState(1);

  const productQuery = findProductByIdQuery(id!, !!id);
  const variantOptionsQuery = findProductVariantOptionsQuery(id!, !!id);
  const addToCartMutation = addItemToCartMutation();

  const product: UserProductDetailResponseDto | undefined =
    productQuery.data?.data;
  const variantOptions = variantOptionsQuery.data?.data || [];

  useEffect(() => {
    if (product?.productImages && product.productImages.length > 0) {
      setSelectedImageUrl(product.productImages[0].url);
    }
  }, [product?.productImages]);

  useEffect(() => {
    if (variantOptions.length > 0) {
      const defaultOptions: Record<string, string> = {};
      variantOptions.forEach((option) => {
        if (option.value.length > 0) {
          defaultOptions[option.variant] = option.value[0];
        }
      });
      setSelectedOptions(defaultOptions);
    }
  }, [variantOptions]);

  useEffect(() => {
    if (product?.productVariants && variantOptions.length > 0) {
      const selectedVariant =
        product.productVariants.find((variant) => {
          return Object.entries(selectedOptions).every(([key, value]) =>
            variant.variantValues.some(
              (vv) => vv.variant === key && vv.value === value
            )
          );
        }) || null;
      setSelectedVariant(selectedVariant);
    } else if (product?.productVariants && variantOptions.length === 0) {
      setSelectedVariant(product.productVariants[0] || null);
    }
  }, [selectedOptions, product?.productVariants, variantOptions]);

  const handleOptionSelect = (variantName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [variantName]: value }));
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => {
      const newQty = prev + amount;
      if (newQty < 1) return 1;
      if (selectedVariant && newQty > selectedVariant.stock) {
        toast.warning(`Chỉ còn ${selectedVariant.stock} sản phẩm trong kho.`);
        return selectedVariant.stock;
      }
      return newQty;
    });
  };

  const handleAddToCart = () => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }
    if (selectedVariant && quantity > 0) {
      addToCartMutation.mutate({
        productVariantId: selectedVariant.id,
        quantity: quantity,
      });
    } else {
      toast.error("Vui lòng chọn đầy đủ tùy chọn sản phẩm.");
    }
  };

  if (productQuery.isLoading || variantOptionsQuery.isLoading) {
    return <LoadingSkeleton />;
  }

  if (productQuery.isError || !product) {
    return (
      <div className="container mx-auto max-w-6xl py-20 text-center">
        <h2 className="text-2xl font-semibold">Không tìm thấy sản phẩm</h2>
        <Link to="/">
          <Button variant="link" className="text-primary">
            Quay về trang chủ
          </Button>
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product.price;
  const currentStock = selectedVariant
    ? selectedVariant.stock
    : product.totalStock;

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* Cột hình ảnh */}
        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden border-2">
            <img
              src={selectedImageUrl}
              alt={product.name}
              className="w-full h-[400px] md:h-[550px] object-cover transition-transform duration-300 hover:scale-105"
            />
          </Card>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.productImages.map((image) => (
              <Card
                key={image.id}
                className={`w-24 h-24 rounded-md overflow-hidden shrink-0 cursor-pointer border-2 ${
                  selectedImageUrl === image.url
                    ? "border-primary"
                    : "border-border"
                }`}
                onClick={() => setSelectedImageUrl(image.url)}
              >
                <img
                  src={image.url}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
              </Card>
            ))}
          </div>
        </div>

        {/* Cột thông tin */}
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {capitalizeWords(product.name)}
          </h1>

          <div className="text-3xl font-semibold text-primary">
            {formatPriceVND(currentPrice)}
          </div>


          <Separator />

          {/* Lựa chọn biến thể */}
          {variantOptions.map((option) => (
            <div key={option.variant} className="flex flex-col gap-3">
              <label className="text-sm font-medium">
                Chọn {option.variant}:
                <span className="text-muted-foreground ml-2">
                  {selectedOptions[option.variant]}
                </span>
              </label>
              <div className="flex flex-wrap gap-3">
                {option.value.map((value) => (
                  <Button
                    key={value}
                    variant={
                      selectedOptions[option.variant] === value
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleOptionSelect(option.variant, value)}
                    className="rounded-full"
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {/* Lựa chọn số lượng */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Số lượng:</label>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-r-none"
                onClick={() => handleQuantityChange(-1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setQuantity(isNaN(val) ? 1 : val);
                }}
                className="w-20 text-center rounded-none z-10 focus-visible:ring-primary"
                min={1}
                max={currentStock}
              />
              <Button
                variant="outline"
                size="icon"
                className="rounded-l-none"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground ml-4">
                {currentStock > 0
                  ? `${currentStock} sản phẩm có sẵn`
                  : "Hết hàng"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Nút thêm vào giỏ hàng */}
          <Button
            size="lg"
            className="w-full text-lg py-6"
            disabled={
              currentStock === 0 ||
              !selectedVariant ||
              addToCartMutation.isPending
            }
            onClick={handleAddToCart}
          >
            {addToCartMutation.isPending ? (
              <Spinner className="mr-2" />
            ) : (
              <ShoppingCart className="mr-2 h-5 w-5" />
            )}
            {currentStock === 0
              ? "Hết hàng"
              : !selectedVariant
              ? "Vui lòng chọn tùy chọn"
              : "Thêm vào giỏ hàng"}
          </Button>

          {/* Chính sách */}
          <Card className="bg-transparent border-border border-dashed">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-sm">
                  Giao hàng miễn phí cho đơn hàng trên 500.000đ
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-green-500 text-green-500">
                  Chính hãng
                </Badge>
                <span className="text-sm">Cam kết 100% chính hãng</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Mô tả sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;