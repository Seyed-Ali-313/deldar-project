// src/pages/dashboard/Dashboard.jsx
import { useState } from "react";
import Tabs from "../../components/common/Tabs";
import PersonalInfo from "./PersonalInfo";
import SubmittedWorks from "./SubmittedWorks";
import SubmitWorks from "./SubmitWorks";

const TABS = [
  { key: "edit", label: "ویرایش اطلاعات" },
  { key: "submitted", label: "آثار ارسال شده" },
  { key: "add", label: "اضافه کردن اثر جدید" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("edit");

  return (
    <div className="page" style={{ padding: "40px 16px" }}>
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div style={{ marginTop: 40 }}>
        {activeTab === "edit" && <PersonalInfo />}
        {activeTab === "submitted" && <SubmittedWorks />}
        {activeTab === "add" && <SubmitWorks />}
      </div>
    </div>
  );
}
