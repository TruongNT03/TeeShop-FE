import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getAllCategoryQuery,
  getAllVariantsQuery,
} from "@/queries/adminProductQueries";
import type { apiClient } from "@/services/apiClient";

const productVariantSchema = z.object({
  id: z.string().optional(),
  price: z.number().min(0, "Giá phải lớn hơn 0"),
  stock: z.number().int().min(0, "Tồn kho phải là số nguyên dương"),
  sku: z.string().min(1, "SKU là bắt buộc"),
  variantValueIds: z
    .array(z.number())
    .min(1, "Phải chọn ít nhất 1 giá trị biến thể"),
  name: z.string().optional(),
});

const baseProductSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  description: z.string().optional(),
  status: z.enum(["published", "unpublished"]),
  categoryIds: z.array(z.number()).min(1, "Phải chọn ít nhất 1 danh mục"),
  imageUrls: z.array(z.string().url()).optional(),
});

const simpleProductSchema = baseProductSchema.extend({
  hasVariant: z.literal(false),
  price: z.number().min(0, "Giá phải lớn hơn 0"),
  stock: z.number().int().min(0, "Tồn kho phải là số nguyên dương"),
  sku: z.string().min(1, "SKU là bắt buộc"),
  productVariants: z.array(productVariantSchema).max(0).optional(),
});

const variantProductSchema = baseProductSchema.extend({
  hasVariant: z.literal(true),
  price: z.number().optional(),
  stock: z.number().optional(),
  sku: z.string().optional(),
  productVariants: z
    .array(productVariantSchema)
    .min(1, "Phải thêm ít nhất 1 biến thể"),
});

export const createProductSchema = z.discriminatedUnion("hasVariant", [
  simpleProductSchema,
  variantProductSchema,
]);

export type ProductFormData = z.infer<typeof createProductSchema>;

export const useProductForm = ({
  categoryQuery,
  defaultValues,
}: {
  categoryQuery: Parameters<
    typeof apiClient.api.adminCategoriesControllerFindAll
  >[0];
  defaultValues?: Partial<ProductFormData>;
}) => {
  const categoriesResponse = getAllCategoryQuery(categoryQuery);
  const variantsResponse = getAllVariantsQuery({ pageSize: 100 });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      status: "unpublished",
      hasVariant: false,
      categoryIds: [],
      imageUrls: [],
      price: 0,
      sku: "",
      stock: 0,
      productVariants: [],
    },
  });

  const variantFields = useFieldArray({
    control: form.control,
    name: "productVariants",
  });

  return {
    form,
    categories: categoriesResponse.data?.data.data || [],
    categoriesLoading: categoriesResponse.isLoading,
    variants: variantsResponse.data?.data.data || [],
    variantsLoading: variantsResponse.isLoading,
    variantFields,
  };
};
