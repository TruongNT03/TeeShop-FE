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
import { ArrowUpDown, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { convertDateTime } from "@/utils/convertDateTime";
import { Link } from "react-router-dom";
import type { apiClient } from "@/services/apiClient";
import type { CategoryResponseDto } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllCategoryQuery } from "@/queries/adminProductQueries";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

export enum ListCategorySortField {
  TITLE = "title",
  CREATED_AT = "createdAt",
}

export enum SortOrder {
  DESC = "DESC",
  ASC = "ASC",
}

type AdminCategoryQuery = Omit<
  Parameters<typeof apiClient.api.adminCategoriesControllerFindAll>[0],
  "orderBy"
> & {
  orderBy?: SortOrder;
};

const AdminCategory = () => {
  const [query, setQuery] = useState<AdminCategoryQuery>({
    page: 1,
    pageSize: 10,
    search: "",
    sortBy: "createdAt",
    orderBy: SortOrder.DESC,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false);

  const { data: categoriesData, isLoading } = getAllCategoryQuery(query as any);
  const categories = categoriesData?.data.data || [];
  const pagination = categoriesData?.data.paginate || {
    page: 1,
    pageSize: 10,
    totalItem: 0,
    totalPage: 1,
  };

  useEffect(() => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      search: debouncedSearchTerm,
      page: 1,
    }));
  }, [debouncedSearchTerm]);

  const handleSort = (field: ListCategorySortField) => {
    const isCurrentSort = query.sortBy === field;
    setQuery((prevQuery) => ({
      ...prevQuery,
      sortBy: field,
      orderBy:
        isCurrentSort && prevQuery.orderBy === SortOrder.DESC
          ? SortOrder.ASC
          : SortOrder.DESC,
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPage) return;
    setQuery((prevQuery) => ({
      ...prevQuery,
      page: newPage,
    }));
  };

  const tableHeaderTitles = [
    {
      key: "image",
      title: "Image",
      sortable: false,
      widthClass: "w-[50px]",
      render: (value: string): React.ReactNode => (
        <TableCell className="w-[50px]">
          <img
            src={value}
            alt="category"
            className="w-12 h-12 object-cover rounded-md border"
          />
        </TableCell>
      ),
    },
    {
      key: "title",
      title: "Title",
      sortable: true,
      widthClass: "w-[300px]",
      render: (value: string): React.ReactNode => (
        <TableCell className="w-[300px] font-medium">{value}</TableCell>
      ),
    },
    {
      key: "description",
      title: "Description",
      sortable: false,
      widthClass: "w-auto",
      render: (value: string): React.ReactNode => (
        <TableCell className="max-w-xs truncate">{value}</TableCell>
      ),
    },
    {
      key: "createdAt",
      title: "Created At",
      sortable: true,
      widthClass: "w-auto whitespace-nowrap",
      render: (value: string): React.ReactNode => (
        <TableCell className="w-auto whitespace-nowrap">
          {convertDateTime(value)}
        </TableCell>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-medium uppercase">Category Master</h1>
      </div>

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
        </div>

        <div>
          <Link to="/admin/category/create">
            <Button variant="default">
              <Plus />
              Create Category
            </Button>
          </Link>
        </div>
      </div>
      {/* Table */}
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="px-5">
                <Checkbox
                  className=""
                  checked={isSelectedAll}
                  onCheckedChange={(checked) => {
                    if (checked && categories) {
                      setSelectedItems(
                        categories.map((c: CategoryResponseDto) => c.id)
                      );
                    } else {
                      setSelectedItems([]);
                    }
                    setIsSelectedAll(!!checked);
                  }}
                />
              </TableHead>
              <TableHead className="w-[60px]">
                <div>No.</div>
              </TableHead>
              {tableHeaderTitles.map((value, index) => (
                <TableHead key={index} className={cn("py-5", value.widthClass)}>
                  <div
                    className={cn(
                      "flex items-center",
                      value.sortable ? "cursor-pointer" : ""
                    )}
                    onClick={() =>
                      value.sortable &&
                      handleSort(value.key as ListCategorySortField)
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
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-4 ml-2" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
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
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tableHeaderTitles.length + 2}
                  className="h-48 text-center text-lg"
                >
                  Không tìm thấy danh mục nào.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category: CategoryResponseDto, index: number) => (
                <TableRow
                  key={category.id}
                  className={`${index % 2 ? "bg-muted" : ""}`}
                >
                  <TableCell className="px-5 py-3">
                    <Checkbox
                      className=""
                      checked={selectedItems.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          const updated = [...selectedItems, category.id];
                          setSelectedItems(updated);
                          if (updated.length === categories.length) {
                            setIsSelectedAll(true);
                          }
                        } else {
                          const updated = selectedItems.filter(
                            (value) => value !== category.id
                          );
                          setSelectedItems(updated);
                          setIsSelectedAll(false);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="w-[60px]">
                    {index + 1 + ((query.page ?? 1) - 1) * query.pageSize}
                  </TableCell>

                  {tableHeaderTitles.map((tableHeaderTitle) => {
                    const key =
                      tableHeaderTitle.key as keyof CategoryResponseDto;
                    return tableHeaderTitle.render(category[key] as any);
                  })}
                </TableRow>
              ))
            )}
            {categories.length > 0 &&
              categories.length < query.pageSize &&
              Array.from({ length: query.pageSize - categories.length }).map(
                (_, index) => (
                  <TableRow key={`empty-${index}`} className="border-none h-16">
                    <TableCell colSpan={tableHeaderTitles.length + 2}>
                      &nbsp;
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>

        <div className="w-full py-3 flex justify-between items-center px-5">
          <div className="text-sm text-muted-foreground">
            Tổng: <b>{pagination.totalItem}</b> danh mục
          </div>

          <PaginationControl
            currentPage={pagination.page}
            totalPage={pagination.totalPage}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </div>
  );
};

export default AdminCategory;
