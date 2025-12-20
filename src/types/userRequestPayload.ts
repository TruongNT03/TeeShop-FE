export enum RoleType {
  ADMIN = "Admin",
  USER = "User",
  PRODUCT_MANAGER = "Product Manager",
  ORDER_MANAGER = "Order Manager",
  TECHNICIAN = "Technician",
}

export interface UserRequestPayload {
  id: string;
  email: string;
  roles?: RoleType[];
  jti: string;
}
