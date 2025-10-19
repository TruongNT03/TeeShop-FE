import type { CategoryResponseDto } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import { Check, Plus, Search, X } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const AdminCreateProduct = () => {
  const [categoryPage, setCategoryPage] = useState<number>(1);
  const [categorySearch, setCategorySearch] = useState<string>("");
  const [categorySearchOpen, setCategorySearchOpen] = useState<boolean>(false);
  const [categoryIds, setCategoryIds] = useState<CategoryResponseDto[]>([]);
  const { form, categories } = useCreateProduct({
    categoryQuery: { pageSize: 10, search: categorySearch },
  });
  const handleSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div className="w-[95%] mx-auto">
      <Form {...form}>
        <form className="w-full px-3" onSubmit={handleSubmit}>
          <div className="text-2xl uppercase font-semibold mt-5">
            CREATE PRODUCT
          </div>
          <div className="mt-3 flex justify-end gap-5">
            <Button variant="outline" type="submit">
              Save as draft
            </Button>
            <Button className="">Published</Button>
          </div>
          <div className="flex gap-8 mt-5">
            <Card className="flex-[3] px-5">
              <div className="text-xl font-semibold">General</div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Áo thun nam" />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-[200px]"
                        placeholder="Product desription ..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <div
                        className="w-full h-[160px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-400 transition"
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 h-10 text-indigo-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16V4m0 0l4 4m-4-4l-4 4M4 20h16"
                          />
                        </svg>
                        <p className="text-sm text-gray-600">
                          Select your file or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                          png, pdf, jpg, docx accepted
                        </p>
                        <button
                          type="button"
                          className="mt-2 px-4 py-1 bg-indigo-400 text-white rounded-md hover:bg-indigo-500 text-sm"
                        >
                          Browse
                        </button>

                        <Input
                          id="file-upload"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasVariant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product variant</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable if this product has multiple variants
                    </p>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />

              {form.getValues("hasVariant") && (
                <div className="  w-full flex justify-between gap-5">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Price"
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Stock" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sku</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Sku" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </Card>
            <Card className="flex-[1]"></Card>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminCreateProduct;
