import React, { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle, Truck, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOrdersQuery } from "@/queries/orderQueries";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { convertDateTime } from "@/utils/convertDateTime";
import { Skeleton } from "@/components/ui/skeleton";
import type { OrderResponseDto } from "@/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const getStatusConfig = (
  status: "pending" | "shipping" | "confirmed" | "completed" | "cancel"
) => {
  switch (status) {
    case "completed":
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
        border: "border-green-200",
        text: "Đã hoàn thành",
      };
    case "confirmed":
      return {
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        border: "border-emerald-200",
        text: "Đã xác nhận",
      };
    case "shipping":
      return {
        icon: Truck,
        color: "text-blue-600",
        bg: "bg-blue-100",
        border: "border-blue-200",
        text: "Đang giao",
      };
    case "cancel":
      return {
        icon: X,
        color: "text-red-600",
        bg: "bg-red-100",
        border: "border-red-200",
        text: "Hủy",
      };
    case "pending":
    default:
      return {
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-100",
        border: "border-amber-200",
        text: "Đang xử lý",
      };
  }
};

const OrderSkeleton = () => (
  <div className="rounded-lg border bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5" />
          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  </div>
);

export const ProfileOrders: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = getOrdersQuery(pageSize, page);
  const orders = data?.data?.data || [];
  const totalPages = data?.data?.paginate?.totalPage || 1;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Đơn hàng của tôi</h1>
        {!isLoading && (
          <div className="text-sm text-slate-500">
            Tổng:{" "}
            <span className="font-semibold text-slate-900">
              {data?.data?.paginate?.totalItem || 0}
            </span>{" "}
            đơn hàng
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: OrderResponseDto, index: number) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                }}
                className={cn(
                  "rounded-lg border bg-white p-4 shadow-sm hover:shadow-lg",
                  statusConfig.border
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="font-semibold text-slate-900">
                          #{order.id.substring(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-slate-500">
                          {convertDateTime(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <span className="text-slate-600">
                        <span className="font-medium">
                          {order.orderItems.length}
                        </span>{" "}
                        sản phẩm
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-900">
                        {formatPriceVND(order.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                        statusConfig.bg,
                        statusConfig.color
                      )}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusConfig.text}
                    </span>

                    <Link
                      to={`/profile/orders/${order.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {orders.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">
                Chưa có đơn hàng nào
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Bắt đầu mua sắm để tạo đơn hàng đầu tiên của bạn!
              </p>
            </div>
          )}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={cn(page === 1 && "pointer-events-none opacity-50")}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => setPage(i + 1)}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={cn(
                  page === totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
