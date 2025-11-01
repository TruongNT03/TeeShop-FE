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
  TableFooter,
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { convertDateTime } from "@/utils/convertDateTime";
import { Link } from "react-router-dom";
import type { apiClient } from "@/services/apiClient";
import { ProductStatus } from "@/types/productStatus";

const tableHeaderTitles = [
  // {
  //   key: "id",
  //   title: "ID",
  //   sortable: true,
  // },
  {
    key: "name",
    title: "Name",
    sortable: true,
    render: (value: string): React.ReactNode => <TableCell>{value}</TableCell>,
  },
  {
    key: "description",
    title: "Description",
    sortable: true,
    render: (value: string): React.ReactNode => (
      <TableCell className="max-w-[200px] overflow-hidden truncate">
        {value}
      </TableCell>
    ),
  },
  {
    key: "status",
    title: "Status",
    sortable: true,
    render: (value: ProductStatus): React.ReactNode => (
      <TableCell>
        {value === ProductStatus.PUBLISHED ? (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Published
          </Badge>
        ) : (
          <Badge
            variant="destructive"
            className="border-red-500 bg-transparent text-red-500"
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
                <Badge className="border-blue-500 bg-transparent text-blue-500">
                  {category}
                </Badge>
              )
          )}
          {value.length > 2 && (
            <Badge className="border-blue-500 bg-transparent text-blue-500 px-7">
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
    render: (value: ProductStatus): React.ReactNode => (
      <TableCell>
        <div className="flex gap-2">
          <SquarePen className="scale-75 text-blue-400 cursor-pointer" />
          {value === "published" ? (
            <Archive className="scale-75 text-red-500 cursor-pointer" />
          ) : (
            <ArchiveRestore className="scale-75 text-emerald-500 cursor-pointer" />
          )}
        </div>
      </TableCell>
    ),
  },
];

const AdminProduct = () => {
  const [query, setQuery] = useState<
    Parameters<typeof apiClient.api.adminProductControllerFindAll>[0]
  >({
    page: 1,
    pageSize: 10,
    categoriesIds: [],
  });
  const {
    products,
    isSelectedAllProduct,
    selectedProducts,
    setIsSelectedAllProduct,
    setSelectedProducts,
  } = useAdminProduct(query);
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
              placeholder="Search product"
            />
            <Search className="scale-75 absolute top-[18%] left-2 text-slate-400" />
          </div>
          <Button variant="outline">
            <ListFilter />
            Filter
          </Button>
        </div>
        <div>
          <Link to="/admin/product/create">
            <Button variant="outline" className="bg-blue-600 text-white">
              <Plus />
              Create Product
            </Button>
          </Link>
        </div>
      </div>
      {/* Table */}
      <Card className="w-[95%] mx-auto py-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-indigo-300">
            <TableRow>
              <TableHead>
                <Checkbox
                  className="ml-2 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  checked={isSelectedAllProduct}
                  onCheckedChange={(checked) => {
                    if (checked && products) {
                      setSelectedProducts(products.map((p) => p.id));
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
                  <div className="flex items-center">
                    {value.title}{" "}
                    {value.sortable && (
                      <span>
                        <ArrowUpDown className="scale-[60%] cursor-pointer" />
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product, index) => (
              <TableRow
                key={index}
                className={`${index % 2 ? "bg-gray-200" : ""}`}
              >
                <TableCell className="py-5">
                  <Checkbox
                    className="ml-2 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const updated = [...selectedProducts, product.id];
                        setSelectedProducts(updated);
                        if (updated.length === products.length) {
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
                <TableCell>{index + 1}</TableCell>
                {tableHeaderTitles.map((tableHeaderTitle) => {
                  if (tableHeaderTitle.key !== "action") {
                    return tableHeaderTitle.render(
                      product[
                        tableHeaderTitle.key as keyof typeof product
                      ] as ProductStatus & string[]
                    );
                  }
                })}
                <TableCell>
                  {tableHeaderTitles[tableHeaderTitles.length - 1].render(
                    product.status as ProductStatus & string[]
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="w-full py-3 flex justify-end">
          <Pagination className="w-fit m-0 mr-5">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
};

export default AdminProduct;
