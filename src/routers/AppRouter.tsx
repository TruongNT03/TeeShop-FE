import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import PrivateRouter from './PrivateRouter'
import Register from '../pages/Register'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Home from '../pages/Home'
import AdminProduct from '@/pages/AdminProduct'
import AdminLayout from '@/layouts/AdminLayout'
import AdminCreateProduct from '@/pages/AdminCreateProduct'
import UserLayout from '@/layouts/UserLayout'
import DemoPage from '@/pages/DemoPage'
import ForgotPassword from '@/pages/ForgotPassword'
import ProfilePage from '@/pages/ProfilePage'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<UserLayout />}>
            <Route index path="/" element={<Home />} />{' '}
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/demo" element={<DemoPage />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRouter />}>
          <Route element={<UserLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminProduct />} />
            <Route path="/admin/product" element={<AdminProduct />} />
            <Route path="/admin/product/create" element={<AdminCreateProduct />} />
          </Route>
        </Route>

        {/* Anonymous Routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
