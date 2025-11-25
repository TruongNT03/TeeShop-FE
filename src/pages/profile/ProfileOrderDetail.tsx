import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Package,
  Clock,
  Truck,
  ArrowLeft,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getOrdersQuery } from "@/queries/orderQueries";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { convertDateTime } from "@/utils/convertDateTime";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const getStatusConfig = (status: "pending" | "shipping") => {
  switch (status) {
    case "shipping":
      return {
        icon: Truck,
        color: "text-blue-600",
        bg: "bg-blue-100",
        border: "border-blue-200",
        text: "Đang giao",
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

export const ProfileOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = getOrdersQuery(100, 1);
  const order = data?.data?.data?.find((o) => o.id === id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900">
          Không tìm thấy đơn hàng
        </h3>
        <button
          onClick={() => navigate("/profile/orders")}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Quay lại danh sách đơn hàng
        </button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/profile/orders")}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">
            Chi tiết đơn hàng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            #{order.id.substring(0, 8).toUpperCase()}
          </p>
        </div>
        <Badge className={cn("gap-1.5", statusConfig.bg, statusConfig.color)}>
          <StatusIcon className="h-3.5 w-3.5" />
          {statusConfig.text}
        </Badge>
      </div>

      {/* Order Info */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Ngày đặt hàng</p>
                <p className="font-medium">
                  {convertDateTime(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tổng tiền</p>
                <p className="font-medium text-lg">
                  {formatPriceVND(order.amount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shipping Address */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Địa chỉ giao hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="font-medium">{order.address.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-slate-700">{order.address.phoneNumber}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-slate-700">{order.address.detail}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Items */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Sản phẩm ({order.orderItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      {item.product.productImages?.[0]?.url && (
                        <img
                          src={item.product.productImages[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      {item.productVariant.variantValues.length > 0 && (
                        <p className="text-sm text-slate-500 mt-1">
                          {item.productVariant.variantValues
                            .map((vv) => `${vv.variant}: ${vv.value}`)
                            .join(" / ")}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-sm text-slate-600">
                          Số lượng:{" "}
                          <span className="font-medium">{item.quantity}</span>
                        </p>
                        <span className="text-slate-400">•</span>
                        <p className="font-medium text-slate-900">
                          {formatPriceVND(item.productVariant.price)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {formatPriceVND(
                          item.productVariant.price * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính</span>
                <span>{formatPriceVND(order.amount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-lg font-bold text-slate-900">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {formatPriceVND(order.amount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
