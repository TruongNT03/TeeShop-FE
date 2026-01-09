import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  findProductByIdQuery,
  findProductVariantOptionsQuery,
} from "@/queries/productQueries";
import { addItemToCartMutation } from "@/queries/cartQueries";
import { getProductReviewsQuery } from "@/queries/reviewQueries";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  Package,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type {
  ProductVariantResponseDto,
  ProductDetailResponseDto,
} from "@/api";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "antd";
import { CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { useListProduct } from "@/queries/user/useListProduct";

const LoadingSkeleton = () => (
  <div className="max-w-[1440px] mx-auto py-12 px-4">
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
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantResponseDto | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const reviewPageSize = 5;
  const [reviewRatingFilter, setReviewRatingFilter] = useState<
    number | undefined
  >(undefined);
  const [reviewHasImagesFilter, setReviewHasImagesFilter] = useState<
    boolean | undefined
  >(undefined);
  const listProductQuery = useListProduct({
    pageSize: 20,
  });

  const productQuery = findProductByIdQuery(id!, !!id);
  const variantOptionsQuery = findProductVariantOptionsQuery(id!, !!id);
  const addToCartMutation = addItemToCartMutation();
  const reviewsQuery = getProductReviewsQuery(
    id!,
    reviewPage,
    reviewPageSize,
    reviewRatingFilter,
    reviewHasImagesFilter,
    !!id
  );

  const product: ProductDetailResponseDto | undefined = productQuery.data?.data;
  const variantOptions = variantOptionsQuery.data?.data || [];

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

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
      <div className="max-w-[1440px] mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Không tìm thấy sản phẩm</h2>
        <Link to="/">
          <Button variant="link" className="text-primary">
            Quay về trang chủ
          </Button>
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : 0;

  return (
    <div className="min-h-screen bg-white pt-6">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-slate-900">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-slate-900">
            {capitalizeWords(product.name)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden">
              {selectedImageUrl ? (
                <img
                  src={selectedImageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-slate-300" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.productImages.map((image) => (
                  <button
                    key={image.id}
                    className={cn(
                      "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      selectedImageUrl === image.url
                        ? "border-slate-900"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                    onClick={() => setSelectedImageUrl(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-medium text-slate-900 mb-4 uppercase">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.round(product.averageRating || 0)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-slate-600">
                  {(product.averageRating || 0).toFixed(1)} (
                  {product.totalRating || 0} đánh giá)
                </span>
              </div>
            </div>

            <div className="py-6 border-y border-slate-200">
              <div className="flex flex-col gap-2">
                {!!product.discount && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg line-through text-slate-400 font-light">
                      {formatPriceVND(currentPrice)}
                    </span>
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-sm shadow-sm">
                      -{product.discount}%
                    </span>
                  </div>
                )}
                <div className="text-4xl font-bold text-slate-900">
                  {formatPriceVND(
                    product.discount
                      ? (currentPrice * (100 - product.discount)) / 100
                      : currentPrice
                  )}
                </div>
              </div>
              {currentStock > 0 ? (
                <p className="text-sm text-slate-600">
                  Còn {currentStock} sản phẩm
                </p>
              ) : (
                <p className="text-sm text-red-600">Hết hàng</p>
              )}
            </div>

            {/* Variants */}
            {variantOptions.map((option) => (
              <div key={option.variant}>
                <div className="text-sm font-medium text-black mb-3">
                  {option.variant}: {selectedOptions[option.variant]}
                </div>
                <div className="flex flex-wrap gap-2">
                  {option.value.map((value) => {
                    const isSelected =
                      selectedOptions[option.variant] === value;
                    return (
                      <button
                        key={value}
                        onClick={() =>
                          handleOptionSelect(option.variant, value)
                        }
                        className={cn(
                          "px-6 py-2 text-sm border rounded-md transition-colors cursor-pointer",
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-primary hover:bg-primary hover:text-white"
                        )}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <div className="text-sm font-medium text-black mb-3">
                Số lượng
              </div>
              <div className="inline-flex border border-primary rounded-md overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-4 py-2 hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="px-6 py-2 border-x border-slate-300 min-w-[60px] text-center">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= currentStock}
                  className="px-4 py-2 hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              disabled={
                currentStock === 0 ||
                !selectedVariant ||
                addToCartMutation.isPending
              }
              onClick={handleAddToCart}
              className="w-full bg-primary text-white py-4 rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {addToCartMutation.isPending ? (
                <Spinner className="w-5 h-5" />
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  {currentStock === 0
                    ? "Hết hàng"
                    : !selectedVariant
                    ? "Chọn tùy chọn"
                    : "Thêm vào giỏ"}
                </>
              )}
            </button>

            {/* Benefits */}
            <div className="space-y-8 pt-6 border-t border-slate-200 text-black uppercase">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="" />
                <div className="w-[1px] bg-black h-[20px]"></div>
                <span className="">
                  Miễn phí vận chuyển cho đơn từ 500.000đ
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="" />
                <div className="w-[1px] bg-black h-[20px]"></div>
                <span className="">Bảo hành chính hãng</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Package className="" />
                <div className="w-[1px] bg-black h-[20px]"></div>
                <span className="">Đổi trả trong 7 ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-16 border-t border-slate-200 pt-16">
          <div className="w-fit text-2xl uppercase font-medium border-b-[2px] border-black pb-1">
            Mô tả sản phẩm
          </div>
          <div
            className="prose prose-slate max-w-none mt-5"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-slate-200 pt-16">
          <div className="flex flex-col justify-start items-start md:flex-row md:items-center md:justify-between mb-8">
            <div className="w-fit mt-8 text-2xl uppercase font-medium border-b-[2px] border-black pb-1">
              Đánh giá sản phẩm
            </div>
            <div className="flex items-center gap-2 mt-5">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="text-lg font-semibold">
                {(product.averageRating || 0).toFixed(1)}
              </span>
              <span className="text-slate-600">
                ({product.totalRating || 0} đánh giá)
              </span>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="flex flex-col justify-start items-start md:items-center md:flex-row gap-2">
              <span className="text-sm font-medium text-slate-700">
                Lọc theo:
              </span>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={
                    reviewRatingFilter === undefined ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    setReviewRatingFilter(undefined);
                    setReviewPage(1);
                  }}
                  className="transition-none"
                >
                  Tất cả
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={
                      reviewRatingFilter === rating ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      setReviewRatingFilter(rating);
                      setReviewPage(1);
                    }}
                    className="gap-1 transition-none"
                  >
                    {rating}{" "}
                    <Star
                      className={`h-5 w-5 ${
                        reviewRatingFilter === rating
                          ? "fill-white text-white"
                          : "fill-amber-400 text-amber-400"
                      } `}
                    />
                  </Button>
                ))}
              </div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <Button
              variant={reviewHasImagesFilter === true ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setReviewHasImagesFilter(
                  reviewHasImagesFilter === true ? undefined : true
                );
                setReviewPage(1);
              }}
              className="transition-none"
            >
              Có hình ảnh
            </Button>
          </div>

          {reviewsQuery.isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded-xl p-6 border border-slate-200"
                >
                  <div className="flex gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : reviewsQuery.data?.data && reviewsQuery.data.data.length > 0 ? (
            <>
              <div className="space-y-6">
                {reviewsQuery.data.data.map((review, index) => {
                  // Nếu user không tồn tại, bỏ qua review này
                  if (!review.user) return null;

                  return (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-slate-50 rounded-xl p-6 border border-border hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <Avatar className="w-12 h-12 ring-0 rounded-lg">
                          <AvatarImage src={review.user.avatar || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                            {review.user.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col justify-start items-start md:flex-row md:items-center md:justify-between mb-2">
                            <div className="flex flex-col items-start md:flex-row md:items-center gap-1 md:gap-3">
                              <span className="font-medium text-slate-900">
                                {review.user.name || "Anonymous"}
                              </span>
                              <div className="flex gap-0.5 mb-3 md:mb-0">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-4 w-4",
                                      i < review.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-slate-300 text-slate-300"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-slate-500 flex-shrink-0">
                              {new Date(review.createdAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-line">
                            {review.comment}
                          </p>
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-3 flex-wrap">
                              {review.images.map((img, idx) => (
                                <div
                                  key={idx}
                                  className="relative group cursor-pointer"
                                >
                                  <img
                                    src={img}
                                    alt={`Review ${idx + 1}`}
                                    className="w-24 h-24 object-cover rounded-lg border-2 border-slate-200 group-hover:border-slate-400 transition-all group-hover:scale-105"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {reviewsQuery.data.paginate.totalPage > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                    disabled={reviewPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-slate-600">
                    Trang {reviewPage} / {reviewsQuery.data.paginate.totalPage}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setReviewPage((p) =>
                        Math.min(reviewsQuery.data.paginate.totalPage, p + 1)
                      )
                    }
                    disabled={
                      reviewPage === reviewsQuery.data.paginate.totalPage
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Chưa có đánh giá nào</p>
            </div>
          )}
        </div>
        <div className="w-full h-[1px] bg-border mt-5"></div>
        <div className="w-fit mt-8 text-2xl uppercase font-medium border-b-[2px] border-black pb-1">
          Sản phẩm tương tự
        </div>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full py-8"
        >
          <CarouselContent>
            {listProductQuery.isSuccess &&
              listProductQuery.data.data.map((product, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/5"
                >
                  <ProductCard product={product}></ProductCard>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious
            variant="ghost"
            className="
                      -left-6
                      md:-left-12
                      h-9 w-9
                      active:bg-border
                      "
          />

          <CarouselNext
            variant="ghost"
            className="
                      -right-6
                      md:-right-12
                      h-9 w-9
                      active:bg-border
                      "
          />
        </Carousel>
        <div className="w-full h-[1px] bg-border"></div>
      </div>
    </div>
  );
};

export default ProductDetail;
