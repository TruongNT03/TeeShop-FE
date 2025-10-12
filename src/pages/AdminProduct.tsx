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
  Search,
  SquarePen,
} from "lucide-react";
import { type ProductStatus } from "@/types/productStatus";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const tableHeaderTitles = [
  {
    key: "id",
    title: "ID",
    sortable: true,
  },
  {
    key: "name",
    title: "Name",
    sortable: true,
  },
  {
    key: "description",
    title: "Description",
    sortable: true,
  },
  {
    key: "status",
    title: "Status",
    sortable: true,
  },
  {
    key: "categories",
    title: "Categories",
    sortable: false,
  },
  {
    key: "createdAt",
    title: "Created At",
    sortable: true,
  },
  {
    key: "updatedAt",
    title: "Updated At",
    sortable: true,
  },
  {
    key: "action",
    title: "Action",
    sortable: false,
  },
];

const AdminProduct = () => {
  const { products } = useAdminProduct();
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
      <div className="w-[95%] mx-auto mb-5 flex">
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

      {/* Table */}
      <Card className="w-[95%] mx-auto py-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-indigo-300">
            <TableRow>
              <TableHead>
                <Checkbox className="ml-2" />
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
            {products.map((product, index) => (
              <TableRow
                key={index}
                className={`${index % 2 ? "bg-gray-200" : ""}`}
              >
                <TableCell className="py-5">
                  <Checkbox className="ml-2" />
                </TableCell>
                {tableHeaderTitles.map((tableHeaderTitle) =>
                  tableHeaderTitle.key === "action" ? (
                    <TableCell>
                      <div className="flex gap-2">
                        <SquarePen className="scale-75 text-blue-400 cursor-pointer" />
                        {(product.status as ProductStatus) === "published" ? (
                          <Archive className="scale-75 text-red-500 cursor-pointer" />
                        ) : (
                          <ArchiveRestore className="scale-75 text-emerald-500 cursor-pointer" />
                        )}
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell>
                      {
                        product[
                          tableHeaderTitle.key as keyof typeof product
                        ] as string
                      }
                    </TableCell>
                  )
                )}
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
