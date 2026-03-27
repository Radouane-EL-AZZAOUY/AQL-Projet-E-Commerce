import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import { LoginPage, RegisterPage } from '../features/auth';
import { CatalogPage, ProductDetailPage } from '../features/catalog';
import { CartPage, CheckoutPage } from '../features/cart';
import { MyOrdersPage, OrderDetailPage } from '../features/orders';
import { AdminCategoriesPage, AdminOrdersPage, AdminProductsPage } from '../features/admin';
import PrivateRoute from './PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
        <Route path="orders" element={<PrivateRoute><MyOrdersPage /></PrivateRoute>} />
        <Route path="orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
        <Route path="admin/products" element={<PrivateRoute adminOnly><AdminProductsPage /></PrivateRoute>} />
        <Route path="admin/categories" element={<PrivateRoute adminOnly><AdminCategoriesPage /></PrivateRoute>} />
        <Route path="admin/orders" element={<PrivateRoute adminOnly><AdminOrdersPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
