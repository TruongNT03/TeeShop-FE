import type {
  CategoryResponseDto,
  VariantResponseDto,
  VariantValueResponseDto,
} from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ProductFormData } from "@/hooks/useProductForm";
import {
  Check,
  ChevronDown,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import CustomUpload from "@/components/CustomUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import type { UseQueryResult } from "@tanstack/react-query";

export type VariantOption = {
  variantId: number;
  name: string;
  values: (VariantValueResponseDto & { selected: boolean })[];
};

type ProductFormProps = {
  form: UseFormReturn<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  isLoading: boolean;
  pageTitle: string;
  editorRef: React.MutableRefObject<any>;
  categories: CategoryResponseDto[];
  categoriesLoading: boolean;
  variants: VariantResponseDto[];
  variantsLoading: boolean;
  variantFields: UseFieldArrayReturn<ProductFormData, "productVariants", "id">;
  categorySearch: string;
  setCategorySearch: (value: string) => void;
  categorySearchOpen: boolean;
  setCategorySearchOpen: (open: boolean) => void;
  selectedVariantOptions: VariantOption[];
  setSelectedVariantOptions: React.Dispatch<React.SetStateAction<VariantOption[]>>;
  currentSelectedVariantId: number;
  setCurrentSelectedVariantId: (id: number) => void;
  variantValuesResponse: UseQueryResult<any, Error>;
};

export const ProductForm = ({
  form,
  onSubmit,
  isLoading,
  pageTitle,
  editorRef,
  categories,
  categoriesLoading,
  variants,
  variantsLoading,
  variantFields,
  categorySearch,
  setCategorySearch,
  categorySearchOpen,
  setCategorySearchOpen,
  selectedVariantOptions,
  setSelectedVariantOptions,
  currentSelectedVariantId,
  setCurrentSelectedVariantId,
  variantValuesResponse,
}: ProductFormProps) => {
  const hasVariant = form.watch("hasVariant");

  const handleAddVariantOption = (variantId: number) => {
    const variant = variants.find((v) => v.id === variantId);
    if (
      variant &&
      !selectedVariantOptions.some((o) => o.variantId === variantId)
    ) {
      setCurrentSelectedVariantId(variant.id);
    }
  };

  useEffect(() => {
    if (
      variantValuesResponse.data &&
      currentSelectedVariantId > 0 &&
      !selectedVariantOptions.some(
        (o) => o.variantId === currentSelectedVariantId
      )
    ) {
      const variant = variants.find((v) => v.id === currentSelectedVariantId);
      if (!variant) return;

      setSelectedVariantOptions((prev) => [
        ...prev,
        {
          variantId: currentSelectedVariantId,
          name: variant.name,
          values:
            variantValuesResponse.data.data.data.map((val: any) => ({
              ...val,
              selected: false,
            })) || [],
        },
      ]);
      setCurrentSelectedVariantId(0);
    }
  }, [
    variantValuesResponse.data,
    currentSelectedVariantId,
    variants,
    setSelectedVariantOptions,
    setCurrentSelectedVariantId,
    selectedVariantOptions,
  ]);

  const toggleVariantValue = (optionId: number, valueId: number) => {
    setSelectedVariantOptions((prev) =>
      prev.map((option) =>
        option.variantId === optionId
          ? {
              ...option,
              values: option.values.map((val) =>
                val.id === valueId
                  ? { ...val, selected: !val.selected }
                  : val
              ),
            }
          : option
      )
    );
  };

  const generateVariantRows = () => {
    variantFields.remove();
    const selectedOptions = selectedVariantOptions
      .map((opt) => ({
        ...opt,
        values: opt.values.filter((val) => val.selected),
      }))
      .filter((opt) => opt.values.length > 0);
    if (selectedOptions.length === 0) return;

    const valueArrays = selectedOptions.map((opt) => opt.values);
    const getCombinations = (
      arrays: VariantValueResponseDto[][]
    ): VariantValueResponseDto[][] => {
      if (arrays.length === 0) return [[]];
      const first = arrays[0];
      const rest = arrays.slice(1);
      const restCombs = getCombinations(rest);
      const combinations: VariantValueResponseDto[][] = [];
      first.forEach((val) => {
        restCombs.forEach((comb) => {
          combinations.push([val, ...comb]);
        });
      });
      return combinations;
    };

    const combinations = getCombinations(valueArrays);

    combinations.forEach((comb) => {
      variantFields.append({
        price: 0,
        stock: 0,
        sku: "",
        variantValueIds: comb.map((v) => v.id),
        name: comb.map((v) => v.value).join(" / "),
      });
    });
  };

  return (
    <Form {...form}>
      <form className="w-full px-1">
        {/* Header */}
        {pageTitle && (
          <div className="flex justify-between items-center mt-2 mb-5">
            <div className="text-xl uppercase font-semibold">{pageTitle}</div>
          </div>
        )}

        <div className="flex flex-col gap-6">
  
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tên sản phẩm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 2. Danh mục */}
              <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <Popover
                      open={categorySearchOpen}
                      onOpenChange={setCategorySearchOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between font-normal"
                        >
                          <span className="truncate">
                            {field.value.length > 0
                              ? `${field.value.length} danh mục đã chọn`
                              : "Chọn danh mục..."}
                          </span>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Tìm danh mục..."
                            value={categorySearch}
                            onValueChange={setCategorySearch}
                          />
                          <CommandList>
                            {categoriesLoading && (
                              <div className="flex justify-center p-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            )}
                            <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
                            <CommandGroup>
                              {categories.map(
                                (category: CategoryResponseDto) => (
                                  <CommandItem
                                    key={category.id}
                                    value={category.title}
                                    onSelect={() => {
                                      const currentIds = field.value || [];
                                      const newIds = currentIds.includes(
                                        category.id
                                      )
                                        ? currentIds.filter(
                                            (id) => id !== category.id
                                          )
                                        : [...currentIds, category.id];
                                      field.onChange(newIds);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        (field.value || []).includes(
                                          category.id
                                        )
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {category.title}
                                  </CommandItem>
                                )
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {categories
                        .filter((cat: CategoryResponseDto) =>
                          (field.value || []).includes(cat.id)
                        )
                        .map((cat: CategoryResponseDto) => (
                          <Badge key={cat.id} variant="secondary">
                            {cat.title}
                          </Badge>
                        ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 3. Mô tả */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Editor
                        apiKey="6zx8a1n07j925x66iyy3gp0r8lgoywv2p8uq1fi6a7k9awsd"
                        onInit={(_evt, editor) =>
                          (editorRef.current = editor as any)
                        }
                        initialValue={field.value}
                        init={{
                          height: 300,
                          menubar: false,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                          ],
                          toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist outdent indent | " +
                            "removeformat | help",
                          content_style:
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        }}
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
              <CardTitle>Hình ảnh</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="imageUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomUpload
                        value={field.value || []}
                        onChange={field.onChange}
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
              <CardTitle>Định giá & Biến thể</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="hasVariant"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Sản phẩm có biến thể
                      </FormLabel>
                      <FormDescription>
                        Bật nếu sản phẩm có nhiều lựa chọn (VD: Size, Màu sắc).
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Separator />

              {!hasVariant && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
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
                        <FormLabel>Tồn kho</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
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
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="AOTHUN-DEN" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {hasVariant && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <FormLabel>Tùy chọn biến thể</FormLabel>
                    {selectedVariantOptions.map((option) => (
                      <Card key={option.variantId} className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel>{option.name}</FormLabel>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              setSelectedVariantOptions((prev) =>
                                prev.filter(
                                  (o) => o.variantId !== option.variantId
                                )
                              )
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((val) => (
                            <Badge
                              key={val.id}
                              variant={
                                val.selected ? "default" : "outline"
                              }
                              onClick={() =>
                                toggleVariantValue(option.variantId, val.id)
                              }
                              className="cursor-pointer"
                            >
                              {val.value}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    ))}

                    <div className="flex gap-2">
                      <Select
                        onValueChange={(value) =>
                          handleAddVariantOption(Number(value))
                        }
                        value={String(currentSelectedVariantId)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Chọn loại biến thể (VD: Size)" />
                        </SelectTrigger>
                        <SelectContent>
                          {variantsLoading ? (
                            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                          ) : (
                            variants.map((v) => (
                              <SelectItem
                                key={v.id}
                                value={String(v.id)}
                                disabled={selectedVariantOptions.some(
                                  (o) => o.variantId === v.id
                                )}
                              >
                                {v.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        onClick={generateVariantRows}
                        disabled={selectedVariantOptions.length === 0}
                      >
                        Tạo biến thể
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {variantFields.fields.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Biến thể</TableHead>
                          <TableHead>Giá</TableHead>
                          <TableHead>Tồn kho</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>
                            <span className="sr-only">Xóa</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {variantFields.fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell className="font-medium">
                              {field.name}
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`productVariants.${index}.price`}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="number"
                                    className="w-28"
                                    onChange={(e) =>
                                      field.onChange(e.target.valueAsNumber)
                                    }
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`productVariants.${index}.stock`}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="number"
                                    className="w-24"
                                    onChange={(e) =>
                                      field.onChange(e.target.valueAsNumber)
                                    }
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`productVariants.${index}.sku`}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    className="w-32"
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => variantFields.remove(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  <FormMessage>
                    {form.formState.errors.productVariants?.message}
                  </FormMessage>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Bottom */}
        <div className="flex justify-end gap-3 mt-6 pb-2">
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => {
              form.setValue("status", "unpublished");
              form.handleSubmit(onSubmit)();
            }}
          >
            {isLoading && form.getValues("status") === "unpublished" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Lưu nháp
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => {
              form.setValue("status", "published");
              form.handleSubmit(onSubmit)();
            }}
          >
            {isLoading && form.getValues("status") === "published" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Xuất bản
          </Button>
        </div>
      </form>
    </Form>
  );
};