import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaginationControl } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  Search,
  Package,
  Clock,
  Truck,
  Check,
  Ellipsis,
  CheckCircle,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { convertDateTime } from "@/utils/convertDateTime";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrders } from "@/queries/adminOrderQueries";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import {
  useAdminListOrder,
  type AdminListOrderQuery,
} from "@/queries/admin/useAdminListOrder";

export enum AdminOrderSortField {
  STATUS = "status",
  AMOUNT = "amount",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

export enum SortOrder {
  DESC = "DESC",
  ASC = "ASC",
}

const AdminOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFromUrl = searchParams.get("orderStatusFilter");

  const [query, setQuery] = useState<AdminListOrderQuery>({
    page: 1,
    pageSize: 10,
    search: "",
    orderStatusFilter: statusFromUrl || undefined,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const adminListOrderQuery = useAdminListOrder(query);

  const orders = adminListOrderQuery.data?.data || [];
  const pagination = adminListOrderQuery.data?.paginate || {
    page: 1,
    pageSize: 10,
    totalItem: 0,
    totalPage: 1,
  };

  useEffect(() => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      search: debouncedSearchTerm,
      page: 1,
    }));
  }, [debouncedSearchTerm]);

  const handleStatusFilter = (status: string) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      orderStatusFilter: status === "all" ? undefined : status,
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500"
          >
            <Ellipsis className="w-3 h-3 mr-1" />
            Chờ xử lý
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã xác nhận
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <Check className="w-3 h-3 mr-1" />
            Hoàn thành
          </Badge>
        );
      case "shipping":
        return (
          <Badge variant="outline" className="border-cyan-400 text-cyan-400">
            <Truck className="w-3 h-3 mr-1" />
            Đang giao
          </Badge>
        );
      case "cancel":
        return (
          <Badge variant="outline" className="border-red-400 text-red-400">
            <X className="w-3 h-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            {status.substring(0, 1).toUpperCase() + status.substring(1)}
          </Badge>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const tableHeaderTitles = [
    {
      key: "userEmail",
      title: "Email người dùng",
      sortable: false,
      render: (value: string): React.ReactNode => (
        <TableCell>{value}</TableCell>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      sortable: true,
      render: (value: string): React.ReactNode => (
        <TableCell>{getStatusBadge(value)}</TableCell>
      ),
    },
    {
      key: "amount",
      title: "Tổng tiền",
      sortable: true,
      render: (value: number): React.ReactNode => (
        <TableCell className="font-semibold">{formatCurrency(value)}</TableCell>
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      sortable: true,
      render: (value: string): React.ReactNode => (
        <TableCell>{convertDateTime(value)}</TableCell>
      ),
    },
    {
      key: "updatedAt",
      title: "Ngày cập nhật",
      sortable: true,
      render: (value: string): React.ReactNode => (
        <TableCell>{convertDateTime(value)}</TableCell>
      ),
    },
  ];

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPage) return;
    setQuery((prevQuery) => ({
      ...prevQuery,
      page: newPage,
    }));
  };

  // Calculate statistics
  const totalOrders = pagination.totalItem;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const shippingOrders = orders.filter((o) => o.status === "shipping").length;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-medium uppercase">Quản lý Đơn hàng</h1>
      </div>

      {/* Statistics Cards */}
      <div className="flex justify-between gap-8">
        <Card className="flex-1 p-6 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
              <p className="text-3xl font-bold mt-2">{totalOrders}</p>
            </div>
            <Package className="w-12 h-12 text-primary opacity-20" />
          </div>
        </Card>
        <Card className="flex-1 p-6 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chờ xử lý</p>
              <p className="text-3xl font-bold mt-2 text-yellow-500">
                {pendingOrders}
              </p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </Card>
        <Card className="flex-1 p-6 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang giao</p>
              <p className="text-3xl font-bold mt-2 text-blue-500">
                {shippingOrders}
              </p>
            </div>
            <Truck className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex justify-between">
        <div className="flex gap-5">
          <div className="relative">
            <Input
              className="w-[400px] py-0 pl-10"
              type="search"
              placeholder="Tìm theo email hoặc Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="scale-75 absolute top-[18%] left-2 text-slate-400" />
          </div>

          <Select
            value={query.orderStatusFilter || "all"}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="shipping">Đang giao</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="cancel">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="py-0 overflow-hidden shadow-none">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="px-8 py-5">
                <Checkbox
                  className=""
                  checked={isSelectedAll}
                  onCheckedChange={(checked) => {
                    if (checked && orders) {
                      setSelectedOrders(orders.map((o) => o.id));
                    } else {
                      setSelectedOrders([]);
                    }
                    setIsSelectedAll(!!checked);
                  }}
                />
              </TableHead>
              <TableHead>
                <div>STT</div>
              </TableHead>
              {tableHeaderTitles.map((value, index) => (
                <TableHead key={index} className="py-3">
                  <div
                    className={cn(
                      "flex items-center",
                      value.sortable ? "cursor-pointer" : ""
                    )}
                    onClick={() => {}}
                  >
                    {value.title}{" "}
                    {value.sortable && (
                      <span className="ml-1">
                        <ArrowUpDown className="scale-[60%]" />
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminListOrderQuery.isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-4 ml-2" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tableHeaderTitles.length + 2}
                  className="h-48 text-center text-lg"
                >
                  Không tìm thấy đơn hàng nào.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => (
                <TableRow
                  key={order.id}
                  className={`${index % 2 ? "bg-muted" : ""} cursor-pointer`}
                  onClick={() => navigate(`/admin/order/${order.id}`)}
                >
                  <TableCell className="px-8">
                    <Checkbox
                      className=""
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          const updated = [...selectedOrders, order.id];
                          setSelectedOrders(updated);
                          if (updated.length === orders.length) {
                            setIsSelectedAll(true);
                          }
                        } else {
                          const updated = selectedOrders.filter(
                            (value) => value !== order.id
                          );
                          setSelectedOrders(updated);
                          setIsSelectedAll(false);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {index + 1 + (query.page || 1 - 1) * query.pageSize}
                  </TableCell>

                  {tableHeaderTitles.map((tableHeaderTitle, idx) => (
                    <React.Fragment key={idx}>
                      {tableHeaderTitle.render(
                        order[
                          tableHeaderTitle.key as keyof typeof order
                        ] as never
                      )}
                    </React.Fragment>
                  ))}
                </TableRow>
              ))
            )}
            {orders.length > 0 &&
              orders.length < query.pageSize &&
              Array.from({ length: query.pageSize - orders.length }).map(
                (_, index) => (
                  <TableRow key={`empty-${index}`} className="border-none">
                    <TableCell colSpan={tableHeaderTitles.length + 2}>
                      &nbsp;
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>

        <div className="w-full py-3 flex justify-between items-center px-5">
          <div className="text-sm text-muted-foreground">
            Tổng: <b>{pagination.totalItem}</b> đơn hàng
          </div>

          <PaginationControl
            currentPage={pagination.page}
            totalPage={pagination.totalPage}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </div>
  );
};

export default AdminOrder;
