// src/components/layout/Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import useRegisterData from "../../hooks/useRegisterData";

const REGISTER_FLOW_PATHS = ["/register", "/verify-otp"];

function isInRegisterFlow(pathname) {
  return REGISTER_FLOW_PATHS.some((p) => pathname.startsWith(p));
}

export default function Layout() {
  const location = useLocation();
  const { clearAll } = useRegisterData();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currentPath = location.pathname;

    const wasInFlow = isInRegisterFlow(prevPath);
    const isInFlowNow = isInRegisterFlow(currentPath);

    if (wasInFlow && !isInFlowNow) {
      clearAll();
    }

    prevPathRef.current = currentPath;
  }, [location.pathname, clearAll]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>

      {/* ✅ اضافه کردن ToastContainer */}
      <ToastContainer
        position="top-center"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          direction: "rtl",
          fontFamily: "w_Nian, sans-serif",
        }}
        toastStyle={{
          borderRadius: "14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      />
    </>
  );
}
