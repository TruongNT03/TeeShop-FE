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
import AdminDashboard from "@/pages/AdminDashboard";
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
import ProductList from "@/pages/ProductList";
import AdminOrder from "@/pages/AdminOrder";
import AdminOrderDetail from "@/pages/AdminOrderDetail";
import AdminUser from "@/pages/AdminUser";
import NotificationList from "@/pages/NotificationList";
import AdminNotification from "@/pages/AdminNotification";
import GoogleCallback from "@/pages/GoogleCallback";
import AdminVoucher from "@/pages/AdminVoucher";
import AdminCreateVoucher from "@/pages/AdminCreateVoucher";
import UserVouchers from "@/pages/UserVouchers";
import AdminLocation from "@/pages/AdminLocation";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<UserLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/product" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/vouchers" element={<UserVouchers />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
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
              <Route path="notifications" element={<NotificationList />} />
            </Route>
          </Route>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
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
            <Route path="/admin/order" element={<AdminOrder />} />
            <Route path="/admin/order/:id" element={<AdminOrderDetail />} />
            <Route path="/admin/user" element={<AdminUser />} />

            <Route path="/admin/location" element={<AdminLocation />} />
            <Route path="/admin/configuration" element={<AdminConfig />} />
            <Route path="/admin/chatbot" element={<AdminChatbotConfig />} />
            <Route
              path="/admin/notifications"
              element={<AdminNotification />}
            />
            <Route path="/admin/voucher" element={<AdminVoucher />} />
            <Route
              path="/admin/voucher/create"
              element={<AdminCreateVoucher />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
