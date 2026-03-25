import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div className="auth-loading">
        <span>Loading…</span>
      </div>
    );
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
