import { lazy } from "react";

// Lazy-loaded components
export const Login = lazy(() => import("../pages/auth/login"));
export const AdminHome = lazy(() => import("../pages/admin/Home"));
export const EmployeeDashboard = lazy(() => import("../pages/employee/Dashboard"));
export const Signup = lazy(() => import("../pages/auth/signUp"));
