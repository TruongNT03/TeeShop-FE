import React, { useMemo } from "react";
import {
  Bell,
  Check,
  Clock,
  Info,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useUnreadNotificationCount,
} from "@/queries/notificationQueries";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Notification = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch notifications from API
  const { data, isLoading } = useNotifications(20, 1);

  // Fetch unread count from API
  const { data: unreadData } = useUnreadNotificationCount();

  // Initialize WebSocket connection
  useNotificationSocket();

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.api.notificationControllerMarkAllRead();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationUnreadCount"] });
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
    },
    onError: () => {
      toast.error("Không thể đánh dấu thông báo");
    },
  });

  // Mark single as read mutation
  const markReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiClient.api.notificationControllerMarkRead(
        notificationId
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationUnreadCount"] });
    },
    onError: () => {
      toast.error("Không thể đánh dấu thông báo");
    },
  });

  const notifications = data?.data?.data || [];
  const unreadCount = unreadData?.data?.totalUnread || 0;

  const handleNotificationClick = (notification: any) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }

    // Check if notification has orderId in meta
    if (notification.meta?.orderId) {
      const orderId = notification.meta.orderId;

      // Navigate to appropriate order detail page based on user role
      if (profile?.roles?.includes("admin")) {
        navigate(`/admin/order/${orderId}`);
      } else {
        navigate(`/profile/orders/${orderId}`);
      }

      setIsOpen(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationType = (notification: any) => {
    // You can determine type from meta or other fields
    return notification.meta?.type || "info";
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Bell className="cursor-pointer" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-semibold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <button
              className="text-xs text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
            >
              <Check className="h-3 w-3" />
              {markAllReadMutation.isPending
                ? "Đang xử lý..."
                : "Mark all as read"}
            </button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-sm">Loading...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start",
                    !notification.isRead && "bg-slate-50/50"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="mt-1 flex-shrink-0">
                    {getIcon(getNotificationType(notification))}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p
                      className={cn(
                        "text-sm font-medium leading-none",
                        !notification.isRead
                          ? "text-slate-900"
                          : "text-slate-600"
                      )}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {notification.content}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(notification.createdAt)}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>
        <div className="p-2 border-t border-slate-100 bg-slate-50">
          <Button
            variant="ghost"
            className="w-full h-8 text-xs text-slate-500"
            onClick={() => {
              if (profile?.roles?.includes("admin")) {
                navigate("/admin/notifications");
              } else {
                navigate("/profile/notifications");
              }
              setIsOpen(false);
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
