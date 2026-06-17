import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Guards
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Pages
import Home from '../pages/Home/Home';
import ProductListing from '../pages/ProductListing/ProductListing';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
import Cart from '../pages/Cart/Cart';
import Wishlist from '../pages/Wishlist/Wishlist';
import Checkout from '../pages/Checkout/Checkout';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import Profile from '../pages/Profile/Profile';
import Admin from '../pages/Admin/Admin';
import NotFound from '../pages/NotFound/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Protected Routes */}
        <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="shop" element={<ProtectedRoute><ProductListing /></ProtectedRoute>} />
        <Route path="product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

        {/* Auth Restricted Routes */}
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Customer Routes */}
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-all Redirect */}
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
