import React, { useState } from "react";
import Tabs from "./Tabs.jsx";

const Yearbook = () => {
  const [achievements, setAchievements] = useState([]);

  const addAchievement = (title, desc) => {
    setAchievements([...achievements, { title, desc }]);
  };

  return (
    <div className="getstarted-main">
      <div className="top-bar">My Yearbook</div>
      <Tabs achievements={achievements} addAchievement={addAchievement} />
    </div>
  );
};

export default Yearbook;
