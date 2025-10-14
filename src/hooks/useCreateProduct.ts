import type { CreateProductDto } from "@/api";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const createProductSchema = z.object({
  status: z.string(),
  name: z.string().length(255),
  description: z.string(),
  hasVariant: z.boolean(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;

export const useCreateProduct = () => {
  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      description: "",
      hasVariant: false,
      name: "",
      status: "",
    },
  });
};
