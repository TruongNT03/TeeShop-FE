import { IoIosArrowForward } from "react-icons/io";

const FooterEmail = () => {
  return (
    <div className="flex flex-col gap-[32px]">
      <div className="text-[12px] font-semibold uppercase">Nhận thông tin</div>
      <div className="flex items-center">
        <input
          type="text"
          className="py-[17px] w-[300px] border-b border-border outline-0 bg-transparent"
          placeholder="Nhập email của bạn"
        />
        <IoIosArrowForward className="text-[24px]" />
      </div>
    </div>
  );
};

export default FooterEmail;
