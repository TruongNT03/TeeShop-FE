import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductForm, type VariantOption } from "@/components/admin/ProductForm";
import { useProductForm, type ProductFormData } from "@/hooks/useProductForm";
import {
  createProductMutation,
  getAllVariantValuesQuery,
} from "@/queries/adminProductQueries";
import { useEffect, useRef, useState } from "react";

interface AdminProductCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AdminProductCreateDialog = ({
  open,
  onClose,
}: AdminProductCreateDialogProps) => {
  const editorRef = useRef(null);
  const mutation = createProductMutation();

  const [categorySearch, setCategorySearch] = useState<string>("");
  const [categorySearchOpen, setCategorySearchOpen] = useState<boolean>(false);
  const [selectedVariantOptions, setSelectedVariantOptions] = useState<
    VariantOption[]
  >([]);
  const [currentSelectedVariantId, setCurrentSelectedVariantId] =
    useState<number>(0);

  const variantValuesResponse = getAllVariantValuesQuery(
    { variantId: currentSelectedVariantId, pageSize: 100 },
    currentSelectedVariantId > 0
  );

  const {
    form,
    categories,
    categoriesLoading,
    variants,
    variantsLoading,
    variantFields,
  } = useProductForm({
    categoryQuery: { pageSize: 20, search: categorySearch },
  });

  // Reset form khi đóng modal
  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedVariantOptions([]);
      setCurrentSelectedVariantId(0);
      if (editorRef.current) {
        (editorRef.current as any).setContent("");
      }
    }
  }, [open, form]);

  const onSubmit = (data: ProductFormData) => {
    const description = editorRef.current
      ? (editorRef.current as any).getContent()
      : "";

    const finalData = { ...data, description };
    mutation.mutate(finalData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo sản phẩm mới</DialogTitle>
        </DialogHeader>

        <ProductForm
          pageTitle=""
          form={form}
          onSubmit={onSubmit}
          isLoading={mutation.isPending}
          editorRef={editorRef}
          categories={categories}
          categoriesLoading={categoriesLoading}
          variants={variants}
          variantsLoading={variantsLoading}
          variantFields={variantFields}
          categorySearch={categorySearch}
          setCategorySearch={setCategorySearch}
          categorySearchOpen={categorySearchOpen}
          setCategorySearchOpen={setCategorySearchOpen}
          selectedVariantOptions={selectedVariantOptions}
          setSelectedVariantOptions={setSelectedVariantOptions}
          currentSelectedVariantId={currentSelectedVariantId}
          setCurrentSelectedVariantId={setCurrentSelectedVariantId}
          variantValuesResponse={variantValuesResponse}
        />
      </DialogContent>
    </Dialog>
  );
};