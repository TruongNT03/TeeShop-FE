import type { ReactNode } from "react";

const Promo = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 px-1 md:px-8 lg:px-[65px] py-4 md:py-6 lg:py-[24px]">
      {children}
    </div>
  );
};

export default Promo;
