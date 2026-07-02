// src/pages/auth/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "../../components/common/Tabs";
import AdditionalInfoForm from "../../components/register/AdditionalInfoForm";
import PersonalInfoForm from "../../components/register/PersonalInfoForm";
import WorksForm from "../../components/register/WorksForm";
import { uploadWork } from "../../services/onboardingService";

const TABS = [
  { key: "personal", label: "اطلاعات شخصی" },
  { key: "additional", label: "اطلاعات تکمیلی" },
  { key: "works", label: "ارسال آثار" },
];

export default function Register() {
  const [activeTab, setActiveTab] = useState("personal");
  const navigate = useNavigate();

  return (
    <div className="page">
      <div
        style={{
          maxWidth: 1200,
          margin: "29px auto",
          textAlign: "center",
          padding: "20px 16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          overflow: "hidden",
          gap: "13px",
        }}
      >
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        <div style={{ marginTop: 40 }}>
          {activeTab === "personal" && (
            <PersonalInfoForm onSuccess={() => setActiveTab("additional")} />
          )}
          {activeTab === "additional" && (
            <AdditionalInfoForm onSuccess={() => setActiveTab("works")} />
          )}
          {activeTab === "works" && (
            <WorksForm
              uploadFn={uploadWork}
              onSuccess={() => navigate("/verify-otp")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
