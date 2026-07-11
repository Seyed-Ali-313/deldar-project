// src/pages/dashboard/Dashboard.jsx
import { useState, useEffect, useCallback } from "react";
import Tabs from "../../components/common/Tabs";
import PersonalInfo from "./PersonalInfo";
import SubmittedWorks from "./SubmittedWorks";
import SubmitWorks from "./SubmitWorks";
import { getWorks } from "../../services/dashboardService";

const TABS = [
  { key: "edit", label: "ویرایش اطلاعات" },
  { key: "submitted", label: "آثار ارسال شده" },
  { key: "add", label: "اضافه کردن اثر جدید" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("edit");
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorks = useCallback(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    getWorks()
      .then((res) => {
        setWorks(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const totalCount = works.length;
  const MAX_WORKS = 50;

  return (
    <div className="page" style={{ padding: "40px 16px" }}>
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div style={{ marginTop: 40 }}>
        {activeTab === "edit" && <PersonalInfo />}
        {activeTab === "submitted" && (
          <SubmittedWorks
            works={works}
            loading={loading}
            totalCount={totalCount}
            maxWorks={MAX_WORKS}
            onWorksChange={setWorks}
          />
        )}
        {activeTab === "add" && (
          <SubmitWorks
            existingWorks={works}
            totalCount={totalCount}
            maxWorks={MAX_WORKS}
            onWorksChange={setWorks}
          />
        )}
      </div>
    </div>
  );
}
