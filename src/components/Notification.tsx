import React, { useContext, useMemo } from "react";
import {
  Bell,
  Check,
  Clock,
  Info,
  AlertTriangle,
  CheckCircle,
  MessageCircleMore,
  Package,
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
import type { NotificationResponseDto } from "@/api";
import { useChatContext } from "@/contexts/ChatContext";
import { useAdminChatContext } from "@/contexts/AdminChatContext";
import { Badge } from "./ui/badge";
import { RoleType } from "@/types/userRequestPayload";

const Notification = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const { openChat } = useChatContext();
  const { setIsOpen } = useAdminChatContext();

  // Determine notification path based on current location
  const isAdminContext = window.location.pathname.startsWith("/admin");
  const notificationPath = isAdminContext
    ? "/admin/notifications"
    : "/profile/notifications";

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

  const handleNotificationClick = (notification: NotificationResponseDto) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }

    switch (notification.type) {
      case "order": {
        // Check if notification has orderId in meta
        if ((notification.meta as any)?.orderId as any) {
          const orderId = (notification.meta as any).orderId;

          // Navigate to appropriate order detail page based on user role
          if (
            profile?.roles?.includes(RoleType.ADMIN) ||
            profile?.roles?.includes(RoleType.ORDER_MANAGER) ||
            profile?.roles?.includes(RoleType.PRODUCT_MANAGER) ||
            profile?.roles?.includes(RoleType.TECHNICIAN)
          ) {
            navigate(`/admin/order/${orderId}`);
          } else {
            navigate(`/profile/orders/${orderId}`);
          }
        }
        break;
      }
      case "message": {
        if (isAdminContext) {
          setIsOpen(true);
        } else {
          openChat("admin");
        }
        break;
      }
    }
  };

  const getNotificationIcon = (notification: NotificationResponseDto) => {
    switch (notification.type) {
      case "message":
        return <MessageCircleMore className="text-white" />;
      case "order":
        return <Package className="text-amber-300" />;
      default:
        return <Info />;
    }
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
        <Link
          to={notificationPath}
          className="relative cursor-pointer inline-block group"
        >
          <Bell className="w-5 group-hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 p-0 w-5 h-5 rounded-full">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent className="bg-white border border-slate-200 shadow-lg rounded-lg p-2 text-sm max-h-[500px] w-[500px] overflow-y-auto truncate">
        <div className="flex flex-col gap-1">
          {isLoading ? (
            <div className="px-3 py-4 text-center text-slate-500 text-xs">
              Đang tải...
            </div>
          ) : notifications.length > 0 ? (
            <>
              <Button
                className="w-fit text-black ml-auto"
                variant="ghost"
                onClick={() => markAllReadMutation.mutate()}
              >
                Đánh dấu là đã đọc
              </Button>
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "px-3 py-2 rounded-md hover:bg-slate-100 transition-colors cursor-pointer ",
                    !notification.isRead && "bg-slate-50"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNotificationClick(notification);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary">
                        {getNotificationIcon(notification)}
                      </div>
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
                      <div className="w-full text-wrap text-xs text-slate-500 mt-0.5 max-h-8 truncate">
                        {notification.content}
                      </div>
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
              ))}
            </>
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
                to={notificationPath}
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
