import type { ReactNode } from "react";

const Promo = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-5 px-2 py-4 ">
      {children}
    </div>
  );
};

export default Promo;
