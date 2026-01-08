import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, Tag, ChevronDown, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { AdminCreateVoucherDto } from "@/api";
import { useCreateVoucherMutation } from "@/queries/adminVoucherQueries";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

const AdminCreateVoucher = () => {
  const navigate = useNavigate();
  const { mutate: createVoucher, isPending } = useCreateVoucherMutation();
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdminCreateVoucherDto>({
    defaultValues: {
      type: "percent",
      discountValue: 0,
      stock: 1,
      campaignName: "",
      description: "",
      isPublic: true,
    },
  });

  const voucherType = watch("type");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsTypeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Reset maxDiscountValue when switching to fixed type
    if (voucherType === "fixed") {
      setValue("maxDiscountValue", undefined);
    }
  }, [voucherType, setValue]);

  const onSubmit = (data: AdminCreateVoucherDto) => {
    if (!expiryDate) {
      return;
    }

    // Convert expiryAt to ISO string with time
    const expiry = new Date(expiryDate);
    expiry.setHours(23, 59, 59, 999);

    const payload = {
      ...data,
      expiryAt: expiry.toISOString(),
      // Remove optional fields if not provided
      maxDiscountValue: data.maxDiscountValue || undefined,
      minOrderValue: data.minOrderValue || undefined,
    };

    createVoucher(payload, {
      onSuccess: () => {
        navigate("/admin/voucher");
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/voucher")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo Voucher Mới</h1>
          <p className="text-muted-foreground mt-1">
            Tạo mã giảm giá mới cho khách hàng
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Thông tin cơ bản
              </h2>
              <div className="space-y-4">
                {/* Voucher Code */}
                <div className="space-y-2">
                  <Label htmlFor="code">
                    Mã Voucher <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    placeholder="VD: SUMMER2024"
                    className="font-mono uppercase"
                    {...register("code", {
                      required: "Mã voucher là bắt buộc",
                      pattern: {
                        value: /^[A-Z0-9]+$/,
                        message:
                          "Chỉ cho phép chữ hoa và số, không có khoảng trắng",
                      },
                    })}
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                    }}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-500">
                      {errors.code.message}
                    </p>
                  )}
                </div>

                {/* Campaign Name */}
                <div className="space-y-2">
                  <Label htmlFor="campaignName">
                    Tên chiến dịch <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="campaignName"
                    placeholder="VD: Flash Sale Cuối Tuần"
                    {...register("campaignName", {
                      required: "Tên chiến dịch là bắt buộc",
                    })}
                  />
                  {errors.campaignName && (
                    <p className="text-sm text-red-500">
                      {errors.campaignName.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Mô tả <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="description"
                    placeholder="VD: Giảm 50% cho đơn hàng từ 200K"
                    {...register("description", {
                      required: "Mô tả là bắt buộc",
                    })}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* isPublic Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div className="space-y-0.5">
                      <Label htmlFor="isPublic" className="text-base">
                        Công khai cho người dùng
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Cho phép người dùng xem và lấy voucher này
                      </p>
                    </div>
                    <Switch
                      id="isPublic"
                      checked={watch("isPublic")}
                      onCheckedChange={(checked) =>
                        setValue("isPublic", checked)
                      }
                    />
                  </div>
                </div>

                {/* Type, Quantity, Expiry Date in one row */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type">
                      Loại giảm giá <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative inline-block" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() =>
                          setIsTypeDropdownOpen(!isTypeDropdownOpen)
                        }
                        className="bg-white dark:bg-card px-4 py-2 cursor-pointer font-medium border rounded-lg inline-flex items-center gap-2 hover:border-slate-400 dark:hover:border-input/40 hover:shadow-sm transition-all duration-200"
                      >
                        <span className="text-sm">
                          {voucherType === "percent"
                            ? "Phần trăm (%)"
                            : "Cố định (VNĐ)"}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isTypeDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isTypeDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-0 mt-2 min-w-[180px] bg-white dark:bg-popover border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setValue("type", "percent");
                                setIsTypeDropdownOpen(false);
                              }}
                              className={`w-full cursor-pointer font-medium text-left px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-all duration-150 ${
                                voucherType === "percent"
                                  ? "bg-primary/5 text-primary font-medium"
                                  : ""
                              }`}
                            >
                              Phần trăm (%)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setValue("type", "fixed");
                                setIsTypeDropdownOpen(false);
                              }}
                              className={`w-full cursor-pointer font-medium text-left px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-all duration-150 ${
                                voucherType === "fixed"
                                  ? "bg-primary/5 text-primary font-medium"
                                  : ""
                              }`}
                            >
                              Cố định (VNĐ)
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="stock">
                      Số lượng <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="100"
                      className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      {...register("stock", {
                        required: "Số lượng là bắt buộc",
                        min: {
                          value: 1,
                          message: "Số lượng phải >= 1",
                        },
                      })}
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-500">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <Label htmlFor="expiryAt">
                      Ngày hết hạn <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !expiryDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {expiryDate ? (
                            format(expiryDate, "dd/MM/yyyy", { locale: vi })
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={expiryDate}
                          onSelect={setExpiryDate}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {!expiryDate && (
                      <p className="text-sm text-red-500">Bắt buộc</p>
                    )}
                  </div>
                </div>

                {/* Discount Value */}
                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    Giá trị giảm <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="discountValue"
                      type="number"
                      placeholder={voucherType === "percent" ? "20" : "50000"}
                      className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      {...register("discountValue", {
                        required: "Giá trị giảm là bắt buộc",
                        min: {
                          value: 1,
                          message: "Giá trị phải lớn hơn 0",
                        },
                        max:
                          voucherType === "percent"
                            ? {
                                value: 100,
                                message:
                                  "Giá trị phần trăm không được vượt quá 100",
                              }
                            : undefined,
                      })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {voucherType === "percent" ? "%" : "VNĐ"}
                    </span>
                  </div>
                  {errors.discountValue && (
                    <p className="text-sm text-red-500">
                      {errors.discountValue.message}
                    </p>
                  )}
                </div>

                {/* Max Discount Value - Only for percent type */}
                {voucherType === "percent" && (
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscountValue">Giảm tối đa (VNĐ)</Label>
                    <Input
                      id="maxDiscountValue"
                      type="number"
                      placeholder="100000"
                      className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      {...register("maxDiscountValue", {
                        min: {
                          value: 0,
                          message: "Giá trị phải >= 0",
                        },
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Để trống nếu không giới hạn
                    </p>
                  </div>
                )}

                {/* Min Order Value */}
                <div className="space-y-2">
                  <Label htmlFor="minOrderValue">
                    Đơn hàng tối thiểu (VNĐ)
                  </Label>
                  <Input
                    id="minOrderValue"
                    type="number"
                    placeholder="200000"
                    className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    {...register("minOrderValue", {
                      min: {
                        value: 0,
                        message: "Giá trị phải >= 0",
                      },
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Để trống nếu không yêu cầu đơn hàng tối thiểu
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Preview Card */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-2 border-dashed border-primary/20">
                  <div className="font-mono text-2xl font-bold text-center text-primary">
                    {watch("code") || "VOUCHER_CODE"}
                  </div>
                  {watch("campaignName") && (
                    <div className="text-center mt-2 text-sm font-semibold text-foreground">
                      {watch("campaignName")}
                    </div>
                  )}
                  {watch("description") && (
                    <div className="text-center mt-1 text-xs text-muted-foreground">
                      {watch("description")}
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loại:</span>
                    <span className="font-medium">
                      {voucherType === "percent" ? "Phần trăm" : "Cố định"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giá trị:</span>
                    <span className="font-medium">
                      {watch("discountValue") || 0}
                      {voucherType === "percent" ? "%" : " VNĐ"}
                    </span>
                  </div>
                  {voucherType === "percent" && watch("maxDiscountValue") && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Giảm tối đa:
                      </span>
                      <span className="font-medium">
                        {watch("maxDiscountValue")} VNĐ
                      </span>
                    </div>
                  )}
                  {watch("minOrderValue") && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        ĐH tối thiểu:
                      </span>
                      <span className="font-medium">
                        {watch("minOrderValue")} VNĐ
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số lượng:</span>
                    <span className="font-medium">{watch("stock") || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hết hạn:</span>
                    <span className="font-medium">
                      {expiryDate
                        ? format(expiryDate, "dd/MM/yyyy", { locale: vi })
                        : "Chưa chọn"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || !expiryDate}
              >
                {isPending ? "Đang tạo..." : "Tạo Voucher"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/admin/voucher")}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateVoucher;
