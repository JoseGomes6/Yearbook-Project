import React, { useState } from "react";
import "../styles/main.css";

export default function Sidebar({ onLogout, navigate, currentPath, user }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isSearchActive = () => {
    if (currentPath === "/yearbook") return true;

    if (
      currentPath.startsWith("/profile/") &&
      currentPath.split("/").length > 2
    ) {
      return true;
    }
    return false;
  };

  const destinations = [
    {
      name: `Hello, ${user.username}`,
      path: "/profile",
      icon: "👤",
      isActive:
        currentPath === "/profile" ||
        (currentPath.startsWith("/profile") &&
          currentPath.split("/").length <= 2),
    },
    {
      name: "Yearbook Search",
      path: "/yearbook",
      icon: "🔍",
      isActive: isSearchActive(),
    },
    {
      name: "Friends List",
      path: "/friends",
      icon: "👥",
      isActive: currentPath === "/friends",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙️",
      isActive: currentPath === "/settings",
    },
  ];

  return (
    <div className={`app-sidebar ${isExpanded ? "" : "collapsed"}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">{isExpanded ? "Yearbook Hub" : "YH"}</h1>

        <button
          className="hamburger-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "Close menu" : "Open menu"}
        >
          {isExpanded ? "✕" : "☰"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {destinations.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`sidebar-btn ${item.isActive ? "active" : ""}`}
          >
            <span className="icon">{item.icon}</span>
            {isExpanded && <span className="label">{item.name}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={() => {
            if (onLogout) onLogout();
            navigate("/login");
          }}
          className="logout-btn"
        >
          <span className="icon">➡️</span>
          {isExpanded && <span className="label">Logout</span>}
        </button>
      </div>
    </div>
  );
}
