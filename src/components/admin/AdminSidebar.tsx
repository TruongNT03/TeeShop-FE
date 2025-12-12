import {
  Bell,
  Bot,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  Layers,
  LogOut,
  UserPen,
  UserRound,
  Wrench,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const { logoutMutate } = useAuth();

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        toast.success("Đăng xuất thành công!");
        navigate("/login");
      },
      onError: () => {
        // Clear tokens anyway on error
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        toast.info("Đã đăng xuất");
        navigate("/login");
      },
    });
  };

  return (
    <Sidebar collapsible="offcanvas" className="font-medium">
      {/* Header */}
      <SidebarHeader>
        <Link to="/admin">
          <Button
            variant="ghost"
            className="hover:bg-transparent w-full flex justify-start p-0 mt-5"
          >
            <span className="text-2xl pl-2">TEE SHOP</span>
          </Button>
        </Link>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Applications</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <div onClick={() => navigate("/admin")}>
                  <SidebarMenuButton>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>

              {/* User */}
              <Collapsible defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="group">
                      <UserRound />
                      <span>User</span>
                      <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <div onClick={() => navigate("/admin/user")}>
                          <SidebarMenuSubButton>
                            Management
                          </SidebarMenuSubButton>
                        </div>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Role</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Permission</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Product */}
              <Collapsible defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="group">
                      <Layers />
                      <span>Product</span>
                      <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <div onClick={() => navigate("/admin/product")}>
                          <SidebarMenuSubButton>
                            Management
                          </SidebarMenuSubButton>
                        </div>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>

                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <div onClick={() => navigate("/admin/category")}>
                            <SidebarMenuSubButton>
                              Category
                            </SidebarMenuSubButton>
                          </div>
                        </SidebarMenuSubItem>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Order */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="group">
                    <CreditCard />
                    <span>Order</span>
                    <ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <div onClick={() => navigate("/admin/order")}>
                        <SidebarMenuSubButton>Management</SidebarMenuSubButton>
                      </div>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              {/* Notifications */}
              <SidebarMenuItem>
                <div onClick={() => navigate("/admin/notifications")}>
                  <SidebarMenuButton>
                    <Bell />
                    <span>Notifications</span>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>

              {/* Configuration */}
              <Link to="admin/configuration">
                <SidebarMenuButton className="group">
                  <Wrench />
                  <span>Configuration</span>
                </SidebarMenuButton>
              </Link>

              {/* Chatbot */}
              <Link to="/admin/chatbot">
                <SidebarMenuButton className="group">
                  <Bot />
                  <span>Chatbot</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full h-12" variant="outline">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBixXPQcgpyjTzShiuqLP6cbwiXz5MX5F_xA&s"
                alt=""
                className="w-8 h-8 rounded-md"
              />
              <div className="flex flex-col items-start">
                <div>Truong. NT</div>
                <div className="font-normal">ntt26072003@gmail.com</div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 ml-56">
            <Button
              className="w-full h-12 hover:bg-transparent cursor-default"
              variant="ghost"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBixXPQcgpyjTzShiuqLP6cbwiXz5MX5F_xA&s"
                alt=""
                className="w-8 h-8 rounded-md"
              />
              <div className="flex flex-col items-start">
                <div>Truong. NT</div>
                <div className="font-normal">ntt26072003@gmail.com</div>
              </div>
            </Button>
            <div className="text-sm">Role: Admin</div>
            <div className="w-full h-[1px] bg-gray-300 my-1" />
            <Button variant="ghost" className="w-full flex justify-start gap-3">
              <UserPen />
              <span>Profile</span>
            </Button>

            <Button variant="ghost" className="w-full flex justify-start gap-3">
              <Bell />
              <span>Notification</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full flex justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut />
              <span>Logout</span>
            </Button>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSideBar;
