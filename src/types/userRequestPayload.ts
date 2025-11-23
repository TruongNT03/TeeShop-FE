export enum RoleType {
  ADMIN = "Admin",
  USER = "User",
}

export interface UserRequestPayload {
  id: string;
  email: string;
  roles?: RoleType[];
  jti: string;
}
