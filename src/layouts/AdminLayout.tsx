import AdminChatWidget from "@/components/admin/AdminChatWidget";
import AdminSideBar from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import Notification from "@/components/Notification";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AdminSideBar />
      <main className="w-full">
        <AdminChatWidget />
        <div className="h-12 border-b-[1px] border-border flex flex-col justify-center">
          <div className="w-full mx-auto flex items-center justify-between px-8">
            <SidebarTrigger />
            <Notification />
          </div>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
