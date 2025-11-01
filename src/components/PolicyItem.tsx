import type { JSX } from "react";

export interface PolicyItemProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const PolicyItem = (props: PolicyItemProps) => {
  return (
    <div className="flex gap-3">
      <div className="text-custom-primary mt-2 scale-125 ml-2">
        {props.icon}
      </div>
      <div className="flex flex-col">
        <div className="uppercase font-bold">{props.title}</div>
        <div className="mt-2">{props.description}</div>
      </div>
    </div>
  );
};

export default PolicyItem;
