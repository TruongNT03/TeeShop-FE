import { Link } from "react-router-dom";

interface FooterColumnProps {
  title?: string;
  items?: {
    title?: string;
    to?: string;
  }[];
}

const FooterColumn = (props: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-[56px]">
      <div className="font-arimo text-[12px] font-semibold uppercase">
        {props.title}
      </div>
      <div className="flex flex-col font-lato gap-4">
        {props.items?.map((item) => (
          <Link
            to={item.to ? item.to : "#"}
            className="hover:text-primary"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FooterColumn;