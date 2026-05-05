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

function AppRoutes() {
  return (
      <>
        {/* <Navbar/> */}

        <Routes>

          {/* =====================================
            AUTH LAYOUT
        ===================================== */}

          <Route path="/" element={<AuthLayout />}>
             <Route path="" element={<Login />} />
          </Route>

          {/* =====================================
            ADMIN LAYOUT
        ===================================== */}

          <Route path="/admin" element={<AdminLayout />}>

            {/* DASHBOARD */}
            <Route
                index
                element={<Dashboard />}
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
