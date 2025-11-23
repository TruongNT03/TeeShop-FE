import React, { useState } from "react";
import { motion } from "motion/react";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import type {
  AddressResponseDto,
  CreateAddressDto,
  UpdateAddressDto,
} from "@/api";

export const ProfileAddresses: React.FC = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] =
    useState<AddressResponseDto | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    detail: "",
    isDefault: false,
  });

  // Fetch addresses
  const { data: addressesData, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await apiClient.api.addressControllerFindAll({
        pageSize: 100,
      });
      return res.data;
    },
  });

  const addresses = addressesData?.data ?? [];

  // Create address mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAddressDto) =>
      apiClient.api.addressControllerCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Thêm địa chỉ mới thành công!");
      setDialogOpen(false);
    },
    onError: () => {
      toast.error("Thêm địa chỉ thất bại!");
    },
  });

  // Update address mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAddressDto }) =>
      apiClient.api.addressControllerUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Cập nhật địa chỉ thành công!");
      setDialogOpen(false);
    },
    onError: () => {
      toast.error("Cập nhật địa chỉ thất bại!");
    },
  });

  // Set default address mutation
  const setDefaultMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.api.addressControllerUpdateToDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Đã đặt làm địa chỉ mặc định!");
    },
    onError: () => {
      toast.error("Đặt địa chỉ mặc định thất bại!");
    },
  });

  const handleOpenDialog = (address?: AddressResponseDto) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        name: address.name || "",
        phoneNumber: address.phoneNumber || "",
        detail: address.detail || "",
        isDefault: address.isDefault || false,
      });
    } else {
      setEditingAddress(null);
      setFormData({ name: "", phoneNumber: "", detail: "", isDefault: false });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (
      !formData.name.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.detail.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (editingAddress) {
      // Update existing address
      updateMutation.mutate({
        id: editingAddress.id,
        data: {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          detail: formData.detail,
          isDefault: formData.isDefault,
        },
      });
    } else {
      // Create new address
      createMutation.mutate({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        detail: formData.detail,
        isDefault: formData.isDefault || addresses.length === 0,
      });
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Địa chỉ nhận hàng
            </h1>
            <p className="text-sm text-slate-500">
              Quản lý địa chỉ giao hàng của bạn
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm địa chỉ mới
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address, index) => {
            const isDefault = address.isDefault;

            return (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                }}
                className={cn(
                  "rounded-lg border-2 p-5",
                  isDefault
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300"
                )}
              >
                {isDefault && (
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/20">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-primary uppercase tracking-wide text-sm">
                      ĐỊA CHỈ MẶC ĐỊNH
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-3">
                      <p className="font-semibold text-slate-900 text-base">
                        {address.name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600">
                        SĐT: {address.phoneNumber}
                      </p>
                      <p className="text-sm text-slate-600">
                        Địa chỉ: {address.detail}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(address)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {!isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        disabled={setDefaultMutation.isPending}
                        className="text-xs whitespace-nowrap"
                      >
                        {setDefaultMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Đặt mặc định"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {addresses.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">
            Chưa có địa chỉ nào
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Thêm địa chỉ giao hàng để thanh toán nhanh hơn!
          </p>
        </div>
      )}

      {/* Add/Edit Address Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin địa chỉ giao hàng của bạn
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ tên người nhận</Label>
              <Input
                id="name"
                placeholder="Nhập họ tên người nhận"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                placeholder="Nhập số điện thoại"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detail">Địa chỉ chi tiết</Label>
              <Textarea
                id="detail"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                value={formData.detail}
                onChange={(e) =>
                  setFormData({ ...formData, detail: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Đặt làm địa chỉ mặc định
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : editingAddress ? (
                "Cập nhật"
              ) : (
                "Thêm địa chỉ"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
