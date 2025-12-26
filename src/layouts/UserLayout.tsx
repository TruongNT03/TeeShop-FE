import ChatWidget from "@/components/ChatWidget";
import ChatbotWidget from "@/components/ChatbotWidget";
import Footer from "@/components/Footer";
import NavHeader from "@/components/NavHeader";
import { ChatProvider } from "@/contexts/ChatContext";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="w-full">
      <ChatProvider>
        <ChatWidget />
        <ChatbotWidget />
      </ChatProvider>
      <NavHeader />
      <main
        className="
                    bg-stone-100 pt-[60px]
                      md:pt-[88px]
                      "
      >
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default UserLayout;
