import { Carousel } from "antd";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const mockBanner = [
  {
    url: "https://www.essence.com/wp-content/uploads/2022/03/Tyler_ZaraBeauty_014-Cropped-1920x1080.jpg",
  },
  {
    url: "https://www.essence.com/wp-content/uploads/2022/03/Tyler_ZaraBeauty_014-Cropped-1920x1080.jpg",
  },
  {
    url: "https://www.essence.com/wp-content/uploads/2022/03/Tyler_ZaraBeauty_014-Cropped-1920x1080.jpg",
  },
  {
    url: "https://www.essence.com/wp-content/uploads/2022/03/Tyler_ZaraBeauty_014-Cropped-1920x1080.jpg",
  },
  {
    url: "https://www.essence.com/wp-content/uploads/2022/03/Tyler_ZaraBeauty_014-Cropped-1920x1080.jpg",
  },
];

const Banner = () => {
  const isMobile = useIsMobile();
  return (
    <div className="w-full max-h-[400px] md:max-h-[500px] lg:max-h-[700px] relative pb-4 md:pb-6 lg:pb-[24px]">
      <Carousel
        autoplay={{ dotDuration: true }}
        autoplaySpeed={5000}
        draggable={true}
        easing="ease-in-out"
        speed={2000}
        pauseOnHover={false}
      >
        {mockBanner.map((item) => (
          <div>
            <img
              src={item.url}
              alt=""
              className="w-full max-h-[400px] md:max-h-[500px] lg:max-h-[700px] object-cover"
            />
          </div>
        ))}
      </Carousel>
      {!isMobile && (
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 md:left-auto md:right-[10%] md:translate-x-0 flex flex-col items-center px-4">
          <div className="text-white uppercase text-2xl md:text-3xl lg:text-5xl text-wrap max-w-[300px] md:max-w-[400px] lg:w-[500px] mb-4 md:mb-6 lg:mb-8 text-center font-bold cursor-default">
            Bộ sưu tập thời trang xu hướng
          </div>
          <Button
            className="uppercase text-sm md:text-base lg:text-[21px] z-10 bg-transparent hover:bg-transparent text-white hover:text-white rounded-sm p-3 md:p-4 lg:p-5"
            variant={"outline"}
          >
            Mua ngay
          </Button>
        </div>
      )}
    </div>
  );
};

export default Banner;
