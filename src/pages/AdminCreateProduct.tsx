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
import { Upload } from "antd";
import CustomUpload from "@/components/CustomUpload";

const { Dragger } = Upload;

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
                      <CustomUpload></CustomUpload>
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
