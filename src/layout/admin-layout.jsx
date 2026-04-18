import { Outlet } from "react-router-dom";
import App from "./analytic/App";

function AdminLayout() {
  return (
    <div>
      <h1 className="">Admin Panel</h1>
      <App/>
    </div>
  );
}

export default AdminLayout;