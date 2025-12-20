import type { ReactNode } from "react";
import { usePermissions } from "@/contexts/PermissionsContext";
import type { PermissionModule, PermissionAction } from "@/types/permission";

interface PermissionGuardProps {
  children: ReactNode;
  module: PermissionModule;
  action?: PermissionAction;
  fallback?: ReactNode;
}

export const PermissionGuard = ({
  children,
  module,
  action = "read",
  fallback = null,
}: PermissionGuardProps) => {
  const {
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    hasAnyPermission,
    hasFullPermission,
  } = usePermissions();

  let hasPermission = false;

  switch (action) {
    case "create":
      hasPermission = canCreate(module);
      break;
    case "read":
      hasPermission = canRead(module);
      break;
    case "update":
      hasPermission = canUpdate(module);
      break;
    case "delete":
      hasPermission = canDelete(module);
      break;
    case "any":
      hasPermission = hasAnyPermission(module);
      break;
    case "full":
      hasPermission = hasFullPermission(module);
      break;
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
