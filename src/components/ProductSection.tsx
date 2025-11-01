import { Image } from "antd";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { useId } from "react";

interface ProductSectionProps {
  title?: string;
  descriptions?: string;
  itemPerRow: 4 | 6 | 8;
  items: any[];
}

const ProductSection = (props: ProductSectionProps) => {
  const sectionId = useId();
  const imageHeight = { 4: 300, 6: 200, 8: 150 };
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
        {props.items.map((item, index) => (
          <div
            className={`
    px-5 mb-8 
    ${props.itemPerRow === 4 ? "basis-1/4" : ""} 
    ${props.itemPerRow === 6 ? "basis-1/6" : ""} 
    ${props.itemPerRow === 8 ? "basis-1/8" : ""} 
  `}
          >
            <Card>
              <CardTitle className="text-center">{item.name}</CardTitle>
              <Image
                height={imageHeight[props.itemPerRow]}
                src={item.image}
                alt={`Product ${index}`}
                className="!w-full !h-full object-cover rounded-3xl p-3"
              />
              <CardDescription className="text-center">
                {item.price}
              </CardDescription>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
