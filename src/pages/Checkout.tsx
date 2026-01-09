import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  MapPin,
  Truck,
  ShoppingBag,
  Check,
  Loader,
  QrCode,
  Copy,
  CheckCircle2,
  Plus,
  Ticket,
  X,
} from "lucide-react";
import { formatPriceVND } from "@/utils/formatPriceVND";
import { motion } from "motion/react";
import { useCheckout } from "@/hooks/useCheckout";
import { createOrderFromCartMutation } from "@/queries/orderQueries";
import {
  getAddressesQuery,
  createAddressMutation,
} from "@/queries/addressQueries";
import { apiClient } from "@/services/apiClient";
import type { AddressResponseDto } from "@/api";
import { useNavigate } from "react-router-dom";
import { usePersonalVouchersQuery } from "@/queries/userVoucherQueries";
import { toast } from "sonner";
import QRCode from "qrcode";

const Checkout = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<"cod" | "qr">("cod");
  const [cartItemIds, setCartItemIds] = useState<string[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">(
    "pending"
  );
  const [copied, setCopied] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [qrCodeString, setQrCodeString] = useState<string>("");
  const [qrImageUrl, setQrImageUrl] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [loadingImages, setLoadingImages] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // Form state for new address
  const [newAddressData, setNewAddressData] = useState({
    name: "",
    phoneNumber: "",
    detail: "",
    isDefault: false,
  });
  const [notes, setNotes] = useState("");

  // Queries & Mutations
  const { data: addressesData, isLoading: isLoadingAddresses } =
    getAddressesQuery(100);
  const { data: vouchersData, isLoading: isLoadingVouchers } =
    usePersonalVouchersQuery(1, 100);
  const { mutate: createOrder, isPending: isCreatingOrder } =
    createOrderFromCartMutation();
  const { mutate: createAddress, isPending: isCreatingAddress } =
    createAddressMutation();

  const addresses: AddressResponseDto[] = addressesData?.data || [];

  // Load cart item IDs from localStorage
  useEffect(() => {
    const savedItemIds = localStorage.getItem("selectedCartItemIds");
    if (savedItemIds) {
      try {
        const ids = JSON.parse(savedItemIds);
        setCartItemIds(ids);
      } catch (error) {
        console.error("Error parsing cart item IDs from localStorage:", error);
        setCartItemIds([]);
      }
    }
  }, []);

  // Fetch cart items details using the hook
  const { checkoutItems, isCheckoutItemsLoading } = useCheckout(cartItemIds);

  const subtotal = useMemo(
    () =>
      checkoutItems.reduce(
        (acc: number, item) =>
          acc +
          ((item.productVariant.price * (100 - (item.product.discount || 0))) /
            100) *
            item.quantity,
        0
      ),
    [checkoutItems]
  );

  // Tính giảm giá từ voucher
  const discount = useMemo(() => {
    if (!selectedVoucher) return 0;

    // Kiểm tra điều kiện đơn hàng tối thiểu
    if (subtotal < selectedVoucher.minOrderValue) return 0;

    if (selectedVoucher.type === "percent") {
      const discountAmount = (subtotal * selectedVoucher.discountValue) / 100;
      return Math.min(discountAmount, selectedVoucher.maxDiscountValue);
    } else {
      return selectedVoucher.discountValue;
    }
  }, [selectedVoucher, subtotal]);

  const total = subtotal - discount;

  // Generate QR code image from string
  useEffect(() => {
    if (qrCodeString) {
      QRCode.toDataURL(qrCodeString, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then((url) => {
          setQrImageUrl(url);
        })
        .catch((err) => {
          console.error("Error generating QR code:", err);
          toast.error("Không thể tạo mã QR");
        });
    }
  }, [qrCodeString]);

  // Handle new address form input changes
  const handleNewAddressChange = (field: string, value: string) => {
    setNewAddressData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle select voucher
  const handleSelectVoucher = (voucher: any) => {
    // Kiểm tra điều kiện đơn hàng tối thiểu
    if (subtotal < voucher.minOrderValue) {
      toast.error(
        `Đơn hàng tối thiểu ${formatPriceVND(
          voucher.minOrderValue
        )} để sử dụng voucher này`
      );
      return;
    }
    setSelectedVoucher(voucher);
    setShowVoucherModal(false);
    toast.success(`Đã áp dụng voucher ${voucher.code}`);
  };

  // Handle remove voucher
  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    toast.info("Đã gỡ voucher");
  };

  // Handle add new address
  const handleAddNewAddress = () => {
    const { name, phoneNumber, detail } = newAddressData;

    if (!name || !phoneNumber || !detail) {
      toast.error("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }

    createAddress(newAddressData, {
      onSuccess: () => {
        setShowAddAddressModal(false);
        setNewAddressData({
          name: "",
          phoneNumber: "",
          detail: "",
          isDefault: false,
        });
        // Address list will auto-refresh and user can select it
      },
    });
  };

  // Handle place order
  const handlePlaceOrder = () => {
    if (cartItemIds.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    // Show modal for confirmation
    setShowPaymentModal(true);
  };

  // Handle confirm order (after modal confirmation for COD, or direct for QR)
  const handleConfirmOrder = () => {
    if (!selectedAddressId) {
toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    createOrder(
      {
        cartItemIds: cartItemIds,
        addressId: selectedAddressId,
        paymentType: selectedPayment,
        ...(selectedVoucher && { voucherId: selectedVoucher.id }),
      },
      {
        onSuccess: async (response) => {
          const createdOrderId = response.data.id;
          setOrderId(createdOrderId); // Lưu orderId để có thể hủy nếu cần

          if (selectedPayment === "qr") {
            // QR payment - create payment and get QR image
            try {
              const paymentResponse =
                await apiClient.api.paymentControllerCreate({
                  orderId: createdOrderId,
                });

              if (paymentResponse.data) {
                // Set QR code string to generate image
                setQrCodeString(paymentResponse.data.qrImageUrl);
                setPaymentId(paymentResponse.data.id);
                setPaymentStatus("pending");
              } else {
                toast.error("Không thể lấy mã QR");
                setShowPaymentModal(false);
              }
            } catch (error) {
              console.error("Payment API error:", error);
              toast.error("Failed to create payment");
              setShowPaymentModal(false);
            }
          } else {
            // COD - just show success
            setPaymentStatus("success");
            setTimeout(() => {
              setShowPaymentModal(false);
              navigate("/");
            }, 1500);
          }
        },
      }
    );
  };

  // Handle cancel QR order
  const handleCancelOrder = async () => {
    if (!orderId) {
      toast.error("Đơn hàng không tồn tại");
      return;
    }

    setIsCancellingOrder(true);
    try {
      await apiClient.api.orderControllerCancelQrOrder(orderId);
      toast.success("Đã hủy đơn hàng thành công");
      setShowPaymentModal(false);
      // Reset states
      setOrderId("");
      setPaymentId("");
      setQrCodeString("");
      setQrImageUrl("");
      setPaymentStatus("pending");
      // Redirect to home
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error: any) {
      console.error("Cancel order error:", error);
      toast.error(error?.response?.data?.message || "Hủy đơn hàng thất bại");
    } finally {
      setIsCancellingOrder(false);
    }
  };

  // Handle check payment status
  const handleCheckPaymentStatus = async () => {
    if (!paymentId) {
      toast.error("Payment ID not found");
      return;
    }

    setIsCheckingPayment(true);
    try {
      const statusResponse =
        await apiClient.api.paymentControllerCheckPaymentStatus(paymentId);

      if (statusResponse.data.status === "success") {
        setPaymentStatus("success");
        toast.success("Thanh toán thành công!");
        setTimeout(() => {
          setShowPaymentModal(false);
          navigate("/");
        }, 1500);
      } else if (statusResponse.data.status === "failed") {
        toast.error("Thanh toán thất bại");
      } else {
        toast.info("Thanh toán đang chờ xử lý");
      }
    } catch (error) {
      console.error("Check payment status error:", error);
      toast.error("Không thể kiểm tra trạng thái thanh toán");
    } finally {
      setIsCheckingPayment(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1440px] mx-auto bg-stone-100 min-h-screen py-8 sm:py-12 px-1 md:px-5 md:mt-8"
    >
      {/* Header */}

      <div className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase border-b-[2px] border-black w-fit mb-5 md:mb-8">
        Thanh toán
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="w-full lg:flex-[3] space-y-4 sm:space-y-6">
          {/* Shipping Address */}
          <Card className="p-4 sm:p-6 gap-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <h2 className="text-2xl md:text-2xl sm:text-2xl">
                  Địa chỉ nhận hàng
                </h2>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddressModal(true)}
                  className="text-xs sm:text-sm"
                >
                  {selectedAddressId ? "Thay đổi" : "Chọn"} địa chỉ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddAddressModal(true)}
                  className="gap-2 text-xs sm:text-sm"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  Thêm mới
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Selected Address Display */}
              {selectedAddressId ? (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-green-900 mb-1">
                        Địa chỉ đã chọn
                      </p>
                      {(() => {
                        const addr = addresses.find(
                          (a) => a.id === selectedAddressId
                        );
                        return addr ? (
                          <div className="text-xs sm:text-sm text-green-700 space-y-1">
                            <p className="font-medium">
                              {addr.name} - {addr.phoneNumber}
                            </p>
                            <p className="line-clamp-2">{addr.detail}</p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-4 bg-amber-50 border-amber-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900 text-sm">
                        Chưa chọn địa chỉ
                      </p>
                      <p className="text-sm text-amber-700">
                        Vui lòng chọn hoặc thêm địa chỉ giao hàng
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Order Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm sm:text-base">
                  Ghi chú đơn hàng (Tùy chọn)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Ghi chú về đơn hàng của bạn, ví dụ hướng dẫn giao hàng đặc biệt"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <CreditCard className="w-5 h-5" />
              <h2 className="text-xl sm:text-2xl">Phương thức thanh toán</h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div
                onClick={() => setSelectedPayment("cod")}
                className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition ${
                  selectedPayment === "cod"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm sm:text-base">
                        Thanh toán khi nhận hàng
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        Thanh toán khi bạn nhận được đơn hàng
                      </div>
                    </div>
                  </div>
                  {selectedPayment === "cod" && (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </div>

              <div
                onClick={() => setSelectedPayment("qr")}
                className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition ${
                  selectedPayment === "qr"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm sm:text-base">
                        Thanh toán qua QR Code
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        Thanh toán qua mã QR (VNPay, Momo, ZaloPay)
                      </div>
                    </div>
                  </div>
                  {selectedPayment === "qr" && (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:flex-[1]">
          <Card className="p-4 sm:p-6 sticky top-4 md:top-40">
            <h2 className="text-2xl mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 sm:space-y-4 mb-4 max-h-60 sm:max-h-80 overflow-y-auto">
              {isCheckoutItemsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader className="w-6 h-6 animate-spin" />
                </div>
              ) : checkoutItems.length > 0 ? (
                checkoutItems.map((item) => {
                  const productName = item.product?.name || "Sản phẩm không xác định";
                  const productPrice = item.productVariant?.price || 0;
                  const variantText =
                    item.productVariant?.variantValues
                      ?.map((v: any) => v.value)
                      .join(", ") || "";

                  return (
                    <div
                      key={item.id}
                      className="flex gap-2 sm:gap-3 pb-3 sm:pb-4 border-b last:border-b-0"
                    >
                      {item.product.productImages[0].url ? (
                        <img
                          src={item.product.productImages[0].url}
                          alt={productName}
                          className={`w-12 h-12 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0`}
                        />
                      ) : (
                        <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded flex-shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="font-medium uppercase text-xs sm:text-sm line-clamp-2">
                          {productName}
                        </div>
                        {variantText && (
                          <div className="text-xs text-gray-500">
                            {variantText}
                          </div>
                        )}
                        <div className="text-xs sm:text-sm flex gap-2">
                          {item.quantity} ×{" "}
                          <div
                            className={`${
                              item.product.discount
                                ? "text-red-500 line-through"
                                : ""
                            }`}
                          >
                            {formatPriceVND(productPrice)}
                          </div>
                          {item.product.discount && (
                            <div>
                              {formatPriceVND(
                                (productPrice * (100 - item.product.discount)) /
                                  100
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-4 text-sm">
                  Không có sản phẩm trong giỏ hàng
                </div>
              )}
            </div>

            <Separator className="my-3 sm:my-4" />

            <div className="space-y-2 text-xs sm:text-sm mb-3 sm:mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium">{formatPriceVND(subtotal)}</span>
              </div>
            </div>

            {/* Voucher Section */}
            <div className="my-3 sm:my-4">
              {selectedVoucher ? (
                <div className="border border-green-200 bg-green-50 rounded-lg p-2 sm:p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-xs sm:text-sm text-green-700">
                            {selectedVoucher.code}
                          </span>
                          <span className="text-xs text-green-600">
                            {selectedVoucher.type === "percent"
                              ? `-${selectedVoucher.discountValue}%`
                              : `-${formatPriceVND(
                                  selectedVoucher.discountValue
                                )}`}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-1">
                          {selectedVoucher.campaignName}
                        </p>
                        <p className="text-xs sm:text-sm text-green-700 font-semibold mt-1">
                          -{formatPriceVND(discount)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-gray-500 hover:text-red-600 flex-shrink-0"
                      onClick={handleRemoveVoucher}
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-dashed border-primary hover:bg-primary/5 text-xs sm:text-sm"
                  onClick={() => setShowVoucherModal(true)}
                  disabled={isLoadingVouchers}
                >
                  <Ticket className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Chọn voucher giảm giá
                </Button>
              )}
            </div>

            <Separator className="my-3 sm:my-4" />

            <div className="flex justify-between text-base sm:text-lg font-semibold mb-4 sm:mb-6">
              <span>Tổng cộng</span>
              <span className="text-red-600">{formatPriceVND(total)}</span>
            </div>

            <Button
              className="w-full text-sm sm:text-base"
              size="lg"
              disabled={checkoutItems.length === 0 || isCheckoutItemsLoading}
              onClick={handlePlaceOrder}
            >
              {isCheckoutItemsLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Đang tải...
                </>
              ) : (
                "Đặt hàng"
              )}
            </Button>

            <div className="mt-3 sm:mt-4 text-xs text-gray-500 text-center">
              Bằng việc đặt hàng, bạn đồng ý với{" "}
              <a href="#" className="underline">
                Điều khoản & Điều kiện
              </a>
            </div>
          </Card>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent
          className="max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-2xl">
              {selectedPayment === "cod"
                ? "Xác nhận đơn hàng"
                : "Hoàn tất thanh toán"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {selectedPayment === "cod"
                ? "Vui lòng xác nhận thông tin đơn hàng"
                : "Quét mã QR để hoàn tất thanh toán"}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment === "cod" ? (
            // COD Confirmation
            <div className="space-y-3 sm:space-y-4">
              <Card className="p-3 sm:p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-xs sm:text-sm text-blue-900 mb-1">
                      Thanh toán khi nhận hàng
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-700">
                      Bạn sẽ thanh toán {formatPriceVND(total)} khi nhận hàng
                    </p>
                  </div>
                </div>
              </Card>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng đơn hàng:</span>
                  <span className="font-semibold">{formatPriceVND(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sản phẩm:</span>
                  <span>{checkoutItems.length}</span>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isCreatingOrder}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 text-xs sm:text-sm"
                  onClick={handleConfirmOrder}
                  disabled={isCreatingOrder}
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-1 sm:mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // QR Payment
            <div className="space-y-3 sm:space-y-4">
              {paymentStatus === "success" ? (
                <Card className="p-4 sm:p-6 bg-green-50 border-green-200">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="flex justify-center">
                      <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-xl text-green-900 mb-1 sm:mb-2">
                        Thanh toán thành công!
                      </h3>
                      <p className="text-xs sm:text-sm text-green-700">
                        Đơn hàng của bạn đã được xác nhận
                      </p>
                    </div>
                  </div>
                </Card>
              ) : qrImageUrl ? (
                <>
                  <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                    <div className="text-center space-y-3 sm:space-y-4">
                      <div className="text-xs sm:text-sm text-gray-600">
                        Hoặc bạn có thể quét QR sau ở trang đơn hàng của bạn.
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                        <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        <h3 className="font-semibold text-sm sm:text-lg">
                          Quét mã QR để thanh toán
                        </h3>
                      </div>

                      {/* QR Image */}
                      <div className="bg-white p-2 sm:p-4 rounded-lg inline-block mx-auto">
                        <img
                          src={qrImageUrl}
                          alt="QR Code"
                          className="w-40 h-40 sm:w-64 sm:h-64 mx-auto"
                        />
                      </div>

                      <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                        <p>
                          Tổng thanh toán:{" "}
                          <span className="font-semibold text-primary text-sm sm:text-base">
                            {formatPriceVND(total)}
                          </span>
                        </p>
                        <p>Mở ứng dụng ngân hàng và quét mã QR</p>
                      </div>
                    </div>
                  </Card>

                  {/* Check Payment Status Button */}

                  <div className="text-xs sm:text-sm text-red-600">
                    Lưu ý: Hãy hoàn tất thanh toán để đơn hàng được chuyển sang
                    trạng thái tiếp theo. Bạn cũng sẽ không được hoàn trả
                    voucher (nếu sử dụng) khi hủy đơn.
                  </div>
                  <Button
                    className="w-full text-xs sm:text-sm"
                    onClick={handleCheckPaymentStatus}
                    disabled={isCheckingPayment || isCancellingOrder}
                  >
                    {isCheckingPayment ? (
                      <>
                        <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-1 sm:mr-2" />
                        Đang kiểm tra...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Tôi đã thanh toán thành công
                      </>
                    )}
                  </Button>

                  <Button
                    variant="destructive"
                    className="w-full text-xs sm:text-sm"
                    onClick={handleCancelOrder}
                    disabled={isCancellingOrder || isCheckingPayment}
                  >
                    {isCancellingOrder ? (
                      <>
                        <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-1 sm:mr-2" />
                        Đang hủy...
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Hủy đơn hàng
                      </>
                    )}
                  </Button>
                </>
              ) : !qrImageUrl && !orderId ? (
                // Chưa tạo order - hiển thị nút xác nhận
                <>
                  <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                        <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-xs sm:text-sm text-blue-900 mb-1">
                          Thanh toán qua QR Code
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-700">
                          Bạn sẽ thanh toán {formatPriceVND(total)} qua QR Code
                        </p>
                      </div>
                    </div>
                  </Card>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Total:</span>
                      <span className="font-semibold">
                        {formatPriceVND(total)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sản phẩm:</span>
                      <span>{checkoutItems.length}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => setShowPaymentModal(false)}
                      disabled={isCreatingOrder}
                    >
                      Hủy
                    </Button>
                    <Button
                      className="flex-1 text-xs sm:text-sm"
                      onClick={handleConfirmOrder}
                      disabled={isCreatingOrder}
                    >
                      {isCreatingOrder ? (
                        <>
                          <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-1 sm:mr-2" />
                          Đang xử lý...
                        </>
                      ) : (
                        "Xác nhận đặt hàng"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <Card className="p-4 sm:p-6 bg-blue-50 border-blue-200">
                  <div className="text-center space-y-3 sm:space-y-4 py-4 sm:py-6">
                    <div className="flex justify-center">
                      <Loader className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-xl mb-1 sm:mb-2">
                        Đang tạo mã QR
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Vui lòng đợi trong giây lát...
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Select Address Modal */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-2xl">
              Chọn địa chỉ giao hàng
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Chọn một địa chỉ từ danh sách đã lưu
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 sm:space-y-3">
            {isLoadingAddresses ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin" />
              </div>
            ) : addresses.length > 0 ? (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setSelectedAddressId(addr.id);
                    setShowAddressModal(false);
                  }}
                  className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition hover:border-primary ${
                    selectedAddressId === addr.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm">
                        {addr.name} - {addr.phoneNumber}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {addr.detail}
                      </p>
                      {addr.isDefault && (
                        <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Mặc định
                        </span>
                      )}
                    </div>
                    {selectedAddressId === addr.id && (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 ml-2" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                <p className="font-medium text-sm">Chưa có địa chỉ nào</p>
                <p className="text-xs sm:text-sm mt-1">
                  Thêm địa chỉ mới để bắt đầu
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowAddressModal(false)}
              size="sm"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Voucher Selection Modal */}
      <Dialog open={showVoucherModal} onOpenChange={setShowVoucherModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-2xl flex items-center gap-2">
              <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />
              Chọn voucher
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Chọn voucher để áp dụng cho đơn hàng của bạn
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 sm:space-y-3">
            {isLoadingVouchers ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin" />
              </div>
            ) : vouchersData?.data && vouchersData.data.length > 0 ? (
              vouchersData.data.map((voucher) => {
                const isAvailable = subtotal >= voucher.minOrderValue;
                const isExpired = new Date(voucher.expiryAt) < new Date();
                const canUse = isAvailable && !isExpired;

                return (
                  <div
                    key={voucher.id}
                    onClick={() => canUse && handleSelectVoucher(voucher)}
                    className={`border rounded-lg p-3 sm:p-4 transition ${
                      canUse
                        ? "cursor-pointer hover:border-primary hover:bg-primary/5"
                        : "opacity-50 cursor-not-allowed"
                    } ${
                      selectedVoucher?.id === voucher.id
                        ? "border-primary bg-primary/10"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div
                        className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                          voucher.type === "percent"
                            ? "bg-blue-100"
                            : "bg-green-100"
                        }`}
                      >
                        <Ticket
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            voucher.type === "percent"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                              <span className="font-bold text-xs sm:text-lg">
                                {voucher.code}
                              </span>
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                  voucher.type === "percent"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {voucher.type === "percent"
                                  ? `-${voucher.discountValue}%`
                                  : `-${formatPriceVND(voucher.discountValue)}`}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-1">
                              {voucher.campaignName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {voucher.description}
                            </p>
                          </div>
                          {selectedVoucher?.id === voucher.id && (
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t gap-1">
                          <span>
                            Đơn tối thiểu:{" "}
                            {formatPriceVND(voucher.minOrderValue)}
                          </span>
                          <span>
                            HSD:{" "}
                            {new Date(voucher.expiryAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        {!isAvailable && !isExpired && (
                          <p className="text-xs text-red-500 mt-2">
                            Đơn hàng chưa đủ điều kiện sử dụng voucher này
                          </p>
                        )}
                        {isExpired && (
                          <p className="text-xs text-red-500 mt-2">
                            Voucher đã hết hạn
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Ticket className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                <p className="font-medium text-sm">Chưa có voucher nào</p>
                <p className="text-xs sm:text-sm mt-1">
                  Bạn chưa có voucher khả dụng
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            {selectedVoucher && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedVoucher(null);
                  setShowVoucherModal(false);
                }}
                size="sm"
              >
                Bỏ chọn
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowVoucherModal(false)}
              size="sm"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add New Address Modal */}
      <Dialog open={showAddAddressModal} onOpenChange={setShowAddAddressModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-2xl flex items-center gap-2">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              Thêm địa chỉ mới
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Nhập thông tin địa chỉ giao hàng
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modalName" className="text-xs sm:text-sm">
                Họ và tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="modalName"
                placeholder="Nguyễn Văn A"
                value={newAddressData.name}
                onChange={(e) => handleNewAddressChange("name", e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modalPhone" className="text-xs sm:text-sm">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="modalPhone"
                placeholder="0123456789"
                value={newAddressData.phoneNumber}
                onChange={(e) =>
                  handleNewAddressChange("phoneNumber", e.target.value)
                }
                className="text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modalDetail" className="text-xs sm:text-sm">
                Địa chỉ chi tiết <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="modalDetail"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                rows={3}
                value={newAddressData.detail}
                onChange={(e) =>
                  handleNewAddressChange("detail", e.target.value)
                }
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1 text-xs sm:text-sm"
              onClick={() => setShowAddAddressModal(false)}
              disabled={isCreatingAddress}
            >
              Hủy
            </Button>
            <Button
              className="flex-1 text-xs sm:text-sm"
              onClick={handleAddNewAddress}
              disabled={isCreatingAddress}
            >
              {isCreatingAddress ? (
                <>
                  <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-1 sm:mr-2" />
                  Đang lưu...
                </>
              ) : (
                "Lưu địa chỉ"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Checkout;
