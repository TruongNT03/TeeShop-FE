import { Carousel } from "antd";
import { Button } from "./ui/button";

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
  return (
    <div className="w-full max-h-[700px] relative pb-[24px]">
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
              className="w-full max-h-[700px] object-cover"
            />
          </div>
        ))}
      </Carousel>
      <div className="absolute  top-[50%] right-[10%] flex flex-col items-center">
        <div className="text-white uppercase text-5xl text-wrap w-[500px] mb-8 text-center font-bold cursor-default">
          stylist picks beat the heat
        </div>
        <Button
          className="uppercase text-[21px] z-10 bg-transparent hover:bg-transparent text-white hover:text-white rounded-sm p-5"
          variant={"outline"}
        >
          Shop now
        </Button>
      </div>
    </div>
  );
};

export default Banner;
