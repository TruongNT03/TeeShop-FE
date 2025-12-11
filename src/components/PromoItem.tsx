import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export interface PromoItemProps {
  className?: string;
  title: string;
  description: string;
  redirectUrl: string;
}

const PromoItem = (props: PromoItemProps) => {
  return (
    <div
      className={`${props.className} bg-black text-secondary-foreground flex flex-col gap-4 md:gap-6 lg:gap-[24px] items-center min-h-[300px] md:h-[350px] lg:h-[429px] justify-center px-4 py-6 md:py-8 rounded-md`}
    >
      <div className="text-white text-xl md:text-2xl lg:text-[32px] uppercase text-center">
        {props.title}
      </div>
      <div className="text-white text-sm md:text-base lg:text-[18px] max-w-[350px] md:max-w-[450px] lg:max-w-[500px] text-wrap text-center">
        {props.description}
      </div>
      <Link to={props.redirectUrl}>
        <Button
          className="relative overflow-hidden text-lato uppercase bg-primary-foreground text-primary text-xs md:text-sm lg:text-[14px] rounded-none p-4 md:p-5 lg:p-6 
        transition-all duration-500 ease-out group hover:text-primary-foreground"
        >
          <span className="relative z-10">Buy now</span>
          <span
            className="absolute inset-0 w-[200%] bg-primary origin-bottom-left 
          -translate-x-full translate-y-full skew-x-[-20deg]
          group-hover:translate-x-0 group-hover:translate-y-0 
          transition-transform duration-500 ease-out"
          ></span>
        </Button>
      </Link>
    </div>
  );
};

export default PromoItem;
