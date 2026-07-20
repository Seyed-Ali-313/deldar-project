// src/pages/dashboard/Dashboard.jsx
import { useState, useEffect, useCallback } from "react";
import Tabs from "../../components/common/Tabs";
import PersonalInfo from "./PersonalInfo";
import SubmittedWorks from "./SubmittedWorks";
import SubmitWorks from "./SubmitWorks";
import { getWorks } from "../../services/dashboardService";
import { showError } from "../../utils/errorHandler";

const TABS = [
  { key: "edit", label: "ویرایش اطلاعات" },
  { key: "submitted", label: "آثار ارسال شده" },
  { key: "add", label: "اضافه کردن اثر جدید" },
];

function sortWorksByDate(works) {
  return [...works].sort((a, b) => {
    const dateA = new Date(
      a.created_at || a.createdAt || a.date_created || a.uploaded_at || a.created || a.date || a.timestamp || 0,
    );
    const dateB = new Date(
      b.created_at || b.createdAt || b.date_created || b.uploaded_at || b.created || b.date || b.timestamp || 0,
    );
    return dateB - dateA;
  });
}

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
        setWorks(sortWorksByDate(res.data));
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status !== 401) showError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const handleWorksChange = (updater) => {
    setWorks((prev) => sortWorksByDate(updater(prev)));
  };

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
            onWorksChange={handleWorksChange}
          />
        )}
        {activeTab === "add" && (
          <SubmitWorks
            existingWorks={works}
            totalCount={totalCount}
            maxWorks={MAX_WORKS}
            onWorksChange={handleWorksChange}
          />
        )}
      </div>
    </div>
  );
}
