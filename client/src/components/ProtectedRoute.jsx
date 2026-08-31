import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function ProtectedRoute({ children, admin = false, adminRedirect = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="app-loader"><Logo compact className="pulse" /><p>Preparing PMS…</p></div>;
  if (!user) return <Navigate to={adminRedirect ? "/admin-login.html" : "/login.html"} state={{ from: location }} replace />;
  if (admin && user.role !== "admin") return <Navigate to="/admin-login.html" replace />;
  return children;
}
