import type { JSX } from "react";

export interface PolicyItemProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const PolicyItem = (props: PolicyItemProps) => {
  return (
    <div className="flex gap-3 md:gap-4 items-start h-full">
      <div className="text-custom-primary flex-shrink-0 scale-110 md:scale-125">
        {props.icon}
      </div>
      <div className="flex flex-col gap-2">
        <div className="uppercase font-bold text-sm md:text-base leading-tight">
          {props.title}
        </div>
        <div className="text-xs md:text-sm text-slate-600 leading-relaxed">
          {props.description}
        </div>
      </div>
    </div>
  );
};

export default PolicyItem;
