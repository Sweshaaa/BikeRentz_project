import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth";
import { paths } from "../config/paths";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading...</div>;
  if (!user) return <Navigate to={paths.login} replace />;
  return <Outlet />;
}

export function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading...</div>;
  if (!user || user.role !== "admin") return <Navigate to={paths.home} replace />;
  return <Outlet />;
}
