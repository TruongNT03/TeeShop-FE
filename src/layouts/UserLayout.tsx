import Footer from "@/components/Footer";
import NavHeader from "@/components/NavHeader";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="w-full">
      <NavHeader />
      <main className="pt-[88px]">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default UserLayout;
