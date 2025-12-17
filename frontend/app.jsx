import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Login from "./components/Login";
import Register from "./components/Register";
import GetStarted from "./components/GetStarted";
import Yearbook from "./components/Yearbook";
import Sidebar from "./components/sidebar";
import Profile from "./components/profile";
import FriendsList from "./components/friendslist";
import Settings from "./components/settings";
import "./styles/main.css";

function App() {
  const [page, setPage] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(null);

  // 1. ADICIONADO: Estado para saber qual perfil estamos a visitar
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  const handleSwitch = (target) => {
    // Se mudarmos para qualquer página que não seja perfil, limpamos o ID selecionado
    if (target !== "profile") setSelectedProfileId(null);
    setPage(target);
  };

  const handleRegisterSuccess = (userData) => {
    setLoggedInUser(userData);
    setPage("getstarted");
  };

  const handleLoginSuccess = (userData) => {
    setLoggedInUser(userData);
    setPage("yearbook");
  };

  // 2. ADICIONADO: Função que o Yearbook vai chamar ao clicar num card
  const handleViewProfile = (id) => {
    setSelectedProfileId(id);
    setPage("profile");
  };

  const handleFinish = () => setPage("yearbook");

  const isAuthPage =
    page === "login" || page === "register" || page === "getstarted";

  // LAYOUT DE AUTENTICAÇÃO (Login, Register, GetStarted)
  if (isAuthPage) {
    return (
      <div className="app-wrapper">
        {page === "login" && (
          <Login onSwitch={handleSwitch} onLoginSuccess={handleLoginSuccess} />
        )}
        {page === "register" && (
          <Register
            onSwitch={handleSwitch}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
        {page === "getstarted" && (
          <GetStarted
            userId={loggedInUser ? loggedInUser._id : null}
            onFinish={handleFinish}
          />
        )}

        {page !== "getstarted" && (
          <div className="auth-image-side">
            <img
              src="/BackgroundPhoto.jpg"
              alt="Background"
              className="auth-bg-image"
            />
          </div>
        )}
      </div>
    );
  }

  // 3. LAYOUT DE APLICAÇÃO (Sidebar + Conteúdo Dinâmico)
  return (
    <div className="app-wrapper sidebar-layout">
      <Sidebar
        onNavigate={handleSwitch}
        currentPage={page}
        user={loggedInUser}
      />

      <div className="content-area">
        {page === "yearbook" && (
          <Yearbook
            userId={loggedInUser?._id}
            onViewProfile={handleViewProfile}
            loggedInUser={loggedInUser}
          />
        )}

        {page === "profile" && (
          <Profile
            // Se houver um ID selecionado no Yearbook, mostra esse.
            // Se for null (clique na sidebar), mostra o do loggedInUser.
            userId={selectedProfileId || loggedInUser?._id}
          />
        )}

        {page === "friends" && <FriendsList userId={loggedInUser?._id} />}
        {page === "settings" && <Settings userId={loggedInUser?._id} />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
