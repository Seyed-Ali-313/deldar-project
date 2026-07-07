// src/main.jsx
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/style.css";
import { AuthProvider } from "./context/AuthContext";
import { RegisterDataProvider } from "./context/RegisterDataContext";
import router from "./routes/AppRouter";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RegisterDataProvider>
      <RouterProvider router={router} />
    </RegisterDataProvider>
  </AuthProvider>,
);
