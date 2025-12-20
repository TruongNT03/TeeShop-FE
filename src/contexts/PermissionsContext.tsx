import type { AdminRolePermissionResponseDto } from "@/api";
import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useGetUserPermissions } from "@/queries/permissionQueries";
import type { PermissionModule } from "@/types/permission";

interface PermissionsContextType {
  permissions: AdminRolePermissionResponseDto[];
  isLoading: boolean;
  canCreate: (module: PermissionModule) => boolean;
  canRead: (module: PermissionModule) => boolean;
  canUpdate: (module: PermissionModule) => boolean;
  canDelete: (module: PermissionModule) => boolean;
  hasAnyPermission: (module: PermissionModule) => boolean;
  hasFullPermission: (module: PermissionModule) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

export const PermissionsProvider = ({ children }: { children: ReactNode }) => {
  const { data: permissions = [], isLoading } = useGetUserPermissions();

  const canCreate = (module: PermissionModule): boolean => {
    const permission = permissions.find(
      (p: AdminRolePermissionResponseDto) =>
        p.module === module && p.isCreate === true
    );
    return permission?.isCreate || false;
  };

  const canRead = (module: PermissionModule): boolean => {
    const permission = permissions.find(
      (p: AdminRolePermissionResponseDto) =>
        p.module === module && p.isRead === true
    );
    return permission?.isRead || false;
  };

  const canUpdate = (module: PermissionModule): boolean => {
    const permission = permissions.find(
      (p: AdminRolePermissionResponseDto) =>
        p.module === module && p.isUpdate === true
    );
    return permission?.isUpdate || false;
  };

  const canDelete = (module: PermissionModule): boolean => {
    const permission = permissions.find(
      (p: AdminRolePermissionResponseDto) =>
        p.module === module && p.isDelete === true
    );
    return permission?.isDelete || false;
  };

  const hasAnyPermission = (module: PermissionModule): boolean => {
    const permission = permissions.find(
      (p: AdminRolePermissionResponseDto) => p.module === module
    );
    if (!permission) return false;
    return (
      permission.isCreate ||
      permission.isRead ||
      permission.isUpdate ||
      permission.isDelete
    );
  };

  const hasFullPermission = (module: PermissionModule): boolean => {
    const permission = permissions.find(
      (p: AdminRolePermissionResponseDto) => p.module === module
    );
    if (!permission) return false;
    return (
      permission.isCreate &&
      permission.isRead &&
      permission.isUpdate &&
      permission.isDelete
    );
  };

  const value = useMemo(
    () => ({
      permissions,
      isLoading,
      canCreate,
      canRead,
      canUpdate,
      canDelete,
      hasAnyPermission,
      hasFullPermission,
    }),
    [permissions, isLoading]
  );

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};
