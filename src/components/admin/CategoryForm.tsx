import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CustomUpload from "@/components/CustomUpload";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { SaveCategoryDto } from "@/api";

const categorySchema = z.object({
  title: z.string().min(1, "Tên danh mục là bắt buộc"),
  description: z.string().optional(),
  image: z.string().min(1, "Ảnh danh mục là bắt buộc"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSubmit: (data: SaveCategoryDto) => void;
  isLoading: boolean;
  defaultValues?: Partial<CategoryFormData>;
}

export const CategoryForm = ({
  onSubmit,
  isLoading,
  defaultValues,
}: CategoryFormProps) => {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      image: "",
    },
  });

  const handleSubmitWrapper = (data: CategoryFormData) => {
    onSubmit({
      ...data,
      description: data.description || "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitWrapper)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin danh mục</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên danh mục</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: Áo thun mùa hè" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả ngắn về danh mục..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh đại diện</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomUpload
                        value={field.value ? [field.value] : []} 
                        onChange={(urls) => field.onChange(urls[0] || "")} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Tạo danh mục
          </Button>
        </div>
      </form>
    </Form>
  );
};