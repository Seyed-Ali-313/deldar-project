import poem from "../../assets/images/poem.svg";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Tabs from "../../components/common/Tabs";
import PersonalInfoForm from "../../components/register/PersonalInfoForm";
import AdditionalInfoForm from "../../components/register/AdditionalInfoForm";
import WorksForm from "../../components/register/WorksForm";
import { uploadWork } from "../../services/onboardingService";
import useRegisterData from "../../hooks/useRegisterData";

const TABS = [
  { key: "personal", label: "اطلاعات شخصی" },
  { key: "additional", label: "اطلاعات تکمیلی" },
  { key: "works", label: "ارسال آثار" },
];

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.3, ease: "easeIn" } },
};

export default function Register() {
  const navigate = useNavigate();
  const { data, setActiveTab, setCompleted } = useRegisterData();
  const { activeTab, completed } = data;

  const disabledTabs = TABS.filter((tab) => {
    if (tab.key === "personal") return false;
    if (tab.key === "additional") return !completed.personal;
    if (tab.key === "works") return !completed.additional;
    return false;
  }).map((tab) => tab.key);

  return (
    <div className="page">
      <div
        style={{
          maxWidth: 785,
          margin: "0 auto",
          textAlign: "center",
          padding: "20px 16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {activeTab !== "works" && (
          <div className="logo-stack-small">
            <img src={poem} alt="" className="logo-pm" />
          </div>
        )}

        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          disabledTabs={disabledTabs}
        />

        <div style={{ marginTop: 24, position: "relative", minHeight: 420 }}>
          <AnimatePresence mode="wait">
            {activeTab === "personal" && (
              <motion.div
                key="personal"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <PersonalInfoForm
                  onSuccess={() => {
                    setCompleted({ personal: true });
                    // اگه مرحله بعدی قبلاً کامل شده بود (مثلاً برگشته برای اصلاح شماره)، مستقیم برو works
                    setActiveTab(completed.additional ? "works" : "additional");
                  }}
                />
              </motion.div>
            )}

            {activeTab === "additional" && (
              <motion.div
                key="additional"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <AdditionalInfoForm
                  onSuccess={() => {
                    setCompleted({ additional: true });
                    setActiveTab("works");
                  }}
                />
              </motion.div>
            )}

            {activeTab === "works" && (
              <motion.div
                key="works"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <WorksForm
                  uploadFn={uploadWork}
                  onSuccess={() => navigate("/verify-otp")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
