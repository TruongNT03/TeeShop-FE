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
  Ticket,
  ChevronsLeftRight,
  MapPin,
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
  useSidebar,
} from "../ui/sidebar";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PermissionGuard } from "../PermissionGuard";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const { logoutMutate, profile } = useAuth();
  const { state } = useSidebar();

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
    <Sidebar collapsible="icon" className="font-medium">
      {/* Header */}
      <SidebarHeader>
        {state !== "collapsed" && (
          <Link to="/admin">
            <Button
              variant="ghost"
              className="hover:bg-transparent w-full flex justify-start p-0 mt-5"
            >
              <span className="text-2xl pl-2">TEE SHOP</span>
            </Button>
          </Link>
        )}
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
              <Collapsible>
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
                        <PermissionGuard module="User" action="full">
                          <div
                            onClick={() => navigate("/admin/role-permission")}
                          >
                            <SidebarMenuSubButton>
                              Role & Permission
                            </SidebarMenuSubButton>
                          </div>
                        </PermissionGuard>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Product */}
              <Collapsible>
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

              <SidebarMenuItem>
                <div onClick={() => navigate("/admin/order")}>
                  <SidebarMenuButton>
                    <CreditCard />
                    <span>Order</span>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>

              {/* Location */}
              <SidebarMenuItem>
                <div onClick={() => navigate("/admin/location")}>
                  <SidebarMenuButton>
                    <MapPin />
                    <span>Location</span>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>

              {/* Notifications */}
              <SidebarMenuItem>
                <div onClick={() => navigate("/admin/notifications")}>
                  <SidebarMenuButton>
                    <Bell />
                    <span>Notifications</span>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>

              {/* Voucher */}
              <SidebarMenuItem>
                <div onClick={() => navigate("/admin/voucher")}>
                  <SidebarMenuButton>
                    <Ticket />
                    <span>Voucher</span>
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
            <Button
              className={`w-full h-12 border-none ${
                state !== "collapsed" ? "" : "border-none hover:bg-transparent"
              }`}
              variant="outline"
            >
              <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                {profile?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              {state !== "collapsed" && (
                <div className="flex flex-col items-start justify-start overflow-hidden ml-3">
                  <div className="truncate">{profile?.name || "Admin"}</div>
                  <div className="font-normal text-xs truncate w-full text-muted-foreground">
                    {profile?.email || "admin@example.com"}
                  </div>
                </div>
              )}
              {state !== "collapsed" && (
                <ChevronsLeftRight className="rotate-90" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 ml-2" side="right" align="end">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                {profile?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <div className="font-semibold truncate">
                  {profile?.name || "Admin"}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {profile?.email || "admin@example.com"}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Role: Admin
            </div>
            <div className="w-full h-[1px] bg-gray-300 my-2" />
            <Button variant="ghost" className="w-full flex justify-start gap-3">
              <UserPen className="w-4 h-4" />
              <span>Profile</span>
            </Button>

            <Button variant="ghost" className="w-full flex justify-start gap-3">
              <Bell className="w-4 h-4" />
              <span>Notification</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full flex justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSideBar;
