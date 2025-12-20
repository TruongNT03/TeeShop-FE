/**
 * Type definitions cho Permission System
 */

export type PermissionModule =
  | "Product"
  | "User"
  | "Category"
  | "Order"
  | "Voucher"
  | "Chatbot"
  | "Location";

export type PermissionAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "any"
  | "full";

export interface Permission {
  id: string;
  module: PermissionModule;
  isCreate: boolean;
  isRead: boolean;
  isUpdate: boolean;
  isDelete: boolean;
}

export interface PermissionCheck {
  module: PermissionModule;
  action: PermissionAction;
}
