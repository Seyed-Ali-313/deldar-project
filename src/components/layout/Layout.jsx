import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
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

    // فقط وقتی از داخل فلو، به بیرون فلو رفت پاک می‌کنیم
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
    </>
  );
}
