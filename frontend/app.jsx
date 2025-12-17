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
  const handleSwitch = (target) => setPage(target);
  const handleRegisterSuccess = (userData) => {
    setLoggedInUser(userData);
    setPage("yearbook");
  };

  const handleLoginSuccess = (userData) => {
    setLoggedInUser(userData);
    setPage("yearbook");
  };

  const handleFinish = () => setPage("yearbook");

  const isApplicationLayout =
    page !== "login" && page !== "register" && page !== "getstarted";

  if (!isApplicationLayout) {
    return (
      <div className="app-wrapper">
        {/* Componentes de Autenticação */}
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

        {/* A imagem agora só aparece se NÃO for getstarted */}
        {page !== "getstarted" && (
          <div className="auth-image-side">
            <img
              src="/BackgroundPhoto.jpg"
              alt="Yearbook Background"
              className="auth-bg-image"
            />
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // LAYOUT DE APLICAÇÃO: COM SIDEBAR & CONTEÚDO
  // ----------------------------------------------------
  return (
    <div className="app-wrapper sidebar-layout">
      <Sidebar
        onNavigate={handleSwitch}
        currentPage={page}
        user={loggedInUser}
      />

      <div className="content-area">
        {page === "yearbook" && <Yearbook userId={loggedInUser?._id} />}
        {page === "profile" && <Profile userId={loggedInUser?._id} />}
        {page === "friends" && <FriendsList userId={loggedInUser?._id} />}
        {page === "settings" && <Settings userId={loggedInUser?._id} />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
