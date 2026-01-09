import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CustomUpload from "@/components/CustomUpload";
import { apiClient } from "@/services/apiClient";
import type { SaveCategoryDto } from "@/api";

interface CategoryCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (categoryId: number) => void;
}

const CategoryCreateModal = ({
  open,
  onOpenChange,
  onSuccess,
}: CategoryCreateModalProps) => {
  const queryClient = useQueryClient();
  const [newCategoryData, setNewCategoryData] = useState<SaveCategoryDto>({
    title: "",
    description: "",
    image: "",
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: SaveCategoryDto) =>
      apiClient.api.adminCategoriesControllerCreate(data),
    onSuccess: (response) => {
      toast.success("Tạo danh mục thành công!");
      // Làm mới danh sách danh mục ở bất cứ đâu đang hiển thị
      queryClient.invalidateQueries({ queryKey: ["category"] });
      
      if (onSuccess) {
        onSuccess(response.data.id);
      }
      
      // Reset form và đóng modal
      setNewCategoryData({ title: "", description: "", image: "" });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Tạo danh mục thất bại!");
    },
  });

  const handleCreateCategory = () => {
    if (
      !newCategoryData.title.trim() ||
      !newCategoryData.description.trim() ||
      !newCategoryData.image
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    createCategoryMutation.mutate(newCategoryData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo danh mục mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin danh mục mới. Sau khi tạo thành công, hệ thống sẽ cập nhật lại dữ liệu.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="category-title" className="text-sm font-medium">
              Tên danh mục
            </label>
            <Input
              id="category-title"
              placeholder="Nhập tên danh mục..."
              value={newCategoryData.title}
              onChange={(e) =>
                setNewCategoryData({
                  ...newCategoryData,
                  title: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="category-description"
              className="text-sm font-medium"
            >
              Mô tả
            </label>
            <Textarea
              id="category-description"
              placeholder="Nhập mô tả danh mục..."
              value={newCategoryData.description}
              onChange={(e) =>
                setNewCategoryData({
                  ...newCategoryData,
                  description: e.target.value,
                })
              }
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hình ảnh</label>
            <CustomUpload
              value={newCategoryData.image ? [newCategoryData.image] : []}
              onChange={(urls) =>
                setNewCategoryData({
                  ...newCategoryData,
                  image: urls[0] || "",
                })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createCategoryMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleCreateCategory}
            disabled={
              !newCategoryData.title.trim() ||
              !newCategoryData.description.trim() ||
              !newCategoryData.image ||
              createCategoryMutation.isPending
            }
          >
            {createCategoryMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Tạo danh mục
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryCreateModal;