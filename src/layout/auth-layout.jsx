// import { Outlet } from "react-router-dom";

import { AuthenticationImage } from "./authentication/authentication-image";
function AuthLayout() {
  return (
    <div>
      <h1>Auth page</h1>
      <AuthenticationImage/>
    </div>
  );
}

export default AuthLayout;