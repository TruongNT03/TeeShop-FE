import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Plus, Edit2, Trash2, CheckCircle } from "lucide-react";
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

type Address = {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
};

const mockAddresses: Address[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
    isDefault: true,
  },
  {
    id: 2,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    address: "456 Lê Lợi, Quận 3, TP. Hồ Chí Minh",
    isDefault: false,
  },
];

export const ProfileAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        name: address.name,
        phone: address.phone,
        address: address.address,
      });
    } else {
      setEditingAddress(null);
      setFormData({ name: "", phone: "", address: "" });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (editingAddress) {
      // Update existing address
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id ? { ...addr, ...formData } : addr
        )
      );
      toast.success("Cập nhật địa chỉ thành công!");
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now(),
        ...formData,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddress]);
      toast.success("Thêm địa chỉ mới thành công!");
    }

    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    const address = addresses.find((addr) => addr.id === id);
    if (address?.isDefault && addresses.length > 1) {
      toast.error(
        "Không thể xóa địa chỉ mặc định! Vui lòng chọn địa chỉ mặc định khác trước."
      );
      return;
    }
    setAddresses(addresses.filter((addr) => addr.id !== id));
    toast.success("Xóa địa chỉ thành công!");
  };

  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success("Đã đặt làm địa chỉ mặc định!");
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

      <div className="space-y-4">
        {addresses.map((address, index) => (
          <motion.div
            key={address.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
            }}
            className={cn(
              "rounded-lg border p-4 shadow-sm hover:shadow-md",
              address.isDefault
                ? "border-primary bg-primary/5"
                : "border-slate-200 bg-white hover:border-primary/50"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-slate-900">{address.name}</p>
                  {address.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                      <CheckCircle className="h-3 w-3" />
                      Mặc định
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-1">{address.phone}</p>
                <p className="text-sm text-slate-600">{address.address}</p>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(address.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!address.isDefault && (
              <div className="mt-3 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetDefault(address.id)}
                  className="text-xs"
                >
                  Đặt làm mặc định
                </Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

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
                placeholder="Nhập họ tên"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ chi tiết</Label>
              <Textarea
                id="address"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              {editingAddress ? "Cập nhật" : "Thêm địa chỉ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
