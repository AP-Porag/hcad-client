import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../layout/auth-layout";
import AdminLayout from "../layout/admin-layout";

// import Login from "../pages/auth/login";
// import Dashboard from "../pages/admin/dashboard";
// import Navbar from "../components/Navbar";

import Dashboard from "@/pages/admin/dashboard";
import Search from "@/pages/admin/search";
import MarketInsight from "@/pages/admin/market-insight/index.jsx";

import PropertyIndex from "@/pages/admin/property";
import PropertyDetail from "@/pages/admin/property/detail.jsx";
import Login from "@/pages/auth/login.jsx";
import UserIndexPage from "@/pages/admin/user/index.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import GuestRoute from "@/components/GuestRoute.jsx";
import SavedPropertiesPage from "@/pages/admin/saved-properties/index.jsx";

function AppRoutes() {
  return (
      <>
        {/* <Navbar/> */}

        <Routes>

          {/* =====================================
            AUTH LAYOUT
        ===================================== */}

          <Route path="/" element={
              <GuestRoute>
                <AuthLayout />
              </GuestRoute>
          }>
             <Route path="" element={<Login />} />
          </Route>

          {/* =====================================
            ADMIN LAYOUT
        ===================================== */}

          <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
          }>

            {/* DASHBOARD */}
            <Route
                index
                element={<Dashboard />}
            />

            <Route
                path="users"
                element={<UserIndexPage />}
            />

            {/* PROPERTY LIST */}
            <Route
                path="property"
                element={<PropertyIndex />}
            />

            {/* PROPERTY DETAIL */}
            <Route
                path="property/:id"
                element={<PropertyDetail />}
            />

            {/* SEARCH */}
            <Route
                path="search"
                element={<Search />}
            />
              {/* Saved Properties */}
              <Route
                  path="saved-properties"
                  element={<SavedPropertiesPage />}
              />
            {/* MARKET INSIGHT */}
            <Route
                path="market-insight"
                element={<MarketInsight />}
            />

          </Route>

          {/* FALLBACK */}
          <Route
              path="*"
              element={<Navigate to="/admin" replace />}
          />

        </Routes>
      </>
  );
}

export default AppRoutes;
