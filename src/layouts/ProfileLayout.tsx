import { cn } from "@/lib/utils";
import { User, Package, Lock, MapPin, Bell } from "lucide-react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  {
    path: "/profile/info",
    label: "Thông tin cá nhân",
    icon: User,
  },
  {
    path: "/profile/orders",
    label: "Đơn hàng",
    icon: Package,
  },
  {
    path: "/profile/change-password",
    label: "Đổi mật khẩu",
    icon: Lock,
  },
  {
    path: "/profile/addresses",
    label: "Địa chỉ nhận hàng",
    icon: MapPin,
  },
  {
    path: "/profile/notifications",
    label: "Thông báo",
    icon: Bell,
  },
];

export const ProfileLayout = () => {
  const location = useLocation();
  const { profile } = useProfile();
  const isMobile = useIsMobile();

  // Redirect /profile to /profile/info
  if (location.pathname === "/profile") {
    return <Navigate to="/profile/info" replace />;
  }

  return (
    <div className="bg-background min-h-screen pt-8 md:pt-20">
      <div className="max-w-[1440px] mx-auto md:px-5 px-1">
        <div className="text-2xl uppercase font-medium border-b-[2px] border-black w-fit mb-3">
          Hồ sơ
        </div>
        <div className="mb-3 text-muted-foreground">
          Theo dõi, chỉnh sửa thông tin cá nhân của bạn
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-card rounded-lg border-[1px] border-border p-4 sticky top-6">
              {/* User Profile Section */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-border">
                <div className="h-12 w-12 rounded-md overflow-hidden bg-slate-100">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="h-full w-full flex items-center justify-center text-lg font-semibold text-muted-foreground bg-gradient-to-br from-slate-100 to-slate-200 dark:from-input dark:to-border"
                    style={{ display: profile?.avatar ? "none" : "flex" }}
                  >
                    {profile?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {profile?.name ?? "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.email ?? ""}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-input/20"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white dark:bg-card rounded-lg border-[1px] border-border p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
