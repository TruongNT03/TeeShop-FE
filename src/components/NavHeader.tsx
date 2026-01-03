import {
  User,
  Package,
  Lock,
  MapPin,
  LogOut,
  X,
  ShoppingCart,
  Menu,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useCartTooltip } from "@/hooks/useCardTooltip";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import Notification from "./Notification";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const NavHeader = () => {
  const { cartSummaryData } = useCartTooltip();
  const [isHiddenHeaderNotification, setIsHiddenHeaderNotification] =
    useState(false);
  const [isHiddenNavHeader, setIsHiddenNavHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { logoutMutate, profile, accessToken } = useAuth();
  const isMobile = useIsMobile();
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { pathname } = useLocation();

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
    setIsOpenMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpenMenu) {
      document.body.style.overflow = "hidden";
    }
  }, [isOpenMenu]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollY = window.scrollY;

  //     if (currentScrollY > lastScrollY && currentScrollY > 80) {
  //       setIsHiddenNavHeader(true);
  //     } else {
  //       setIsHiddenNavHeader(false);
  //     }

  //     setLastScrollY(currentScrollY);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [lastScrollY]);

  return (
    <>
      <AnimatePresence>
        {isOpenMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen w-full fixed z-100"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="h-full w-[75%] fixed bg-white p-5"
            >
              <div className="flex justify-between items-center">
                <Link
                  to=""
                  className="uppercase text-2xl"
                  onClick={() => setIsOpenMenu(false)}
                >
                  TEE SHOP
                </Link>
                <X onClick={() => setIsOpenMenu(false)} />
              </div>
              <div className="mt-20 flex flex-col gap-8">
                <Link to="">Trang chủ</Link>
                <Link to="product">Sản phẩm</Link>
                <Link to="vouchers">Voucher</Link>
                <div className="h-[1px] w-full bg-border"></div>
                {accessToken ? (
                  <div>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Tài khoản</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-6 mt-2">
                            <Link to="profile/info">Hồ sơ</Link>
                            <Link to="profile/orders">Đơn hàng</Link>
                            <Link to="cart">Giỏ hàng</Link>
                            <Link to="profile/change-password">
                              Đổi mật khẩu
                            </Link>
                            <Link to="profile/addresses">
                              Địa chỉ nhận hàng
                            </Link>
                            <Link to="profile/notifications">Thông báo</Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <div className="my-6 h-[1px] w-full bg-border"></div>
                    <div onClick={handleLogout}>Đăng xuất</div>
                  </div>
                ) : (
                  <Link to="login">Đăng nhập</Link>
                )}
              </div>
            </motion.div>
            <div
              className="h-full bg-black/40"
              onClick={() => setIsOpenMenu(false)}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`w-full fixed z-20 top-0 left-0 transition-transform duration-500 ${
          isHiddenNavHeader ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {!isMobile && (
          <div
            className={`w-full bg-primary text-primary-foreground ${
              isHiddenHeaderNotification ? "h-0" : "h-[33px]"
            } overflow-hidden transition-all duration-300`}
          >
            <div className="max-w-[14400px] mx-auto px-4 h-full flex items-center uppercase">
              <div className="hover:underline cursor-pointer flex-1 text-center">
                Free Shipping & Returns On All US Orders
              </div>
              <X
                onClick={() => setIsHiddenHeaderNotification(true)}
                className="cursor-pointer scale-75 hover:text-red-500"
              />
            </div>
          </div>
        )}

        {!isOpenMenu && (
          <div
            className={`w-full bg-background transition-all shadow-sm ${
              isHiddenHeaderNotification ? "" : "mt-0"
            }`}
          >
            <div className="max-w-[1440px] mx-auto px-1 md:px-5 h-[60px] md:h-[88px] flex justify-between items-center">
              <div className="flex w-full items-center gap-8">
                <Link to="" className="text-3xl uppercase cursor-pointer">
                  Tee Shop
                </Link>

                {!isMobile && (
                  <ul className="flex items-center gap-8 text-sm uppercase font-semibold">
                    <Link to="">
                      <li className="cursor-pointer hover:text-primary">
                        Trang chủ
                      </li>
                    </Link>
                    <Link to="/product">
                      <li className="cursor-pointer hover:text-primary">
                        Sản phẩm
                      </li>
                    </Link>
                    <Link to="/vouchers">
                      <li className="cursor-pointer hover:text-primary">
                        Voucher
                      </li>
                    </Link>
                  </ul>
                )}
              </div>

              {isMobile && <Menu onClick={() => setIsOpenMenu(true)} />}

              {!isMobile && (
                <div className="flex gap-[20px] ml-8">
                  {profile?.name ? (
                    <div className="flex items-center font-medium w-fit text-nowrap text-base">
                      {`Hello, ${profile?.name}`}
                    </div>
                  ) : null}

                  {/* Cart Icon with Tooltip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/cart">
                        <ShoppingCart className="cursor-pointer hover:text-primary" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border border-slate-200 shadow-lg rounded-lg p-2 text-sm max-h-[500px] overflow-y-auto">
                      <div className="flex flex-col min-w-[320px] gap-1">
                        {accessToken ? (
                          cartSummaryData?.cartItems &&
                          cartSummaryData.cartItems.length > 0 ? (
                            <>
                              {cartSummaryData.cartItems
                                .slice(0, 5)
                                .map((cartItem) => (
                                  <Link
                                    key={cartItem.id}
                                    to={`/product/${cartItem.product.id}`}
                                    className="px-3 py-2 rounded-md hover:bg-slate-100 transition-colors flex items-start gap-3 text-slate-700 hover:text-slate-900"
                                  >
                                    {cartItem.product?.productImages[0]?.url ? (
                                      <img
                                        src={
                                          cartItem.product.productImages[0].url
                                        }
                                        alt={cartItem.product.name}
                                        className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                                      />
                                    ) : (
                                      <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
                                    )}
                                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                                      <div className="font-medium text-sm line-clamp-1 uppercase">
                                        {cartItem.product.name}
                                      </div>
                                      <div className="text-xs text-slate-600 font-medium">
                                        {formatPriceVND(
                                          cartItem.productVariant.price
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span>SL: {cartItem.quantity}</span>
                                        {cartItem.productVariant.variantValues
                                          .length > 0 && (
                                          <>
                                            <span>•</span>
                                            <div className="flex gap-1 flex-wrap">
                                              {cartItem.productVariant.variantValues
                                                .map(
                                                  (variantValue, idx) =>
                                                    variantValue.value
                                                )
                                                .join(" - ")}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              {cartSummaryData.totalItems > 5 ? (
                                <>
                                  <div className="h-px bg-slate-200 my-1"></div>
                                  <Link
                                    to="/cart"
                                    className="px-3 py-2 rounded-md hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900 text-xs font-medium"
                                  >
                                    Xem thêm
                                  </Link>
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <div className="px-3 py-4 text-center text-slate-500">
                              <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-20" />
                              <p className="text-xs">Giỏ hàng trống</p>
                            </div>
                          )
                        ) : (
                          <div className="px-3 py-4 text-center text-slate-500">
                            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p className="text-xs">Bạn chưa đăng nhập!</p>
                            <p className="text-xs mt-1">
                              Đăng nhập để xem giỏ hàng
                            </p>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>

                  {/* Notification Icon */}
                  {accessToken && <Notification />}

                  {/* User Icon with Tooltip */}
                  {accessToken ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/profile">
                          <User className="cursor-pointer hover:text-primary" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white border border-slate-200 shadow-lg rounded-lg p-2 text-sm">
                        <div className="flex flex-col min-w-[200px] gap-1">
                          <Link
                            to="/profile/info"
                            className="px-3 py-2 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-2 text-slate-700 hover:text-slate-900"
                          >
                            <User className="h-4 w-4" />
                            <span>Thông tin cá nhân</span>
                          </Link>
                          <Link
                            to="/profile/orders"
                            className="px-3 py-2 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-2 text-slate-700 hover:text-slate-900"
                          >
                            <Package className="h-4 w-4" />
                            <span>Đơn hàng của tôi</span>
                          </Link>
                          <Link
                            to="/profile/change-password"
                            className="px-3 py-2 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-2 text-slate-700 hover:text-slate-900"
                          >
                            <Lock className="h-4 w-4" />
                            <span>Đổi mật khẩu</span>
                          </Link>
                          <Link
                            to="/profile/addresses"
                            className="px-3 py-2 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-2 text-slate-700 hover:text-slate-900"
                          >
                            <MapPin className="h-4 w-4" />
                            <span>Địa chỉ nhận hàng</span>
                          </Link>
                          <div className="h-px bg-slate-200 my-1"></div>
                          <Link
                            to="/"
                            onClick={handleLogout}
                            className="px-3 py-2 rounded-md hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Đăng xuất</span>
                          </Link>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link to="/login">
                      <User className="cursor-pointer hover:text-primary" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NavHeader;
