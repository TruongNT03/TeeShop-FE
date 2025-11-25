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
import ProductDetail from "@/pages/ProductDetail";
import AdminProductEdit from "@/pages/AdminProductEdit";
import CartPage from "@/pages/CartPage";
import AdminConfig from "@/pages/AdminConfig";
import AdminChatbotConfig from "@/pages/AdminChatbotConfig";
import Checkout from "@/pages/Checkout";
import { ProfileLayout } from "@/layouts/ProfileLayout";
import { ProfileInfo } from "@/pages/profile/ProfileInfo";
import { ProfileOrders } from "@/pages/profile/ProfileOrders";
import { ProfileOrderDetail } from "@/pages/profile/ProfileOrderDetail";
import { ProfileChangePassword } from "@/pages/profile/ProfileChangePassword";
import { ProfileAddresses } from "@/pages/profile/ProfileAddresses";

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
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route path="/profile" element={<ProfileLayout />}>
              <Route path="info" element={<ProfileInfo />} />
              <Route path="orders" element={<ProfileOrders />} />
              <Route path="orders/:id" element={<ProfileOrderDetail />} />
              <Route
                path="change-password"
                element={<ProfileChangePassword />}
              />
              <Route path="addresses" element={<ProfileAddresses />} />
            </Route>
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
            <Route path="/admin/configuration" element={<AdminConfig />} />
            <Route path="/admin/chatbot" element={<AdminChatbotConfig />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
