import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Check,
  Clock,
  Info,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useUnreadNotificationCount,
} from "@/queries/notificationQueries";
import { formatDistanceToNow } from "date-fns";
import { apiClient } from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControl } from "@/components/ui/pagination";

const AdminNotification = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch notifications
  const { data, isLoading } = useNotifications(pageSize, page);

  // Fetch unread count
  const { data: unreadData } = useUnreadNotificationCount();

  const notifications = data?.data?.data || [];
  const pagination = data?.data.paginate || {
    page: 1,
    pageSize: 20,
    totalItem: 0,
    totalPage: 1,
  };
  const unreadCount = unreadData?.data?.totalUnread || 0;

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

  const handleNotificationClick = (notification: any) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }

    // Check if notification has orderId in meta
    if (notification.meta?.orderId) {
      const orderId = notification.meta.orderId;
      navigate(`/admin/order/${orderId}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationType = (notification: any) => {
    return notification.meta?.type || "info";
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium uppercase">Thông báo</h1>
        {unreadCount > 0 && (
          <Button
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            variant="outline"
            size="sm"
          >
            <Check className="h-4 w-4 mr-2" />
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <Card className="overflow-hidden p-0">
        <div className="divide-y">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : notifications.length > 0 ? (
            notifications.map((notification: any) => (
              <div
                key={notification.id}
                className={cn(
                  "p-6 hover:bg-accent transition-colors cursor-pointer",
                  !notification.isRead && "bg-blue-50/50"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(getNotificationType(notification))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h3
                        className={cn(
                          "text-base font-medium",
                          !notification.isRead
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Không có thông báo
              </h3>
              <p className="text-sm text-muted-foreground">
                Bạn chưa có thông báo nào
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Pagination */}
      {notifications.length > 0 && (
        <div className="py-10 flex justify-center items-center">
          <PaginationControl
            currentPage={pagination.page}
            totalPage={pagination.totalPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AdminNotification;
