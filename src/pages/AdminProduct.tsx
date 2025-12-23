import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationControl,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminProduct } from "@/hooks/useAdminProduct";
import {
  Archive,
  ArchiveRestore,
  ArrowUpDown,
  ListFilter,
  Pencil,
  Plus,
  Search,
  SquarePen,
  Check,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { convertDateTime } from "@/utils/convertDateTime";
import { Link } from "react-router-dom";
import type { apiClient } from "@/services/apiClient";
import { ProductStatus } from "@/types/productStatus";
import type { AdminProductResponseDto, CategoryResponseDto } from "@/api";
import { Spinner } from "@/components/ui/spinner";
import {
  updateProductStatusMutation,
  getAllCategoryQuery,
} from "@/queries/adminProductQueries";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/contexts/PermissionsContext";
import {
  useAdminListProduct,
  type AdminListProductQuery,
} from "@/queries/admin/useAdminListProduct";
import {
  type AdminListCategoriesQuery,
  useAdminListCategories,
} from "@/queries/admin/useAdminListCategories";

const AdminProduct = () => {
  const [query, setQuery] = useState<AdminListProductQuery>({
    page: 1,
    pageSize: 10,
    categoriesIds: [],
    search: "",
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  const [categoryQuery, setCategoryQuery] = useState<AdminListCategoriesQuery>({
    pageSize: 10,
  });

  const adminListProductQuery = useAdminListProduct(query);
  const adminListCategoriesQuery = useAdminListCategories(categoryQuery);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    products,
    isSelectedAllProduct,
    selectedProducts,
    setIsSelectedAllProduct,
    setSelectedProducts,
    pagination,
    isLoading,
  } = useAdminProduct(query as any);

  const statusMutation = updateProductStatusMutation();

  const { canCreate, canDelete, canRead, canUpdate } = usePermissions();

  const [categorySearch, setCategorySearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      search: debouncedSearchTerm,
      page: 1,
    }));
  }, [debouncedSearchTerm]);

  const handleSort = (
    field: "name" | "description" | "status" | "createdAt" | "updatedAt"
  ) => {
    const isCurrentSort = query.sortBy === field;
    setQuery((prevQuery) => ({
      ...prevQuery,
      sortBy: field,
      sortOrder:
        isCurrentSort && prevQuery.sortOrder === "DESC" ? "ASC" : "DESC",
    }));
  };

  const handleCategorySelect = (categoryId: number) => {
    setQuery((prev) => {
      const currentIds = prev.categoriesIds || [];
      const categoriesIds = [
        ...new Set([
          ...(currentIds.includes(categoryId)
            ? currentIds.filter((id) => id !== categoryId)
            : [...currentIds, categoryId]),
        ]),
      ];
      return { ...prev, categoriesIds, page: 1 };
    });
  };

  const tableHeaderTitles = [
    {
      key: "name",
      title: "Name",
      sortable: true,
      render: (value: string): React.ReactNode => (
        <TableCell>{value}</TableCell>
      ),
    },
    // {
    //   key: "description",
    //   title: "Description",
    //   sortable: true,
    //   render: (value: string): React.ReactNode => (
    //     <TableCell className="max-w-[200px] overflow-hidden truncate">
    //       {value}
    //     </TableCell>
    //   ),
    // },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value: ProductStatus): React.ReactNode => (
        <TableCell>
          {value === ProductStatus.PUBLISHED ? (
            <Badge
              variant="outline"
              className="border-green-500 text-green-500"
            >
              Published
            </Badge>
          ) : (
            <Badge
              variant="destructive"
              className="border-destructive bg-transparent text-destructive"
            >
              Unpublished
            </Badge>
          )}
        </TableCell>
      ),
    },
    {
      key: "categories",
      title: "Categories",
      sortable: false,
      render: (value: string[]): React.ReactNode => (
        <TableCell>
          <div className="flex flex-col gap-2 items-start">
            {value.map(
              (category, index) =>
                index < 3 && (
                  <Badge
                    key={index}
                    className="border-primary bg-transparent text-primary"
                  >
                    {category}
                  </Badge>
                )
            )}
            {value.length > 2 && (
              <Badge className="border-primary bg-transparent text-primary px-7">
                ...
              </Badge>
            )}
          </div>
        </TableCell>
      ),
    },
    {
      key: "createdAt",
      title: "Created At",
      sortable: true,
      render: (value: string): React.ReactNode => (
        <TableCell>{convertDateTime(value)}</TableCell>
      ),
    },
    {
      key: "updatedAt",
      title: "Updated At",
      sortable: true,
      render: (value: string): React.ReactNode => (
        <TableCell>{convertDateTime(value)}</TableCell>
      ),
    },
    {
      key: "action",
      title: "Action",
      sortable: false,
      render: (product: AdminProductResponseDto): React.ReactNode => (
        <TableCell>
          <div className="flex gap-2">
            <Link to={`/admin/product/edit/${product.id}`}>
              <SquarePen
                className={`scale-75 text-primary ${
                  canUpdate("Product") ? "cursor-pointer" : "cursor-not-allowed"
                } 
                  ${canUpdate("Product") ? "" : "opacity-30"}`}
              />
            </Link>
            {product.status === "published" ? (
              <Archive
                className={`scale-75 text-destructive 
                  ${
                    canUpdate("Product")
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  } 
                  ${canUpdate("Product") ? "" : "opacity-30"}
                ${
                  statusMutation.isPending
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
                onClick={() =>
                  canUpdate("Product") &&
                  statusMutation.mutate({
                    id: product.id,
                    data: { status: "unpublished" },
                  })
                }
              />
            ) : (
              <ArchiveRestore
                className={`scale-75 text-emerald-500 cursor-pointer ${
                  statusMutation.isPending
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
                onClick={() =>
                  statusMutation.mutate({
                    id: product.id,
                    data: { status: "published" },
                  })
                }
              />
            )}
          </div>
        </TableCell>
      ),
    },
  ];

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPage) return;
    setQuery((prevQuery) => ({
      ...prevQuery,
      page: newPage,
    }));
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-medium uppercase">Product Master</h1>
      </div>
      {/* Total */}
      {/* <div className="flex justify-between gap-8">
        <Card className="flex-1 shadow-none"></Card>
        <Card className="flex-1 shadow-none"></Card>
        <Card className="flex-1 shadow-none"></Card>
        <Card className="flex-1 shadow-none"></Card>
      </div> */}
      {/* Search and Filter */}
      <div className="flex justify-between">
        <div className="flex">
          <div className="relative mr-5">
            <Input
              className="w-[400px] py-0 pl-10"
              type="search"
              placeholder="Tìm theo tên, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="scale-75 absolute top-[18%] left-2 text-slate-400" />
          </div>

          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" />
                Lọc theo danh mục
                {query.categoriesIds && query.categoriesIds.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {query.categoriesIds.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder="Tìm danh mục..."
                  value={categorySearch}
                  onValueChange={setCategorySearch}
                />
                <CommandList>
                  {adminListCategoriesQuery.isLoading && (
                    <div className="p-2 text-center">
                      <Spinner />
                    </div>
                  )}
                  <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
                  <CommandGroup>
                    {adminListCategoriesQuery.data?.data.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.title}
                        onSelect={() => handleCategorySelect(category.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            (query.categoriesIds || []).includes(category.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {category.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Link to="/admin/product/create">
            <Button variant="default" disabled={!canCreate("Product")}>
              <Plus />
              Create Product
            </Button>
          </Link>
        </div>
      </div>
      {/* Table */}
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>
                <Checkbox
                  className="ml-2 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  checked={isSelectedAllProduct}
                  onCheckedChange={(checked) => {
                    if (checked && products) {
                      setSelectedProducts(
                        (products as AdminProductResponseDto[]).map((p) => p.id)
                      );
                    } else {
                      setSelectedProducts([]);
                    }
                    setIsSelectedAllProduct(!!checked);
                  }}
                />
              </TableHead>
              <TableHead>
                <div>No.</div>
              </TableHead>
              {tableHeaderTitles.map((value, index) => (
                <TableHead key={index} className="py-5">
                  <div
                    className={cn(
                      "flex items-center",
                      value.sortable ? "cursor-pointer" : ""
                    )}
                    onClick={() =>
                      value.sortable &&
                      handleSort(
                        value.key as
                          | "name"
                          | "description"
                          | "status"
                          | "createdAt"
                          | "updatedAt"
                      )
                    }
                  >
                    {value.title}{" "}
                    {value.sortable && (
                      <span className="ml-1">
                        <ArrowUpDown className="scale-[60%]" />
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminListProductQuery.isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-4 ml-2" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-12 w-12 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (adminListProductQuery.data?.data ?? []).length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tableHeaderTitles.length + 2}
                  className="h-48 text-center text-lg"
                >
                  Không tìm thấy sản phẩm nào.
                </TableCell>
              </TableRow>
            ) : (
              (adminListProductQuery.data?.data ?? []).map((product, index) => (
                <TableRow
                  key={product.id}
                  className={`${index % 2 ? "bg-muted" : ""}`}
                >
                  <TableCell className="py-3">
                    <Checkbox
                      className="ml-2 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          const updated = [...selectedProducts, product.id];
                          setSelectedProducts(updated);
                          if (
                            updated.length ===
                            (products as AdminProductResponseDto[]).length
                          ) {
                            setIsSelectedAllProduct(true);
                          }
                        } else {
                          const updated = selectedProducts.filter(
                            (value) => value !== product.id
                          );
                          setSelectedProducts(updated);
                          setIsSelectedAllProduct(false);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {index + 1 + ((query.page ?? 1) - 1) * query.pageSize}
                  </TableCell>

                  {tableHeaderTitles.map((tableHeaderTitle) => {
                    if (tableHeaderTitle.key === "action") {
                      return (
                        tableHeaderTitle.render as (
                          product: AdminProductResponseDto
                        ) => React.ReactNode
                      )(product);
                    }

                    return tableHeaderTitle.render(
                      product[
                        tableHeaderTitle.key as keyof typeof product
                      ] as any
                    );
                  })}
                </TableRow>
              ))
            )}
            {(products as AdminProductResponseDto[]).length > 0 &&
              (products as AdminProductResponseDto[]).length < query.pageSize &&
              Array.from({
                length:
                  query.pageSize -
                  (products as AdminProductResponseDto[]).length,
              }).map((_, index) => (
                <TableRow key={`empty-${index}`} className="border-none">
                  <TableCell colSpan={tableHeaderTitles.length + 2}>
                    &nbsp;
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <div className="w-full py-3 flex justify-between items-center px-5">
          <div className="text-sm text-muted-foreground">
            Tổng: <b>{adminListProductQuery.data?.paginate.totalItem ?? 0}</b>{" "}
            sản phẩm
          </div>

          <PaginationControl
            currentPage={adminListProductQuery.data?.paginate.page ?? 1}
            totalPage={adminListProductQuery.data?.paginate.totalPage ?? 1}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </div>
  );
};

export default AdminProduct;
