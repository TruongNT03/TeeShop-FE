import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRouter = () => {
  const { accessToken } = useAuth();
  return accessToken ? <Outlet /> : <Navigate to={"/login"} />;
};
export default PrivateRouter;
