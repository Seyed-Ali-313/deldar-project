// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// ✅ مسیرهایی که اگر کاربر لاگین بود، نباید بهش دسترسی داشته باشه
const PUBLIC_ONLY_ROUTES = ["/login", "/register", "/rules"];

export default function PrivateRoute({
  requireAuth = true,
  redirectTo = "/login",
}) {
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

  // ✅ اگر کاربر لاگین است و مسیر عمومی (لاگین، ثبت‌نام، قوانین) هست → بره داشبورد
  if (isLoggedIn && PUBLIC_ONLY_ROUTES.includes(window.location.pathname)) {
    console.log("🔒 کاربر لاگین است، رفتن به داشبورد");
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ اگر کاربر لاگین نیست و مسیر نیاز به احراز هویت دارد → بره لاگین
  if (!isLoggedIn && requireAuth) {
    console.log("🔒 رفتن به لاگین");
    return <Navigate to={redirectTo} replace />;
  }

  console.log("🔒 نمایش محتوا");
  return <Outlet />;
}
