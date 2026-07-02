// src/components/common/Tabs.jsx
import { motion } from "framer-motion";

export default function Tabs({ tabs, activeTab, onChange, disabledTabs = [] }) {
  return (
    <div className="steps">
      {tabs.map((tab) => {
        const isDisabled = disabledTabs.includes(tab.key);
        const isActive = activeTab === tab.key;

        return (
          <motion.button
            key={tab.key}
            className={`step ${isActive ? "active" : ""} ${isDisabled ? "disabled" : ""}`}
            onClick={() => !isDisabled && onChange(tab.key)}
            type="button"
            whileHover={!isDisabled ? { scale: 1.02 } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            transition={{ duration: 0.2 }}
            style={{
              background: isActive
                ? "linear-gradient(135deg, #276945, #1a4d33)"
                : isDisabled
                  ? "rgba(0, 36, 3, 0.4)"
                  : "rgba(0, 36, 3, 0.8)",
              color: isActive
                ? "#ffffff"
                : isDisabled
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(255,255,255,0.7)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* انیمیشن فعال شدن */}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, #276945, #1a4d33)",
                  borderRadius: "inherit",
                  zIndex: -1,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
