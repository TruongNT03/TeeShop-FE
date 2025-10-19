import type { CreateProductDto } from "@/api";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllCategoryQuery } from "@/queries/adminProductQueries";
import type { apiClient } from "@/services/apiClient";

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(["published", "unpublished"]),
  hasVariant: z.boolean(),
  categoryIds: z.array(z.number().int()),
  imageUrls: z.array(z.url()).optional(),
  sku: z.string(),
  price: z.number().optional(),
  stock: z.number(),
  productVariants: z.array(z.string()).optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;

export const useCreateProduct = ({
  categoryQuery,
}: {
  categoryQuery: Parameters<
    typeof apiClient.api.adminCategoriesControllerFindAll
  >[0];
}) => {
  const { data } = getAllCategoryQuery(categoryQuery);

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "unpublished",
      hasVariant: true,
      categoryIds: [],
      imageUrls: [],
      price: 0,
      sku: "",
      stock: 0,
      productVariants: [],
    },
  });
  return { form, categories: data?.data.data };
};
