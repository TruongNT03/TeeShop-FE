import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardStatisticQuery,
  getLastThirtyDayChartDataQuery,
  getPendingOrdersQuery,
} from "@/queries/adminDashboardQueries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatPriceVND } from "@/utils/formatPriceVND";
import {
  ShoppingCart,
  Users,
  TrendingUp,
  ChevronDown,
  Clock,
  Eye,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import type { UserRequestPayload } from "@/types/userRequestPayload";
import { RoleType } from "@/types/userRequestPayload";
import { jwtDecode } from "jwt-decode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminListLocation } from "@/queries/admin/useAdminListLocation";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [statisticBy, setStatisticBy] = useState<"day" | "month" | "year">(
    "day"
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statisticOptions = {
    day: "Hôm nay",
    month: "Tháng này",
    year: "Năm nay",
  };

  const adminListLocationQuery = useAdminListLocation({
    page: 1,
    pageSize: 100,
  });

  const [userInfo, setUserInfo] = useState<UserRequestPayload>();
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");

  // Check if user is Admin
  const isAdmin = userInfo?.roles?.includes(RoleType.ADMIN);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const user = jwtDecode<UserRequestPayload>(accessToken);
      if (user) {
        setUserInfo(user);
        // Set default location for non-admin users
        if (!user.roles?.includes(RoleType.ADMIN) && user.location?.id) {
          setSelectedLocationId(user.location.id);
        }
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: statistic, isLoading: isStatisticLoading } = useQuery(
    getDashboardStatisticQuery(statisticBy)
  );

  const { data: chartData, isLoading: isChartLoading } = useQuery(
    getLastThirtyDayChartDataQuery()
  );

  const { data: pendingOrders, isLoading: isPendingOrdersLoading } = useQuery(
    getPendingOrdersQuery()
  );

  const orders = pendingOrders?.data || [];

  const formatChartData = () => {
    if (!chartData?.data) return [];
    return chartData.data.map((item: { date: string; revenue: number }) => ({
      date: new Date(item.date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      }),
      revenue: item.revenue,
    }));
  };

  const chartConfig = {
    revenue: {
      label: "Doanh thu",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const StatItem = ({
    title,
    value,
    icon: Icon,
    gradient,
    iconColor,
    isLoading,
  }: {
    title: string;
    value: string | number;
    icon: any;
    gradient: string;
    iconColor: string;
    isLoading?: boolean;
  }) => (
    <div className="relative p-4 rounded-xl border bg-card/50 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${gradient} shadow-sm`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
          {title}
        </p>
        {isLoading ? (
          <Skeleton className="h-9 w-24" />
        ) : (
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-3">
      <div>
        <h1 className="text-2xl font-medium uppercase">Bảng điều khiển</h1>
      </div>

      {/* Statistics */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer flex items-center justify-between w-[180px] px-3 py-2 text-sm border rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span>{statisticOptions[statisticBy]}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute z-50 w-full mt-1 border rounded-md bg-popover shadow-md cursor-pointer"
                >
                  {(
                    Object.keys(statisticOptions) as Array<
                      keyof typeof statisticOptions
                    >
                  ).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setStatisticBy(key);
                        setIsDropdownOpen(false);
                      }}
                      className={`cursor-pointer w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-md last:rounded-b-md ${
                        statisticBy === key ? "bg-accent" : ""
                      }`}
                    >
                      {statisticOptions[key]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Location Dropdown - Only for Admin */}
          {/* {isAdmin && (
            <Select
              value={selectedLocationId}
              onValueChange={setSelectedLocationId}
              disabled={adminListLocationQuery.isLoading}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue
                  placeholder={
                    adminListLocationQuery.isLoading
                      ? "Đang tải..."
                      : "Chọn địa điểm"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {adminListLocationQuery.isSuccess &&
                  adminListLocationQuery.data.data.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.address}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )} */}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Location Info Card - Show selected location for Admin or user's location */}
        <Card className="md:col-span-1 gap-1">
          <CardHeader className="my-0 py-0 flex">
            <span className="font-semibold">Địa chỉ:</span>
            {isAdmin
              ? adminListLocationQuery.data?.data.find(
                  (loc) => loc.id === selectedLocationId
                )?.address || "Chưa chọn địa điểm"
              : userInfo?.location?.address || "N/A"}
          </CardHeader>
          <CardContent className="my-0 py-0 text-sm">
            <div className="flex gap-2">
              <span className="font-semibold">Hotline:</span>
              {isAdmin
                ? adminListLocationQuery.data?.data.find(
                    (loc) => loc.id === selectedLocationId
                  )?.hotline || "N/A"
                : userInfo?.location?.hotline || "N/A"}
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Giờ mở cửa:</span>
              {isAdmin
                ? `${
                    adminListLocationQuery.data?.data.find(
                      (loc) => loc.id === selectedLocationId
                    )?.openTime || ""
                  } ${
                    adminListLocationQuery.data?.data.find(
                      (loc) => loc.id === selectedLocationId
                    )?.closeTime || ""
                  }`
                : `${userInfo?.location?.openTime || ""} ${
                    userInfo?.location?.closeTime || ""
                  }`}
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Ngày mở cửa:</span>
              {isAdmin
                ? adminListLocationQuery.data?.data.find(
                    (loc) => loc.id === selectedLocationId
                  )?.openDate || "N/A"
                : userInfo?.location?.openDate || "N/A"}
            </div>
          </CardContent>
        </Card>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatItem
            title="Đơn hàng mới"
            value={statistic?.data?.newOrderCount ?? 0}
            icon={ShoppingCart}
            gradient="bg-gradient-to-br from-blue-500/10 to-blue-600/5"
            iconColor="text-blue-600"
            isLoading={isStatisticLoading}
          />
          <StatItem
            title="Người dùng mới"
            value={statistic?.data?.newUserCount ?? 0}
            icon={Users}
            gradient="bg-gradient-to-br from-green-500/10 to-green-600/5"
            iconColor="text-green-600"
            isLoading={isStatisticLoading}
          />
          <StatItem
            title="Doanh thu"
            value={formatPriceVND(statistic?.data?.revenue ?? 0)}
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-orange-500/10 to-orange-600/5"
            iconColor="text-orange-600"
            isLoading={isStatisticLoading}
          />
        </div>
      </div>

      {/* Chart and Pending Orders - Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Orders */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Đơn hàng chờ duyệt
            </CardTitle>
            <CardDescription>Danh sách đơn hàng cần xử lý</CardDescription>
          </CardHeader>
          <CardContent>
            {isPendingOrdersLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">Không có đơn hàng chờ duyệt</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/order/${order.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          #{order.id.substring(0, 8).toUpperCase()}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm truncate">
                        {order.userName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {order.userEmail}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {order.totalItem} sản phẩm
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {formatPriceVND(order.amount)}
                        </span>
                      </div>
                    </div>
                    <button
                      className="ml-2 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/order/${order.id}`);
                      }}
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate("/admin/order?status=pending")}
              className="w-full mt-4 py-2 text-sm text-primary hover:underline cursor-pointer"
            >
              Xem tất cả
            </button>
          </CardContent>
        </Card>

        {/* Revenue Chart - 2 columns */}
        <Card className="shadow-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Doanh thu 30 ngày gần nhất
            </CardTitle>
            <CardDescription>
              Biểu đồ thống kê doanh thu trong 30 ngày gần đây
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isChartLoading ? (
              <Skeleton className="h-[450px] w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-[450px] w-full">
                <AreaChart
                  data={formatChartData()}
                  margin={{
                    top: 50,
                    left: 12,
                    right: 12,
                    bottom: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      if (value >= 1000000) {
                        return `${(value / 1000000).toFixed(1)}M`;
                      }
                      if (value >= 1000) {
                        return `${(value / 1000).toFixed(0)}K`;
                      }
                      return value.toString();
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => `Ngày ${value}`}
                        formatter={(value) => formatPriceVND(Number(value))}
                      />
                    }
                  />
                  <defs>
                    <linearGradient
                      id="fillRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="revenue"
                    type="monotone"
                    fill="url(#fillRevenue)"
                    fillOpacity={0.4}
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-revenue)", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
