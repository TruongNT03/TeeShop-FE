import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Loader2, Edit, Save, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetRolePermissions,
  useUpdateRolePermissions,
} from "../queries/adminRoleQueries";
import { PaginationControl } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const ROLES = [
  "Admin",
  "User",
  "Product Manager",
  "Order Manager",
  "Technician",
] as const;

const MODULES = [
  "Product",
  "User",
  "Category",
  "Order",
  "Voucher",
  "Chatbot",
  "Location",
] as const;

const AdminRolePermission = () => {
  const [query, setQuery] = useState({
    page: 1,
    pageSize: 10,
    role: undefined as (typeof ROLES)[number] | undefined,
    module: undefined as (typeof MODULES)[number] | undefined,
  });

  const queryClient = useQueryClient();

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPermissions, setEditedPermissions] = useState<
    Record<
      string,
      {
        isCreate: boolean;
        isRead: boolean;
        isUpdate: boolean;
        isDelete: boolean;
      }
    >
  >({});

  const { data, isLoading } = useGetRolePermissions(query);
  const updateMutation = useUpdateRolePermissions();

  const permissions = data?.data || [];
  const pagination = {
    totalItem: data?.paginate?.totalItem || 0,
    totalPage: data?.paginate?.totalPage || 1,
    currentPage: query.page,
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPage) return;
    setQuery((prev) => ({ ...prev, page: newPage }));
  };

  const handleRoleChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      role: value === "all" ? undefined : (value as (typeof ROLES)[number]),
      page: 1,
    }));
  };

  const handleModuleChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      module: value === "all" ? undefined : (value as (typeof MODULES)[number]),
      page: 1,
    }));
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    // Initialize edited permissions with current state
    const initialState: Record<
      string,
      {
        isCreate: boolean;
        isRead: boolean;
        isUpdate: boolean;
        isDelete: boolean;
      }
    > = {};

    permissions.forEach((p) => {
      initialState[p.id] = {
        isCreate: p.isCreate,
        isRead: p.isRead,
        isUpdate: p.isUpdate,
        isDelete: p.isDelete,
      };
    });

    setEditedPermissions(initialState);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedPermissions({});
  };

  const handleSave = async () => {
    try {
      // Convert editedPermissions to UpdateRolePermissionDto[] format
      const permissionsToUpdate = Object.entries(editedPermissions).map(
        ([id, perms]) => ({
          id,
          isCreate: perms.isCreate,
          isRead: perms.isRead,
          isUpdate: perms.isUpdate,
          isDelete: perms.isDelete,
        })
      );

      await updateMutation.mutateAsync(permissionsToUpdate);
      await queryClient.invalidateQueries({ queryKey: ["userPermissions"] });
      toast.success("Permissions updated successfully!");
      setIsEditMode(false);
      setEditedPermissions({});
    } catch (error) {
      toast.error("Failed to update permissions");
    }
  };

  const togglePermissionField = (
    permissionId: string,
    field: "isCreate" | "isRead" | "isUpdate" | "isDelete"
  ) => {
    setEditedPermissions((prev) => ({
      ...prev,
      [permissionId]: {
        ...prev[permissionId],
        [field]: !prev[permissionId]?.[field],
      },
    }));
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium uppercase">
            Role & Permission Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage permissions for each role and module.
          </p>
        </div>

        <div className="flex gap-2">
          {!isEditMode ? (
            <Button onClick={handleEditClick} variant="default">
              <Edit className="h-4 w-4 mr-2" />
              Edit Permissions
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSave}
                variant="default"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
              <Button onClick={handleCancelEdit} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <Tabs
          defaultValue="all"
          value={query.role || "all"}
          onValueChange={handleRoleChange}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="all">All Roles</TabsTrigger>
            {ROLES.map((role) => (
              <TabsTrigger key={role} value={role}>
                {role}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs
          defaultValue="all"
          value={query.module || "all"}
          onValueChange={handleModuleChange}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="all">All Modules</TabsTrigger>
            {MODULES.map((module) => (
              <TabsTrigger key={module} value={module}>
                {module}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="pl-8 py-5">Role</TableHead>
              <TableHead className="py-5">Module</TableHead>
              <TableHead className="py-5 text-center">Create</TableHead>
              <TableHead className="py-5 text-center">Read</TableHead>
              <TableHead className="py-5 text-center">Update</TableHead>
              <TableHead className="py-5 text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-8">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-6 w-6 rounded-full mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-6 w-6 rounded-full mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-6 w-6 rounded-full mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-6 w-6 rounded-full mx-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : permissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-lg">
                  No permissions found.
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((permission, index) => (
                <TableRow
                  key={permission.id}
                  className={`${index % 2 ? "bg-muted" : ""}`}
                >
                  <TableCell className="pl-8 py-3 font-medium">
                    {permission.role.name}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline">{permission.module}</Badge>
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={
                          isEditMode
                            ? editedPermissions[permission.id]?.isCreate ??
                              permission.isCreate
                            : permission.isCreate
                        }
                        disabled={!isEditMode}
                        onCheckedChange={() =>
                          isEditMode &&
                          togglePermissionField(permission.id, "isCreate")
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={
                          isEditMode
                            ? editedPermissions[permission.id]?.isRead ??
                              permission.isRead
                            : permission.isRead
                        }
                        disabled={!isEditMode}
                        onCheckedChange={() =>
                          isEditMode &&
                          togglePermissionField(permission.id, "isRead")
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={
                          isEditMode
                            ? editedPermissions[permission.id]?.isUpdate ??
                              permission.isUpdate
                            : permission.isUpdate
                        }
                        disabled={!isEditMode}
                        onCheckedChange={() =>
                          isEditMode &&
                          togglePermissionField(permission.id, "isUpdate")
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={
                          isEditMode
                            ? editedPermissions[permission.id]?.isDelete ??
                              permission.isDelete
                            : permission.isDelete
                        }
                        disabled={!isEditMode}
                        onCheckedChange={() =>
                          isEditMode &&
                          togglePermissionField(permission.id, "isDelete")
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            {permissions.length > 0 &&
              permissions.length < query.pageSize &&
              Array.from({ length: query.pageSize - permissions.length }).map(
                (_, index) => (
                  <TableRow key={`empty-${index}`} className="border-none">
                    <TableCell colSpan={6}>&nbsp;</TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>

        <div className="w-full py-3 flex justify-between items-center px-5">
          <div className="text-sm text-muted-foreground">
            Total: <b>{pagination.totalItem}</b> permissions
          </div>

          <PaginationControl
            currentPage={pagination.currentPage}
            totalPage={pagination.totalPage}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </div>
  );
};

export default AdminRolePermission;
