import AdminSideBar from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AdminSideBar />
      <main className="w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
