import Banner from "@/components/Banner";
import ProductSection from "@/components/ProductSection";
import Policy from "@/components/Policy";
import type { PolicyItemProps } from "@/components/PolicyItem";
import Promo from "@/components/Promo";
import PromoItem from "@/components/PromoItem";
import { useHome } from "@/hooks/useHome";
import {
  Fingerprint,
  LifeBuoy,
  RotateCcw,
  TruckElectric,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const policies: PolicyItemProps[] = [
  {
    icon: <TruckElectric />,
    title: "Free Shipping",
    description: "Enjoy free shipping on all orders above $100",
  },
  {
    icon: <LifeBuoy />,
    title: "SUPPORT 24/7",
    description: "Our support team is there to help you for queries",
  },
  {
    icon: <RotateCcw />,
    title: "30 DAYS RETURN",
    description: "Simply return it within 30 days for an exchange.",
  },
  {
    icon: <Fingerprint />,
    title: "100% PAYMENT SECURE",
    description: "Our payments are secured with 256 bit encryption",
  },
];

const Home = () => {
  const {
    newArrivalProducts,
    topSellerProducts,
    newArrivalProductsIsLoading,
    topSellerProductsIsLoading,
  } = useHome();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeIn" }}
      className="w-full"
    >
      <Banner />
      <ProductSection
        title="Discover NEW Arrivals"
        descriptions="Recently added shirts!"
        itemPerRow={6}
        items={newArrivalProducts}
        isLoading={newArrivalProductsIsLoading}
      />
      <Policy items={policies} />
      <Promo>
        <PromoItem
          className="flex-3"
          title="peace of mind"
          description="A one-stop platform for all your fashion needs, hassle-free. Buy with a peace of mind."
          redirectUrl="#"
        />
        <PromoItem
          className="flex-2"
          title="peace of mind"
          description="A one-stop platform for all your fashion needs, hassle-free. Buy with a peace of mind."
          redirectUrl="#"
        />
      </Promo>
      <ProductSection
        title="Top Sellers"
        descriptions="Browse our top-selling products"
        itemPerRow={4}
        items={topSellerProducts}
        isLoading={topSellerProductsIsLoading}
      />
      <div className="w-full flex justify-center items-center">
        <Link to={"/product"} className="py-14">
          <Button className="uppercase font-lato py-7 px-8 text-[20px] border-2 border-primary bg-primary rounded-sm hover:text-primary hover:bg-transparent hover:border-2 hover:border-primary">
            Shop Now
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default Home;
