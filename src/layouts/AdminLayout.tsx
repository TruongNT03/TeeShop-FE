import AdminSideBar from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AdminSideBar />
      <main className="w-full">
        <div className="h-18  border-b-[2px] flex flex-col justify-center">
          <div className="w-[95%] mx-auto">
            <SidebarTrigger size="icon-lg" className="scale-150" />
          </div>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
