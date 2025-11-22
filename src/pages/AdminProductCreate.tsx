import type { VariantValueResponseDto } from "@/api";
import { ProductForm, type VariantOption } from "@/components/admin/ProductForm";
import { useProductForm, type ProductFormData } from "@/hooks/useProductForm";
import {
  createProductMutation,
  getAllVariantValuesQuery,
} from "@/queries/adminProductQueries";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProductCreate = () => {
  const editorRef = useRef(null);
  const navigate = useNavigate();
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

  const onSubmit = (data: ProductFormData) => {
    const description = editorRef.current
      ? (editorRef.current as any).getContent()
      : "";

    const finalData = { ...data, description };
    mutation.mutate(finalData, {
      onSuccess: () => {
        form.reset();
        navigate("/admin/product");
      },
    });
  };

  return (
    <div className="w-[95%] mx-auto pb-10">
      <ProductForm
        pageTitle="TẠO SẢN PHẨM MỚI"
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
    </div>
  );
};

export default AdminProductCreate;