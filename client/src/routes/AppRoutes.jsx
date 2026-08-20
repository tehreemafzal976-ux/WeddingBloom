import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Public Pages
import HomePage from "../pages/HomePage";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import CategoriesPage from "../pages/CategoriesPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";

// Dashboard Pages
import Dashboard from "../pages/Dashboard";
import VendorDashboard from "../pages/VendorDashboard";
import Weddings from "../pages/Weddings";
import Guests from "../pages/Guests";
import Events from "../pages/Events";
import Expenses from "../pages/Expenses";
import Vendors from "../pages/Vendors";
import Packages from "../pages/Packages";
import Deals from "../pages/Deals";
import Bookings from "../pages/Bookings";
import Payments from "../pages/Payments";
import Reviews from "../pages/Reviews";
import Favorites from "../pages/Favorites";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Orders from "../pages/Orders";
import VendorProducts from "../pages/VendorProducts";

function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC MARKETPLACE ROUTES */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* COUPLE & PLANNING DASHBOARD ROUTES */}
      <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/couple/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/weddings" element={<AppLayout><Weddings /></AppLayout>} />
      <Route path="/couple/weddings" element={<AppLayout><Weddings /></AppLayout>} />
      <Route path="/guests" element={<AppLayout><Guests /></AppLayout>} />
      <Route path="/couple/guests" element={<AppLayout><Guests /></AppLayout>} />
      <Route path="/events" element={<AppLayout><Events /></AppLayout>} />
      <Route path="/couple/events" element={<AppLayout><Events /></AppLayout>} />
      <Route path="/expenses" element={<AppLayout><Expenses /></AppLayout>} />
      <Route path="/couple/expenses" element={<AppLayout><Expenses /></AppLayout>} />
      <Route path="/vendors" element={<AppLayout><Vendors /></AppLayout>} />
      <Route path="/couple/vendors" element={<AppLayout><Vendors /></AppLayout>} />
      <Route path="/packages" element={<AppLayout><Packages /></AppLayout>} />
      <Route path="/deals" element={<AppLayout><Deals /></AppLayout>} />
      <Route path="/bookings" element={<AppLayout><Bookings /></AppLayout>} />
      <Route path="/couple/bookings" element={<AppLayout><Bookings /></AppLayout>} />
      <Route path="/payments" element={<AppLayout><Payments /></AppLayout>} />
      <Route path="/couple/payments" element={<AppLayout><Payments /></AppLayout>} />
      <Route path="/reviews" element={<AppLayout><Reviews /></AppLayout>} />
      <Route path="/favorites" element={<AppLayout><Favorites /></AppLayout>} />
      <Route path="/couple/favorites" element={<AppLayout><Favorites /></AppLayout>} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/couple/orders" element={<Orders />} />
      <Route path="/notifications" element={<AppLayout><Notifications /></AppLayout>} />
      <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />

      {/* VENDOR DASHBOARD ROUTES */}
      <Route path="/vendor-dashboard" element={<AppLayout><VendorDashboard /></AppLayout>} />
      <Route path="/vendor/dashboard" element={<AppLayout><VendorDashboard /></AppLayout>} />
      <Route path="/vendor/products" element={<AppLayout><VendorProducts /></AppLayout>} />
      <Route path="/vendor/orders" element={<Orders />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;