import { useFooter } from "@/hooks/useFooter";
import FooterColumn from "./FooterColumn";
import FooterEmail from "./FooterEmail";

const Footer = () => {
  const { footerColumns } = useFooter();
  return (
    <div className="w-full bg-background">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8 lg:py-[28px] text-foreground">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-12 md:pb-24 lg:pb-[200px]">
          {footerColumns.map((footerColumn, index) => (
            <FooterColumn
              key={index}
              title={footerColumn.title}
              items={footerColumn.items}
            />
          ))}
          <FooterEmail />
        </div>
        <div className="w-full h-[1px] bg-border my-6 md:my-8 lg:my-[24px]"></div>
        <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-4">
          <div className="text-xs md:text-sm text-center md:text-left">
            <div>© 2020 NorthStar eCommerce</div>
            <div>Chính sách bảo mật Điều khoản và Điều kiện</div>
          </div>
          <div className="flex gap-3 md:gap-4 justify-center md:justify-end flex-wrap">
            <img
              src="visa.png"
              alt=""
              className="max-h-[28px] md:max-h-[34px]"
            />
            <img
              src="master-card.png"
              alt=""
              className="max-h-[28px] md:max-h-[34px]"
            />
            <img
              src="paypal.png"
              alt=""
              className="max-h-[28px] md:max-h-[34px]"
            />
            <img
              src="visa-electron.png"
              alt=""
              className="max-h-[28px] md:max-h-[34px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
