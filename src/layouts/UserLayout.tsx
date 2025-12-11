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
      <main className="pt-[88px] bg-stone-100">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default UserLayout;
