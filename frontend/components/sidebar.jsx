import React, { useState } from "react";

export default function Sidebar({ onNavigate, currentPage }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const destinations = [
    { name: "My Profile", page: "profile", icon: "👤" },
    { name: "Yearbook Search", page: "yearbook", icon: "🔍" },
    { name: "Friends List", page: "friends", icon: "👥" },
    { name: "Settings", page: "settings", icon: "⚙️" },
  ];

  return (
    <div className={`app-sidebar ${isExpanded ? "" : "collapsed"}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">Yearbook Hub</h1>

        <button
          className="hamburger-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "Recolher Sidebar" : "Expandir Sidebar"}
        >
          {isExpanded ? "☰" : "☰"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {destinations.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`sidebar-btn ${
              currentPage === item.page ? "active" : ""
            }`}
          >
            <span className="icon">{item.icon}</span>
            {isExpanded && <span className="label">{item.name}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => onNavigate("login")} className="logout-btn">
          <span className="icon">➡️</span>
          {isExpanded && <span className="label">Logout</span>}
        </button>
      </div>
    </div>
  );
}
