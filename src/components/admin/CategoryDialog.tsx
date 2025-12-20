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
import { Textarea } from "@/components/ui/textarea";
import CustomUpload from "@/components/CustomUpload";
import { Loader2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import { toast } from "sonner";
import type { SaveCategoryDto } from "@/api";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (category: any) => void;
  defaultTitle?: string;
}

export const CategoryDialog = ({
  open,
  onOpenChange,
  onSuccess,
  defaultTitle = "",
}: CategoryDialogProps) => {
  const queryClient = useQueryClient();
  const [newCategoryData, setNewCategoryData] = useState<SaveCategoryDto>({
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (open) {
      setNewCategoryData({
        title: defaultTitle,
        description: "",
        image: "",
      });
    }
  }, [open, defaultTitle]);

  const createCategoryMutation = useMutation({
    mutationFn: (data: SaveCategoryDto) =>
      apiClient.api.adminCategoriesControllerCreate(data),
    onSuccess: (response: any) => {
      toast.success("Tạo danh mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["category"] });

      if (onSuccess) {
        onSuccess(response.data);
      }

      setNewCategoryData({ title: "", description: "", image: "" });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Tạo danh mục thất bại!");
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
            Nhập thông tin danh mục mới.
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