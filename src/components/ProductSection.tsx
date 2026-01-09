import { Image } from "antd";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useId } from "react";
import type { ProductResponseDto } from "@/api";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { Link } from "react-router-dom";

interface ProductSectionProps {
  title?: string;
  descriptions?: string;
  itemPerRow: 3 | 4 | 6 | 8;
  items: ProductResponseDto[];
  isLoading?: boolean;
}

const ProductSection = (props: ProductSectionProps) => {
  const sectionId = useId();
  const skeletonCount = props.itemPerRow * 2;
  return (
    <section id={sectionId} className="w-full pb-[24px] overflow-x-hidden">
      <div
        className="flex flex-col gap-4 justify-center items-center py-6 px-0
      md:py-8 "
      >
        <div
          className="text-3xl md:text-4xl lg:text-5xl font-semibold text-shadow-lg cursor-pointer text-center"
          onClick={() => {
            document.getElementById(sectionId)?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          {props.title}
        </div>
        <div className="text-sm md:text-base text-center">
          {props.descriptions}
        </div>
      </div>

      <div className="flex flex-wrap">
        {props.isLoading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <div
                key={i}
                className="px-1 mb-6 md:mb-8 w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/5"
              >
                <Card className="flex flex-col items-center p-4">
                  <Skeleton className="h-7 w-3/4 mb-3 rounded-md" />
                  <Skeleton className="w-full rounded-3xl mb-3 h-[300px]" />
                  <Skeleton className="h-8 w-1/2 rounded-md" />
                </Card>
              </div>
            ))
          : props.items.map((item, index) => (
              <div
                key={index}
                className="w-1/2 px-1
                mb-6 md:mb-8 md:w-1/3 
                sm:w-1/2 
                lg:w-1/3 
                xl:w-1/5"
              >
                <Card
                  className="
                                shadow-none gap-1 py-3 relative
                                md:gap-6 md:py-6"
                >
                  <Link to={`/product/${item.id}`}>
                    <CardTitle
                      className="
                                text-center px-2 h-[32px] text-wrap truncate font-medium uppercase
                                md:h-[32px]"
                    >
                      {capitalizeWords(item.name)}
                    </CardTitle>
                  </Link>

                  {item.discount && item.discount > 0 && (
                    <div className="absolute bg-red-600 text-white px-2 py-1 rounded-sm font-bold -rotate-12 top-24 left-4 z-10 shadow-md pointer-events-none text-[11px]">
                      -{item.discount}%
                    </div>
                  )}

                  {item.productImages[0]?.url ? (
                    <Image
                      height={300}
                      src={item.productImages[0]?.url}
                      alt={`Product ${index}`}
                      className="object-cover rounded-3xl p-3"
                      onError={(e) =>
                        e.currentTarget.setAttribute(
                          "src",
                          "https://pbs.twimg.com/media/F4jjWyzacAAX25-.jpg"
                        )
                      }
                    />
                  ) : (
                    <div className="p-3">
                      <Skeleton
                        className="w-full rounded-3xl aspect-square"
                        style={{ height: "220px" }}
                      />
                    </div>
                  )}
                  <div
                    className="
                                  text-center pb-0 h-12
                                  md:pb-3 px-2"
                  >
                    {item.price ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span
                          className={`font-medium ${
                            item.discount
                              ? "line-through text-red-500 text-xs opacity-70"
                              : "text-base"
                          }`}
                        >
                          {formatPriceVND(item.price)}
                        </span>

                        {item.discount ? (
                          <span className="text-base font-medium text-slate-900">
                            {formatPriceVND(
                              (item.price * (100 - item.discount)) / 100
                            )}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">Liên hệ</span>
                    )}
                  </div>
                </Card>
              </div>
            ))}
      </div>
    </section>
  );
};

export default ProductSection;
