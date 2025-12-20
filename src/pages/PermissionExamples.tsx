/**
 * VÍ DỤ SỬ DỤNG PERMISSION SYSTEM
 *
 * File này minh họa cách sử dụng permission system trong các trang admin
 */

import { usePermissions } from "@/contexts/PermissionsContext";
import { PermissionGuard } from "@/components/PermissionGuard";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";

// ========================================
// VÍ DỤ 1: Ẩn/Hiện Button Create
// ========================================
export function ProductListHeader() {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>

      {/* Button này chỉ hiển thị nếu user có quyền create Product */}
      <PermissionGuard module="Product" action="create">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo sản phẩm mới
        </Button>
      </PermissionGuard>
    </div>
  );
}

// ========================================
// VÍ DỤ 2: Ẩn/Hiện Actions trong Table
// ========================================
export function ProductTableActions({ productId }: { productId: string }) {
  const handleView = () => {
    // Logic xem chi tiết
  };

  const handleEdit = () => {
    // Logic sửa
  };

  const handleDelete = () => {
    // Logic xóa
  };

  return (
    <div className="flex gap-2">
      {/* Button Xem - hiển thị nếu có quyền read */}
      <PermissionGuard module="Product" action="read">
        <Button variant="ghost" size="sm" onClick={handleView}>
          <Eye className="h-4 w-4" />
        </Button>
      </PermissionGuard>

      {/* Button Sửa - hiển thị nếu có quyền update */}
      <PermissionGuard module="Product" action="update">
        <Button variant="ghost" size="sm" onClick={handleEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </PermissionGuard>

      {/* Button Xóa - hiển thị nếu có quyền delete */}
      <PermissionGuard module="Product" action="delete">
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </PermissionGuard>
    </div>
  );
}

// ========================================
// VÍ DỤ 3: Ẩn/Hiện toàn bộ View/Table
// ========================================
export function ProductListView() {
  return (
    <PermissionGuard
      module="Product"
      action="read"
      fallback={
        <div className="text-center p-8">
          <p className="text-muted-foreground">
            Bạn không có quyền xem danh sách sản phẩm
          </p>
        </div>
      }
    >
      <div>
        <h2>Danh sách sản phẩm</h2>
        <table>{/* Table content */}</table>
      </div>
    </PermissionGuard>
  );
}

// ========================================
// VÍ DỤ 4: Sử dụng Hook để kiểm tra logic phức tạp
// ========================================
export function OrderManagement() {
  const { canUpdate, canDelete, hasFullPermission } = usePermissions();

  // Logic phức tạp kết hợp nhiều điều kiện
  const canProcessOrder = canUpdate("Order");
  const canCancelOrder = canDelete("Order");
  const isOrderAdmin = hasFullPermission("Order");

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>

      {canProcessOrder && <Button>Xử lý đơn hàng</Button>}

      {canCancelOrder && <Button variant="destructive">Hủy đơn hàng</Button>}

      {/* Hiển thị thống kê nâng cao chỉ cho admin có full quyền */}
      {isOrderAdmin && (
        <div className="mt-4 p-4 border rounded">
          <h3>Thống kê nâng cao</h3>
          {/* Advanced statistics */}
        </div>
      )}
    </div>
  );
}

// ========================================
// VÍ DỤ 5: Kiểm tra nhiều modules
// ========================================
export function DashboardView() {
  const { canRead, hasAnyPermission } = usePermissions();

  const canViewProducts = canRead("Product");
  const canViewOrders = canRead("Order");
  const canViewUsers = canRead("User");
  const canManageVouchers = hasAnyPermission("Voucher");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {canViewProducts && (
        <div className="p-4 border rounded">
          <h3>Sản phẩm</h3>
          {/* Product stats */}
        </div>
      )}

      {canViewOrders && (
        <div className="p-4 border rounded">
          <h3>Đơn hàng</h3>
          {/* Order stats */}
        </div>
      )}

      {canViewUsers && (
        <div className="p-4 border rounded">
          <h3>Người dùng</h3>
          {/* User stats */}
        </div>
      )}

      {canManageVouchers && (
        <div className="p-4 border rounded">
          <h3>Vouchers</h3>
          {/* Voucher stats */}
        </div>
      )}
    </div>
  );
}

// ========================================
// VÍ DỤ 6: Ẩn/Hiện Menu Items trong Sidebar
// ========================================
export function AdminSidebar() {
  const { canRead } = usePermissions();

  return (
    <nav className="space-y-2">
      <PermissionGuard module="Product" action="read">
        <a href="/admin/product" className="block p-2 hover:bg-gray-100">
          Quản lý sản phẩm
        </a>
      </PermissionGuard>

      <PermissionGuard module="Order" action="read">
        <a href="/admin/order" className="block p-2 hover:bg-gray-100">
          Quản lý đơn hàng
        </a>
      </PermissionGuard>

      <PermissionGuard module="User" action="read">
        <a href="/admin/user" className="block p-2 hover:bg-gray-100">
          Quản lý người dùng
        </a>
      </PermissionGuard>

      <PermissionGuard module="Voucher" action="read">
        <a href="/admin/voucher" className="block p-2 hover:bg-gray-100">
          Quản lý voucher
        </a>
      </PermissionGuard>

      <PermissionGuard module="Category" action="read">
        <a href="/admin/category" className="block p-2 hover:bg-gray-100">
          Quản lý danh mục
        </a>
      </PermissionGuard>

      <PermissionGuard module="Chatbot" action="read">
        <a href="/admin/chatbot" className="block p-2 hover:bg-gray-100">
          Cấu hình Chatbot
        </a>
      </PermissionGuard>

      <PermissionGuard module="Location" action="read">
        <a href="/admin/location" className="block p-2 hover:bg-gray-100">
          Quản lý địa điểm
        </a>
      </PermissionGuard>
    </nav>
  );
}

// ========================================
// VÍ DỤ 7: Kết hợp với state và logic nghiệp vụ
// ========================================
export function ProductForm({ product }: { product?: any }) {
  const { canCreate, canUpdate } = usePermissions();
  const isEditMode = !!product;

  // Kiểm tra quyền dựa trên mode
  const hasPermission = isEditMode
    ? canUpdate("Product")
    : canCreate("Product");

  if (!hasPermission) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          Bạn không có quyền {isEditMode ? "sửa" : "tạo"} sản phẩm
        </p>
      </div>
    );
  }

  return (
    <form>
      {/* Form fields */}
      <div className="mt-4">
        <Button type="submit">{isEditMode ? "Cập nhật" : "Tạo mới"}</Button>
      </div>
    </form>
  );
}

// ========================================
// VÍ DỤ 8: Disable/Enable input fields
// ========================================
export function UserEditForm({ user }: { user: any }) {
  const { canUpdate } = usePermissions();
  const canEdit = canUpdate("User");

  return (
    <form>
      <input
        type="text"
        value={user.name}
        disabled={!canEdit}
        className={!canEdit ? "opacity-50 cursor-not-allowed" : ""}
      />

      <input
        type="email"
        value={user.email}
        disabled={!canEdit}
        className={!canEdit ? "opacity-50 cursor-not-allowed" : ""}
      />

      {canEdit && <Button type="submit">Lưu thay đổi</Button>}
    </form>
  );
}

// ========================================
// VÍ DỤ 9: Conditional rendering với multiple permissions
// ========================================
export function AdvancedProductActions() {
  const { canCreate, canUpdate, canDelete, hasFullPermission } =
    usePermissions();

  // Chỉ hiển thị nếu có ít nhất 1 quyền
  if (!canCreate("Product") && !canUpdate("Product") && !canDelete("Product")) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {canCreate("Product") && <Button>Nhân bản sản phẩm</Button>}

      {canUpdate("Product") && <Button>Cập nhật hàng loạt</Button>}

      {canDelete("Product") && (
        <Button variant="destructive">Xóa hàng loạt</Button>
      )}

      {/* Advanced features chỉ dành cho admin có full quyền */}
      {hasFullPermission("Product") && (
        <Button variant="outline">Import/Export</Button>
      )}
    </div>
  );
}

// ========================================
// VÍ DỤ 10: Loading state
// ========================================
export function PermissionAwareComponent() {
  const { isLoading } = usePermissions();

  if (isLoading) {
    return <div>Đang tải permissions...</div>;
  }

  return (
    <PermissionGuard module="Product" action="read">
      <div>Nội dung component</div>
    </PermissionGuard>
  );
}

export default function PermissionExamplesPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">
        Ví dụ sử dụng Permission System
      </h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          1. Header với Create Button
        </h2>
        <ProductListHeader />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">2. Table Actions</h2>
        <ProductTableActions productId="123" />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          3. Dashboard với nhiều modules
        </h2>
        <DashboardView />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">4. Sidebar Navigation</h2>
        <AdminSidebar />
      </section>
    </div>
  );
}
