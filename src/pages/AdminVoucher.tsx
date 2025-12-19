import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Tag, Search, ListFilter, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { convertDateTime } from "@/utils/convertDateTime";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { useAdminVouchersQuery } from "@/queries/adminVoucherQueries";
import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminVoucherResponseDto } from "@/api";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";

const AdminVoucher = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [typeFilter, setTypeFilter] = useState<"fixed" | "percent" | undefined>(
    undefined
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: vouchersData, isLoading } = useAdminVouchersQuery({
    page,
    pageSize,
    search: debouncedSearch || undefined,
    typeFilter,
  });

  const vouchers: AdminVoucherResponseDto[] = vouchersData?.data || [];

  const getTypeColor = (type: "fixed" | "percent") => {
    return type === "percent"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  const getStatusColor = (expiryAt: string) => {
    if (new Date(expiryAt) < new Date()) return "bg-red-100 text-red-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusText = (expiryAt: string) => {
    if (new Date(expiryAt) < new Date()) return "Hết hạn";
    return "Đang hoạt động";
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium uppercase">Quản lý Voucher</h1>
      </div>
      {/* Stats */}
      <div className="flex justify-between gap-8">
        <Card className="flex-1 p-4 shadow-none">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Tag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng voucher</p>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold">{vouchers.length}</p>
              )}
            </div>
          </div>
        </Card>
        <Card className="flex-1 p-4 shadow-none">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Tag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold">
                  {
                    vouchers.filter((v) => new Date(v.expiryAt) >= new Date())
                      .length
                  }
                </p>
              )}
            </div>
          </div>
        </Card>
        <Card className="flex-1 p-4 shadow-none">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng đã dùng</p>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold">
                  {vouchers.reduce((sum, v) => sum + v.totalUsed, 0)}
                </p>
              )}
            </div>
          </div>
        </Card>
        <Card className="flex-1 p-4 shadow-none">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Tag className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hết hạn</p>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold">
                  {
                    vouchers.filter((v) => new Date(v.expiryAt) < new Date())
                      .length
                  }
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative w-[400px]">
            <Input
              className="pl-10"
              type="search"
              placeholder="Tìm theo mã voucher, tên chiến dịch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-muted-foreground" />
          </div>

          {/* Type Filter Dropdown */}
          <div className="relative inline-block" ref={dropdownRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="min-w-[150px] justify-between"
            >
              <div className="flex items-center gap-2">
                <ListFilter className="w-4 h-4" />
                <span>
                  {typeFilter === "percent"
                    ? "Phần trăm"
                    : typeFilter === "fixed"
                    ? "Cố định"
                    : "Tất cả loại"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-2 min-w-[180px] bg-white border rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setTypeFilter(undefined);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full cursor-pointer font-medium text-left px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-all duration-150 ${
                      typeFilter === undefined
                        ? "bg-primary/5 text-primary font-medium"
                        : ""
                    }`}
                  >
                    Tất cả loại
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTypeFilter("percent");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full cursor-pointer font-medium text-left px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-all duration-150 ${
                      typeFilter === "percent"
                        ? "bg-primary/5 text-primary font-medium"
                        : ""
                    }`}
                  >
                    Phần trăm
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTypeFilter("fixed");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full cursor-pointer font-medium text-left px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-all duration-150 ${
                      typeFilter === "fixed"
                        ? "bg-primary/5 text-primary font-medium"
                        : ""
                    }`}
                  >
                    Cố định
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Create Button */}
        <Button onClick={() => navigate("/admin/voucher/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo Voucher
        </Button>
      </div>

      {/* Table */}
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="pl-8 py-5">Chiến dịch</TableHead>
              <TableHead>Mã Voucher</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead>ĐH tối thiểu</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Đã dùng</TableHead>
              <TableHead>Hạn sử dụng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hiển thị</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : vouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="text-muted-foreground">
                    Chưa có voucher nào
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              vouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell className="pl-8 py-3">
                    <div className="font-semibold">{voucher.campaignName}</div>
                    {voucher.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {voucher.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-mono font-semibold">
                      {voucher.code}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(voucher.type)}>
                      {voucher.type === "percent" ? "Phần trăm" : "Cố định"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">
                      {voucher.type === "percent"
                        ? `${voucher.discountValue}%`
                        : formatPriceVND(voucher.discountValue)}
                    </div>
                    {voucher.maxDiscountValue && (
                      <div className="text-xs text-muted-foreground">
                        Tối đa: {formatPriceVND(voucher.maxDiscountValue)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {voucher.minOrderValue
                      ? formatPriceVND(voucher.minOrderValue)
                      : "Không"}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{voucher.stock}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{voucher.totalUsed}</span>
                      <span className="text-xs text-muted-foreground">
                        (
                        {voucher.stock > 0
                          ? ((voucher.totalUsed / voucher.stock) * 100).toFixed(
                              0
                            )
                          : 0}
                        %)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {convertDateTime(voucher.expiryAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(voucher.expiryAt)}>
                      {getStatusText(voucher.expiryAt)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={voucher.isPublic ? "default" : "secondary"}>
                      {voucher.isPublic ? "Công khai" : "Riêng tư"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
            {vouchers.length > 0 &&
              vouchers.length < pageSize &&
              Array.from({ length: pageSize - vouchers.length }).map(
                (_, index) => (
                  <TableRow key={`empty-${index}`} className="border-none">
                    <TableCell colSpan={10}>&nbsp;</TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminVoucher;
