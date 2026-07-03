// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  // ✅ چک کن توکن وجود داره یا نه (حتی توکن تستی)
  const token = localStorage.getItem("access_token");

  // اگه توکن وجود نداشته باشه، به لاگین بره
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // اگه توکن وجود داشته باشه، صفحه رو نشون بده
  return <Outlet />;
}
