import { createContext, useState, useEffect, useRef } from "react";

const STORAGE_KEY = "deldar_register_data";

const defaultData = {
  personal: {
    first_name: "",
    last_name: "",
    job: "",
    birth_date: "",
    national_code: "",
    mobile: "",
  },
  additional: {
    province: "",
    city: "",
    address: "",
    postal_code: "",
    bale_id: "",
    telegram_id: "",
  },
  works: [], // { id, description, preview(base64), fileName, fileType }
  activeTab: "personal",
  completed: { personal: false, additional: false },
};

export const RegisterDataContext = createContext(null);

function loadFromStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    return {
      ...defaultData,
      ...parsed,
      personal: { ...defaultData.personal, ...parsed.personal },
      additional: { ...defaultData.additional, ...parsed.additional },
      completed: { ...defaultData.completed, ...parsed.completed },
    };
  } catch {
    return defaultData;
  }
}

export function RegisterDataProvider({ children }) {
  const [data, setData] = useState(loadFromStorage);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("خطا در ذخیره sessionStorage", e);
    }
  }, [data]);

  const updatePersonal = (values) => {
    setData((prev) => ({ ...prev, personal: { ...prev.personal, ...values } }));
  };

  const updateAdditional = (values) => {
    setData((prev) => ({
      ...prev,
      additional: { ...prev.additional, ...values },
    }));
  };

  const setWorks = (works) => {
    setData((prev) => ({ ...prev, works }));
  };

  const setActiveTab = (activeTab) => {
    setData((prev) => ({ ...prev, activeTab }));
  };

  const setCompleted = (completed) => {
    setData((prev) => ({
      ...prev,
      completed: { ...prev.completed, ...completed },
    }));
  };

  const clearAll = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setData(defaultData);
  };

  return (
    <RegisterDataContext.Provider
      value={{
        data,
        updatePersonal,
        updateAdditional,
        setWorks,
        setActiveTab,
        setCompleted,
        clearAll,
      }}
    >
      {children}
    </RegisterDataContext.Provider>
  );
}
