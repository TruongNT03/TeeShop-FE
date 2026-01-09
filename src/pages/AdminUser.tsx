import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PaginationControl } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Search, Plus, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { convertDateTime } from "@/utils/convertDateTime";
import type { UserResponseDto } from "@/api";
import { useAdminUsers, useCreateAdminUser } from "@/queries/adminUserQueries";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminLocations } from "@/queries/adminLocationQueries";
import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePermissions } from "@/contexts/PermissionsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export enum AdminUserSortField {
  EMAIL = "email",
  CREATED_AT = "createdAt",
}

export enum SortOrder {
  DESC = "DESC",
  ASC = "ASC",
}

type AdminUserQuery = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: "email" | "createdAt";
  sortOrder?: "ASC" | "DESC";
  roleType?: "user" | "admin";
};

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  name: z.string().min(1, "Tên là bắt buộc"),
  phoneNumber: z.string().min(1, "Số điện thoại là bắt buộc"),
  gender: z.enum(["male", "female", "other"]),
  roles: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một vai trò"),
  locationId: z.string().min(1, "Vui lòng chọn địa điểm"),
});

type FormValues = z.infer<typeof formSchema>;

const AdminUser = () => {
  const [activeTab, setActiveTab] = useState<"users" | "admins">("users");
  const [query, setQuery] = useState<AdminUserQuery>({
    page: 1,
    pageSize: 10,
    search: "",
    sortBy: "createdAt",
    sortOrder: "DESC",
    roleType: "user",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useAdminUsers(
    query.pageSize,
    query.page,
    query.search,
    query.sortBy,
    query.sortOrder,
    query.roleType
  );

  const users = data?.data.data || [];

  const pagination = data?.data.paginate || {
    page: 1,
    pageSize: 10,
    totalItem: 0,
    totalPage: 1,
  };

  // Create Admin Logic
  const createMutation = useCreateAdminUser(() => {
    setIsOpen(false);
    form.reset();
  });
  const { data: locationsData, isLoading: isLoadingLocations } =
    useAdminLocations(100, 1, "");
  const locations = locationsData?.data.data || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      phoneNumber: "",
      gender: "male",
      roles: ["Product Manager"],
      locationId: "",
    },
  });

  const { canCreate, canDelete, canRead, canUpdate } = usePermissions();

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data as any);
  };

  // Debug: Log user data to check structure
  useEffect(() => {
    if (users.length > 0) {
      console.log("First user data:", users[0]);
      console.log("User keys:", Object.keys(users[0]));
    }
  }, [users]);

  useEffect(() => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      search: debouncedSearchTerm,
      page: 1,
    }));
  }, [debouncedSearchTerm]);

  const handleSort = (field: AdminUserSortField) => {
    const isCurrentSort = query.sortBy === field;
    setQuery((prevQuery) => ({
      ...prevQuery,
      sortBy: field,
      sortOrder:
        isCurrentSort && prevQuery.sortOrder === "DESC" ? "ASC" : "DESC",
    }));
  };

  const getGenderBadge = (gender: string) => {
    const colors = {
      male: "border-blue-500 text-blue-500",
      female: "border-pink-500 text-pink-500",
      other: "border-gray-500 text-gray-500",
    };

    return (
      <Badge
        variant="outline"
        className={colors[gender as keyof typeof colors] || colors.other}
      >
        {gender === "male" ? "Nam" : gender === "female" ? "Nữ" : "Khác"}
      </Badge>
    );
  };

  const getRoleBadges = (roles: string[]) => {
    const roleTranslations: { [key: string]: string } = {
      admin: "Admin",
      "Product Manager": "Quản lý Sản phẩm",
      "Order Manager": "Quản lý Đơn hàng",
      Technician: "Kỹ thuật viên",
      user: "Người dùng",
    };

    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role, index) => (
          <Badge
            key={index}
            variant="outline"
            className={
              role === "admin"
                ? "border-purple-500 text-purple-500"
                : "border-green-500 text-green-500"
            }
          >
            {roleTranslations[role] || role}
          </Badge>
        ))}
      </div>
    );
  };

  const tableHeaderTitles = [
    {
      key: "name",
      title: "Tên",
      sortable: false,
      render: (value: string): React.ReactNode => (
        <TableCell className="font-medium">{value || "Chưa cập nhật"}</TableCell>
      ),
    },
    {
      key: "email",
      title: "Email",
      sortable: true,
      render: (value: string): React.ReactNode => (
        <TableCell>{value}</TableCell>
      ),
    },
    {
      key: "phoneNumber",
      title: "Số điện thoại",
      sortable: false,
      render: (value: string): React.ReactNode => (
        <TableCell>{value || "Chưa cập nhật"}</TableCell>
      ),
    },
    {
      key: "gender",
      title: "Giới tính",
      sortable: false,
      render: (value: string): React.ReactNode => (
        <TableCell>{getGenderBadge(value)}</TableCell>
      ),
    },
    {
      key: "roles",
      title: "Vai trò",
      sortable: false,
      render: (value: string[]): React.ReactNode => (
        <TableCell>{getRoleBadges(value)}</TableCell>
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      sortable: true,
      render: (value: string): React.ReactNode => (
        <TableCell>{convertDateTime(value)}</TableCell>
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

  // Reset selected users and update roleType when changing tabs
  useEffect(() => {
    setSelectedUsers([]);
    setIsSelectedAll(false);
    setQuery((prevQuery) => ({
      ...prevQuery,
      roleType: activeTab === "admins" ? "admin" : "user",
      page: 1,
    }));
  }, [activeTab]);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-medium uppercase">Quản lý Người dùng</h1>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="users"
        onValueChange={(value) => setActiveTab(value as "users" | "admins")}
      >
        <TabsList>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="admins">Quản trị viên</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Search for Users */}
          <div className="flex justify-between">
            <div className="flex gap-5">
              <div className="relative">
                <Input
                  className="w-[400px] py-0 pl-10"
                  type="search"
                  placeholder="Tìm theo email hoặc tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="scale-75 absolute top-[18%] left-2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Table for Users */}
          <UserTable
            users={users}
            isLoading={isLoading}
            query={query}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            isSelectedAll={isSelectedAll}
            setIsSelectedAll={setIsSelectedAll}
            handleSort={handleSort}
            tableHeaderTitles={tableHeaderTitles}
            pagination={pagination}
            handlePageChange={handlePageChange}
          />
        </TabsContent>

        <TabsContent value="admins" className="space-y-6">
          {/* Search for Admins */}
          <div className="flex justify-between">
            <div className="flex gap-5">
              <div className="relative">
                <Input
                  className="w-[400px] py-0 pl-10"
                  type="search"
                  placeholder="Tìm theo email hoặc tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="scale-75 absolute top-[18%] left-2 text-slate-400" />
              </div>
            </div>

            <div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" disabled={!canCreate("User")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Tạo Tài Khoản Admin</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 py-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Tên hiển thị</Label>
                        <Input
                          id="name"
                          placeholder="Nhập tên hiển thị"
                          {...form.register("name")}
                        />
                        {form.formState.errors.name && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Nhập email"
                          {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Số điện thoại</Label>
                        <Input
                          id="phoneNumber"
                          placeholder="Nhập số điện thoại"
                          {...form.register("phoneNumber")}
                        />
                        {form.formState.errors.phoneNumber && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.phoneNumber.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Giới tính</Label>
                        <Select
                          onValueChange={(value) =>
                            form.setValue("gender", value as any)
                          }
                          defaultValue={form.getValues("gender")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Nam</SelectItem>
                            <SelectItem value="female">Nữ</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.gender && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.gender.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Địa điểm làm việc</Label>
                        <Select
                          onValueChange={(value) =>
                            form.setValue("locationId", value)
                          }
                          disabled={isLoadingLocations}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoadingLocations
                                  ? "Đang tải..."
                                  : "Chọn địa điểm"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.address}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.formState.errors.locationId && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.locationId.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Vai trò</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                              type="button"
                            >
                              {form.watch("roles")?.length > 0
                                ? (() => {
                                    const roles = form.watch("roles");
                                    const displayRole = roles[0];
                                    const remaining = roles.length - 1;
                                    return remaining > 0
                                      ? `${displayRole} +${remaining}`
                                      : displayRole;
                                  })()
                                : "Chọn vai trò"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <div className="p-2 space-y-2">
                              {[
                                "Quản lý Sản phẩm",
                                "Quản lý Đơn hàng",
                                "Kỹ thuật viên",
                              ].map((role) => (
                                <div
                                  key={role}
                                  className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                                  onClick={() => {
                                    const currentRoles =
                                      form.watch("roles") || [];
                                    if (currentRoles.includes(role)) {
                                      form.setValue(
                                        "roles",
                                        currentRoles.filter((r) => r !== role)
                                      );
                                    } else {
                                      form.setValue("roles", [
                                        ...currentRoles,
                                        role,
                                      ]);
                                    }
                                  }}
                                >
                                  <Checkbox
                                    checked={form
                                      .watch("roles")
                                      ?.includes(role)}
                                    onCheckedChange={() => {}}
                                  />
                                  <label className="text-sm font-medium leading-none cursor-pointer flex-1">
                                    {role}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        {form.formState.errors.roles && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.roles.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending && (
                          <Spinner className="mr-2" />
                        )}
                        Tạo tài khoản
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Table for Admins */}
          <UserTable
            users={users}
            isLoading={isLoading}
            query={query}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            isSelectedAll={isSelectedAll}
            setIsSelectedAll={setIsSelectedAll}
            handleSort={handleSort}
            tableHeaderTitles={tableHeaderTitles}
            pagination={pagination}
            handlePageChange={handlePageChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// UserTable Component
type UserTableProps = {
  users: UserResponseDto[];
  isLoading: boolean;
  query: AdminUserQuery;
  selectedUsers: string[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
  isSelectedAll: boolean;
  setIsSelectedAll: React.Dispatch<React.SetStateAction<boolean>>;
  handleSort: (field: AdminUserSortField) => void;
  tableHeaderTitles: any[];
  pagination: any;
  handlePageChange: (newPage: number) => void;
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  query,
  selectedUsers,
  setSelectedUsers,
  isSelectedAll,
  setIsSelectedAll,
  handleSort,
  tableHeaderTitles,
  pagination,
  handlePageChange,
}) => {
  return (
    <Card className="py-0 overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>
              <Checkbox
                className="ml-2 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                checked={isSelectedAll}
                onCheckedChange={(checked) => {
                  if (checked && users) {
                    setSelectedUsers(users.map((u) => u.id));
                  } else {
                    setSelectedUsers([]);
                  }
                  setIsSelectedAll(!!checked);
                }}
              />
            </TableHead>
            <TableHead>
              <div>STT</div>
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
                    handleSort(value.key as AdminUserSortField)
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
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              </TableRow>
            ))
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={tableHeaderTitles.length + 2}
                className="h-48 text-center text-lg"
              >
                Không tìm thấy người dùng nào.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => (
              <TableRow
                key={user.id}
                className={`${index % 2 ? "bg-muted" : ""}`}
              >
                <TableCell className="py-3">
                  <Checkbox
                    className="ml-2 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const updated = [...selectedUsers, user.id];
                        setSelectedUsers(updated);
                        if (updated.length === users.length) {
                          setIsSelectedAll(true);
                        }
                      } else {
                        const updated = selectedUsers.filter(
                          (value) => value !== user.id
                        );
                        setSelectedUsers(updated);
                        setIsSelectedAll(false);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  {index + 1 + (query.page - 1) * query.pageSize}
                </TableCell>

                {tableHeaderTitles.map((tableHeaderTitle, idx) => {
                  const value = user[
                    tableHeaderTitle.key as keyof UserResponseDto
                  ] as string & string[];

                  return (
                    <React.Fragment key={idx}>
                      {tableHeaderTitle.render(value)}
                    </React.Fragment>
                  );
                })}
              </TableRow>
            ))
          )}
          {users.length > 0 &&
            users.length < query.pageSize &&
            Array.from({ length: query.pageSize - users.length }).map(
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
          Tổng: <b>{users.length}</b> người dùng
        </div>

        <PaginationControl
          currentPage={pagination.page}
          totalPage={pagination.totalPage}
          onPageChange={handlePageChange}
        />
      </div>
    </Card>
  );
};

export default AdminUser;
