// components/Sidebar.jsx
import React from "react";

// Recebe a função onNavigate (handleSwitch do App.jsx)
export default function Sidebar({ onNavigate, currentPage }) {
  // Lista dos destinos essenciais para um Yearbook
  const destinations = [
    { name: "My Profile", page: "profile", icon: "👤" },
    { name: "Yearbook Search", page: "yearbook", icon: "🔍" },
    { name: "Friends List", page: "friends", icon: "👥" }, // Novo item: Lista de amigos
    { name: "Settings", page: "settings", icon: "⚙️" }, // Novo item: Configurações
  ];

  return (
    <div className="app-sidebar">
      <h1 className="sidebar-logo">Yearbook Hub</h1>

      <nav className="sidebar-nav">
        {destinations.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            // Usa a prop currentPage para destacar o link ativo
            className={`sidebar-btn ${
              currentPage === item.page ? "active" : ""
            }`}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => onNavigate("login")} className="logout-btn">
          ➡️ Logout
        </button>
      </div>
    </div>
  );
}
