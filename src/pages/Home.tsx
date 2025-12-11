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
    title: "Miễn Phí Vận Chuyển",
    description: "Miễn phí vận chuyển cho đơn hàng trên 500.000đ",
  },
  {
    icon: <LifeBuoy />,
    title: "HỖ TRỢ 24/7",
    description: "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp thắc mắc",
  },
  {
    icon: <RotateCcw />,
    title: "ĐỔI TRẢ TRONG 30 NGÀY",
    description: "Đổi trả dễ dàng trong vòng 30 ngày",
  },
  {
    icon: <Fingerprint />,
    title: "THANH TOÁN BẢO MẬT 100%",
    description: "Thanh toán được mã hóa 256 bit an toàn tuyệt đối",
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
      className="w-full bg-stone-100 overflow-x-hidden"
    >
      <Banner />
      <div className="max-w-[1280px] mx-auto px-4">
        <ProductSection
          title="Khám Phá Sản Phẩm Mới"
          descriptions="Sản phẩm mới được thêm gần đây!"
          itemPerRow={6}
          items={newArrivalProducts}
          isLoading={newArrivalProductsIsLoading}
        />
        <Policy items={policies} />
        <Promo>
          <PromoItem
            className="flex-3"
            title="Yên tâm mua sắm"
            description="Nền tảng mua sắm thời trang tiện lợi, an toàn. Mua sắm với sự yên tâm tuyệt đối."
            redirectUrl="#"
          />
          <PromoItem
            className="flex-2"
            title="Yên tâm mua sắm"
            description="Nền tảng mua sắm thời trang tiện lợi, an toàn. Mua sắm với sự yên tâm tuyệt đối."
            redirectUrl="#"
          />
        </Promo>
        <ProductSection
          title="Bán Chạy Nhất"
          descriptions="Duyệt xem các sản phẩm bán chạy"
          itemPerRow={4}
          items={topSellerProducts}
          isLoading={topSellerProductsIsLoading}
        />
        <div className="w-full flex justify-center items-center">
          <Link to={"/product"} className="py-8 md:py-14">
            <Button className="uppercase py-4 px-6 text-base md:py-7 md:px-8 md:text-[20px] border-2 border-primary bg-primary rounded-sm hover:text-primary hover:bg-transparent hover:border-2 hover:border-primary">
              Mua ngay
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
