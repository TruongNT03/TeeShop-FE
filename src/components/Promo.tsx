import type { ReactNode } from "react";

const Promo = ({ children }: { children: ReactNode }) => {
  return <div className="flex gap-8 px-[65px] py-[24px]">{children}</div>;
};

export default Promo;
