import { useFooter } from "@/hooks/useFooter";
import FooterColumn from "./FooterColumn";
import FooterEmail from "./FooterEmail";

const Footer = () => {
  const { footerColumns } = useFooter();
  return (
    <div className="w-full px-[65px] py-[28px] text-[#1D1D1D]">
      <div className="flex justify-between pb-[200px]">
        {footerColumns.map((footerColumn) => (
          <FooterColumn title={footerColumn.title} items={footerColumn.items} />
        ))}
        <FooterEmail />
      </div>
      <div className="flex justify-between">
        <div className="font-lato text-[14px]">
          <div>© 2020 NorthStar eCommerce</div>
          <div>Privacy Policy Terms & Conditions</div>
        </div>
        <div className="flex gap-[16px]">
          <img src="visa.png" alt="" className="max-h-[34px]" />
          <img src="master-card.png" alt="" className="max-h-[34px]" />
          <img src="paypal.png" alt="" className="max-h-[34px]" />
          <img src="visa-electron.png" alt="" className="max-h-[34px]" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
