import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { RoleType, type UserRequestPayload } from "@/types/userRequestPayload";
import { jwtDecode } from "jwt-decode";

const PrivateRouter = () => {
  const accessToken = localStorage.getItem("accessToken");
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  // Not authenticated - redirect to login
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Decode token to get user info
  let user: UserRequestPayload;
  let isAdmin = false;

  try {
    user = jwtDecode(accessToken);
    isAdmin = user.roles?.includes(RoleType.ADMIN) || false;
  } catch (error) {
    // Invalid token - redirect to login
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return <Navigate to="/login" replace />;
  }

  // Check authorization
  if (isAdminPath) {
    // Admin routes - only admin can access
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  } else {
    // User routes - admin cannot access
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
  }

  // Authorized - render the route
  return <Outlet />;
};

export default PrivateRouter;
