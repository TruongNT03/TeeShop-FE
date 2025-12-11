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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useUnreadNotificationCount,
} from "@/queries/notificationQueries";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Notification = () => {
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
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="hover:text-primary" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-semibold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-white border border-slate-200 shadow-lg rounded-lg p-2 text-sm max-h-[500px] overflow-y-auto">
        <div className="flex flex-col min-w-[280px] gap-1">
          {isLoading ? (
            <div className="px-3 py-4 text-center text-slate-500 text-xs">
              Đang tải...
            </div>
          ) : notifications.length > 0 ? (
            notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "px-3 py-2 rounded-md hover:bg-slate-100 transition-colors cursor-pointer",
                  !notification.isRead && "bg-slate-50"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(getNotificationType(notification))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-xs font-medium truncate",
                        !notification.isRead
                          ? "text-slate-900"
                          : "text-slate-600"
                      )}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {notification.content}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(notification.createdAt)}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-slate-500">
              <Bell className="h-6 w-6 mx-auto mb-1 opacity-20" />
              <p className="text-xs">Không có thông báo</p>
            </div>
          )}
          {notifications.length > 0 && (
            <>
              <div className="h-px bg-slate-200 my-1"></div>
              <Link
                to={
                  profile?.roles?.includes("admin")
                    ? "/admin/notifications"
                    : "/profile/notifications"
                }
                className="px-3 py-2 rounded-md hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900 text-xs"
              >
                Xem tất cả
              </Link>
            </>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default Notification;
