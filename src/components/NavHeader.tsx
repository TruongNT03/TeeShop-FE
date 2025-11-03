import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavHeader = () => {
  const [isHiddenHeaderNotification, setIsHiddenHeaderNotification] =
    useState(false);
  const [isHiddenNavHeader, setIsHiddenNavHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

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
        } flex items-center justify-center bg-primary text-primary-foreground uppercase overflow-hidden transition-all duration-300`}
      >
        <div className="hover:underline cursor-pointer">
          Free Shipping & Returns On All US Orders
        </div>
        <X
          onClick={() => setIsHiddenHeaderNotification(true)}
          className="absolute right-[4px] cursor-pointer scale-75 hover:text-red-500"
        />
      </div>

      <div
        className={`w-full bg-background flex justify-between items-center px-[65px] h-[88px] transition-all shadow-sm ${
          isHiddenHeaderNotification ? "" : "mt-0"
        }`}
      >
        <div className="flex w-full">
          <div className="text-3xl uppercase cursor-pointer">Tee Shop</div>

          <ul className="flex items-center font-arimo gap-16 text-sm uppercase font-semibold ml-[156px]">
            <li className="cursor-pointer hover:text-primary">Home</li>
            <li className="cursor-pointer hover:text-primary">About</li>
            <li className="cursor-pointer hover:text-primary">Contact Us</li>
          </ul>
        </div>

        <div className="flex gap-[20px] ml-8">
          <Link to={localStorage.getItem("accessToken") ? "/profile" : "login"}>
            <User className="cursor-pointer hover:text-primary" />
          </Link>
          <ShoppingBag className="cursor-pointer hover:text-primary" />
          <Menu className="cursor-pointer hover:text-primary" />
        </div>
      </div>
    </div>
  );
};

export default NavHeader;