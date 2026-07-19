// src/pages/auth/Register.jsx
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
    <div
      className="page"
      style={{
        padding: "20px 16px",
      }}
    >
      <div
        className={activeTab === "works" ? "register-works-wrapper" : ""}
        style={{
          maxWidth: 785,
          width: "90%",
          margin: "0 auto",
          textAlign: "start",
          padding: "20px 0",
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

      <style>{`
        .register-works-wrapper {
          gap: 15px;
        }

        /* ============================================================ */
        /* ===== ریسپانسیو - فاصله عکس و تب به نسبت ===== */
        /* ============================================================ */

        /* ----- 900px ----- */
        @media (max-width: 900px) {
          .logo-stack-small {
            width: 70% !important;
            margin: 0 auto -460px !important;
            position: relative !important;
            z-index: 2 !important;
            pointer-events: none !important;
          }

          .logo-pm {
            margin-top: 5px !important;
            width: 100% !important;
            position: relative !important;
            transform: none !important;
            left: auto !important;
            pointer-events: none !important;
          }

          [style*="min-height: 420px"] {
            position: relative !important;
            z-index: 4 !important;
          }

          .rmdp-wrapper {
            transform: scale(0.78) !important;
            transform-origin: top center !important;
            max-width: 300px !important;
            margin: 0 auto !important;
            position: relative !important;
            z-index: 4 !important;
          }
        }

        /* ----- 800px ----- */
        @media (max-width: 800px) {
          .logo-stack-small {
            margin: 0 auto -390px !important;
          }
          .logo-pm {
            margin-top: 3px !important;
          }
        }

        /* ----- 700px ----- */
        @media (max-width: 700px) {
          .logo-stack-small {
            margin: 0 auto -345px !important;
          }
          .logo-pm {
            margin-top: 2px !important;
          }
        }

        /* ----- 600px ----- */
        @media (max-width: 600px) {
          .logo-stack-small {
            margin: 0 auto -290px !important;
          }
          .logo-pm {
            margin-top: 1px !important;
          }
        }

        /* ----- 500px ----- */
        @media (max-width: 500px) {
          .logo-stack-small {
            margin: 0 auto -270px !important;
          }
          .logo-pm {
            margin-top: 1px !important;
          }
          .rmdp-wrapper {
            transform: scale(0.72) !important;
            max-width: 280px !important;
          }
        }

        /* ----- 480px ----- */
        @media (max-width: 480px) {
          .logo-stack-small {
            margin: 0 auto -219px !important;
          }
          .logo-pm {
            margin-top: 1px !important;
          }
          .rmdp-wrapper {
            transform: scale(0.68) !important;
            max-width: 260px !important;
          }
        }

        /* ----- 400px ----- */
        @media (max-width: 400px) {
          .logo-stack-small {
            margin: 0 auto -185px !important;
          }
          .logo-pm {
            margin-top: 0px !important;
          }
          .rmdp-wrapper {
            transform: scale(0.62) !important;
            max-width: 240px !important;
          }
        }

        /* ----- 300px ----- */
        @media (max-width: 300px) {
          .logo-stack-small {
            margin: 0 auto -180px !important;
          }
          .logo-pm {
            margin-top: 0px !important;
          }
          .rmdp-wrapper {
            transform: scale(0.50) !important;
            max-width: 180px !important;
          }
        }
      `}</style>
    </div>
  );
}
