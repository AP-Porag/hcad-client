import { Routes, Route } from "react-router-dom";

import AuthLayout from "../layout/auth-layout";
import AdminLayout from "../layout/admin-layout";

// import Login from "../pages/auth/login";
// import Dashboard from "../pages/admin/dashboard";
import Navbar from "../components/Navbar";

function AppRoutes() {
  return (
    <>
    <Navbar/>
    <Routes>
      {/* Auth Layout */}
      <Route path="/auth" element={<AuthLayout />}>
        {/* <Route path="login" element={<Login />} /> */}
      </Route>

      {/* Admin Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* <Route index element={<Dashboard />} /> */}
      </Route>
    </Routes>
    </>
  );
}

export default AppRoutes;