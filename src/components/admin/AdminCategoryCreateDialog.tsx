import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { createCategoryMutation } from "@/queries/adminProductQueries";
import type { SaveCategoryDto } from "@/api";
import { useEffect } from "react";

interface AdminCategoryCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AdminCategoryCreateDialog = ({
  open,
  onClose,
}: AdminCategoryCreateDialogProps) => {
  const mutation = createCategoryMutation();

  useEffect(() => {
    if (!open) {
      mutation.reset();
    }
  }, [open]);

  const onSubmit = (data: SaveCategoryDto) => {
    const finalData = { ...data, description: data.description || "" };
    
    mutation.mutate(finalData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo danh mục mới</DialogTitle>
        </DialogHeader>
        
        {open && (
            <CategoryForm 
                onSubmit={onSubmit} 
                isLoading={mutation.isPending} 
            />
        )}
      </DialogContent>
    </Dialog>
  );
};