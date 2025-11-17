import { Menu, ShoppingBag, User, X } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useCartTooltip } from "@/hooks/useCardTooltip";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { Badge } from "./ui/badge";

const NavHeader = () => {
  const { cartSummaryData } = useCartTooltip();
  const [isHiddenHeaderNotification, setIsHiddenHeaderNotification] =
    useState(false);
  const [isHiddenNavHeader, setIsHiddenNavHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { logoutMutate, profile, accessToken } = useAuth();

  const imageRef = useRef<HTMLImageElement>(null);

  const handleLogout = () => {
    logoutMutate(void 0, {
      onSuccess: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "";
      },
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsHiddenNavHeader(true);
      } else {
        setIsHiddenNavHeader(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`w-full fixed z-20 top-0 left-0 transition-transform duration-500 ${
        isHiddenNavHeader ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`w-full ${
          isHiddenHeaderNotification ? "h-0" : "h-[33px]"
        } flex items-center bg-primary text-primary-foreground uppercase overflow-hidden transition-all duration-300`}
      >
        <div className="hover:underline cursor-pointer flex-1 text-center">
          Free Shipping & Returns On All US Orders
        </div>
        <X
          onClick={() => setIsHiddenHeaderNotification(true)}
          className="cursor-pointer scale-75 hover:text-red-500 mr-2"
        />
      </div>

      <div
        className={`w-full bg-background flex justify-between items-center px-[65px] h-[88px] transition-all shadow-sm ${
          isHiddenHeaderNotification ? "" : "mt-0"
        }`}
      >
        <div className="flex w-full">
          <Link to="" className="text-3xl uppercase cursor-pointer">
            Tee Shop
          </Link>

          <ul className="flex items-center font-arimo gap-16 text-sm uppercase font-semibold ml-[156px]">
            <Link to="">
              <li className="cursor-pointer hover:text-primary">Home</li>
            </Link>
            <li className="cursor-pointer hover:text-primary">About</li>
            <li className="cursor-pointer hover:text-primary">Contact Us</li>
          </ul>
        </div>

        <div className="flex gap-[20px] ml-8">
          {profile?.data?.lastName ? (
            <div className="flex items-center font-medium w-fit text-nowrap">
              {`Hello, ${profile?.data?.lastName}`}
            </div>
          ) : null}
          <Link to={localStorage.getItem("accessToken") ? "/profile" : "login"}>
            <Tooltip>
              <TooltipTrigger asChild>
                <User className="cursor-pointer hover:text-primary" />
              </TooltipTrigger>
              <TooltipContent className="bg-white text-black border-border border-[1px] text-base">
                <div className="flex flex-col gap-4 p-2">
                  <Link to="/profile">My profile</Link>

                  <Link to="/" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              </TooltipContent>
            </Tooltip>
          </Link>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/cart">
                <ShoppingBag className="cursor-pointer hover:text-primary" />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="w-[400px] h-[500px] bg-white border-[1px] border-border shadow flex p-0 overflow-hidden">
              <div className="w-full text-black flex flex-col gap-5">
                {accessToken ? (
                  cartSummaryData?.cartItems?.map((cartItem) => (
                    <div className="w-full flex hover:bg-primary/80 p-4 gap-2 cursor-pointer hover:text-white group">
                      <div>
                        <img
                          src={cartItem.product.productImages[0].url}
                          alt=""
                          onError={(e) => {
                            e.currentTarget.setAttribute(
                              "src",
                              "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                            );
                          }}
                          className="w-12 rounded-md"
                        />
                      </div>
                      <div className="flex flex-col gap-2 justify-center">
                        <div className="font-semibold">
                          {cartItem.product.name}
                        </div>
                        <div className="flex gap-4 items-center">
                          <div>
                            Price:{" "}
                            {formatPriceVND(cartItem.productVariant.price)}
                          </div>
                          <div>Quantity: {cartItem.quantity}</div>
                          <div className="flex gap-2">
                            {cartItem.productVariant.variantValues.map(
                              (variantValue) => (
                                <Badge
                                  variant="outline"
                                  className="group-hover:text-white"
                                >
                                  {variantValue.value}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-base flex flex-col gap-4 justify-center items-center text-center">
                    <div>You’re not signed in yet!</div>
                    <div>
                      Log in to see your cart and pick up where you left off.
                    </div>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>

          <Menu className="cursor-pointer hover:text-primary" />
        </div>
      </div>
    </div>
  );
};

export default NavHeader;
