import {
  Menu,
  ShoppingBag,
  User,
  X,
  UserCircle,
  Package,
  Lock,
  MapPin,
  LogOut,
  Home,
  ShoppingCart,
  Info,
  Phone,
} from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useCartTooltip } from "@/hooks/useCardTooltip";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { Badge } from "./ui/badge";
import Notification from "./Notification";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const NavHeader = () => {
  const { cartSummaryData } = useCartTooltip();
  const [isHiddenHeaderNotification, setIsHiddenHeaderNotification] =
    useState(false);
  const [isHiddenNavHeader, setIsHiddenNavHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        className={`w-full bg-background flex justify-between items-center px-4 md:px-8 lg:px-[65px] h-[88px] transition-all shadow-sm ${
          isHiddenHeaderNotification ? "" : "mt-0"
        }`}
      >
        <div className="flex w-full items-center">
          <Link to="" className="text-2xl md:text-3xl uppercase cursor-pointer">
            Tee Shop
          </Link>

          <ul className="hidden lg:flex items-center gap-8 xl:gap-16 text-sm uppercase font-semibold ml-8 xl:ml-[156px]">
            <Link to="">
              <li className="cursor-pointer hover:text-primary">Trang chủ</li>
            </Link>
            <Link to="/product">
              <li className="cursor-pointer hover:text-primary">Sản phẩm</li>
            </Link>
            <li className="cursor-pointer hover:text-primary">Giới thiệu</li>
            <li className="cursor-pointer hover:text-primary">Liên hệ</li>
          </ul>
        </div>

        <div className="flex gap-4 md:gap-[20px] ml-4 md:ml-8">
          {profile?.name ? (
            <div className="hidden md:flex items-center font-medium w-fit text-nowrap text-sm md:text-base">
              {`Hello, ${profile?.name}`}
            </div>
          ) : null}

          {/* User Icon - Desktop with Tooltip, Mobile without */}
          <div className="hidden lg:block">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={
                    localStorage.getItem("accessToken") ? "/profile" : "login"
                  }
                >
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
          </div>

          {/* Notification Icon - Desktop */}
          {accessToken && (
            <div className="hidden lg:block">
              <Notification />
            </div>
          )}

          {/* Cart Icon - Desktop with Tooltip, Mobile direct link */}
          <div className="hidden lg:block">
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
                            src={cartItem.product?.productImages[0]?.url}
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
                          <div className="font-semibold uppercase">
                            {cartItem.product.name}
                          </div>
                          <div className="flex gap-4 items-center">
                            <div>
                              Giá:{" "}
                              {formatPriceVND(cartItem.productVariant.price)}
                            </div>
                            <div>Số lượng: {cartItem.quantity}</div>
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
                      <div>Bạn chưa đăng nhập!</div>
                      <div>Đăng nhập để xem giỏ hàng và tiếp tục mua sắm.</div>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Mobile Cart Icon - Direct link without tooltip */}
          <Link to="/cart" className="lg:hidden">
            <ShoppingBag className="cursor-pointer hover:text-primary" />
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Menu className="lg:hidden cursor-pointer hover:text-primary" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[400px] border-0"
            >
              <SheetHeader>
                <SheetTitle className="text-2xl uppercase">Tee Shop</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-8">
                {/* User Info */}
                {profile?.name && (
                  <div className="pb-4 px-4">
                    <div className="flex items-center gap-3">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <div>{profile.name}</div>
                        <div className="text-sm text-slate-500">
                          {profile.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="h-[1px] w-full bg-border"></div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-2">
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span>Trang chủ</span>
                  </Link>
                  <Link
                    to="/product"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Sản phẩm</span>
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Info className="h-5 w-5" />
                    <span>Giới thiệu</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone className="h-5 w-5" />
                    <span>Liên hệ</span>
                  </Link>
                </nav>

                <div className="h-[1px] w-full bg-border"></div>

                {/* User Menu */}
                {accessToken && (
                  <>
                    <div>
                      <div className="text-sm text-slate-500 mb-2 px-4">
                        TÀI KHOẢN
                      </div>
                      <div className="flex flex-col gap-1">
                        <Link
                          to="/profile/info"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <UserCircle className="h-5 w-5" />
                          <span>Thông tin cá nhân</span>
                        </Link>
                        <Link
                          to="/profile/orders"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Package className="h-5 w-5" />
                          <span>Đơn hàng của tôi</span>
                        </Link>
                        <Link
                          to="/profile/change-password"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Lock className="h-5 w-5" />
                          <span>Đổi mật khẩu</span>
                        </Link>
                        <Link
                          to="/profile/addresses"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <MapPin className="h-5 w-5" />
                          <span>Địa chỉ nhận hàng</span>
                        </Link>
                      </div>
                    </div>

                    <div className="h-[1px] w-full bg-border"></div>

                    <div className="">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex cursor-pointer items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 hover:text-red-600 w-full border-0 outline-none focus:outline-none font-normal"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Login Link for guests */}
                {!accessToken && (
                  <div className="mt-2">
                    <Link
                      to="/login"
                      className="flex cursor-pointer items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Đăng nhập</span>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default NavHeader;
