import { RoleType, type UserRequestPayload } from "@/types/userRequestPayload";
import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  let isAdmin = false;
  try {
    jwtDecode<UserRequestPayload>(accessToken || "")?.roles?.includes(
      RoleType.ADMIN
    )
      ? (isAdmin = true)
      : (isAdmin = false);
  } catch (error) {}
  return isAdmin ? <Navigate to="admin" /> : <Outlet />;
};

export default PublicRoute;
