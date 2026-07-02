// src/components/common/Tabs.jsx
export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="steps">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`step ${activeTab === tab.key ? "active" : ""}`}
          onClick={() => onChange(tab.key)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
