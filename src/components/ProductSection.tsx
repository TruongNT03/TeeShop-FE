import { Image } from "antd";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useId } from "react";
import type { UserProductResponseDto } from "@/api";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { Link } from "react-router-dom";

interface ProductSectionProps {
  title?: string;
  descriptions?: string;
  itemPerRow: 4 | 6 | 8;
  items: UserProductResponseDto[];
  isLoading?: boolean;
}

const ProductSection = (props: ProductSectionProps) => {
  const sectionId = useId();
  const imageHeight = { 4: 300, 6: 200, 8: 150 };

  const skeletonCount = props.itemPerRow * 2;
  return (
    <section id={sectionId} className="w-full pb-[24px]">
      <div className="flex flex-col gap-4 justify-center items-center py-8">
        <div
          className="text-5xl font-semibold text-shadow-lg cursor-pointer"
          onClick={() => {
            document.getElementById(sectionId)?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          {props.title}
        </div>
        <div>{props.descriptions}</div>
      </div>

      <div className="flex flex-wrap px-[65px]">
        {props.isLoading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <div
                key={i}
                className={`
                  px-5 mb-8 
                  ${props.itemPerRow === 4 ? "basis-1/4" : ""} 
                  ${props.itemPerRow === 6 ? "basis-1/6" : ""} 
                  ${props.itemPerRow === 8 ? "basis-1/8" : ""} 
                `}
              >
                <Card className="flex flex-col items-center p-4">
                  <Skeleton className="h-6 w-3/4 mb-3 rounded-md" />
                  <Skeleton
                    className="w-full rounded-3xl mb-3"
                    style={{ height: imageHeight[props.itemPerRow] }}
                  />
                  <Skeleton className="h-5 w-1/2 rounded-md" />
                </Card>
              </div>
            ))
          : props.items.map((item, index) => (
              <div
                key={index}
                className={`
                  px-5 mb-8 
                  ${props.itemPerRow === 4 ? "basis-1/4" : ""} 
                  ${props.itemPerRow === 6 ? "basis-1/6" : ""} 
                  ${props.itemPerRow === 8 ? "basis-1/8" : ""} 
                `}
              >
                <Card>
                  <Link to={`/product/${item.id}`}>
                    <CardTitle className="text-center px-2 h-[32px] text-wrap truncate">
                      {capitalizeWords(item.name)}
                    </CardTitle>
                  </Link>
                  <Image
                    height={imageHeight[props.itemPerRow]}
                    src={item.productImages[0].url}
                    alt={`Product ${index}`}
                    className="!w-full !h-full object-cover rounded-3xl p-3"
                  />
                  <CardDescription className="text-center">
                    {formatPriceVND(item.price)}
                  </CardDescription>
                </Card>
              </div>
            ))}
      </div>
    </section>
  );
};

export default ProductSection;
