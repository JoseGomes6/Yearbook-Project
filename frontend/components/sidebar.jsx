import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/main.css";
import profileIcon from "./assets/profile.png";
import searchIcon from "./assets/search.png";
import friendsIcon from "./assets/check.png";
import settingsIcon from "./assets/settings.png";

export default function Sidebar({ onLogout }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Lógica de Atividade para o Yearbook Search:
   * Fica ativo se:
   * 1. A rota for exatamente "/yearbook"
   * 2. A rota começar com "/profile/" E tiver um ID à frente (ex: /profile/6765...)
   */
  const isSearchActive = () => {
    const path = location.pathname;
    if (path === "/yearbook") return true;

    // Se o path contém um ID (ex: /profile/123), consideramos parte da busca
    // O seu próprio perfil é apenas "/profile" (sem ID no final)
    if (path.startsWith("/profile/") && path !== "/profile") {
      return true;
    }
    return false;
  };

  const destinations = [
    {
      name: "My Profile",
      path: "/profile",
      icon: profileIcon, // Agora passas a referência da imagem
      isActive: location.pathname === "/profile",
    },
    {
      name: "Yearbook Search",
      path: "/yearbook",
      icon: searchIcon,
      isActive: isSearchActive(),
    },
    {
      name: "Friends List",
      path: "/friends",
      icon: friendsIcon,
      isActive: location.pathname === "/friends",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: settingsIcon,
      isActive: location.pathname === "/settings",
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
