import { Card } from "@/components/ui/card";
import { PaginationControl } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { convertDateTime } from "@/utils/convertDateTime";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useAdminLocations,
  useCreateLocation,
  useUpdateLocation,
} from "@/queries/adminLocationQueries";
import type { AdminLocationResponseDto } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  hotline: z.string().min(1, "Hotline là bắt buộc"),
  openTime: z.string().min(1, "Giờ mở cửa là bắt buộc"),
  closeTime: z.string().min(1, "Giờ đóng cửa là bắt buộc"),
  openDate: z.string().min(1, "Ngày mở cửa là bắt buộc"),
});

type FormValues = z.infer<typeof formSchema>;

const AdminLocation = () => {
  const [query, setQuery] = useState({
    page: 1,
    pageSize: 10,
    search: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<AdminLocationResponseDto | null>(null);

  const { data: locationsData, isLoading } = useAdminLocations(
    query.pageSize,
    query.page,
    query.search
  );

  const locations = locationsData?.data.data || [];
  const pagination = locationsData?.data.paginate || {
    page: 1,
    pageSize: 10,
    totalItem: 0,
    totalPage: 1,
  };

  const createMutation = useCreateLocation(() => {
    setIsOpen(false);
    form.reset();
  });

  const updateMutation = useUpdateLocation(() => {
    setIsOpen(false);
    setSelectedLocation(null);
    form.reset();
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      hotline: "",
      openTime: "",
      closeTime: "",
      openDate: "",
    },
  });

  useEffect(() => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      search: debouncedSearchTerm,
      page: 1,
    }));
  }, [debouncedSearchTerm]);

  // Reset form when modal closes or opens for create
  useEffect(() => {
    if (!isOpen) {
      setSelectedLocation(null);
      form.reset({
        address: "",
        hotline: "",
        openTime: "",
        closeTime: "",
        openDate: "",
      });
    }
  }, [isOpen, form]);

  // Fill form when editing
  useEffect(() => {
    if (selectedLocation) {
      form.reset({
        address: selectedLocation.address,
        hotline: selectedLocation.hotline,
        openTime: selectedLocation.openTime,
        closeTime: selectedLocation.closeTime,
        openDate: selectedLocation.openDate,
      });
    }
  }, [selectedLocation, form]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPage) return;
    setQuery((prevQuery) => ({
      ...prevQuery,
      page: newPage,
    }));
  };

  const onSubmit = (data: FormValues) => {
    if (selectedLocation) {
      updateMutation.mutate({ id: selectedLocation.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (location: AdminLocationResponseDto) => {
    setSelectedLocation(location);
    setIsOpen(true);
  };

  const tableHeaderTitles = [
    {
      title: "Address",
      render: (value: AdminLocationResponseDto) => (
        <TableCell className="font-medium">{value.address}</TableCell>
      ),
    },
    {
      title: "Hotline",
      render: (value: AdminLocationResponseDto) => (
        <TableCell>{value.hotline}</TableCell>
      ),
    },
    {
      title: "Open Time",
      render: (value: AdminLocationResponseDto) => (
        <TableCell>{value.openTime}</TableCell>
      ),
    },
    {
      title: "Close Time",
      render: (value: AdminLocationResponseDto) => (
        <TableCell>{value.closeTime}</TableCell>
      ),
    },
    {
      title: "Open Date",
      render: (value: AdminLocationResponseDto) => (
        <TableCell>{value.openDate}</TableCell>
      ),
    },
    {
      title: "Created At",
      render: (value: AdminLocationResponseDto) => (
        <TableCell>{convertDateTime(value.createdAt)}</TableCell>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-medium uppercase">Location Management</h1>
      </div>

      <div className="flex justify-between">
        <div className="flex">
          <div className="relative mr-5">
            <Input
              className="w-[400px] py-0 pl-10"
              type="search"
              placeholder="Tìm theo địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="scale-75 absolute top-[18%] left-2 text-slate-400" />
          </div>
        </div>

        <div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="mr-2 h-4 w-4" />
                Create Location
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedLocation ? "Cập nhật địa điểm" : "Tạo địa điểm mới"}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 py-4"
              >
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      placeholder="Nhập địa chỉ"
                      {...form.register("address")}
                    />
                    {form.formState.errors.address && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hotline">Hotline</Label>
                    <Input
                      id="hotline"
                      placeholder="Nhập hotline"
                      {...form.register("hotline")}
                    />
                    {form.formState.errors.hotline && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.hotline.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="openTime">Giờ mở cửa</Label>
                      <Input
                        id="openTime"
                        placeholder="VD: 08:00"
                        {...form.register("openTime")}
                      />
                      {form.formState.errors.openTime && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.openTime.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="closeTime">Giờ đóng cửa</Label>
                      <Input
                        id="closeTime"
                        placeholder="VD: 22:00"
                        {...form.register("closeTime")}
                      />
                      {form.formState.errors.closeTime && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.closeTime.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openDate">Ngày mở cửa</Label>
                    <Input
                      id="openDate"
                      placeholder="VD: Thứ 2 - Chủ nhật"
                      {...form.register("openDate")}
                    />
                    {form.formState.errors.openDate && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.openDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <Spinner className="mr-2" />
                    ) : null}
                    {selectedLocation ? "Cập nhật" : "Tạo mới"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Table */}
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[60px] px-8">
                <div>No.</div>
              </TableHead>
              {tableHeaderTitles.map((value, index) => (
                <TableHead key={index} className="py-5">
                  {value.title}
                </TableHead>
              ))}
              <TableHead className="text-right px-8">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-4 ml-2" />
                  </TableCell>
                  {tableHeaderTitles.map((_, idx) => (
                    <TableCell key={idx}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Skeleton className="h-8 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : locations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tableHeaderTitles.length + 2}
                  className="h-48 text-center text-lg"
                >
                  Không tìm thấy địa điểm nào.
                </TableCell>
              </TableRow>
            ) : (
              locations.map(
                (location: AdminLocationResponseDto, index: number) => (
                  <TableRow
                    key={location.id}
                    className={`${index % 2 ? "bg-muted" : ""}`}
                  >
                    <TableCell className="w-[60px] px-8">
                      {index + 1 + ((query.page ?? 1) - 1) * query.pageSize}
                    </TableCell>

                    {tableHeaderTitles.map((tableHeaderTitle, idx) => (
                      <div key={idx} style={{ display: "contents" }}>
                        {tableHeaderTitle.render(location)}
                      </div>
                    ))}

                    <TableCell className="text-right px-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(location)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
            {locations.length > 0 &&
              locations.length < query.pageSize &&
              Array.from({ length: query.pageSize - locations.length }).map(
                (_, index) => (
                  <TableRow key={`empty-${index}`} className="border-none">
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
            Tổng: <b>{pagination.totalItem}</b> địa điểm
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

export default AdminLocation;
