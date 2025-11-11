import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("admin" | "employee")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role as "admin" | "employee")) {
    // Logged in but doesn’t have permission → show unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized user
  return <>{children}</>;
};

export default ProtectedRoute;
