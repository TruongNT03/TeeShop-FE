import type { ProductDetailResponseDto, VariantValueResponseDto } from "@/api";
import { ProductForm, type VariantOption } from "@/components/admin/ProductForm";
import { Spinner } from "@/components/ui/spinner";
import { useProductForm, type ProductFormData } from "@/hooks/useProductForm";
import {
  getAllVariantValuesQuery,
  getAdminProductByIdQuery,
  updateProductMutation,
} from "@/queries/adminProductQueries";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const transformDtoToFormData = (
  data: ProductDetailResponseDto
): Partial<ProductFormData> => {
  if (!data.hasVariant) {
    const simpleVariant = data.productVariants?.[0];
    return {
      name: data.name,
      description: data.description,
      status: data.status,
      hasVariant: false,
      categoryIds: data.categories.map((c) => c.id),
      imageUrls: data.productImages.map((img) => img.url),
      price: simpleVariant?.price ?? 0,
      stock: simpleVariant?.stock ?? 0,
      sku: simpleVariant?.sku ?? "",
      productVariants: [],
    };
  } else {
    return {
      name: data.name,
      description: data.description,
      status: data.status,
      hasVariant: true,
      categoryIds: data.categories.map((c) => c.id),
      imageUrls: data.productImages.map((img) => img.url),
      price: undefined,
      stock: undefined,
      sku: undefined,
      productVariants: data.productVariants.map((v) => ({
        ...v,
        variantValueIds: v.variantValues.map((vv) => vv.id),
        name: v.variantValues.map((vv) => vv.value).join(" / "),
      })),
    };
  }
};

const AdminProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const mutation = updateProductMutation();

  const { data: productData, isLoading: isLoadingProduct } =
    getAdminProductByIdQuery(id!);

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

  useEffect(() => {
    if (productData?.data && variants.length > 0) {
      const formData = transformDtoToFormData(productData.data);
      form.reset(formData);

      if (editorRef.current) {
        (editorRef.current as any).setContent(formData.description || "");
      }

      if (productData.data.hasVariant) {
        const variantValueIdsInProduct = new Set(
          productData.data.productVariants.flatMap((pv) =>
            pv.variantValues.map((vv) => vv.id)
          )
        );

        const allVariantIdsInProduct = new Set(
          productData.data.productVariants.flatMap((pv) =>
            pv.variantValues.map((vv) => vv.variant.id)
          )
        );

        const options: VariantOption[] = variants
          .filter((v) => allVariantIdsInProduct.has(v.id))
          .map((v) => ({
            variantId: v.id,
            name: v.name,
            values:
              productData.data.productVariants
                .flatMap((pv) => pv.variantValues)
                .filter((vv) => vv.variant.id === v.id)
                .reduce((acc, current) => {
                  if (!acc.find((item) => item.id === current.id)) {
                    acc.push(current);
                  }
                  return acc;
                }, [] as (VariantValueResponseDto & { selected?: boolean })[])
                .map((val) => ({
                  ...val,
                  selected: variantValueIdsInProduct.has(val.id),
                })) || [],
          }));
        setSelectedVariantOptions(options);
      }
    }
  }, [productData, variants, form.reset]);

  const onSubmit = (data: ProductFormData) => {
    const description = editorRef.current
      ? (editorRef.current as any).getContent()
      : "";

    const originalImages = productData?.data.productImages || [];

    const transformedImageUrls = data.imageUrls?.map((url) => {
      const originalImage = originalImages.find((img) => img.url === url);
      return {
        id: originalImage ? originalImage.id : undefined, 
        url: url,
      };
    }) || [];
    
    const finalData = {
      ...data,
      description,
      imageUrls: transformedImageUrls, 
    };
    
    mutation.mutate(
      { id: id!, data: finalData as any},
      {
        onSuccess: () => {
          navigate("/admin/product");
        },
      }
    );
  
  };

  if (isLoadingProduct || (productData && variantsLoading)) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="w-[95%] mx-auto pb-10">
      <ProductForm
        pageTitle="CHỈNH SỬA SẢN PHẨM"
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

export default AdminProductEdit;