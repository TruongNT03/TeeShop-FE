import React from "react";
import { motion } from "motion/react";
import { Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const mockOrders = [
  {
    id: "#ORD001",
    date: "Nov 5, 2025",
    items: 3,
    total: "1,250,000đ",
    status: "delivered",
    statusText: "Đã giao",
  },
  {
    id: "#ORD002",
    date: "Oct 28, 2025",
    items: 2,
    total: "850,000đ",
    status: "shipping",
    statusText: "Đang giao",
  },
  {
    id: "#ORD003",
    date: "Oct 15, 2025",
    items: 1,
    total: "450,000đ",
    status: "delivered",
    statusText: "Đã giao",
  },
  {
    id: "#ORD004",
    date: "Oct 10, 2025",
    items: 4,
    total: "2,100,000đ",
    status: "processing",
    statusText: "Đang xử lý",
  },
  {
    id: "#ORD005",
    date: "Sep 28, 2025",
    items: 2,
    total: "750,000đ",
    status: "cancelled",
    statusText: "Đã hủy",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "delivered":
      return {
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        border: "border-emerald-200",
      };
    case "shipping":
      return {
        icon: Truck,
        color: "text-blue-600",
        bg: "bg-blue-100",
        border: "border-blue-200",
      };
    case "processing":
      return {
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-100",
        border: "border-amber-200",
      };
    case "cancelled":
      return {
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-100",
        border: "border-red-200",
      };
    default:
      return {
        icon: Package,
        color: "text-slate-600",
        bg: "bg-slate-100",
        border: "border-slate-200",
      };
  }
};

export const ProfileOrders: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Đơn hàng của tôi</h1>
        <div className="text-sm text-slate-500">
          Tổng:{" "}
          <span className="font-semibold text-slate-900">
            {mockOrders.length}
          </span>{" "}
          đơn hàng
        </div>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order, index) => {
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
                      <p className="font-semibold text-slate-900">{order.id}</p>
                      <p className="text-sm text-slate-500">{order.date}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="text-slate-600">
                      <span className="font-medium">{order.items}</span> sản
                      phẩm
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-900">
                      {order.total}
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
                    {order.statusText}
                  </span>

                  <button className="text-sm font-medium text-primary hover:underline">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {mockOrders.length === 0 && (
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
  );
};
