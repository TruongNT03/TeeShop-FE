import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
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
import {
  ArrowUpDown,
  Plus,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { convertDateTime } from "@/utils/convertDateTime";
import type { apiClient } from "@/services/apiClient";
import type { CategoryResponseDto } from "@/api";
import { Spinner } from "@/components/ui/spinner";
import { getAllCategoryQuery } from "@/queries/adminProductQueries";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { AdminCategoryCreateDialog } from "@/components/admin/AdminCategoryCreateDialog";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
      widthClass: "w-[100px]",
      render: (value: string): React.ReactNode => (
        <TableCell className="w-[100px]">
          <img
            src={value}
            alt="category"
            className="w-16 h-16 object-cover rounded-md border"
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
    <div className="w-full overflow-auto py-5">
      <div className="w-[95%] mx-auto font-semibold text-2xl mb-5">
        Category Master
      </div>

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
        </div>

        <div>
          <Button variant="default" onClick={() => setIsCreateOpen(true)}>
            <Plus />
            Create Category
          </Button>
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
                <TableHead
                  key={index}
                  className={cn("py-5", value.widthClass)}
                >
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
              <TableRow>
                <TableCell
                  colSpan={tableHeaderTitles.length + 2}
                  className="h-48 text-center"
                >
                  <Spinner className="w-10 h-10" />
                </TableCell>
              </TableRow>
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
                  <TableCell className="py-5">
                    <Checkbox
                      className="ml-2 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
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

      <AdminCategoryCreateDialog 
        open={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />
    </div>
  );
};

export default AdminCategory;