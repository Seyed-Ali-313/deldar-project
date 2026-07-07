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
      {
        index: true,
        element: (
          <PageTransition>
            <Home />
          </PageTransition>
        ),
      },
      {
        path: "rules",
        element: (
          <PageTransition>
            <Rules />
          </PageTransition>
        ),
      },
      {
        path: "about",
        element: (
          <PageTransition>
            <About />
          </PageTransition>
        ),
      },
      {
        path: "contact",
        element: (
          <PageTransition>
            <Contact />
          </PageTransition>
        ),
      },
      {
        path: "announcement",
        element: (
          <PageTransition>
            <Announcement />
          </PageTransition>
        ),
      },
      {
        path: "register",
        element: (
          <PageTransition>
            <Register />
          </PageTransition>
        ),
      },
      {
        path: "login",
        element: (
          <PageTransition>
            <Login />
          </PageTransition>
        ),
      },
      {
        path: "verify-otp",
        element: (
          <PageTransition>
            <VerifyOtp />
          </PageTransition>
        ),
      },
      {
        path: "upload-success",
        element: (
          <PageTransition>
            <UploadSuccess />
          </PageTransition>
        ),
      },
      {
        path: "dashboard",
        element: <PrivateRoute />,
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
