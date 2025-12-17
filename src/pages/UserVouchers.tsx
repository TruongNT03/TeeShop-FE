import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Ticket,
  Clock,
  Gift,
  Percent,
  DollarSign,
  Zap,
  Flame,
  Sparkles,
} from "lucide-react";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days} ngày ${hours} giờ`);
      } else if (hours > 0) {
        setTimeLeft(
          `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      } else {
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [voucher.expiryAt]);

  const stockPercentage = voucher.stock
    ? ((voucher.stock - voucher.totalUsed) / voucher.stock) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 relative p-0">
        {/* Flash sale badge */}
        {!isClaimed && stockPercentage < 30 && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse">
              <Zap className="w-3 h-3 mr-1" />
              HOT
            </Badge>
          </div>
        )}

        <div className="flex relative">
          {/* Decorative corner */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-br-full"></div>

          {/* Left side - Discount info */}
          <div
            className={`w-36 flex flex-col items-center justify-center p-4 relative overflow-hidden ${
              voucher.type === "percent"
                ? "bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600"
                : "bg-gradient-to-br from-green-500 via-green-600 to-emerald-600"
            } text-white`}
          >
            {/* Animated sparkles */}
            <div className="absolute inset-0 opacity-20">
              <Sparkles className="absolute top-2 right-2 w-4 h-4 animate-pulse" />
              <Sparkles className="absolute bottom-4 left-3 w-3 h-3 animate-pulse delay-150" />
            </div>

            {voucher.type === "percent" ? (
              <>
                <div className="relative">
                  <Percent className="w-10 h-10 mb-2 animate-bounce" />
                </div>
                <div className="text-4xl font-black drop-shadow-lg">
                  {voucher.discountValue}%
                </div>
                <div className="text-xs text-center mt-2 font-semibold bg-white/20 px-2 py-1 rounded">
                  Max {formatPriceVND(voucher.maxDiscountValue)}
                </div>
              </>
            ) : (
              <>
                <Flame className="w-10 h-10 mb-2 animate-pulse" />
                <div className="text-2xl font-black drop-shadow-lg">
                  {formatPriceVND(voucher.discountValue)}
                </div>
                <div className="text-xs mt-1 font-semibold">GIẢM NGAY</div>
              </>
            )}
          </div>

          {/* Right side - Details */}
          <div className="flex-1 p-4 bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {voucher.campaignName}
                  </h3>
                  {!isClaimed && stockPercentage < 20 && (
                    <Badge
                      variant="destructive"
                      className="text-xs animate-pulse"
                    >
                      <Flame className="w-3 h-3 mr-1" />
                      Sắp hết
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {voucher.description}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-2 rounded-lg border-2 border-dashed border-gray-300">
                <Ticket className="w-4 h-4 text-primary" />
                <span className="font-mono font-bold text-primary">
                  {voucher.code}
                </span>
              </div>
              {voucher.minOrderValue > 0 && (
                <div className="text-sm text-muted-foreground bg-blue-50 px-3 py-1 rounded">
                  Đơn tối thiểu:{" "}
                  <span className="font-semibold text-blue-600">
                    {formatPriceVND(voucher.minOrderValue)}
                  </span>
                </div>
              )}
            </div>

            {/* Countdown & Stock */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-orange-100 to-red-100 px-3 py-2 rounded-lg border border-orange-300">
                <Clock className="w-4 h-4 text-orange-600 animate-pulse" />
                <span className="font-bold text-orange-700">{timeLeft}</span>
              </div>
              {!isClaimed && voucher.stock && (
                <div className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Còn:{" "}
                  <span className="text-primary">
                    {voucher.stock - voucher.totalUsed}
                  </span>
                  /{voucher.stock}
                </div>
              )}
            </div>

            {/* Progress bar for stock */}
            {!isClaimed && voucher.stock && (
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border-2 border-gray-300">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - stockPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400 h-full rounded-full relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Action button */}
            {!isClaimed ? (
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onClaim?.(voucher.id)}
                disabled={stockPercentage <= 0 || voucher.isClaim}
              >
                <Gift className="w-5 h-5 mr-2" />
                {stockPercentage <= 0
                  ? "Đã hết"
                  : voucher.isClaim
                  ? "ĐÃ LẤY"
                  : "LẤY VOUCHER NGAY"}
              </Button>
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {voucher.isUsed ? (
                    <Badge variant="outline" className="border-gray-400">
                      Đã sử dụng
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-600"
                    >
                      Chưa sử dụng
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="sm" disabled={voucher.isUsed}>
                  Sử dụng ngay
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
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
    <div className="max-w-[1280px] mx-auto px-4 py-8 pt-16">
      {/* Header with gradient background */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 animate-pulse" />
            <h1 className="text-4xl font-black">Kho Voucher</h1>
            <Zap className="w-8 h-8 animate-bounce" />
          </div>
          <p className="text-lg font-semibold text-white/90">
            Lấy ngay các voucher giảm giá cực shock - Số lượng có hạn!
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-semibold">
                  Voucher khả dụng
                </p>
                <p className="text-3xl font-black text-blue-900">
                  {availableVouchers.length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-semibold">
                  Voucher của tôi
                </p>
                <p className="text-3xl font-black text-green-900">
                  {claimedVouchers.length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700 font-semibold">
                  Sắp hết hạn
                </p>
                <p className="text-3xl font-black text-purple-900">
                  {
                    claimedVouchers.filter(
                      (v) =>
                        new Date(v.expiryAt).getTime() - Date.now() <
                        3 * 24 * 60 * 60 * 1000
                    ).length
                  }
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="available" className="cursor-pointer">
            Voucher Khả Dụng
          </TabsTrigger>
          <TabsTrigger value="claimed" className="cursor-pointer">
            Voucher Của Tôi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="text-muted-foreground mt-4">Đang tải voucher...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableVouchers.map((voucher) => (
                  <VoucherCard
                    key={voucher.id}
                    voucher={voucher}
                    onClaim={handleClaimVoucher}
                  />
                ))}
              </div>
              {availableVouchers.length === 0 && (
                <div className="text-center py-12">
                  <Gift className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Hiện chưa có voucher khả dụng
                  </p>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="claimed" className="mt-6">
          {isLoadingPersonal ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="text-muted-foreground mt-4">Đang tải voucher...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {claimedVouchers.map((voucher) => (
                  <VoucherCard key={voucher.id} voucher={voucher} isClaimed />
                ))}
              </div>
              {claimedVouchers.length === 0 && (
                <div className="text-center py-12">
                  <Ticket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Bạn chưa lấy voucher nào
                  </p>
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
