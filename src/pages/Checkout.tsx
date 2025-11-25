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
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

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
        (acc: number, item: any) =>
          acc + (item.productVariant?.price || 0) * item.quantity,
        0
      ),
    [checkoutItems]
  );

  const shipping = 30000;
  const total = subtotal + shipping;

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
      toast.error("Your cart is empty");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    // Show modal and create order for both payment types
    setShowPaymentModal(true);
    handleConfirmOrder();
  };

  // Handle confirm order (after modal confirmation for COD, or direct for QR)
  const handleConfirmOrder = () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    createOrder(
      {
        cartItemIds: cartItemIds,
        addressId: selectedAddressId,
        paymentType: selectedPayment,
      },
      {
        onSuccess: async (response) => {
          const createdOrderId = response.data.id;

          if (selectedPayment === "qr") {
            // QR payment - create payment and get QR image
            try {
              const paymentResponse =
                await apiClient.api.paymentControllerCreate({
                  orderId: createdOrderId,
                });

              console.log("Payment Response:", paymentResponse);

              if (paymentResponse.data) {
                // Set QR code string to generate image
                setQrCodeString(paymentResponse.data.qrImageUrl);
                setPaymentId(paymentResponse.data.id);
                setPaymentStatus("pending");
              } else {
                toast.error("Failed to get QR code");
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

      console.log("Payment Status:", statusResponse.data);

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
      className="bg-stone-100 min-h-screen py-12 px-[65px]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="w-10 h-10" />
        <h1 className="text-4xl font-normal uppercase">Checkout</h1>
      </div>

      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-[3] space-y-6">
          {/* Shipping Address */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <h2 className="text-2xl font-semibold">Shipping Address</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddressModal(true)}
                >
                  {selectedAddressId ? "Change" : "Select"} Address
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddAddressModal(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New
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
                          <div className="text-sm text-green-700 space-y-1">
                            <p className="font-medium">
                              {addr.name} - {addr.phoneNumber}
                            </p>
                            <p>{addr.detail}</p>
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
                        No address selected
                      </p>
                      <p className="text-sm text-amber-700">
                        Please select or add a delivery address
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Order Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Notes about your order, e.g. special delivery instructions"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5" />
              <h2 className="text-2xl font-semibold">Payment Method</h2>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => setSelectedPayment("cod")}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedPayment === "cod"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">
                        Pay when you receive your order
                      </div>
                    </div>
                  </div>
                  {selectedPayment === "cod" && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>

              <div
                onClick={() => setSelectedPayment("qr")}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedPayment === "qr"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <div className="font-medium">QR Code Payment</div>
                      <div className="text-sm text-gray-500">
                        Pay via QR code (VNPay, Momo, ZaloPay)
                      </div>
                    </div>
                  </div>
                  {selectedPayment === "qr" && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="flex-[1]">
          <Card className="p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-4">
              {isCheckoutItemsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader className="w-6 h-6 animate-spin" />
                </div>
              ) : checkoutItems.length > 0 ? (
                checkoutItems.map((item: any) => {
                  const productName = item.product?.name || "Unknown Product";
                  const productImage =
                    item.product?.productImages?.[0]?.url ||
                    "https://via.placeholder.com/80";
                  const productPrice = item.productVariant?.price || 0;
                  const variantText =
                    item.productVariant?.variantValues
                      ?.map((v: any) => v.value)
                      .join(", ") || "";

                  return (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/80";
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{productName}</div>
                        {variantText && (
                          <div className="text-xs text-gray-500">
                            {variantText}
                          </div>
                        )}
                        <div className="text-sm">
                          {item.quantity} × {formatPriceVND(productPrice)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No items in cart
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPriceVND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{formatPriceVND(shipping)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-lg font-semibold mb-6">
              <span>Total</span>
              <span className="text-red-600">{formatPriceVND(total)}</span>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={checkoutItems.length === 0 || isCheckoutItemsLoading}
              onClick={handlePlaceOrder}
            >
              {isCheckoutItemsLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Place Order"
              )}
            </Button>

            <div className="mt-4 text-xs text-gray-500 text-center">
              By placing your order, you agree to our{" "}
              <a href="#" className="underline">
                Terms & Conditions
              </a>
            </div>
          </Card>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedPayment === "cod" ? "Confirm Order" : "Complete Payment"}
            </DialogTitle>
            <DialogDescription>
              {selectedPayment === "cod"
                ? "Please confirm your order details"
                : "Scan QR code to complete your payment"}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment === "cod" ? (
            // COD Confirmation
            <div className="space-y-4">
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900 mb-1">
                      Cash on Delivery
                    </h3>
                    <p className="text-sm text-blue-700">
                      You will pay {formatPriceVND(total)} when you receive your
                      order
                    </p>
                  </div>
                </div>
              </Card>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Total:</span>
                  <span className="font-semibold">{formatPriceVND(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span>{checkoutItems.length}</span>
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isCreatingOrder}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConfirmOrder}
                  disabled={isCreatingOrder}
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Order"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // QR Payment - show QR code
            <div className="space-y-4">
              {paymentStatus === "success" ? (
                <Card className="p-6 bg-green-50 border-green-200">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <CheckCircle2 className="w-16 h-16 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-green-900 mb-2">
                        Thanh toán thành công!
                      </h3>
                      <p className="text-sm text-green-700">
                        Đơn hàng của bạn đã được xác nhận
                      </p>
                    </div>
                  </div>
                </Card>
              ) : qrImageUrl ? (
                <>
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <QrCode className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg">
                          Quét mã QR để thanh toán
                        </h3>
                      </div>

                      {/* QR Image */}
                      <div className="bg-white p-4 rounded-lg inline-block mx-auto">
                        <img
                          src={qrImageUrl}
                          alt="QR Code"
                          className="w-64 h-64 mx-auto"
                        />
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          Tổng thanh toán:{" "}
                          <span className="font-semibold text-primary text-base">
                            {formatPriceVND(total)}
                          </span>
                        </p>
                        <p>Mở ứng dụng ngân hàng và quét mã QR</p>
                      </div>
                    </div>
                  </Card>

                  {/* Check Payment Status Button */}
                  <Button
                    className="w-full"
                    onClick={handleCheckPaymentStatus}
                    disabled={isCheckingPayment}
                  >
                    {isCheckingPayment ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                        Đang kiểm tra...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Tôi đã thanh toán thành công
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setQrImageUrl("");
                      setPaymentId("");
                    }}
                  >
                    Hủy
                  </Button>
                </>
              ) : (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="text-center space-y-4 py-6">
                    <div className="flex justify-center">
                      <Loader className="w-16 h-16 animate-spin text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">
                        Đang tạo mã QR
                      </h3>
                      <p className="text-sm text-gray-600">
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
            <DialogTitle className="text-2xl">
              Select Delivery Address
            </DialogTitle>
            <DialogDescription>
              Choose an address from your saved addresses
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
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
                  className={`border rounded-lg p-4 cursor-pointer transition hover:border-primary ${
                    selectedAddressId === addr.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">
                        {addr.name} - {addr.phoneNumber}
                      </p>
                      <p className="text-sm text-gray-600">{addr.detail}</p>
                      {addr.isDefault && (
                        <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Mặc định
                        </span>
                      )}
                    </div>
                    {selectedAddressId === addr.id && (
                      <Check className="w-5 h-5 text-primary flex-shrink-0 ml-3" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No saved addresses</p>
                <p className="text-sm mt-1">Add a new address to get started</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowAddressModal(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add New Address Modal */}
      <Dialog open={showAddAddressModal} onOpenChange={setShowAddAddressModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Add New Address
            </DialogTitle>
            <DialogDescription>
              Enter your delivery address details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modalName">
                Họ và tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="modalName"
                placeholder="Nguyễn Văn A"
                value={newAddressData.name}
                onChange={(e) => handleNewAddressChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modalPhone">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="modalPhone"
                placeholder="0123456789"
                value={newAddressData.phoneNumber}
                onChange={(e) =>
                  handleNewAddressChange("phoneNumber", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modalDetail">
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
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowAddAddressModal(false)}
              disabled={isCreatingAddress}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleAddNewAddress}
              disabled={isCreatingAddress}
            >
              {isCreatingAddress ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Address"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Checkout;
