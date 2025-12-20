import type { AdminLocationResponseDto } from "@/api";

export enum RoleType {
  ADMIN = "Admin",
  USER = "User",
  PRODUCT_MANAGER = "Product Manager",
  ORDER_MANAGER = "Order Manager",
  TECHNICIAN = "Technician",
}

export enum LoginType {
  DEFAULT = "default",
  GOOGLE = "google",
}

export interface UserRequestPayload {
  id: string;
  email: string;
  roles?: RoleType[];
  loginType: LoginType;
  jti: string;
  location?: AdminLocationResponseDto;
}
