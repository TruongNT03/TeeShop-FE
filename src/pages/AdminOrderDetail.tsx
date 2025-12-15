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
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAdminOrder,
  useUpdateOrderStatus,
} from "@/queries/adminOrderQueries";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { convertDateTime } from "@/utils/convertDateTime";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const getStatusConfig = (status: string) => {
  switch (status) {
    case "shipping":
      return {
        icon: Truck,
        color: "text-blue-600",
        bg: "bg-blue-100",
        border: "border-blue-200",
        text: "Shipping",
      };
    case "confirmed":
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
        border: "border-green-200",
        text: "Confirmed",
      };
    case "completed":
      return {
        icon: CheckCircle,
        color: "text-purple-600",
        bg: "bg-purple-100",
        border: "border-purple-200",
        text: "Completed",
      };
    case "pending":
    default:
      return {
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-100",
        border: "border-amber-200",
        text: "Pending",
      };
  }
};

const AdminOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useAdminOrder(id || "");
  const updateStatusMutation = useUpdateOrderStatus();
  const order = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
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
        <h3 className="text-lg font-medium text-slate-900">Order not found</h3>
        <button
          onClick={() => navigate("/admin/order")}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Back to Order List
        </button>
      </div>
    );
  }

  const handleStatusChange = (value: string) => {
    if (!order) return;
    updateStatusMutation.mutate(
      {
        id: order.id,
        status: value as "pending" | "confirmed" | "shipping" | "completed",
      },
      {
        onSuccess: () => {
          toast.success("Order status updated successfully");
        },
        onError: () => {
          toast.error("Failed to update order status");
        },
      }
    );
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/order")}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">Order Detail</h1>
          <p className="text-sm text-slate-500 mt-1">
            #{order.id.substring(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={order.status}
            onValueChange={handleStatusChange}
            disabled={updateStatusMutation.isPending}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipping">Shipping</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Badge
            className={cn(
              "gap-1.5 py-1.5 px-3",
              statusConfig.bg,
              statusConfig.color
            )}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {statusConfig.text}
          </Badge>
        </div>
      </div>

      {/* Order Info */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Order Date</p>
                <p className="font-medium">
                  {convertDateTime(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Amount</p>
                <p className="font-medium text-lg">
                  {formatPriceVND(order.amount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Info & Shipping Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  {order.user.avatar ? (
                    <img
                      src={order.user.avatar}
                      alt={order.user.email}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-full h-full p-2 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{order.user.email}</p>
                  <p className="text-sm text-slate-500 capitalize">
                    {order.user.gender}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Shipping Address</CardTitle>
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
      </div>

      {/* Order Items */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">
              Products ({order.orderItems.length})
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
                      {item.productVariant.variantValues?.length > 0 && (
                        <p className="text-sm text-slate-500 mt-1">
                          {item.productVariant.variantValues
                            .map((vv) => `${vv.variant}: ${vv.value}`)
                            .join(" / ")}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-sm text-slate-600">
                          Quantity:{" "}
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
                <span>Subtotal</span>
                <span>{formatPriceVND(order.amount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span>Free</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-lg font-bold text-slate-900">
                <span>Total</span>
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

export default AdminOrderDetail;
