import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import Login from "./components/Login";
import Register from "./components/Register";
import GetStarted from "./components/GetStarted";

import Yearbook from "./components/Yearbook";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
// Importe Friends e Settings quando os criar

import "./styles/main.css";

function App() {
  const [page, setPage] = useState("login");

  const handleSwitch = (target) => setPage(target);
  const handleLogin = () => setPage("getstarted");
  const handleRegister = () => setPage("getstarted");
  const handleFinish = () => setPage("yearbook");

  // 🛑 AJUSTE CRUCIAL: A Sidebar só aparece se a página NÃO for login, register OU getstarted.
  // Ou seja, a Sidebar aparece a partir do estado 'yearbook' (após a conclusão do perfil).
  const isApplicationLayout =
    page !== "login" && page !== "register" && page !== "getstarted";

  // 🛑 Lógica de Renderização Condicional
  if (!isApplicationLayout) {
    // ----------------------------------------------------------------------
    // LAYOUT DE AUTENTICAÇÃO / ONBOARDING (LOGIN, REGISTER, GETSTARTED)
    // ----------------------------------------------------------------------
    return (
      // O app-wrapper original, ocupa 100% do ecrã.
      <div className="app-wrapper">
        {page === "login" && (
          <Login onSwitch={handleSwitch} onLogin={handleLogin} />
        )}
        {page === "register" && (
          <Register onSwitch={handleSwitch} onRegister={handleRegister} />
        )}
        {/* O GetStarted fica aqui, sem a Sidebar */}
        {page === "getstarted" && <GetStarted onFinish={handleFinish} />}
      </div>
    );
  }

  // ----------------------------------------------------
  // LAYOUT DE APLICAÇÃO: COM SIDEBAR & CONTEÚDO
  // ----------------------------------------------------
  return (
    // Usa a classe 'sidebar-layout' para aplicar o layout Flexbox
    <div className="app-wrapper sidebar-layout">
      {/* 1. Sidebar Fixo (Só é renderizado aqui) */}
      <Sidebar onNavigate={handleSwitch} currentPage={page} />

      {/* 2. Área de Conteúdo */}
      <div className="content-area">
        {/* Páginas Principais (Navegadas pela Sidebar) */}
        {page === "yearbook" && <Yearbook />}
        {page === "profile" && <Profile />}
        {/* Adicione aqui Friends e Settings quando existirem */}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
