import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket, Clock } from "lucide-react";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { toast } from "sonner";
import {
  useUserVouchersQuery,
  usePersonalVouchersQuery,
  useClaimVoucherMutation,
} from "@/queries/userVoucherQueries";

const VoucherCard = ({
  voucher,
  isClaimed = false,
  onClaim,
}: {
  voucher: any;
  isClaimed?: boolean;
  onClaim?: (id: string) => void;
}) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const expiry = new Date(voucher.expiryAt).getTime();
      const distance = expiry - now;

      if (distance < 0) {
        setTimeLeft("Đã hết hạn");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      if (days > 0) {
        setTimeLeft(`${days}d`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h`);
      } else {
        setTimeLeft("< 1h");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [voucher.expiryAt]);

  const stockPercentage = voucher.stock
    ? ((voucher.stock - voucher.totalUsed) / voucher.stock) * 100
    : 0;

  return (
    <Card className="border border-border hover:border-primary transition-colors duration-200 overflow-hidden">
      <div className="flex h-full">
        {/* Left - Discount */}
        <div className="w-24 bg-primary text-white flex flex-col items-center justify-center p-3 relative">
          {/* Serrated edge effect */}
          <div className="absolute -right-[5px] top-0 bottom-0 w-[10px]">
            <svg width="10" height="100%" className="absolute right-0">
              <defs>
                <pattern
                  id="serrated"
                  x="0"
                  y="0"
                  width="10"
                  height="16"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="5" cy="6" r="5" fill="white" />
                </pattern>
              </defs>
              <rect width="10" height="100%" fill="url(#serrated)" />
            </svg>
          </div>

          {voucher.type === "percent" ? (
            <>
              <div className="text-3xl font-bold">{voucher.discountValue}%</div>
              {voucher.maxDiscountValue && (
                <div className="text-[10px] text-center mt-1 opacity-80">
                  Max{" "}
                  {formatPriceVND(voucher.maxDiscountValue).replace("VNĐ", "k")}
                </div>
              )}
            </>
          ) : (
            <div className="text-lg font-bold text-center leading-tight">
              {formatPriceVND(voucher.discountValue).replace("VNĐ", "")}
            </div>
          )}
        </div>

        {/* Right - Content */}
        <div className="flex-1 p-3 flex flex-col justify-between bg-white dark:bg-card">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-sm line-clamp-1">
                {voucher.campaignName}
              </h3>
              {!isClaimed && stockPercentage < 30 && stockPercentage > 0 && (
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 border-primary text-primary shrink-0"
                >
                  Sắp hết
                </Badge>
              )}
            </div>

            <div className="space-y-1 text-xs mb-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Ticket className="w-3 h-3" />
                <span className="font-mono font-medium">{voucher.code}</span>
              </div>

              {voucher.minOrderValue > 0 && (
                <div className="text-muted-foreground">
                  Đơn tối thiểu:{" "}
                  <span className="font-medium text-primary">
                    {formatPriceVND(voucher.minOrderValue)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeLeft}
              </span>
              {!isClaimed && voucher.stock && (
                <span>
                  {voucher.stock - voucher.totalUsed}/{voucher.stock}
                </span>
              )}
            </div>

            {!isClaimed ? (
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white h-7 px-3 text-xs"
                onClick={() => onClaim?.(voucher.id)}
                disabled={stockPercentage <= 0 || voucher.isClaim}
              >
                {stockPercentage <= 0
                  ? "Hết"
                  : voucher.isClaim
                  ? "Đã lấy"
                  : "Lấy"}
              </Button>
            ) : (
              <Badge
                variant="outline"
                className={`text-xs h-6 ${
                  voucher.isUsed
                    ? "border-border text-muted-foreground"
                    : "border-primary text-primary"
                }`}
              >
                {voucher.isUsed ? "Đã dùng" : "Chưa dùng"}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const UserVouchers = () => {
  const [page, setPage] = useState(1);
  const pageSize = 100; // Lấy nhiều vouchers để hiển thị

  const { data: vouchersData, isLoading } = useUserVouchersQuery(
    page,
    pageSize
  );
  const { data: personalVouchersData, isLoading: isLoadingPersonal } =
    usePersonalVouchersQuery(page, pageSize);
  const { mutate: claimVoucher, isPending: isClaimingVoucher } =
    useClaimVoucherMutation();

  // Hiển thị tất cả vouchers khả dụng, isClaim chỉ dùng để disable nút
  const availableVouchers = vouchersData?.data || [];

  // Vouchers đã lấy của user
  const claimedVouchers = personalVouchersData?.data || [];

  const handleClaimVoucher = (id: string) => {
    const voucher = availableVouchers.find((v) => v.id === id);
    if (!voucher) return;

    if (voucher.isClaim) {
      toast.error("Bạn đã lấy voucher này rồi!");
      return;
    }

    claimVoucher(
      { voucherId: id },
      {
        onSuccess: () => {
          toast.success(`Đã lấy voucher ${voucher.code} thành công!`);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Lấy voucher thất bại. Vui lòng thử lại!"
          );
        },
      }
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto  px-4 py-8 pt-20">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-2xl font-medium uppercase mb-2 border-b-[2px] border-black dark:border-border w-fit">
          Voucher
        </h1>
        <p className="text-muted-foreground">Lấy và quản lý mã giảm giá của bạn</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-start rounded-lg bg-gray-100 dark:bg-input/20 p-1 mb-8">
          <TabsTrigger
            value="available"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Voucher khả dụng
          </TabsTrigger>
          <TabsTrigger
            value="claimed"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Voucher của tôi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-0">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-input/40 border-t-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableVouchers.map((voucher) => (
                  <VoucherCard
                    key={voucher.id}
                    voucher={voucher}
                    onClaim={handleClaimVoucher}
                  />
                ))}
              </div>
              {availableVouchers.length === 0 && (
                <div className="text-center py-20">
                  <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Chưa có voucher khả dụng</p>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="claimed" className="mt-0">
          {isLoadingPersonal ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-input/40 border-t-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {claimedVouchers.map((voucher) => (
                  <VoucherCard key={voucher.id} voucher={voucher} isClaimed />
                ))}
              </div>
              {claimedVouchers.length === 0 && (
                <div className="text-center py-20">
                  <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Bạn chưa lấy voucher nào</p>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserVouchers;
