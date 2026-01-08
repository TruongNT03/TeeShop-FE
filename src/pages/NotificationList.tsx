import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Clock,
  Info,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/queries/notificationQueries";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const NotificationList = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useNotifications(pageSize, currentPage);

  const notifications = data?.data?.data || [];
  const totalPages = data?.data?.paginate?.totalPage || 1;

  const handleNotificationClick = (notification: any) => {
    if (notification.meta?.orderId) {
      const orderId = notification.meta.orderId;

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

  return (
    <div className="container mx-auto md:p-6 p-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button> */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">Thông báo</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tất cả thông báo của bạn
          </p>
        </div>
      </div>

      {/* Notifications List */}
      {/* <Card>
        <CardContent className="p-0"> */}
      {isLoading ? (
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="divide-y divide-border">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "py-5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4 items-start",
                !notification.isRead && "bg-slate-50/50"
              )}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="mt-1 flex-shrink-0">
                {getIcon(getNotificationType(notification))}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <p
                    className={cn(
                      "text-base font-medium leading-none",
                      !notification.isRead ? "text-slate-900" : "text-slate-600"
                    )}
                  >
                    {notification.title}
                  </p>
                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-sm text-slate-500">{notification.content}</p>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" />
                  {formatTime(notification.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="text-base font-medium">No notifications</p>
          <p className="text-sm mt-1">You're all caught up!</p>
        </div>
      )}
      {/* </CardContent> */}
      {/* </Card> */}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={cn(
                    currentPage === totalPages &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
