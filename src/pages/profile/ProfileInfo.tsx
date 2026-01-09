import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Camera, Loader2, Upload } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import type { UpdateProfileDto, UploadDto } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiClient } from "@/services/apiClient";
import axios from "axios";

export const ProfileInfo: React.FC = () => {
  const {
    profile,
    isLoading,
    isError,
    error,
    refetch,
    updateProfile,
    isUpdating,
  } = useProfile();

  const user = profile;

  const [isEditing, setIsEditing] = useState(false);

  // Use user data directly, not from state
  const formData = {
    name: user?.name ?? "",
    phoneNumber: user?.phoneNumber ?? "",
    avatar: user?.avatar ?? "",
    gender: (user?.gender ?? "other") as "male" | "female" | "other",
  };

  const [editedData, setEditedData] = React.useState(formData);

  // Update editedData when user profile changes
  React.useEffect(() => {
    if (user) {
      setEditedData({
        name: user.name ?? "",
        phoneNumber: user.phoneNumber ?? "",
        avatar: user.avatar ?? "",
        gender: user.gender ?? "other",
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!editedData.name.trim()) {
      toast.error("Vui lòng điền họ tên!");
      return;
    }

    if (!editedData.phoneNumber.trim()) {
      toast.error("Vui lòng điền số điện thoại!");
      return;
    }

    const dto: UpdateProfileDto = {
      name: editedData.name.trim(),
      phoneNumber: editedData.phoneNumber.trim(),
      avatar: editedData.avatar,
      gender: editedData.gender,
    };

    try {
      await updateProfile(dto);
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Cập nhật thông tin thất bại!");
      console.error("Update failed", err);
    }
  };

  const handleCancel = () => {
    setEditedData({
      name: user?.name ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      avatar: user?.avatar ?? "",
      gender: user?.gender ?? "other",
    });
    setIsEditing(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh!");
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 2MB!");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Step 1: Get presigned URL
      const uploadDto: UploadDto = {
        fileName: file.name,
        contentType: file.type,
      };
      const uploadResponse = await apiClient.api.authControllerUploadAvatar(
        uploadDto
      );

      // Step 2: Upload file to presigned URL
      await axios.put(uploadResponse.data.presignUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // Step 3: Update form with file URL
      setEditedData({ ...editedData, avatar: uploadResponse.data.fileUrl });
      toast.success("Tải ảnh lên thành công!");
    } catch (error) {
      toast.error("Tải ảnh lên thất bại!");
      console.error("Upload failed", error);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse h-28 bg-slate-100 rounded-lg" />
        <div className="animate-pulse h-40 bg-slate-100 rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h2 className="text-lg font-medium text-slate-800">Lỗi</h2>
        <p className="mt-2 text-sm text-red-600">
          {(error as any)?.message ?? "Lấy thông tin cá nhân thất bại"}
        </p>
        <div className="mt-4">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-md border"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-medium">Không tìm thấy thông tin</h2>
        <p className="mt-2 text-sm text-slate-600">
          Tạo hồ sơ của bạn để bắt đầu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Thông tin cá nhân</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu"
              )}
            </Button>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
        }}
        className="space-y-6"
      >
        {/* Avatar Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b">
          <div className="relative">
            <div className="h-32 w-32 rounded-xl overflow-hidden bg-slate-100">
              {(isEditing ? editedData.avatar : profile.avatar) ? (
                <img
                  src={isEditing ? editedData.avatar : formData.avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-4xl font-semibold text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200">
                  {(isEditing
                    ? editedData.name
                    : formData.name)?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-full shadow-lg hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {formData.name || "Chưa cập nhật"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">{user.email}</p>
            </div>
            {isEditing && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="gap-2"
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải lên...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Chọn ảnh mới
                    </>
                  )}
                </Button>
                <p className="text-xs text-slate-500 mt-2">
                  Định dạng: JPG, PNG. Kích thước tối đa: 2MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            {isEditing ? (
              <Input
                id="name"
                value={editedData.name}
                onChange={(e) =>
                  setEditedData({ ...editedData, name: e.target.value })
                }
                placeholder="Nhập họ và tên"
              />
            ) : (
              <p className="text-sm text-slate-900 py-2">
                {formData.name || "Chưa cập nhật"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            {isEditing ? (
              <Input
                id="phoneNumber"
                value={editedData.phoneNumber}
                onChange={(e) =>
                  setEditedData({ ...editedData, phoneNumber: e.target.value })
                }
                placeholder="Nhập số điện thoại"
              />
            ) : (
              <p className="text-sm text-slate-900 py-2">
                {formData.phoneNumber || "Chưa cập nhật"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính</Label>
            {isEditing ? (
              <select
                id="gender"
                value={editedData.gender}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    gender: e.target.value as "male" | "female" | "other",
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            ) : (
              <p className="text-sm text-slate-900 py-2">
                {formData.gender === "male"
                  ? "Nam"
                  : formData.gender === "female"
                  ? "Nữ"
                  : "Khác"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <p className="text-sm text-slate-500 py-2">{user.email}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="createdAt">Ngày tham gia</Label>
            <p className="text-sm text-slate-500 py-2">
              {new Date(user.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
