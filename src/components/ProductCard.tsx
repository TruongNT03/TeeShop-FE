import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProductResponseDto } from "@/api";

interface ProductCardProps {
  product: any; // API returns simple ProductResponseDto without full details
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const mainImage = product.productImages?.[0]?.url;
  const isOutOfStock = false; // Simple list doesn't have stock info
  const [showQuickView, setShowQuickView] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.productImages || [];
  const hasVariants = product.hasVariants || false;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      <Card className="flex flex-col items-center hover:shadow-lg transition-all duration-300 h-full shadow-none">
        <Link to={`/product/${product.id}`} className="w-full">
          <h3 className="text-center px-2 h-[32px] text-wrap truncate pt-3 uppercase font-medium">
            {capitalizeWords(product.name)}
          </h3>
        </Link>
        <Link to={`/product/${product.id}`} className="w-full">
          <div className="relative overflow-hidden">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="!w-full !h-full object-cover rounded-3xl p-3"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/300";
                }}
              />
            ) : (
              <div className="p-3">
                <Skeleton className="w-full h-[200px] rounded-3xl" />
              </div>
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  Hết hàng
                </Badge>
              </div>
            )}
          </div>
        </Link>

        {/* Price */}
        <div className="text-center pb-3 px-2">
          {product.price ? (
            <span className="text-base font-medium">
              {formatPriceVND(product.price)}
            </span>
          ) : (
            <span className="text-sm text-slate-500">Liên hệ</span>
          )}
        </div>

        {/* Quick View Dialog */}
        <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {capitalizeWords(product.name)}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Main Image Viewer */}
              <div className="relative aspect-square bg-slate-50 rounded-lg overflow-hidden">
                <img
                  src={images[currentImageIndex]?.url || mainImage}
                  alt={`${product.name} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/600";
                  }}
                />

                {images.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>

                    {/* Next Button */}
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {images.map((img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-primary"
                          : "border-transparent hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/100";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Product Info */}
              <div className="space-y-2 border-t pt-4">
                {product.price && (
                  <div className="text-2xl font-bold text-primary">
                    {formatPriceVND(product.price)}
                  </div>
                )}

                {product.description && (
                  <p className="text-slate-600">{product.description}</p>
                )}

                <Button className="w-full mt-4" size="lg" asChild>
                  <Link to={`/product/${product.id}`}>Xem Chi Tiết</Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default ProductCard;
