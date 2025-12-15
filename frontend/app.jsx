import React, { useState } from "react";
import ReactDOM from "react-dom/client";

// Importações de Layout de Autenticação / Onboarding
import Login from "./components/Login";
import Register from "./components/Register";
import GetStarted from "./components/GetStarted";

// Importações do Layout da Aplicação (Com Sidebar)
import Yearbook from "./components/Yearbook";
import Sidebar from "./components/sidebar";
import Profile from "./components/profile";
import FriendsList from "./components/friendslist";
import Settings from "./components/settings";

import "./styles/main.css";

function App() {
  const [page, setPage] = useState("login");
  // 🛑 NOVO ESTADO: Para guardar o objeto do utilizador (que contém o _id)
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleSwitch = (target) => setPage(target);

  // 🛑 HANDLE REGISTO: Recebe o objeto do utilizador, guarda-o e navega
  const handleRegisterSuccess = (userData) => {
    setLoggedInUser(userData); // { _id: '...', username: '...' }
    setPage("getstarted");
  };

  // 🛑 HANDLE LOGIN: (Usaremos esta função mais tarde)
  const handleLoginSuccess = (userData) => {
    setLoggedInUser(userData);
    setPage("getstarted"); // Assume que após o login, ele continua no onboarding se não estiver completo
  };

  const handleFinish = () => setPage("yearbook");

  // Define se estamos num layout com a Sidebar ou num layout de ecrã inteiro.
  const isApplicationLayout =
    page !== "login" && page !== "register" && page !== "getstarted";

  // 🛑 Lógica de Renderização Condicional
  if (!isApplicationLayout) {
    // ----------------------------------------------------------------------
    // LAYOUT DE AUTENTICAÇÃO / ONBOARDING (LOGIN, REGISTER, GETSTARTED)
    // ----------------------------------------------------------------------
    return (
      <div className="app-wrapper">
        {page === "login" && (
          // 🛑 Passa o novo handler de login (quando tiver a rota de login pronta)
          <Login onSwitch={handleSwitch} onLoginSuccess={handleLoginSuccess} />
        )}
        {page === "register" && (
          // 🛑 Passa o novo handler que armazena o ID
          <Register
            onSwitch={handleSwitch}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
        {/* O GetStarted fica aqui, sem a Sidebar */}
        {page === "getstarted" && (
          // 🛑 AQUI: Passamos o ID para o GetStarted
          <GetStarted
            userId={loggedInUser ? loggedInUser._id : null}
            onFinish={handleFinish}
          />
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // LAYOUT DE APLICAÇÃO: COM SIDEBAR & CONTEÚDO
  // ----------------------------------------------------
  return (
    // Usa a classe 'sidebar-layout' para aplicar o layout Flexbox
    <div className="app-wrapper sidebar-layout">
      {/* 1. Sidebar Fixo */}
      {/* 🛑 Passar o ID e o username para o sidebar se necessário */}
      <Sidebar
        onNavigate={handleSwitch}
        currentPage={page}
        user={loggedInUser}
      />

      {/* 2. Área de Conteúdo */}
      <div className="content-area">
        {/* Páginas Principais (Navegadas pela Sidebar) */}
        {/* 🛑 Passar o ID e outros dados para as páginas da aplicação */}
        {page === "yearbook" && <Yearbook userId={loggedInUser?._id} />}
        {page === "profile" && <Profile userId={loggedInUser?._id} />}
        {page === "friends" && <FriendsList userId={loggedInUser?._id} />}
        {page === "settings" && <Settings userId={loggedInUser?._id} />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
