// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute() {
  const { isLoggedIn, isLoading } = useAuth();

  console.log(
    "🔒 PrivateRoute - isLoggedIn:",
    isLoggedIn,
    "isLoading:",
    isLoading,
  );

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          color: "rgba(255,255,255,0.3)",
          fontFamily: "w_Lotus, sans-serif",
        }}
      >
        ⏳ در حال بارگذاری...
      </div>
    );
  }

  if (!isLoggedIn) {
    console.log("🔒 رفتن به لاگین");
    return <Navigate to="/login" replace />;
  }

  console.log("🔒 نمایش داشبورد");
  return <Outlet />;
}
