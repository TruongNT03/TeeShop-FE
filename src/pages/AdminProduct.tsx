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
import type { ProductResponseDto, CategoryResponseDto } from "@/api";
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

export enum AdminProductSortField {
  NAME = "name",
  DESCRIPTION = "description",
  STATUS = "status",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

export enum SortOrder {
  DESC = "DESC",
  ASC = "ASC",
}

type AdminProductQuery = Omit<
  Parameters<typeof apiClient.api.adminProductControllerFindAll>[0],
  "categoriesIds"
> & {
  categoriesIds?: number[];
};

const AdminProduct = () => {
  const [query, setQuery] = useState<AdminProductQuery>({
    page: 1,
    pageSize: 10,
    categoriesIds: [], 
    search: "",
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

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

  const [categorySearch, setCategorySearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: categoriesData, isLoading: categoriesLoading } =
    getAllCategoryQuery({ pageSize: 100, search: categorySearch });
  const categories = categoriesData?.data.data || [];

  useEffect(() => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      search: debouncedSearchTerm,
      page: 1,
    }));
  }, [debouncedSearchTerm]);

  const handleSort = (field: AdminProductSortField) => {
    const isCurrentSort = query.sortBy === field;
    setQuery((prevQuery) => ({
      ...prevQuery,
      sortBy: field,
      sortOrder:
        isCurrentSort && prevQuery.sortOrder === "DESC" ? "ASC" : "DESC",
    }));
  };

  const handleCategorySelect = (categoryId: number) => {
    setQuery((prevQuery) => {
      const currentIds = prevQuery.categoriesIds || [];
      const newIds = currentIds.includes(categoryId)
        ? currentIds.filter((id) => id !== categoryId)
        : [...currentIds, categoryId];

      return { ...prevQuery, categoriesIds: newIds, page: 1 };
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
      render: (product: ProductResponseDto): React.ReactNode => (
        <TableCell>
          <div className="flex gap-2">
            <Link to={`/admin/product/edit/${product.id}`}>
              <SquarePen className="scale-75 text-primary cursor-pointer" />
            </Link>
            {product.status === "published" ? (
              <Archive
                className={`scale-75 text-destructive cursor-pointer ${
                  statusMutation.isPending
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
                onClick={() =>
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

  const renderPaginationItems = () => {
    const { currentPage, totalPage } = pagination;
    const items = [];

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPage, currentPage + 1);
    if (currentPage === 1 && totalPage > 1) {
      endPage = Math.min(totalPage, 3);
    }
    if (currentPage === totalPage && totalPage > 1) {
      startPage = Math.max(1, totalPage - 2);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPage) {
      if (endPage < totalPage - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPage}>
          <PaginationLink
            onClick={() => handlePageChange(totalPage)}
            className="cursor-pointer"
          >
            {totalPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="w-full overflow-auto py-5">
      <div className="w-[95%] mx-auto font-semibold text-2xl mb-5">
        Product Master
      </div>
      {/* Total */}
      <div className="w-[95%] flex justify-between mx-auto gap-8 mb-10">
        <Card className="flex-1"></Card>
        <Card className="flex-1"></Card>
        <Card className="flex-1"></Card>
        <Card className="flex-1"></Card>
      </div>
      {/* Search and Filter */}
      <div className="w-[95%] mx-auto mb-5 flex justify-between">
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
                  {categoriesLoading && (
                    <div className="p-2 text-center">
                      <Spinner />
                    </div>
                  )}
                  <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category: CategoryResponseDto) => (
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
            <Button variant="default">
              <Plus />
              Create Product
            </Button>
          </Link>
        </div>
      </div>
      {/* Table */}
      <Card className="w-[95%] mx-auto py-0 overflow-hidden">
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
                        (products as ProductResponseDto[]).map((p) => p.id)
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
                      handleSort(value.key as AdminProductSortField)
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={tableHeaderTitles.length + 2}
                  className="h-48 text-center"
                >
                  <Spinner className="w-10 h-10" />
                </TableCell>
              </TableRow>
            ) : (products as ProductResponseDto[]).length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tableHeaderTitles.length + 2}
                  className="h-48 text-center text-lg"
                >
                  Không tìm thấy sản phẩm nào.
                </TableCell>
              </TableRow>
            ) : (
              (products as ProductResponseDto[]).map((product, index) => (
                <TableRow
                  key={product.id}
                  className={`${index % 2 ? "bg-muted" : ""}`}
                >
                  <TableCell className="py-5">
                    <Checkbox
                      className="ml-2 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          const updated = [...selectedProducts, product.id];
                          setSelectedProducts(updated);
                          if (
                            updated.length ===
                            (products as ProductResponseDto[]).length
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
                          product: ProductResponseDto
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
          </TableBody>
        </Table>

        <div className="w-full py-3 flex justify-between items-center px-5">
          <div className="text-sm text-muted-foreground">
            Tổng: <b>{pagination.totalItem}</b> sản phẩm
          </div>
          <Pagination className="w-fit m-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  className={
                    pagination.currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  className={
                    pagination.currentPage === pagination.totalPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
};

export default AdminProduct;