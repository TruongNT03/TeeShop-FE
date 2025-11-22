// src/routers/AppRouter.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRouter from "./PrivateRouter";
import Register from "../pages/Register";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import AdminProduct from "@/pages/AdminProduct";
import AdminLayout from "@/layouts/AdminLayout";
import AdminProductCreate from "@/pages/AdminProductCreate";
import UserLayout from "@/layouts/UserLayout";
import DemoPage from "@/pages/DemoPage";
import ForgotPassword from "@/pages/ForgotPassword";
import ProfilePage from "@/pages/ProfilePage";
import ProductDetail from "@/pages/ProductDetail";
import AdminProductEdit from "@/pages/AdminProductEdit";
import CartPage from "@/pages/CartPage";

import AdminCategory from "@/pages/AdminCategory";
import AdminCategoryCreate from "@/pages/AdminCategoryCreate";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<UserLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/demo" element={<DemoPage />} />
        </Route>

        <Route element={<PrivateRouter />}>
          <Route element={<UserLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminProduct />} />
            <Route path="/admin/product" element={<AdminProduct />} />
            <Route
              path="/admin/product/create"
              element={<AdminProductCreate />}
            />
            <Route
              path="/admin/product/edit/:id"
              element={<AdminProductEdit />}
            />
            
            <Route path="/admin/category" element={<AdminCategory />} />
            <Route
              path="/admin/category/create"
              element={<AdminCategoryCreate />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;