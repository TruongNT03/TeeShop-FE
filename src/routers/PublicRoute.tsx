import { RoleType, type UserRequestPayload } from "@/types/userRequestPayload";
import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  const adminRoles = [
    RoleType.ADMIN,
    RoleType.PRODUCT_MANAGER,
    RoleType.ORDER_MANAGER,
    RoleType.TECHNICIAN,
  ];
  let isAdmin = false;
  try {
    isAdmin =
      jwtDecode<UserRequestPayload>(accessToken || "")?.roles?.some((role) =>
        adminRoles.includes(role)
      ) || false;
  } catch (error) {}
  return isAdmin ? <Navigate to="admin" /> : <Outlet />;
};

export default PublicRoute;
