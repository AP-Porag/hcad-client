import { Navigate } from "react-router-dom";

import { isAuthenticated } from "@/lib/auth";

export default function GuestRoute({
                                       children,
                                   }) {
    if (isAuthenticated()) {
        return (
            <Navigate
                to="/admin"
                replace
            />
        );
    }

    return children;
}
