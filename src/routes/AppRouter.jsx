// src/routes/AppRouter.jsx — نسخه اصلاح‌شده
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Rules from "../pages/Rules";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Announcement from "../pages/Announcement";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import VerifyOtp from "../pages/auth/VerifyOtp";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import UploadSuccess from "../pages/dashboard/UploadSuccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "rules", element: <Rules /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "announcement", element: <Announcement /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "verify-otp", element: <VerifyOtp /> },
      {
        path: "dashboard",
        element: <PrivateRoute />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "upload-success", element: <UploadSuccess /> },
        ],
      },
    ],
  },
]);

export default router;
