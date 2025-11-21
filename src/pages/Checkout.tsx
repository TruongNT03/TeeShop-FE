import { CreditCard } from "lucide-react";

const Checkout = () => {
  return (
    <div className="bg-stone-100 py-[88px] px-[65px]">
      <div className="uppercase text-4xl flex gap-4 items-center mb-8">
        Checkout:
      </div>
      <div className="flex gap-8">
        <div className="bg-white flex-[1]">Hello 1</div>
        <div className="flex-[3]">
          <div className="bg-white">
            <div className="text-xl">Address</div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
