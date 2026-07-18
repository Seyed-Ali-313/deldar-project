// src/routes/AppRouter.jsx
import { AnimatePresence, motion } from "framer-motion";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import About from "../pages/About";
import Announcement from "../pages/Announcement";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import Contact from "../pages/Contact";
import Dashboard from "../pages/dashboard/Dashboard";
import UploadSuccess from "../pages/dashboard/UploadSuccess";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Rules from "../pages/Rules";
import PrivateRoute from "./PrivateRoute";

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    style={{ width: "100%", height: "100%" }}
  >
    {children}
  </motion.div>
);

const LayoutWithAnimation = () => (
  <AnimatePresence mode="wait">
    <PageTransition>
      <Layout />
    </PageTransition>
  </AnimatePresence>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutWithAnimation />,
    children: [
      // ✅ صفحه اصلی - همیشه قابل دسترس
      {
        index: true,
        element: (
          <PageTransition>
            <Home />
          </PageTransition>
        ),
      },
      // ✅ فراخوان - همیشه قابل دسترس
      {
        path: "announcement",
        element: (
          <PageTransition>
            <Announcement />
          </PageTransition>
        ),
      },
      // ✅ درباره ما - همیشه قابل دسترس
      {
        path: "about",
        element: (
          <PageTransition>
            <About />
          </PageTransition>
        ),
      },
      // ✅ تماس با ما - همیشه قابل دسترس
      {
        path: "contact",
        element: (
          <PageTransition>
            <Contact />
          </PageTransition>
        ),
      },
      // ✅ قوانین - همیشه قابل دسترس
      {
        path: "rules",
        element: (
          <PageTransition>
            <Rules />
          </PageTransition>
        ),
      },
      // ✅ ثبت‌نام - اگر لاگین باشی به داشبورد میره
      {
        path: "register",
        element: <PrivateRoute requireAuth={false} redirectTo="/dashboard" />,
        children: [
          {
            index: true,
            element: (
              <PageTransition>
                <Register />
              </PageTransition>
            ),
          },
        ],
      },
      // ✅ لاگین - اگر لاگین باشی به داشبورد میره
      {
        path: "login",
        element: <PrivateRoute requireAuth={false} redirectTo="/dashboard" />,
        children: [
          {
            index: true,
            element: (
              <PageTransition>
                <Login />
              </PageTransition>
            ),
          },
        ],
      },
      // ✅ تایید OTP - همیشه قابل دسترس (برای تکمیل ثبت‌نام)
      {
        path: "verify-otp",
        element: (
          <PageTransition>
            <VerifyOtp />
          </PageTransition>
        ),
      },
      // ✅ آپلود موفق - نیاز به لاگین
      {
        path: "upload-success",
        element: <PrivateRoute requireAuth={true} />,
        children: [
          {
            index: true,
            element: (
              <PageTransition>
                <UploadSuccess />
              </PageTransition>
            ),
          },
        ],
      },
      // ✅ داشبورد - نیاز به لاگین
      {
        path: "dashboard",
        element: <PrivateRoute requireAuth={true} />,
        children: [
          {
            index: true,
            element: (
              <PageTransition>
                <Dashboard />
              </PageTransition>
            ),
          },
        ],
      },
      // ✅ ۴۰۴
      {
        path: "*",
        element: (
          <PageTransition>
            <NotFound />
          </PageTransition>
        ),
      },
    ],
  },
]);

export default router;
