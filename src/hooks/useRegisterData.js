import { useContext } from "react";
import { RegisterDataContext } from "../context/RegisterDataContext";

export default function useRegisterData() {
  const context = useContext(RegisterDataContext);
  if (!context) {
    throw new Error(
      "useRegisterData باید داخل RegisterDataProvider استفاده شود",
    );
  }
  return context;
}
