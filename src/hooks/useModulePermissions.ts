/**
 * Custom hooks tiện ích cho từng module cụ thể
 * Giúp code ngắn gọn và dễ đọc hơn
 */

import { usePermissions } from "@/contexts/PermissionsContext";

/**
 * Hook cho Product module
 */
export const useProductPermissions = () => {
  const { canCreate, canRead, canUpdate, canDelete, hasFullPermission } =
    usePermissions();

  return {
    canCreateProduct: canCreate("Product"),
    canReadProduct: canRead("Product"),
    canUpdateProduct: canUpdate("Product"),
    canDeleteProduct: canDelete("Product"),
    isProductAdmin: hasFullPermission("Product"),
  };
};

/**
 * Hook cho Order module
 */
export const useOrderPermissions = () => {
  const { canCreate, canRead, canUpdate, canDelete, hasFullPermission } =
    usePermissions();

  return {
    canCreateOrder: canCreate("Order"),
    canReadOrder: canRead("Order"),
    canUpdateOrder: canUpdate("Order"),
    canDeleteOrder: canDelete("Order"),
    isOrderAdmin: hasFullPermission("Order"),
  };
};

/**
 * Hook cho User module
 */
export const useUserPermissions = () => {
  const { canCreate, canRead, canUpdate, canDelete, hasFullPermission } =
    usePermissions();

  return {
    canCreateUser: canCreate("User"),
    canReadUser: canRead("User"),
    canUpdateUser: canUpdate("User"),
    canDeleteUser: canDelete("User"),
    isUserAdmin: hasFullPermission("User"),
  };
};

/**
 * Hook cho Category module
 */
export const useCategoryPermissions = () => {
  const { canCreate, canRead, canUpdate, canDelete, hasFullPermission } =
    usePermissions();

  return {
    canCreateCategory: canCreate("Category"),
    canReadCategory: canRead("Category"),
    canUpdateCategory: canUpdate("Category"),
    canDeleteCategory: canDelete("Category"),
    isCategoryAdmin: hasFullPermission("Category"),
  };
};

/**
 * Hook cho Voucher module
 */
export const useVoucherPermissions = () => {
  const { canCreate, canRead, canUpdate, canDelete, hasFullPermission } =
    usePermissions();

  return {
    canCreateVoucher: canCreate("Voucher"),
    canReadVoucher: canRead("Voucher"),
    canUpdateVoucher: canUpdate("Voucher"),
    canDeleteVoucher: canDelete("Voucher"),
    isVoucherAdmin: hasFullPermission("Voucher"),
  };
};

/**
 * Hook cho Chatbot module
 */
export const useChatbotPermissions = () => {
  const { canCreate, canRead, canUpdate, canDelete, hasFullPermission } =
    usePermissions();

  return {
    canCreateChatbot: canCreate("Chatbot"),
    canReadChatbot: canRead("Chatbot"),
    canUpdateChatbot: canUpdate("Chatbot"),
    canDeleteChatbot: canDelete("Chatbot"),
    isChatbotAdmin: hasFullPermission("Chatbot"),
  };
};

/**
 * Hook cho Location module
 */
export const useLocationPermissions = () => {
  const { canCreate, canRead, canUpdate, canDelete, hasFullPermission } =
    usePermissions();

  return {
    canCreateLocation: canCreate("Location"),
    canReadLocation: canRead("Location"),
    canUpdateLocation: canUpdate("Location"),
    canDeleteLocation: canDelete("Location"),
    isLocationAdmin: hasFullPermission("Location"),
  };
};

/**
 * VÍ DỤ SỬ DỤNG:
 *
 * // Thay vì:
 * const { canCreate, canUpdate } = usePermissions();
 * const canCreateProduct = canCreate("Product");
 * const canUpdateProduct = canUpdate("Product");
 *
 * // Bây giờ chỉ cần:
 * const { canCreateProduct, canUpdateProduct } = useProductPermissions();
 */
