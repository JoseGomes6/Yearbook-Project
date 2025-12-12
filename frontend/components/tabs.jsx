import React, { useState } from "react";
import Achievements from "./Achievements.jsx";

const Tabs = ({ achievements, addAchievement }) => {
  const [tab, setTab] = useState("personal");

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
        {["personal", "class", "quote", "address"].map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {tab === "personal" && <div>Personal Information Fields</div>}
        {tab === "class" && <div>Class/Year Fields</div>}
        {tab === "quote" && <div>Quote Fields</div>}
        {tab === "address" && <div>Address Fields</div>}
        {tab === "quote" && (
          <Achievements
            achievements={achievements}
            addAchievement={addAchievement}
          />
        )}
      </div>
    </div>
  );
};

export default Tabs;
