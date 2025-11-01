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
      className={`${props.className} bg-black flex flex-col gap-[24px] items-center h-[429px] justify-center`}
    >
      <div className="font-lato text-[32px] text-white uppercase">
        {props.title}
      </div>
      <div className="font-lato text-[18px] text-white max-w-[500px] text-wrap text-center">
        {props.description}
      </div>
      <Link to={props.redirectUrl}>
        <Button
          className="relative overflow-hidden text-lato uppercase bg-white text-black text-[14px] rounded-none p-6 
        transition-all duration-500 ease-out group hover:text-white"
        >
          <span className="relative z-10">Buy now</span>
          <span
            className="absolute inset-0 w-[200%] bg-custom-primary origin-bottom-left 
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
